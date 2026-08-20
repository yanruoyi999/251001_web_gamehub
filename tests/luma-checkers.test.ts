import { describe, expect, it } from 'vitest';

import {
  applyCheckersMove,
  createCheckersState,
  getCheckersDurationBucket,
  getLegalMoves,
  type CheckersState,
} from '@/lib/games/luma-checkers';

type TestPiece = {
  row: number;
  col: number;
  value: NonNullable<CheckersState['board'][number][number]>;
};

function stateWithPieces(pieces: TestPiece[]): CheckersState {
  const board = Array.from({ length: 8 }, () => Array(8).fill(null));
  for (const piece of pieces) board[piece.row][piece.col] = piece.value;

  return {
    board,
    turn: 'red',
    forcedFrom: null,
    winner: null,
    moveCount: 0,
  } satisfies CheckersState;
}

describe('Luma Checkers rules', () => {
  it('starts with twelve pieces per player and seven opening moves', () => {
    const state = createCheckersState();

    expect(
      state.board.flat().filter(piece => piece?.player === 'red')
    ).toHaveLength(12);
    expect(
      state.board.flat().filter(piece => piece?.player === 'black')
    ).toHaveLength(12);
    expect(getLegalMoves(state)).toHaveLength(7);
  });

  it('requires a capture whenever any capture is available', () => {
    const state = stateWithPieces([
      { row: 5, col: 0, value: { player: 'red', king: false } },
      { row: 4, col: 1, value: { player: 'black', king: false } },
      { row: 6, col: 3, value: { player: 'red', king: false } },
    ]);

    expect(getLegalMoves(state)).toEqual([
      {
        from: { row: 5, col: 0 },
        to: { row: 3, col: 2 },
        captured: { row: 4, col: 1 },
      },
    ]);
  });

  it('promotes a man on the far row and changes the turn', () => {
    const state = stateWithPieces([
      { row: 2, col: 1, value: { player: 'red', king: false } },
      { row: 1, col: 2, value: { player: 'black', king: false } },
    ]);

    const next = applyCheckersMove(state, {
      from: { row: 2, col: 1 },
      to: { row: 0, col: 3 },
      captured: { row: 1, col: 2 },
    });

    expect(next.board[0][3]).toEqual({ player: 'red', king: true });
    expect(next.board[1][2]).toBeNull();
    expect(next.turn).toBe('black');
  });

  it('keeps the turn for a forced multi-jump', () => {
    const state = stateWithPieces([
      { row: 5, col: 0, value: { player: 'red', king: false } },
      { row: 4, col: 1, value: { player: 'black', king: false } },
      { row: 2, col: 3, value: { player: 'black', king: false } },
    ]);

    const next = applyCheckersMove(state, {
      from: { row: 5, col: 0 },
      to: { row: 3, col: 2 },
      captured: { row: 4, col: 1 },
    });

    expect(next.turn).toBe('red');
    expect(next.forcedFrom).toEqual({ row: 3, col: 2 });
    expect(getLegalMoves(next)).toEqual([
      {
        from: { row: 3, col: 2 },
        to: { row: 1, col: 4 },
        captured: { row: 2, col: 3 },
      },
    ]);
  });

  it('declares the current player the winner when the opponent has no pieces', () => {
    const state = stateWithPieces([
      { row: 2, col: 1, value: { player: 'red', king: true } },
      { row: 1, col: 2, value: { player: 'black', king: false } },
    ]);

    const next = applyCheckersMove(state, {
      from: { row: 2, col: 1 },
      to: { row: 0, col: 3 },
      captured: { row: 1, col: 2 },
    });

    expect(next.winner).toBe('red');
    expect(getLegalMoves(next)).toEqual([]);
  });

  it('buckets duration without recording exact timing', () => {
    expect(getCheckersDurationBucket(29_999)).toBe('under-30s');
    expect(getCheckersDurationBucket(30_000)).toBe('30s-to-3m');
    expect(getCheckersDurationBucket(180_000)).toBe('3m-to-10m');
    expect(getCheckersDurationBucket(600_000)).toBe('over-10m');
    expect(getCheckersDurationBucket(null)).toBe('invalid');
  });
});
