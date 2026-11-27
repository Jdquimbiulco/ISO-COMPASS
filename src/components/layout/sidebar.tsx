'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, CheckSquare, BarChart3, FileSpreadsheet, Settings, ShieldCheck, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Inicio', href: '/', icon: Home },
  { name: 'M1. Biblioteca Digital', href: '/biblioteca', icon: BookOpen },
  { name: 'M4. Evaluaciones & Checklists', href: '/evaluaciones', icon: CheckSquare },
  { name: 'M5. Tablero de Estado', href: '/tablero', icon: BarChart3 },
  { name: 'M6. Reportes & Exportación', href: '/reportes', icon: FileSpreadsheet },
  { name: 'M7. Administración', href: '/admin', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex flex-col h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800 gap-3">
        <ShieldCheck className="h-7 w-7 text-blue-600" />
        <div>
          <h1 className="font-bold text-base leading-tight tracking-tight text-gray-900 dark:text-gray-100">
            ISO-COMPASS
          </h1>
          <p className="text-xs text-gray-500 font-medium">Guía ISO/IEC 29110</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
        <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
          Módulos del Sistema
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-gray-100'
              )}
            >
              <Icon className={cn('h-4 w-4', isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400')} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">ESPE - Aseguramiento</p>
          <p className="text-[11px] text-gray-500">Parcial 2 | Perfil Básico VSE</p>
        </div>
      </div>
    </aside>
  );
}
