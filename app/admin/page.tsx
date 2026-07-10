import Link from 'next/link';
import { sql, eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { games, ratings, categories, tags } from '@/db/schema';
import { requireAdminAuth } from '@/lib/auth/admin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

async function getDashboardStats() {
  const [[{ totalGames }], [{ activeGames }]] = await Promise.all([
    db.select({ totalGames: sql<number>`COUNT(*)` }).from(games),
    db
      .select({ activeGames: sql<number>`COUNT(*)` })
      .from(games)
      .where(eq(games.status, 'active')),
  ]);

  const [[{ pendingRatings }], [{ totalCategories }], [{ totalTags }]] = await Promise.all([
    db
      .select({ pendingRatings: sql<number>`COUNT(*)` })
      .from(ratings)
      .where(eq(ratings.status, 'pending')),
    db.select({ totalCategories: sql<number>`COUNT(*)` }).from(categories),
    db.select({ totalTags: sql<number>`COUNT(*)` }).from(tags),
  ]);

  return {
    totalGames: Number(totalGames ?? 0),
    activeGames: Number(activeGames ?? 0),
    pendingRatings: Number(pendingRatings ?? 0),
    totalCategories: Number(totalCategories ?? 0),
    totalTags: Number(totalTags ?? 0),
  };
}

export default async function AdminDashboardPage() {
  await requireAdminAuth();

  const stats = await getDashboardStats();

  const cards = [
    {
      title: 'Total games',
      value: stats.totalGames.toLocaleString(),
      description: `${stats.activeGames.toLocaleString()} active titles`,
      href: '/admin/games',
    },
    {
      title: 'Pending ratings',
      value: stats.pendingRatings.toLocaleString(),
      description: 'Awaiting moderation',
      href: '/admin/ratings',
    },
    {
      title: 'Categories',
      value: stats.totalCategories.toLocaleString(),
      description: 'Available filters',
      href: '/admin/games',
    },
    {
      title: 'Tags',
      value: stats.totalTags.toLocaleString(),
      description: 'Content labels',
      href: '/admin/games',
    },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">
          Quick overview of platform content and moderation queues.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.title} href={card.href} className="group">
            <Card className="h-full border-slate-800 bg-slate-900/60 text-slate-100 transition group-hover:border-indigo-500/60 group-hover:bg-slate-900">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-slate-300">
                  {card.title}
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  {card.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">{card.value}</p>
                <p className="mt-2 text-xs font-medium text-indigo-300">Open section →</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
