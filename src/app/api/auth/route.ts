import { NextResponse } from 'next/server';
import { AuthService, createSessionToken, FALLBACK_USERS } from '@/services/auth.service';
import { getRolePermissions } from '@/core/rbac';

export async function GET() {
  const user = AuthService.getCurrentSession();
  const permissions = getRolePermissions(user.role);
  return NextResponse.json({ user, permissions });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, password, roleSwitchEmail } = body;

    // 1. Cerrar sesión (vuelve a modo Consultor o pide login)
    if (action === 'logout') {
      const response = NextResponse.json({ ok: true, message: 'Sesión cerrada' });
      response.cookies.delete(AuthService.getCookieName());
      return response;
    }

    // 2. Cambio rápido demostrativo de rol RBAC (para evaluación del docente)
    if (action === 'quick_switch' && roleSwitchEmail) {
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Inicia sesión para cambiar de cuenta.' }, { status: 403 });
      }
      const targetUser =
        (await AuthService.authenticateUser(roleSwitchEmail, 'Password123!')) ||
        FALLBACK_USERS.find((u) => u.email === roleSwitchEmail) ||
        FALLBACK_USERS[0];

      const sessionUser = {
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
      };
      const token = createSessionToken(sessionUser);
      const response = NextResponse.json({
        ok: true,
        user: sessionUser,
        permissions: getRolePermissions(sessionUser.role),
      });
      response.cookies.set(AuthService.getCookieName(), token, {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      });
      return response;
    }

    // 3. Login tradicional con correo y contraseña cifrada (RNF-03)
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Por favor ingresa tu correo institucional y contraseña.' },
        { status: 400 }
      );
    }

    const authenticated = await AuthService.authenticateUser(email, password);
    if (!authenticated) {
      return NextResponse.json(
        { error: 'Credenciales inválidas. Verifica tu correo y contraseña.' },
        { status: 401 }
      );
    }

    const token = createSessionToken(authenticated);
    const response = NextResponse.json({
      ok: true,
      user: authenticated,
      permissions: getRolePermissions(authenticated.role),
    });

    response.cookies.set(AuthService.getCookieName(), token, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Error procesando la autenticación: ' + (err?.message || 'Error interno') },
      { status: 500 }
    );
  }
}
