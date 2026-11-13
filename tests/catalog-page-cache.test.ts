import { describe, expect, it } from 'vitest';
import { isPublicCatalogDocument } from '../lib/games/catalog-page-cache';

const site = 'https://www.lumagamehub.com';

describe('public catalogue document caching', () => {
  it.each(['/games', '/en/games', '/games/tunnel-rush', '/en/games/tunnel-rush'])(
    'includes the anonymous document %s',
    path => expect(isPublicCatalogDocument(new Request(site + path))).toBe(true),
  );

  it.each([
    '/en',
    '/en/guides/google-snake-mods',
    '/en/games/saved',
    '/en/games/ovo',
    '/en/games?page=2',
    '/en/games?search=Snake',
    '/en/games?categoryId=1',
    '/en/games?sortBy=title',
    '/en/games?_rsc=abc',
    '/en/games/tunnel-rush?utm_source=share',
  ])('keeps %s outside the pilot', path => {
    expect(isPublicCatalogDocument(new Request(site + path))).toBe(false);
  });

  it.each([
    ['cookie', 'theme=dark'],
    ['authorization', 'Bearer example'],
    ['range', 'bytes=0-100'],
    ['rsc', '1'],
    ['next-router-state-tree', 'example'],
    ['next-router-prefetch', '1'],
    ['next-router-segment-prefetch', '/_tree'],
    ['next-action', 'example'],
  ])('excludes requests with %s', (name, value) => {
    const request = new Request(site + '/en/games', { headers: { [name]: value } });
    expect(isPublicCatalogDocument(request)).toBe(false);
  });

  it('excludes writes', () => {
    expect(isPublicCatalogDocument(new Request(site + '/en/games', { method: 'POST' }))).toBe(false);
  });
});
