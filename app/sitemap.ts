import { statSync } from 'node:fs';
import path from 'node:path';
import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { getSeoLandingPages } from '@/lib/seo-landing-content';
import { mockGames } from '@/lib/mock-games';
import { buildAbsoluteUrl } from '@/lib/seo';

function getFileLastModified(...segments: string[]): Date | undefined {
  try {
    const stats = statSync(path.join(process.cwd(), ...segments));
    return stats.mtime;
  } catch {
    return undefined;
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
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
      path: '/search',
      file: ['app', '[locale]', 'search', 'page.tsx'],
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      path: '/guides',
      file: ['app', '[locale]', 'guides', 'page.tsx'],
      changeFrequency: 'weekly',
      priority: 0.75,
    },
  ];
  const guides = getSeoLandingPages();
  const mockGamesUpdatedAt = getFileLastModified('lib', 'mock-games.ts') ?? new Date();

  for (const locale of locales) {
    for (const staticPath of staticPaths) {
      const localizedPath = staticPath.path === '/' ? `/${locale}` : `/${locale}${staticPath.path}`;
      const lastModified = getFileLastModified(...staticPath.file) ?? new Date();

      entries.push({
        url: buildAbsoluteUrl(localizedPath),
        lastModified,
        changeFrequency: staticPath.changeFrequency,
        priority: staticPath.priority,
      });
    }

    for (const guide of guides) {
      const localizedPath = `/${locale}/guides/${guide.slug}`;
      entries.push({
        url: buildAbsoluteUrl(localizedPath),
        lastModified: new Date(guide.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }

    for (const game of mockGames) {
      const localizedPath = `/${locale}/games/${game.slug}`;
      entries.push({
        url: buildAbsoluteUrl(localizedPath),
        lastModified: mockGamesUpdatedAt,
        changeFrequency: game.isNew ? 'weekly' : 'monthly',
        priority: 0.6,
      });
    }
  }

  return entries;
}
