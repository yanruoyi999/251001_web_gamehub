export type DrawingPoint = { x: number; y: number };
export type DrawingShape = 'circle' | 'square' | 'triangle' | 'spiral';

export interface CircleScore {
  total: number;
  roundness: number;
  closure: number;
  centering: number;
}

export interface DrawingScore {
  valid: boolean;
  total: number;
  shapeMatch: number;
  pathScore: number;
  centering: number;
  pathComponent: 'closure' | 'endpointFit';
}

const DAILY_SHAPES: readonly DrawingShape[] = ['circle', 'square', 'triangle', 'spiral'];

function clampScore(value: number) {
  return Math.round(Math.max(0, Math.min(100, value)));
}

function distance(a: DrawingPoint, b: DrawingPoint) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function centroid(points: readonly DrawingPoint[]) {
  return points.reduce(
    (sum, point) => ({
      x: sum.x + point.x / points.length,
      y: sum.y + point.y / points.length,
    }),
    { x: 0, y: 0 },
  );
}

function samplePolyline(
  vertices: readonly DrawingPoint[],
  samples: number,
  closed: boolean,
) {
  const segments = closed ? vertices.length : vertices.length - 1;
  return Array.from({ length: samples + 1 }, (_, index) => {
    const progress = (index / samples) * segments;
    const segment = Math.min(segments - 1, Math.floor(progress));
    const amount = index === samples ? 1 : progress - segment;
    const from = vertices[segment];
    const to = vertices[(segment + 1) % vertices.length];
    return {
      x: from.x + (to.x - from.x) * amount,
      y: from.y + (to.y - from.y) * amount,
    };
  });
}

export function createCircleFixture({
  centerX,
  centerY,
  radius,
  samples,
}: {
  centerX: number;
  centerY: number;
  radius: number;
  samples: number;
}): DrawingPoint[] {
  const safeSamples = Math.max(8, Math.round(samples));
  return Array.from({ length: safeSamples + 1 }, (_, index) => {
    const angle = (Math.PI * 2 * index) / safeSamples;
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    };
  });
}

export function createShapeFixture(
  shape: DrawingShape,
  surface: { width: number; height: number },
  samples = 128,
): DrawingPoint[] {
  const safeSamples = Math.max(8, Math.round(samples));
  const centerX = surface.width / 2;
  const centerY = surface.height / 2;
  const radius = Math.min(surface.width, surface.height) * 0.29;

  if (shape === 'circle') {
    return createCircleFixture({ centerX, centerY, radius, samples: safeSamples });
  }
  if (shape === 'square') {
    return samplePolyline(
      [
        { x: centerX - radius, y: centerY - radius },
        { x: centerX + radius, y: centerY - radius },
        { x: centerX + radius, y: centerY + radius },
        { x: centerX - radius, y: centerY + radius },
      ],
      safeSamples,
      true,
    );
  }
  if (shape === 'triangle') {
    return samplePolyline(
      [
        { x: centerX, y: centerY - radius },
        { x: centerX + radius, y: centerY + radius },
        { x: centerX - radius, y: centerY + radius },
      ],
      safeSamples,
      true,
    );
  }

  return Array.from({ length: safeSamples + 1 }, (_, index) => {
    const progress = index / safeSamples;
    const angle = progress * 14.4;
    const spiralRadius = radius * progress;
    return {
      x: centerX + Math.cos(angle) * spiralRadius,
      y: centerY + Math.sin(angle) * spiralRadius,
    };
  });
}

export function scoreCircleStroke(
  points: readonly DrawingPoint[],
  surface: { width: number; height: number },
): CircleScore {
  if (points.length < 8 || surface.width <= 0 || surface.height <= 0) {
    return { total: 0, roundness: 0, closure: 0, centering: 0 };
  }

  const sampledPoints = distance(points[0], points[points.length - 1]) < 1 ? points.slice(0, -1) : points;
  const centroid = sampledPoints.reduce(
    (sum, point) => ({
      x: sum.x + point.x / sampledPoints.length,
      y: sum.y + point.y / sampledPoints.length,
    }),
    { x: 0, y: 0 },
  );
  const radii = sampledPoints.map((point) => distance(point, centroid));
  const meanRadius = radii.reduce((sum, radius) => sum + radius, 0) / radii.length;
  if (meanRadius < 8) return { total: 0, roundness: 0, closure: 0, centering: 0 };

  const variance =
    radii.reduce((sum, radius) => sum + (radius - meanRadius) ** 2, 0) / radii.length;
  const radialDeviation = Math.sqrt(variance) / meanRadius;
  const roundness = clampScore(100 - radialDeviation * 240);
  const closure = clampScore(100 - (distance(points[0], points[points.length - 1]) / meanRadius) * 105);
  const targetCenter = { x: surface.width / 2, y: surface.height / 2 };
  const centerBudget = Math.max(1, Math.min(surface.width, surface.height) * 0.42);
  const centering = clampScore(100 - (distance(centroid, targetCenter) / centerBudget) * 100);
  const total = clampScore(roundness * 0.5 + closure * 0.3 + centering * 0.2);

  return { total, roundness, closure, centering };
}

