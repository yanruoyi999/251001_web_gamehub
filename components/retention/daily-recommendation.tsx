'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Bookmark, CalendarDays } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { FavoriteToggleButton } from '@/components/game/favorite-toggle';
import type { Locale } from '@/i18n/config';
import { getLocalizedPath } from '@/i18n/config';
import { trackInteraction } from '@/lib/analytics/events';
import {
  getDailyRecommendations,
  type DailyRecommendationEntry,
} from '@/lib/retention/daily-recommendation';

interface DailyRecommendationProps {
  dateKey: string;
  excludeSlug?: string;
  locale: Locale;
  placement?: 'default' | 'desktop' | 'mobile';
  surface: 'home' | 'game_detail';
}

export function DailyRecommendation({
  dateKey,
  excludeSlug,
  locale,
  placement = 'default',
  surface,
}: DailyRecommendationProps) {
  const recommendationCount = surface === 'home' ? 3 : 1;
  const [placementActive, setPlacementActive] = useState(
    placement === 'default'
  );
  const recommendations = useMemo(
    () => getDailyRecommendations(dateKey, excludeSlug, recommendationCount),
    [dateKey, excludeSlug, recommendationCount]
  );
  const trackedViews = useRef(new Set<string>());

  useEffect(() => {
    if (placement === 'default') {
      setPlacementActive(true);
      return;
    }

    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    const updatePlacement = () => {
      setPlacementActive(
        placement === 'desktop' ? desktopQuery.matches : !desktopQuery.matches
      );
    };

    updatePlacement();
    desktopQuery.addEventListener('change', updatePlacement);
    return () => desktopQuery.removeEventListener('change', updatePlacement);
  }, [placement]);

  useEffect(() => {
    if (!placementActive) return;

    recommendations.forEach(recommendation => {
      const trackingKey = `${dateKey}:${surface}:${recommendation.slug}`;
      if (trackedViews.current.has(trackingKey)) return;
      trackedViews.current.add(trackingKey);
      trackInteraction('recommendation_view', {
        recommendation_id: recommendation.id,
        recommendation_slug: recommendation.slug,
        recommendation_date: dateKey,
        recommendation_surface: surface,
      });
    });
  }, [dateKey, placementActive, recommendations, surface]);

  const handleClick = (recommendation: DailyRecommendationEntry) => {
    trackInteraction('recommendation_click', {
      recommendation_id: recommendation.id,
      recommendation_slug: recommendation.slug,
      recommendation_date: dateKey,
      recommendation_surface: surface,
    });
  };

  return (
    <section
      aria-labelledby={`daily-recommendation-${surface}-${placement}`}
      className={surface === 'home' ? 'mt-10' : ''}
      data-recommendation-surface={surface}
    >
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-400">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              {locale === 'zh' ? '今日推荐' : "Today's picks"}
            </p>
            {surface === 'home' ? (
              <Link
                href={getLocalizedPath(locale, '/games/saved')}
                className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                <Bookmark className="h-4 w-4" aria-hidden="true" />
                {locale === 'zh' ? '查看我的收藏' : 'View saved games'}
              </Link>
            ) : null}
          </div>
          <h2
            id={`daily-recommendation-${surface}-${placement}`}
            className="mt-1 text-2xl font-semibold text-foreground"
          >
            {surface === 'home'
              ? locale === 'zh'
                ? '今天先玩这 3 款'
                : 'Three games to try today'
              : locale === 'zh'
                ? '换一款继续玩'
                : 'Try another game'}
          </h2>
        </div>
        {surface === 'home' ? (
          <p className="max-w-md text-sm text-muted-foreground sm:text-right">
            {locale === 'zh'
              ? '点击心形即可收藏到当前浏览器，下次回来继续。'
              : 'Use the heart to save a game in this browser and return to it later.'}
          </p>
        ) : null}
      </div>

      <div
        className={
          surface === 'home' ? 'grid gap-4 md:grid-cols-3' : 'grid gap-4'
        }
      >
        {recommendations.map(recommendation => (
          <article
            key={recommendation.id}
            className="overflow-hidden rounded-lg border border-emerald-700/25 bg-card shadow-sm"
            data-recommendation-card={recommendation.slug}
          >
            <Link
              href={getLocalizedPath(locale, `/games/${recommendation.slug}`)}
              onClick={() => handleClick(recommendation)}
              className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-inset"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-emerald-950">
                <Image
                  src={recommendation.image}
                  alt={`${recommendation.title[locale]} gameplay`}
                  fill
                  sizes={
                    surface === 'home'
                      ? '(max-width: 768px) 100vw, 33vw'
                      : '33vw'
                  }
                  className="object-cover transition duration-300 group-hover:scale-[1.03]"
                />
              </div>
            </Link>

            <div className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                {recommendation.eyebrow[locale]}
              </p>
              <h3 className="mt-1 text-xl font-semibold text-foreground">
                <Link
                  href={getLocalizedPath(
                    locale,
                    `/games/${recommendation.slug}`
                  )}
                  onClick={() => handleClick(recommendation)}
                  className="hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:hover:text-emerald-400"
                >
                  {recommendation.title[locale]}
                </Link>
              </h3>
              <p className="mt-2 min-h-10 text-sm leading-relaxed text-muted-foreground">
                {recommendation.description[locale]}
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <Link
                  href={getLocalizedPath(
                    locale,
                    `/games/${recommendation.slug}`
                  )}
                  onClick={() => handleClick(recommendation)}
                  className="inline-flex min-h-10 items-center gap-1 rounded-md bg-emerald-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
                >
                  {recommendation.action[locale]}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <FavoriteToggleButton
                  gameId={recommendation.gameId}
                  initialFavorite={false}
                  labels={{
                    favorite: locale === 'zh' ? '收藏游戏' : 'Save game',
                    unfavorite: locale === 'zh' ? '已收藏' : 'Saved',
                  }}
                  fallbackKey={`slug:${recommendation.slug}`}
                  gameSlug={recommendation.slug}
                  surface="daily_recommendation"
                  storageMode="local"
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
