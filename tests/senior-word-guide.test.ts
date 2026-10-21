import { describe, expect, it } from 'vitest';
import { getSeoLandingPage, getSeoLandingPages } from '@/lib/seo-landing-content';

describe('senior word activities publishing contract', () => {
  it('publishes one bilingual written activity guide with discoverable related routes', () => {
    const page = getSeoLandingPage('word-games-for-seniors')!;
    expect(page).toBeDefined();
    expect(getSeoLandingPages().filter(p => p.slug === page.slug)).toHaveLength(1);
    expect(page.embedGame).toBeUndefined();
    expect(page.publishedAt).toBeUndefined();
    expect(page.relatedSlugs.length).toBeGreaterThanOrEqual(2);
    page.relatedSlugs.forEach(slug => expect(getSeoLandingPage(slug)).toBeDefined());
    expect(getSeoLandingPage('categories-game-topics')!.relatedSlugs).toContain(page.slug);
    for (const locale of ['en', 'zh'] as const) {
      const cards = page.locales[locale].sections.filter(s => /^[1-6]\. /.test(s.title));
      expect(cards).toHaveLength(6);
      cards.forEach(card => expect(card.bullets?.length).toBe(4));
    }
  });
  it('keeps the supplied word-chain examples valid in each language', () => {
    const page = getSeoLandingPage('word-games-for-seniors')!;
    for (const locale of ['en', 'zh'] as const) {
      const chain = page.locales[locale].sections.find(s => s.title.startsWith('4. '))!.bullets![0];
      const words = chain.split(/: |：/)[1].replace(/[.。]$/, '').split(' → ');
      for (let i = 1; i < words.length; i++) expect(words[i][0]).toBe(words[i - 1].slice(-1));
    }
  });
});
