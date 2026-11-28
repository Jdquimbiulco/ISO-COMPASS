import Link from 'next/link';
import { StandardsService } from '@/services/standards.service';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, ArrowRight, BookOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BibliotecaPage() {
  const standards = await StandardsService.getAllStandards();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-brand-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-950 sm:p-8">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-brand-800 dark:text-brand-200">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            ISO/IEC 29110
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-950 dark:text-gray-100 sm:text-4xl">
            Biblioteca digital
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            Fichas, listas de verificación y enlaces oficiales de la familia de normas.
          </p>
        </div>
        <Badge variant="outline" className="border-brand-200 bg-brand-50 text-brand-800 dark:border-brand-900 dark:bg-brand-950 dark:text-brand-200">
          {standards.length} normas en el catálogo
        </Badge>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {standards.map((standard) => (
          <Card key={standard.code} className="flex flex-col justify-between transition-colors hover:border-brand-300">
            <CardHeader className="pb-4">
              <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                <Badge variant="outline" className="border-brand-200 bg-brand-50 font-mono text-brand-900 dark:border-brand-900 dark:bg-brand-950 dark:text-brand-200">
                  {standard.code}
                </Badge>
                <Badge variant={standard.accessType === 'FREE' ? 'success' : 'secondary'}>
                  {standard.accessType === 'FREE' ? 'Acceso libre' : 'Catálogo ISO'}
                </Badge>
              </div>
              <CardTitle className="text-base leading-snug">{standard.shortTitle}</CardTitle>
              <CardDescription className="text-xs leading-relaxed">{standard.title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <dl className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600 dark:text-gray-300">
                <div className="flex gap-1"><dt className="font-medium">Edición</dt><dd>{standard.edition}</dd></div>
                <div className="flex gap-1"><dt className="font-medium">Ítems</dt><dd>{standard.itemCount}</dd></div>
                <div className="w-full"><dt className="inline font-medium">Audiencia </dt><dd className="inline">{standard.targetAudience}</dd></div>
              </dl>
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-brand-100 pt-3 dark:border-gray-800">
                <Link
                  href={`/normas/${standard.code}`}
                  className="inline-flex min-h-9 items-center gap-2 rounded-md px-1 text-sm font-semibold text-brand-800 hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600 dark:text-brand-200"
                >
                  Ver ficha técnica <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                {standard.officialUrl && (
                  <a
                    href={standard.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Fuente ISO de ${standard.shortTitle} (abre en otra pestaña)`}
                    className="grid h-9 w-9 place-items-center rounded-lg border border-brand-100 text-brand-800 hover:bg-brand-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600 dark:border-gray-800 dark:text-brand-200 dark:hover:bg-gray-800"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
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
