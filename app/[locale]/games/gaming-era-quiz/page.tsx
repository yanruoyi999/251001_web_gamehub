import type { Metadata } from 'next';
import Link from 'next/link';
import { GamingEraQuiz } from '@/components/game/gaming-era-quiz';
import { getLocalizedPath, type Locale } from '@/i18n/config';
import { gamingEraQuiz } from '@/lib/games/gaming-era-quiz';

const path = '/games/gaming-era-quiz';
type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const title = gamingEraQuiz.title[locale];
  const description = gamingEraQuiz.intro[locale];
  const canonical = getLocalizedPath(locale, path);
  return {
    title,
    description,
    robots: { index: false, follow: true },
    alternates: {
      canonical,
      languages: {
        'en-US': getLocalizedPath('en', path),
        'zh-CN': getLocalizedPath('zh', path),
      },
    },
    openGraph: { title, description, url: canonical, type: 'website' },
  };
}

export default async function GamingEraPage({ params }: PageProps) {
  const { locale } = await params;
  return (
    <article className="mx-auto max-w-2xl px-5 py-12 sm:py-16">
      <Link
        href={getLocalizedPath(locale, '/guides/quick-play-guide')}
        className="text-sm font-medium text-primary hover:underline"
      >
        {locale === 'zh' ? '快速游玩指南' : 'Quick Play Guide'}
      </Link>
      <h1 className="mt-6 text-4xl font-bold tracking-tight">
        {gamingEraQuiz.title[locale]}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        {gamingEraQuiz.intro[locale]}
      </p>
      <GamingEraQuiz locale={locale} />
    </article>
  );
}
