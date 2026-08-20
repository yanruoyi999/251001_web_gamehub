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
  const recommendationCount = surface === 'home' ? 6 : 1;
  const isHome = surface === 'home';
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
      className={surface === 'home' ? 'mt-5 md:mt-6' : ''}
      data-recommendation-surface={surface}
    >
      <div className="mb-3 flex flex-col gap-1 border-b-2 border-[#18251f] pb-2 sm:flex-row sm:items-end sm:justify-between dark:border-border">
        <div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-800 dark:text-emerald-400">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              {locale === 'zh' ? '今日推荐' : "Today's picks"}
            </p>
            {surface === 'home' ? (
              <Link
                href={getLocalizedPath(locale, '/games/saved')}
                className="inline-flex min-h-8 items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                <Bookmark className="h-4 w-4" aria-hidden="true" />
                {locale === 'zh' ? '查看我的收藏' : 'View saved games'}
              </Link>
            ) : null}
          </div>
          <h2
            id={`daily-recommendation-${surface}-${placement}`}
            className="mt-1 text-lg font-black tracking-tight text-[#18251f] sm:text-xl dark:text-foreground"
          >
            {surface === 'home'
              ? locale === 'zh'
                ? '今天热门'
                : 'Popular games today'
              : locale === 'zh'
                ? '换一款继续玩'
                : 'Try another game'}
          </h2>
        </div>
        {surface === 'home' ? (
          <p className="hidden max-w-md text-xs text-muted-foreground sm:block sm:text-right">
            {locale === 'zh'
              ? '点击心形即可收藏到当前浏览器，下次回来继续。'
              : 'Use the heart to save a game in this browser and return to it later.'}
          </p>
        ) : null}
      </div>

      <div
        className={
          surface === 'home'
            ? 'game-shelf-scroll grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6'
            : 'grid gap-4'
        }
      >
        {recommendations.map(recommendation => (
          <article
            key={recommendation.id}
            className="group overflow-hidden rounded-md border border-[#dce4df] bg-white transition hover:-translate-y-0.5 hover:border-emerald-700/60 hover:shadow-[0_8px_20px_-16px_rgba(16,58,38,0.65)] dark:border-border dark:bg-card"
            data-recommendation-card={recommendation.slug}
          >
            <Link
              href={getLocalizedPath(locale, `/games/${recommendation.slug}`)}
              onClick={() => handleClick(recommendation)}
              className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-inset"
            >
              <div
                className={
                  isHome
                    ? 'relative aspect-[16/10] overflow-hidden bg-[#102033]'
                    : 'relative aspect-[16/10] overflow-hidden bg-[#102033]'
                }
              >
                <Image
                  src={recommendation.image}
                  alt={`${recommendation.title[locale]} gameplay`}
                  fill
                  sizes={
                    isHome
                      ? '(max-width: 640px) 58vw, (max-width: 1024px) 40vw, 33vw'
                      : '33vw'
                  }
                  className={`${recommendation.slug === 'spend-bill-gates-money' ? 'object-contain' : 'object-cover'} transition duration-300 group-hover:scale-[1.03]`}
                />
                {isHome ? (
                  <span className="absolute left-2 top-2 rounded-sm bg-[#102033]/90 px-1.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white">
                    {recommendation.eyebrow[locale]}
                  </span>
                ) : null}
              </div>
            </Link>

            <div className={isHome ? 'p-2 sm:p-2.5' : 'p-3 sm:p-4'}>
              {!isHome ? (
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-800 dark:text-emerald-400">
                  {recommendation.eyebrow[locale]}
                </p>
              ) : null}
              <h3
                className={
                  isHome
                    ? 'mt-0.5 line-clamp-1 text-sm font-black leading-5 text-foreground sm:text-base'
                    : 'mt-1 line-clamp-1 text-base font-black text-foreground sm:text-lg'
                }
              >
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
              <p
                className={
                  isHome
                    ? 'sr-only'
                    : 'mt-1 line-clamp-2 min-h-10 text-xs leading-5 text-muted-foreground sm:text-sm'
                }
              >
                {recommendation.description[locale]}
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <Link
                  href={getLocalizedPath(
                    locale,
                    `/games/${recommendation.slug}`
                  )}
                  onClick={() => handleClick(recommendation)}
                  className={
                    isHome
                      ? 'sr-only'
                      : 'inline-flex min-h-7 items-center gap-1 px-0 py-1 text-[10px] font-bold text-emerald-800 transition hover:text-emerald-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 sm:min-h-8 sm:text-xs dark:text-emerald-400 dark:hover:text-emerald-300'
                  }
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
                  compact
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
