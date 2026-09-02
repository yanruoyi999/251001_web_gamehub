export type ChineseCheckersPlayer = 'red' | 'blue';
export type ChineseCheckersDifficulty = 'easy' | 'medium' | 'hard';

export interface ChineseCheckersPosition {
  q: number;
  r: number;
}

export interface ChineseCheckersBoard {
  holes: ChineseCheckersPosition[];
  pieces: Map<string, ChineseCheckersPlayer>;
}

export interface ChineseCheckersMove {
  from: ChineseCheckersPosition;
  to: ChineseCheckersPosition;
}

export interface ChineseCheckersMovePath {
  to: ChineseCheckersPosition;
  path: ChineseCheckersPosition[];
  type: 'step' | 'jump';
}

const DIRECTIONS: readonly ChineseCheckersPosition[] = [
  { q: 1, r: 0 },
  { q: -1, r: 0 },
  { q: 0, r: 1 },
  { q: 0, r: -1 },
  { q: 1, r: -1 },
  { q: -1, r: 1 },
];

export function keyForHole(position: ChineseCheckersPosition) {
  return `${position.q},${position.r}`;
}

function add(a: ChineseCheckersPosition, b: ChineseCheckersPosition, multiplier = 1) {
  return { q: a.q + b.q * multiplier, r: a.r + b.r * multiplier };
}

function rowBounds(r: number): [number, number] {
  if (r <= -5) return [-r - 4, 4];
  if (r >= 5) return [-4, 4 - r];
  if (r <= 0) return [-4, 4 - r];
  return [-4 - r, 4];
}

function createHoles() {
  const holes: ChineseCheckersPosition[] = [];
  for (let r = -8; r <= 8; r += 1) {
    const [minimumQ, maximumQ] = rowBounds(r);
    for (let q = minimumQ; q <= maximumQ; q += 1) holes.push({ q, r });
  }
  return holes;
}

const STANDARD_HOLES = createHoles();

export function createChineseCheckersBoard(options?: {
  empty?: boolean;
  pieces?: Array<[ChineseCheckersPosition, ChineseCheckersPlayer]>;
}): ChineseCheckersBoard {
  const pieces = new Map<string, ChineseCheckersPlayer>();
  if (!options?.empty) {
    for (const hole of STANDARD_HOLES) {
      if (hole.r <= -5) pieces.set(keyForHole(hole), 'red');
      if (hole.r >= 5) pieces.set(keyForHole(hole), 'blue');
    }
  }
  for (const [position, player] of options?.pieces ?? []) {
    pieces.set(keyForHole(position), player);
  }
  return { holes: STANDARD_HOLES.map((hole) => ({ ...hole })), pieces };
}

export function getReachableChineseCheckersMovePaths(
  board: ChineseCheckersBoard,
  from: ChineseCheckersPosition,
): ChineseCheckersMovePath[] {
  const holeKeys = new Set(board.holes.map(keyForHole));
  const fromKey = keyForHole(from);
  if (!holeKeys.has(fromKey) || !board.pieces.has(fromKey)) return [];

  const results = new Map<string, ChineseCheckersMovePath>();
  for (const direction of DIRECTIONS) {
    const destination = add(from, direction);
    const destinationKey = keyForHole(destination);
    if (holeKeys.has(destinationKey) && !board.pieces.has(destinationKey)) {
      results.set(destinationKey, {
        to: destination,
        path: [destination],
        type: 'step',
      });
    }
  }

  const occupiedAfterLift = new Set(board.pieces.keys());
  occupiedAfterLift.delete(fromKey);
  const queue: Array<{
    position: ChineseCheckersPosition;
    path: ChineseCheckersPosition[];
  }> = [{ position: from, path: [] }];
  const visited = new Set([fromKey]);
  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const direction of DIRECTIONS) {
      const jumped = add(current.position, direction);
      const landing = add(current.position, direction, 2);
      const landingKey = keyForHole(landing);
      if (
        occupiedAfterLift.has(keyForHole(jumped)) &&
        holeKeys.has(landingKey) &&
        !occupiedAfterLift.has(landingKey) &&
        !visited.has(landingKey)
      ) {
        visited.add(landingKey);
        const path = [...current.path, landing];
        results.set(landingKey, { to: landing, path, type: 'jump' });
        queue.push({ position: landing, path });
      }
    }
  }

  return [...results.values()];
}

export function getReachableChineseCheckersMoves(
  board: ChineseCheckersBoard,
  from: ChineseCheckersPosition,
) {
  return getReachableChineseCheckersMovePaths(board, from).map((move) => move.to);
}

export function applyChineseCheckersMove(
  board: ChineseCheckersBoard,
  move: ChineseCheckersMove,
): ChineseCheckersBoard | null {
  const player = board.pieces.get(keyForHole(move.from));
  if (!player) return null;
  const legal = getReachableChineseCheckersMoves(board, move.from).some(
    (position) => keyForHole(position) === keyForHole(move.to),
  );
  if (!legal) return null;
  const pieces = new Map(board.pieces);
  pieces.delete(keyForHole(move.from));
  pieces.set(keyForHole(move.to), player);
  return { holes: board.holes, pieces };
}

function progressFor(player: ChineseCheckersPlayer, move: ChineseCheckersMove) {
  return player === 'blue' ? move.from.r - move.to.r : move.to.r - move.from.r;
}

export function getChineseCheckersMoves(
  board: ChineseCheckersBoard,
  player: ChineseCheckersPlayer,
) {
  const holesByKey = new Map(board.holes.map((hole) => [keyForHole(hole), hole]));
  const moves: ChineseCheckersMove[] = [];
  board.pieces.forEach((owner, key) => {
    if (owner !== player) return;
    const from = holesByKey.get(key);
    if (!from) return;
    for (const to of getReachableChineseCheckersMoves(board, from)) moves.push({ from, to });
  });
  return moves;
}

function seededIndex(seed: number, length: number) {
  const value = Math.imul(Math.abs(Math.trunc(seed)) + 1, 1_664_525) + 1_013_904_223;
  return (value >>> 0) % Math.max(1, length);
}

export function chooseChineseCheckersMove(
  board: ChineseCheckersBoard,
  player: ChineseCheckersPlayer,
  difficulty: ChineseCheckersDifficulty,
  seed = 1,
): ChineseCheckersMove | null {
  const moves = getChineseCheckersMoves(board, player);
  if (moves.length === 0) return null;
  if (difficulty === 'easy') return moves[seededIndex(seed, moves.length)];

  const ranked = moves
    .map((move) => ({
      move,
      score:
        progressFor(player, move) * 20 +
        Math.abs(move.to.r - move.from.r) * (difficulty === 'hard' ? 3 : 1) +
        (Math.abs(move.to.q - move.from.q) > 1 ? 4 : 0),
    }))
    .sort((a, b) => b.score - a.score || keyForHole(a.move.to).localeCompare(keyForHole(b.move.to)));

  if (difficulty === 'hard') return ranked[0].move;
  return ranked[seededIndex(seed, Math.max(1, Math.ceil(ranked.length / 3)))].move;
}

export function hasChineseCheckersWinner(board: ChineseCheckersBoard, player: ChineseCheckersPlayer) {
  const target = board.holes.filter((hole) => (player === 'red' ? hole.r >= 5 : hole.r <= -5));
  return target.every((hole) => board.pieces.get(keyForHole(hole)) === player);
}
