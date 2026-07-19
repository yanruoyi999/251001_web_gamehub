import { afterEach, describe, expect, it, vi } from 'vitest';

function stubBrowser(hostname: string) {
  const insertBefore = vi.fn();

  vi.stubGlobal('window', {
    location: { hostname },
    localStorage: { getItem: vi.fn(() => null) },
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
    vi.doMock('react', () => ({ useEffect: (effect: () => void) => effect() }));
    const { insertBefore } = stubBrowser('localhost');

    const { ClarityConsent } = await import('@/components/analytics/ClarityConsent');
    ClarityConsent();

    expect(insertBefore).not.toHaveBeenCalled();
  });

  it('loads the configured project on the canonical production host', async () => {
    vi.stubEnv('NEXT_PUBLIC_GAMEHUB_CLARITY_PROJECT_ID', 'test-project');
    vi.doMock('react', () => ({ useEffect: (effect: () => void) => effect() }));
    const { insertBefore } = stubBrowser('www.lumagamehub.com');

    const { ClarityConsent } = await import('@/components/analytics/ClarityConsent');
    ClarityConsent();

    expect(insertBefore).toHaveBeenCalledOnce();
  });
});
