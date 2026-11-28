import { NextResponse } from 'next/server';
import { AdminService } from '@/services/admin.service';
import { AuthService, DEVELOPMENT_PASSWORD } from '@/services/auth.service';
import { getRolePermissions, UserRole } from '@/core/rbac';

export async function GET() {
  const session = AuthService.getCurrentSession();
  const permissions = getRolePermissions(session.role);
  if (!permissions.canManageUsers && !permissions.canManageFamiliesAndStandards) {
    return NextResponse.json({ session, permissions, error: 'Se requiere una cuenta administradora.' }, { status: 403 });
  }
  const data = await AdminService.getDashboardData();

  return NextResponse.json({
    session,
    permissions,
    ...data,
  });
}

export async function POST(request: Request) {
  try {
    const session = AuthService.getCurrentSession();
    const permissions = getRolePermissions(session.role);

    if (!permissions.canManageUsers && !permissions.canManageFamiliesAndStandards) {
      return NextResponse.json(
        {
          error: `Acceso denegado (RBAC): Tu rol actual (${session.role}) no tiene privilegios de Administrador para modificar registros en M7.`,
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { entity, action } = body;

    // 1. Gestión de Usuarios RBAC
    if (entity === 'user') {
      if (action === 'create') {
        if (process.env.NODE_ENV === 'production' &&
          (typeof body.password !== 'string' || !body.password.trim() || body.password === DEVELOPMENT_PASSWORD)) {
          return NextResponse.json({ error: 'Asigna una contraseña propia a la cuenta.' }, { status: 400 });
        }
        const created = await AdminService.createUser({
          name: body.name,
          email: body.email,
          passwordPlain: body.password || DEVELOPMENT_PASSWORD,
          role: (body.role as UserRole) || 'EVALUATOR',
        });
        return NextResponse.json({ ok: true, user: created });
      }
      if (action === 'update_role') {
        await AdminService.updateUserRole(body.userId, body.role as UserRole);
        return NextResponse.json({ ok: true });
      }
      if (action === 'delete') {
        await AdminService.deleteUser(body.userId);
        return NextResponse.json({ ok: true });
      }
    }

    // 2. Gestión de Familias de Normas (Extensibilidad ISO 9001, ISO/IEC 25010)
    if (entity === 'family') {
      if (action === 'create') {
        const created = await AdminService.createFamily({
          code: body.code,
          name: body.name,
          description: body.description,
        });
        return NextResponse.json({ ok: true, family: created });
      }
      if (action === 'delete') {
        await AdminService.deleteFamily(body.familyId);
        return NextResponse.json({ ok: true });
      }
    }

    // 3. Gestión de Normas, Apartados e Ítems (RF-15)
    if (entity === 'standard') {
      if (action === 'upsert') {
        const saved = await AdminService.upsertStandard({
          familyCode: body.familyCode || 'ISO-29110',
          code: body.code,
          title: body.title,
          shortTitle: body.shortTitle,
          edition: body.edition,
          category: body.category || 'GUIDELINES',
          targetAudience: body.targetAudience,
          purpose: body.purpose,
          introduction: body.introduction,
          officialUrl: body.officialUrl,
          accessType: body.accessType || 'ISO_PAID',
          initialSectionCode: body.initialSectionCode,
          initialSectionName: body.initialSectionName,
          initialItemCode: body.initialItemCode,
          initialItemStatement: body.initialItemStatement,
          initialItemDeliverable: body.initialItemDeliverable,
          initialItemRole: body.initialItemRole,
        });
        return NextResponse.json({ ok: true, standard: saved });
      }
      if (action === 'delete') {
        await AdminService.deleteStandard(body.standardId);
        return NextResponse.json({ ok: true });
      }
    }

    return NextResponse.json({ error: 'Acción no reconocida en M7.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Error en operación M7: ' + (err?.message || 'Error interno') },
      { status: 500 }
    );
  }
}
