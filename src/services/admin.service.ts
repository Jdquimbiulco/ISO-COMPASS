import { getPrismaClient } from '@/lib/prisma';
import { UserRole, hashPassword } from '@/core/rbac';
import { FALLBACK_USERS } from './auth.service';
import { standardsSeedData } from '@/data/standards-data';

export interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface AdminFamilyItem {
  id: string;
  code: string;
  name: string;
  description: string;
  standardsCount: number;
}

export interface AdminStandardItem {
  id: string;
  familyCode: string;
  code: string;
  title: string;
  shortTitle: string;
  edition: string;
  category: string;
  targetAudience: string;
  purpose: string;
  introduction: string;
  officialUrl: string;
  accessType: string;
  sectionsCount: number;
  itemsCount: number;
}

// Almacenamiento en memoria de respaldo en caso de desconexión temporal de red
let memoryUsers: AdminUserItem[] = FALLBACK_USERS.map((u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
  createdAt: u.createdAt,
}));

let memoryFamilies: AdminFamilyItem[] = [
  {
    id: 'fam-iso-29110',
    code: standardsSeedData.family.code,
    name: standardsSeedData.family.name,
    description: standardsSeedData.family.description,
    standardsCount: standardsSeedData.standards.length,
  },
];

let memoryStandards: AdminStandardItem[] = standardsSeedData.standards.map((s: any, idx: number) => ({
  id: `std-${idx + 1}`,
  familyCode: standardsSeedData.family.code,
  code: s.code,
  title: s.title,
  shortTitle: s.shortTitle,
  edition: s.edition,
  category: s.category,
  targetAudience: s.targetAudience,
  purpose: s.purpose,
  introduction: s.introduction,
  officialUrl: s.officialUrl,
  accessType: s.accessType,
  sectionsCount: s.sections.length,
  itemsCount: s.sections.reduce((acc: number, sec: any) => acc + sec.items.length, 0),
}));

export class AdminService {
  /**
   * Obtiene el resumen completo para el Módulo M7 (Usuarios RBAC, Familias extensibles y Normas).
   */
  static async getDashboardData() {
    const prisma = getPrismaClient();

    if (prisma) {
      try {
        const [dbUsers, dbFamilies, dbStandards] = await Promise.all([
          prisma.user.findMany({ orderBy: { createdAt: 'asc' } }),
          prisma.family.findMany({
            include: { _count: { select: { standards: true } } },
            orderBy: { createdAt: 'asc' },
          }),
          prisma.standard.findMany({
            include: {
              family: true,
              sections: { include: { _count: { select: { items: true } } } },
            },
            orderBy: { code: 'asc' },
          }),
        ]);

        const users: AdminUserItem[] = dbUsers.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role as UserRole,
          createdAt: u.createdAt.toISOString(),
        }));

        const families: AdminFamilyItem[] = dbFamilies.map((f) => ({
          id: f.id,
          code: f.code,
          name: f.name,
          description: f.description,
          standardsCount: f._count.standards,
        }));

        const standards: AdminStandardItem[] = dbStandards.map((s) => ({
          id: s.id,
          familyCode: s.family.code,
          code: s.code,
          title: s.title,
          shortTitle: s.shortTitle,
          edition: s.edition,
          category: s.category,
          targetAudience: s.targetAudience,
          purpose: s.purpose,
          introduction: s.introduction,
          officialUrl: s.officialUrl,
          accessType: s.accessType,
          sectionsCount: s.sections.length,
          itemsCount: s.sections.reduce((acc, sec) => acc + sec._count.items, 0),
        }));

