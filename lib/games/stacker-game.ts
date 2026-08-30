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
  const centerKey = axis === 'x' ? 'x' : 'z';
  const sizeKey = axis === 'x' ? 'width' : 'depth';
  const offset = moving[centerKey] - previous[centerKey];
  const absoluteOffset = Math.abs(offset);

  if (absoluteOffset <= Math.max(0, perfectTolerance)) {
    return { status: 'perfect', block: { ...previous }, trimmed: 0 };
  }

  const overlap = Math.min(previous[sizeKey], moving[sizeKey]) - absoluteOffset;
  if (overlap <= 0) return { status: 'missed', block: null, trimmed: moving[sizeKey] };

  const block: TowerBlock = {
    ...moving,
    [sizeKey]: overlap,
    [centerKey]: previous[centerKey] + offset / 2,
  };
  return {
    status: 'placed',
    block,
    trimmed: Math.max(0, moving[sizeKey] - overlap),
  };
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
