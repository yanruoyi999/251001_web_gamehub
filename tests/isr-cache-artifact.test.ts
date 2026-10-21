import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { isRegeneratedCache, scopedHtmlPath } from '../scripts/isr-cache-artifact';

const owner = { kind: 'APP_PAGE', sourceRoute: '/[locale]/page' };
const key = `/route-cache/APP_PAGE/${createHash('sha256').update(owner.sourceRoute).digest('hex')}/$/en`;

describe('ISR scoped cache validation', () => {
  it('resolves the owner-scoped artifact, not the immutable build seed', () => {
    expect(scopedHtmlPath('/build/server', 'en', { routeCache: { owner, key } }))
      .toBe(`/build/server${key}.html`);
    expect(() => scopedHtmlPath('/build/server', 'zh', { routeCache: { owner, key } })).toThrow();
    expect(() => scopedHtmlPath('/build/server', '../en', { routeCache: { owner, key } })).toThrow();
    expect(() => scopedHtmlPath('/build/server', 'en', { routeCache: { owner: { ...owner, sourceRoute: '/other/page' }, key } })).toThrow();
  });

  it('rejects copied stale seeds and requires renewed freshness plus a new file timestamp', () => {
    expect(isRegeneratedCache(10_000, { routeCacheLastModified: 100 }, 100)).toBe(false);
    expect(isRegeneratedCache(10_000, {}, 100)).toBe(true);
    expect(isRegeneratedCache(100, {}, 100)).toBe(false);
    expect(isRegeneratedCache(10_000, { routeCacheLastModified: '10000' }, 100)).toBe(false);
  });
});
