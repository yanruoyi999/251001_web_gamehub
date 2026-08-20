export const COUPLES_GAMES_PATH = '/games/online-games-for-couples';
export const DEFAULT_COUPLES_CHALLENGE_CODE = 'LUMA22';

export type CoupleGameSlug =
  | 'this-or-that-duo'
  | 'couple-match-quiz'
  | 'quick-couple-challenge';

export type LocalizedText = {
  en: string;
  zh: string;
};

export interface CouplePrompt {
  id: string;
  prompt: LocalizedText;
  options?: [LocalizedText, LocalizedText];
}

export interface CoupleGameDefinition {
  slug: CoupleGameSlug;
  title: LocalizedText;
  summary: LocalizedText;
  mode: 'choice' | 'match' | 'prompt';
  estimatedMinutes: number;
  prompts: CouplePrompt[];
}

const thisOrThatPrompts: CouplePrompt[] = [
  {
    id: 'sunrise-sunset',
    prompt: { en: 'Pick the better shared view.', zh: '选一个更想一起看的风景。' },
    options: [
      { en: 'Sunrise', zh: '日出' },
      { en: 'Sunset', zh: '日落' },
    ],
  },
  {
    id: 'city-nature',
    prompt: { en: 'Choose a weekend escape.', zh: '选一种周末出行。' },
    options: [
      { en: 'City break', zh: '城市短途' },
      { en: 'Nature trip', zh: '自然旅行' },
    ],
  },
  {
    id: 'sweet-savory',
    prompt: { en: 'Choose the snack table.', zh: '选一种零食桌。' },
    options: [
      { en: 'Sweet', zh: '甜口' },
      { en: 'Savory', zh: '咸口' },
    ],
  },
  {
    id: 'movie-game',
    prompt: { en: 'Choose tonight’s shared activity.', zh: '选今晚一起做的事。' },
    options: [
      { en: 'Watch a movie', zh: '看电影' },
      { en: 'Play a game', zh: '玩游戏' },
    ],
  },
  {
    id: 'plan-spontaneous',
    prompt: { en: 'How should a day out begin?', zh: '一天的约会怎么开始？' },
    options: [
      { en: 'Plan it', zh: '提前计划' },
      { en: 'Be spontaneous', zh: '临时决定' },
    ],
  },
  {
    id: 'cook-order',
    prompt: { en: 'Pick dinner mode.', zh: '选今晚的晚餐模式。' },
    options: [
      { en: 'Cook together', zh: '一起做饭' },
      { en: 'Order a favorite', zh: '点喜欢的外卖' },
    ],
  },
  {
    id: 'beach-mountains',
    prompt: { en: 'Choose a future trip.', zh: '选一次未来旅行。' },
    options: [
      { en: 'Beach', zh: '海边' },
      { en: 'Mountains', zh: '山里' },
    ],
  },
  {
    id: 'early-late',
    prompt: { en: 'Choose the easier shared schedule.', zh: '选一个更舒服的共同作息。' },
    options: [
      { en: 'Early start', zh: '早起开始' },
      { en: 'Late night', zh: '晚睡夜生活' },
    ],
  },
];

const matchQuizPrompts: CouplePrompt[] = [
  {
    id: 'free-hour',
    prompt: { en: 'If you both got one free hour, what sounds better?', zh: '如果突然多出一小时，更想做什么？' },
    options: [
      { en: 'Go somewhere', zh: '出去逛逛' },
      { en: 'Stay in', zh: '待在家里' },
    ],
  },
  {
    id: 'gift-style',
    prompt: { en: 'Which gift style feels more thoughtful?', zh: '哪种礼物更有心意？' },
    options: [
      { en: 'Useful', zh: '实用型' },
      { en: 'Sentimental', zh: '纪念型' },
    ],
  },
  {
    id: 'holiday-pace',
    prompt: { en: 'Choose a holiday pace.', zh: '选一种度假节奏。' },
    options: [
      { en: 'See everything', zh: '尽量多逛' },
      { en: 'Take it slow', zh: '慢慢放松' },
    ],
  },
  {
    id: 'photo-memory',
    prompt: { en: 'How should a great day be remembered?', zh: '美好的一天怎么留住？' },
    options: [
      { en: 'Take photos', zh: '多拍照片' },
      { en: 'Stay in the moment', zh: '专注当下' },
    ],
  },
  {
    id: 'surprise-choice',
    prompt: { en: 'Choose the better date format.', zh: '选一种更喜欢的约会形式。' },
    options: [
      { en: 'A surprise', zh: '惊喜安排' },
      { en: 'Choose together', zh: '一起决定' },
    ],
  },
  {
    id: 'conversation-silence',
    prompt: { en: 'What makes a quiet evening feel best?', zh: '安静的晚上更适合哪种状态？' },
    options: [
      { en: 'Long conversation', zh: '聊很久' },
      { en: 'Comfortable silence', zh: '舒服地安静相处' },
    ],
  },
  {
    id: 'new-familiar',
    prompt: { en: 'Pick the safer weekend choice.', zh: '周末更想怎么选？' },
    options: [
      { en: 'Try something new', zh: '尝试新东西' },
      { en: 'Repeat a favorite', zh: '重温喜欢的事' },
    ],
  },
];

