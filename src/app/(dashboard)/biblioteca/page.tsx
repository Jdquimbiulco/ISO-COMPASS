import Link from 'next/link';
import { StandardsService } from '@/services/standards.service';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BibliotecaPage() {
  const standards = await StandardsService.getAllStandards();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            M1 & M2. Biblioteca Digital de la Familia ISO/IEC 29110
          </h1>
          <p className="text-sm text-gray-500">
            Catálogo completo de las 13 partes de la norma para Entidades Muy Pequeñas (VSEs).
          </p>
        </div>
      </div>

      {/* Grid de Normas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {standards.map((std) => (
          <Card key={std.code} className="flex flex-col justify-between hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-2 mb-2">
                <Badge variant="outline" className="font-mono text-xs font-semibold bg-gray-50">
                  {std.code}
                </Badge>
                <Badge
                  variant={std.accessType === 'FREE' ? 'success' : 'secondary'}
                  className="text-[10px]"
                >
                  {std.accessType === 'FREE' ? 'Acceso Libre' : 'Catálogo ISO'}
                </Badge>
              </div>
              <CardTitle className="text-base leading-snug">{std.shortTitle}</CardTitle>
              <CardDescription className="text-xs line-clamp-2 mt-1">
                {std.title}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0 space-y-4">
              <div className="text-xs text-gray-500 space-y-1 bg-gray-50 dark:bg-gray-900 p-2.5 rounded-lg border border-gray-100 dark:border-gray-800">
                <p><span className="font-medium text-gray-700 dark:text-gray-300">Edición:</span> {std.edition}</p>
                <p><span className="font-medium text-gray-700 dark:text-gray-300">Audiencia:</span> {std.targetAudience}</p>
                <p><span className="font-medium text-gray-700 dark:text-gray-300">Ítems de verificación:</span> {std.itemCount}</p>
              </div>

              <div className="flex gap-2">
                <Link href={`/normas/${std.code}`} className="flex-1">
                  <Button variant="default" size="sm" className="w-full text-xs">
                    Ver Ficha Técnica <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </Link>
                {std.officialUrl && (
                  <a href={std.officialUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="px-2" title="Consultar fuente oficial ISO">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
