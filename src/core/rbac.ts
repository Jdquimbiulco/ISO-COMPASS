import bcrypt from 'bcryptjs';

export type UserRole = 'ADMIN' | 'EVALUATOR' | 'CONSULTANT';

export interface RBACPermissions {
  role: UserRole;
  roleLabel: string;
  canManageUsers: boolean;
  canManageFamiliesAndStandards: boolean;
  canEditEvaluations: boolean;
  canReadLibraryAndReports: boolean;
}

const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Administrador (GP / Configuración)',
  EVALUATOR: 'Evaluador de Calidad',
  CONSULTANT: 'Auditor Consultor (Solo Lectura)',
};

/**
 * Obtiene la matriz de permisos de un rol según RNF-03 y Módulo M7:
 * - ADMIN: Control total (usuarios, familias, normas, apartados, evaluaciones y reportes).
 * - EVALUATOR: Califica listas de verificación, adjunta evidencias y consulta biblioteca/reportes.
 * - CONSULTANT: Solo lectura de biblioteca, fichas técnicas, tableros y reportes.
 */
export function getRolePermissions(role: UserRole): RBACPermissions {
  switch (role) {
    case 'ADMIN':
      return {
        role,
        roleLabel: ROLE_LABELS.ADMIN,
        canManageUsers: true,
        canManageFamiliesAndStandards: true,
        canEditEvaluations: true,
        canReadLibraryAndReports: true,
      };
    case 'EVALUATOR':
      return {
        role,
        roleLabel: ROLE_LABELS.EVALUATOR,
        canManageUsers: false,
        canManageFamiliesAndStandards: false,
        canEditEvaluations: true,
        canReadLibraryAndReports: true,
      };
    case 'CONSULTANT':
    default:
      return {
        role: 'CONSULTANT',
        roleLabel: ROLE_LABELS.CONSULTANT,
        canManageUsers: false,
        canManageFamiliesAndStandards: false,
        canEditEvaluations: false,
        canReadLibraryAndReports: true,
      };
  }
}

/**
 * Cifra una contraseña en texto plano utilizando bcrypt (RNF-03).
 */
export function hashPassword(plainPassword: string): string {
  return bcrypt.hashSync(plainPassword, 10);
}

/**
 * Verifica una contraseña en texto plano contra su hash cifrado (RNF-03).
 */
export function verifyPassword(plainPassword: string, passwordHash: string): boolean {
  if (!plainPassword || !passwordHash) return false;
  return bcrypt.compareSync(plainPassword, passwordHash);
}
