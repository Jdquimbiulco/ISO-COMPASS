import { StandardsService } from '@/services/standards.service';
import { notFound } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, ExternalLink, Download, CheckSquare, ArrowLeft, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

interface StandardDetailPageProps {
  params: {
    code: string;
  };
}

export default async function StandardDetailPage({ params }: StandardDetailPageProps) {
  const standard = await StandardsService.getStandardByCode(params.code);

  if (!standard) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Botón Volver */}
      <Link href="/biblioteca">
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Volver al catálogo de normas
        </Button>
      </Link>

      {/* Cabecera de la Ficha Técnica */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
              {standard.code}
            </span>
            <Badge variant="outline">Edición {standard.edition}</Badge>
            <Badge variant={standard.accessType === 'FREE' ? 'success' : 'secondary'}>
              {standard.accessType === 'FREE' ? 'Documento Libre' : 'Catálogo de Pago ISO'}
            </Badge>
          </div>

          {/* M3. Botón de Descarga / Consulta Oficial con Respeto de Derechos de Autor */}
          <div className="flex items-center gap-2">
            {standard.accessType === 'FREE' ? (
              <a href={standard.officialUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="default" size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                  <Download className="mr-2 h-4 w-4" /> Descargar o Consultar Norma (Libre)
                </Button>
              </a>
            ) : (
              <a href={standard.officialUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  <ExternalLink className="mr-2 h-4 w-4" /> Ver Ficha Oficial en Catálogo ISO
                </Button>
              </a>
            )}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{standard.title}</h1>
        <p className="text-sm text-gray-500 font-medium">
          Audiencia objetivo: <span className="text-gray-800 dark:text-gray-200">{standard.targetAudience}</span>
        </p>

        {/* Nota de Derechos de Autor (Sección 4.7 de la Guía) */}
        <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-3 rounded-lg text-xs text-amber-800 dark:text-amber-300">
          <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
          <p>
            <strong>Aviso de Derechos de Autor:</strong> Las normas ISO/IEC están protegidas por propiedad intelectual. 
            Este sistema no almacena ni redistribuye copias ilegales de documentos de pago; enlaza directamente al 
            portal oficial o a copias institucionales autorizadas.
          </p>
        </div>
      </div>

      {/* Introducción y Propósito */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Propósito e Introducción (Paráfrasis Técnica)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          <p><strong>Propósito:</strong> {standard.purpose}</p>
          <p className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
            {standard.introduction}
          </p>
        </CardContent>
      </Card>

      {/* Apartados y Lista de Verificación Base */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Apartados y Lista de Verificación Base
          </h2>
          <Link href="/evaluaciones">
            <Button variant="default" size="sm">
              <CheckSquare className="mr-2 h-4 w-4" /> Evaluar Esta Norma
            </Button>
          </Link>
        </div>

        {standard.sections.map((section: any) => (
          <Card key={section.code}>
            <CardHeader className="py-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  <span className="font-mono text-blue-600 mr-2">{section.code}:</span>
                  {section.name}
                </CardTitle>
                <Badge variant="outline">{section.items.length} ítems</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                {section.items.map((item: any) => (
                  <li key={item.code} className="py-3 flex flex-col sm:flex-row justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-gray-700">{item.code}</span>
                        <Badge variant="secondary" className="text-[10px]">Rol: {item.targetRole}</Badge>
                      </div>
                      <p className="text-gray-800 dark:text-gray-200">{item.statement}</p>
                      <p className="text-xs text-gray-500">
                        <strong className="text-gray-700">Evidencia esperada:</strong> {item.expectedDeliverable}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
