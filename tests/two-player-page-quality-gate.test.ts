import { describe, expect, it } from 'vitest';

import { buildPageQualityRows } from '@/scripts/audit-page-quality';

describe('two-player collection page quality gate', () => {
  it('scores the indexable collection at 80 or higher', () => {
    const row = buildPageQualityRows().find(
      (candidate) => candidate.path === '/games/2-player-unblocked',
    );

    expect(row).toBeDefined();
    expect(row).toMatchObject({
      type: 'static',
      indexable: true,
      action: 'keep',
    });
    expect(row?.score).toBeGreaterThanOrEqual(80);
  });
});
