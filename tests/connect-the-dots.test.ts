import { describe, expect, it } from 'vitest';

import {
  CONNECT_DOTS_COLOR_BOARD_COUNT,
  CONNECT_DOTS_NUMBER_BOARD_COUNT,
  createColorLinkBoard,
  createNumberTrailBoard,
  getColorLinkPairCount,
  isColorLinkMatch,
  isNextNumberTrailPoint,
} from '@/lib/games/connect-the-dots';

describe('Connect the Dots engine', () => {
  it('creates the promised deterministic number and color board families', () => {
    expect(CONNECT_DOTS_NUMBER_BOARD_COUNT).toBe(12);
    expect(CONNECT_DOTS_COLOR_BOARD_COUNT).toBe(20);
    expect(createNumberTrailBoard(2)).toEqual(createNumberTrailBoard(2));
    expect(createNumberTrailBoard(2).points).toHaveLength(12);

    const colorBoard = createColorLinkBoard(4);
    expect(colorBoard.points).toHaveLength(20);
    expect(getColorLinkPairCount(colorBoard)).toBe(10);
    expect(new Set(colorBoard.points.map((point) => point.color)).size).toBe(10);
  });

  it('accepts only the next number and matching color pair', () => {
    const numberBoard = createNumberTrailBoard(0);
    expect(isNextNumberTrailPoint(numberBoard, 0, 1)).toBe(true);
    expect(isNextNumberTrailPoint(numberBoard, 1, 3)).toBe(false);

    const colorBoard = createColorLinkBoard(0);
    const first = colorBoard.points[0];
    const match = colorBoard.points.find((point) => point.color === first.color && point.id !== first.id);
    const mismatch = colorBoard.points.find((point) => point.color !== first.color);

    expect(match).toBeDefined();
    expect(mismatch).toBeDefined();
    expect(isColorLinkMatch(first, match!)).toBe(true);
    expect(isColorLinkMatch(first, mismatch!)).toBe(false);
  });
});
