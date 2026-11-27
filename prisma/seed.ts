import { PrismaClient, Role, StandardCategory, AccessType } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando carga de datos iniciales (Seed ISO-COMPASS)...');

  // 1. Crear usuarios por defecto con roles RBAC
  console.log('Creando usuarios iniciales...');
  // Password hash real para "Password123!" generado con bcryptjs
  const samplePasswordHash = '$2a$10$rVlPBUtgbHPNnlJscdZWi.3WIRcjLmjfa5KxqhTnKHbRNTAKRQuGG';

  const admin = await prisma.user.upsert({
    where: { email: 'admin@espe.edu.ec' },
    update: {
      passwordHash: samplePasswordHash,
      role: Role.ADMIN,
    },
    create: {
      name: 'Juan Quimbiulco (Administrador GP)',
      email: 'admin@espe.edu.ec',
      passwordHash: samplePasswordHash,
      role: Role.ADMIN,
    },
  });

  const evaluator = await prisma.user.upsert({
    where: { email: 'evaluador@espe.edu.ec' },
    update: {
      passwordHash: samplePasswordHash,
      role: Role.EVALUATOR,
    },
    create: {
      name: 'Ing. Evaluador Calidad',
      email: 'evaluador@espe.edu.ec',
      passwordHash: samplePasswordHash,
      role: Role.EVALUATOR,
    },
  });

  const consultant = await prisma.user.upsert({
    where: { email: 'consultor@espe.edu.ec' },
    update: {
      passwordHash: samplePasswordHash,
      role: Role.CONSULTANT,
    },
    create: {
      name: 'Auditor Consultor',
      email: 'consultor@espe.edu.ec',
      passwordHash: samplePasswordHash,
      role: Role.CONSULTANT,
    },
  });

  console.log(`Usuarios creados: Admin (${admin.email}), Evaluador (${evaluator.email}), Consultor (${consultant.email})`);

  // 2. Cargar archivo JSON con las normas de la familia ISO/IEC 29110
  const dataPath = path.join(__dirname, 'seed-data', 'iso-29110-standards.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const seedData = JSON.parse(rawData);

  // Crear o actualizar la Familia
  const family = await prisma.family.upsert({
    where: { code: seedData.family.code },
    update: {
      name: seedData.family.name,
      description: seedData.family.description,
    },
    create: {
      code: seedData.family.code,
      name: seedData.family.name,
      description: seedData.family.description,
    },
  });
  console.log(`Familia registrada: ${family.name}`);

  // Cargar cada Norma, sus Secciones y sus Items
  for (const std of seedData.standards) {
    const standard = await prisma.standard.upsert({
      where: { code: std.code },
      update: {
        title: std.title,
        shortTitle: std.shortTitle,
        edition: std.edition,
        category: std.category as StandardCategory,
        targetAudience: std.targetAudience,
        purpose: std.purpose,
        introduction: std.introduction,
        officialUrl: std.officialUrl,
        accessType: std.accessType as AccessType,
      },
      create: {
        familyId: family.id,
        code: std.code,
        title: std.title,
        shortTitle: std.shortTitle,
        edition: std.edition,
        category: std.category as StandardCategory,
        targetAudience: std.targetAudience,
        purpose: std.purpose,
        introduction: std.introduction,
        officialUrl: std.officialUrl,
        accessType: std.accessType as AccessType,
      },
    });

    for (const sec of std.sections) {
      const section = await prisma.section.upsert({
        where: {
          standardId_code: {
            standardId: standard.id,
            code: sec.code,
          },
        },
        update: {
          name: sec.name,
          orderIndex: sec.orderIndex,
        },
        create: {
          standardId: standard.id,
          code: sec.code,
          name: sec.name,
          orderIndex: sec.orderIndex,
        },
      });

      for (const item of sec.items) {
        await prisma.checklistItem.upsert({
          where: {
            sectionId_code: {
              sectionId: section.id,
              code: item.code,
            },
          },
          update: {
            statement: item.statement,
            expectedDeliverable: item.expectedDeliverable,
            targetRole: item.targetRole,
          },
          create: {
            sectionId: section.id,
            code: item.code,
            statement: item.statement,
            expectedDeliverable: item.expectedDeliverable,
            targetRole: item.targetRole,
          },
        });
      }
    }
  }

  // 3. Crear una Organización de ejemplo (VSE) requerida en los entregables
  const sampleOrg = await prisma.organization.upsert({
    where: { id: 'vse-demo-espe-01' },
    update: {},
    create: {
      id: 'vse-demo-espe-01',
      name: 'AndesTech Solutions (VSE Piloto)',
      teamSize: 6,
      targetProfile: 'Perfil Básico',
      description: 'Empresa ecuatoriana de desarrollo de software para el sector logístico con un equipo de 6 ingenieros.',
    },
  });

  console.log(`Organización de ejemplo registrada: ${sampleOrg.name}`);
  console.log('¡Carga de datos iniciales completada con éxito!');
}

main()
  .catch((e) => {
    console.error('Error durante la ejecución del seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
