'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

import { trackInteraction } from '@/lib/analytics/events';
import { getLocalizedPath, type Locale } from '@/i18n/config';

const copy = {
  en: {
    eyebrow: 'Luma Lab experiment',
    title: 'Checkers Rules Trainer',
    description:
      'Practise mandatory captures, kings, and multi-jumps in an original local two-player browser trainer.',
    action: 'Try Checkers',
  },
  zh: {
    eyebrow: 'Luma Lab 实验',
    title: 'Checkers 规则训练器',
    description: '在原创本地双人棋盘上练习强制吃子、升王和连续跳吃。',
    action: '试玩 Checkers',
  },
} as const;

export function CheckersDiscoveryCard({ locale }: { locale: Locale }) {
  const content = copy[locale];
  const viewedRef = useRef(false);
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const recordView = () => {
      if (viewedRef.current) return;
      viewedRef.current = true;
      trackInteraction('checkers_discovery_view', {
        game_slug: 'luma-checkers',
        locale,
      });
    };

    if (!('IntersectionObserver' in window)) {
      recordView();
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          recordView();
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(card);

    return () => observer.disconnect();
  }, [locale]);

  return (
    <section
      ref={cardRef}
      className="mb-8 border border-teal-300/50 bg-teal-50 px-6 py-6 text-teal-950 sm:px-8"
      data-checkers-discovery="true"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal-700">
            {content.eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight">
            {content.title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-teal-900/80">
            {content.description}
          </p>
        </div>
        <Link
          href={getLocalizedPath(locale, '/games/checkers-rules')}
          className="inline-flex min-h-11 flex-shrink-0 items-center justify-center rounded-md bg-teal-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
          onClick={() =>
            trackInteraction('checkers_discovery_click', {
              game_slug: 'luma-checkers',
              locale,
              source: 'games_directory',
            })
          }
          data-checkers-discovery-link="true"
        >
          {content.action}
        </Link>
      </div>
    </section>
  );
}
