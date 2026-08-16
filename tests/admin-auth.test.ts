import { afterEach, describe, expect, it, vi } from 'vitest';

import { verifyAdminSessionToken } from '@/lib/auth/admin';

describe('admin session token validation', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('rejects tokens with extra segments or unsafe base64url characters', () => {
    vi.stubEnv('ADMIN_PASSWORD', 'test-password');
    vi.stubEnv('NODE_ENV', 'test');

    expect(verifyAdminSessionToken('a.b.c')).toBe(false);
    expect(verifyAdminSessionToken('a.b=')).toBe(false);
    expect(verifyAdminSessionToken('not-a-session')).toBe(false);
  });

  it('rejects a signed payload that omits the session timestamp and nonce', () => {
    vi.stubEnv('ADMIN_PASSWORD', 'test-password');
    vi.stubEnv('NODE_ENV', 'test');

    const payload = Buffer.from(
      JSON.stringify({ v: 1, exp: Math.floor(Date.now() / 1000) + 100 }),
    ).toString('base64url');
    expect(verifyAdminSessionToken(`${payload}.invalid`)).toBe(false);
  });
});
