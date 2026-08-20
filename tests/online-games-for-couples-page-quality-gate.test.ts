import { describe, expect, it } from 'vitest';

import { buildPageQualityRows } from '@/scripts/audit-page-quality';

describe('online games for couples page quality gate', () => {
  it('scores the indexable original collection at 80 or higher', () => {
    const row = buildPageQualityRows().find(
      (candidate) => candidate.path === '/games/online-games-for-couples',
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
