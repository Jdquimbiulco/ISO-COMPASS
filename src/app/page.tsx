import Link from 'next/link';
import { BookOpen, CheckSquare, BarChart3, FileSpreadsheet, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from './(dashboard)/layout';

export default function HomePage() {
  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Banner de Bienvenida */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 rounded-2xl p-8 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <Badge variant="outline" className="text-white border-white/30 bg-white/10 backdrop-blur-sm">
              Universidad de las Fuerzas Armadas ESPE
            </Badge>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Sistema ISO-COMPASS
            </h1>
            <p className="text-blue-100 text-sm leading-relaxed">
              Guía digital, listas de verificación y tablero de control para la familia de normas 
              <strong> ISO/IEC 29110</strong> en Entidades Muy Pequeñas (VSEs).
            </p>
            <div className="flex gap-3 pt-2">
              <Link href="/biblioteca">
                <Button variant="secondary" className="font-semibold text-blue-900">
                  Explorar Biblioteca <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/tablero">
                <Button variant="outline" className="text-white border-white/40 hover:bg-white/10">
                  Ver Tablero de Estado
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Resumen de Módulos Obligatorios */}
        <div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-4">
            Módulos Principales del Sistema
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 mb-2">
                  <BookOpen className="h-5 w-5" />
                </div>
                <CardTitle>M1 & M2. Biblioteca Digital</CardTitle>
                <CardDescription>
                  13 partes de la serie ISO 29110 con fichas técnicas, propósito, audiencia y mapa interactivo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/biblioteca">
                  <Button variant="ghost" size="sm" className="w-full justify-between">
                    Consultar normas <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 mb-2">
                  <CheckSquare className="h-5 w-5" />
                </div>
                <CardTitle>M4. Listas de Verificación</CardTitle>
                <CardDescription>
                  Evaluación interactiva por apartado: Cumple (C), Parcial (P), No cumple (NC) o No aplica (NA).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/evaluaciones">
                  <Button variant="ghost" size="sm" className="w-full justify-between">
                    Iniciar evaluación <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 mb-2">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <CardTitle>M5. Tablero de Estado</CardTitle>
                <CardDescription>
                  Cálculo automatizado del cumplimiento mediante fórmula oficial y reporte de brechas (*gaps*).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/tablero">
                  <Button variant="ghost" size="sm" className="w-full justify-between">
                    Ver indicadores <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Regla de negocio destacada */}
        <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
          <CardContent className="p-6 flex items-start gap-4">
            <CheckCircle2 className="h-6 w-6 text-blue-600 mt-1 shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Fórmula de Cálculo Oficial Implementada
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 font-mono">
                Cumplimiento (%) = [ (C + 0.5 × P) / (T − NA) ] × 100
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Totalmente respaldado con pruebas unitarias automatizadas en <code>tests/compliance-calculator.test.mjs</code>.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
