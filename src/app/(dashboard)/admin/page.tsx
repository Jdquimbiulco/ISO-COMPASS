import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Plus, Shield, Sliders } from 'lucide-react';

export default function AdminPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          M7. Módulo de Administración y Control de Acceso
        </h1>
        <p className="text-sm text-gray-500">
          Gestión de roles de usuario (RBAC) y extensibilidad de normas (ISO 9001, ISO 25010) sin modificar código.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Usuarios Registrados</CardDescription>
            <CardTitle className="text-2xl font-bold">3 Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">Admin, Evaluador, Consultor</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Familias de Normas</CardDescription>
            <CardTitle className="text-2xl font-bold">1 Activa</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline">ISO/IEC 29110</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Partes de la Norma</CardDescription>
            <CardTitle className="text-2xl font-bold">13 Partes</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="success">Todas las de Tabla 6</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Control de Usuarios */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">Control de Acceso Basado en Roles (RBAC)</CardTitle>
              <CardDescription>Usuarios autorizados según RNF-03</CardDescription>
            </div>
            <Button size="sm" variant="outline">
              <Plus className="mr-1 h-3.5 w-3.5" /> Agregar Usuario
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
            <div className="py-3 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Administrador General</p>
                <p className="text-xs text-gray-500">admin@espe.edu.ec</p>
              </div>
              <Badge variant="default">ADMIN</Badge>
            </div>
            <div className="py-3 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Ing. Evaluador Calidad</p>
                <p className="text-xs text-gray-500">evaluador@espe.edu.ec</p>
              </div>
              <Badge variant="warning">EVALUATOR</Badge>
            </div>
            <div className="py-3 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Auditor Consultor</p>
                <p className="text-xs text-gray-500">consultor@espe.edu.ec</p>
              </div>
              <Badge variant="secondary">CONSULTANT (Solo Lectura)</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
