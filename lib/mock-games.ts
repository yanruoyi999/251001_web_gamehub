/**
 * Mock games data generated from an external iframe dataset.
 * Used for local development fallback before the database is wired up.
 */

import sampleData from '@/public/data/4399-sample.json';
import { shouldPromoteGameInCollections } from '@/lib/games/quality-policy';

const BASE_TIMESTAMP = new Date('2024-01-01T00:00:00Z');

export interface MockCategory {
  id: number;
  slug: string;
  name: string;
  nameEn: string;
  description?: string | null;
  descriptionEn?: string | null;
  iconUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockTag {
  id: number;
  slug: string;
  name: string;
  nameEn: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockInstructions {
  zh: string[];
  en: string[];
}

export interface MockScreenshot {
  url: string;
  order: number;
}

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
  developerName: string;
  developerUrl: string;
  sourceUrl: string | null;
  categories: MockCategory[];
  tags: MockTag[];
  instructions: MockInstructions;
  screenshots: MockScreenshot[];
}

interface SampleGameEntry {
  slug?: string;
  title?: string;
  titleEn?: string;
  iframeUrl?: string;
  sourcePageUrl?: string;
  sourceHost?: string;
}

const MAX_IMPORTED_GAMES = 500;
const FEATURED_COUNT = 6;
const NEW_THRESHOLD = 18;

const DEFAULT_DEVELOPER = {
  name: 'Luma Game Hub Editorial',
  url: 'https://www.adfreegames.com',
};

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

const LOCAL_SCREENSHOT_SLUGS = new Set([
  'adam-and-eve-4',
  'adam-and-eve-5-part-1',
  'adam-and-eve-5-part-2',
  'adam-and-eve-6',
  'adam-and-eve-7',
  'adam-and-eve-8',
  'adam-and-eve-adam-the-ghost',
  'adam-and-eve-aliens',
  'adam-and-eve-astronaut',
  'adam-and-eve-go',
  'adam-and-eve-go-2',
  'adam-and-eve-go-3',
  'adam-and-eve-go-xmas',
  'adam-and-eve-night',
  'adam-and-eve-sleepwalker',
  'adam-and-eve-snow',
  'adam-and-eve-zombies',
  'apple-knight',
  'apple-knight-mini-dungeons',
  'assemble-and-drive-road-monsters',
  'balance-duel',
  'beat-line',
  'big-tower-tiny-square',
  'big-tower-tiny-square-2',
  'google-snake',
  'string-theory-2-remastered',
]);

function sanitizeHost(value?: string | null): string | null {
  if (!value) return null;
  try {
    const url = value.startsWith('http') ? new URL(value) : new URL(`https://${value}`);
    return url.hostname.toLowerCase();
  } catch {
    return value.replace(/^https?:\/\//, '').replace(/\/.*$/, '').toLowerCase();
  }
}

function toTitleCase(input: string): string {
  return input
    .split(/[-_.]/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

function deriveDeveloperInfo(entry: SampleGameEntry, iframeUrl: string): { name: string; url: string } {
  const candidates = [sanitizeHost(entry.sourceHost), sanitizeHost(iframeUrl)];
  const host = candidates.find((item): item is string => Boolean(item));

  if (!host) {
    return DEFAULT_DEVELOPER;
  }

  if (host.includes('4399')) {
    return { name: '4399 游戏平台', url: 'https://www.4399.com' };
  }

  if (host.includes('ad-freegames')) {
    return { name: 'AdFreeGames', url: 'https://www.adfreegames.com' };
  }

  if (host.includes('itch.io')) {
    return { name: 'Itch.io', url: 'https://itch.io' };
  }

  const normalized = host.replace(/^www\./, '');
  return {
    name: toTitleCase(normalized.split('.')[0] ?? normalized),
    url: `https://${normalized}`,
  };
}

function createScreenshotPlaceholders(title: string, baseIndex: number): MockScreenshot[] {
  return Array.from({ length: 3 }, (_, variant) => {
    const color = COLOR_PALETTE[(baseIndex + variant) % COLOR_PALETTE.length];
    const label = `${title} ${variant + 1}`;
    return {
      url: createSvgPlaceholder(label, color),
      order: variant,
    };
  });
}

function getLocalScreenshotUrl(slug: string): string | null {
  return LOCAL_SCREENSHOT_SLUGS.has(slug) ? `/game-screenshots/${slug}.png` : null;
}

function buildScreenshots(slug: string, title: string, baseIndex: number): MockScreenshot[] {
  const localScreenshotUrl = getLocalScreenshotUrl(slug);
  const placeholders = createScreenshotPlaceholders(title, baseIndex);

  if (!localScreenshotUrl) return placeholders;

  return [
    { url: localScreenshotUrl, order: 0 },
    ...placeholders.slice(0, 2).map((screenshot, index) => ({
      ...screenshot,
      order: index + 1,
    })),
  ];
}

function buildThumbnailUrl(slug: string, title: string, color: string): string {
  return getLocalScreenshotUrl(slug) ?? createSvgPlaceholder(title, color);
}

const MOCK_CATEGORY_PRESETS: MockCategory[] = [
  {
    id: 1001,
    slug: 'action',
    name: '动作',
    nameEn: 'Action',
    description: '快节奏的闯关或对战玩法，强调走位与即时反应。',
    descriptionEn: 'Fast-paced runs, combat, and reflex-driven challenges.',
    iconUrl: null,
    createdAt: BASE_TIMESTAMP,
    updatedAt: BASE_TIMESTAMP,
  },
  {
    id: 1002,
    slug: 'adventure',
    name: '冒险',
    nameEn: 'Adventure',
    description: '探索未知关卡、解锁剧情或在地图中寻找关键道具。',
    descriptionEn: 'Exploration-focused stages with light narrative and discovery.',
    iconUrl: null,
    createdAt: BASE_TIMESTAMP,
    updatedAt: BASE_TIMESTAMP,
  },
  {
    id: 1003,
    slug: 'puzzle',
    name: '益智',
    nameEn: 'Puzzle',
    description: '需要思考与规划的解谜玩法，考验逻辑与布局。',
    descriptionEn: 'Brain teasers that reward planning and pattern recognition.',
    iconUrl: null,
    createdAt: BASE_TIMESTAMP,
    updatedAt: BASE_TIMESTAMP,
  },
  {
    id: 1004,
    slug: 'racing',
    name: '竞速',
    nameEn: 'Racing',
    description: '竞速或敏捷躲避类游戏，强调手感与节奏。',
    descriptionEn: 'Speed-focused runs with tight control and momentum.',
    iconUrl: null,
    createdAt: BASE_TIMESTAMP,
    updatedAt: BASE_TIMESTAMP,
  },
  {
    id: 1005,
    slug: 'strategy',
    name: '策略',
    nameEn: 'Strategy',
    description: '注重资源调度、布阵或长线规划的玩法。',
    descriptionEn: 'Plan ahead, manage upgrades, and outsmart opponents.',
    iconUrl: null,
    createdAt: BASE_TIMESTAMP,
    updatedAt: BASE_TIMESTAMP,
  },
  {
    id: 1006,
    slug: 'casual',
    name: '休闲',
    nameEn: 'Casual',
    description: '适合快速上手的轻量体验，适合放松与碎片时间。',
    descriptionEn: 'Pick-up-and-play experiences ideal for short sessions.',
    iconUrl: null,
    createdAt: BASE_TIMESTAMP,
    updatedAt: BASE_TIMESTAMP,
  },
];

const MOCK_TAG_PRESETS: MockTag[] = [
  {
    id: 2001,
    slug: 'singleplayer',
    name: '单人模式',
    nameEn: 'Single Player',
    createdAt: BASE_TIMESTAMP,
    updatedAt: BASE_TIMESTAMP,
  },
  {
    id: 2002,
    slug: 'keyboard',
    name: '键盘操作',
    nameEn: 'Keyboard Controls',
    createdAt: BASE_TIMESTAMP,
    updatedAt: BASE_TIMESTAMP,
  },
  {
    id: 2003,
    slug: 'short-session',
    name: '碎片时间',
    nameEn: 'Short Sessions',
    createdAt: BASE_TIMESTAMP,
    updatedAt: BASE_TIMESTAMP,
  },
  {
    id: 2004,
    slug: 'progression',
    name: '升级成长',
    nameEn: 'Progression',
    createdAt: BASE_TIMESTAMP,
    updatedAt: BASE_TIMESTAMP,
  },
  {
    id: 2005,
    slug: 'high-score',
    name: '高分挑战',
    nameEn: 'High Score Hunt',
    createdAt: BASE_TIMESTAMP,
    updatedAt: BASE_TIMESTAMP,
  },
  {
    id: 2006,
    slug: 'precision',
    name: '操作精度',
    nameEn: 'Precision',
    createdAt: BASE_TIMESTAMP,
    updatedAt: BASE_TIMESTAMP,
  },
  {
    id: 2007,
    slug: 'timed-challenge',
    name: '限时挑战',
    nameEn: 'Timed Challenge',
    createdAt: BASE_TIMESTAMP,
    updatedAt: BASE_TIMESTAMP,
  },
  {
    id: 2008,
    slug: 'exploration',
    name: '地图探索',
    nameEn: 'Exploration',
    createdAt: BASE_TIMESTAMP,
    updatedAt: BASE_TIMESTAMP,
  },
  {
    id: 2009,
    slug: 'collection',
    name: '收集元素',
    nameEn: 'Collectibles',
    createdAt: BASE_TIMESTAMP,
    updatedAt: BASE_TIMESTAMP,
  },
];

const CATEGORY_KEYWORDS: Array<{ regex: RegExp; slug: MockCategory['slug'] }> = [
  { regex: /(run|race|drive|kart|stunt|bike|speed)/i, slug: 'racing' },
  { regex: /(puzzle|logic|sudoku|brain|maze|block)/i, slug: 'puzzle' },
  { regex: /(defense|tower|strategy|tactics|build|idle)/i, slug: 'strategy' },
  { regex: /(farm|shop|mart|tycoon|sim|craft)/i, slug: 'casual' },
  { regex: /(adventure|quest|escape|island|dungeon)/i, slug: 'adventure' },
  { regex: /(battle|fight|shoot|ninja|war|stick)/i, slug: 'action' },
];

const TAG_KEYWORDS: Array<{ regex: RegExp; slug: MockTag['slug'] }> = [
  { regex: /(puzzle|brain|logic|sudoku)/i, slug: 'precision' },
  { regex: /(run|race|stunt|speed)/i, slug: 'timed-challenge' },
  { regex: /(farm|mart|shop|collect)/i, slug: 'collection' },
  { regex: /(battle|fight|shoot|war)/i, slug: 'progression' },
  { regex: /(escape|adventure|quest|island)/i, slug: 'exploration' },
  { regex: /(jump|platform|climb|parkour)/i, slug: 'precision' },
];

const DEFAULT_TAG_SEQUENCE = [
  'singleplayer',
  'keyboard',
  'short-session',
  'high-score',
  'progression',
  'collection',
  'precision',
  'timed-challenge',
  'exploration',
];

const CATEGORY_MAP = new Map(MOCK_CATEGORY_PRESETS.map((item) => [item.slug, item]));
const TAG_MAP = new Map(MOCK_TAG_PRESETS.map((item) => [item.slug, item]));

const INSTRUCTION_TEMPLATES: Record<
  MockCategory['slug'],
  (title: string) => MockInstructions
> = {
  action: (title) => ({
    zh: [
      `熟悉《${title}》的基础操作，优先掌握移动与攻击的节奏以避免被敌人包围。`,
      '看到增益道具时及时拾取，可以短时间提升输出或防御能力。',
      '关键关卡建议保留爆发技能，在 Boss 或精英敌人出现时再集中使用。',
    ],
    en: [
      `Spend the first run of “${title}” learning how movement and attacks chain together to avoid getting cornered.`,
      'Grab power-up items as soon as they appear—they offer short bursts of extra damage or protection.',
      'Save your ultimate ability for bosses or elite enemies so you can finish them quickly.',
    ],
  }),
  adventure: (title) => ({
    zh: [
      `在《${title}》里多关注环境互动，隐藏通路通常藏在可破坏的物件后方。`,
      '探索时留意任务日志或提示图标，优先完成能解锁新区域的目标。',
      '遇到难题时不妨回头查看背包和对话记录，线索往往已经给出。',
    ],
    en: [
      `Interact with everything in “${title}”—hidden paths are often tucked behind breakable objects.`,
      'Follow quest markers that unlock fresh areas before cleaning up side objectives.',
      'If you are stuck, revisit your inventory and dialogue notes; subtle clues are usually there.',
    ],
  }),
  puzzle: (title) => ({
    zh: [
      `解《${title}》的谜题时先观察整体布局，找到可以确定的数字或图形再逐步扩展。`,
      '遇到分叉思路时采用笔记法，先做假设再验证，避免整体推理被打乱。',
      '难题卡关时先暂停几秒换个角度，再回到当前局面往往会找到新思路。',
    ],
    en: [
      `Start every board in “${title}” by scanning for guaranteed placements—lock those in before branching out.`,
      'Use pencil marks or mental notes when you split between multiple options to keep logic intact.',
      'Take a short breather if you stall; returning with a fresh perspective usually reveals an overlooked move.',
    ],
  }),
  racing: (title) => ({
    zh: [
      `在《${title}》起步时轻点加速键，避免烧胎，转弯时提前减速并内线过弯。`,
      '赛道中设置的加速带要配合氮气或漂移使用，能在直线段获得最大收益。',
      '熟悉每张赛道的捷径和障碍位置，排位赛时提早换线规避碰撞。',
    ],
    en: [
      `Tap the throttle at the countdown of “${title}” to prevent wheel spin, and brake early before corner entry.`,
      'Chain boost pads with nitro or drift releases to squeeze out maximum straight-line speed.',
      'Memorize shortcuts and obstacle placement so you can switch lanes before traffic and keep momentum.',
    ],
  }),
  strategy: (title) => ({
    zh: [
      `《${title}》前期优先提升经济或基础防线，资源稳固后再扩张火力。`,
      '查看单位或塔的说明，组合不同功能的兵种能提升整体效率。',
      '遇到强敌波次时提前布置控制技能，并保留应急资源用于收尾。',
    ],
    en: [
      `Invest in economy and core defenses early in “${title}”; expand your damage output only after resources stabilize.`,
      'Mix unit types or tower effects to cover each other’s weaknesses and maximize efficiency.',
      'Set up crowd control ahead of elite waves and keep a reserve resource pool for emergencies.',
    ],
  }),
  casual: (title) => ({
    zh: [
      `《${title}》适合碎片时间游玩，先完成短任务或每日目标获得额外奖励。`,
      '善用提示或自动玩法选项，让进度保持稳定，不必每次都从头摸索。',
      '休闲类玩法也有节奏建议，适度挑战高分榜能激发更多动力。',
    ],
    en: [
      `Drop into “${title}” for quick bursts—daily objectives usually hand out generous bonuses.`,
      'Make use of hint systems or auto-play helpers so progression stays steady between sessions.',
      'Even casual runs benefit from rhythm: attempt the high-score challenge occasionally to stay engaged.',
    ],
  }),
};

const DEFAULT_INSTRUCTIONS: MockInstructions = {
  zh: [
    '先花一局了解操作与节奏，高分往往来自熟悉规则后的稳定发挥。',
    '灵活利用暂停或提示功能，保持解题思路，不要硬碰硬。',
    '完成每日目标或挑战任务，可以更快解锁额外内容。',
  ],
  en: [
    'Use the first attempt to learn the controls—consistent high scores come after you know the rhythm.',
    'Pause and reassess whenever you get stuck; forcing a move rarely works out.',
    'Daily goals and challenge modes are the quickest way to unlock extra content.',
  ],
};

function cloneCategory(category: MockCategory): MockCategory {
  return {
    ...category,
    createdAt: new Date(category.createdAt),
    updatedAt: new Date(category.updatedAt),
  };
}

function cloneTag(tag: MockTag): MockTag {
  return {
    ...tag,
    createdAt: new Date(tag.createdAt),
    updatedAt: new Date(tag.updatedAt),
  };
}

function resolvePrimaryCategorySlug(slug: string, index: number): MockCategory['slug'] {
  const lower = slug.toLowerCase();
  for (const matcher of CATEGORY_KEYWORDS) {
    if (matcher.regex.test(lower)) {
      return matcher.slug;
    }
  }
  return MOCK_CATEGORY_PRESETS[index % MOCK_CATEGORY_PRESETS.length].slug;
}

function buildCategoriesForGame(slug: string, index: number): MockCategory[] {
  const firstSlug = resolvePrimaryCategorySlug(slug, index);
  const secondarySlug =
    MOCK_CATEGORY_PRESETS[(index + 2) % MOCK_CATEGORY_PRESETS.length].slug;
  const selected = new Set<string>([firstSlug, secondarySlug]);
  return Array.from(selected)
    .map((slugKey) => CATEGORY_MAP.get(slugKey))
    .filter((item): item is MockCategory => Boolean(item))
    .map((item) => cloneCategory(item));
}

function buildTagsForGame(
  slug: string,
  categories: MockCategory[],
  index: number
): MockTag[] {
  const lower = slug.toLowerCase();
  const collected = new Set<string>();

  for (const matcher of TAG_KEYWORDS) {
    if (matcher.regex.test(lower)) {
      collected.add(matcher.slug);
    }
  }

  if (categories.some((category) => category.slug === 'adventure')) {
    collected.add('exploration');
  }

  collected.add('singleplayer');
  collected.add('keyboard');

  const rotationStart = index % DEFAULT_TAG_SEQUENCE.length;
  let pointer = rotationStart;
  while (collected.size < 3) {
    const candidate = DEFAULT_TAG_SEQUENCE[pointer % DEFAULT_TAG_SEQUENCE.length];
    collected.add(candidate);
    pointer += 1;
  }

  return Array.from(collected)
    .slice(0, 3)
    .map((slugKey) => TAG_MAP.get(slugKey))
    .filter((item): item is MockTag => Boolean(item))
    .map((item) => cloneTag(item));
}

function buildInstructionsForGame(title: string, category: MockCategory): MockInstructions {
  const builder = INSTRUCTION_TEMPLATES[category.slug];
  return builder ? builder(title) : DEFAULT_INSTRUCTIONS;
}

function createSvgPlaceholder(title: string, color: string): string {
  const safeText = title.replace(/[^a-zA-Z0-9\s]/g, '').trim().slice(0, 12) || 'Game';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" rx="24" fill="#${color}" /><text x="200" y="165" text-anchor="middle" fill="#FFFFFF" font-size="36" font-family="Arial, Helvetica, sans-serif">${safeText}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function buildMockGamesFromSample(entries: SampleGameEntry[]): MockGame[] {
  return entries.slice(0, MAX_IMPORTED_GAMES).map((entry, index) => {
    const slug = (entry.slug ?? `game-${index + 1}`).trim().toLowerCase();
    const englishTitle = (entry.titleEn ?? entry.title ?? `Game ${index + 1}`).trim() || `Game ${index + 1}`;
    const title = englishTitle;
    const iframeUrl = entry.iframeUrl?.trim() ?? '';
    const color = COLOR_PALETTE[index % COLOR_PALETTE.length];
    const categories = buildCategoriesForGame(slug, index);
    const tags = buildTagsForGame(slug, categories, index);
    const instructions = buildInstructionsForGame(englishTitle, categories[0] ?? cloneCategory(MOCK_CATEGORY_PRESETS[0]));
    const developer = deriveDeveloperInfo(entry, iframeUrl);
    const sourceUrl = iframeUrl || entry.sourcePageUrl?.trim() || null;
    const screenshots = buildScreenshots(slug, englishTitle, index);

    return {
      id: index + 1,
      slug,
      title,
      titleEn: englishTitle,
      description: `热门 HTML5 小游戏《${englishTitle}》，点击即可游玩，无需下载。`,
      descriptionEn: `Play “${englishTitle}”, a curated HTML5 mini game that runs instantly in your browser.`,
      iframeUrl,
      thumbnailUrl: buildThumbnailUrl(slug, englishTitle, color),
      featured: index < FEATURED_COUNT,
      isNew: index < NEW_THRESHOLD,
      isHot: index % 3 === 0,
      developerName: developer.name,
      developerUrl: developer.url,
      sourceUrl,
      categories,
      tags,
      instructions,
      screenshots,
    };
  });
}

function createFallbackGame(
  base: Omit<MockGame, 'categories' | 'tags' | 'instructions' | 'screenshots'> & {
    screenshots?: MockScreenshot[];
  },
  index: number
): MockGame {
  const categories = buildCategoriesForGame(base.slug, index);
  const tags = buildTagsForGame(base.slug, categories, index);
  const instructions = buildInstructionsForGame(base.titleEn, categories[0] ?? cloneCategory(MOCK_CATEGORY_PRESETS[0]));
  const screenshots = base.screenshots ?? createScreenshotPlaceholders(base.titleEn, index);
  return {
    ...base,
    categories,
    tags,
    instructions,
    screenshots,
  };
}

// Fallback少量演示数据，防止本地缺失 JSON 时页面为空
const FALLBACK_GAMES: MockGame[] = [
  createFallbackGame(
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
      developerName: DEFAULT_DEVELOPER.name,
      developerUrl: DEFAULT_DEVELOPER.url,
      sourceUrl: 'https://play2048.co/',
    },
    0
  ),
  createFallbackGame(
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
      developerName: DEFAULT_DEVELOPER.name,
      developerUrl: DEFAULT_DEVELOPER.url,
      sourceUrl: 'https://hextris.io/',
    },
    1
  ),
  createFallbackGame(
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
      developerName: DEFAULT_DEVELOPER.name,
      developerUrl: DEFAULT_DEVELOPER.url,
      sourceUrl: 'https://sudoku.com/',
    },
    2
  ),
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
  return mockGames.filter((game) => game.featured && shouldPromoteGameInCollections(game.slug));
}
