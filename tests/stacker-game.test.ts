import { describe, expect, it } from 'vitest';

import {
  createSeededStackerSetup,
  dropTowerBlock,
  getBlockSpeed,
  getSprintSecondsRemaining,
  PERFECT_DROP_TOLERANCE,
  type TowerBlock,
} from '@/lib/games/stacker-game';

const base: TowerBlock = { x: 0, z: 0, width: 120, depth: 120 };

describe('stacker game deterministic geometry', () => {
  it('snaps a near-perfect drop and reports combo-safe geometry', () => {
    const result = dropTowerBlock(
      base,
      { ...base, x: PERFECT_DROP_TOLERANCE - 0.1 },
      'x',
      PERFECT_DROP_TOLERANCE,
    );
    expect(result).toEqual({ status: 'perfect', block: base, trimmed: 0 });
    expect(
      dropTowerBlock(
        base,
        { ...base, x: PERFECT_DROP_TOLERANCE + 0.1 },
        'x',
        PERFECT_DROP_TOLERANCE,
      ).status,
    ).toBe('placed');
  });

  it('keeps only overlap on the active axis and rejects a total miss', () => {
    const overlap = dropTowerBlock(base, { ...base, x: 30 }, 'x', 3);
    expect(overlap.status).toBe('placed');
    expect(overlap.block).toMatchObject({ x: 15, width: 90, depth: 120 });
    expect(overlap.trimmed).toBe(30);

    expect(dropTowerBlock(base, { ...base, z: 120 }, 'z', 3).status).toBe('missed');
  });

  it('uses a bounded speed curve and a strict sixty-second sprint clock', () => {
    expect(getBlockSpeed(0)).toBe(1);
    expect(getBlockSpeed(30)).toBeLessThanOrEqual(2.8);
    expect(getSprintSecondsRemaining(0)).toBe(60);
    expect(getSprintSecondsRemaining(59_001)).toBe(1);
    expect(getSprintSecondsRemaining(60_000)).toBe(0);
  });

  it('creates a replayable seeded smoke setup with a guaranteed first perfect drop', () => {
    expect(createSeededStackerSetup(42)).toEqual(createSeededStackerSetup(42));
    expect(createSeededStackerSetup(42)).not.toEqual(createSeededStackerSetup(43));
    expect(createSeededStackerSetup(42).moving).toMatchObject({ x: 0, z: 0 });
  });
});
