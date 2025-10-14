import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { loadImported4399Games } from '@/lib/games/imported-4399';

interface PageProps {
  params: { locale: string };
}

export const dynamic = 'force-dynamic';

export default async function Imported4399SamplePage({ params }: PageProps) {
  const { locale } = params;
  const t = await getTranslations('Imported4399');
  const games = await loadImported4399Games(6);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600">{t('desc')}</p>
        </div>

        <Link
          href={`/${locale}/games`}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          {t('backToGames')}
        </Link>
      </header>

      <section className="mb-8 rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
        {t('notice')}
      </section>

      {games.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-gray-600">
          {t('empty')}
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {games.map((game) => (
            <Card key={game.slug} className="overflow-hidden">
              <CardHeader className="space-y-3 bg-gray-50">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {game.title || game.titleEn}
                  </CardTitle>
                  {game.titleEn && game.titleEn !== game.title ? (
                    <p className="text-sm text-gray-500">{game.titleEn}</p>
                  ) : null}
                </div>
                <p className="text-sm text-gray-500">{t('onsiteHint')}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="aspect-video w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                  <iframe
                    key={game.iframeUrl}
                    src={game.iframeUrl}
                    title={game.title || game.titleEn}
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin"
                    allow="fullscreen; gamepad; pointer-lock"
                    referrerPolicy="no-referrer"
                    className="h-full w-full"
                  />
                </div>

                <Button asChild className="w-full">
                  <Link href={`/${locale}/games/${game.slug}`}>
                    {t('cta')}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
