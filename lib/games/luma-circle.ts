export type CirclePoint = { x: number; y: number };

export type CircleDurationBucket =
  | 'under-15s'
  | '15s-to-60s'
  | '1m-to-3m'
  | 'over-3m'
  | 'invalid';

export type CircleChallenge = {
  dateKey: string;
  center: CirclePoint;
  radius: number;
};

export type CircleScore = {
  score: number;
  roundness: number;
  closure: number;
  smoothness: number;
  coverage: number;
  pointCount: number;
};

const TWO_PI = Math.PI * 2;

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function hashDate(dateKey: string) {
  let hash = 2166136261;
  for (const character of dateKey) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}

export function getUtcDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function getCircleChallenge(dateKey = getUtcDateKey()): CircleChallenge {
  const hash = hashDate(dateKey);
  return {
    dateKey,
    center: { x: 0.5, y: 0.5 },
    radius: 0.28 + (hash % 9) / 100,
  };
}

function average(values: number[]) {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function standardDeviation(values: number[], mean: number) {
  return Math.sqrt(average(values.map(value => (value - mean) ** 2)));
}

function unwrapAngleDelta(delta: number) {
  let value = delta;
  while (value > Math.PI) value -= TWO_PI;
  while (value < -Math.PI) value += TWO_PI;
  return value;
}

export function scoreCircle(points: CirclePoint[]): CircleScore {
  if (points.length < 3) {
    return {
      score: 0,
      roundness: 0,
      closure: 0,
      smoothness: 0,
      coverage: 0,
      pointCount: points.length,
    };
  }

  const center = {
    x: average(points.map(point => point.x)),
    y: average(points.map(point => point.y)),
  };
  const radii = points.map(point =>
    Math.hypot(point.x - center.x, point.y - center.y),
  );
  const meanRadius = average(radii);
  const radiusDeviation = standardDeviation(radii, meanRadius);
  const roundness = clamp(
    meanRadius > 0 ? 100 - (radiusDeviation / meanRadius) * 400 : 0,
  );

  const closingGap = Math.hypot(
    points[0].x - points[points.length - 1].x,
    points[0].y - points[points.length - 1].y,
  );
  const closure = clamp(
    meanRadius > 0 ? 100 - (closingGap / meanRadius) * 250 : 0,
  );

  const segmentLengths = points.slice(1).map((point, index) =>
    Math.hypot(point.x - points[index].x, point.y - points[index].y),
  );
  const meanSegmentLength = average(segmentLengths);
  const smoothness = clamp(
    meanSegmentLength > 0
      ? 100 -
          (standardDeviation(segmentLengths, meanSegmentLength) /
            meanSegmentLength) *
            250
      : 0,
  );

  const angles = points.map(point =>
    Math.atan2(point.y - center.y, point.x - center.x),
  );
  const angularTravel = angles.slice(1).reduce((total, angle, index) => {
    return total + Math.abs(unwrapAngleDelta(angle - angles[index]));
  }, 0);
  const coverage = clamp((angularTravel / TWO_PI) * 100);

  return {
    score: Math.round(
      roundness * 0.5 + closure * 0.25 + smoothness * 0.15 + coverage * 0.1,
    ),
    roundness: Math.round(roundness),
    closure: Math.round(closure),
    smoothness: Math.round(smoothness),
    coverage: Math.round(coverage),
    pointCount: points.length,
  };
}

export function getCircleDurationBucket(
  durationMs: number | null | undefined,
): CircleDurationBucket {
  if (durationMs == null || !Number.isFinite(durationMs) || durationMs < 0) {
    return 'invalid';
  }
  if (durationMs < 15_000) return 'under-15s';
  if (durationMs < 60_000) return '15s-to-60s';
  if (durationMs <= 180_000) return '1m-to-3m';
  return 'over-3m';
}
