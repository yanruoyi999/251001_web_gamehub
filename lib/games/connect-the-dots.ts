export type ConnectDotsMode = 'number-trail' | 'color-link';

export interface NumberTrailBoard {
  id: string;
  points: number[];
}

export interface ColorLinkPoint {
  id: string;
  color: string;
  symbol: string;
}

export interface ColorLinkBoard {
  id: string;
  points: ColorLinkPoint[];
}

const COLORS = [
  { color: 'coral', symbol: '●' },
  { color: 'sky', symbol: '◆' },
  { color: 'violet', symbol: '▲' },
  { color: 'amber', symbol: '■' },
  { color: 'teal', symbol: '✦' },
  { color: 'rose', symbol: '✚' },
  { color: 'indigo', symbol: '⬟' },
  { color: 'lime', symbol: '✿' },
  { color: 'orange', symbol: '✧' },
  { color: 'cyan', symbol: '⬢' },
] as const;

function hash(value: string): number {
  let result = 7;
  for (const character of value) result = (result * 31 + character.charCodeAt(0)) >>> 0;
  return result;
}

function seededOrder<T>(items: T[], seed: number): T[] {
  const ordered = [...items];
  let current = seed || 1;
  for (let index = ordered.length - 1; index > 0; index -= 1) {
    current = (Math.imul(current, 1664525) + 1013904223) >>> 0;
    const target = current % (index + 1);
    [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
  }
  return ordered;
}

export function createNumberTrailBoard(boardIndex: number): NumberTrailBoard {
  return {
    id: `number-trail-${boardIndex + 1}`,
    points: seededOrder(
      Array.from({ length: 12 }, (_, index) => index + 1),
      hash(`number-trail:${boardIndex}`),
    ),
  };
}

export function createColorLinkBoard(boardIndex: number): ColorLinkBoard {
  const pairs = COLORS.map((entry, index) => [
    {
      id: `${entry.color}-${index}-a`,
      color: entry.color,
      symbol: entry.symbol,
    },
    {
      id: `${entry.color}-${index}-b`,
      color: entry.color,
      symbol: entry.symbol,
    },
  ]).flat();

  return {
    id: `color-link-${boardIndex + 1}`,
    points: seededOrder(pairs, hash(`color-link:${boardIndex}`)),
  };
}

export function isNextNumberTrailPoint(board: NumberTrailBoard, next: number, clicked: number) {
  void board;
  return clicked === next + 1;
}

export function isColorLinkMatch(first: ColorLinkPoint, second: ColorLinkPoint) {
  return first.id !== second.id && first.color === second.color;
}

export function getColorLinkPairCount(board: ColorLinkBoard) {
  return new Set(board.points.map((point) => point.color)).size;
}

export const CONNECT_DOTS_NUMBER_BOARD_COUNT = 12;
export const CONNECT_DOTS_COLOR_BOARD_COUNT = 20;
