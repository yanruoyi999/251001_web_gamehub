import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { getSeoLandingPage, getSeoLandingPages } from '@/lib/seo-landing-content';

const sameColor: Record<string, string> = { H: 'D', D: 'H', C: 'S', S: 'C' };
const effectiveSuit = (card: string, trump: string) => card === `J${sameColor[trump]}` ? trump : card.slice(-1);
const rank = (card: string, trump: string, lead: string) => {
  const suit = effectiveSuit(card, trump);
  if (card === `J${trump}`) return 107;
  if (card === `J${sameColor[trump]}`) return 106;
  const value = ['9', '10', 'J', 'Q', 'K', 'A'].indexOf(card.slice(0, -1));
  return suit === trump ? 100 + value : suit === effectiveSuit(lead, trump) ? 10 + value : value;
};

describe('Euchre editorial guide', () => {
  it('registers one bilingual strategy page with contextual discovery and no fake game', () => {
    const page = getSeoLandingPage('euchre-strategy');
    expect(page).toBeDefined();
    expect(getSeoLandingPages().filter(p => p.slug === 'euchre-strategy')).toHaveLength(1);
    expect(page!.primaryKeyword).toBe('euchre strategy');
    expect(page!.indexable).not.toBe(false);
    expect(page!.embedGame).toBeUndefined();
    expect(page!.relatedSlugs.length).toBeGreaterThanOrEqual(2);
    expect(getSeoLandingPage('categories-game-topics')!.relatedSlugs).toContain('euchre-strategy');
    for (const locale of ['en', 'zh'] as const) {
      expect(page!.locales[locale].sections.length).toBeGreaterThanOrEqual(10);
      expect(page!.locales[locale].externalLinks!.length).toBeGreaterThanOrEqual(3);
      expect(page!.locales[locale].faqs.length).toBeGreaterThanOrEqual(4);
    }
  });
  it('checks every original example against effective suit and trick ranking', async () => {
    expect(existsSync(new URL('../lib/euchre-guide-content.ts', import.meta.url))).toBe(true);
    const { EUCHRE_EXAMPLES, EUCHRE_GUIDE } = await import('@/lib/euchre-guide-content');
    expect(EUCHRE_EXAMPLES).toHaveLength(4);
    for (const example of EUCHRE_EXAMPLES) {
      expect(example.hand).toHaveLength(5);
      expect(new Set(example.hand).size).toBe(5);
      const following = example.hand.filter(card => effectiveSuit(card, example.trump) === effectiveSuit(example.lead, example.trump));
      expect(following.length ? following : example.hand).toEqual(example.legal);
      expect(example.legal).toContain(example.chosen);
      for (const locale of ['en', 'zh'] as const) {
        expect(EUCHRE_GUIDE.locales[locale].sections.some(section => section.title === example.title[locale])).toBe(true);
        expect(example.explanation[locale].length).toBeGreaterThan(40);
      }
      if (example.trick) {
        expect(example.trick[0]).toBe(example.lead);
        expect(example.trick[3]).toBe(example.chosen);
        expect(new Set([...example.hand, ...example.trick.slice(0, 3)]).size).toBe(8);
        const ranks = example.trick.map(card => rank(card, example.trump, example.lead));
        expect(ranks.indexOf(Math.max(...ranks))).toBe(example.winner);
      }
    }
  });
});
