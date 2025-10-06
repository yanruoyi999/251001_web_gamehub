import { describe, expect, it } from 'vitest';

import { ensureUniqueSlug, generateSlug, isValidSlug } from '@/lib/utils/slug';

describe('slug utils', () => {
  it('generateSlug should normalize whitespace and casing', () => {
    expect(generateSlug('  My Awesome Game  ')).toBe('my-awesome-game');
  });

  it('generateSlug should remove disallowed characters', () => {
    expect(generateSlug('塔防!! 3000???')).toBe('3000');
  });

  it('isValidSlug should allow lowercase letters, numbers and hyphen separators', () => {
    expect(isValidSlug('action-rpg-2')).toBe(true);
  });

  it('isValidSlug should reject uppercase letters or invalid patterns', () => {
    expect(isValidSlug('Action_RPG')).toBe(false);
    expect(isValidSlug('bad-')).toBe(false);
  });

  it('ensureUniqueSlug should append numeric suffixes when needed', () => {
    const existing = ['game-slug', 'game-slug-2', 'game-slug-3'];
    expect(ensureUniqueSlug('game-slug', existing)).toBe('game-slug-4');
  });

  it('ensureUniqueSlug should return original slug when unused', () => {
    const existing = ['other-game'];
    expect(ensureUniqueSlug('fresh-slug', existing)).toBe('fresh-slug');
  });
});
