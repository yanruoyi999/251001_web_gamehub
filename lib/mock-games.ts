/**
 * Mock games data generated from 4399 iframe dataset.
 * Used for local development fallback before the database is wired up.
 */

import sampleData from '@/public/data/4399-sample.json';

export interface MockGame {
  id: number;
  slug: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  iframeUrl: string;
  thumbnailUrl: string;
  featured: boolean;
  isNew: boolean;
  isHot: boolean;
}

interface SampleGameEntry {
  slug?: string;
  title?: string;
  titleEn?: string;
  iframeUrl?: string;
}

const MAX_IMPORTED_GAMES = 32;
const FEATURED_COUNT = 6;
const NEW_THRESHOLD = 18;

const COLOR_PALETTE = [
  '4C1D95',
  '7C3AED',
  '2563EB',
  '0EA5E9',
  '059669',
  'F59E0B',
  'EF4444',
  'EC4899',
];

function createSvgPlaceholder(title: string, color: string): string {
  const safeText = title.replace(/[^a-zA-Z0-9\s]/g, '').trim().slice(0, 12) || 'Game';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" rx="24" fill="#${color}" /><text x="200" y="165" text-anchor="middle" fill="#FFFFFF" font-size="36" font-family="Arial, Helvetica, sans-serif">${safeText}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function buildMockGamesFromSample(entries: SampleGameEntry[]): MockGame[] {
  return entries.slice(0, MAX_IMPORTED_GAMES).map((entry, index) => {
    const slug = (entry.slug ?? `game-${index + 1}`).trim();
    const englishTitle = (entry.titleEn ?? entry.title ?? `Game ${index + 1}`).trim();
    const title = englishTitle;
    const iframeUrl = entry.iframeUrl?.trim() ?? '';
    const color = COLOR_PALETTE[index % COLOR_PALETTE.length];

    return {
      id: index + 1,
      slug,
      title,
      titleEn: englishTitle,
      description: `来自 4399 的 HTML5 小游戏《${englishTitle}》，打开即可游玩，无需下载。`,
      descriptionEn: `Play “${englishTitle}”, an HTML5 mini game sourced from 4399. No downloads required.`,
      iframeUrl,
      thumbnailUrl: createSvgPlaceholder(englishTitle, color),
      featured: index < FEATURED_COUNT,
      isNew: index < NEW_THRESHOLD,
      isHot: index % 3 === 0,
    };
  });
}

// Fallback少量演示数据，防止本地缺失 JSON 时页面为空
const FALLBACK_GAMES: MockGame[] = [
  {
    id: 1,
    slug: '2048',
    title: '2048',
    titleEn: '2048',
    description: '经典数字拼图游戏，向任意方向滑动方块合并数字，挑战 2048。',
    descriptionEn: 'Classic sliding number puzzle—merge tiles to reach 2048.',
    iframeUrl: 'https://yanruoyi999.github.io/2048/',
    thumbnailUrl: createSvgPlaceholder('2048', COLOR_PALETTE[0]),
    featured: true,
    isNew: false,
    isHot: true,
  },
  {
    id: 2,
    slug: 'hextris',
    title: 'Hextris',
    titleEn: 'Hextris',
    description: '六边形版俄罗斯方块，旋转容器让下落方块组合出高分。',
    descriptionEn: 'Hexagonal twist on Tetris—rotate the core to stack falling blocks.',
    iframeUrl: 'https://dj-dk.github.io/Hextris/',
    thumbnailUrl: createSvgPlaceholder('Hextris', COLOR_PALETTE[1]),
    featured: true,
    isNew: false,
    isHot: true,
  },
  {
    id: 3,
    slug: 'super-sudoku',
    title: '超级数独',
    titleEn: 'Super Sudoku',
    description: '功能完整的数独体验，支持多种难度与提示机制。',
    descriptionEn: 'Full Sudoku experience with multiple difficulty levels and assists.',
    iframeUrl: 'https://sudoku.tn1ck.com',
    thumbnailUrl: createSvgPlaceholder('Sudoku', COLOR_PALETTE[2]),
    featured: true,
    isNew: false,
    isHot: false,
  },
];

const sampleEntries = Array.isArray((sampleData as { games?: SampleGameEntry[] }).games)
  ? (sampleData as { games: SampleGameEntry[] }).games
  : [];

const generatedMockGames = buildMockGamesFromSample(sampleEntries).filter((game) => game.iframeUrl);

export const mockGames: MockGame[] =
  generatedMockGames.length > 0 ? generatedMockGames : FALLBACK_GAMES;

const legacySlugMap: Record<string, string> = {
  'space-crusade': 'adam-and-eve-4',
  'ludum-dare-28': 'adam-and-eve-5-part-1',
  'ludum-dare-29': 'adam-and-eve-6',
};

export function getMockGameById(id: number): MockGame | undefined {
  return mockGames.find((game) => game.id === id);
}

export function getMockGameBySlug(slug: string): MockGame | undefined {
  const normalized = slug.trim().toLowerCase();
  const matched = mockGames.find((game) => game.slug === normalized);
  if (matched) return matched;

  const aliasTarget = legacySlugMap[normalized];
  if (aliasTarget) {
    return mockGames.find((game) => game.slug === aliasTarget);
  }
  return undefined;
}

export function getFeaturedMockGames(): MockGame[] {
  return mockGames.filter((game) => game.featured);
}
