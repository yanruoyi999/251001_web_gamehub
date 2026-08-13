import { describe, expect, it } from 'vitest';

import { normalizePublicPathname } from '@/i18n/config';

describe('localized pathname normalization', () => {
  it('maps the internal default-locale route to the public Chinese URL', () => {
    expect(normalizePublicPathname('/zh')).toBe('/');
    expect(normalizePublicPathname('/zh/games')).toBe('/games');
  });

  it('keeps public and English-localized URLs unchanged', () => {
    expect(normalizePublicPathname('/')).toBe('/');
    expect(normalizePublicPathname('/games')).toBe('/games');
    expect(normalizePublicPathname('/en/games')).toBe('/en/games');
  });
});
