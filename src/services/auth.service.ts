import { cookies } from 'next/headers';
import crypto from 'crypto';
import { UserRole, getRolePermissions, verifyPassword, hashPassword } from '@/core/rbac';
import { getPrismaClient } from '@/lib/prisma';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

const SESSION_COOKIE_NAME = 'iso_compass_session';

// Usuarios por defecto de respaldo (en caso de modo sin red o build estático)
const DEFAULT_PASSWORD_HASH = '$2a$10$rVlPBUtgbHPNnlJscdZWi.3WIRcjLmjfa5KxqhTnKHbRNTAKRQuGG'; // Password123!

export const FALLBACK_USERS: Array<SessionUser & { passwordHash: string; createdAt: string }> = [
  {
    id: 'usr-admin-01',
    name: 'Juan Quimbiulco (Administrador GP)',
    email: 'admin@espe.edu.ec',
    role: 'ADMIN',
    passwordHash: DEFAULT_PASSWORD_HASH,
    createdAt: '2026-11-15T10:00:00.000Z',
  },
  {
    id: 'usr-eval-02',
    name: 'Ing. Evaluador Calidad',
    email: 'evaluador@espe.edu.ec',
    role: 'EVALUATOR',
    passwordHash: DEFAULT_PASSWORD_HASH,
    createdAt: '2026-11-15T10:05:00.000Z',
  },
  {
    id: 'usr-cons-03',
    name: 'Auditor Consultor',
    email: 'consultor@espe.edu.ec',
    role: 'CONSULTANT',
    passwordHash: DEFAULT_PASSWORD_HASH,
    createdAt: '2026-11-15T10:10:00.000Z',
  },
];

const DEVELOPMENT_SECRET = 'iso-compass-super-secret-key-development-2026';
export const DEVELOPMENT_PASSWORD = 'Password123!';

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (process.env.NODE_ENV === 'production' && (!secret?.trim() || secret === DEVELOPMENT_SECRET)) {
    throw new Error('Configura un AUTH_SECRET exclusivo para este entorno.');
  }
  return secret || DEVELOPMENT_SECRET;
}

export function createSessionToken(user: SessionUser): string {
  const payload = Buffer.from(JSON.stringify(user), 'utf-8').toString('base64url');
  const signature = crypto
    .createHmac('sha256', getSecret())
    .update(payload)
    .digest('base64url');
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string): SessionUser | null {
  try {
    const [payload, signature] = token.split('.');
    if (!payload || !signature) return null;
    const expectedSig = crypto
      .createHmac('sha256', getSecret())
      .update(payload)
      .digest('base64url');
    const actual = Buffer.from(signature);
    const expected = Buffer.from(expectedSig);
    if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) return null;
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
    if (!decoded || !decoded.email || !decoded.role) return null;
    return decoded as SessionUser;
  } catch {
    return null;
  }
}

export class AuthService {
  static getAuthenticatedSession(): SessionUser | null {
    const token = cookies().get(SESSION_COOKIE_NAME)?.value;
    return token ? verifySessionToken(token) : null;
  }

  /**
   * Obtiene la sesión activa. La cuenta demostrativa solo se usa en desarrollo.
   */
  static getCurrentSession(): SessionUser {
    try {
      const verified = this.getAuthenticatedSession();
      if (verified) return verified;
    } catch {
      // En pre-renderizado estático cookies() puede no estar disponible
    }
    if (process.env.NODE_ENV === 'production') {
      return { id: 'guest', name: 'Sin sesión', email: '', role: 'CONSULTANT' };
    }
    return {
      id: FALLBACK_USERS[0].id,
      name: FALLBACK_USERS[0].name,
      email: FALLBACK_USERS[0].email,
      role: FALLBACK_USERS[0].role,
    };
  }

  /**
   * Autentica un usuario por correo y contraseña verificando hash bcrypt en Supabase
   * (con fallback seguro a usuarios semilla si no hay conexión).
   */
  static async authenticateUser(email: string, passwordPlain: string): Promise<SessionUser | null> {
    if (process.env.NODE_ENV === 'production' && passwordPlain === DEVELOPMENT_PASSWORD) return null;
    const cleanEmail = email.trim().toLowerCase();
    const prisma = getPrismaClient();

    if (prisma) {
      try {
        const dbUser = await prisma.user.findUnique({
          where: { email: cleanEmail },
        });
        if (dbUser) {
          const isValid = verifyPassword(passwordPlain, dbUser.passwordHash);
          if (isValid) {
            return {
              id: dbUser.id,
              name: dbUser.name,
              email: dbUser.email,
              role: dbUser.role as UserRole,
            };
          }
          return null;
        }
      } catch {
        // Fallback a memoria si falla red en entorno aislado
      }
    }

    if (process.env.NODE_ENV === 'production') return null;
    const fallback = FALLBACK_USERS.find((u) => u.email.toLowerCase() === cleanEmail);
    if (fallback && verifyPassword(passwordPlain, fallback.passwordHash)) {
      return {
        id: fallback.id,
        name: fallback.name,
        email: fallback.email,
        role: fallback.role,
      };
    }

    return null;
  }

  static getCookieName(): string {
    return SESSION_COOKIE_NAME;
  }

  static getPermissions(role: UserRole) {
    return getRolePermissions(role);
  }

  static hashUserPassword(plain: string): string {
    return hashPassword(plain);
  }
}
