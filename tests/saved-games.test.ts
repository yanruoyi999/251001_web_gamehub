import { describe, expect, it } from 'vitest';

import { DAILY_RECOMMENDATION_POOL } from '@/lib/retention/daily-recommendation';
import { getSavedGameSummaries } from '@/lib/retention/saved-games';

describe('saved game summaries', () => {
  it('resolves local original and catalogue games in the requested order', () => {
    const summaries = getSavedGameSummaries([
      'spend-bill-gates-money',
      'google-snake',
      'spend-bill-gates-money',
    ]);

    expect(summaries.map(game => game.slug)).toEqual([
      'spend-bill-gates-money',
      'google-snake',
    ]);
    expect(summaries[0]?.thumbnailUrl).toBe('/og/spend-bill-gates-money');
  });

  it('does not expose unknown entries just because they are requested', () => {
    const summaries = getSavedGameSummaries(['ovo', 'not-a-real-game']);

    expect(summaries.map(game => game.slug)).not.toContain('not-a-real-game');
    expect(DAILY_RECOMMENDATION_POOL.map(entry => entry.slug)).not.toContain(
      'ovo'
    );
  });
});
