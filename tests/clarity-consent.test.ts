import { afterEach, describe, expect, it, vi } from 'vitest';

function stubBrowser(
  hostname: string,
  savedConsent: string | null = null,
  pathname = '/en/games',
  clarity?: ReturnType<typeof vi.fn>,
) {
  const insertBefore = vi.fn();

  vi.stubGlobal('window', {
    location: { hostname, pathname },
    localStorage: { getItem: vi.fn(() => savedConsent), setItem: vi.fn() },
    ...(clarity ? { clarity } : {}),
  });
  vi.stubGlobal('document', {
    createElement: vi.fn(() => ({})),
    getElementsByTagName: vi.fn(() => [{ parentNode: { insertBefore } }]),
  });

  return { insertBefore };
}

function mockReactAndPathname(pathname: string) {
  vi.doMock('react', () => ({
    useEffect: (effect: () => void) => effect(),
    useState: (initial: unknown) => [initial, vi.fn()],
  }));
  vi.doMock('next/navigation', () => ({
    usePathname: () => pathname,
  }));
}

describe('ClarityConsent', () => {
  afterEach(() => {
    vi.doUnmock('react');
    vi.doUnmock('next/navigation');
    vi.resetModules();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('does not load the production project on localhost', async () => {
    vi.stubEnv('NEXT_PUBLIC_GAMEHUB_CLARITY_PROJECT_ID', 'test-project');
    mockReactAndPathname('/en/games');
    const { insertBefore } = stubBrowser('localhost');

    const { ClarityConsent } = await import('@/components/analytics/ClarityConsent');
    ClarityConsent();

    expect(insertBefore).not.toHaveBeenCalled();
  });

  it('does not load on the canonical production host without explicit consent', async () => {
    vi.stubEnv('NEXT_PUBLIC_GAMEHUB_CLARITY_PROJECT_ID', 'test-project');
    mockReactAndPathname('/en/games');
    const { insertBefore } = stubBrowser('www.lumagamehub.com');

    const { ClarityConsent } = await import('@/components/analytics/ClarityConsent');
    ClarityConsent();

    expect(insertBefore).not.toHaveBeenCalled();
  });

  it('loads only after explicit granted consent on a regular canonical production page', async () => {
    vi.stubEnv('NEXT_PUBLIC_GAMEHUB_CLARITY_PROJECT_ID', 'test-project');
    mockReactAndPathname('/en/games');
    const { insertBefore } = stubBrowser('www.lumagamehub.com', 'granted');

    const { ClarityConsent } = await import('@/components/analytics/ClarityConsent');
    ClarityConsent();

    expect(insertBefore).toHaveBeenCalledOnce();
  });

  it('never loads Clarity on the couples route even when analytics consent was granted earlier', async () => {
    vi.stubEnv('NEXT_PUBLIC_GAMEHUB_CLARITY_PROJECT_ID', 'test-project');
    const pathname = '/en/games/online-games-for-couples';
    mockReactAndPathname(pathname);
    const { insertBefore } = stubBrowser('www.lumagamehub.com', 'granted', pathname);

    const { ClarityConsent } = await import('@/components/analytics/ClarityConsent');
    ClarityConsent();

    expect(insertBefore).not.toHaveBeenCalled();
  });

  it('stops an already-loaded Clarity session when SPA navigation enters the couples route', async () => {
    vi.stubEnv('NEXT_PUBLIC_GAMEHUB_CLARITY_PROJECT_ID', 'test-project');
    const pathname = '/zh/games/online-games-for-couples';
    const clarity = vi.fn();
    mockReactAndPathname(pathname);
    const { insertBefore } = stubBrowser('www.lumagamehub.com', 'granted', pathname, clarity);

    const { ClarityConsent } = await import('@/components/analytics/ClarityConsent');
    ClarityConsent();

    expect(insertBefore).not.toHaveBeenCalled();
    expect(clarity).toHaveBeenCalledWith('consent', false);
    expect(clarity).not.toHaveBeenCalledWith('consentv2', expect.anything());
  });
});