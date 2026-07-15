import { statSync } from 'node:fs';
import path from 'node:path';
import type { MetadataRoute } from 'next';
import { getLocalizedPath, locales } from '@/i18n/config';
import { getSeoLandingPages } from '@/lib/seo-landing-content';
import { mockGames } from '@/lib/mock-games';
import { getCategoryEntries, getTagEntries, shouldIndexTagEntry } from '@/lib/game-taxonomy';
import { shouldIncludeGameInSitemap } from '@/lib/games/quality-policy';
import { shouldUseCatalogueDatabase } from '@/lib/games/catalog-mode';
import { buildAbsoluteUrl } from '@/lib/seo';
import {
  getDatabaseConnectionMetadata,
  shouldSkipSupabaseDirectInServerless,
} from '@/lib/db/connection-policy';

export const dynamic = 'force-dynamic';

const SITEMAP_DB_TIMEOUT_MS = 2000;
const standaloneGamePaths = ['/games/monster-survivors', '/games/solitaire'];

function getFileLastModified(...segments: string[]): Date | undefined {
  try {
    const stats = statSync(path.join(process.cwd(), ...segments));
    return stats.mtime;
  } catch {
    return undefined;
  }
}

interface SitemapGameEntry {
  slug: string;
  isNew: boolean | null;
  lastModified?: Date | null;
}

function getFallbackSitemapGames(fallbackLastModified: Date): SitemapGameEntry[] {
  return mockGames
    .filter((game) => shouldIncludeGameInSitemap(game.slug))
    .map((game) => ({
      slug: game.slug,
      isNew: game.isNew,
      lastModified: fallbackLastModified,
    }));
}

function withSitemapTimeout<T>(promise: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error('Sitemap games database load timed out')),
      SITEMAP_DB_TIMEOUT_MS,
    );
  });

  return Promise.race([promise, timeout]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

async function getSitemapGames(fallbackLastModified: Date): Promise<SitemapGameEntry[]> {
  const connection = getDatabaseConnectionMetadata();
  if (!shouldUseCatalogueDatabase(connection) || shouldSkipSupabaseDirectInServerless(connection)) {
    return getFallbackSitemapGames(fallbackLastModified);
  }

  try {
    const [{ db }, { games }, { eq }] = await Promise.all([
      import('@/lib/db'),
      import('@/db/schema'),
      import('drizzle-orm'),
    ]);
    const queryPromise = db
      .select({
        slug: games.slug,
        isNew: games.isNew,
        publishedAt: games.publishedAt,
        updatedAt: games.updatedAt,
      })
      .from(games)
      .where(eq(games.status, 'active'));

    const rows = await withSitemapTimeout(queryPromise);

    if (rows.length > 0) {
      return rows
        .filter((game) => shouldIncludeGameInSitemap(game.slug))
        .map((game) => ({
          slug: game.slug,
          isNew: game.isNew,
          lastModified: game.updatedAt ?? game.publishedAt,
        }));
    }
  } catch (error) {
    console.warn('Failed to load database games for sitemap, falling back to mock games:', error);
  }

  return getFallbackSitemapGames(fallbackLastModified);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const staticPaths: Array<{
    path: string;
    file: string[];
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
    priority: number;
  }> = [
    {
      path: '/',
      file: ['app', '[locale]', 'page.tsx'],
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      path: '/games',
      file: ['app', '[locale]', 'games', 'page.tsx'],
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      path: '/guides',
      file: ['app', '[locale]', 'guides', 'page.tsx'],
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      path: '/guides/keyboard-only-browser-games',
      file: ['app', '[locale]', 'guides', 'keyboard-only-browser-games', 'page.tsx'],
      changeFrequency: 'weekly',
      priority: 0.82,
    },
    {
      path: '/guides/quick-play-guide',
      file: ['app', '[locale]', 'guides', 'quick-play-guide', 'page.tsx'],
      changeFrequency: 'monthly',
      priority: 0.74,
    },
    {
      path: '/guides/no-download-games',
      file: ['app', '[locale]', 'guides', 'no-download-games', 'page.tsx'],
      changeFrequency: 'monthly',
      priority: 0.74,
    },
    // AdSense必需页面
    {
      path: '/privacy',
      file: ['app', '[locale]', 'privacy', 'page.tsx'],
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      path: '/about',
      file: ['app', '[locale]', 'about', 'page.tsx'],
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      path: '/contact',
      file: ['app', '[locale]', 'contact', 'page.tsx'],
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];
  const guides = getSeoLandingPages();
  const categories = getCategoryEntries();
  const tags = getTagEntries();
  const mockGamesUpdatedAt = getFileLastModified('lib', 'mock-games.ts') ?? new Date();
  const sitemapGames = await getSitemapGames(mockGamesUpdatedAt);

  for (const locale of locales) {
    for (const staticPath of staticPaths) {
      const localizedPath = getLocalizedPath(locale, staticPath.path);
      const lastModified = getFileLastModified(...staticPath.file) ?? new Date();

      entries.push({
        url: buildAbsoluteUrl(localizedPath),
        lastModified,
        changeFrequency: staticPath.changeFrequency,
        priority: staticPath.priority,
      });
    }

    for (const guide of guides) {
      const localizedPath = getLocalizedPath(locale, `/guides/${guide.slug}`);
      entries.push({
        url: buildAbsoluteUrl(localizedPath),
        lastModified: new Date(guide.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }

    for (const game of sitemapGames) {
      const localizedPath = getLocalizedPath(locale, `/games/${game.slug}`);
      entries.push({
        url: buildAbsoluteUrl(localizedPath),
        lastModified: game.lastModified ?? mockGamesUpdatedAt,
        changeFrequency: game.isNew ? 'weekly' : 'monthly',
        priority: 0.6,
      });
    }

    for (const gamePath of standaloneGamePaths) {
      entries.push({
        url: buildAbsoluteUrl(getLocalizedPath(locale, gamePath)),
        lastModified: getFileLastModified('app', '[locale]', ...gamePath.split('/').filter(Boolean), 'page.tsx') ?? mockGamesUpdatedAt,
        changeFrequency: 'monthly',
        priority: 0.55,
      });
    }

    for (const category of categories) {
      entries.push({
        url: buildAbsoluteUrl(getLocalizedPath(locale, `/games/category/${category.item.slug}`)),
        lastModified: mockGamesUpdatedAt,
        changeFrequency: 'weekly',
        priority: 0.72,
      });
    }

    for (const tag of tags.filter(shouldIndexTagEntry)) {
      entries.push({
        url: buildAbsoluteUrl(getLocalizedPath(locale, `/games/tag/${tag.item.slug}`)),
        lastModified: mockGamesUpdatedAt,
        changeFrequency: 'weekly',
        priority: 0.68,
      });
    }
  }

  return entries;
}
