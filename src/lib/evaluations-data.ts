import { Prisma } from '@prisma/client';
import { calculateCompliance } from '@/core/compliance-calculator';
import { getRolePermissions } from '@/core/rbac';
import type { ResponseValue } from '@/core/types';
import { getPrismaClient, prisma } from '@/lib/prisma';
import type { SessionUser } from '@/services/auth.service';

export const MAX_EVIDENCE_BYTES = 1024 * 1024;

export class EvaluationError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

export interface SaveResponseInput {
  evaluationId: string;
  itemId: string;
  value: ResponseValue;
  observations?: string;
  assignedRole?: string;
  evidence?: {
    type: 'FILE' | 'LINK';
    title: string;
    urlOrPath: string;
  };
}

function visibleEvaluations(user: SessionUser): Prisma.EvaluationWhereInput {
  return user.role === 'EVALUATOR' ? { evaluatorId: user.id } : {};
}

function activeSections<T extends { code: string; items: Array<{ id: string }> }>(
  standardCode: string, sections: T[], answeredIds: Set<string>
) {
  if (standardCode !== '29110-5-1-2' || !sections.some((section) => section.code === 'GP.1')) return sections;

  const legacy = sections.filter((section) => section.code === 'GP' || section.code === 'IS');
  if (legacy.some((section) => section.items.some((item) => answeredIds.has(item.id)))) return legacy;
  return sections.filter((section) => section.code !== 'GP' && section.code !== 'IS');
}

export class EvaluationData {
  static getUser(id: string): Promise<SessionUser | null> {
    const client = getPrismaClient();
    if (!client) return Promise.resolve(null);

    return client.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true },
    });
  }

  static list(user: SessionUser, standardCode?: string) {
    return prisma.evaluation.findMany({
      where: { ...visibleEvaluations(user), standard: standardCode ? { code: standardCode } : undefined },
      orderBy: [{ evaluationDate: 'desc' }, { id: 'asc' }],
      select: {
        id: true,
        evaluationDate: true,
        standard: { select: { code: true, shortTitle: true } },
        organization: { select: { id: true, name: true, targetProfile: true } },
      },
    });
  }

  static async get(user: SessionUser, id: string) {
    const evaluation = await prisma.evaluation.findFirst({
      where: { id, ...visibleEvaluations(user) },
      include: {
        organization: true,
        standard: {
          include: {
            sections: {
              orderBy: [{ orderIndex: 'asc' }, { code: 'asc' }],
              include: { items: { orderBy: [{ orderIndex: 'asc' }, { code: 'asc' }] } },
            },
          },
        },
        responses: {
          include: { evidences: { select: { id: true, title: true, type: true } } },
        },
      },
    });
    if (!evaluation) return null;
    evaluation.standard.sections = activeSections(
      evaluation.standard.code, evaluation.standard.sections, new Set(evaluation.responses.map((response) => response.itemId))
    );
    return evaluation;
  }

  static async getOptions() {
    const [standards, organizations] = await Promise.all([
      prisma.standard.findMany({
        orderBy: { code: 'asc' },
        select: { code: true, shortTitle: true },
      }),
      prisma.organization.findMany({
        orderBy: { name: 'asc' },
        select: { id: true, name: true },
      }),
    ]);
    return { standards, organizations };
  }

  static async create(user: SessionUser, standardCode: string, organization: string | {
    name: string;
    teamSize: number;
    targetProfile: string;
  }) {
    if (!getRolePermissions(user.role).canEditEvaluations) {
      throw new EvaluationError('Tu rol es de solo lectura.', 403);
    }

    const standard = await prisma.standard.findUnique({
      where: { code: standardCode },
      select: { id: true },
    });
    if (!standard) throw new EvaluationError('La norma no está disponible para evaluar.', 404);

    return prisma.evaluation.create({
      data: {
        standard: { connect: { id: standard.id } },
        evaluator: { connect: { id: user.id } },
        organization: typeof organization === 'string'
          ? { connect: { id: organization } }
          : { create: organization },
      },
      select: { id: true },
    });
  }

  static async saveItemResponse(user: SessionUser, input: SaveResponseInput) {
    if (!getRolePermissions(user.role).canEditEvaluations) {
      throw new EvaluationError('Tu rol es de solo lectura.', 403);
    }

    for (let attempt = 0; ; attempt++) {
      try {
        return await prisma.$transaction(async (tx) => {
          const evaluation = await tx.evaluation.findFirst({
            where: { id: input.evaluationId, ...visibleEvaluations(user) },
            select: {
              responses: { select: { itemId: true, value: true } },
              standard: {
                select: { code: true, sections: { select: { code: true, items: { select: { id: true } } } } },
              },
            },
          });
          if (!evaluation) throw new EvaluationError('Evaluación no disponible.', 404);

          const { code, sections } = evaluation.standard;
          const saved = new Map(evaluation.responses.map((response) => [response.itemId, response.value]));
          const itemIds = new Set(activeSections(code, sections, new Set(saved.keys())).flatMap((section) => section.items.map((item) => item.id)));
          if (!itemIds.has(input.itemId)) {
            throw new EvaluationError('El ítem no corresponde a esta evaluación.', 404);
          }

          const fields = {
            value: input.value,
            observations: input.observations,
            assignedRole: input.assignedRole,
            evaluationDate: new Date(),
          };
          const response = await tx.evaluationResponse.upsert({
            where: {
              evaluationId_itemId: { evaluationId: input.evaluationId, itemId: input.itemId },
            },
            update: fields,
            create: { evaluationId: input.evaluationId, itemId: input.itemId, ...fields },
          });
          if (input.evidence) {
            await tx.evidence.create({ data: { responseId: response.id, ...input.evidence } });
          }

          saved.set(input.itemId, response.value);
          const responses = Array.from(saved).flatMap(([id, value]) => itemIds.has(id) ? [{ value }] : []);
          const result = calculateCompliance(responses, itemIds.size);
          await tx.evaluation.update({
            where: { id: input.evaluationId },
            data: { compliancePercentage: result.percentage, status: result.status },
          });
          return { value: response.value };
        }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      } catch (error) {
        if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2034' || attempt >= 3) {
          throw error;
        }
      }
    }
  }

  static getEvidence(user: SessionUser, id: string) {
    return prisma.evidence.findFirst({
      where: {
        id,
        response: {
          evaluation: visibleEvaluations(user),
        },
      },
      select: { type: true, urlOrPath: true, title: true },
    });
  }
}
