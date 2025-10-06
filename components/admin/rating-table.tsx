"use client";

import { useTransition, useState } from 'react';

interface AdminRatingItem {
  id: number;
  gameId: number;
  rating: number;
  comment?: string | null;
  createdAt: string;
}

interface AdminRatingsTableProps {
  ratings: AdminRatingItem[];
}

export function AdminRatingsTable({ ratings }: AdminRatingsTableProps) {
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleAction = (ratingId: number, action: 'approve' | 'reject') => {
    startTransition(async () => {
      setPendingId(ratingId);
      setError(null);

      try {
        const response = await fetch(`/api/admin/ratings/${ratingId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action }),
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error ?? 'Failed to update rating');
        }

        window.location.reload();
      } catch (err) {
        console.error('Failed to update rating', err);
        setError(err instanceof Error ? err.message : 'Failed to update rating');
      } finally {
        setPendingId(null);
      }
    });
  };

  if (!ratings.length) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-6 py-12 text-center text-sm text-slate-400">
        No pending ratings need review.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error ? (
        <div className="rounded-md border border-rose-700 bg-rose-900/40 px-4 py-2 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-slate-800">
        <table className="min-w-full divide-y divide-slate-800">
          <thead className="bg-slate-900/80 text-left text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3">Game ID</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Comment</th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-950/60 text-sm text-slate-200">
            {ratings.map((rating) => (
              <tr key={rating.id}>
                <td className="px-4 py-3 text-slate-400">{rating.gameId}</td>
                <td className="px-4 py-3 text-slate-100 font-semibold">{rating.rating} ★</td>
                <td className="px-4 py-3 text-slate-300">
                  {rating.comment?.trim() ?? <span className="text-slate-500">(no comment)</span>}
                </td>
                <td className="px-4 py-3 text-slate-400">
                  {new Date(rating.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleAction(rating.id, 'reject')}
                      disabled={isPending && pendingId === rating.id}
                      className="rounded-md border border-rose-500 px-2 py-1 text-xs text-rose-300 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAction(rating.id, 'approve')}
                      disabled={isPending && pendingId === rating.id}
                      className="rounded-md border border-emerald-500 px-2 py-1 text-xs text-emerald-300 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Approve
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
