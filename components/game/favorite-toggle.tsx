"use client";

import { useEffect, useState, useTransition } from 'react';
import clsx from 'clsx';

import { Button } from '@/components/ui/button';
import { trackInteraction } from '@/lib/analytics/events';

interface FavoriteToggleButtonProps {
  gameId: number;
  initialFavorite: boolean;
  labels: {
    favorite: string;
    unfavorite: string;
  };
  fallbackKey?: string;
  gameSlug?: string | null;
  surface?: 'daily_recommendation' | 'game_detail' | 'game_list';
  storageMode?: 'local' | 'remote-with-local-fallback';
}

const LOCAL_STORAGE_KEY = 'gamehub:favorites';

function readLocalFavorites(): Set<string> {
  if (typeof window === 'undefined') {
    return new Set();
  }

  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return new Set();

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return new Set(parsed.filter((item) => typeof item === 'string'));
    }
    return new Set();
  } catch (error) {
    console.error('解析本地收藏数据失败', error);
    return new Set();
  }
}

function writeLocalFavorites(values: Set<string>) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(Array.from(values)));
  } catch (error) {
    console.error('写入本地收藏数据失败', error);
  }
}

function updateLocalFavorite(key: string, nextState: boolean) {
  if (typeof window === 'undefined') {
    return;
  }

  const favorites = readLocalFavorites();
  if (nextState) {
    favorites.add(key);
  } else {
    favorites.delete(key);
  }
  writeLocalFavorites(favorites);
}

export function FavoriteToggleButton({
  gameId,
  initialFavorite,
  labels,
  fallbackKey,
  gameSlug,
  surface = 'game_detail',
  storageMode = 'remote-with-local-fallback',
}: FavoriteToggleButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isPending, startTransition] = useTransition();
  const [apiUnavailable, setApiUnavailable] = useState(false);

  useEffect(() => {
    setIsFavorite(initialFavorite);
  }, [initialFavorite]);

  useEffect(() => {
    if (!fallbackKey || typeof window === 'undefined') {
      return;
    }

    const stored = readLocalFavorites();
    if (stored.has(fallbackKey)) {
      setIsFavorite(true);
    }
  }, [fallbackKey]);

  const trackFavoriteChange = (nextState: boolean) => {
    trackInteraction(nextState ? 'favorite_add' : 'favorite_remove', {
      game_id: gameId,
      game_slug: gameSlug,
      favorite_surface: surface,
      storage_mode: storageMode,
      source: 'favorite_toggle',
    });
  };

  const handleToggle = () => {
    startTransition(async () => {
      if (storageMode === 'local' && fallbackKey) {
        const nextState = !isFavorite;
        setIsFavorite(nextState);
        updateLocalFavorite(fallbackKey, nextState);
        trackFavoriteChange(nextState);
        return;
      }

      if (!apiUnavailable) {
        try {
          const response = await fetch('/api/favorites', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              gameId,
              action: isFavorite ? 'remove' : 'add',
            }),
          });

          if (!response.ok) {
            throw new Error(`Failed to update favorite: ${response.status}`);
          }

          const payload = await response.json();
          const nextState = Boolean(payload.isFavorite);
          setIsFavorite(nextState);
          if (fallbackKey) {
            updateLocalFavorite(fallbackKey, nextState);
          }
          trackFavoriteChange(nextState);
          return;
        } catch (error) {
          console.error('收藏状态更新失败', error);
          setApiUnavailable(true);
        }
      }

      if (fallbackKey) {
        const nextState = !isFavorite;
        setIsFavorite(nextState);
        updateLocalFavorite(fallbackKey, nextState);
        trackFavoriteChange(nextState);
      }
    });
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      aria-pressed={isFavorite}
      aria-busy={isPending}
      aria-label={isFavorite ? labels.unfavorite : labels.favorite}
      disabled={isPending}
      onClick={handleToggle}
      data-favorite-toggle
      data-favorite-surface={surface}
      className={clsx(
        'min-h-10 min-w-[116px] justify-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold',
        isFavorite
          ? 'border-rose-300 bg-rose-100 text-rose-800 hover:bg-rose-100 dark:border-rose-700 dark:bg-rose-950/50 dark:text-rose-200'
          : 'border-emerald-700/35 bg-background text-emerald-800 hover:bg-emerald-50 dark:border-emerald-400/40 dark:text-emerald-300 dark:hover:bg-emerald-950/30'
      )}
    >
      <span aria-hidden>{isFavorite ? '♥' : '♡'}</span>
      <span>{isFavorite ? labels.unfavorite : labels.favorite}</span>
    </Button>
  );
}
