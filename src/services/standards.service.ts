import { prisma } from '@/lib/prisma';
import * as fs from 'fs';
import * as path from 'path';

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
   * Si la BD no está inicializada aún, hace fallback a los datos semilla en JSON.
   */
  static async getAllStandards(): Promise<StandardSummary[]> {
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

      if (standards.length > 0) {
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
    } catch {
      // Fallback a JSON si prisma no tiene conexión en tiempo de build o desarrollo temprano
    }

    // Fallback directo a archivo JSON
    const fallbackPath = path.join(process.cwd(), 'prisma', 'seed-data', 'iso-29110-standards.json');
    if (fs.existsSync(fallbackPath)) {
      const data = JSON.parse(fs.readFileSync(fallbackPath, 'utf-8'));
      return data.standards.map((s: any, idx: number) => ({
        id: `mock-${idx}`,
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

    return [];
  }

  /**
   * Obtiene el detalle completo de una norma por su código oficial (ej. "29110-5-1-2")
   */
  static async getStandardByCode(code: string) {
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
    } catch {
      // Fallback
    }

    const fallbackPath = path.join(process.cwd(), 'prisma', 'seed-data', 'iso-29110-standards.json');
    if (fs.existsSync(fallbackPath)) {
      const data = JSON.parse(fs.readFileSync(fallbackPath, 'utf-8'));
      const found = data.standards.find((s: any) => s.code === code);
      if (found) {
        return {
          id: 'mock-id',
          family: data.family,
          ...found,
        };
      }
    }

    return null;
  }
}
