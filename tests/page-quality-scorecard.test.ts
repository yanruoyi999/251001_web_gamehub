import { describe, expect, it } from 'vitest';

import sitemap from '@/app/sitemap';
import { generateMetadata as generateTagMetadata } from '@/app/[locale]/games/tag/[slug]/page';
import { buildPageQualityRows, buildReport } from '@/scripts/audit-page-quality';
import { buildAbsoluteUrl } from '@/lib/seo';
import { getSeoLandingPage } from '@/lib/seo-landing-content';

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

  it('keeps the verified Telemount guide source-safe and above the index threshold', async () => {
    const page = getSeoLandingPage('telemount-walkthrough');
    const urls = (await sitemap()).map((entry) => entry.url);
    const row = buildPageQualityRows().find(
      (candidate) => candidate.path === '/guides/telemount-walkthrough',
    );

    expect(page).toBeDefined();
    expect(page?.embedGame).toBeUndefined();
    expect(page?.locales.en.sections.map((section) => section.body).join(' ')).toContain(
      'No touch controls appeared',
    );
    expect(page?.locales.en.sections.flatMap((section) => section.bullets ?? []).join(' ')).toContain(
      'Ctrl+Q',
    );
    expect(page?.locales.en.externalLinks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ href: 'https://hempuli.itch.io/telemount' }),
      ]),
    );
    expect(urls).toContain(buildAbsoluteUrl('/en/guides/telemount-walkthrough'));
    expect(row?.indexable).toBe(true);
    expect(row?.score).toBeGreaterThanOrEqual(80);
  });

  it('writes exactly one trailing newline', () => {
    const report = buildReport('2026-07-17T00:00:00.000Z');

    expect(report.endsWith('\n')).toBe(true);
    expect(report.endsWith('\n\n')).toBe(false);
  });
});
