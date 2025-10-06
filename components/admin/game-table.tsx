"use client";

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface AdminGameItem {
  id: number;
  title: string;
  titleEn?: string | null;
  status?: string | null;
  slug?: string | null;
  publishedAt?: Date | string | null;
  averageRating?: number | string | null;
  playCount?: number | string | null;
}

interface AdminGamesTableProps {
  games: AdminGameItem[];
  locale: string;
}

export function AdminGamesTable({ games, locale }: AdminGamesTableProps) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleToggleStatus = (game: AdminGameItem) => {
    const currentStatus = (game.status ?? 'active').toLowerCase();
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';

    startTransition(async () => {
      setPendingId(game.id);
      setMessage(null);

      try {
        const response = await fetch(`/api/admin/games/${game.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: nextStatus }),
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error ?? 'Failed to update status');
        }

        router.refresh();
      } catch (error) {
        console.error('Failed to update status', error);
        setMessage(
          error instanceof Error ? error.message : 'Failed to update status'
        );
      } finally {
        setPendingId(null);
      }
    });
  };

  if (!games.length) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-6 py-12 text-center text-sm text-slate-400">
        No games found for current filters.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {message ? (
        <div className="rounded-md border border-rose-700 bg-rose-900/40 px-4 py-2 text-sm text-rose-200">
          {message}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-slate-800">
        <table className="min-w-full divide-y divide-slate-800">
          <thead className="bg-slate-900/80 text-left text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Plays</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-950/60 text-sm text-slate-200">
            {games.map((game) => {
              const status = (game.status ?? 'unknown').toString();
              const publishedLabel = game.publishedAt
                ? new Date(game.publishedAt).toLocaleDateString(locale)
                : '—';

              return (
                <tr key={game.id}>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-slate-100">{game.title}</span>
                      {game.slug ? (
                        <span className="text-xs text-slate-500">/{game.slug}</span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="rounded-md border border-slate-700 px-2 py-1 text-xs font-semibold uppercase"
                    >
                      {status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{publishedLabel}</td>
                  <td className="px-4 py-3 text-slate-400">
                    {Number(game.averageRating ?? 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {Number(game.playCount ?? 0).toLocaleString(locale)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/${locale}/games/${game.slug ?? game.id}`}
                        className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-300 transition hover:bg-slate-800"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/games/${game.id}`}
                        className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-300 transition hover:bg-slate-800"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(game)}
                        disabled={isPending && pendingId === game.id}
                        className="rounded-md border border-indigo-500 px-2 py-1 text-xs text-indigo-300 transition hover:bg-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {status === 'active' ? 'Set inactive' : 'Set active'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
