export const SORTING_GAMES_PATH = '/games/sorting-games';
export const DEFAULT_SORTING_CHALLENGE_CODE = 'SORT88';

export type LocalizedSortingText = {
  en: string;
  zh: string;
};

export type SortingGameSlug =
  | 'color-stack-sort'
  | 'number-order-sprint'
  | 'shape-shelf-sort';

export interface SortingGameDefinition {
  slug: SortingGameSlug;
  title: LocalizedSortingText;
  summary: LocalizedSortingText;
  creator: 'Luma Game Hub';
  estimatedMinutes: number;
}

export const SORTING_GAMES: SortingGameDefinition[] = [
  {
    slug: 'color-stack-sort',
    title: { en: 'Color Stack Sort', zh: '颜色堆叠分类' },
    summary: {
      en: 'Move top tiles between stacks until every filled stack contains a single color.',
      zh: '移动每列顶部色块，把每个非空堆叠整理成单一颜色。',
    },
    creator: 'Luma Game Hub',
    estimatedMinutes: 4,
  },
  {
    slug: 'number-order-sprint',
    title: { en: 'Number Order Sprint', zh: '数字排序冲刺' },
    summary: {
      en: 'Tap a shuffled set of unique numbers from smallest to largest as quickly as you can.',
      zh: '把一组打乱且不重复的数字按从小到大依次点完。',
    },
    creator: 'Luma Game Hub',
    estimatedMinutes: 2,
  },
  {
    slug: 'shape-shelf-sort',
    title: { en: 'Shape Shelf Sort', zh: '形状货架分类' },
    summary: {
      en: 'Sort simple geometric cards by three sides, four sides, or round and other shapes.',
      zh: '把几何图形按三边形、四边形、圆形或其他形状进行分类。',
    },
    creator: 'Luma Game Hub',
    estimatedMinutes: 3,
  },
];

const challengeAlphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const colorPool = ['coral', 'sky', 'mint', 'violet'] as const;

export type SortingColor = (typeof colorPool)[number];
export type ShapeShelf = 'three-sides' | 'four-sides' | 'round-other';

export interface SortingShape {
  id: string;
  label: LocalizedSortingText;
  shelf: ShapeShelf;
  cssShape: 'triangle' | 'square' | 'circle' | 'rectangle' | 'pentagon' | 'hexagon';
}

export const SORTING_SHAPES: SortingShape[] = [
  {
    id: 'triangle',
    label: { en: 'Triangle', zh: '三角形' },
    shelf: 'three-sides',
    cssShape: 'triangle',
  },
  {
    id: 'square',
    label: { en: 'Square', zh: '正方形' },
    shelf: 'four-sides',
    cssShape: 'square',
  },
  {
    id: 'rectangle',
    label: { en: 'Rectangle', zh: '长方形' },
    shelf: 'four-sides',
    cssShape: 'rectangle',
  },
  {
    id: 'circle',
    label: { en: 'Circle', zh: '圆形' },
    shelf: 'round-other',
    cssShape: 'circle',
  },
  {
    id: 'pentagon',
    label: { en: 'Pentagon', zh: '五边形' },
    shelf: 'round-other',
    cssShape: 'pentagon',
  },
  {
    id: 'hexagon',
    label: { en: 'Hexagon', zh: '六边形' },
    shelf: 'round-other',
    cssShape: 'hexagon',
  },
];

export function normalizeSortingChallengeCode(value?: string | null): string {
  const cleaned = (value ?? '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 6);

  if (!cleaned) return DEFAULT_SORTING_CHALLENGE_CODE;
  if (cleaned.length >= 6) return cleaned;
  return `${cleaned}${DEFAULT_SORTING_CHALLENGE_CODE}`.slice(0, 6);
}

function hashSeed(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function nextRandom(seed: number): () => number {
  let state = seed || 0x9e3779b9;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithSeed<T>(values: readonly T[], seedText: string): T[] {
  const shuffled = [...values];
  const random = nextRandom(hashSeed(seedText));

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

export function buildNumberSprint(challengeCode: string): number[] {
  const normalized = normalizeSortingChallengeCode(challengeCode);
  const pool = Array.from({ length: 24 }, (_, index) => index + 1);
  return shuffleWithSeed(pool, `numbers:${normalized}`).slice(0, 9);
}

export function buildColorStackPuzzle(challengeCode: string): SortingColor[][] {
  const normalized = normalizeSortingChallengeCode(challengeCode);
  const tiles = colorPool.flatMap((color) => [color, color, color]);
  let shuffled = shuffleWithSeed(tiles, `colors:${normalized}`);

  const looksSolved = shuffled.every((color, index) => {
    const groupStart = Math.floor(index / 3) * 3;
    return shuffled[groupStart] === color;
  });

  if (looksSolved) {
    shuffled = [...shuffled.slice(1), shuffled[0]];
  }

  return [
    shuffled.slice(0, 3),
    shuffled.slice(3, 6),
    shuffled.slice(6, 9),
    shuffled.slice(9, 12),
    [],
  ];
}

export function buildShapeOrder(challengeCode: string): SortingShape[] {
  const normalized = normalizeSortingChallengeCode(challengeCode);
  return shuffleWithSeed(SORTING_SHAPES, `shapes:${normalized}`);
}

export function createSortingChallengeCode(seed: number = Date.now()): string {
  const random = nextRandom(seed >>> 0);
  let code = '';

  for (let index = 0; index < 6; index += 1) {
    code += challengeAlphabet[Math.floor(random() * challengeAlphabet.length)];
  }

  return code;
}
