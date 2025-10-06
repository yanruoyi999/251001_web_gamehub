"use client";

import { useCallback, useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

interface RatingFormProps {
  gameId: number;
}

export function RatingForm({ gameId }: RatingFormProps) {
  const t = useTranslations('GameDetails');
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const resolveErrorMessage = (rawMessage: string) => {
    if (!rawMessage) return t('ratingForm.error.generic');
    const lower = rawMessage.toLowerCase();
    if (lower.includes('limit')) {
      return t('ratingForm.error.rateLimit');
    }
    if (lower.includes('already rated')) {
      return t('ratingForm.error.duplicate');
    }
    return rawMessage;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!rating) {
      setStatus('error');
      setMessage(t('ratingForm.validation.required'));
      return;
    }

    startTransition(async () => {
      try {
        setStatus('idle');
        setMessage('');

        const response = await fetch('/api/ratings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            gameId,
            rating,
            comment: comment.trim() ? comment.trim() : undefined,
          }),
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error ?? 'Request failed');
        }

        setStatus('success');
        setMessage(t('ratingForm.success'));
        setRating(null);
        setComment('');
      } catch (error) {
        console.error('提交评分失败', error);
        setStatus('error');
        if (error instanceof Error) {
          setMessage(resolveErrorMessage(error.message));
        } else {
          setMessage(t('ratingForm.error.generic'));
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="text-sm font-medium text-gray-900">{t('ratingForm.title')}</p>
        <p className="text-xs text-gray-500">{t('ratingForm.hint')}</p>
      </div>

      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((value) => {
          const active = rating === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className="text-xl"
              aria-label={t('ratingForm.starLabel', { value })}
            >
              <span className={active ? 'text-amber-500' : 'text-gray-300'}>★</span>
            </button>
          );
        })}
      </div>

      <textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder={t('ratingForm.commentPlaceholder')}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        rows={3}
      />

      {status !== 'idle' ? (
        <div
          className={
            status === 'success'
              ? 'text-sm text-emerald-600'
              : 'text-sm text-rose-600'
          }
        >
          {message}
        </div>
      ) : null}

      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? t('ratingForm.submitting') : t('ratingForm.submit')}
      </Button>
    </form>
  );
}
