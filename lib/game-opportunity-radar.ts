import type { Locale } from '@/i18n/config';

export type GameOpportunityPlatform = 'browser' | 'kk-y3' | 'roblox' | 'steam';
export type GameOpportunityTeam = 'solo' | 'small' | 'studio';
export type GameOpportunityBudget = 'starter' | 'lean' | 'funded' | 'studio';
export type GameOpportunityTimeline = '30d' | '60d' | '90d';
export type GameOpportunityGenre =
  | 'tower-defense'
  | 'roguelike'
  | 'simulator'
  | 'rpg'
  | 'mmorpg';

export interface GameOpportunityInput {
  platform: GameOpportunityPlatform;
  team: GameOpportunityTeam;
  budget: GameOpportunityBudget;
  timeline: GameOpportunityTimeline;
  genre: GameOpportunityGenre;
}

export type GameOpportunityBand = 'promising' | 'narrow-scope' | 'high-risk';

export interface GameOpportunityResult {
  score: number;
  band: GameOpportunityBand;
  bandLabel: string;
  scope: string;
  monetizationTest: string;
  risk: string;
  evidenceNext: string;
  disclaimer: string;
}

interface LocalizedOption<T extends string> {
  value: T;
  zh: string;
  en: string;
}

export const GAME_OPPORTUNITY_OPTIONS = {
  platform: [
    { value: 'browser', zh: '浏览器 / HTML5', en: 'Browser / HTML5' },
    { value: 'kk-y3', zh: 'KK / Y3 地图', en: 'KK / Y3 map' },
    { value: 'roblox', zh: 'Roblox', en: 'Roblox' },
    { value: 'steam', zh: 'Steam 独立游戏', en: 'Steam indie game' },
  ] satisfies LocalizedOption<GameOpportunityPlatform>[],
  team: [
    { value: 'solo', zh: '1 人', en: 'Solo' },
    { value: 'small', zh: '2–3 人', en: '2–3 people' },
    { value: 'studio', zh: '4 人以上', en: '4+ people' },
  ] satisfies LocalizedOption<GameOpportunityTeam>[],
  budget: [
    { value: 'starter', zh: '低于 ¥5,000 / $700', en: 'Under $700' },
    { value: 'lean', zh: '¥5,000–20,000 / $700–3,000', en: '$700–3,000' },
    { value: 'funded', zh: '¥20,000–70,000 / $3,000–10,000', en: '$3,000–10,000' },
    { value: 'studio', zh: '高于 ¥70,000 / $10,000', en: 'Over $10,000' },
  ] satisfies LocalizedOption<GameOpportunityBudget>[],
  timeline: [
    { value: '30d', zh: '30 天以内', en: 'Up to 30 days' },
    { value: '60d', zh: '31–60 天', en: '31–60 days' },
    { value: '90d', zh: '61–90 天', en: '61–90 days' },
  ] satisfies LocalizedOption<GameOpportunityTimeline>[],
  genre: [
    { value: 'tower-defense', zh: '轻塔防', en: 'Light tower defense' },
    { value: 'roguelike', zh: 'Roguelike 生存', en: 'Roguelike survival' },
    { value: 'simulator', zh: '模拟经营 / Tycoon', en: 'Simulator / tycoon' },
    { value: 'rpg', zh: '内容型 RPG', en: 'Content-heavy RPG' },
    { value: 'mmorpg', zh: '大型多人 RPG / MMO', en: 'Massively multiplayer RPG / MMO' },
  ] satisfies LocalizedOption<GameOpportunityGenre>[],
} as const;

const SCORE_WEIGHTS = {
  platform: {
    browser: 8,
    'kk-y3': 5,
    roblox: 3,
    steam: 0,
  },
  team: {
    solo: -4,
    small: 5,
    studio: 10,
  },
  budget: {
    starter: -8,
    lean: 2,
    funded: 8,
    studio: 12,
  },
  timeline: {
    '30d': -8,
    '60d': 2,
    '90d': 7,
  },
  genre: {
    'tower-defense': 8,
    roguelike: 6,
    simulator: 3,
    rpg: -3,
    mmorpg: -20,
  },
} as const;

function clampScore(score: number): number {
  return Math.max(20, Math.min(95, score));
}

function getBand(score: number): GameOpportunityBand {
  if (score >= 60) return 'promising';
  if (score >= 40) return 'narrow-scope';
  return 'high-risk';
}

function getBandLabel(band: GameOpportunityBand, locale: Locale): string {
  const labels: Record<GameOpportunityBand, Record<Locale, string>> = {
    promising: { zh: '适合进入小规模验证', en: 'Ready for a small validation' },
    'narrow-scope': { zh: '先缩小范围再验证', en: 'Narrow the scope first' },
    'high-risk': { zh: '当前组合风险过高', en: 'High-risk in its current form' },
  };

  return labels[band][locale];
}

