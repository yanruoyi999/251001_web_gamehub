import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

const layoutSource = await readFile(new URL('../app/layout.tsx', import.meta.url), 'utf8');

describe('GA4 bootstrap', () => {
  it('exposes gtag before the SPA listener starts sending page views', () => {
    expect(layoutSource).toContain('strategy="beforeInteractive"');
    expect(layoutSource).toContain(
      'window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};',
    );
    expect(layoutSource).toContain("window.gtag('config', '${GA_TRACKING_ID}', { send_page_view: false });");
  });
});
