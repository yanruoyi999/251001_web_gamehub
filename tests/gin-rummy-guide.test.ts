import { expect, it } from 'vitest';
import sitemap from '@/app/sitemap';
import { buildAbsoluteUrl } from '@/lib/seo';
import { getSeoLandingPage } from '@/lib/seo-landing-content';

it('publishes one discoverable Gin Rummy guide in each canonical locale', async () => {
  const guide = getSeoLandingPage('gin-rummy-rules');
  expect(guide?.indexable).toBe(true);
  expect(guide?.embedGame).toBeUndefined();
  for (const slug of guide!.relatedSlugs) {
    const related = getSeoLandingPage(slug);
    expect(related, slug).toBeDefined();
    expect(related?.indexable, slug).not.toBe(false);
  }
  const urls = (await sitemap()).map(entry => entry.url);
  for (const prefix of ['', '/en']) {
    expect(urls.filter(url => url === buildAbsoluteUrl(`${prefix}/guides/gin-rummy-rules`))).toHaveLength(1);
  }
  expect(urls).not.toContain(buildAbsoluteUrl('/zh/guides/gin-rummy-rules'));
});
