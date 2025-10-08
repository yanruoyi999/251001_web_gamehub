import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { getSeoLandingPages } from '@/lib/seo-landing-content';
import { mockGames } from '@/lib/mock-games';
import { buildAbsoluteUrl } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const staticPaths = ['/', '/games', '/search', '/guides'];
  const guides = getSeoLandingPages();

  for (const locale of locales) {
    for (const path of staticPaths) {
      const localizedPath = path === '/' ? `/${locale}` : `/${locale}${path}`;
      entries.push({
        url: buildAbsoluteUrl(localizedPath),
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: path === '/' ? 1 : 0.7,
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
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  return entries;
}
