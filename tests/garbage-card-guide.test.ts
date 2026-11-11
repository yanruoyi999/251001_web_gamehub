import { describe, expect, it } from 'vitest';
import { generateMetadata, generateStaticParams } from '@/app/[locale]/guides/[slug]/page';
import sitemap from '@/app/sitemap';
import { buildAbsoluteUrl } from '@/lib/seo';
import { getSeoLandingPage } from '@/lib/seo-landing-content';

const slug = 'garbage-card-game-rules';
const relatedSlugs = ['spit-card-game-rules', 'gin-rummy-rules'];

describe('Garbage card game rules', () => {
  it('serves two indexable canonical routes and lists each once in the sitemap', async () => {
    const paths = { zh: '/guides/' + slug, en: '/en/guides/' + slug };
    expect(generateStaticParams().filter(page => page.slug === slug)).toEqual([
      { locale: 'zh', slug },
      { locale: 'en', slug },
    ]);

    const urls = (await sitemap()).map(entry => entry.url);
    for (const locale of ['zh', 'en'] as const) {
      const metadata = await generateMetadata({ params: Promise.resolve({ locale, slug }) });
      expect(metadata.robots).toBeUndefined();
      expect(metadata.alternates?.canonical).toBe(paths[locale]);
      expect(metadata.alternates?.languages).toEqual({ 'zh-CN': paths.zh, 'en-US': paths.en });
      expect(urls.filter(url => url === buildAbsoluteUrl(paths[locale]))).toHaveLength(1);
    }
    expect(urls).not.toContain(buildAbsoluteUrl('/zh' + paths.zh));
  });

  it('includes the localized layout quick reference and two reciprocal guide links', () => {
    const guide = getSeoLandingPage(slug);
    expect(guide?.indexable).toBe(true);
    expect(guide?.embedGame).toBeUndefined();
    expect(guide?.relatedSlugs).toEqual(relatedSlugs);

    for (const locale of ['zh', 'en'] as const) {
      const layout = guide?.locales[locale].sections[0].bullets;
      expect(layout?.[0]).toContain('A, 2, 3, 4, 5');
      expect(layout?.[1]).toContain('6, 7, 8, 9, 10');
    }
    for (const relatedSlug of relatedSlugs) {
      const related = getSeoLandingPage(relatedSlug);
      expect(related?.relatedSlugs.filter(target => target === slug)).toHaveLength(1);
    }
  });
});
