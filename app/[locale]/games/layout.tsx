import Link from 'next/link';
import type { ReactNode } from 'react';

import { getLocalizedPath, type Locale } from '@/i18n/config';

const TWO_PLAYER_PATH = '/games/2-player-unblocked';
const COUPLES_PATH = '/games/online-games-for-couples';

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
      <aside className="mx-auto w-full max-w-6xl px-6 pb-12" aria-label={isZh ? '多人游戏合集推荐' : 'Play-together collections'}>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">
              {isZh ? '想和身边的人共用一个键盘？' : 'Playing together on one keyboard?'}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {isZh
                ? '打开 Luma 的自托管双人浏览器游戏合集，查看每位玩家的真实按键、来源和许可证说明。'
                : 'Open Luma’s self-hosted two-player browser collection with real P1/P2 controls, source notes, and license provenance.'}
            </p>
            <Link
              href={getLocalizedPath(locale, TWO_PLAYER_PATH)}
              className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              {isZh ? '查看双人游戏' : 'Browse 2 Player Games'}
            </Link>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">
              {isZh ? '想玩情侣默契和异地同题游戏？' : 'Looking for Couple Games you can share online?'}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {isZh
                ? '进入 Luma 原创情侣小游戏合集：二选一、匹配测试和共享挑战码都在浏览器本地运行，无需账号。'
                : 'Try Luma-original Couple Games with this-or-that choices, a match quiz, and shareable challenge decks for same-device or long-distance play.'}
            </p>
            <Link
              href={getLocalizedPath(locale, COUPLES_PATH)}
              className="mt-4 inline-flex min-h-11 items-center rounded-xl border border-primary/30 bg-background px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5"
            >
              {isZh ? '打开情侣在线小游戏' : 'Play Online Games for Couples'}
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
