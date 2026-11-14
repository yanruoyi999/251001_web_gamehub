import Link from 'next/link';
import { OriginalExperimentPage } from '@/components/game/original-experiment-page';
import { WordLadder } from '@/components/game/word-ladder';
import { getLocalizedPath, locales } from '@/i18n/config';
import { buildOriginalExperimentMetadata, getOriginalExperimentPage } from '@/lib/games/luma-original-experiment-pages';

export const dynamic = 'force-static';

type PageProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps) {
  const locale = (await params).locale === 'en' ? 'en' : 'zh';
  return buildOriginalExperimentMetadata(getOriginalExperimentPage('word-ladder', locale), locale);
}

export default async function WordLadderPage({ params }: PageProps) {
  const locale = (await params).locale === 'en' ? 'en' : 'zh';
  const page = getOriginalExperimentPage('word-ladder', locale);

  return (
    <OriginalExperimentPage
      locale={locale}
      page={page}
      topLink={<Link href={getLocalizedPath(locale, '/games')}>{page.copy.backToGames}</Link>}
      game={<WordLadder locale={locale} />}
    />
  );
}
