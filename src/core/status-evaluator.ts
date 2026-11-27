import { ComplianceStatus } from './types';

export interface StatusEvaluation {
  status: ComplianceStatus;
  label: string;
  interpretation: string;
  badgeVariant: 'secondary' | 'destructive' | 'warning' | 'primary' | 'success';
}

/**
 * Determina el estado de aplicación según la Tabla 4 de la guía de la ESPE:
 * - 0% (sin ítems evaluados): No iniciado
 * - 1% a 39%: En inicio
 * - 40% a 79%: En progreso
 * - 80% a 99%: Casi conforme
 * - 100%: Conforme
 */
export function evaluateComplianceStatus(
  percentage: number,
  noItemsEvaluated: boolean = false
): StatusEvaluation {
  if (noItemsEvaluated || percentage <= 0) {
    return {
      status: 'NOT_STARTED',
      label: 'No iniciado',
      interpretation: 'La organización aún no ha revisado la norma.',
      badgeVariant: 'secondary',
    };
  }

  if (percentage < 40) {
    return {
      status: 'INITIAL',
      label: 'En inicio',
      interpretation: 'Existen prácticas aisladas; se requiere un plan de implantación.',
      badgeVariant: 'destructive',
    };
  }

  if (percentage < 80) {
    return {
      status: 'IN_PROGRESS',
      label: 'En progreso',
      interpretation: 'La mayoría de las prácticas está en marcha; persisten brechas relevantes.',
      badgeVariant: 'warning',
    };
  }

  if (percentage < 100) {
    return {
      status: 'NEARLY_CONFORMANT',
      label: 'Casi conforme',
      interpretation: 'Faltan ajustes menores antes de una evaluación formal.',
      badgeVariant: 'primary',
    };
  }

  return {
    status: 'CONFORMANT',
    label: 'Conforme',
    interpretation: 'Todos los ítems aplicables se cumplen con evidencia; listo para evaluación o auditoría.',
    badgeVariant: 'success',
  };
}
