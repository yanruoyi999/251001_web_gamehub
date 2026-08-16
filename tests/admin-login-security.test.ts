import { afterEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  consume: vi.fn(),
  clear: vi.fn(),
  createSession: vi.fn(),
  validatePassword: vi.fn(),
  assertPassword: vi.fn(),
}));

vi.mock('@/lib/auth/admin-rate-limit', () => ({
  consumeAdminLoginAttempt: mocks.consume,
  clearAdminLoginAttempts: mocks.clear,
}));
vi.mock('@/lib/auth/admin', () => ({
  createAdminSession: mocks.createSession,
  validateAdminPassword: mocks.validatePassword,
  assertAdminPasswordConfigured: mocks.assertPassword,
}));
vi.mock('@/lib/games/catalog-mode', () => ({
  isLocalCatalogueMode: () => false,
}));

import { POST } from '@/app/api/admin/login/route';

function request(headers: HeadersInit = {}) {
  return new Request('https://www.lumagamehub.com/api/admin/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify({ password: 'test-password' }),
  });
}

describe('admin login boundary checks', () => {
  afterEach(() => {
    vi.resetAllMocks();
    vi.unstubAllEnvs();
  });

  it('rejects missing Origin in production before touching the rate limiter', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    const response = await POST(request());

    expect(response.status).toBe(403);
    expect(mocks.consume).not.toHaveBeenCalled();
  });

  it('fails closed when the shared rate limiter is unavailable', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    mocks.consume.mockResolvedValue({
      available: false,
      allowed: false,
      retryAfterSeconds: 0,
    });

    const response = await POST(request({ origin: 'https://www.lumagamehub.com' }));

    expect(response.status).toBe(503);
    expect(mocks.createSession).not.toHaveBeenCalled();
  });

  it('returns the shared retry response after the limit is reached', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    mocks.consume.mockResolvedValue({
      available: true,
      allowed: false,
      retryAfterSeconds: 900,
    });

    const response = await POST(request({ origin: 'https://www.lumagamehub.com' }));

    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBe('900');
  });
});
