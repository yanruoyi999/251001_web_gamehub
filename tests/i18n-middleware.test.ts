import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';
import middleware from '../middleware';

const origin = 'https://www.lumagamehub.com';

describe('public locale routing', () => {
  it('routes unprefixed pages internally to Chinese and preserves the query', () => {
    const response = middleware(new NextRequest(origin + '/search?q=snake&page=2', {
      headers: { 'accept-language': 'en-US' },
    }));

    expect(response.headers.get('x-middleware-rewrite')).toBe(origin + '/zh/search?q=snake&page=2');
    expect(response.headers.get('content-language')).toBe('zh');
    expect(response.headers.get('link')).toBeNull();
    expect(response.headers.get('set-cookie')).toBeNull();
  });

  it('uses the unprefixed canonical URL for a Chinese prefix', () => {
    const response = middleware(new NextRequest(origin + '/zh/search?q=snake&page=2'));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(origin + '/search?q=snake&page=2');
    expect(response.headers.get('content-language')).toBe('zh');
  });

  it('normalizes locale prefix casing before rendering', () => {
    const response = middleware(new NextRequest(origin + '/EN/games'));
    expect(response.headers.get('location')).toBe(origin + '/en/games');
  });

  it('keeps English on prefixed URLs, with no redirect or rewrite', () => {
    const response = middleware(new NextRequest(origin + '/en/games'));
    expect(response.headers.get('content-language')).toBe('en');
    expect(response.headers.get('x-middleware-rewrite')).toBeNull();
    expect(response.headers.get('location')).toBeNull();
  });
});
