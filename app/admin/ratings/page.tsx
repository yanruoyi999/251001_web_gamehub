import Link from 'next/link';

import { requireAdminAuth } from '@/lib/auth/admin';
import { RatingService } from '@/services';
import { AdminRatingsTable } from '@/components/admin/rating-table';

interface AdminRatingsPageProps {
  searchParams: {
    page?: string;
  };
}

export const dynamic = 'force-dynamic';

function resolvePage(value?: string) {
  if (!value) return 1;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

export default async function AdminRatingsPage({ searchParams }: AdminRatingsPageProps) {
  requireAdminAuth();

  const page = resolvePage(searchParams.page);

  const result = await RatingService.getPendingRatings({ page, limit: 20 });
  const totalPages = Math.max(1, Math.ceil(result.total / result.limit));

  const buildUrl = (targetPage: number) => {
    const params = new URLSearchParams();
    if (targetPage > 1) params.set('page', String(targetPage));
    const search = params.toString();
    return `/admin/ratings${search ? `?${search}` : ''}`;
  };

  const ratings = result.ratings.map((rating) => ({
    id: rating.id,
    gameId: rating.gameId,
    rating: rating.rating,
    comment: rating.comment,
    createdAt: rating.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Ratings moderation</h1>
          <p className="text-sm text-slate-400">
            Review recent submissions and approve or reject them.
          </p>
        </div>
        <Link
          href="/admin"
          className="text-xs font-medium uppercase tracking-wide text-slate-400 hover:text-slate-200"
        >
          ← Back to dashboard
        </Link>
      </header>

      <AdminRatingsTable ratings={ratings} />

      {totalPages > 1 ? (
        <nav className="flex items-center justify-center gap-4 text-sm text-slate-300">
          {result.page > 1 ? (
            <Link
              href={buildUrl(result.page - 1)}
              className="rounded-md border border-slate-700 px-3 py-1.5 hover:bg-slate-800"
            >
              ← Previous
            </Link>
          ) : (
            <span className="rounded-md border border-slate-800 px-3 py-1.5 text-slate-600">← Previous</span>
          )}
          <span className="rounded-md border border-slate-800 px-3 py-1.5 text-slate-400">
            Page {result.page} / {totalPages}
          </span>
          {result.page < totalPages ? (
            <Link
              href={buildUrl(result.page + 1)}
              className="rounded-md border border-slate-700 px-3 py-1.5 hover:bg-slate-800"
            >
              Next →
            </Link>
          ) : (
            <span className="rounded-md border border-slate-800 px-3 py-1.5 text-slate-600">Next →</span>
          )}
        </nav>
      ) : null}
    </div>
  );
}
