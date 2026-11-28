'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, Mail, KeyRound, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const DEMO_ACCOUNTS = [
  {
    name: 'Juan Quimbiulco (Administrador GP)',
    email: 'admin@espe.edu.ec',
    role: 'ADMIN',
    badge: 'Control Total (M7, Familias, Usuarios)',
  },
  {
    name: 'Ing. Evaluador Calidad',
    email: 'evaluador@espe.edu.ec',
    role: 'EVALUATOR',
    badge: 'Califica Checklists M4 y Evidencias',
  },
  {
    name: 'Auditor Consultor',
    email: 'consultor@espe.edu.ec',
    role: 'CONSULTANT',
    badge: 'Solo Lectura (Biblioteca y Reportes)',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const development = process.env.NODE_ENV !== 'production';
  const [email, setEmail] = useState(development ? 'admin@espe.edu.ec' : '');
  const [password, setPassword] = useState(development ? 'Password123!' : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'No se pudo iniciar sesión.');
        setLoading(false);
        return;
      }
      router.push(data.user?.role === 'ADMIN' ? '/admin' : '/evaluaciones');
      router.refresh();
    } catch {
      setError('Error de conexión con el servidor.');
      setLoading(false);
    }
  };

  const selectDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Columna Izquierda: Información de Seguridad RNF-03 */}
        <div className="space-y-5">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none text-gray-900 dark:text-gray-100">
                ISO-COMPASS
              </h1>
              <p className="text-xs text-gray-500">Sistema Guía ISO/IEC 29110 — ESPE</p>
            </div>
          </Link>

          <div className="space-y-2">
            <Badge variant="outline" className="bg-brand-50 text-brand-700 border-brand-200">
              Seguridad RNF-03 & Módulo M7 (RBAC)
            </Badge>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
              Control de Acceso Basado en Roles
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Autenticación con contraseñas cifradas mediante <code>bcryptjs</code> y sesión firmada con{' '}
              <code>HMAC-SHA256</code> conectada a PostgreSQL en Supabase.
            </p>
          </div>

          {development && <div className="space-y-2.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Cuentas de Prueba para Evaluación Docente (Clic para autocompletar):
            </p>
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => selectDemoAccount(acc.email)}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                  email === acc.email
                    ? 'border-brand-600 bg-brand-50/70 dark:bg-brand-950/40 shadow-xs'
                    : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-brand-300'
                }`}
              >
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-gray-100">{acc.name}</p>
                  <p className="text-[11px] font-mono text-brand-600 dark:text-brand-400">{acc.email}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{acc.badge}</p>
                </div>
                <Badge
                  variant={
                    acc.role === 'ADMIN'
                      ? 'default'
                      : acc.role === 'EVALUATOR'
                      ? 'warning'
                      : 'secondary'
                  }
                >
                  {acc.role}
                </Badge>
              </button>
            ))}
          </div>}
        </div>

        {/* Columna Derecha: Formulario de Inicio de Sesión */}
        <Card className="shadow-lg border-gray-200 dark:border-gray-800">
          <CardHeader>
            <div className="flex items-center gap-2 text-brand-600 mb-1">
              <Lock className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Acceso Institucional</span>
            </div>
            <CardTitle className="text-xl">Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para acceder con los permisos de tu rol ISO/IEC 29110.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-gray-400" /> Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@espe.edu.ec"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5 text-gray-400" /> Contraseña Cifrada
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                {development && <p className="text-[11px] text-gray-500">
                  Contraseña por defecto de las cuentas semilla: <code className="font-mono font-semibold">Password123!</code>
                </p>}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Verificando credenciales...' : 'Autenticar y Entrar al Sistema'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Hash Bcrypt Activo
                </span>
                <Link href="/" className="hover:underline text-brand-600">
                  Volver al Dashboard →
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
