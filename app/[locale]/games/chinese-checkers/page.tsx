import type { Metadata } from 'next';
import Link from 'next/link';

import { ChineseCheckers } from '@/components/game/chinese-checkers';
import { OriginalExperimentPage } from '@/components/game/original-experiment-page';
import { getLocalizedPath, locales, type Locale } from '@/i18n/config';
import { buildOriginalExperimentMetadata, getOriginalExperimentPage } from '@/lib/games/luma-original-experiment-pages';

export const dynamic = 'force-static';
export const revalidate = 86_400;

interface PageProps { params: Promise<{ locale: string }> }
function resolveLocale(value: string): Locale { return value === 'en' ? 'en' : 'zh'; }
export function generateStaticParams() { return locales.map((locale) => ({ locale })); }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: value } = await params;
  const locale = resolveLocale(value);
  return buildOriginalExperimentMetadata(getOriginalExperimentPage('chinese-checkers', locale), locale);
}
export default async function ChineseCheckersPage({ params }: PageProps) {
  const { locale: value } = await params;
  const locale = resolveLocale(value);
  const page = getOriginalExperimentPage('chinese-checkers', locale);
  return <OriginalExperimentPage locale={locale} page={page} topLink={<Link href={getLocalizedPath(locale, '/games')}>{page.copy.backToGames}</Link>} game={<ChineseCheckers locale={locale} />} />;
}
