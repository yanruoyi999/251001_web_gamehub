import { describe, expect, it } from 'vitest';
import { getPlaywrightCiOptions } from '../playwright.config';

describe('Playwright CI stability configuration', () => {
  it('serializes the single-worker, no-retry, retained-trace CI contract', () => {
    expect(getPlaywrightCiOptions(true)).toEqual({
      workers: 1,
      retries: 0,
      trace: 'retain-on-failure',
    });
  });

  it('preserves the local trace behavior outside CI', () => {
    expect(getPlaywrightCiOptions(false)).toEqual({
      workers: undefined,
      retries: 0,
      trace: 'on-first-retry',
    });
  });
});
