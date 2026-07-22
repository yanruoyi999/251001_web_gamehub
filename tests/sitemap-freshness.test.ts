import { describe, expect, it } from 'vitest';

import sitemap from '@/app/sitemap';
import { buildAbsoluteUrl } from '@/lib/seo';
import { getSeoLandingPage } from '@/lib/seo-landing-content';

describe('sitemap freshness', () => {
  it('omits lastModified when the catalogue has no stable content timestamp', async () => {
    const entries = await sitemap();
    const home = entries.find((entry) => entry.url === buildAbsoluteUrl('/en'));
    const game = entries.find(
      (entry) => entry.url === buildAbsoluteUrl('/en/games/google-snake'),
    );

    expect(home?.lastModified).toBeUndefined();
    expect(game?.lastModified).toBeUndefined();
  });

  it('keeps editorial guide timestamps backed by the content registry', async () => {
    const guide = getSeoLandingPage('telemount-walkthrough');
    const entries = await sitemap();
    const sitemapEntry = entries.find(
      (entry) => entry.url === buildAbsoluteUrl('/en/guides/telemount-walkthrough'),
    );

    expect(guide).toBeDefined();
    expect(guide?.updatedAt).toBe('2026-07-21T00:00:00.000Z');
    expect(sitemapEntry?.lastModified).toEqual(new Date(guide!.updatedAt));
  });
});
