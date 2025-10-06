"use client";

import { useState, useTransition } from 'react';
import clsx from 'clsx';

import { Button } from '@/components/ui/button';

interface FavoriteToggleButtonProps {
  gameId: number;
  initialFavorite: boolean;
  labels: {
    favorite: string;
    unfavorite: string;
  };
}

export function FavoriteToggleButton({ gameId, initialFavorite, labels }: FavoriteToggleButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
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
        setIsFavorite(Boolean(payload.isFavorite));
      } catch (error) {
        console.error('收藏状态更新失败', error);
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
