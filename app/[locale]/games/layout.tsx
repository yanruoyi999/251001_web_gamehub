import Link from 'next/link';
import type { ReactNode } from 'react';

import { getLocalizedPath, type Locale } from '@/i18n/config';

const TWO_PLAYER_PATH = '/games/2-player-unblocked';

interface GamesLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function GamesLayout({ children, params }: GamesLayoutProps) {
  const { locale: localeParam } = await params;
  const locale: Locale = localeParam === 'en' ? 'en' : 'zh';
  const isZh = locale === 'zh';

  return (
    <>
      {children}
      <aside className="mx-auto w-full max-w-6xl px-6 pb-12" aria-label={isZh ? '双人游戏推荐' : 'Two-player games'}>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {isZh ? '想和身边的人共用一个键盘？' : 'Playing together on one keyboard?'}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              {isZh
                ? '打开 Luma 的自托管双人浏览器游戏合集，查看每位玩家的真实按键、来源和许可证说明。'
                : 'Open Luma’s self-hosted two-player browser collection with real P1/P2 controls, source notes, and license provenance.'}
            </p>
          </div>
          <Link
            href={getLocalizedPath(locale, TWO_PLAYER_PATH)}
            className="mt-4 inline-flex min-h-11 shrink-0 items-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 sm:mt-0"
          >
            {isZh ? '查看双人游戏' : 'Browse 2 Player Games'}
          </Link>
        </div>
      </aside>
    </>
  );
}