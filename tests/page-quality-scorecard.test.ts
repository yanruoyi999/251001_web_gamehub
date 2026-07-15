import { describe, expect, it } from 'vitest';

import sitemap from '@/app/sitemap';
import { generateMetadata as generateTagMetadata } from '@/app/[locale]/games/tag/[slug]/page';
import { buildPageQualityRows } from '@/scripts/audit-page-quality';
import { buildAbsoluteUrl } from '@/lib/seo';

describe('page quality scorecard', () => {
  it('keeps every indexable scored page at 80 or higher', () => {
    const underThreshold = buildPageQualityRows().filter(
      (row) => row.indexable && row.score < 80,
    );

    expect(underThreshold).toEqual([]);
  });

  it('removes thin tag pages from sitemap and marks them noindex', async () => {
    const urls = (await sitemap()).map((entry) => entry.url);

    expect(urls).not.toContain(buildAbsoluteUrl('/games/tag/timed-challenge'));
    expect(urls).not.toContain(buildAbsoluteUrl('/en/games/tag/timed-challenge'));
    expect(urls).not.toContain(buildAbsoluteUrl('/games/tag/progression'));
    expect(urls).not.toContain(buildAbsoluteUrl('/en/games/tag/progression'));

    const metadata = await generateTagMetadata({
      params: Promise.resolve({ locale: 'en', slug: 'timed-challenge' }),
    });

    expect(metadata.robots).toMatchObject({
      index: false,
      follow: true,
    });
  });
});
