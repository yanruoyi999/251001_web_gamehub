import Link from 'next/link';
import type { ReactNode } from 'react';

import { getLocalizedPath, type Locale } from '@/i18n/config';

const TWO_PLAYER_PATH = '/games/2-player-unblocked';

interface KeyboardGuideLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function KeyboardGuideLayout({ children, params }: KeyboardGuideLayoutProps) {
  const { locale: localeParam } = await params;
  const locale: Locale = localeParam === 'en' ? 'en' : 'zh';
  const isZh = locale === 'zh';

  return (
    <>
      {children}
      <aside className="mx-auto w-full max-w-5xl px-6 pb-12" aria-label={isZh ? '双人键盘游戏' : 'Two-player keyboard games'}>
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <h2 className="text-lg font-semibold text-foreground">
            {isZh ? '两个人共用键盘时，直接看双人合集' : 'Two people, one keyboard'}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {isZh
              ? '如果你不是一个人玩，Luma 的双人合集会把 P1 / P2 按键、设备限制和游戏来源放在同一页，点击后才加载游戏。'
              : 'If you are sharing the keyboard, the two-player collection puts P1/P2 controls, device limits, and source provenance on one page and loads a game only after Play.'}
          </p>
          <Link
            href={getLocalizedPath(locale, TWO_PLAYER_PATH)}
            className="mt-4 inline-flex min-h-11 items-center rounded-xl border border-primary/30 bg-background px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
          >
            {isZh ? '打开双人浏览器游戏' : 'Open 2 Player Browser Games'}
          </Link>
        </div>
      </aside>
    </>
  );
}
