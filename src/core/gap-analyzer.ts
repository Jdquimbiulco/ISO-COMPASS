import { GapItem } from './types';

export interface RawEvaluationItem {
  id: string;
  code: string;
  statement: string;
  expectedDeliverable: string;
  targetRole: string;
  response?: {
    value: 'C' | 'P' | 'NC' | 'NA';
    observations?: string | null;
  } | null;
}

/**
 * Identifica las brechas de conformidad (ítems con 'NC' o 'P') según el RF-12.
 */
export function analyzeGaps(items: RawEvaluationItem[]): GapItem[] {
  const gaps: GapItem[] = [];

  for (const item of items) {
    const val = item.response?.value;
    if (val === 'NC') {
      gaps.push({
        itemId: item.id,
        itemCode: item.code,
        statement: item.statement,
        expectedDeliverable: item.expectedDeliverable,
        targetRole: item.targetRole,
        value: 'NC',
        gapType: 'BRECHA_TOTAL',
        priority: 'ALTA',
        suggestedAction: `Implementar formalmente la práctica y generar el producto de trabajo esperado: ${item.expectedDeliverable} bajo la responsabilidad del rol ${item.targetRole}.`,
      });
    } else if (val === 'P') {
      gaps.push({
        itemId: item.id,
        itemCode: item.code,
        statement: item.statement,
        expectedDeliverable: item.expectedDeliverable,
        targetRole: item.targetRole,
        value: 'P',
        gapType: 'BRECHA_PARCIAL',
        priority: 'MEDIA',
        suggestedAction: `Completar las evidencias pendientes del producto: ${item.expectedDeliverable} y ajustar observaciones registradas.`,
      });
    }
  }

  return gaps;
}
