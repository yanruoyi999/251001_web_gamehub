import { describe, expect, it } from 'vitest';

import {
  isValidHttpsUrl,
  isValidId,
  isValidRating,
  isValidUrl,
  validatePagination,
} from './validation';

describe('validation utilities', () => {
  it('accepts only positive integer IDs', () => {
    expect(isValidId(1)).toBe(true);
    expect(isValidId(0)).toBe(false);
    expect(isValidId(-1)).toBe(false);
    expect(isValidId(1.5)).toBe(false);
    expect(isValidId('1')).toBe(false);
  });

  it('accepts integer ratings from one to five', () => {
    expect(isValidRating(1)).toBe(true);
    expect(isValidRating(5)).toBe(true);
    expect(isValidRating(0)).toBe(false);
    expect(isValidRating(6)).toBe(false);
    expect(isValidRating(4.5)).toBe(false);
  });

  it('normalizes and caps pagination', () => {
    expect(validatePagination()).toEqual({ page: 1, limit: 20, offset: 0 });
    expect(validatePagination(-2, 500)).toEqual({ page: 1, limit: 50, offset: 0 });
    expect(validatePagination(3, 10)).toEqual({ page: 3, limit: 10, offset: 20 });
  });

  it('allows HTTPS and loopback HTTP browser URLs only', () => {
    expect(isValidUrl('https://example.com/game')).toBe(true);
    expect(isValidUrl('http://localhost:3000/game')).toBe(true);
    expect(isValidUrl('http://127.0.0.1:3000/game')).toBe(true);
    expect(isValidUrl('http://example.com/game')).toBe(false);
    expect(isValidUrl('javascript:alert(1)')).toBe(false);
    expect(isValidUrl('data:text/html,hello')).toBe(false);
    expect(isValidUrl('not-a-url')).toBe(false);
  });

  it('requires HTTPS for external reference URLs', () => {
    expect(isValidHttpsUrl('https://example.com')).toBe(true);
    expect(isValidHttpsUrl('http://example.com')).toBe(false);
  });
});
