import { prisma } from '@/lib/prisma';
import { calculateCompliance } from '@/core/compliance-calculator';
import { ResponseValue } from '@/core/types';

export interface SaveResponseInput {
  evaluationId: string;
  itemId: string;
  value: ResponseValue;
  observations?: string;
  assignedRole?: string;
}

export class EvaluationService {
  /**
   * Guarda o actualiza la respuesta a un ítem de verificación
   * y recalcula automáticamente el cumplimiento de la evaluación.
   */
  static async saveItemResponse(input: SaveResponseInput) {
    // 1. Guardar o actualizar la respuesta
    const response = await prisma.evaluationResponse.upsert({
      where: {
        evaluationId_itemId: {
          evaluationId: input.evaluationId,
          itemId: input.itemId,
        },
      },
      update: {
        value: input.value,
        observations: input.observations,
        assignedRole: input.assignedRole,
        evaluationDate: new Date(),
      },
      create: {
        evaluationId: input.evaluationId,
        itemId: input.itemId,
        value: input.value,
        observations: input.observations,
        assignedRole: input.assignedRole,
      },
    });

    // 2. Obtener todas las respuestas vigentes de la evaluación
    const allResponses = await prisma.evaluationResponse.findMany({
      where: { evaluationId: input.evaluationId },
    });

    // 3. Obtener el total de ítems de la norma evaluada
    const evaluation = await prisma.evaluation.findUnique({
      where: { id: input.evaluationId },
      include: {
        standard: {
          include: {
            sections: {
              include: { items: true },
            },
          },
        },
      },
    });

    if (evaluation) {
      const totalItems = evaluation.standard.sections.reduce(
        (acc, sec) => acc + sec.items.length,
        0
      );

      // 4. Calcular con la fórmula matemática oficial
      const result = calculateCompliance(
        allResponses.map((r) => ({ value: r.value as ResponseValue })),
        totalItems
      );

      // 5. Actualizar el porcentaje y estado en la BD
      await prisma.evaluation.update({
        where: { id: input.evaluationId },
        data: {
          compliancePercentage: result.percentage,
          status: result.status,
        },
      });
    }

    return response;
  }
}
