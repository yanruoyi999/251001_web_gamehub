import { describe, expect, it } from 'vitest';

import {
  chooseChineseCheckersMove,
  createChineseCheckersBoard,
  getReachableChineseCheckersMoves,
  getReachableChineseCheckersMovePaths,
  hasChineseCheckersWinner,
  keyForHole,
  type ChineseCheckersPosition,
} from '@/lib/games/chinese-checkers';

describe('Chinese Checkers clean-room rules', () => {
  it('builds the standard 121-hole star with two opposite ten-piece camps', () => {
    const board = createChineseCheckersBoard();
    expect(board.holes).toHaveLength(121);
    expect(new Set(board.holes.map(keyForHole)).size).toBe(121);
    expect([...board.pieces.values()].filter((player) => player === 'red')).toHaveLength(10);
    expect([...board.pieces.values()].filter((player) => player === 'blue')).toHaveLength(10);
  });

  it('allows an adjacent step and chained jumps while rejecting occupied landings', () => {
    const from: ChineseCheckersPosition = { q: 0, r: 0 };
    const board = createChineseCheckersBoard({
      empty: true,
      pieces: [
        [from, 'red'],
        [{ q: 1, r: 0 }, 'blue'],
        [{ q: 3, r: 0 }, 'blue'],
        [{ q: 0, r: 1 }, 'blue'],
      ],
    });
    const moves = getReachableChineseCheckersMoves(board, from).map(keyForHole);

    expect(moves).toContain('2,0');
    expect(moves).toContain('4,0');
    expect(moves).toContain('-1,0');
    expect(moves).not.toContain('0,1');

    const chained = getReachableChineseCheckersMovePaths(board, from).find(
      (move) => keyForHole(move.to) === '4,0',
    );
    expect(chained?.path.map(keyForHole)).toEqual(['2,0', '4,0']);
  });

  it('keeps seeded AI deterministic and makes hard play at least as progressive as easy', () => {
    const board = createChineseCheckersBoard();
    const easy = chooseChineseCheckersMove(board, 'blue', 'easy', 17);
    const hard = chooseChineseCheckersMove(board, 'blue', 'hard', 17);

    expect(chooseChineseCheckersMove(board, 'blue', 'easy', 17)).toEqual(easy);
    expect(easy).not.toBeNull();
    expect(hard).not.toBeNull();
    expect((hard?.from.r ?? 0) - (hard?.to.r ?? 0)).toBeGreaterThanOrEqual(
      (easy?.from.r ?? 0) - (easy?.to.r ?? 0),
    );
  });

  it('wins only after all ten pieces occupy the opposite camp', () => {
    const empty = createChineseCheckersBoard({ empty: true });
    const target = empty.holes.filter((hole) => hole.r >= 5);
    const nine = createChineseCheckersBoard({
      empty: true,
      pieces: target.slice(0, 9).map((hole) => [hole, 'red'] as const),
    });
    const ten = createChineseCheckersBoard({
      empty: true,
      pieces: target.map((hole) => [hole, 'red'] as const),
    });

    expect(hasChineseCheckersWinner(nine, 'red')).toBe(false);
    expect(hasChineseCheckersWinner(ten, 'red')).toBe(true);
  });
});
