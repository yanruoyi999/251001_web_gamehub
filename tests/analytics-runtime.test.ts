import { describe, expect, it } from 'vitest';

import {
  isFormalProductionHost,
  shouldLoadProductionTelemetry,
} from '@/lib/analytics/runtime';

describe('production telemetry host gate', () => {
  it('accepts only the formal production hostnames', () => {
    expect(isFormalProductionHost('www.lumagamehub.com')).toBe(true);
    expect(isFormalProductionHost('lumagamehub.com')).toBe(true);
    expect(isFormalProductionHost('preview-lumagamehub.vercel.app')).toBe(false);
    expect(isFormalProductionHost('localhost')).toBe(false);
  });

  it('requires production runtime in addition to the formal hostname', () => {
    expect(shouldLoadProductionTelemetry('www.lumagamehub.com', 'production')).toBe(true);
    expect(shouldLoadProductionTelemetry('www.lumagamehub.com', 'development')).toBe(false);
    expect(shouldLoadProductionTelemetry('preview-lumagamehub.vercel.app', 'production')).toBe(false);
  });
});
