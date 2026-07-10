import Link from 'next/link';
import { notFound } from 'next/navigation';

import { requireAdminAuth } from '@/lib/auth/admin';
import { GameService, CategoryService, TagService } from '@/services';
import { AdminGameEditForm } from '@/components/admin/game-edit-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminGameDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminGameDetailPage({ params }: AdminGameDetailPageProps) {
  await requireAdminAuth();
  const { id } = await params;

  const gameId = Number(id);
  if (!Number.isInteger(gameId) || gameId <= 0) {
    notFound();
  }

  const [gameDetail, categoryOptions, tagOptions] = await Promise.all([
    GameService.getGameById(gameId),
    CategoryService.listAll(),
    TagService.listAll(),
  ]);

  if (!gameDetail) {
    notFound();
  }

  const game = {
    id: gameDetail.id,
    title: gameDetail.title,
    titleEn: gameDetail.titleEn,
    slug: gameDetail.slug,
    status: gameDetail.status ?? 'active',
    description: gameDetail.description,
    descriptionEn: gameDetail.descriptionEn,
    thumbnailUrl: gameDetail.thumbnailUrl,
    iframeUrl: gameDetail.iframeUrl,
    isNew: gameDetail.isNew,
    isHot: gameDetail.isHot,
    featured: gameDetail.featured,
    developerName: gameDetail.developerName,
    developerUrl: gameDetail.developerUrl,
    sourceUrl: gameDetail.sourceUrl,
    categoryIds: gameDetail.categories.map((category) => category.id),
    tagIds: gameDetail.tags.map((tag) => tag.id),
  };

  const categories = categoryOptions.map((item) => ({ id: item.id, name: item.name }));
  const tags = tagOptions.map((item) => ({ id: item.id, name: item.name }));

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Edit game</h1>
          <p className="text-sm text-slate-400">Update metadata, status, categories and tags.</p>
        </div>
        <nav className="flex items-center gap-4 text-xs font-medium uppercase tracking-wide">
          <Link href="/admin" className="text-slate-400 hover:text-slate-200">
            Dashboard
          </Link>
          <Link href="/admin/games" className="text-slate-400 hover:text-slate-200">
            ← Back to list
          </Link>
        </nav>
      </header>

      <Card className="border-slate-800 bg-slate-900/60 text-slate-100">
        <CardHeader>
          <CardTitle className="text-lg text-slate-100">Game information</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminGameEditForm game={game} categories={categories} tags={tags} />
        </CardContent>
      </Card>
    </div>
  );
}
