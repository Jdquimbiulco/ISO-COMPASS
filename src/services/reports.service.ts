import { ComplianceCalculationResult, GapItem } from '@/core/types';

export interface EvaluationReportData {
  organizationName: string;
  teamSize: number;
  targetProfile: string;
  standardCode: string;
  standardTitle: string;
  evaluatorName: string;
  evaluationDate: string;
  results: ComplianceCalculationResult;
  gaps: GapItem[];
}

export class ReportsService {
  /**
   * Prepara los datos formateados para exportación a Excel / CSV.
   */
  static generateExcelMatrix(report: EvaluationReportData) {
    const headerInfo = [
      ['SISTEMA ISO-COMPASS - REPORTE DE EVALUACIÓN ISO/IEC 29110'],
      ['Organización evaluada:', report.organizationName],
      ['Perfil Objetivo:', report.targetProfile],
      ['Norma aplicada:', `${report.standardCode} - ${report.standardTitle}`],
      ['Evaluador responsable:', report.evaluatorName],
      ['Fecha de evaluación:', report.evaluationDate],
      ['Cumplimiento global:', `${report.results.percentage}%`],
      ['Estado oficial asignado:', `${report.results.statusLabel} (${report.results.interpretation})`],
      [],
      ['MATRIZ DE BRECHAS Y PLAN DE MEJORA IDENTIFICADO'],
      ['Código Ítem', 'Enunciado de la Práctica', 'Valor', 'Prioridad', 'Producto de Trabajo Esperado', 'Rol Responsable', 'Acción Recomendada']
    ];

    const gapRows = report.gaps.map((g) => [
      g.itemCode,
      g.statement,
      g.value === 'NC' ? 'No cumple' : 'Cumple parcialmente',
      g.priority,
      g.expectedDeliverable,
      g.targetRole,
      g.suggestedAction,
    ]);

    return [...headerInfo, ...gapRows];
  }
}
