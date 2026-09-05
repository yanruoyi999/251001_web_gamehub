export type TowerAxis = 'x' | 'z';

export const PERFECT_DROP_TOLERANCE = 3;
export const STACKER_SPEED_CAP = 2.8;

export interface TowerBlock {
  x: number;
  z: number;
  width: number;
  depth: number;
}

export type DropResult =
  | { status: 'missed'; block: null; trimmed: number }
  | { status: 'perfect' | 'placed'; block: TowerBlock; trimmed: number };

export function createSeededStackerSetup(seed: number) {
  const normalized = Math.abs(Math.trunc(seed)) || 1;
  const axis: TowerAxis = normalized % 2 === 0 ? 'x' : 'z';
  const direction = normalized % 4 < 2 ? 1 : -1;
  const hue = (Math.imul(normalized, 53) >>> 0) % 360;
  const base: TowerBlock = { x: 0, z: 0, width: 150, depth: 150 };

  return {
    axis,
    direction,
    hue,
    base,
    moving: { ...base },
  };
}

export function dropTowerBlock(
  previous: TowerBlock,
  moving: TowerBlock,
  axis: TowerAxis,
  perfectTolerance: number,
): DropResult {
  const sizeKey = axis === 'x' ? 'width' : 'depth';
  const valid = (block: TowerBlock) => Object.values(block).every(Number.isFinite) && block.width > 0 && block.depth > 0;
  if (!valid(previous) || !valid(moving)) return { status: 'missed', block: null, trimmed: Math.max(0, moving[sizeKey] || 0) };
  const inactive = axis === 'x' ? 'z' : 'x';
  if (
    Math.abs(moving[axis] - previous[axis]) <= Math.max(0, perfectTolerance) &&
    moving[inactive] === previous[inactive] &&
    moving.width === previous.width && moving.depth === previous.depth
  ) {
    return { status: 'perfect', block: { ...previous }, trimmed: 0 };
  }

  const left = Math.max(previous.x - previous.width / 2, moving.x - moving.width / 2);
  const right = Math.min(previous.x + previous.width / 2, moving.x + moving.width / 2);
  const back = Math.max(previous.z - previous.depth / 2, moving.z - moving.depth / 2);
  const front = Math.min(previous.z + previous.depth / 2, moving.z + moving.depth / 2);
  if (right <= left || front <= back) return { status: 'missed', block: null, trimmed: moving[sizeKey] };
  const block: TowerBlock = { x: (left + right) / 2, z: (back + front) / 2, width: right - left, depth: front - back };
  return { status: 'placed', block, trimmed: Math.max(0, moving[sizeKey] - block[sizeKey]) };
}

/** Project the exact collision rectangle, not an unrelated fixed-thickness sprite. */
export function projectTowerBlock(
  block: TowerBlock,
  level: number,
  surface: { width: number; height: number },
  cameraLevel = 0,
): Array<{ x: number; y: number }> {
  return [
    [block.x - block.width / 2, block.z - block.depth / 2],
    [block.x + block.width / 2, block.z - block.depth / 2],
    [block.x + block.width / 2, block.z + block.depth / 2],
    [block.x - block.width / 2, block.z + block.depth / 2],
  ].map(([x, z]) => ({
    x: surface.width / 2 + (x - z) * 0.7,
    y: surface.height - 65 + (x + z) * 0.22 - (level - cameraLevel) * 25,
  }));
}

export interface StackerClock { elapsedMs: number; lastFrameMs: number | null }

/** Only physics is capped. The competition clock uses all visible elapsed time. */
export function advanceStackerClock(clock: StackerClock, now: number) {
  const delta = clock.lastFrameMs === null ? 0 : Math.max(0, now - clock.lastFrameMs);
  return { elapsedMs: clock.elapsedMs + delta, lastFrameMs: now, physicsDeltaMs: Math.min(40, delta) };
}

export function getBlockSpeed(height: number) {
  return Math.min(
    STACKER_SPEED_CAP,
    Number((1 + Math.max(0, height) * 0.055).toFixed(2)),
  );
}

export function getSprintSecondsRemaining(elapsedMs: number) {
  return Math.max(0, Math.ceil((60_000 - Math.max(0, elapsedMs)) / 1_000));
}
