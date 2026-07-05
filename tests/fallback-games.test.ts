import { describe, expect, it } from 'vitest';
import { listFallbackGames } from '@/lib/games/fallback-list';
import { searchFallbackGames } from '@/lib/games/fallback-search';

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

  it('returns an empty list for non-public fallback statuses', () => {
    const result = listFallbackGames({ status: 'pending' });

    expect(result.source).toBe('fallback');
    expect(result.games).toEqual([]);
    expect(result.total).toBe(0);
  });
});
