import { describe, expect, it } from 'vitest';

import {
  DAILY_RECOMMENDATION_POOL,
  getDailyRecommendation,
  getShanghaiDateKey,
} from '@/lib/retention/daily-recommendation';

describe('daily recommendation', () => {
  it('returns a stable recommendation for the same Shanghai date', () => {
    expect(getDailyRecommendation('2026-08-13')).toEqual(getDailyRecommendation('2026-08-13'));
  });

  it('avoids recommending the game currently being viewed when alternatives exist', () => {
    const recommendation = getDailyRecommendation('2026-08-13', 'google-snake');
    expect(recommendation.slug).not.toBe('google-snake');
    expect(DAILY_RECOMMENDATION_POOL.some((entry) => entry.slug === recommendation.slug)).toBe(true);
  });

  it('uses the Asia/Shanghai calendar date for the rotation key', () => {
    const date = new Date('2026-08-12T16:30:00.000Z');
    expect(getShanghaiDateKey(date)).toBe('2026-08-13');
  });
});
