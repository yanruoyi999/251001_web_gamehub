import { describe, expect, it } from 'vitest';
import { listFallbackGames } from '@/lib/games/fallback-list';
import { searchFallbackGames } from '@/lib/games/fallback-search';
import { mockGames } from '@/lib/mock-games';
import {
  isCoreIndexableGame,
  isGameUnderManualReview,
} from '@/lib/games/quality-policy';

describe('fallback game catalogue', () => {
  it('ranks Google Snake for multi-token snake queries', () => {
    const result = searchFallbackGames({ query: 'google snake', page: 1, limit: 5 });

    expect(result.source).toBe('fallback');
    expect(result.page).toBe(1);
    expect(result.limit).toBe(5);
    expect(result.games.some((game) => game.slug === 'google-snake')).toBe(true);
  });

  it('normalizes invalid pagination values', () => {
    const result = searchFallbackGames({ query: 'snake', page: Number.NaN, limit: 999 });

    expect(result.page).toBe(1);
    expect(result.limit).toBe(50);
  });

  it('lists local games with filters when the database is unavailable', () => {
    const result = listFallbackGames({
      search: 'snake',
      page: 1,
      limit: 10,
      status: 'active',
      sortBy: 'title',
      sortOrder: 'asc',
    });

    expect(result.source).toBe('fallback');
    expect(result.total).toBeGreaterThan(0);
    expect(result.games.some((game) => game.slug === 'google-snake')).toBe(true);
    expect(result.games.every((game) => game.status === 'active')).toBe(true);
  });

  it('does not fabricate engagement or publishing metrics for fallback list rows', () => {
    const result = listFallbackGames({ search: 'snake', page: 1, limit: 10 });
    const game = result.games.find((item) => item.slug === 'google-snake');

    expect(game).toBeDefined();
    expect(game).not.toHaveProperty('publishedAt');
    expect(game).not.toHaveProperty('playCount');
    expect(game).not.toHaveProperty('averageRating');
  });

  it('does not fabricate engagement or publishing metrics for fallback search rows', () => {
    const result = searchFallbackGames({ query: 'google snake', page: 1, limit: 5 });
    const game = result.games.find((item) => item.slug === 'google-snake');

    expect(game).toBeDefined();
    expect(game).not.toHaveProperty('publishedAt');
    expect(game).not.toHaveProperty('playCount');
    expect(game).not.toHaveProperty('averageRating');
  });

  it('does not publish two core indexable games with the same iframe URL', () => {
    const seen = new Map<string, string>();
    const duplicates: Array<{ iframeUrl: string; firstSlug: string; duplicateSlug: string }> = [];

    for (const game of mockGames.filter((item) => isCoreIndexableGame(item.slug))) {
      const iframeUrl = game.iframeUrl.trim();
      const firstSlug = seen.get(iframeUrl);
      if (firstSlug) {
        duplicates.push({ iframeUrl, firstSlug, duplicateSlug: game.slug });
      } else {
        seen.set(iframeUrl, game.slug);
      }
    }

    expect(duplicates).toEqual([]);
  });

  it('keeps catalogue-only games out of the public fallback directory and search', () => {
    const catalogueOnlyGame = mockGames.find(
      (game) => !isCoreIndexableGame(game.slug) && !isGameUnderManualReview(game.slug),
    );

    expect(catalogueOnlyGame).toBeDefined();

    const directory = listFallbackGames({ page: 1, limit: 500 });
    const search = searchFallbackGames({
      query: catalogueOnlyGame!.titleEn,
      page: 1,
      limit: 20,
    });

    expect(directory.games.some((game) => game.slug === catalogueOnlyGame!.slug)).toBe(false);
    expect(search.games.some((game) => game.slug === catalogueOnlyGame!.slug)).toBe(false);
  });

  it('returns an empty list for non-public fallback statuses', () => {
    const result = listFallbackGames({ status: 'pending' });

    expect(result.source).toBe('fallback');
    expect(result.games).toEqual([]);
    expect(result.total).toBe(0);
  });

  it('keeps the verified Monkey Mart source aligned with its title', () => {
    const game = mockGames.find((item) => item.slug === 'monkey-mart');

    expect(game?.iframeUrl).toBe(
      'https://szhong.4399.com/4399swf//upload_swf/ftp41/gamehwq/20221216/09/index.htm',
    );
    expect(game?.sourcePageUrl).toBe(game?.iframeUrl);
    expect(game?.thumbnailUrl).toBe('/game-screenshots/monkey-mart.png');
  });
});
