import type { MetadataRoute } from 'next';
import { getLocalizedPath, locales } from '@/i18n/config';
import { getSeoLandingPages } from '@/lib/seo-landing-content';
import { mockGames } from '@/lib/mock-games';
import {
  getCategoryEntries,
  getTagEntries,
  shouldIndexTagEntry,
} from '@/lib/game-taxonomy';
import { shouldIncludeGameInSitemap } from '@/lib/games/quality-policy';
import { shouldUseCatalogueDatabase } from '@/lib/games/catalog-mode';
import {
  SPEND_BILL_GATES_MONEY_PATH,
  SPEND_BILL_GATES_MONEY_UPDATED_AT,
} from '@/lib/games/spend-bill-gates-money-seo';
import {
  BRAINROT_REFLEX_PATH,
  BRAINROT_REFLEX_UPDATED_AT,
} from '@/lib/games/brainrot-reflex-seo';
import { buildAbsoluteUrl } from '@/lib/seo';
import {
  getDatabaseConnectionMetadata,
  shouldSkipSupabaseDirectInServerless,
} from '@/lib/db/connection-policy';

export const dynamic = 'force-dynamic';

const SITEMAP_DB_TIMEOUT_MS = 2000;
const standaloneGamePaths = [
  {
    path: '/games/monster-survivors',
    changeFrequency: 'monthly',
    priority: 0.55,
  },
  {
    path: '/games/solitaire',
    changeFrequency: 'monthly',
    priority: 0.55,
  },
  {
    path: SPEND_BILL_GATES_MONEY_PATH,
    changeFrequency: 'weekly',
    priority: 0.75,
    lastModified: new Date(SPEND_BILL_GATES_MONEY_UPDATED_AT),
  },
  {
    path: BRAINROT_REFLEX_PATH,
    changeFrequency: 'weekly',
    priority: 0.74,
    lastModified: new Date(BRAINROT_REFLEX_UPDATED_AT),
  },
] satisfies Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
  lastModified?: Date;
}>;

interface SitemapGameEntry {
  slug: string;
  isNew: boolean | null;
  lastModified?: Date | null;
}

function getFallbackSitemapGames(): SitemapGameEntry[] {
  return mockGames
    .filter((game) => shouldIncludeGameInSitemap(game.slug))
    .map((game) => ({
      slug: game.slug,
      isNew: game.isNew,
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

async function getSitemapGames(): Promise<SitemapGameEntry[]> {
  const connection = getDatabaseConnectionMetadata();
  if (
    !shouldUseCatalogueDatabase(connection) ||
    shouldSkipSupabaseDirectInServerless(connection)
  ) {
    return getFallbackSitemapGames();
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
    console.warn(
      'Failed to load database games for sitemap, falling back to mock games:',
      error,
    );
  }

  return getFallbackSitemapGames();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const staticPaths: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
    priority: number;
  }> = [
    {
      path: '/',
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      path: '/games',
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      path: '/guides',
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      path: '/guides/game-opportunity-radar',
      changeFrequency: 'weekly',
      priority: 0.78,
    },
    {
      path: '/guides/keyboard-only-browser-games',
      changeFrequency: 'weekly',
      priority: 0.82,
    },
    {
      path: '/guides/quick-play-guide',
      changeFrequency: 'monthly',
      priority: 0.74,
    },
    {
      path: '/guides/no-download-games',
      changeFrequency: 'monthly',
      priority: 0.74,
    },
    {
      path: '/privacy',
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      path: '/about',
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      path: '/contact',
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];
  const guides = getSeoLandingPages();
  const categories = getCategoryEntries();
  const tags = getTagEntries();
  const sitemapGames = await getSitemapGames();

  for (const locale of locales) {
    for (const staticPath of staticPaths) {
      const localizedPath = getLocalizedPath(locale, staticPath.path);
      entries.push({
        url: buildAbsoluteUrl(localizedPath),
        changeFrequency: staticPath.changeFrequency,
        priority: staticPath.priority,
      });
    }

    for (const guide of guides) {
      const localizedPath = getLocalizedPath(
        locale,
        `/guides/${guide.slug}`,
      );
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
        ...(game.lastModified ? { lastModified: game.lastModified } : {}),
        changeFrequency: game.isNew ? 'weekly' : 'monthly',
        priority: 0.6,
      });
    }

    for (const game of standaloneGamePaths) {
      entries.push({
        url: buildAbsoluteUrl(getLocalizedPath(locale, game.path)),
        ...(game.lastModified ? { lastModified: game.lastModified } : {}),
        changeFrequency: game.changeFrequency,
        priority: game.priority,
      });
    }

    for (const category of categories) {
      entries.push({
        url: buildAbsoluteUrl(
          getLocalizedPath(locale, `/games/category/${category.item.slug}`),
        ),
        changeFrequency: 'weekly',
        priority: 0.72,
      });
    }

    for (const tag of tags.filter(shouldIndexTagEntry)) {
      entries.push({
        url: buildAbsoluteUrl(
          getLocalizedPath(locale, `/games/tag/${tag.item.slug}`),
        ),
        changeFrequency: 'weekly',
        priority: 0.68,
      });
    }
  }

  return entries;
}
