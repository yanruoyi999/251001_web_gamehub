import Link from 'next/link';

import { requireAdminAuth } from '@/lib/auth/admin';
import { GameService } from '@/services';
import { AdminGamesTable } from '@/components/admin/game-table';
import { defaultLocale } from '@/i18n/config';

interface AdminGamesSearchParams {
  q?: string;
  status?: string;
  page?: string;
}

interface AdminGamesPageProps {
  searchParams: Promise<AdminGamesSearchParams>;
}

export const dynamic = 'force-dynamic';

const STATUS_OPTIONS = ['all', 'active', 'inactive', 'pending'] as const;

type StatusOption = (typeof STATUS_OPTIONS)[number];

function resolveStatus(value?: string): StatusOption {
  if (!value) return 'all';
  return STATUS_OPTIONS.includes(value as StatusOption) ? (value as StatusOption) : 'all';
}

function resolvePage(value?: string) {
  if (!value) return 1;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

export default async function AdminGamesPage({ searchParams }: AdminGamesPageProps) {
  await requireAdminAuth();
  const resolvedSearchParams = await searchParams;

  const query = typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q : '';
  const status = resolveStatus(resolvedSearchParams.status);
  const page = resolvePage(resolvedSearchParams.page);

  const result = await GameService.listGames({
    search: query.trim() ? query : undefined,
    status,
    page,
    limit: 20,
  });

  const totalPages = Math.max(1, Math.ceil(result.total / result.limit));

  const buildUrl = (targetPage: number) => {
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (status !== 'all') params.set('status', status);
    if (targetPage > 1) params.set('page', String(targetPage));

    const search = params.toString();
    return `/admin/games${search ? `?${search}` : ''}`;
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Game management</h1>
          <p className="text-sm text-slate-400">
            Review and manage game catalogue, including status and metadata.
          </p>
        </div>
        <Link
          href="/admin"
          className="text-xs font-medium uppercase tracking-wide text-slate-400 hover:text-slate-200"
        >
          ← Back to dashboard
        </Link>
      </header>

      <form
        method="get"
        className="grid gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-100 md:grid-cols-[1fr_160px]"
      >
        <div className="space-y-2">
          <label htmlFor="search" className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
            Search
          </label>
          <input
            id="search"
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Title, description, slug…"
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="status" className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={status}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option === 'all' ? 'All statuses' : option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500"
          >
            Apply
          </button>
          <Link
            href="/admin/games"
            className="inline-flex items-center rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
          >
            Reset
          </Link>
        </div>
      </form>

      <AdminGamesTable games={result.games} locale={defaultLocale} />

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
