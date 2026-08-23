import Link from 'next/link';
import type { ReactNode } from 'react';

import { getLocalizedPath, type Locale } from '@/i18n/config';

interface GuideDetailLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function GuideDetailLayout({
  children,
  params,
}: GuideDetailLayoutProps) {
  const { locale: localeParam } = await params;
  const locale: Locale = localeParam === 'en' ? 'en' : 'zh';

  return (
    <>
      {children}
      <aside
        className="mx-auto w-full max-w-7xl px-3 pb-8 sm:px-4 md:px-6"
        aria-label={locale === 'zh' ? '继续浏览 Luma' : 'Continue browsing Luma'}
      >
        <Link
          href={getLocalizedPath(locale, '/games')}
          className="inline-flex min-h-10 items-center rounded-md border border-border bg-background px-4 py-2 text-sm font-semibold text-primary transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {locale === 'zh' ? '浏览游戏目录 →' : 'Browse the game catalogue →'}
        </Link>
      </aside>
    </>
  );
}
