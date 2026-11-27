import { standardsSeedData } from '@/data/standards-data';

export interface StandardSummary {
  id: string;
  code: string;
  title: string;
  shortTitle: string;
  edition: string;
  category: string;
  targetAudience: string;
  accessType: string;
  officialUrl: string;
  itemCount: number;
}

export class StandardsService {
  /**
   * Obtiene todas las normas registradas en el catálogo oficial de la ISO 29110.
   * Utiliza el catálogo pre-empaquetado para garantizar rendimiento instantáneo (<50ms)
   * y que el build de Vercel nunca dependa de llamadas de red o archivos externos.
   */
  static async getAllStandards(): Promise<StandardSummary[]> {
    return standardsSeedData.standards.map((s: any, idx: number) => ({
      id: `std-${idx + 1}`,
      code: s.code,
      title: s.title,
      shortTitle: s.shortTitle,
      edition: s.edition,
      category: s.category,
      targetAudience: s.targetAudience,
      accessType: s.accessType,
      officialUrl: s.officialUrl,
      itemCount: s.sections.reduce((acc: number, sec: any) => acc + sec.items.length, 0),
    }));
  }

  /**
   * Obtiene el detalle completo de una norma por su código oficial (ej. "29110-5-1-2")
   */
  static async getStandardByCode(code: string) {
    const found = standardsSeedData.standards.find((s: any) => s.code === code);
    if (found) {
      return {
        id: `std-${found.code}`,
        family: standardsSeedData.family,
        ...found,
      };
    }

    return null;
  }
}
