import Link from 'next/link';
import type { ReactNode } from 'react';

import { getLocalizedPath, type Locale } from '@/i18n/config';

const COUPLES_PATH = '/games/online-games-for-couples';

interface GuideSlugLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string; slug: string }>;
}

export default async function GuideSlugLayout({ children, params }: GuideSlugLayoutProps) {
  const { locale: localeParam, slug } = await params;
  const locale: Locale = localeParam === 'en' ? 'en' : 'zh';

  return (
    <>
      {children}
      {slug === 'no-download-games' ? (
        <aside
          className="mx-auto w-full max-w-5xl px-6 pb-12"
          aria-label={locale === 'zh' ? '无需下载情侣小游戏' : 'No-download couple games'}
        >
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Luma Original · Couple Games
              </p>
              <h2 className="mt-2 text-xl font-semibold text-foreground">
                {locale === 'zh'
                  ? '想两个人一起玩，而且不下载 App？'
                  : 'Want no-download games you can play as a couple?'}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                {locale === 'zh'
                  ? '试试三款 Luma 原创情侣浏览器互动：默契二选一、匹配测试和共享挑战码。答案只留在当前标签页，不需要账号。'
                  : 'Try three Luma-original browser interactions for couples: this-or-that, a match quiz, and shareable challenge decks. Answers stay in the current tab and no account is required.'}
              </p>
            </div>
            <Link
              href={getLocalizedPath(locale, COUPLES_PATH)}
              className="mt-4 inline-flex min-h-11 shrink-0 items-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 sm:mt-0"
            >
              {locale === 'zh' ? '打开情侣在线小游戏' : 'Play Online Games for Couples'}
            </Link>
          </div>
        </aside>
      ) : null}
    </>
  );
}
