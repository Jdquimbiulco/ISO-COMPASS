import { analyzeGaps } from '@/core/gap-analyzer';
import { calculateCompliance } from '@/core/compliance-calculator';
import { EvaluationData } from '@/lib/evaluations-data';
import { AuthService } from '@/services/auth.service';

export { EvaluationData, EvaluationError, MAX_EVIDENCE_BYTES } from '@/lib/evaluations-data';

export async function getEvaluationUser() {
  const session = AuthService.getAuthenticatedSession();
  return session ? EvaluationData.getUser(session.id) : null;
}

export function getEvaluationResults(evaluation: NonNullable<Awaited<ReturnType<typeof EvaluationData.get>>>) {
  const responsesById = new Map(evaluation.responses.map((response) => [response.itemId, response]));
  const items = evaluation.standard.sections.flatMap((section) =>
    section.items.map((item) => ({ ...item, response: responsesById.get(item.id) }))
  );
  const compliance = calculateCompliance(items.flatMap((item) => item.response ? [item.response] : []), items.length);
  const processItems = new Map<string, typeof items>();

  for (const item of items) {
    const process = /^(GP|IS)(\.|$)/.exec(item.code)?.[1];
    if (!process) continue;
    const group = processItems.get(process);
    if (group) group.push(item);
    else processItems.set(process, [item]);
  }

  const processes = Array.from(processItems, ([name, group]) => ({
    name,
    percentage: calculateCompliance(group.flatMap((item) => item.response ? [item.response] : []), group.length).percentage,
  }));

  return { compliance, processes, gaps: analyzeGaps(items) };
}
