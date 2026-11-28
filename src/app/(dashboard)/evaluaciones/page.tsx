import Link from 'next/link';
import { ChecklistItem } from '@/components/evaluations/checklist-item';
import { EvaluationForm } from '@/components/evaluations/evaluation-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthService } from '@/services/auth.service';
import { EvaluationData, getEvaluationUser } from '@/services/evaluation.service';

export const dynamic = 'force-dynamic';

const dateFormat = new Intl.DateTimeFormat('es-EC', { dateStyle: 'medium', timeZone: 'America/Guayaquil' });

export default async function EvaluacionesPage({ searchParams }: {
  searchParams: { norma?: string; evaluacion?: string };
}) {
  const heading = <h1 className="text-2xl font-bold">Listas de verificación y evaluaciones</h1>;
  const user = await getEvaluationUser();
  if (!user) {
    return (
      <div className="space-y-3">
        {heading}
        <p><Link className="text-brand-700 underline dark:text-brand-300" href="/login">Inicia sesión</Link> para consultar o crear evaluaciones.</p>
      </div>
    );
  }

  const canEdit = AuthService.getPermissions(user.role).canEditEvaluations;
  const evaluations = await EvaluationData.list(user, searchParams.norma);
  const selected = searchParams.evaluacion ?? evaluations[0]?.id;
  const [evaluation, options] = await Promise.all([
    selected ? EvaluationData.get(user, selected) : undefined,
    canEdit ? EvaluationData.getOptions() : undefined,
  ]);
  const responseByItem = new Map(evaluation?.responses.map((response) => [response.itemId, response]));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {heading}
        {searchParams.norma && (
          <Link href="/evaluaciones" className="text-sm text-brand-700 underline dark:text-brand-300">Ver todas las evaluaciones</Link>
        )}
      </div>

      {evaluations.length > 0 && (
        <nav aria-label="Evaluaciones" className="flex flex-wrap gap-2">
          {evaluations.map(({ id, standard, organization, evaluationDate }) => (
            <Link
              key={id}
              href={`/evaluaciones?norma=${encodeURIComponent(standard.code)}&evaluacion=${encodeURIComponent(id)}#checklist`}
              aria-current={id === evaluation?.id ? 'page' : undefined}
              className="rounded border px-3 py-2 text-sm aria-[current=page]:border-brand-600 aria-[current=page]:bg-brand-50 dark:aria-[current=page]:bg-brand-950"
            >
              {organization.name} · {standard.shortTitle} · {dateFormat.format(evaluationDate)}
            </Link>
          ))}
        </nav>
      )}

      {options && (
        <Card>
          <CardContent className="pt-5">
            <details open={!evaluation}>
              <summary className="cursor-pointer text-sm font-semibold">Nueva evaluación</summary>
              <div className="mt-4">
                {options.standards.length ? (
                  <EvaluationForm key={searchParams.norma} {...options} standardCode={searchParams.norma} />
                ) : (
                  <p className="text-sm">El catálogo de evaluación aún no contiene normas.</p>
                )}
              </div>
            </details>
          </CardContent>
        </Card>
      )}

      {!evaluation && !canEdit && <p className="text-sm">Todavía no hay evaluaciones disponibles.</p>}
      {evaluation && (
        <section id="checklist" className="space-y-4 scroll-mt-20">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">{evaluation.standard.shortTitle}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {evaluation.organization.name} · {evaluation.organization.teamSize} personas · {evaluation.organization.targetProfile}
              </p>
            </div>
            <Link href={`/tablero?evaluacion=${encodeURIComponent(evaluation.id)}`} className="rounded border px-3 py-2 text-sm font-medium">Ver tablero</Link>
          </div>
          {evaluation.standard.sections.map((section) => (
            <Card key={section.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{section.code} · {section.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="divide-y dark:divide-gray-800">
                  {section.items.map((item) => {
                    const response = responseByItem.get(item.id);
                    return (
                      <ChecklistItem
                        key={`${evaluation.id}-${item.id}`}
                        evaluationId={evaluation.id}
                        item={item}
                        canEdit={canEdit}
                        response={response ? { ...response, dateLabel: dateFormat.format(response.evaluationDate) } : undefined}
                      />
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          ))}
        </section>
      )}
    </div>
  );
}
