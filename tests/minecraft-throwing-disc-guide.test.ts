import { describe, expect, it } from 'vitest';
import { generateMetadata } from '@/app/[locale]/guides/[slug]/page';
import sitemap from '@/app/sitemap';
import { getGuideIntentProperties } from '@/lib/guide-intent';
import { getSeoLandingPage } from '@/lib/seo-landing-content';

describe('Throwing Disc guide', () => {
  it('exposes both draft routes for readers while keeping them out of search and the sitemap', async () => {
    const slug = 'minecraft-throwing-disc';
    const guide = getSeoLandingPage(slug);
    const entries = await sitemap();

    expect(guide?.embedGame).toBeUndefined();
    for (const locale of ['zh', 'en'] as const) {
      expect(
        guide?.locales[locale].sections.map(section => section.body).join(' ')
      ).toMatch(/26\.4.*26\.70\.26/);
      const metadata = await generateMetadata({
        params: Promise.resolve({ locale, slug }),
      });
      const path = (locale === 'zh' ? '' : '/en') + '/guides/' + slug;
      expect(metadata.alternates?.canonical).toBe(path);
      expect(metadata.robots).toEqual({ index: false, follow: true });
      expect(entries.some(entry => new URL(entry.url).pathname === path)).toBe(
        false
      );
    }
  });

  it('limits click tracking to the directory entry and read-guide button', () => {
    for (const locale of ['zh', 'en'] as const) {
      for (const action of ['open_from_guides', 'read_guide']) {
        expect(
          getGuideIntentProperties('minecraft-throwing-disc', action, locale)
        ).toEqual({
          guide_slug: 'minecraft-throwing-disc',
          action,
          locale,
          schema_version: 2,
        });
      }
    }
    expect(
      getGuideIntentProperties('minecraft-throwing-disc', 'unlisted', 'en')
    ).toBeNull();
  });
});
