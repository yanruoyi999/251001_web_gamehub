import { describe, expect, it } from 'vitest';
import { NINE_CARD_GOLF_GUIDE, golfHands, scoreGolfHand } from '@/lib/nine-card-golf-guide-content';
import { getSeoLandingPage } from '@/lib/seo-landing-content';
import { getGuideIntentProperties } from '@/lib/guide-intent';

describe('Nine Card Golf', () => {
  it('scores the two original hands by column', () => {
    expect(golfHands.map(scoreGolfHand)).toEqual([
      { columns: [24, 0, 6], total: 30 },
      { columns: [12, 6, 19], total: 37 },
    ]);
  });

  it('cancels a rank triple before card values and scores the remaining columns', () => {
    expect(scoreGolfHand(['2', 'K', 'J', '2', 'K', '2', '2', 'K', 'A']))
      .toEqual({ columns: [0, 0, 9], total: 9 });
    expect(scoreGolfHand(['2', 'K', 'J', 'A', 'K', '2', '2', 'K', 'A']))
      .toEqual({ columns: [-3, 0, 9], total: 6 });
  });

  it('registers the independent bilingual experiment, keeps six-card scoring separate and bounds events', () => {
    expect(getSeoLandingPage(NINE_CARD_GOLF_GUIDE.slug)?.indexable).toBe(false);
    expect(getSeoLandingPage('golf-card-game-rules')?.relatedSlugs).toContain(NINE_CARD_GOLF_GUIDE.slug);
    expect(NINE_CARD_GOLF_GUIDE.relatedSlugs).toContain('golf-card-game-rules');
    expect(getGuideIntentProperties(NINE_CARD_GOLF_GUIDE.slug, 'score_second_correct', 'zh')).toEqual({
      guide_slug: NINE_CARD_GOLF_GUIDE.slug, action: 'score_second_correct', locale: 'zh', schema_version: 2,
    });
    expect(getGuideIntentProperties(NINE_CARD_GOLF_GUIDE.slug, 'typed_answer_30', 'en')).toBeNull();
  });
});
