import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle2, Download } from 'lucide-react';
import Link from 'next/link';

export default function TableroPage() {
  // Datos demostrativos calculados con la fórmula para la VSE AndesTech Solutions
  const totalItems = 13; // Perfil Básico: 7 GP + 6 IS
  const c = 8;
  const p = 3;
  const nc = 1;
  const na = 1;
  const applicable = totalItems - na; // 12
  const score = c + 0.5 * p; // 8 + 1.5 = 9.5
  const percentage = Math.round((score / applicable) * 1000) / 10; // 79.2% -> En progreso

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            M5. Tablero de Estado de Aplicación y Madurez
          </h1>
          <p className="text-sm text-gray-500">
            Indicadores de cumplimiento en tiempo real para: <strong>AndesTech Solutions (VSE Piloto)</strong>
          </p>
        </div>

        <Link href="/reportes">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> Exportar Reporte Formal
          </Button>
        </Link>
      </div>

      {/* Tarjetas de Métricas Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Porcentaje de Cumplimiento</CardDescription>
            <CardTitle className="text-3xl font-extrabold text-blue-600">{percentage}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500 font-mono">Fórmula: (8 + 0.5×3)/(13 - 1) × 100</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Estado de Aplicación (Tabla 4)</CardDescription>
            <CardTitle className="text-2xl font-bold text-amber-600">En progreso</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="warning">Rango 40% a 79%</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Ítems Evaluados</CardDescription>
            <CardTitle className="text-3xl font-extrabold text-gray-900">{totalItems}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">8 Conformes | 3 Parciales | 1 Brecha</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Perfil Objetivo</CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-600">Perfil Básico</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="success">Procesos GP e IS</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Matriz de Brechas (GAPs) Identificadas */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-lg">Brechas Identificadas (Ítems Parciales o No Cumplidos)</CardTitle>
          </div>
          <CardDescription>
            Acciones correctivas necesarias antes de proceder a la auditoría formal de certificación.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900 text-xs text-gray-500 uppercase border-y">
                <tr>
                  <th className="py-3 px-4">Código</th>
                  <th className="py-3 px-4">Práctica / Apartado</th>
                  <th className="py-3 px-4">Calificación</th>
                  <th className="py-3 px-4">Producto Esperado</th>
                  <th className="py-3 px-4">Rol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                <tr>
                  <td className="py-3 px-4 font-mono font-semibold text-xs">GP.6</td>
                  <td className="py-3 px-4">Registro y evaluación formal de solicitudes de cambio del cliente.</td>
                  <td className="py-3 px-4"><Badge variant="destructive">No cumple</Badge></td>
                  <td className="py-3 px-4 text-xs text-gray-600">Registro de solicitudes de cambio</td>
                  <td className="py-3 px-4 font-mono text-xs">GP, CL</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-semibold text-xs">IS.3</td>
                  <td className="py-3 px-4">Matriz de trazabilidad bidireccional entre diseño detallado y requisitos.</td>
                  <td className="py-3 px-4"><Badge variant="warning">Cumple parcialmente</Badge></td>
                  <td className="py-3 px-4 text-xs text-gray-600">Matriz de trazabilidad de diseño</td>
                  <td className="py-3 px-4 font-mono text-xs">DIS, LT</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-semibold text-xs">IS.4</td>
                  <td className="py-3 px-4">Pruebas unitarias automatizadas para los componentes centrales.</td>
                  <td className="py-3 px-4"><Badge variant="warning">Cumple parcialmente</Badge></td>
                  <td className="py-3 px-4 text-xs text-gray-600">Resultados de pruebas unitarias</td>
                  <td className="py-3 px-4 font-mono text-xs">PR</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
