export type DailyRecommendationLocale = 'zh' | 'en';

export interface DailyRecommendationEntry {
  id: string;
  gameId: number;
  slug: string;
  image: string;
  title: Record<DailyRecommendationLocale, string>;
  description: Record<DailyRecommendationLocale, string>;
  eyebrow: Record<DailyRecommendationLocale, string>;
  action: Record<DailyRecommendationLocale, string>;
}

// Keep retention inventory first-party/self-hosted only. Third-party catalogue
// records can be discussed editorially, but they must not re-enter a playable
// recommendation surface while their embed/media rights remain unverified.
export const DAILY_RECOMMENDATION_POOL: readonly DailyRecommendationEntry[] = [
  {
    id: '2-player-unblocked',
    gameId: 0,
    slug: '2-player-unblocked',
    image: '/og-gamehub.svg',
    title: { zh: '双人同键盘小游戏', en: 'Same-keyboard 2 Player Games' },
    description: {
      zh: '三款 Luma 自托管双人浏览器游戏，来源与许可记录明确。',
      en: 'Three Luma-hosted two-player browser games with documented provenance and license records.',
    },
    eyebrow: { zh: 'Luma 自托管', en: 'Luma self-hosted' },
    action: { zh: '一起玩', en: 'Play together' },
  },
  {
    id: 'spend-bill-gates-money',
    gameId: 0,
    slug: 'spend-bill-gates-money',
    image: '/og/spend-bill-gates-money',
    title: { zh: '花光比尔·盖茨的钱', en: 'Spend Bill Gates Money' },
    description: {
      zh: '用买入、撤销和消费分类，体验一场完全原创的1000亿美元模拟。',
      en: 'Use buy, remove, and spending categories in Luma’s original $100 billion simulator.',
    },
    eyebrow: { zh: 'Luma 原创', en: 'Luma original' },
    action: { zh: '开始消费', en: 'Start spending' },
  },
  {
    id: 'snake-3d',
    gameId: 0,
    slug: 'snake-3d',
    image: '/og-gamehub.svg',
    title: { zh: 'Luma Snake 3D', en: 'Luma Snake 3D' },
    description: {
      zh: '支持键盘与触控的原创 3D 贪吃蛇，包含 UTC 每日挑战和本地最高分。',
      en: 'A Luma-original keyboard-and-touch 3D snake challenge with UTC daily boards and local high scores.',
    },
    eyebrow: { zh: 'Luma 原创', en: 'Luma original' },
    action: { zh: '开始挑战', en: 'Start a run' },
  },
];

function hashDateKey(dateKey: string) {
  return Array.from(dateKey).reduce(
    (total, character, index) => total + character.charCodeAt(0) * (index + 1),
    0
  );
}

export function getDailyRecommendation(
  dateKey: string,
  excludeSlug?: string
): DailyRecommendationEntry {
  return (
    getDailyRecommendations(dateKey, excludeSlug, 1)[0] ??
    DAILY_RECOMMENDATION_POOL[0]
  );
}

export function getDailyRecommendations(
  dateKey: string,
  excludeSlug?: string,
  limit = 3
): DailyRecommendationEntry[] {
  const candidates = DAILY_RECOMMENDATION_POOL.filter(
    entry => entry.slug !== excludeSlug
  );
  const available =
    candidates.length > 0 ? candidates : DAILY_RECOMMENDATION_POOL;
  const requestedCount = Math.max(
    1,
    Math.min(Math.floor(limit), available.length)
  );
  const startIndex = hashDateKey(dateKey) % available.length;

  return Array.from(
    { length: requestedCount },
    (_, offset) => available[(startIndex + offset) % available.length]
  ).filter((entry): entry is DailyRecommendationEntry => Boolean(entry));
}

export function getShanghaiDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}
