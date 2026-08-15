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

export const DAILY_RECOMMENDATION_POOL: readonly DailyRecommendationEntry[] = [
  {
    id: 'google-snake',
    gameId: 80,
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
    id: 'drive-mad',
    gameId: 57,
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
    id: 'monkey-mart',
    gameId: 31,
    slug: 'monkey-mart',
    image: '/game-screenshots/monkey-mart.png',
    title: { zh: 'Monkey Mart', en: 'Monkey Mart' },
    description: {
      zh: '补货、收银并扩建摊位，保持商店循环顺畅。',
      en: 'Restock, check out customers, and expand while keeping the shop moving.',
    },
    eyebrow: { zh: '经营节奏', en: 'Management loop' },
    action: { zh: '经营商店', en: 'Run the shop' },
  },
  {
    id: 'cats-love-cake-2',
    gameId: 38,
    slug: 'cats-love-cake-2',
    image: '/game-screenshots/cats-love-cake-2.png',
    title: { zh: 'Cats Love Cake 2', en: 'Cats Love Cake 2' },
    description: {
      zh: '控制弹跳节奏，绕开障碍并把角色安全送到蛋糕旁。',
      en: 'Time each bounce, avoid hazards, and guide the character safely to the cake.',
    },
    eyebrow: { zh: '弹跳闯关', en: 'Bounce challenge' },
    action: { zh: '开始闯关', en: 'Start bouncing' },
  },
  {
    id: 'tunnel-rush',
    gameId: 189,
    slug: 'tunnel-rush',
    image: '/game-screenshots/tunnel-rush.png',
    title: { zh: 'Tunnel Rush', en: 'Tunnel Rush' },
    description: {
      zh: '快速识别障碍开口，在高速隧道中保持路线稳定。',
      en: 'Read obstacle openings quickly and hold a clean line through the tunnel.',
    },
    eyebrow: { zh: '反应挑战', en: 'Reaction challenge' },
    action: { zh: '进入隧道', en: 'Enter the tunnel' },
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
