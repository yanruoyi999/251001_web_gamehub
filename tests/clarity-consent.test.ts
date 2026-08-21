import { afterEach, describe, expect, it, vi } from 'vitest';

function stubBrowser(hostname: string, savedConsent: string | null = null) {
  const insertBefore = vi.fn();

  vi.stubGlobal('window', {
    location: { hostname },
    localStorage: { getItem: vi.fn(() => savedConsent), setItem: vi.fn() },
  });
  vi.stubGlobal('document', {
    createElement: vi.fn(() => ({})),
    getElementsByTagName: vi.fn(() => [{ parentNode: { insertBefore } }]),
  });

  return { insertBefore };
}

describe('ClarityConsent', () => {
  afterEach(() => {
    vi.doUnmock('react');
    vi.resetModules();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('does not load the production project on localhost', async () => {
    vi.stubEnv('NEXT_PUBLIC_GAMEHUB_CLARITY_PROJECT_ID', 'test-project');
    vi.doMock('react', () => ({
      useEffect: (effect: () => void) => effect(),
      useState: (initial: unknown) => [initial, vi.fn()],
    }));
    const { insertBefore } = stubBrowser('localhost');

    const { ClarityConsent } = await import('@/components/analytics/ClarityConsent');
    ClarityConsent();

    expect(insertBefore).not.toHaveBeenCalled();
  });

  it('loads on the canonical production host without an interactive prompt', async () => {
    vi.stubEnv('NEXT_PUBLIC_GAMEHUB_CLARITY_PROJECT_ID', 'test-project');
    vi.doMock('react', () => ({
      useEffect: (effect: () => void) => effect(),
      useState: (initial: unknown) => [initial, vi.fn()],
    }));
    const { insertBefore } = stubBrowser('www.lumagamehub.com');

    const { ClarityConsent } = await import('@/components/analytics/ClarityConsent');
    ClarityConsent();

    expect(insertBefore).toHaveBeenCalledOnce();
  });

  it('also loads when the legacy consent key is already granted', async () => {
    vi.stubEnv('NEXT_PUBLIC_GAMEHUB_CLARITY_PROJECT_ID', 'test-project');
    vi.doMock('react', () => ({
      useEffect: (effect: () => void) => effect(),
      useState: (initial: unknown) => [initial, vi.fn()],
    }));
    const { insertBefore } = stubBrowser('www.lumagamehub.com', 'granted');

    const { ClarityConsent } = await import('@/components/analytics/ClarityConsent');
    ClarityConsent();

    expect(insertBefore).toHaveBeenCalledOnce();
  });
});
