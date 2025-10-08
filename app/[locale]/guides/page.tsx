import type { Metadata } from 'next';
import Link from 'next/link';
import { locales, type Locale } from '@/i18n/config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSeoLandingPages } from '@/lib/seo-landing-content';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = (params.locale as Locale) ?? 'zh';
  const heading = locale === 'zh' ? '游戏主题攻略与无广告合集' : 'Game Guides & Ad-Free Collections';
  const description =
    locale === 'zh'
      ? '发现 GameHub 精选的主题攻略页面：无广告游戏、移动端体验以及随时解闷的轻量作品。'
      : 'Explore GameHub’s curated guides: ad-free playlists, mobile-friendly picks, and quick boredom busters.';

  const basePath = `/${locale}/guides`;

  return {
    title: locale === 'zh' ? '游戏攻略与主题合集' : 'Game Guides and Collections',
    description,
    keywords:
      locale === 'zh'
        ? ['游戏攻略', '无广告小游戏', 'iPhone 游戏推荐', '打发时间的小游戏']
        : ['game guides', 'ad-free games', 'best free iphone games', 'games to play when bored'],
    alternates: {
      canonical: basePath,
      languages: Object.fromEntries(
        locales.map((loc) => [
          loc === 'zh' ? 'zh-CN' : 'en-US',
          `/${loc}/guides`,
        ]),
      ),
    },
    openGraph: {
      title: heading,
      description,
      url: basePath,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: heading,
      description,
    },
  };
}

interface GuidesPageProps {
  params: { locale: string };
}

export default function GuidesPage({ params }: GuidesPageProps) {
  const locale = (params.locale as Locale) ?? 'zh';
  const pages = getSeoLandingPages();
  const heading = locale === 'zh' ? '专题合集' : 'Curated Guides';
  const intro =
    locale === 'zh'
      ? '从零广告玩法到移动端体验，我们为不同场景整理了精选游戏列表。选择一个主题，立即找到合适的浏览器游戏。'
      : 'From ad-free sessions to mobile touch hits, these guides highlight the best browser games for every moment. Pick a theme and jump straight into play.';

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-900">{heading}</h1>
        <p className="mt-4 text-base text-gray-600">{intro}</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {pages.map((page) => {
          const content = page.locales[locale];
          const href = `/${locale}/guides/${page.slug}`;
          const summary = content.overview[0] ?? '';

          return (
            <Card key={page.slug} className="flex h-full flex-col justify-between">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-900">
                  {content.heading}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between gap-6 text-sm text-gray-600">
                <p>{summary}</p>
                <div className="mt-auto">
                  <Link
                    href={href}
                    className="inline-flex items-center text-indigo-600 transition hover:text-indigo-800"
                    prefetch
                  >
                    {locale === 'zh' ? '阅读完整攻略' : 'Read the full guide'} →
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <footer className="mt-12 text-center text-sm text-gray-500">
        {locale === 'zh'
          ? '提示：收藏本页，随时获取最新的无广告游戏与主题合集。'
          : 'Tip: Bookmark this page to see newly published ad-free and themed collections as soon as they land.'}
      </footer>
    </div>
  );
}
