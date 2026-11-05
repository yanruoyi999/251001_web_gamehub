import { expect, it } from 'vitest';
import sitemap from '@/app/sitemap';
import { buildAbsoluteUrl } from '@/lib/seo';
import { getSeoLandingPage } from '@/lib/seo-landing-content';

it('discovers the bilingual Liar’s Dice guide at its canonical URLs', async () => {
  const guide = getSeoLandingPage('liars-dice-rules');
  expect(guide?.indexable).toBe(true);
  expect(guide?.locales.en.heading).toBeTruthy();
  expect(guide?.locales.zh.heading).toBeTruthy();
  const urls = (await sitemap()).map(entry => entry.url);
  expect(urls).toContain(buildAbsoluteUrl('/en/guides/liars-dice-rules'));
  expect(urls).toContain(buildAbsoluteUrl('/guides/liars-dice-rules'));
  expect(urls).not.toContain(buildAbsoluteUrl('/zh/guides/liars-dice-rules'));
});
