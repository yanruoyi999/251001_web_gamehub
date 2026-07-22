import { describe, expect, it } from 'vitest';

import { getRelatedGames } from '@/lib/games/related-games';
import { getMockGameBySlug, mockGames } from '@/lib/mock-games';

describe('game taxonomy and recommendations', () => {
  it('classifies Google Snake as a casual score-chasing game', () => {
    const game = getMockGameBySlug('google-snake');

    expect(game).toBeDefined();
    expect(game!.categories.map((category) => category.slug)).toEqual(['casual']);
    expect(game!.tags.map((tag) => tag.slug)).toEqual(
      expect.arrayContaining(['singleplayer', 'keyboard', 'short-session', 'high-score']),
    );
  });

  it('uses hand-reviewed related games for exceptional titles', () => {
    const game = getMockGameBySlug('google-snake');
    const related = getRelatedGames(game!, mockGames, 3).map((candidate) => candidate.slug);

    expect(related).toEqual(['g-switch-2', 'ovo', 'tunnel-rush']);
    expect(related).not.toContain('adam-and-eve-4');
  });
});
