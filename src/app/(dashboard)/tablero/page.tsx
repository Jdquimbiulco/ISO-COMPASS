import Link from 'next/link';
import { ComplianceCharts } from '@/components/evaluations/compliance-charts';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EvaluationData, getEvaluationResults, getEvaluationUser } from '@/services/evaluation.service';

export const dynamic = 'force-dynamic';

export default async function TableroPage({ searchParams }: { searchParams: { evaluacion?: string } }) {
  const heading = <h1 className="text-2xl font-bold">Tablero de cumplimiento</h1>;
  const user = await getEvaluationUser();
  if (!user) {
    return (
      <div className="space-y-3">
        {heading}
        <p><Link href="/login" className="text-brand-700 underline dark:text-brand-300">Inicia sesión</Link> para ver el avance de las evaluaciones.</p>
      </div>
    );
  }

  const evaluations = await EvaluationData.list(user);
  const selected = searchParams.evaluacion ?? evaluations[0]?.id;
  const evaluation = selected ? await EvaluationData.get(user, selected) : null;
  if (!evaluation) {
    return (
      <div className="space-y-3">
        {heading}
        <p>{selected ? 'Esta evaluación no está disponible.' : 'Todavía no hay evaluaciones.'}</p>
        <Link href="/evaluaciones" className="text-brand-700 underline dark:text-brand-300">Ir a evaluaciones</Link>
      </div>
    );
  }

  const { compliance, gaps, processes } = getEvaluationResults(evaluation);
  const latestByStandard = new Map<string, string>();
  for (const entry of evaluations) {
    if (entry.organization.id === evaluation.organizationId && !latestByStandard.has(entry.standard.code)) {
      latestByStandard.set(entry.standard.code, entry.id);
    }
  }
  const organizationEvaluations = await Promise.all(Array.from(latestByStandard.values(), (id) =>
    id === evaluation.id ? evaluation : EvaluationData.get(user, id)
  ));
  let organizationScore = 0;
  let organizationItems = 0;
  for (const entry of organizationEvaluations) {
    if (!entry) continue;
    const result = entry.id === evaluation.id ? compliance : getEvaluationResults(entry).compliance;
    organizationScore += result.score;
    organizationItems += result.applicableItems;
  }
  const organizationPercentage = organizationItems ? Math.round(10000 * organizationScore / organizationItems) / 100 : 0;
  const {
    compliantCount, partiallyCompliantCount, nonCompliantCount, notApplicableCount,
    totalItems, percentage, statusLabel,
  } = compliance;
  const graded = compliantCount + partiallyCompliantCount + nonCompliantCount + notApplicableCount;
  const distribution = [
    { name: 'Cumple', total: compliantCount, color: '#16a34a' },
    { name: 'Cumple parcialmente', total: partiallyCompliantCount, color: '#d97706' },
    { name: 'No cumple', total: nonCompliantCount, color: '#dc2626' },
    { name: 'No aplica', total: notApplicableCount, color: '#64748b' },
    { name: 'Sin calificar', total: totalItems - graded, color: '#cbd5e1' },
  ];

  const date = new Intl.DateTimeFormat('es-EC', { dateStyle: 'short', timeZone: 'America/Guayaquil' });
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          {heading}
          <p className="text-sm text-gray-600 dark:text-gray-400">{evaluation.organization.name} · {evaluation.standard.shortTitle}</p>
        </div>
        <Link
          className="rounded border px-3 py-2 text-sm font-medium"
          href={`/evaluaciones?norma=${encodeURIComponent(evaluation.standard.code)}&evaluacion=${encodeURIComponent(evaluation.id)}#checklist`}
        >
          Ver lista de verificación
        </Link>
      </div>
      {evaluations.length > 1 && (
        <nav aria-label="Cambiar evaluación del tablero" className="flex flex-wrap gap-2">
          {evaluations.map((entry) => (
            <Link
              key={entry.id}
              href={`/tablero?evaluacion=${encodeURIComponent(entry.id)}`}
              aria-current={entry.id === evaluation.id ? 'page' : undefined}
              className="rounded border px-3 py-2 text-sm aria-[current=page]:border-brand-600 aria-[current=page]:bg-brand-50 dark:aria-[current=page]:bg-brand-950"
            >
              {entry.organization.name} · {entry.standard.shortTitle} · {date.format(entry.evaluationDate)}
            </Link>
          ))}
        </nav>
      )}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card><CardHeader><CardTitle className="text-sm">Cumplimiento de la norma</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold text-brand-700 dark:text-brand-300">{percentage}%</CardContent>
        </Card>
        <Card><CardHeader><CardTitle className="text-sm">Estado de aplicación</CardTitle></CardHeader>
          <CardContent><Badge>{statusLabel}</Badge></CardContent>
        </Card>
        <Card><CardHeader><CardTitle className="text-sm">Ítems evaluados</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{graded} / {totalItems}</CardContent>
        </Card>
        <Card><CardHeader><CardTitle className="text-sm">Cumplimiento de la organización</CardTitle></CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{organizationPercentage}%</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Última evaluación disponible de cada norma</p>
          </CardContent>
        </Card>
      </div>
      <ComplianceCharts distribution={distribution} processes={processes} />
      <Card>
        <CardHeader><CardTitle className="text-lg">Brechas y acciones de mejora</CardTitle></CardHeader>
        <CardContent>
          {gaps.length ? (
            <ul className="divide-y dark:divide-gray-800">
              {gaps.map((gap) => (
                <li key={gap.itemId} className="space-y-1 py-3 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <strong>{gap.itemCode}</strong>
                    <Badge variant={gap.value === 'NC' ? 'destructive' : 'warning'}>
                      {gap.value === 'NC' ? 'No cumple' : 'Cumple parcialmente'}
                    </Badge>
                  </div>
                  <p>{gap.statement}</p>
                  <p className="text-gray-600 dark:text-gray-400">{gap.suggestedAction}</p>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm">Aún no se han registrado brechas.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
