import { describe, expect, it } from 'vitest';
import {
  getSeoLandingPage,
  getSeoLandingPages,
} from '@/lib/seo-landing-content';

describe('Three-player Spades guide', () => {
  it('registers a discoverable bilingual rules guide without a pretend game', () => {
    const page = getSeoLandingPage('three-player-spades');
    expect(page).toBeDefined();
    expect(
      getSeoLandingPages().filter(p => p.slug === page!.slug)
    ).toHaveLength(1);
    expect(page!.primaryKeyword).toBe('how to play spades with only 3 players');
    expect(page!.indexable).not.toBe(false);
    expect(page!.embedGame).toBeUndefined();
    expect(page!.interactiveWidget).toBeUndefined();
    expect(getSeoLandingPage('euchre-strategy')!.relatedSlugs).toContain(
      page!.slug
    );
    for (const locale of ['en', 'zh'] as const) {
      expect(page!.locales[locale].faqs).toHaveLength(5);
      expect(page!.locales[locale].externalLinks).toHaveLength(3);
    }
  });

  it('accounts for all 17 tricks and carries bags across a penalty correctly', async () => {
    expect(getSeoLandingPage('three-player-spades')).toBeDefined();
    const { SPADES_HAND_EXAMPLE, SPADES_BAG_EXAMPLE } = await import(
      '@/lib/three-player-spades-guide-content'
    );
    expect(SPADES_HAND_EXAMPLE).toHaveLength(3);
    expect(SPADES_HAND_EXAMPLE.reduce((sum, p) => sum + p.taken, 0)).toBe(17);
    for (const player of SPADES_HAND_EXAMPLE) {
      const made = player.taken >= player.bid;
      expect(player.delta).toBe(
        made ? 10 * player.bid + player.taken - player.bid : -10 * player.bid
      );
      expect(player.bags).toBe(made ? player.taken - player.bid : 0);
      for (const locale of ['en', 'zh'] as const) {
        expect(
          getSeoLandingPage('three-player-spades')!.locales[
            locale
          ].sections.some(s => s.bullets?.some(b => b.includes(player.name)))
        ).toBe(true);
      }
    }
    const e = SPADES_BAG_EXAMPLE;
    const totalBags = e.previousBags + e.taken - e.bid;
    expect(e.nextBags).toBe(totalBags % 10);
    expect(e.nextScore).toBe(
      e.previousScore +
        10 * e.bid +
        e.taken -
        e.bid -
        100 * Math.floor(totalBags / 10)
    );
    expect([e.nextScore, e.nextBags]).toEqual([202, 2]);
  });
});
