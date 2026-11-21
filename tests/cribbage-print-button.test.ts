import type { ReactElement } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CribbagePrintButton } from '@/components/seo/cribbage-print-button';
import { trackEvent } from '@/lib/gtag';

vi.mock('@/lib/gtag', () => ({ trackEvent: vi.fn() }));

function clickPrintButton(locale: 'en' | 'zh') {
  const view = CribbagePrintButton({ locale }) as ReactElement<{
    children: ReactElement<{ onClick: () => void }>;
  }>;
  view.props.children.props.onClick();
}

afterEach(() => {
  vi.resetAllMocks();
  vi.unstubAllGlobals();
});

describe('Cribbage print intent', () => {
  it.each(['en', 'zh'] as const)(
    'queues one %s click event and opens printing for one activation',
    locale => {
      const print = vi.fn();
      const pathname = locale === 'en' ? '/en/guides/cribbage-scoring-chart' : '/guides/cribbage-scoring-chart';
      const origin = 'https://www.lumagamehub.com';
      vi.stubGlobal('window', { print, location: { origin, pathname, search: '?test=private' } });
      clickPrintButton(locale);
      expect(trackEvent).toHaveBeenCalledExactlyOnceWith(
        'cribbage_print_click',
        { locale, page_location: origin + pathname },
        { waitForInitialization: true }
      );
      expect(print).toHaveBeenCalledTimes(1);
      expect(trackEvent).toHaveBeenCalledBefore(print);
    }
  );

  it('still prints if tracking throws', () => {
    const print = vi.fn();
    vi.stubGlobal('window', {
      print,
      location: { origin: 'https://www.lumagamehub.com', pathname: '/en/guides/cribbage-scoring-chart' },
    });
    vi.mocked(trackEvent).mockImplementationOnce(() => {
      throw new Error('Telemetry unavailable');
    });
    expect(() => clickPrintButton('en')).not.toThrow();
    expect(print).toHaveBeenCalledTimes(1);
  });
});
