import { describe, expect, it } from 'vitest';
import { scoreOntarioBidEuchreHand } from '@/lib/bid-euchre-guide-content';
import { getGuideIntentProperties } from '@/lib/guide-intent';
import { getSeoLandingPage, getSeoLandingPages } from '@/lib/seo-landing-content';

describe('Ontario four-player Bid Euchre', () => {
  it.each([
    [5, 6, { bidders: 6, defenders: 2 }],
    [5, 5, { bidders: 5, defenders: 3 }],
    [5, 4, { bidders: -5, defenders: 4 }],
    ['call-two', 8, { bidders: 12, defenders: 0 }],
    ['call-one', 7, { bidders: -18, defenders: 1 }],
    ['moonshot', 8, { bidders: 24, defenders: 0 }],
    ['moonshot', 7, { bidders: -24, defenders: 1 }],
  ] as const)('scores a %s contract with %i tricks', (contract, tricks, score) => {
    expect(scoreOntarioBidEuchreHand(contract, tricks)).toEqual(score);
  });

  it('uses a single bilingual noindex guide reached only from standard Euchre', () => {
    const slug = 'bid-euchre-rules';
    const page = getSeoLandingPage(slug);
    expect(page?.indexable).toBe(false);
    expect(page?.locales.en.heading).toMatch(/Bid Euchre/);
    expect(page?.locales.zh.heading).toMatch(/叫牌/);
    expect(getSeoLandingPages().filter(guide => guide.relatedSlugs.includes(slug)).map(guide => guide.slug))
      .toEqual(['euchre-strategy']);
    expect(getGuideIntentProperties('euchre-strategy', 'open_bid_euchre_rules', 'en')).not.toBeNull();
    expect(getGuideIntentProperties(slug, 'practice_complete', 'zh')).not.toBeNull();
  });
});
