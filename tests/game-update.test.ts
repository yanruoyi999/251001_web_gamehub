import { describe, expect, it } from 'vitest';

import { normalizeGameUpdateInput } from '@/lib/games/game-update';

describe('normalizeGameUpdateInput', () => {
  it('keeps explicit nulls so optional admin fields can be cleared', () => {
    const result = normalizeGameUpdateInput({
      description: null,
      thumbnailUrl: null,
      developerName: null,
      developerUrl: null,
      sourceUrl: null,
    });

    expect(result.scalarUpdates).toEqual({
      description: null,
      thumbnailUrl: null,
      developerName: null,
      developerUrl: null,
      sourceUrl: null,
    });
  });

  it('separates and deduplicates relation IDs from game table columns', () => {
    const result = normalizeGameUpdateInput({
      title: '  Updated title  ',
      categoryIds: [3, '2', 3],
      tagIds: [],
    });

    expect(result.scalarUpdates).toEqual({ title: 'Updated title' });
    expect(result.categoryIds).toEqual([3, 2]);
    expect(result.tagIds).toEqual([]);
    expect(result.scalarUpdates).not.toHaveProperty('categoryIds');
    expect(result.scalarUpdates).not.toHaveProperty('tagIds');
  });

  it('normalizes slugs and accepts safe local thumbnail paths', () => {
    const result = normalizeGameUpdateInput({
      slug: '  Updated-Game  ',
      thumbnailUrl: '/games/updated.webp',
    });

    expect(result.scalarUpdates.slug).toBe('updated-game');
    expect(result.scalarUpdates.thumbnailUrl).toBe('/games/updated.webp');
  });

  it('rejects unsafe URLs and invalid relation IDs', () => {
    expect(() =>
      normalizeGameUpdateInput({ iframeUrl: 'javascript:alert(1)' })
    ).toThrow('Invalid iframe URL');
    expect(() =>
      normalizeGameUpdateInput({ thumbnailUrl: '//evil.example/image.png' })
    ).toThrow('Invalid thumbnail URL');
    expect(() => normalizeGameUpdateInput({ categoryIds: [1, 0] })).toThrow(
      'positive integer IDs'
    );
  });

  it('rejects empty or unknown-only updates', () => {
    expect(() => normalizeGameUpdateInput({})).toThrow(
      'No valid fields provided'
    );
    expect(() => normalizeGameUpdateInput({ unexpected: true })).toThrow(
      'No valid fields provided'
    );
  });
});
