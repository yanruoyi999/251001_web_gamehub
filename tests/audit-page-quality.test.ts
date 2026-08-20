import { describe, expect, it } from 'vitest';

import { buildPageQualityRows } from '@/scripts/audit-page-quality';

describe('standalone original game quality coverage', () => {
  it('tracks Snake 3D separately and keeps it noindex before release gates', () => {
    const row = buildPageQualityRows().find((item) => item.path === '/games/snake-3d');

    expect(row).toBeDefined();
    expect(row?.score).toBeGreaterThanOrEqual(80);
    expect(row?.indexable).toBe(false);
    expect(row?.action).toBe('noindex');
    expect(row?.nextStep).toContain('runtime');
  });

  it('tracks Checkers separately and keeps it noindex during the behavior experiment', () => {
    const row = buildPageQualityRows().find((item) => item.path === '/games/checkers-rules');

    expect(row).toBeDefined();
    expect(row?.score).toBeGreaterThanOrEqual(80);
    expect(row?.indexable).toBe(false);
    expect(row?.action).toBe('noindex');
    expect(row?.nextStep).toContain('experiment');
  });
});
