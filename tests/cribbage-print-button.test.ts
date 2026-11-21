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
      vi.stubGlobal('window', { print });
      clickPrintButton(locale);
      expect(trackEvent).toHaveBeenCalledExactlyOnceWith('cribbage_print_click', {
        locale,
      });
      expect(print).toHaveBeenCalledTimes(1);
      expect(trackEvent).toHaveBeenCalledBefore(print);
    }
  );

  it('still prints if tracking throws', () => {
    const print = vi.fn();
    vi.stubGlobal('window', { print });
    vi.mocked(trackEvent).mockImplementationOnce(() => {
      throw new Error('Telemetry unavailable');
    });
    expect(() => clickPrintButton('en')).not.toThrow();
    expect(print).toHaveBeenCalledTimes(1);
  });
});
