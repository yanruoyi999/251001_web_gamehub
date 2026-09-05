import { describe, expect, it } from 'vitest';
import * as engine from '@/lib/games/stacker-game';

const base = { x: 0, z: 0, width: 150, depth: 150 };
const surface = { width: 640, height: 420 };

describe('stacker audit geometry and monotonic time', () => {
  it.each(['x', 'z'] as const)('uses the actual rectangle intersection on %s, including unequal blocks', (axis) => {
    const size = axis === 'x' ? 'width' : 'depth';
    const result = engine.dropTowerBlock(base, { ...base, [size]: 80, [axis]: 60 }, axis, 3);
    expect(result).toMatchObject({ status: 'placed', block: { [axis]: 47.5, [size]: 55 }, trimmed: 25 });
    expect(engine.dropTowerBlock(base, { ...base, [axis]: 160 }, axis, 3).status).toBe('missed');
    expect(engine.dropTowerBlock(base, { ...base, [size]: 80 }, axis, 3).block?.[size]).toBe(80);
  });

  it('projects all four top corners and makes both dimensions visible', () => {
    const full = engine.projectTowerBlock(base, 0, surface, 0);
    const narrow = engine.projectTowerBlock({ ...base, depth: 50 }, 0, surface, 0);
    expect(full).toHaveLength(4);
    expect(narrow).not.toEqual(full);
    const shifted = engine.projectTowerBlock({ ...base, z: 160 }, 0, surface, 0);
    // Inverse projection recovers every model corner: no invisible Z dimension.
    shifted.forEach((point, index) => {
      const dx = (point.x - full[index].x) / 0.7;
      const dy = (point.y - full[index].y) / 0.22;
      expect((dy - dx) / 2).toBeCloseTo(160);
      expect((dy + dx) / 2).toBeCloseTo(0);
    });
  });

  it('puts the newest layer above its support and scrolls without reversing layers', () => {
    for (const height of [1, 2, 11, 30]) {
      const camera = Math.max(0, height - 8);
      const lower = engine.projectTowerBlock(base, height - 1, surface, camera);
      const upper = engine.projectTowerBlock(base, height, surface, camera);
      expect(upper[0].y).toBe(lower[0].y - 25);
    }
  });

  it.each([15, 30, 60, 120])('counts a real sixty seconds at %s FPS without enlarging physics steps', (fps) => {
    let clock = { elapsedMs: 0, lastFrameMs: 0 as number | null };
    for (let frame = 1; frame <= fps * 60; frame += 1) {
      const next = engine.advanceStackerClock(clock, frame * 1000 / fps);
      expect(next.physicsDeltaMs).toBeLessThanOrEqual(40);
      clock = next;
    }
    expect(clock.elapsedMs).toBeCloseTo(60_000);
    expect(engine.getSprintSecondsRemaining(clock.elapsedMs)).toBe(0);
  });

  it('excludes an explicit pause and resets a restarted run', () => {
    const beforePause = engine.advanceStackerClock({ elapsedMs: 0, lastFrameMs: 0 }, 10_000);
    const resumed = engine.advanceStackerClock({ ...beforePause, lastFrameMs: null }, 50_000);
    expect(resumed.elapsedMs).toBe(10_000);
    expect(resumed.physicsDeltaMs).toBe(0);
    const next = engine.advanceStackerClock(resumed, 51_000);
    expect(next.elapsedMs).toBe(11_000);
    expect(engine.advanceStackerClock({ elapsedMs: 0, lastFrameMs: 51_000 }, 52_000).elapsedMs).toBe(1000);
  });
});
