import { describe, expect, it } from 'vitest';
import { generateMetadata, generateStaticParams } from '@/app/[locale]/guides/[slug]/page';
import sitemap from '@/app/sitemap';
import { buildAbsoluteUrl } from '@/lib/seo';
import { getSeoLandingPage } from '@/lib/seo-landing-content';

const slug = 'palace-card-game-rules';

describe('Palace card game rules', () => {
  it('serves both canonical guide routes and includes each once in the sitemap', async () => {
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

  it('provides a bilingual tabletop guide with two reciprocal card-guide links', () => {
    const guide = getSeoLandingPage(slug);
    expect(guide?.locales.en.heading).toBe('Palace Card Game Rules');
    expect(guide?.locales.zh.heading).toContain('Palace');
    expect(guide?.embedGame).toBeUndefined();
    expect(guide?.relatedSlugs).toEqual(['spit-card-game-rules', 'euchre-strategy']);

    for (const relatedSlug of ['spit-card-game-rules', 'euchre-strategy']) {
      const related = getSeoLandingPage(relatedSlug);
      expect(related).toBeDefined();
      expect(related?.indexable).not.toBe(false);
      expect(related?.relatedSlugs.filter(target => target === slug)).toHaveLength(1);
    }
  });
});
