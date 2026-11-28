import { z } from 'zod';
import { EvaluationError, EvaluationData, MAX_EVIDENCE_BYTES, getEvaluationUser } from '@/services/evaluation.service';

const createEvaluation = z.object({
  standardCode: z.string().min(1).max(80),
  organization: z.union([
    z.string().min(1).max(120),
    z.object({
      name: z.string().trim().min(1).max(160),
      teamSize: z.number().int().min(1).max(25),
      targetProfile: z.string().trim().min(1).max(80),
    }),
  ]),
});

const saveResponse = z.object({
  evaluationId: z.string().min(1).max(120),
  itemId: z.string().min(1).max(120),
  value: z.enum(['C', 'P', 'NC', 'NA']),
  observations: z.string().trim().max(2000).optional(),
  assignedRole: z.string().trim().max(120).optional(),
  evidenceUrl: z.string().trim().max(2048).url().regex(/^https?:\/\//i).optional(),
});

export async function POST(request: Request) {
  try {
    const origin = request.headers.get('origin');
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
    if (!origin || new URL(origin).host !== host) {
      return Response.json({ error: 'Origen de solicitud no permitido.' }, { status: 403 });
    }
    const user = await getEvaluationUser();
    if (!user) throw new EvaluationError('Inicia sesión para modificar una evaluación.', 401);

    const contentType = request.headers.get('content-type') || '';
    if (contentType.startsWith('application/json')) {
      const { standardCode, organization } = createEvaluation.parse(await request.json());
      return Response.json(await EvaluationData.create(user, standardCode, organization), { status: 201 });
    }

    if (Number(request.headers.get('content-length')) > MAX_EVIDENCE_BYTES + 16384) {
      throw new EvaluationError('El archivo debe pesar 1 MB o menos.', 413);
    }

    const form = await request.formData();
    const { evidenceUrl, ...input } = saveResponse.parse({
      evaluationId: form.get('evaluationId'),
      itemId: form.get('itemId'),
      value: form.get('value'),
      observations: form.get('observations') ?? undefined,
      assignedRole: form.get('assignedRole') ?? undefined,
      evidenceUrl: form.get('evidenceUrl') || undefined,
    });
    const upload = form.get('evidenceFile');
    const file = upload && typeof upload !== 'string' && upload.size > 0 ? upload : null;
    if (file && evidenceUrl) throw new EvaluationError('Adjunta un archivo o un enlace por vez.', 400);
    if (file && file.size > MAX_EVIDENCE_BYTES) {
      throw new EvaluationError('El archivo debe pesar 1 MB o menos.', 413);
    }

    const evidence = file
      ? { type: 'FILE' as const, title: file.name.slice(0, 255), urlOrPath: `base64:${Buffer.from(await file.arrayBuffer()).toString('base64')}` }
      : evidenceUrl ? { type: 'LINK' as const, title: evidenceUrl, urlOrPath: evidenceUrl } : undefined;

    return Response.json(await EvaluationData.saveItemResponse(user, { ...input, evidence }));
  } catch (error) {
    if (error instanceof EvaluationError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof z.ZodError || error instanceof SyntaxError || error instanceof TypeError) {
      return Response.json({ error: 'Revisa los campos. Los enlaces deben empezar con http:// o https://.' }, { status: 400 });
    }
    return Response.json({ error: 'No se guardaron los cambios. Inténtalo de nuevo.' }, { status: 500 });
  }
}
