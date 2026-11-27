import { ComplianceCalculationResult, ItemResponseInput, ResponseValue } from './types';
import { evaluateComplianceStatus } from './status-evaluator';

/**
 * Calcula el porcentaje de cumplimiento según la fórmula oficial de la guía ISO 29110:
 * Cumplimiento (%) = [ (C + 0.5 * P) / (T - NA) ] * 100
 *
 * @param responses Colección de respuestas de la evaluación
 * @param totalExpectedItems Total de ítems configurados en la norma (T)
 */
export function calculateCompliance(
  responses: Array<{ value: ResponseValue }>,
  totalExpectedItems?: number
): ComplianceCalculationResult {
  const total = totalExpectedItems ?? responses.length;

  let c = 0;
  let p = 0;
  let nc = 0;
  let na = 0;

  for (const res of responses) {
    switch (res.value) {
      case 'C':
        c++;
        break;
      case 'P':
        p++;
        break;
      case 'NC':
        nc++;
        break;
      case 'NA':
        na++;
        break;
    }
  }

  // T - NA
  const applicableItems = total - na;
  const score = c + 0.5 * p;

  let percentage = 0.0;
  if (applicableItems > 0 && responses.length > 0) {
    percentage = (score / applicableItems) * 100;
  }

  // Clampeo y redondeo estricto a 2 decimales
  percentage = Math.max(0, Math.min(100, Math.round(percentage * 100) / 100));

  // Evaluar estado correspondiente
  const statusInfo = evaluateComplianceStatus(percentage, responses.length === 0);

  return {
    totalItems: total,
    compliantCount: c,
    partiallyCompliantCount: p,
    nonCompliantCount: nc,
    notApplicableCount: na,
    applicableItems,
    score,
    percentage,
    status: statusInfo.status,
    statusLabel: statusInfo.label,
    interpretation: statusInfo.interpretation,
  };
}
