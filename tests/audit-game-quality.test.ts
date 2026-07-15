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

  it('generates a per-slug decision table for keep, improve, review, and remove work', () => {
    const decisions = buildDecisionRows(buildAuditRows());
    const bySlug = new Map(decisions.map((row) => [row.slug, row]));

    expect(bySlug.get('g-switch-2')?.decision).toBe('keep');
    expect(bySlug.get('adam-and-eve-8')?.decision).toBe('review');
    expect(bySlug.get('duo-survival')?.decision).toBe('merge');
    expect(bySlug.get('fly-car-stunt')?.nextStep).toContain('redirect direct detail requests');
    expect(decisions.every((row) => row.slug && row.decision && row.reason)).toBe(true);
  });
});
