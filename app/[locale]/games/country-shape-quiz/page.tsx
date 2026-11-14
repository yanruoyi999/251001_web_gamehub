import Link from 'next/link';
import { CountryShapeQuiz } from '@/components/game/country-shape-quiz';
import { OriginalExperimentPage } from '@/components/game/original-experiment-page';
import { getLocalizedPath, locales } from '@/i18n/config';
import { buildOriginalExperimentMetadata, getOriginalExperimentPage } from '@/lib/games/luma-original-experiment-pages';

export const dynamic = 'force-static';
type PageProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export async function generateMetadata({ params }: PageProps) {
  const locale = (await params).locale === 'en' ? 'en' : 'zh';
  return buildOriginalExperimentMetadata(getOriginalExperimentPage('country-shape-quiz', locale), locale);
}

export default async function CountryShapePage({ params }: PageProps) {
  const locale = (await params).locale === 'en' ? 'en' : 'zh';
  const page = getOriginalExperimentPage('country-shape-quiz', locale);
  return <OriginalExperimentPage locale={locale} page={page}
    topLink={<Link href={getLocalizedPath(locale, '/games')}>{page.copy.backToGames}</Link>}
    game={<CountryShapeQuiz locale={locale} />} />;
}
