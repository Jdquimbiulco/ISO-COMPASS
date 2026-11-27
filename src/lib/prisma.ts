import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export function getPrismaClient(): PrismaClient | null {
  if (typeof window !== 'undefined') return null;
  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) return null;

  // Limpieza defensiva de comillas por si Vercel las importó con comillas
  const cleanUrl = rawUrl.trim().replace(/^["']|["']$/g, '');

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      datasources: {
        db: {
          url: cleanUrl,
        },
      },
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  }
  return globalForPrisma.prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    if (!client) {
      throw new Error('DATABASE_URL no está configurada o no es accesible.');
    }
    const val = (client as any)[prop];
    if (typeof val === 'function') {
      return val.bind(client);
    }
    return val;
  },
});
