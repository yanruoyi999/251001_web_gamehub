import { describe, expect, it } from 'vitest';

import {
  createMahjongBoard,
  findMahjongHint,
  getRemainingMahjongCount,
  isMahjongBoardComplete,
  removeMahjongPair,
  MAHJONG_CONNECT_LEVEL_COUNT,
  shuffleMahjongBoard,
} from '@/lib/games/mahjong-connect';

describe('Mahjong Connect engine', () => {
  it('creates twelve levels with twelve matching pairs and a legal hint', () => {
    expect(MAHJONG_CONNECT_LEVEL_COUNT).toBe(12);
    const board = createMahjongBoard(4);
    const activeTiles = board.tiles.filter(Boolean);
    const counts = new Map(activeTiles.map((tile) => [tile!.kind, 0]));

    for (const tile of activeTiles) counts.set(tile!.kind, (counts.get(tile!.kind) ?? 0) + 1);

    expect(activeTiles).toHaveLength(24);
    expect([...counts.values()].every((count) => count === 2)).toBe(true);
    expect(findMahjongHint(board)).not.toBeNull();
  });

  it('removes only connectable matching pairs and retains the board shape after shuffle', () => {
    let board = createMahjongBoard(1);
    const hint = findMahjongHint(board);
    expect(hint).not.toBeNull();

    board = removeMahjongPair(board, hint![0].id, hint![1].id)!;
    expect(getRemainingMahjongCount(board)).toBe(22);

    const shuffled = shuffleMahjongBoard(board, 20260826);
    expect(shuffled.tiles).toHaveLength(board.tiles.length);
    expect(getRemainingMahjongCount(shuffled)).toBe(22);

    for (let count = 0; count < 12 && !isMahjongBoardComplete(board); count += 1) {
      const nextHint = findMahjongHint(board);
      expect(nextHint).not.toBeNull();
      board = removeMahjongPair(board, nextHint![0].id, nextHint![1].id)!;
    }
    expect(isMahjongBoardComplete(board)).toBe(true);
  });
});