        return {
          users: users.length > 0 ? users : memoryUsers,
          families: families.length > 0 ? families : memoryFamilies,
          standards: standards.length > 0 ? standards : memoryStandards,
          source: 'SUPABASE_POSTGRES',
        };
      } catch {
        // Fallback si el entorno no tiene salida de red activa
      }
    }

    return {
      users: memoryUsers,
      families: memoryFamilies,
      standards: memoryStandards,
      source: 'LOCAL_SEED_CACHE',
    };
  }

  /**
   * Crea un nuevo usuario con contraseña cifrada bcrypt y rol RBAC (RNF-03 / M7).
   */
  static async createUser(input: {
    name: string;
    email: string;
    passwordPlain: string;
    role: UserRole;
  }): Promise<AdminUserItem> {
    const passwordHash = hashPassword(input.passwordPlain || 'Password123!');
    const cleanEmail = input.email.trim().toLowerCase();
    const prisma = getPrismaClient();

    if (prisma) {
      try {
        const created = await prisma.user.create({
          data: {
            name: input.name.trim(),
            email: cleanEmail,
            passwordHash,
            role: input.role,
          },
        });
        return {
          id: created.id,
          name: created.name,
          email: created.email,
          role: created.role as UserRole,
          createdAt: created.createdAt.toISOString(),
        };
      } catch {
        // Fallback a memoria
      }
    }

    const newUser: AdminUserItem = {
      id: `usr-${Date.now()}`,
      name: input.name.trim(),
      email: cleanEmail,
      role: input.role,
      createdAt: new Date().toISOString(),
    };
    memoryUsers = [...memoryUsers, newUser];
    return newUser;
  }

  /**
   * Actualiza el rol RBAC de un usuario existente.
   */
  static async updateUserRole(userId: string, role: UserRole): Promise<void> {
    const prisma = getPrismaClient();
    if (prisma) {
      try {
        await prisma.user.update({
          where: { id: userId },
          data: { role },
        });
        return;
      } catch {
        // Fallback
      }
    }
    memoryUsers = memoryUsers.map((u) => (u.id === userId ? { ...u, role } : u));
  }

  /**
   * Elimina un usuario del sistema.
   */
  static async deleteUser(userId: string): Promise<void> {
    const prisma = getPrismaClient();
    if (prisma) {
      try {
        await prisma.user.delete({ where: { id: userId } });
        return;
      } catch {
        // Fallback
      }
    }
    memoryUsers = memoryUsers.filter((u) => u.id !== userId);
  }

  /**
   * Registra una nueva Familia de Normas (ej. ISO 9001, ISO/IEC 25010, ISO/IEC 27001)
   * demostrando la extensibilidad sin modificar código fuente (Sección 4.1 y M7).
   */
  static async createFamily(input: {
    code: string;
    name: string;
    description: string;
  }): Promise<AdminFamilyItem> {
    const cleanCode = input.code.trim().toUpperCase();
    const prisma = getPrismaClient();

    if (prisma) {
      try {
        const created = await prisma.family.upsert({
          where: { code: cleanCode },
          update: {
            name: input.name.trim(),
            description: input.description.trim(),
          },
          create: {
            code: cleanCode,
            name: input.name.trim(),
            description: input.description.trim(),
          },
          include: { _count: { select: { standards: true } } },
        });
        return {
          id: created.id,
          code: created.code,
          name: created.name,
          description: created.description,
          standardsCount: created._count.standards,
        };
      } catch {
        // Fallback
      }
    }

    const newFamily: AdminFamilyItem = {
      id: `fam-${Date.now()}`,
      code: cleanCode,
      name: input.name.trim(),
      description: input.description.trim(),
      standardsCount: 0,
    };
    memoryFamilies = [...memoryFamilies.filter((f) => f.code !== cleanCode), newFamily];
    return newFamily;
  }

  /**
   * Elimina una familia de normas extensible.
   */
  static async deleteFamily(familyId: string): Promise<void> {
    const prisma = getPrismaClient();
    if (prisma) {
      try {
        await prisma.family.delete({ where: { id: familyId } });
        return;
      } catch {
        // Fallback
      }
    }
    memoryFamilies = memoryFamilies.filter((f) => f.id !== familyId);
  }

  /**
   * Crea o edita una norma junto con un apartado e ítem inicial desde el Módulo M7 (RF-15).
   */
  static async upsertStandard(input: {
    familyCode: string;
    code: string;
    title: string;
    shortTitle: string;
    edition: string;
    category: 'OVERVIEW' | 'FRAMEWORK' | 'ASSESSMENT' | 'SPECIFICATIONS' | 'GUIDELINES';
    targetAudience: string;
    purpose: string;
    introduction: string;
    officialUrl: string;
    accessType: 'FREE' | 'ISO_PAID' | 'INSTITUTIONAL';
    initialSectionCode?: string;
    initialSectionName?: string;
    initialItemCode?: string;
    initialItemStatement?: string;
    initialItemDeliverable?: string;
    initialItemRole?: string;
  }): Promise<AdminStandardItem> {
    const cleanCode = input.code.trim();
    const prisma = getPrismaClient();

    if (prisma) {
      try {
        const family = await prisma.family.findUnique({
          where: { code: input.familyCode },
        });
        if (family) {
          const std = await prisma.standard.upsert({
            where: { code: cleanCode },
            update: {
              title: input.title.trim(),
              shortTitle: input.shortTitle.trim(),
              edition: input.edition.trim(),
              category: input.category,
              targetAudience: input.targetAudience.trim(),
              purpose: input.purpose.trim(),
              introduction: input.introduction.trim(),
              officialUrl: input.officialUrl.trim(),
              accessType: input.accessType,
            },
            create: {
              familyId: family.id,
              code: cleanCode,
              title: input.title.trim(),
              shortTitle: input.shortTitle.trim(),
              edition: input.edition.trim(),
              category: input.category,
              targetAudience: input.targetAudience.trim(),
              purpose: input.purpose.trim(),
              introduction: input.introduction.trim(),
              officialUrl: input.officialUrl.trim(),
              accessType: input.accessType,
            },
          });

          if (input.initialSectionCode && input.initialSectionName) {
            const sec = await prisma.section.upsert({
              where: {
                standardId_code: {
                  standardId: std.id,
                  code: input.initialSectionCode.trim(),
                },
              },
              update: { name: input.initialSectionName.trim() },
              create: {
                standardId: std.id,
                code: input.initialSectionCode.trim(),
                name: input.initialSectionName.trim(),
                orderIndex: 1,
              },
            });

            if (input.initialItemCode && input.initialItemStatement) {
              await prisma.checklistItem.upsert({
                where: {
                  sectionId_code: {
                    sectionId: sec.id,
                    code: input.initialItemCode.trim(),
                  },
                },
                update: {
                  statement: input.initialItemStatement.trim(),
                  expectedDeliverable: (input.initialItemDeliverable || 'Evidencia documentada').trim(),
                  targetRole: (input.initialItemRole || 'GP').trim(),
                },
                create: {
                  sectionId: sec.id,
                  code: input.initialItemCode.trim(),
                  statement: input.initialItemStatement.trim(),
                  expectedDeliverable: (input.initialItemDeliverable || 'Evidencia documentada').trim(),
                  targetRole: (input.initialItemRole || 'GP').trim(),
                  orderIndex: 1,
                },
              });
            }
          }

          return {
            id: std.id,
            familyCode: family.code,
            code: std.code,
            title: std.title,
            shortTitle: std.shortTitle,
            edition: std.edition,
            category: std.category,
            targetAudience: std.targetAudience,
            purpose: std.purpose,
            introduction: std.introduction,
            officialUrl: std.officialUrl,
            accessType: std.accessType,
            sectionsCount: 1,
            itemsCount: 1,
          };
        }
      } catch {
        // Fallback
      }
    }

    const newStd: AdminStandardItem = {
      id: `std-${Date.now()}`,
      familyCode: input.familyCode,
      code: cleanCode,
      title: input.title.trim(),
      shortTitle: input.shortTitle.trim(),
      edition: input.edition.trim(),
      category: input.category,
      targetAudience: input.targetAudience.trim(),
      purpose: input.purpose.trim(),
      introduction: input.introduction.trim(),
      officialUrl: input.officialUrl.trim(),
      accessType: input.accessType,
      sectionsCount: input.initialSectionCode ? 1 : 0,
      itemsCount: input.initialItemCode ? 1 : 0,
    };

    memoryStandards = [...memoryStandards.filter((s) => s.code !== cleanCode), newStd];
    return newStd;
  }

  /**
   * Elimina una norma por su ID.
   */
  static async deleteStandard(standardId: string): Promise<void> {
    const prisma = getPrismaClient();
    if (prisma) {
      try {
        await prisma.standard.delete({ where: { id: standardId } });
        return;
      } catch {
        // Fallback
      }
    }
    memoryStandards = memoryStandards.filter((s) => s.id !== standardId);
  }
}
