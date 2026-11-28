'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, LogIn, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface HeaderUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'EVALUATOR' | 'CONSULTANT';
}

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<HeaderUser>({
    id: 'usr-admin-01',
    name: 'Juan Quimbiulco (Administrador GP)',
    email: 'admin@espe.edu.ec',
    role: 'ADMIN',
  });
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    fetch('/api/auth')
      .then((r) => r.json())
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  const handleQuickRoleSwitch = async (targetEmail: string) => {
    setSwitching(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'quick_switch', roleSwitchEmail: targetEmail }),
      });
      const data = await res.json();
      if (data?.user) {
        setUser(data.user);
        window.dispatchEvent(new CustomEvent('iso-role-changed', { detail: data.user }));
        router.refresh();
      }
    } finally {
      setSwitching(false);
    }
  };

  const initials = user.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <header className="flex min-h-14 flex-wrap items-center justify-between gap-2 border-b border-brand-100 bg-white px-4 py-2 dark:border-gray-800 dark:bg-gray-950 sm:px-6 lg:sticky lg:top-0 lg:z-10 lg:min-h-16">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 hidden md:inline">
          Sistema de Gestión y Evaluación de Calidad
        </span>
        <Badge variant="outline" className="text-xs bg-brand-50 text-brand-700 border-brand-200">
          Perfil Básico VSE
        </Badge>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Selector Rápido de Rol RBAC (RNF-03 / M7) */}
        {process.env.NODE_ENV !== 'production' && <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-2.5 py-1">
          <Shield className="h-3.5 w-3.5 text-brand-600" />
          <span className="text-[11px] font-medium text-gray-500 hidden sm:inline">Simular Rol RBAC:</span>
          <select
            aria-label="Selector de rol RBAC"
            disabled={switching}
            value={user.email}
            onChange={(e) => handleQuickRoleSwitch(e.target.value)}
            className="max-w-40 cursor-pointer rounded bg-transparent text-xs font-semibold text-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600 dark:text-gray-200 sm:max-w-none"
          >
            <option value="admin@espe.edu.ec">ADMIN (Juan Quimbiulco)</option>
            <option value="evaluador@espe.edu.ec">EVALUATOR (Ing. Evaluador)</option>
            <option value="consultor@espe.edu.ec">CONSULTANT (Solo Lectura)</option>
          </select>
          {switching && <RefreshCw className="h-3 w-3 animate-spin text-brand-600" />}
        </div>}

        <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200 dark:border-gray-800">
          <div className="h-8 w-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
            {initials}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 leading-tight">
              {user.name}
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-brand-600 dark:text-brand-400 font-semibold">
                {user.role}
              </span>
              {user.email && <>
                <span className="text-[10px] text-gray-400">•</span>
                <span className="text-[10px] text-gray-500">{user.email}</span>
              </>}
            </div>
          </div>
          <Link href="/login" className="inline-flex min-h-9 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold text-brand-800 hover:bg-brand-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600 dark:text-brand-200 dark:hover:bg-gray-900">
            <LogIn className="h-4 w-4" aria-hidden="true" /> Acceso
          </Link>
        </div>
      </div>
    </header>
  );
}
