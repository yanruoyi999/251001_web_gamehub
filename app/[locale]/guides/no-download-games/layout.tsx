import Link from 'next/link';
import type { ReactNode } from 'react';

import { getLocalizedPath, type Locale } from '@/i18n/config';

const TWO_PLAYER_PATH = '/games/2-player-unblocked';

interface NoDownloadGuideLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function NoDownloadGuideLayout({ children, params }: NoDownloadGuideLayoutProps) {
  const { locale: localeParam } = await params;
  const locale: Locale = localeParam === 'en' ? 'en' : 'zh';
  const isZh = locale === 'zh';

  return (
    <>
      {children}
      <aside className="mx-auto w-full max-w-5xl px-6 pb-12" aria-label={isZh ? '无需下载双人游戏' : 'No-download two-player games'}>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">
            {isZh ? '无需下载，也可以两个人一起玩' : 'No download, two players'}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {isZh
              ? 'Luma 的双人合集只收录授权路径明确的自托管游戏；第一版三款游戏无需账号、无需安装程序，并明确显示实体键盘限制。'
              : 'Luma’s two-player collection uses provenance-reviewed self-hosted games. The v1 set needs no account or installer and clearly labels its physical-keyboard limitation.'}
          </p>
          <Link
            href={getLocalizedPath(locale, TWO_PLAYER_PATH)}
            className="mt-4 inline-flex min-h-11 items-center rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-primary hover:border-primary"
          >
            {isZh ? '查看双人自托管游戏' : 'Browse self-hosted 2 Player Games'}
          </Link>
        </div>
      </aside>
    </>
  );
}
