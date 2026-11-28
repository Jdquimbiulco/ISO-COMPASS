'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, CheckSquare, BarChart3, FileSpreadsheet, Settings, Compass, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Inicio', href: '/', icon: Home },
  { name: 'Biblioteca', href: '/biblioteca', icon: BookOpen },
  { name: 'Evaluaciones', href: '/evaluaciones', icon: CheckSquare },
  { name: 'Tablero', href: '/tablero', icon: BarChart3 },
  { name: 'Reportes', href: '/reportes', icon: FileSpreadsheet },
  { name: 'Administración', href: '/admin', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex shrink-0 flex-col border-b border-brand-100 bg-white dark:border-gray-800 dark:bg-gray-950 lg:sticky lg:top-0 lg:h-dvh lg:w-60 lg:border-b-0 lg:border-r">
      <Link
        href="/"
        className="flex min-h-16 items-center gap-3 px-4 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-600 lg:px-5"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[0.7rem] bg-brand-700 text-white">
          <Compass className="h-5 w-5" aria-hidden="true" />
        </span>
        <span>
          <span className="block text-sm font-extrabold tracking-tight text-gray-950 dark:text-gray-50">ISO-COMPASS</span>
          <span className="block text-xs font-medium text-gray-600 dark:text-gray-400">Guía ISO/IEC 29110</span>
        </span>
      </Link>

      <nav aria-label="Módulos" className="flex gap-1.5 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-y-auto lg:px-4 lg:pt-5">
        {navigation.map(({ name, href, icon: Icon }) => {
          const isActive = pathname === href ||
            (href !== '/' && pathname.startsWith(href + '/')) ||
            (href === '/biblioteca' && pathname.startsWith('/normas/'));

          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex min-h-11 shrink-0 items-center gap-2.5 whitespace-nowrap rounded-lg px-3 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-600',
                isActive
                  ? 'bg-brand-50 font-semibold text-brand-800 dark:bg-brand-950 dark:text-brand-200'
                  : 'text-gray-700 hover:bg-brand-50 hover:text-brand-800 dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-brand-200'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {name}
            </Link>
          );
        })}
      </nav>

      <div className="hidden border-t border-brand-100 px-5 py-4 text-xs font-medium text-gray-600 dark:border-gray-800 dark:text-gray-400 lg:block">
        ESPE · Aseguramiento de la Calidad
      </div>
    </aside>
  );
}
