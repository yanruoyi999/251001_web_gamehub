import { describe, expect, it } from 'vitest';

import {
  DAILY_RECOMMENDATION_POOL,
  getDailyRecommendation,
  getDailyRecommendations,
  getShanghaiDateKey,
} from '@/lib/retention/daily-recommendation';

const FIRST_PARTY_RECOMMENDATION_SLUGS = new Set([
  '2-player-unblocked',
  'spend-bill-gates-money',
  'snake-3d',
]);

describe('daily recommendation', () => {
  it('returns a stable recommendation for the same Shanghai date', () => {
    expect(getDailyRecommendation('2026-08-13')).toEqual(
      getDailyRecommendation('2026-08-13')
    );
  });

  it('avoids recommending the game currently being viewed when alternatives exist', () => {
    const recommendation = getDailyRecommendation(
      '2026-08-13',
      'spend-bill-gates-money'
    );
    expect(recommendation.slug).not.toBe('spend-bill-gates-money');
    expect(
      DAILY_RECOMMENDATION_POOL.some(
        entry => entry.slug === recommendation.slug
      )
    ).toBe(true);
  });

  it('returns three unique recommendations for the visible homepage module', () => {
    const recommendations = getDailyRecommendations('2026-08-13', undefined, 3);

    expect(recommendations).toHaveLength(3);
    expect(new Set(recommendations.map(entry => entry.slug)).size).toBe(3);
    expect(recommendations.every(entry => Number.isInteger(entry.gameId))).toBe(
      true
    );
  });

  it('keeps recommendation inventory first-party and does not reuse restricted captures', () => {
    expect(
      DAILY_RECOMMENDATION_POOL.every(entry =>
        FIRST_PARTY_RECOMMENDATION_SLUGS.has(entry.slug)
      )
    ).toBe(true);
    expect(
      DAILY_RECOMMENDATION_POOL.some(entry =>
        entry.image.startsWith('/game-screenshots/')
      )
    ).toBe(false);
    expect(DAILY_RECOMMENDATION_POOL.map(entry => entry.slug)).toContain(
      'spend-bill-gates-money'
    );
  });

  it('excludes the current game from a multi-card recommendation set', () => {
    const recommendations = getDailyRecommendations(
      '2026-08-13',
      'snake-3d',
      3
    );

    expect(recommendations.map(entry => entry.slug)).not.toContain('snake-3d');
  });

  it('uses the Asia/Shanghai calendar date for the rotation key', () => {
    const date = new Date('2026-08-12T16:30:00.000Z');
    expect(getShanghaiDateKey(date)).toBe('2026-08-13');
  });
});
