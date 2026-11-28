import { EvaluationData, getEvaluationUser } from '@/services/evaluation.service';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const user = await getEvaluationUser();
  if (!user) return new Response('Inicia sesión para consultar la evidencia.', { status: 401 });

  const evidence = await EvaluationData.getEvidence(user, params.id);
  if (!evidence) return new Response('Evidencia no disponible.', { status: 404 });

  const cacheControl = 'private, no-store';
  if (/^https?:\/\//i.test(evidence.urlOrPath)) {
    return new Response(null, { status: 302, headers: { Location: evidence.urlOrPath, 'Cache-Control': cacheControl } });
  }
  if (evidence.type !== 'FILE' || !evidence.urlOrPath.startsWith('base64:')) {
    return new Response('Evidencia no disponible.', { status: 404 });
  }

  const filename = evidence.title.replace(/[^a-zA-Z0-9._ -]/g, '_') || 'evidencia';
  return new Response(Buffer.from(evidence.urlOrPath.slice('base64:'.length), 'base64'), {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': cacheControl,
    },
  });
}
