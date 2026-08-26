export interface MahjongTile {
  id: string;
  kind: string;
  symbol: string;
  color: string;
  row: number;
  col: number;
}

export interface MahjongBoard {
  level: number;
  rows: number;
  cols: number;
  tiles: Array<MahjongTile | null>;
}

const TILE_KINDS = [
  { kind: 'leaf', symbol: '✦', color: 'emerald' },
  { kind: 'moon', symbol: '◒', color: 'sky' },
  { kind: 'sun', symbol: '☼', color: 'amber' },
  { kind: 'wave', symbol: '≈', color: 'cyan' },
  { kind: 'flower', symbol: '✿', color: 'rose' },
  { kind: 'diamond', symbol: '◆', color: 'violet' },
  { kind: 'shell', symbol: '◈', color: 'orange' },
  { kind: 'spark', symbol: '✧', color: 'lime' },
  { kind: 'ring', symbol: '◉', color: 'indigo' },
  { kind: 'arrow', symbol: '➜', color: 'teal' },
  { kind: 'cross', symbol: '✚', color: 'fuchsia' },
  { kind: 'hex', symbol: '⬢', color: 'blue' },
] as const;

export const MAHJONG_CONNECT_LEVEL_COUNT = 12;

function seededOrder<T>(items: T[], seed: number): T[] {
  const result = [...items];
  let current = seed || 1;
  for (let index = result.length - 1; index > 0; index -= 1) {
    current = (Math.imul(current, 1103515245) + 12345) >>> 0;
    const target = current % (index + 1);
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

export function createMahjongBoard(level: number): MahjongBoard {
  const safeLevel = Math.min(MAHJONG_CONNECT_LEVEL_COUNT, Math.max(1, level));
  const rows = 4;
  const cols = 6;
  const kindOrder = seededOrder([...TILE_KINDS], safeLevel * 97 + 11);
  const tiles: Array<MahjongTile | null> = [];

  kindOrder.forEach((definition, pairIndex) => {
    for (let pair = 0; pair < 2; pair += 1) {
      const index = pairIndex * 2 + pair;
      tiles.push({
        id: `level-${safeLevel}-${definition.kind}-${pair}`,
        kind: definition.kind,
        symbol: definition.symbol,
        color: definition.color,
        row: Math.floor(index / cols),
        col: index % cols,
      });
    }
  });

  return { level: safeLevel, rows, cols, tiles };
}

function tileAt(board: MahjongBoard, row: number, col: number) {
  if (row < 0 || col < 0 || row >= board.rows || col >= board.cols) return null;
  return board.tiles[row * board.cols + col];
}

function stateKey(row: number, col: number, direction: number) {
  return `${row}:${col}:${direction}`;
}

export function canConnectMahjongTiles(
  board: MahjongBoard,
  firstId: string,
  secondId: string,
  maxTurns = 2,
): boolean {
  if (firstId === secondId) return false;
  const first = board.tiles.find((tile) => tile?.id === firstId);
  const second = board.tiles.find((tile) => tile?.id === secondId);
  if (!first || !second || first.kind !== second.kind) return false;

  const paddedRows = board.rows + 2;
  const paddedCols = board.cols + 2;
  const start = { row: first.row + 1, col: first.col + 1 };
  const target = { row: second.row + 1, col: second.col + 1 };
  const directions = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];
  const queue: Array<{ row: number; col: number; direction: number; turns: number }> = [];
  const visited = new Map<string, number>();

  for (let direction = 0; direction < directions.length; direction += 1) {
    queue.push({ row: start.row, col: start.col, direction, turns: 0 });
  }

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) break;
    const [rowDelta, colDelta] = directions[current.direction];
    const row = current.row + rowDelta;
    const col = current.col + colDelta;
    if (row < 0 || col < 0 || row >= paddedRows || col >= paddedCols) continue;

    const isTarget = row === target.row && col === target.col;
    const boardTile = tileAt(board, row - 1, col - 1);
    if (!isTarget && boardTile) continue;
    const key = stateKey(row, col, current.direction);
    const previousTurns = visited.get(key);
    if (previousTurns !== undefined && previousTurns <= current.turns) continue;
    visited.set(key, current.turns);
    if (isTarget) return current.turns <= maxTurns;

    for (let nextDirection = 0; nextDirection < directions.length; nextDirection += 1) {
      const nextTurns = current.turns + (nextDirection === current.direction ? 0 : 1);
      if (nextTurns <= maxTurns) {
        queue.push({ row, col, direction: nextDirection, turns: nextTurns });
      }
    }
  }

  return false;
}

export function removeMahjongPair(board: MahjongBoard, firstId: string, secondId: string): MahjongBoard | null {
  if (!canConnectMahjongTiles(board, firstId, secondId)) return null;
  const nextTiles = board.tiles.map((tile) =>
    tile && (tile.id === firstId || tile.id === secondId) ? null : tile,
  );
  return { ...board, tiles: nextTiles };
}

export function findMahjongHint(board: MahjongBoard): [MahjongTile, MahjongTile] | null {
  const activeTiles = board.tiles.filter((tile): tile is MahjongTile => Boolean(tile));
  for (let firstIndex = 0; firstIndex < activeTiles.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < activeTiles.length; secondIndex += 1) {
      const first = activeTiles[firstIndex];
      const second = activeTiles[secondIndex];
      if (first.kind === second.kind && canConnectMahjongTiles(board, first.id, second.id)) {
        return [first, second];
      }
    }
  }
  return null;
}

export function shuffleMahjongBoard(board: MahjongBoard, seed: number): MahjongBoard {
  const activeTiles = seededOrder(
    board.tiles.filter((tile): tile is MahjongTile => Boolean(tile)),
    seed,
  );
  let cursor = 0;
  const tiles = board.tiles.map((tile, index) => {
    if (!tile) return null;
    const next = activeTiles[cursor];
    cursor += 1;
    return next ? { ...next, row: Math.floor(index / board.cols), col: index % board.cols } : null;
  });
  return { ...board, tiles };
}

export function getRemainingMahjongCount(board: MahjongBoard) {
  return board.tiles.filter(Boolean).length;
}

export function isMahjongBoardComplete(board: MahjongBoard) {
  return getRemainingMahjongCount(board) === 0;
}
