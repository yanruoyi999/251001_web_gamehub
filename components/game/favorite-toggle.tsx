"use client";

import { useEffect, useState, useTransition } from 'react';
import clsx from 'clsx';

import { Button } from '@/components/ui/button';

interface FavoriteToggleButtonProps {
  gameId: number;
  initialFavorite: boolean;
  labels: {
    favorite: string;
    unfavorite: string;
  };
  fallbackKey?: string;
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

  const handleToggle = () => {
    startTransition(async () => {
      if (storageMode === 'local' && fallbackKey) {
        const nextState = !isFavorite;
        setIsFavorite(nextState);
        updateLocalFavorite(fallbackKey, nextState);
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
      className={clsx(
        'w-[120px] justify-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
        isFavorite
          ? 'bg-rose-100 text-rose-700 hover:bg-rose-100'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      )}
    >
      <span aria-hidden>{isFavorite ? '♥' : '♡'}</span>
      <span>{isFavorite ? labels.unfavorite : labels.favorite}</span>
    </Button>
  );
}
