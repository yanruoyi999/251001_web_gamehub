import { describe, expect, it } from 'vitest';

import { resolveMonitoringCatalogueMode } from '@/scripts/monitoring-status';

describe('resolveMonitoringCatalogueMode', () => {
  it('uses the production health mode instead of a stale local environment', () => {
    expect(
      resolveMonitoringCatalogueMode('https://www.lumagamehub.com', 'local', false),
    ).toBe(true);
    expect(
      resolveMonitoringCatalogueMode('https://www.lumagamehub.com', 'remote', true),
    ).toBe(false);
  });

  it('falls back to the local environment outside a production health response', () => {
    expect(resolveMonitoringCatalogueMode('https://www.lumagamehub.com', undefined, true)).toBe(
      true,
    );
    expect(resolveMonitoringCatalogueMode('http://127.0.0.1:3000', 'local', false)).toBe(false);
  });
});
