import Link from 'next/link';
import type { ReactNode } from 'react';

import { getLocalizedPath, type Locale } from '@/i18n/config';

const SORTING_GAMES_PATH = '/games/sorting-games';

interface QuickPlayGuideLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function QuickPlayGuideLayout({ children, params }: QuickPlayGuideLayoutProps) {
  const { locale: localeParam } = await params;
  const locale: Locale = localeParam === 'en' ? 'en' : 'zh';
  const isZh = locale === 'zh';

  return (
    <>
      {children}
      <aside className="mx-auto w-full max-w-5xl px-6 pb-12" aria-label={isZh ? '快速浏览器小游戏' : 'Quick browser game'}>
        <section className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
            {isZh ? '2–4 分钟 · Luma 原创' : '2–4 minutes · Luma Original'}
          </p>
          <h2 className="mt-2 text-xl font-semibold text-foreground">
            {isZh ? '想快速玩一局？试试 Sorting Games' : 'Need a quick round? Try Sorting Games'}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            {isZh
              ? '数字排序和形状分类适合短时间挑战，颜色堆叠则更偏轻解谜。三款游戏都由 Luma 自己实现，不需要下载、账号或外部游戏资源。'
              : 'Number Order Sprint and Shape Shelf Sort fit short sessions, while Color Stack Sort adds a little more puzzle planning. All three are built by Luma with no download, account, or external game runtime.'}
          </p>
          <Link
            href={getLocalizedPath(locale, SORTING_GAMES_PATH)}
            className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
          >
            {isZh ? '开始分类挑战' : 'Start a sorting challenge'}
          </Link>
        </section>
      </aside>
    </>
  );
}
