import { describe, expect, it } from 'vitest';
import { generateMetadata, generateStaticParams } from '@/app/[locale]/guides/[slug]/page';
import sitemap from '@/app/sitemap';
import { buildAbsoluteUrl } from '@/lib/seo';
import { getSeoLandingPage } from '@/lib/seo-landing-content';

const slug = 'booray-card-game-rules';
const paths = { zh: `/guides/${slug}`, en: `/en/guides/${slug}` };

describe('Booray guide discovery', () => {
  it('publishes each language on its own indexable canonical URL and lists both in the sitemap', async () => {
    const urls = (await sitemap()).map(entry => entry.url);

    expect(generateStaticParams().filter(entry => entry.slug === slug)).toHaveLength(2);
    for (const locale of ['zh', 'en'] as const) {
      const metadata = await generateMetadata({ params: Promise.resolve({ locale, slug }) });
      expect(metadata.robots).toBeUndefined();
      expect(metadata.alternates).toEqual({
        canonical: paths[locale],
        languages: { 'zh-CN': paths.zh, 'en-US': paths.en },
      });
      expect(urls.filter(url => url === buildAbsoluteUrl(paths[locale]))).toHaveLength(1);
    }
    expect(urls).not.toContain(buildAbsoluteUrl(`/zh${paths.zh}`));
  });

  it('links to public trick-taking guides without promising an online Booray game', () => {
    const guide = getSeoLandingPage(slug);
    expect(guide).toBeDefined();
    expect(guide?.embedGame).toBeUndefined();
    expect(guide?.relatedSlugs ?? []).toHaveLength(2);
    for (const related of guide?.relatedSlugs ?? []) {
      const target = getSeoLandingPage(related);
      expect(target).toBeDefined();
      expect(target?.indexable).not.toBe(false);
    }
  });
});