function getScope(input: GameOpportunityInput, band: GameOpportunityBand, locale: Locale): string {
  if (input.genre === 'mmorpg') {
    return locale === 'zh'
      ? '不要直接做 MMO。先改成一个 10–15 分钟、单地图、少量玩家或离线可玩的战斗原型，只验证核心循环。'
      : 'Do not build the MMO first. Replace it with a 10–15 minute, one-map, offline or small-session combat prototype that tests only the core loop.';
  }

  if (band === 'high-risk') {
    return locale === 'zh'
      ? '只保留一个核心循环、一个场景、一个角色和一个明确结束条件；其余系统全部延后。'
      : 'Keep one core loop, one scene, one playable role, and one clear ending condition. Defer every other system.';
  }

  if (band === 'narrow-scope') {
    return locale === 'zh'
      ? '首版限制为一个核心循环、一张地图、两种内容变化和一个新手流程，先验证玩家会不会主动再玩一局。'
      : 'Limit the first release to one core loop, one map, two content variations, and one onboarding flow. First test whether players voluntarily start another session.';
  }

  return locale === 'zh'
    ? '首版做一个核心循环、一张地图、三种内容变化、一个新手流程和一个可测量的变现实验。'
    : 'Ship one core loop, one map, three content variations, one onboarding flow, and one measurable monetization experiment.';
}

function getMonetizationTest(platform: GameOpportunityPlatform, locale: Locale): string {
  const tests: Record<GameOpportunityPlatform, Record<Locale, string>> = {
    browser: {
      zh: '先验证重复游玩，再只测试一个支持者礼包、一次性高级解锁或无广告版本；不要同时堆广告、订阅和商城。',
      en: 'Validate repeat play first, then test only one supporter pack, one-time premium unlock, or ad-free version. Do not launch ads, subscriptions, and a store at once.',
    },
    'kk-y3': {
      zh: '先放一个低价、非强制的外观或支持者礼包，观察真实玩家是否在第二次游玩后购买。',
      en: 'Start with one low-priced, optional cosmetic or supporter bundle and observe whether real players buy after returning for another session.',
    },
    roblox: {
      zh: '只测试一种清楚标价的永久权益或可重复购买的小额消耗品，并记录付费前后的留存差异。',
      en: 'Test one clearly priced permanent benefit or one small repeat-purchase consumable, then compare retention before and after the purchase prompt.',
    },
    steam: {
      zh: '先用可玩演示、愿望单和完成率验证需求，再决定一次性售价；首版不要依赖复杂内购。',
      en: 'Validate demand with a playable demo, wishlists, and completion data before setting a one-time price. Do not make the first version depend on complex in-app purchases.',
    },
  };

  return tests[platform][locale];
}

function getRisk(input: GameOpportunityInput, locale: Locale): string {
  if (input.genre === 'mmorpg') {
    return locale === 'zh'
      ? 'MMO 会同时放大联网、内容量、经济系统、客服和持续运营成本，小团队最容易在上线前耗尽预算。'
      : 'MMO scope multiplies networking, content, economy, support, and live-operations costs, so a small team can exhaust its budget before launch.';
  }

  if (input.genre === 'rpg') {
    return locale === 'zh'
      ? '内容型 RPG 的主要风险不是基础代码，而是关卡、敌人、剧情、美术和数值内容持续膨胀。'
      : 'The main risk in a content-heavy RPG is not the base code; it is expanding levels, enemies, narrative, art, and balance work.';
  }

  if (input.timeline === '30d') {
    return locale === 'zh'
      ? '30 天窗口很短，任何第二玩法、复杂成长树或多人系统都会直接挤压测试时间。'
      : 'A 30-day window leaves little room for testing; a second game mode, complex progression tree, or multiplayer layer can consume the whole schedule.';
  }

  if (input.team === 'solo') {
    return locale === 'zh'
      ? '单人项目最大的风险是同时承担开发、内容、美术、测试和获客，必须提前砍掉非核心功能。'
      : 'A solo project must cover development, content, art, testing, and acquisition, so non-core features need to be cut early.';
  }

  return locale === 'zh'
    ? '最大的风险是把“能做出来”误当成“有人会持续玩并愿意付费”，上线前仍需要外部玩家验证。'
    : 'The largest risk is confusing “we can build it” with “players will return and pay.” External player evidence is still required before expansion.';
}

function getEvidenceNext(locale: Locale): string {
  return locale === 'zh'
    ? '下一步先拿到 10 次目标用户访谈、30 次合格落地页访问和至少 3 条明确的付费意向回复，再扩大开发范围。'
    : 'Next, collect 10 target-user conversations, 30 qualified landing-page visits, and at least 3 explicit payment-intent replies before expanding development.';
}

export function evaluateGameOpportunity(
  input: GameOpportunityInput,
  locale: Locale,
): GameOpportunityResult {
  const rawScore =
    55 +
    SCORE_WEIGHTS.platform[input.platform] +
    SCORE_WEIGHTS.team[input.team] +
    SCORE_WEIGHTS.budget[input.budget] +
    SCORE_WEIGHTS.timeline[input.timeline] +
    SCORE_WEIGHTS.genre[input.genre];
  const score = clampScore(rawScore);
  const band = getBand(score);

  return {
    score,
    band,
    bandLabel: getBandLabel(band, locale),
    scope: getScope(input, band, locale),
    monetizationTest: getMonetizationTest(input.platform, locale),
    risk: getRisk(input, locale),
    evidenceNext: getEvidenceNext(locale),
    disclaimer:
      locale === 'zh'
        ? '这是基于项目约束的 MVP 可交付性初筛，不是收入预测、市场需求证明或投资建议。'
        : 'This is an MVP delivery-fit screen based on project constraints, not a revenue forecast, proof of market demand, or investment advice.',
  };
}
