import { afterEach, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.resetModules();
});

it('queues only opted-in events and flushes each activation once after GA initialization', async () => {
  vi.stubEnv('NEXT_PUBLIC_GA_ID', 'G-CODEXTEST');
  vi.stubEnv('NODE_ENV', 'production');
  const browser = Object.assign(new EventTarget(), {
    location: { hostname: 'www.lumagamehub.com' },
    gtag: undefined as ReturnType<typeof vi.fn> | undefined,
  });
  vi.stubGlobal('window', browser);
  const { GA_READY_EVENT, trackEvent } = await import('@/lib/gtag');

  trackEvent('ordinary_event');
  const options = { waitForInitialization: true };
  trackEvent('cribbage_print_click', { locale: 'en' }, options);
  trackEvent('cribbage_print_click', { locale: 'zh' }, options);
  const gtag = vi.fn();
  browser.gtag = gtag;
  expect(gtag).not.toHaveBeenCalled();

  browser.dispatchEvent(new Event(GA_READY_EVENT));
  browser.dispatchEvent(new Event(GA_READY_EVENT));
  expect(gtag.mock.calls).toEqual([
    ['event', 'cribbage_print_click', { locale: 'en' }],
    ['event', 'cribbage_print_click', { locale: 'zh' }],
  ]);
});
