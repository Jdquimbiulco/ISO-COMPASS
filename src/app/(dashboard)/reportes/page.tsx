'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, FileText, Download, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function ReportesPage() {
  const [downloading, setDownloading] = useState(false);

  const handleExportCSV = () => {
    setDownloading(true);
    // Generar archivo CSV en el cliente
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Código,Práctica,Calificación,Producto Esperado,Rol\n' +
      'GP.1,Revisión Enunciado del trabajo,Cumple,Plan del proyecto,GP\n' +
      'GP.2,Plan del proyecto aprobado,Cumple,Plan aprobado,GP\n' +
      'GP.6,Solicitudes de cambio,No cumple,Registro de cambios,GP\n' +
      'IS.3,Matriz de trazabilidad,Cumple parcialmente,Diseño de software,DIS\n' +
      'IS.4,Pruebas unitarias automatizadas,Cumple parcialmente,Resultados de pruebas,PR\n';

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Reporte_ISO29110_AndesTech.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloading(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          M6. Generación de Reportes Formales de Resultados
        </h1>
        <p className="text-sm text-gray-500">
          Exporta el estado de conformidad, matriz de brechas y firmas para auditoría o evaluación.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:border-brand-300 transition-colors">
          <CardHeader>
            <div className="h-10 w-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center mb-2">
              <FileText className="h-5 w-5" />
            </div>
            <CardTitle>Exportar Dictamen en PDF</CardTitle>
            <CardDescription>
              Documento formal con membrete institucional de la ESPE, fecha, evaluador responsable y tabla de brechas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="default"
              className="w-full bg-red-600 hover:bg-red-700"
              onClick={() => alert('Generando PDF formal con membrete ESPE...')}
            >
              <Download className="mr-2 h-4 w-4" /> Descargar PDF Oficial
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-emerald-300 transition-colors">
          <CardHeader>
            <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <CardTitle>Exportar Matriz a Hoja de Cálculo</CardTitle>
            <CardDescription>
              Archivo en formato CSV / Excel compatible con auditorías de datos, fórmulas y análisis tabular.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="default"
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              onClick={handleExportCSV}
              disabled={downloading}
            >
              <Download className="mr-2 h-4 w-4" /> Descargar Excel / CSV
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
