import type { Metadata } from 'next';
import Link from 'next/link';

import { SavedGames } from '@/components/game/saved-games';
import { getLocalizedPath, locales, type Locale } from '@/i18n/config';

export const dynamic = 'force-static';
export const revalidate = 86_400;

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale: Locale = localeParam === 'en' ? 'en' : 'zh';
  const isZh = locale === 'zh';
  const canonical = getLocalizedPath(locale, '/games/saved');

  return {
    title: isZh
      ? '我的收藏游戏 - Luma Game Hub'
      : 'Saved Games - Luma Game Hub',
    description: isZh
      ? '查看保存在当前浏览器中的 Luma 游戏收藏。'
      : 'View the Luma games saved in this browser.',
    alternates: {
      canonical,
      languages: {
        'zh-CN': getLocalizedPath('zh', '/games/saved'),
        'en-US': getLocalizedPath('en', '/games/saved'),
        'x-default': getLocalizedPath('en', '/games/saved'),
      },
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function SavedGamesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale: Locale = localeParam === 'en' ? 'en' : 'zh';

  return (
    <main className="min-h-[70vh] bg-background px-4 py-10 md:px-6 md:py-14">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-400">
            {locale === 'zh' ? '当前浏览器' : 'This browser'}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            {locale === 'zh' ? '我的收藏游戏' : 'Saved games'}
          </h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            {locale === 'zh'
              ? '收藏不会要求登录，只保存在当前浏览器。换设备或清除浏览器数据后，列表不会同步。'
              : 'Saves do not require an account and stay in this browser. They do not sync across devices or cleared browser data.'}
          </p>
          <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold">
            <Link
              href={getLocalizedPath(locale, '/games')}
              className="text-emerald-700 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              {locale === 'zh' ? '浏览游戏库' : 'Browse games'}
            </Link>
            <Link
              href={getLocalizedPath(locale, '/guides')}
              className="text-emerald-700 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              {locale === 'zh' ? '查看攻略专题' : 'Browse guides'}
            </Link>
          </div>
        </header>
        <SavedGames locale={locale} />
      </div>
    </main>
  );
}
