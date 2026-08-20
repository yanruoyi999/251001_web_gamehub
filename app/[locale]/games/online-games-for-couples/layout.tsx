import Link from 'next/link';
import type { ReactNode } from 'react';

import { getLocalizedPath, type Locale } from '@/i18n/config';

const SORTING_GAMES_PATH = '/games/sorting-games';

interface CouplesGamesLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function CouplesGamesLayout({ children, params }: CouplesGamesLayoutProps) {
  const { locale: localeParam } = await params;
  const locale: Locale = localeParam === 'en' ? 'en' : 'zh';
  const isZh = locale === 'zh';

  return (
    <>
      {children}
      <aside className="mx-auto w-full max-w-5xl px-6 pb-12" aria-label={isZh ? '相关原创浏览器小游戏' : 'Related original browser games'}>
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {isZh ? 'Luma Original · 单人轻解谜' : 'Luma Original · Solo brain break'}
          </p>
          <h2 className="mt-2 text-xl font-semibold text-foreground">
            {isZh ? '下一局试试原创 Sorting Games' : 'Next, try original Sorting Games'}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            {isZh
              ? '如果想换成单人短局，颜色堆叠、数字顺序和形状分类三款游戏都在浏览器本地运行，使用 Luma 自己的代码和程序生成题面。'
              : 'For a short solo round, sort color stacks, order numbers, or classify shapes. The three games run locally with Luma-written code and procedurally generated starting states.'}
          </p>
          <Link
            href={getLocalizedPath(locale, SORTING_GAMES_PATH)}
            className="mt-4 inline-flex min-h-11 items-center rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-primary hover:border-primary"
          >
            {isZh ? '打开 Sorting Games' : 'Play Sorting Games'}
          </Link>
        </section>
      </aside>
    </>
  );
}
