import { describe, expect, it } from 'vitest';

import {
  defaultLocale,
  getLocalizedPath,
  localePrefix,
} from '@/i18n/config';

describe('locale URL policy', () => {
  it('keeps Chinese on the canonical unprefixed URL', () => {
    expect(defaultLocale).toBe('zh');
    expect(localePrefix).toBe('as-needed');
    expect(getLocalizedPath('zh')).toBe('/');
    expect(getLocalizedPath('zh', '/games')).toBe('/games');
  });

  it('keeps English on prefixed URLs', () => {
    expect(getLocalizedPath('en')).toBe('/en');
    expect(getLocalizedPath('en', '/games')).toBe('/en/games');
  });
});
