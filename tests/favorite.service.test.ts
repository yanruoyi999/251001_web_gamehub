import { beforeAll, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/db', () => ({ db: {} }));
vi.mock('@/db/schema', () => ({ favorites: {}, games: {} }));

import { generateAnonymousToken, hashIp } from '@/lib/utils/hash';

let FavoriteService: typeof import('@/services/favorite.service')['FavoriteService'];

beforeAll(async () => {
  ({ FavoriteService } = await import('@/services/favorite.service'));
});

describe('FavoriteService.getContextFromHeaders', () => {
  const headersMap = new Map<string, string>([
    ['x-forwarded-for', '203.0.113.5, 10.0.0.1'],
    ['user-agent', 'VitestSuite/1.0'],
    ['accept-language', 'en-US'],
  ]);

  const headersStub = {
    get(name: string) {
      return headersMap.get(name.toLowerCase()) ?? null;
    },
  };

  it('should derive hashed identifiers from incoming headers', () => {
    const context = FavoriteService.getContextFromHeaders(headersStub);

    expect(context.userIpHash).toBe(hashIp('203.0.113.5'));
    expect(context.anonymousToken).toBe(generateAnonymousToken('VitestSuite/1.0', 'en-US'));
  });

  it('should fallback to default IP when headers are missing', () => {
    const emptyHeaders = {
      get() {
        return null;
      },
    };

    const context = FavoriteService.getContextFromHeaders(emptyHeaders);

    expect(context.userIpHash).toBe(hashIp('0.0.0.0'));
    expect(context.anonymousToken).toBe(generateAnonymousToken('', ''));
  });
});
