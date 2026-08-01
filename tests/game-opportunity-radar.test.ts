import { describe, expect, it } from 'vitest';

import {
  evaluateGameOpportunity,
  type GameOpportunityInput,
} from '@/lib/game-opportunity-radar';

const leanSoloInput: GameOpportunityInput = {
  platform: 'browser',
  team: 'solo',
  budget: 'lean',
  timeline: '60d',
  genre: 'roguelike',
};

describe('evaluateGameOpportunity', () => {
  it('rates a deliberately narrow solo browser MVP as testable', () => {
    const result = evaluateGameOpportunity(leanSoloInput, 'en');

    expect(result.score).toBeGreaterThanOrEqual(60);
    expect(result.band).toBe('promising');
    expect(result.scope).toContain('core loop');
    expect(result.disclaimer).toContain('not a revenue forecast');
  });

  it('marks a one-month solo MMO as high risk and narrows the scope', () => {
    const result = evaluateGameOpportunity(
      {
        platform: 'steam',
        team: 'solo',
        budget: 'starter',
        timeline: '30d',
        genre: 'mmorpg',
      },
      'en',
    );

    expect(result.band).toBe('high-risk');
    expect(result.score).toBe(20);
    expect(result.risk).toContain('MMO');
    expect(result.scope).toContain('prototype');
  });

  it('returns localized Chinese guidance without changing the numeric score', () => {
    const english = evaluateGameOpportunity(leanSoloInput, 'en');
    const chinese = evaluateGameOpportunity(leanSoloInput, 'zh');

    expect(chinese.score).toBe(english.score);
    expect(chinese.disclaimer).toContain('不是收入预测');
    expect(chinese.scope).not.toBe(english.scope);
  });

  it('is deterministic for the same input', () => {
    expect(evaluateGameOpportunity(leanSoloInput, 'en')).toEqual(
      evaluateGameOpportunity(leanSoloInput, 'en'),
    );
  });

  it('always clamps the score between 20 and 95', () => {
    const strongest = evaluateGameOpportunity(
      {
        platform: 'browser',
        team: 'studio',
        budget: 'studio',
        timeline: '90d',
        genre: 'tower-defense',
      },
      'en',
    );
    const weakest = evaluateGameOpportunity(
      {
        platform: 'steam',
        team: 'solo',
        budget: 'starter',
        timeline: '30d',
        genre: 'mmorpg',
      },
      'en',
    );

    expect(strongest.score).toBeLessThanOrEqual(95);
    expect(weakest.score).toBeGreaterThanOrEqual(20);
  });
});