const quickChallengePrompts: CouplePrompt[] = [
  {
    id: 'dream-trip',
    prompt: { en: 'In 30 seconds, each name one dream trip. Then compare.', zh: '30 秒内各说一个最想去的地方，然后比较。' },
  },
  {
    id: 'tiny-win',
    prompt: { en: 'Each name one small thing the other did recently that you appreciated.', zh: '各说一件最近对方做过、让你觉得很贴心的小事。' },
  },
  {
    id: 'perfect-snack',
    prompt: { en: 'Build a two-item snack combo together without repeating an ingredient.', zh: '一起组合两样零食，但不能选重复口味。' },
  },
  {
    id: 'three-words',
    prompt: { en: 'Describe your ideal shared weekend using only three words each.', zh: '每个人只用三个词描述理想周末。' },
  },
  {
    id: 'soundtrack',
    prompt: { en: 'Each pick one song for a shared road-trip playlist.', zh: '各选一首适合一起公路旅行的歌。' },
  },
  {
    id: 'future-meal',
    prompt: { en: 'Agree on one meal you would both like to learn to make.', zh: '一起决定一道未来想学会做的菜。' },
  },
  {
    id: 'mini-adventure',
    prompt: { en: 'Invent a two-hour mini adventure you could realistically do this month.', zh: '设计一个这个月真的能完成的两小时小冒险。' },
  },
  {
    id: 'laugh-memory',
    prompt: { en: 'Take turns retelling one shared moment that still makes you laugh.', zh: '轮流讲一个现在想起来还会笑的共同回忆。' },
  },
];

export const COUPLE_GAMES: CoupleGameDefinition[] = [
  {
    slug: 'this-or-that-duo',
    title: { en: 'This or That Duo', zh: '二选一默契局' },
    summary: {
      en: 'Answer the same quick choices separately, then reveal whether you matched.',
      zh: '两个人分别做同一组快速二选一，再揭晓答案是否一致。',
    },
    mode: 'choice',
    estimatedMinutes: 3,
    prompts: thisOrThatPrompts,
  },
  {
    slug: 'couple-match-quiz',
    title: { en: 'How Well Do You Match?', zh: '你们有多合拍？' },
    summary: {
      en: 'Compare preferences across a short round and finish with a simple match percentage.',
      zh: '通过一组生活偏好题比较选择，最后得到简单的匹配百分比。',
    },
    mode: 'match',
    estimatedMinutes: 4,
    prompts: matchQuizPrompts,
  },
  {
    slug: 'quick-couple-challenge',
    title: { en: 'Quick Couple Challenge', zh: '情侣快速挑战' },
    summary: {
      en: 'Work through short conversation and mini-action prompts together.',
      zh: '一起完成短对话和轻互动提示，适合快速破冰或异地同步玩。',
    },
    mode: 'prompt',
    estimatedMinutes: 5,
    prompts: quickChallengePrompts,
  },
];

const challengeAlphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function normalizeChallengeCode(value?: string | null): string {
  const cleaned = (value ?? '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 6);

  if (!cleaned) return DEFAULT_COUPLES_CHALLENGE_CODE;
  if (cleaned.length >= 6) return cleaned;

  return `${cleaned}${DEFAULT_COUPLES_CHALLENGE_CODE}`.slice(0, 6);
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

export function buildCouplePromptOrder(
  gameSlug: string,
  challengeCode: string,
): CouplePrompt[] {
  const game = COUPLE_GAMES.find((candidate) => candidate.slug === gameSlug);
  if (!game) return [];

  const normalizedCode = normalizeChallengeCode(challengeCode);
  const random = nextRandom(hashSeed(`${game.slug}:${normalizedCode}`));
  const prompts = [...game.prompts];

  for (let index = prompts.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [prompts[index], prompts[swapIndex]] = [prompts[swapIndex], prompts[index]];
  }

  return prompts;
}

export function createChallengeCode(seed: number): string {
  const random = nextRandom(seed >>> 0);
  let code = '';
  for (let index = 0; index < 6; index += 1) {
    code += challengeAlphabet[Math.floor(random() * challengeAlphabet.length)];
  }
  return code;
}
