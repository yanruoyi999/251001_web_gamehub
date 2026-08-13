export type DailyRecommendationLocale = 'zh' | 'en';

export interface DailyRecommendationEntry {
  id: string;
  slug: string;
  image: string;
  title: Record<DailyRecommendationLocale, string>;
  description: Record<DailyRecommendationLocale, string>;
  eyebrow: Record<DailyRecommendationLocale, string>;
  action: Record<DailyRecommendationLocale, string>;
}

export const DAILY_RECOMMENDATION_POOL: readonly DailyRecommendationEntry[] = [
  {
    id: 'google-snake',
    slug: 'google-snake',
    image: '/game-screenshots/google-snake.png',
    title: { zh: 'Google Snake', en: 'Google Snake' },
    description: {
      zh: '快速开始一局，熟悉转向、加速和高分节奏。',
      en: 'Start a quick round and practice turns, speed, and high-score rhythm.',
    },
    eyebrow: { zh: '短局挑战', en: 'Short challenge' },
    action: { zh: '开始游玩', en: 'Play now' },
  },
  {
    id: 'ovo',
    slug: 'ovo',
    image: '/game-screenshots/ovo.png',
    title: { zh: 'OvO', en: 'OvO' },
    description: {
      zh: '用滑铲、蹬墙跳和俯冲跳练习精准平台操作。',
      en: 'Practice precise platforming with slides, wall jumps, and dive jumps.',
    },
    eyebrow: { zh: '精准跑酷', en: 'Precision parkour' },
    action: { zh: '打开游戏', en: 'Open game' },
  },
  {
    id: 'drive-mad',
    slug: 'drive-mad',
    image: '/game-screenshots/drive-mad.png',
    title: { zh: 'Drive Mad', en: 'Drive Mad' },
    description: {
      zh: '用更轻的油门和提前刹车处理翻车、桥梁与跳跃。',
      en: 'Use lighter throttle and earlier braking for flips, bridges, and jumps.',
    },
    eyebrow: { zh: '物理驾驶', en: 'Physics driving' },
    action: { zh: '继续挑战', en: 'Keep playing' },
  },
  {
    id: 'solitaire',
    slug: 'solitaire',
    image: '/game-screenshots/solitaire.png',
    title: { zh: 'Solitaire', en: 'Solitaire' },
    description: {
      zh: '不用注册，打开浏览器就能开始一局经典纸牌。',
      en: 'Start a classic card round in the browser with no sign-up required.',
    },
    eyebrow: { zh: '轻量休息', en: 'Easy break' },
    action: { zh: '开始一局', en: 'Start a round' },
  },
];

function hashDateKey(dateKey: string) {
  return Array.from(dateKey).reduce(
    (total, character, index) => total + character.charCodeAt(0) * (index + 1),
    0,
  );
}

export function getDailyRecommendation(
  dateKey: string,
  excludeSlug?: string,
): DailyRecommendationEntry {
  const candidates = DAILY_RECOMMENDATION_POOL.filter((entry) => entry.slug !== excludeSlug);
  const available = candidates.length > 0 ? candidates : DAILY_RECOMMENDATION_POOL;
  return available[hashDateKey(dateKey) % available.length] ?? DAILY_RECOMMENDATION_POOL[0];
}

export function getShanghaiDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}
