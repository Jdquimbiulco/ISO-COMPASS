import { User, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function Header() {
  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Sistema de Gestión y Evaluación de Calidad
        </span>
        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
          Perfil Básico VSE
        </Badge>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-gray-500 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900">
          <Bell className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-gray-200 dark:border-gray-800">
          <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
            ES
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-medium text-gray-900 dark:text-gray-100">Equipo ESPE</p>
            <p className="text-[10px] text-gray-500">Rol: Evaluador / Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
