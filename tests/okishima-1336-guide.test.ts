import { describe, expect, it } from 'vitest';
import { generateMetadata } from '@/app/[locale]/guides/[slug]/page';
import sitemap from '@/app/sitemap';
import { getGuideIntentProperties } from '@/lib/guide-intent';
import { getSeoLandingPage } from '@/lib/seo-landing-content';

describe('Okishima:1336 guide', () => {
  it('keeps both editorial pages noindex with the same official experience', async () => {
    const slug = 'okishima-1336';
    const guide = getSeoLandingPage(slug);
    const indexedPaths = (await sitemap()).map(
      entry => new URL(entry.url).pathname
    );

    expect(guide).toBeDefined();
    expect(guide?.embedGame).toBeUndefined();
    for (const locale of ['zh', 'en'] as const) {
      const route = (locale === 'en' ? '/en' : '') + '/guides/' + slug;
      const metadata = await generateMetadata({
        params: Promise.resolve({ locale, slug }),
      });
      expect(metadata.alternates?.canonical).toBe(route);
      expect(metadata.robots).toEqual({ index: false, follow: true });
      expect(indexedPaths).not.toContain(route);
      expect(guide?.locales[locale].quickAnswerLink?.href).toBe(
        'https://www.roblox.com/games/86355335942235/Okishima-1336'
      );
      for (const action of ['open_from_guides', 'source_status']) {
        expect(getGuideIntentProperties(slug, action, locale)).toEqual({
          guide_slug: slug,
          action,
          locale,
          schema_version: 2,
        });
      }
      expect(getGuideIntentProperties(slug, 'read_guide', locale)).toBeNull();
    }
  });
});
