'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import type { Locale } from '@/i18n/config';
import { getLocalizedPath } from '@/i18n/config';
import {
  getDailyRecommendation,
  getShanghaiDateKey,
  type DailyRecommendationEntry,
} from '@/lib/retention/daily-recommendation';
import { trackInteraction } from '@/lib/analytics/events';

interface DailyRecommendationProps {
  excludeSlug?: string;
  locale: Locale;
  surface: 'home' | 'game_detail';
}

const SERVER_FALLBACK_DATE_KEY = 'server-fallback';

export function DailyRecommendation({ excludeSlug, locale, surface }: DailyRecommendationProps) {
  const [dateKey, setDateKey] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<DailyRecommendationEntry>(() =>
    getDailyRecommendation(SERVER_FALLBACK_DATE_KEY, excludeSlug),
  );
  const trackedView = useRef<string | null>(null);

  useEffect(() => {
    setDateKey(getShanghaiDateKey());
  }, []);

  useEffect(() => {
    if (!dateKey) return;
    setRecommendation(getDailyRecommendation(dateKey, excludeSlug));
  }, [dateKey, excludeSlug]);

  useEffect(() => {
    if (!dateKey) return;
    const trackingKey = `${dateKey}:${surface}:${recommendation.slug}`;
    if (trackedView.current === trackingKey) return;
    trackedView.current = trackingKey;
    trackInteraction('recommendation_view', {
      recommendation_id: recommendation.id,
      recommendation_slug: recommendation.slug,
      recommendation_date: dateKey,
      recommendation_surface: surface,
    });
  }, [dateKey, recommendation, surface]);

  const handleClick = () => {
    trackInteraction('recommendation_click', {
      recommendation_id: recommendation.id,
      recommendation_slug: recommendation.slug,
      recommendation_date: dateKey ?? SERVER_FALLBACK_DATE_KEY,
      recommendation_surface: surface,
    });
  };

  return (
    <section
      aria-labelledby={`daily-recommendation-${surface}`}
      className="mt-12 overflow-hidden rounded-xl border border-emerald-700/20 bg-emerald-50/70 dark:border-emerald-400/20 dark:bg-emerald-950/20"
      data-recommendation-surface={surface}
    >
      <div className="grid gap-0 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-stretch">
        <div className="relative min-h-48 overflow-hidden bg-emerald-950 md:min-h-64">
          <Image
            src={recommendation.image}
            alt={`${recommendation.title[locale]} gameplay`}
            fill
            sizes="(max-width: 768px) 100vw, 55vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center p-6 sm:p-8">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-400">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            {locale === 'zh' ? '今日推荐' : "Today's pick"}
          </p>
          <h2 id={`daily-recommendation-${surface}`} className="mt-2 text-2xl font-semibold text-foreground">
            {recommendation.title[locale]}
          </h2>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-emerald-700/80 dark:text-emerald-300/80">
            {recommendation.eyebrow[locale]}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {recommendation.description[locale]}
          </p>
          <Link
            href={getLocalizedPath(locale, `/games/${recommendation.slug}`)}
            onClick={handleClick}
            className="mt-5 inline-flex min-h-11 w-fit items-center gap-2 rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
          >
            {recommendation.action[locale]}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
