import { describe, expect, it } from 'vitest';
import sitemap from '@/app/sitemap';
import {
  getSeoLandingPage,
  getSeoLandingPages,
} from '@/lib/seo-landing-content';

const slug = 'spades-scoring';

describe('four-player partnership scoring guide', () => {
  it('exposes one static guide with reciprocal discovery from the distinct three-player rules', () => {
    const page = getSeoLandingPage(slug);
    expect(page).toBeDefined();
    expect(getSeoLandingPages().filter(p => p.slug === slug)).toHaveLength(1);
    expect(page!.indexable).not.toBe(false);
    expect(page!.embedGame).toBeUndefined();
    expect(page!.interactiveWidget).toBeUndefined();
    expect(page!.printablePath).toBeUndefined();
    expect(page!.relatedSlugs).toContain('three-player-spades');
    expect(
      getSeoLandingPage('three-player-spades')!.relatedSlugs.filter(
        s => s === slug
      )
    ).toHaveLength(1);
    for (const locale of ['en', 'zh'] as const) {
      expect(page!.locales[locale].recommendations).toEqual([]);
      expect(
        page!.locales[locale]
          .externalLinks!.map(link => new URL(link.href).hostname)
          .sort()
      ).toEqual(['bicyclecards.com', 'www.pagat.com']);
    }
  });

  it('keeps the authored hands arithmetically valid across a made bid, a set and a bag-cycle boundary', async () => {
    expect(getSeoLandingPage(slug)).toBeDefined();
    const { SPADES_SCORING_EXAMPLES } = await import(
      '@/lib/spades-scoring-guide-content'
    );
    const handChecked = [
      { handPoints: 62, nextScore: 62, nextBags: 2 },
      { handPoints: -80, nextScore: 80, nextBags: 0 },
      { handPoints: 44, nextScore: 181, nextBags: 1 },
    ];
    expect(SPADES_SCORING_EXAMPLES).toHaveLength(3);
    SPADES_SCORING_EXAMPLES.forEach((example, index) => {
      const bid = example.partnerBids[0] + example.partnerBids[1];
      const made = example.taken >= bid;
      const addedBags = made ? example.taken - bid : 0;
      const points = made ? 10 * bid + addedBags : -10 * bid;
      const totalBags = example.previousBags + addedBags;
      const penalty = Math.floor(totalBags / 10) * 100;
      expect(example.taken).toBeLessThanOrEqual(13);
      expect(example.handPoints).toBe(points);
      expect(example.bagPenalty).toBe(penalty);
      expect(example.nextBags).toBe(totalBags % 10);
      expect(example.nextScore).toBe(example.previousScore + points - penalty);
      expect({
        handPoints: example.handPoints,
        nextScore: example.nextScore,
        nextBags: example.nextBags,
      }).toEqual(handChecked[index]);
    });
  });

  it('publishes both locale URLs to the real sitemap exactly once without inventing a publication date', async () => {
    const page = getSeoLandingPage(slug);
    expect(page).toBeDefined();
    expect(page!.publishedAt).toBeUndefined();
    const entries = await sitemap();
    for (const prefix of ['/en', '']) {
      const hits = entries.filter(
        entry =>
          entry.url === `https://www.lumagamehub.com${prefix}/guides/${slug}`
      );
      expect(hits).toHaveLength(1);
      expect(hits[0].lastModified).toEqual(new Date(page!.updatedAt));
    }
  });
});
