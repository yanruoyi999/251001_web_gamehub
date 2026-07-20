import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

(globalThis as typeof globalThis & { React: typeof React }).React = React;

vi.mock('next/navigation', () => ({
  usePathname: () => '/en/guides/telemount-walkthrough',
}));

import { TypeformFeedbackButton } from '@/components/feedback/TypeformFeedbackButton';

describe('TypeformFeedbackButton', () => {
  it('uses a compact labelled icon on mobile and keeps text on larger screens', () => {
    const markup = renderToStaticMarkup(
      React.createElement(TypeformFeedbackButton, { locale: 'en' }),
    );

    expect(markup).toContain('aria-label="Feedback"');
    expect(markup).toContain('size-11');
    expect(markup).toContain('sm:hidden');
    expect(markup).toContain('sm:fixed');
    expect(markup).not.toContain('class="fixed ');
    expect(markup).toContain('class="hidden sm:inline">Feedback</span>');
  });
});
