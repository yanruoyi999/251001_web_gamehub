export type DuelPlayer = 'one' | 'two';
export type DuelScore = Record<DuelPlayer, number>;

export function playerForControlCode(code: string): DuelPlayer | null {
  if (code === 'KeyA' || code === 'Space') return 'one';
  if (code === 'KeyL' || code === 'Enter') return 'two';
  return null;
}

export function recordMatchRound(score: DuelScore, winner: DuelPlayer) {
  const next = { ...score, [winner]: score[winner] + 1 };
  return { score: next, winner: next[winner] >= 2 ? winner : null };
}

export interface TapDuelState {
  cueAt: number;
  score: DuelScore;
  roundWinner: DuelPlayer | null;
  reactionMs: number | null;
}

export function createTapDuelState(cueAt: number, score: DuelScore = { one: 0, two: 0 }): TapDuelState {
  return { cueAt, score: { ...score }, roundWinner: null, reactionMs: null };
}

export function registerTapDuelInput(
  state: TapDuelState,
  player: DuelPlayer,
  at: number,
): TapDuelState {
  if (state.roundWinner) return state;
  const winner = at < state.cueAt ? (player === 'one' ? 'two' : 'one') : player;
  return {
    ...state,
    score: { ...state.score, [winner]: state.score[winner] + 1 },
    roundWinner: winner,
    reactionMs: at < state.cueAt ? null : Math.max(0, Math.round(at - state.cueAt)),
  };
}

const GRID_SIZE = 3;
const GRID_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

export interface GridClaimState {
  cells: Array<DuelPlayer | null>;
  turn: DuelPlayer;
  score: DuelScore;
  bonusCells: number[];
  completedLines: string[];
  finished: boolean;
}

function seededCells(seed: number) {
  const first = (Math.imul(Math.abs(Math.trunc(seed)) + 3, 1_103_515_245) >>> 0) % 9;
  const second = (first + 4 + (Math.abs(seed) % 4)) % 9;
  return [...new Set([first, second])].sort((a, b) => a - b);
}

export function createGridClaimState(seed: number): GridClaimState {
  return {
    cells: Array<DuelPlayer | null>(GRID_SIZE * GRID_SIZE).fill(null),
    turn: 'one',
    score: { one: 0, two: 0 },
    bonusCells: seededCells(seed),
    completedLines: [],
    finished: false,
  };
}

export function claimGridCell(state: GridClaimState, index: number): GridClaimState {
  if (state.finished || !Number.isInteger(index) || index < 0 || index >= state.cells.length || state.cells[index]) {
    return state;
  }
  const cells = [...state.cells];
  cells[index] = state.turn;
  const completedLines = [...state.completedLines];
  let gained = 0;
  GRID_LINES.forEach((line, lineIndex) => {
    const lineKey = `${state.turn}:${lineIndex}`;
    if (!completedLines.includes(lineKey) && line.every((cell) => cells[cell] === state.turn)) {
      completedLines.push(lineKey);
      gained += 1;
    }
  });
  return {
    ...state,
    cells,
    completedLines,
    score: { ...state.score, [state.turn]: state.score[state.turn] + gained },
    turn: state.turn === 'one' ? 'two' : 'one',
    finished: cells.every(Boolean),
  };
}

export interface SyncSwitchState {
  windowMs: number;
  minimumWindowMs: number;
  pending: Partial<Record<DuelPlayer, number>>;
  successes: number;
  misses: number;
}

export function createSyncSwitchState(windowMs = 500, minimumWindowMs = 180): SyncSwitchState {
  return {
    windowMs: Math.max(minimumWindowMs, windowMs),
    minimumWindowMs,
    pending: {},
    successes: 0,
    misses: 0,
  };
}

export function registerSyncSwitchInput(
  state: SyncSwitchState,
  player: DuelPlayer,
  at: number,
): SyncSwitchState {
  const other: DuelPlayer = player === 'one' ? 'two' : 'one';
  const otherAt = state.pending[other];
  if (otherAt === undefined) return { ...state, pending: { [player]: at } };
  const difference = Math.abs(at - otherAt);
  if (difference <= state.windowMs) {
    return {
      ...state,
      pending: {},
      successes: state.successes + 1,
      windowMs: Math.max(state.minimumWindowMs, state.windowMs - 40),
    };
  }
  return { ...state, pending: { [player]: at }, misses: state.misses + 1 };
}
