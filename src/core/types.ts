export type ResponseValue = 'C' | 'P' | 'NC' | 'NA';

export type ComplianceStatus =
  | 'NOT_STARTED'       // 0%
  | 'INITIAL'           // 1% a 39%
  | 'IN_PROGRESS'       // 40% a 79%
  | 'NEARLY_CONFORMANT' // 80% a 99%
  | 'CONFORMANT';       // 100%

export interface ComplianceCalculationResult {
  totalItems: number;
  compliantCount: number;         // C
  partiallyCompliantCount: number; // P
  nonCompliantCount: number;       // NC
  notApplicableCount: number;      // NA
  applicableItems: number;         // T - NA
  score: number;                   // C + 0.5 * P
  percentage: number;              // [ (C + 0.5 * P) / (T - NA) ] * 100
  status: ComplianceStatus;
  statusLabel: string;
  interpretation: string;
}

export interface ItemResponseInput {
  itemId: string;
  value: ResponseValue;
}

export interface GapItem {
  itemId: string;
  itemCode: string;
  statement: string;
  expectedDeliverable: string;
  targetRole: string;
  value: 'NC' | 'P';
  gapType: 'BRECHA_TOTAL' | 'BRECHA_PARCIAL';
  priority: 'ALTA' | 'MEDIA';
  suggestedAction: string;
}
