import { describe, expect, it } from 'vitest';
import { generateMetadata, generateStaticParams } from '@/app/[locale]/guides/[slug]/page';
import sitemap from '@/app/sitemap';
import { getSeoLandingPage, getSeoLandingPages } from '@/lib/seo-landing-content';

const slug = 'president-card-game-rules';
const paths = { zh: `/guides/${slug}`, en: `/en/guides/${slug}` };

describe('President card game rules', () => {
  it('serves both localized routes with self-canonical noindex and follow metadata', async () => {
    expect(generateStaticParams().filter(page => page.slug === slug)).toEqual([
      { locale: 'zh', slug },
      { locale: 'en', slug },
    ]);

    for (const locale of ['zh', 'en'] as const) {
      const metadata = await generateMetadata({ params: Promise.resolve({ locale, slug }) });
      expect(metadata.robots).toEqual({ index: false, follow: true });
      expect(metadata.alternates).toEqual({
        canonical: paths[locale],
        languages: { 'zh-CN': paths.zh, 'en-US': paths.en },
      });
    }
  });

  it('keeps the trial out of the sitemap and other guides’ related links', async () => {
    const urls = (await sitemap()).map(entry => entry.url);
    expect(urls.some(url => url.includes(slug))).toBe(false);

    const otherGuides = getSeoLandingPages().filter(page => page.slug !== slug);
    expect(otherGuides.some(page => page.relatedSlugs.includes(slug))).toBe(false);

    const relatedSlugs = getSeoLandingPage(slug)?.relatedSlugs ?? [];
    expect(relatedSlugs).toHaveLength(2);
    for (const relatedSlug of relatedSlugs) {
      expect(getSeoLandingPage(relatedSlug)?.indexable).toBe(true);
    }
  });
});
