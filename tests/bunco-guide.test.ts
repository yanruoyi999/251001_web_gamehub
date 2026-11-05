import { expect, it } from 'vitest';
import sitemap from '@/app/sitemap';
import { buildAbsoluteUrl } from '@/lib/seo';
import { getSeoLandingPage, getSeoLandingPages } from '@/lib/seo-landing-content';

it('discovers one bilingual Bunco guide at its canonical URLs', async () => {
  const page = getSeoLandingPage('bunco-rules');
  expect(page?.indexable).toBe(true);
  expect(getSeoLandingPages().filter(p => p.slug === 'bunco-rules')).toHaveLength(1);
  expect(page?.publishedAt).toBeUndefined();
  expect(page?.relatedSlugs).toEqual(expect.arrayContaining(['farkle-scoring', 'liars-dice-rules']));
  for (const locale of ['en', 'zh'] as const) expect(page?.locales[locale].heading).toBeTruthy();
  const urls = (await sitemap()).map(entry => entry.url);
  for (const prefix of ['', '/en']) expect(urls.filter(url => url === buildAbsoluteUrl(`${prefix}/guides/bunco-rules`))).toHaveLength(1);
  expect(urls).not.toContain(buildAbsoluteUrl('/zh/guides/bunco-rules'));
});
