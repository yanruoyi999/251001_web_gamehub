import { describe, expect, it } from 'vitest';

import { sanitizeSearchQuery, validatePagination } from '@/lib/utils/validation';

describe('validation utils', () => {
  it('should trim search query', () => {
    expect(sanitizeSearchQuery('  test  ')).toBe('test');
  });

  it('should fallback to defaults in validatePagination', () => {
    const result = validatePagination(-1, 1000);
    expect(result.page).toBe(1);
    expect(result.limit).toBeLessThanOrEqual(50);
  });
});
