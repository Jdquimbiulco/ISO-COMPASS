import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckSquare, Plus, ArrowRight, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function EvaluacionesPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            M4. Listas de Verificación y Evaluaciones
          </h1>
          <p className="text-sm text-gray-500">
            Registra y califica el cumplimiento de cada apartado por organización evaluada.
          </p>
        </div>

        <Button variant="default" size="sm">
          <Plus className="mr-2 h-4 w-4" /> Nueva Evaluación
        </Button>
      </div>

      {/* Evaluación Activa Demostrativa */}
      <Card className="border-l-4 border-l-blue-600">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="h-4 w-4 text-blue-600" />
                <CardTitle className="text-lg">AndesTech Solutions (VSE Piloto)</CardTitle>
              </div>
              <CardDescription>
                Equipo: 6 desarrolladores | Perfil Objetivo: Perfil Básico (29110-5-1-2)
              </CardDescription>
            </div>
            <Badge variant="warning">En progreso (79.2%)</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Evaluación integral de los procesos de <strong>Gestión del Proyecto (GP)</strong> e{' '}
            <strong>Implementación de Software (IS)</strong>.
          </p>

          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-gray-500 font-mono">Última actualización: Noviembre 2026</span>
            <Link href="/tablero">
              <Button variant="default" size="sm">
                Continuar Evaluación <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
