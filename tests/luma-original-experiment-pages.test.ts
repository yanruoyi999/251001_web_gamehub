import { describe, expect, it } from 'vitest';

import sitemap from '@/app/sitemap';
import { getLocalizedPath } from '@/i18n/config';
import {
  buildOriginalExperimentMetadata,
  getOriginalExperimentPage,
  ORIGINAL_EXPERIMENT_PAGE_SUMMARIES,
} from '@/lib/games/luma-original-experiment-pages';
import { buildAbsoluteUrl } from '@/lib/seo';

describe('Luma original experiment page contract', () => {
  it('keeps nine distinct bilingual noindex experiments with complete editorial blocks', async () => {
    expect(ORIGINAL_EXPERIMENT_PAGE_SUMMARIES).toHaveLength(9);
    expect(new Set(ORIGINAL_EXPERIMENT_PAGE_SUMMARIES.map((page) => page.path)).size).toBe(9);
    expect(ORIGINAL_EXPERIMENT_PAGE_SUMMARIES.map((page) => page.slug)).toEqual(
      expect.arrayContaining([
        'draw-a-perfect-circle',
        'chinese-checkers',
        'stacker-game',
        'two-player-games',
      ]),
    );
    const sitemapUrls = (await sitemap()).map((entry) => entry.url);

    for (const summary of ORIGINAL_EXPERIMENT_PAGE_SUMMARIES) {
      const page = getOriginalExperimentPage(summary.slug, 'en');
      const zhPage = getOriginalExperimentPage(summary.slug, 'zh');

      expect(page.locales.en.title).toBeTruthy();
      expect(zhPage.locales.zh.title).toBeTruthy();
      expect(page.locales.en.sections).toHaveLength(4);
      expect(page.locales.zh.sections).toHaveLength(4);
      expect(page.locales.en.faqs).toHaveLength(4);
      expect(page.locales.zh.faqs).toHaveLength(4);
      expect(page.locales.en.related).toHaveLength(3);
      expect(page.locales.zh.related).toHaveLength(3);
      expect(page.locales.en.originalNote.toLowerCase()).toContain('clean-room');
      expect(page.locales.zh.originalNote).toContain('原创');
      expect(sitemapUrls).not.toContain(buildAbsoluteUrl(summary.path));
      expect(sitemapUrls).not.toContain(buildAbsoluteUrl(`/en${summary.path}`));

      const metadata = buildOriginalExperimentMetadata(page, 'en');
      expect(metadata.robots).toMatchObject({ index: false, follow: true });
      expect(metadata.robots).toMatchObject({
        googleBot: { index: false, follow: true },
      });
      expect(metadata.alternates?.canonical).toBe(
        buildAbsoluteUrl(getLocalizedPath('en', summary.path)),
      );
      expect(
        buildOriginalExperimentMetadata(page, 'zh').alternates?.canonical,
      ).toBe(buildAbsoluteUrl(getLocalizedPath('zh', summary.path)));
      expect(summary.qualityScore).toBeGreaterThanOrEqual(80);
    }
  });

  it('gives every new page contextual inbound links from existing governed pages', () => {
    const inboundTargets = [
      '/games/draw-a-perfect-circle',
      '/games/chinese-checkers',
      '/games/stacker-game',
      '/games/two-player-games',
    ];
    const existingPages = ORIGINAL_EXPERIMENT_PAGE_SUMMARIES.slice(0, 5).map((summary) =>
      getOriginalExperimentPage(summary.slug, 'en'),
    );

    for (const target of inboundTargets) {
      expect(
        existingPages.some((page) => page.copy.related.some((link) => link.href === target)),
      ).toBe(true);
    }
  });
});
