import { afterEach, describe, expect, it, vi } from 'vitest';

describe('pageview', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('sends one explicit page_view with landing-page fields', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_ID', 'G-TEST123');
    const gtag = vi.fn();
    vi.stubGlobal('window', {
      gtag,
      location: { href: 'https://www.lumagamehub.com/en/games?tag=arcade' },
    });
    vi.stubGlobal('document', { title: 'Free Browser Games' });

    const { pageview } = await import('@/lib/gtag');
    pageview('/en/games?tag=arcade');

    expect(gtag).toHaveBeenCalledOnce();
    expect(gtag).toHaveBeenCalledWith('event', 'page_view', {
      page_path: '/en/games?tag=arcade',
      page_location: 'https://www.lumagamehub.com/en/games?tag=arcade',
      page_title: 'Free Browser Games',
    });
  });
});
