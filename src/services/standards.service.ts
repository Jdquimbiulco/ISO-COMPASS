import { prisma } from '@/lib/prisma';
import standardsSeedData from '../../prisma/seed-data/iso-29110-standards.json';

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
   * Obtiene todas las normas registradas en el sistema.
   * Si la BD no está disponible durante el build en Vercel, utiliza los datos pre-empaquetados.
   */
  static async getAllStandards(): Promise<StandardSummary[]> {
    if (process.env.DATABASE_URL) {
      try {
        const standards = await prisma.standard.findMany({
          include: {
            sections: {
              include: {
                items: true,
              },
            },
          },
          orderBy: { code: 'asc' },
        });

        if (standards && standards.length > 0) {
          return standards.map((s) => ({
            id: s.id,
            code: s.code,
            title: s.title,
            shortTitle: s.shortTitle,
            edition: s.edition,
            category: s.category,
            targetAudience: s.targetAudience,
            accessType: s.accessType,
            officialUrl: s.officialUrl,
            itemCount: s.sections.reduce((acc, sec) => acc + sec.items.length, 0),
          }));
        }
      } catch (err) {
        console.warn('Aviso: Base de datos no accesible en este ciclo, usando catálogo integrado.');
      }
    }

    // Fallback asegurado 100% que nunca falla en Vercel Build
    return standardsSeedData.standards.map((s: any, idx: number) => ({
      id: `std-local-${idx}`,
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
    if (process.env.DATABASE_URL) {
      try {
        const std = await prisma.standard.findUnique({
          where: { code },
          include: {
            family: true,
            sections: {
              include: {
                items: true,
              },
              orderBy: { orderIndex: 'asc' },
            },
          },
        });
        if (std) return std;
      } catch (err) {
        console.warn('Aviso: Detalle de norma cargado desde catálogo integrado:', code);
      }
    }

    const found = standardsSeedData.standards.find((s: any) => s.code === code);
    if (found) {
      return {
        id: `std-local-${found.code}`,
        family: standardsSeedData.family,
        ...found,
      };
    }

    return null;
  }
}
