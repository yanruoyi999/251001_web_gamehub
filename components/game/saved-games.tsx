'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Bookmark, Gamepad2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { FavoriteToggleButton } from '@/components/game/favorite-toggle';
import { getLocalizedPath, type Locale } from '@/i18n/config';
import {
  LOCAL_FAVORITES_CHANGE_EVENT,
  readLocalFavoriteSlugs,
} from '@/lib/retention/local-favorites';

interface SavedGame {
  id: number;
  slug: string;
  title: string;
  titleEn: string;
  thumbnailUrl: string;
}

interface SavedGamesProps {
  locale: Locale;
}

export function SavedGames({ locale }: SavedGamesProps) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [games, setGames] = useState<SavedGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const refreshSlugs = useCallback(() => {
    setSlugs(readLocalFavoriteSlugs());
  }, []);

  useEffect(() => {
    refreshSlugs();

    const handleChange = () => refreshSlugs();
    window.addEventListener('storage', handleChange);
    window.addEventListener(LOCAL_FAVORITES_CHANGE_EVENT, handleChange);

    return () => {
      window.removeEventListener('storage', handleChange);
      window.removeEventListener(LOCAL_FAVORITES_CHANGE_EVENT, handleChange);
    };
  }, [refreshSlugs]);

  useEffect(() => {
    const controller = new AbortController();

    if (slugs.length === 0) {
      setGames([]);
      setHasError(false);
      setIsLoading(false);
      return () => controller.abort();
    }

    setIsLoading(true);
    setHasError(false);

    fetch(`/api/games/saved?slugs=${encodeURIComponent(slugs.join(','))}`, {
      signal: controller.signal,
    })
      .then(async response => {
        if (!response.ok)
          throw new Error(`Saved games request failed: ${response.status}`);
        return (await response.json()) as { games?: SavedGame[] };
      })
      .then(payload =>
        setGames(Array.isArray(payload.games) ? payload.games : [])
      )
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError')
          return;
        console.error('读取本地收藏游戏失败', error);
        setGames([]);
        setHasError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [slugs]);

  if (isLoading) {
    return (
      <p className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        {locale === 'zh'
          ? '正在读取当前浏览器的收藏…'
          : 'Loading saved games from this browser…'}
      </p>
    );
  }

  if (hasError) {
    return (
      <p className="rounded-lg border border-amber-300 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-100">
        {locale === 'zh'
          ? '收藏列表暂时无法读取，请刷新页面后重试。'
          : 'The saved list could not be loaded. Refresh and try again.'}
      </p>
    );
  }

  if (games.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center">
        <Bookmark
          className="mx-auto h-8 w-8 text-emerald-700 dark:text-emerald-400"
          aria-hidden="true"
        />
        <h2 className="mt-3 text-lg font-semibold text-foreground">
          {locale === 'zh' ? '还没有收藏游戏' : 'No saved games yet'}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          {locale === 'zh'
            ? '在今日推荐、游戏库或游戏详情页点击书签按钮，收藏会保存在当前浏览器。'
            : 'Use the bookmark button in Today’s picks, the game library, or a game detail page. Saves stay in this browser.'}
        </p>
        <Link
          href={getLocalizedPath(locale, '/games')}
          className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
        >
          <Gamepad2 className="h-4 w-4" aria-hidden="true" />
          {locale === 'zh' ? '去游戏库挑选' : 'Browse the game library'}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {games.map(game => {
        const title = locale === 'en' ? game.titleEn : game.title;
        const href = getLocalizedPath(locale, `/games/${game.slug}`);

        return (
          <article
            key={game.slug}
            className="overflow-hidden rounded-lg border border-border bg-card shadow-sm"
          >
            <Link
              href={href}
              className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-inset"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                <Image
                  src={game.thumbnailUrl}
                  alt={`${title} gameplay`}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-300 group-hover:scale-[1.03]"
                />
              </div>
            </Link>
            <div className="flex items-center justify-between gap-3 p-4">
              <h2 className="min-w-0 truncate text-base font-semibold text-foreground">
                <Link
                  href={href}
                  className="hover:text-emerald-700 dark:hover:text-emerald-400"
                >
                  {title}
                </Link>
              </h2>
              <FavoriteToggleButton
                gameId={game.id}
                initialFavorite
                labels={{
                  favorite: locale === 'zh' ? '收藏游戏' : 'Save game',
                  unfavorite: locale === 'zh' ? '取消收藏' : 'Remove saved',
                }}
                fallbackKey={`slug:${game.slug}`}
                gameSlug={game.slug}
                surface="saved_games"
                storageMode="local"
              />
            </div>
          </article>
        );
      })}
    </div>
  );
}
