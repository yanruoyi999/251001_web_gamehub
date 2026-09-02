import { describe, expect, it } from 'vitest';

import {
  buildAuditRows,
  buildDecisionRows,
} from '@/scripts/audit-game-quality';

describe('game quality audit', () => {
  it('uses full editorial coverage before flagging a core page as thin', () => {
    const rows = buildAuditRows();
    const row = rows.find((item) => item.game.slug === 'g-switch-2');

    expect(row).toBeDefined();
    expect(row?.editorialCoverage.status).toBe('complete');
    expect(row?.reasons.join('; ')).not.toContain('thin description');
  });

  it('does not let editorial completeness override unverified embed rights', () => {
    const decisions = buildDecisionRows(buildAuditRows());
    const bySlug = new Map(decisions.map((row) => [row.slug, row]));

    expect(bySlug.get('g-switch-2')?.decision).toBe('review');
    expect(bySlug.get('g-switch-2')?.reason.toLowerCase()).toContain('permission');
    expect(bySlug.get('adam-and-eve-8')?.decision).toBe('review');
    expect(bySlug.get('duo-survival')?.decision).toBe('review');
    expect(decisions.every((row) => row.slug && row.decision && row.reason)).toBe(true);
  });

  it('uses real checked-in screenshots without treating them as rights clearance', () => {
    const placeholderRows = buildAuditRows().filter(
      (row) => row.game.thumbnailUrl.startsWith('/game-screenshots/') &&
        row.reasons.includes('placeholder thumbnail'),
    );

    expect(placeholderRows.map((row) => row.game.slug)).toEqual([]);
  });
});
