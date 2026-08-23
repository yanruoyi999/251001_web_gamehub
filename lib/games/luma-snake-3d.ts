export type SnakePoint = {
  x: number;
  z: number;
};

export type SnakeDirection = SnakePoint;

export type SnakeGameStatus = 'playing' | 'dead';

export type SnakeGameState = {
  challengeKey: string;
  challengeId: string;
  seed: number;
  gridSize: number;
  snake: SnakePoint[];
  direction: SnakeDirection;
  food: SnakePoint;
  score: number;
  tick: number;
  status: SnakeGameStatus;
};

export type FirstDeathDurationBucket =
  | 'under-30s'
  | '30s-to-45s'
  | '45s-to-3m'
  | '3m-to-5m'
  | 'over-5m'
  | 'invalid';

const DEFAULT_GRID_SIZE = 14;
const INITIAL_SNAKE_LENGTH = 3;
const DEFAULT_STEP_MS = 175;
const MIN_STEP_MS = 80;
const DEFAULT_SWIPE_DISTANCE = 32;

function hashString(value: string) {
  let hash = 2_166_136_261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16_777_619);
  }

  return hash >>> 0;
}

function seededRandom(seed: number) {
  let value = seed >>> 0;

  return () => {
    value = (Math.imul(value, 1_664_525) + 1_013_904_223) >>> 0;
    return value / 4_294_967_296;
  };
}

function samePoint(first: SnakePoint, second: SnakePoint) {
  return first.x === second.x && first.z === second.z;
}

function sameDirection(first: SnakeDirection, second: SnakeDirection) {
  return first.x === second.x && first.z === second.z;
}

function isInsideGrid(point: SnakePoint, gridSize: number) {
  return (
    point.x >= 0 &&
    point.x < gridSize &&
    point.z >= 0 &&
    point.z < gridSize
  );
}

function findFreeFood(
  seed: number,
  tick: number,
  gridSize: number,
  snake: SnakePoint[]
) {
  const random = seededRandom(seed + tick * 7_919);
  const cells = gridSize * gridSize;
  const start = Math.floor(random() * cells);

  for (let offset = 0; offset < cells; offset += 1) {
    const candidateIndex = (start + offset) % cells;
    const candidate = {
      x: candidateIndex % gridSize,
      z: Math.floor(candidateIndex / gridSize),
    };

    if (!snake.some((segment) => samePoint(segment, candidate))) {
      return candidate;
    }
  }

  return { x: 0, z: 0 };
}

export function getUtcChallengeKey(date = new Date()) {
  if (Number.isNaN(date.getTime())) {
    throw new Error('A valid date is required for the daily challenge key.');
  }

  return date.toISOString().slice(0, 10);
}

export function getDailyChallengeId(challengeKey: string) {
  return `snake-3d-${challengeKey}-${hashString(challengeKey).toString(16)}`;
}

export function getSnakeStepMs(score: number) {
  const normalizedScore = Number.isFinite(score) ? Math.max(0, Math.floor(score)) : 0;

  if (normalizedScore >= 30) return Math.max(MIN_STEP_MS, 85);
  if (normalizedScore >= 20) return 100;
  if (normalizedScore >= 15) return 115;
  if (normalizedScore >= 10) return 135;
  if (normalizedScore >= 5) return 155;
  return DEFAULT_STEP_MS;
}

export function getSwipeDirection(
  start: { x: number; y: number },
  end: { x: number; y: number },
  minDistance = DEFAULT_SWIPE_DISTANCE
): SnakeDirection | null {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const threshold = Number.isFinite(minDistance)
    ? Math.max(0, minDistance)
    : DEFAULT_SWIPE_DISTANCE;

  if (![dx, dy].every(Number.isFinite) || Math.hypot(dx, dy) < threshold) {
    return null;
  }

  if (Math.abs(dx) >= Math.abs(dy)) {
    return { x: dx > 0 ? 1 : -1, z: 0 };
  }

  return { x: 0, z: dy > 0 ? 1 : -1 };
}

export function createSnakeGameState(options: {
  challengeKey?: string;
  gridSize?: number;
} = {}): SnakeGameState {
  const challengeKey = options.challengeKey ?? getUtcChallengeKey();
  const gridSize = Math.max(8, Math.floor(options.gridSize ?? DEFAULT_GRID_SIZE));
  const seed = hashString(challengeKey);
  const center = Math.floor(gridSize / 2);
  const snake = Array.from({ length: INITIAL_SNAKE_LENGTH }, (_, index) => ({
    x: center - index,
    z: center,
  }));

  return {
    challengeKey,
    challengeId: getDailyChallengeId(challengeKey),
    seed,
    gridSize,
    snake,
    direction: { x: 1, z: 0 },
    food: findFreeFood(seed, 0, gridSize, snake),
    score: 0,
    tick: 0,
    status: 'playing',
  };
}

export function changeSnakeDirection(
  current: SnakeDirection,
  next: SnakeDirection
) {
  const isCardinal =
    Math.abs(next.x) + Math.abs(next.z) === 1 &&
    Math.abs(current.x) + Math.abs(current.z) === 1;

  if (!isCardinal) return current;

  const isImmediateReverse = current.x + next.x === 0 && current.z + next.z === 0;
  return isImmediateReverse ? current : next;
}

export function queueSnakeDirection(
  current: SnakeDirection,
  queued: SnakeDirection | null,
  next: SnakeDirection
): SnakeDirection | null {
  if (queued) return queued;

  const candidate = changeSnakeDirection(current, next);
  return sameDirection(candidate, current) ? null : candidate;
}

export function stepSnakeGame(state: SnakeGameState): SnakeGameState {
  if (state.status === 'dead') return state;

  const nextHead = {
    x: state.snake[0].x + state.direction.x,
    z: state.snake[0].z + state.direction.z,
  };
  const eatsFood = samePoint(nextHead, state.food);
  const bodyToCheck = eatsFood ? state.snake : state.snake.slice(0, -1);
  const hitWall = !isInsideGrid(nextHead, state.gridSize);
  const hitBody = bodyToCheck.some((segment) => samePoint(segment, nextHead));

  if (hitWall || hitBody) {
    return { ...state, status: 'dead', tick: state.tick + 1 };
  }

  const nextSnake = [nextHead, ...state.snake];
  if (!eatsFood) nextSnake.pop();

  return {
    ...state,
    snake: nextSnake,
    food: eatsFood
      ? findFreeFood(state.seed, state.tick + 1, state.gridSize, nextSnake)
      : state.food,
    score: state.score + (eatsFood ? 1 : 0),
    tick: state.tick + 1,
  };
}

export function resetSnakeGameState(state: SnakeGameState) {
  return createSnakeGameState({
    challengeKey: state.challengeKey,
    gridSize: state.gridSize,
  });
}

export function getFirstDeathDurationMs(
  startedAtMs: number,
  firstDeathAtMs: number
) {
  if (
    !Number.isFinite(startedAtMs) ||
    !Number.isFinite(firstDeathAtMs) ||
    firstDeathAtMs < startedAtMs
  ) {
    return null;
  }

  return firstDeathAtMs - startedAtMs;
}

export function getFirstDeathDurationBucket(
  durationMs: number | null
): FirstDeathDurationBucket {
  if (durationMs === null || !Number.isFinite(durationMs) || durationMs < 0) {
    return 'invalid';
  }
  if (durationMs < 30_000) return 'under-30s';
  if (durationMs < 45_000) return '30s-to-45s';
  if (durationMs <= 180_000) return '45s-to-3m';
  if (durationMs <= 300_000) return '3m-to-5m';
  return 'over-5m';
}
