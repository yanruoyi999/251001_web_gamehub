import { describe, expect, it } from 'vitest';
import { getGuideIntentProperties } from '@/lib/guide-intent';
import { getSeoLandingPage } from '@/lib/seo-landing-content';
import { scopaHands, scoreScopaHand } from '@/lib/scopa-guide-content';

const slug = 'scopa-card-game-rules';

describe('Scopa guide', () => {
  it('excludes the incomplete pile and awards no point for equal eligible totals', () => {
    expect(scopaHands.map(scoreScopaHand)).toEqual([
      [
        { prime: null, points: { cards: 0, coins: 0, sevenOfCoins: 1, primiera: 0, sweeps: 0 }, total: 1 },
        { prime: 78, points: { cards: 1, coins: 1, sevenOfCoins: 0, primiera: 1, sweeps: 1 }, total: 4 },
      ],
      [
        { prime: 74, points: { cards: 0, coins: 0, sevenOfCoins: 0, primiera: 0, sweeps: 0 }, total: 0 },
        { prime: 74, points: { cards: 1, coins: 1, sevenOfCoins: 1, primiera: 0, sweeps: 2 }, total: 5 },
      ],
    ]);
  });

  it('registers a bilingual pilot with a primary rules citation', () => {
    const guide = getSeoLandingPage(slug);
    expect(guide?.indexable).toBe(false);
    for (const locale of ['en', 'zh'] as const) {
      const copy = guide?.locales[locale];
      expect(copy?.sections.length).toBeGreaterThan(3);
      expect(copy?.externalLinks?.map(link => link.href))
        .toContain('https://www.pagat.com/fishing/scopa.html');
    }
  });

  it('allows measured entries and practice outcomes without raw answers', () => {
    for (const action of ['open_from_guides', 'score_first_incorrect', 'score_second_correct', 'practice_complete']) {
      expect(getGuideIntentProperties(slug, action, 'zh')).toEqual({
        guide_slug: slug, action, locale: 'zh', schema_version: 2,
      });
    }
    expect(getGuideIntentProperties(slug, 'score_1_4', 'en')).toBeNull();
  });
});