function averageNearestDistance(
  points: readonly DrawingPoint[],
  targets: readonly DrawingPoint[],
) {
  return (
    points.reduce(
      (sum, point) =>
        sum + Math.min(...targets.map((target) => distance(point, target))),
      0,
    ) / points.length
  );
}

function invalidDrawingScore(shape: DrawingShape): DrawingScore {
  return {
    valid: false,
    total: 0,
    shapeMatch: 0,
    pathScore: 0,
    centering: 0,
    pathComponent: shape === 'spiral' ? 'endpointFit' : 'closure',
  };
}

export function scoreDrawingStroke(
  points: readonly DrawingPoint[],
  surface: { width: number; height: number },
  shape: DrawingShape,
): DrawingScore {
  if (
    points.length < 8 ||
    surface.width <= 0 ||
    surface.height <= 0 ||
    points.some((point) => !Number.isFinite(point.x) || !Number.isFinite(point.y))
  ) {
    return invalidDrawingScore(shape);
  }

  const target = createShapeFixture(shape, surface, 128);
  const pointCenter = centroid(points);
  const targetCenter = centroid(target);
  const centeredPoints = points.map((point) => ({
    x: point.x - pointCenter.x,
    y: point.y - pointCenter.y,
  }));
  const centeredTarget = target.map((point) => ({
    x: point.x - targetCenter.x,
    y: point.y - targetCenter.y,
  }));
  const radius = Math.max(1, Math.min(surface.width, surface.height) * 0.29);
  const pathComponent = shape === 'spiral' ? 'endpointFit' : 'closure';

  let shapeMatch: number;
  if (shape === 'circle') {
    shapeMatch = scoreCircleStroke(points, surface).roundness;
  } else {
    const chamfer =
      (averageNearestDistance(centeredPoints, centeredTarget) +
        averageNearestDistance(centeredTarget, centeredPoints)) /
      2;
    shapeMatch = clampScore(100 - (chamfer / (radius * 0.42)) * 100);
  }

  let pathScore: number;
  if (shape === 'spiral') {
    const direct =
      distance(points[0], target[0]) +
      distance(points[points.length - 1], target[target.length - 1]);
    const reversed =
      distance(points[0], target[target.length - 1]) +
      distance(points[points.length - 1], target[0]);
    pathScore = clampScore(100 - (Math.min(direct, reversed) / 2 / radius) * 100);
  } else {
    pathScore = clampScore(
      100 - (distance(points[0], points[points.length - 1]) / radius) * 105,
    );
  }

  const centerBudget = Math.max(1, Math.min(surface.width, surface.height) * 0.42);
  const centering = clampScore(
    100 - (distance(pointCenter, targetCenter) / centerBudget) * 100,
  );
  const total = clampScore(shapeMatch * 0.55 + pathScore * 0.25 + centering * 0.2);

  return { valid: true, total, shapeMatch, pathScore, centering, pathComponent };
}

export function buildDrawShareResult({
  shape,
  scoreBucket,
  challengeId,
  pageUrl,
}: {
  shape: DrawingShape;
  scoreBucket: string;
  challengeId?: string;
  pageUrl: string;
}) {
  const challenge = challengeId ? ` · challenge ${challengeId}` : '';
  return `Luma ${shape} · score ${scoreBucket}${challenge} · ${pageUrl}`;
}

export function getDailyShape(dateKey: string): DrawingShape {
  let hash = 17;
  for (const character of dateKey) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return DAILY_SHAPES[hash % DAILY_SHAPES.length];
}

function parseUtcDate(dateKey: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
  if (!match) return null;
  const value = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return Number.isNaN(value.getTime()) ? null : value;
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function calculateDailyStreak(completions: readonly string[], completedDate: string) {
  const completed = parseUtcDate(completedDate);
  if (!completed) return 0;
  const days = new Set([...completions, completedDate]);
  let streak = 0;
  const cursor = new Date(completed);
  while (days.has(dateKey(cursor))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}
