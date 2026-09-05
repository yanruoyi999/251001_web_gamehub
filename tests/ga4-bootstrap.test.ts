import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

const layoutSource = await readFile(
  new URL('../components/layout/document-shell.tsx', import.meta.url),
  'utf8'
);
const productionTelemetrySource = await readFile(
  new URL('../components/analytics/ProductionTelemetry.tsx', import.meta.url),
  'utf8'
).catch(() => '');

describe('GA4 bootstrap', () => {
  it('hydrates telemetry on the browser production host instead of gating static HTML by headers', () => {
    expect(layoutSource).toContain('<ProductionTelemetry />');
    expect(layoutSource).not.toContain(
      "requestHeaders.get('x-forwarded-host')"
    );
    expect(productionTelemetrySource).toContain(
      'shouldLoadProductionTelemetry'
    );
  });

  it('exposes gtag before the SPA listener starts sending page views', () => {
    expect(productionTelemetrySource).toContain('strategy="afterInteractive"');
    expect(productionTelemetrySource).toContain(
      'window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};'
    );
    expect(productionTelemetrySource).toContain(
      "window.gtag('config', '${GA_TRACKING_ID}', { send_page_view: false });"
    );
  });
});
