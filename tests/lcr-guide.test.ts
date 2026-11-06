import { expect, it } from 'vitest';
import sitemap from '@/app/sitemap';
import { buildAbsoluteUrl } from '@/lib/seo';
import { getSeoLandingPage, getSeoLandingPages } from '@/lib/seo-landing-content';

it('publishes one bilingual classic LCR rules task, not a playable or money game', async () => {
  const page = getSeoLandingPage('left-right-center-rules');
  expect(page, 'independent LCR guide must exist').toBeDefined();
  expect(page!.primaryKeyword).toBe('left right center rules');
  expect(page!.embedGame).toBeUndefined();
  expect(page!.interactiveWidget).toBeUndefined();
  expect(page!.indexable).toBe(true);
  expect(page!.publishedAt).toBeUndefined();
  expect(getSeoLandingPages().filter(p => p.slug === page!.slug)).toHaveLength(1);
  for (const lang of ['en', 'zh'] as const) {
    const content = page!.locales[lang];
    expect(content.sections.length).toBeGreaterThanOrEqual(7);
    expect(content.faqs.length).toBeGreaterThanOrEqual(3);
    expect(content.externalLinks?.map(x => x.href)).toContain('https://arxiv.org/html/2407.05069v1');
    expect(content.recommendations).toEqual([]);
  }
  const text = JSON.stringify(page!.locales.en);
  for (const phrase of ['not the boxed instruction sheet', 'zero chips', 'clockwise', 'at most three', '3, 3, 3, 3', '1, 4, 3, 4', 'one player']) expect(text).toContain(phrase);
  expect(text).not.toMatch(/win money|cash prize|guaranteed/i);
  const urls = (await sitemap()).map(p => p.url);
  for (const prefix of ['', '/en']) expect(urls.filter(url => url === buildAbsoluteUrl(`${prefix}/guides/left-right-center-rules`))).toHaveLength(1);
  const inbound = getSeoLandingPages().filter(p => p.relatedSlugs.includes(page!.slug));
  expect(inbound.length).toBeGreaterThanOrEqual(1);
});
