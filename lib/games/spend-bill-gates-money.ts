export type SpendGameLocale = 'zh' | 'en';

export interface LocalizedText {
  zh: string;
  en: string;
}

export type ProductCategory = 'luxury' | 'power' | 'world' | 'viral';
export type FeedbackLevel = 'normal' | 'epic' | 'legendary';
export type BillionaireStyle =
  | 'chaos'
  | 'luxury'
  | 'empire'
  | 'world-changer'
  | 'visionary';

export interface Product {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  price: number;
  emoji: string;
  category: ProductCategory;
  feedback: FeedbackLevel;
  toast?: LocalizedText;
}

export interface Purchase {
  productId: string;
  count: number;
}

export const INITIAL_WEALTH = 100_000_000_000;

export const PRODUCTS: Product[] = [
  {
    id: 'private-jet',
    name: { zh: '私人飞机', en: 'Private Jet' },
    description: {
      zh: '随时飞往世界任何地方，不再等待商业航班。',
      en: 'Fly anywhere in the world without waiting for a commercial flight.',
    },
    price: 75_000_000,
    emoji: '✈️',
    category: 'luxury',
    feedback: 'normal',
  },
  {
    id: 'super-yacht',
    name: { zh: '超级游艇', en: 'Super Yacht' },
    description: {
      zh: '把一座漂浮豪宅开向你想去的海岸。',
      en: 'Take a floating mansion to any coastline you choose.',
    },
    price: 300_000_000,
    emoji: '🛥️',
    category: 'luxury',
    feedback: 'normal',
  },
  {
    id: 'private-island',
    name: { zh: '私人岛屿', en: 'Private Island' },
    description: {
      zh: '拥有一片没有邻居、只属于你的热带天堂。',
      en: 'Own a tropical paradise with no neighbors and no checkout time.',
    },
    price: 150_000_000,
    emoji: '🏝️',
    category: 'luxury',
    feedback: 'normal',
  },
  {
    id: 'luxury-mansion',
    name: { zh: '豪华庄园', en: 'Luxury Mansion' },
    description: {
      zh: '用无尽房间、花园和景观打造梦想住所。',
      en: 'Build a dream home with endless rooms, gardens, and views.',
    },
    price: 100_000_000,
    emoji: '🏰',
    category: 'luxury',
    feedback: 'normal',
  },
  {
    id: 'supercar-collection',
    name: { zh: '超跑收藏', en: 'Supercar Collection' },
    description: {
      zh: '一次收藏世界上最稀有、最快的汽车。',
      en: 'Collect the rarest and fastest cars in the world at once.',
    },
    price: 25_000_000,
    emoji: '🏎️',
    category: 'luxury',
    feedback: 'normal',
  },
  {
    id: 'climate-research',
    name: { zh: '资助气候研究', en: 'Fund Climate Research' },
    description: {
      zh: '支持清洁能源、气候建模和长期解决方案。',
      en: 'Back clean energy, climate modeling, and long-term solutions.',
    },
    price: 2_000_000_000,
    emoji: '🌍',
    category: 'world',
    feedback: 'normal',
  },
  {
    id: 'nba-team',
    name: { zh: '买下一支 NBA 球队', en: 'Buy an NBA Team' },
    description: {
      zh: '从场边座位升级为职业篮球队老板。',
      en: 'Upgrade from courtside seats to owning a professional basketball team.',
    },
    price: 4_000_000_000,
    emoji: '🏀',
    category: 'power',
    feedback: 'epic',
  },
  {
    id: 'football-club',
    name: { zh: '买下一家足球俱乐部', en: 'Buy a Football Club' },
    description: {
      zh: '掌控一支球队，建设属于你的冠军王朝。',
      en: 'Take control of a club and build your own championship dynasty.',
    },
    price: 1_500_000_000,
    emoji: '⚽',
    category: 'power',
    feedback: 'epic',
  },
  {
    id: 'skyscraper',
    name: { zh: '建造摩天大楼', en: 'Build a Skyscraper' },
    description: {
      zh: '让你的名字永久出现在一座城市的天际线上。',
      en: 'Put your name permanently on a city skyline.',
    },
    price: 1_000_000_000,
    emoji: '🏙️',
    category: 'power',
    feedback: 'epic',
  },
  {
    id: 'space-program',
    name: { zh: '启动太空计划', en: 'Launch a Space Program' },
    description: {
      zh: '资助火箭、任务控制中心和下一次深空探索。',
      en: 'Fund rockets, mission control, and the next deep-space expedition.',
    },
    price: 10_000_000_000,
    emoji: '🚀',
    category: 'power',
    feedback: 'epic',
  },
  {
    id: 'schools',
    name: { zh: '建造 100 所学校', en: 'Build 100 Schools' },
    description: {
      zh: '为更多学生提供教室、教师和长期机会。',
      en: 'Give more students classrooms, teachers, and long-term opportunity.',
    },
    price: 1_000_000_000,
    emoji: '🏫',
    category: 'world',
    feedback: 'epic',
  },
  {
    id: 'hospitals',
    name: { zh: '建造医院', en: 'Build Hospitals' },
    description: {
      zh: '改善多个社区的医疗设施和救治能力。',
      en: 'Expand medical facilities and lifesaving care across communities.',
    },
    price: 5_000_000_000,
    emoji: '🏥',
    category: 'world',
    feedback: 'epic',
  },
  {
    id: 'golden-toilet',
    name: { zh: '黄金马桶', en: 'Golden Toilet' },
    description: {
      zh: '把日常生活中最普通的东西做得极其离谱。',
      en: 'Turn the most ordinary daily object into something completely absurd.',
    },
    price: 1_000_000,
    emoji: '🚽',
    category: 'viral',
    feedback: 'legendary',
    toast: {
      zh: '一百万美元的马桶？这……很有想法。',
      en: 'A $1 MILLION TOILET? Respectfully... why?',
    },
  },
  {
    id: 'personal-chefs',
    name: { zh: '雇佣一万名私人厨师', en: 'Hire 10,000 Personal Chefs' },
    description: {
      zh: '再也不用决定晚饭吃什么，只需要决定让谁来做。',
      en: 'Never decide what to cook again—only which chef should make it.',
    },
    price: 500_000_000,
    emoji: '👨‍🍳',
    category: 'viral',
    feedback: 'legendary',
    toast: {
      zh: '你的厨师团队比某些餐厅还大。',
      en: 'You officially have more chefs than some restaurants.',
    },
  },
  {
    id: 'moon-crater',
    name: { zh: '命名一个月球陨石坑', en: 'Name a Moon Crater' },
    description: {
      zh: '把你的名字留在一个几乎不会改变的世界上。',
      en: 'Leave your name on a world that will barely change.',
    },
    price: 5_000_000_000,
    emoji: '🌙',
    category: 'viral',
    feedback: 'legendary',
    toast: {
      zh: '你的名字可能比人类文明更长久。',
      en: 'Your name may last longer than humanity.',
    },
  },
];

export const BILLIONAIRE_STYLE_COPY: Record<
  BillionaireStyle,
  { label: LocalizedText; description: LocalizedText; emoji: string }
> = {
  chaos: {
    label: { zh: '混沌富豪', en: 'Chaos Billionaire' },
    description: {
      zh: '你有自己的计划，但没人能预测下一笔钱会花在哪里。',
      en: 'You have a plan. Nobody else can predict what it is.',
    },
    emoji: '🌀',
  },
  luxury: {
    label: { zh: '奢华之王', en: 'Luxury King' },
    description: {
      zh: '你把财富变成自由、速度和毫不妥协的舒适。',
      en: 'You turn wealth into freedom, speed, and uncompromising comfort.',
    },
    emoji: '👑',
  },
  empire: {
    label: { zh: '帝国建造者', en: 'Empire Builder' },
    description: {
      zh: '你不满足于购买商品，而是想拥有能改变规则的资产。',
      en: 'You do not just buy things—you acquire assets that change the rules.',
    },
    emoji: '🏙️',
  },
  'world-changer': {
    label: { zh: '世界改变者', en: 'World Changer' },
    description: {
      zh: '你希望财富留下的不是账单，而是长期影响。',
      en: 'You want wealth to leave lasting impact, not just receipts.',
    },
    emoji: '🌍',
  },
  visionary: {
    label: { zh: '远见者', en: 'The Visionary' },
    description: {
      zh: '你的选择跨越享受、影响和大胆想象，不被一种身份限制。',
      en: 'Your choices mix enjoyment, impact, and bold imagination.',
    },
    emoji: '🔭',
  },
};

const PRODUCT_BY_ID = new Map(PRODUCTS.map((product) => [product.id, product]));

export function getProductById(productId: string): Product | undefined {
  return PRODUCT_BY_ID.get(productId);
}

export function upsertPurchase(purchases: Purchase[], productId: string): Purchase[] {
  if (!PRODUCT_BY_ID.has(productId)) return [...purchases];

  const existing = purchases.find((purchase) => purchase.productId === productId);
  if (!existing) {
    return [...purchases, { productId, count: 1 }];
  }

  return purchases.map((purchase) =>
    purchase.productId === productId
      ? { ...purchase, count: purchase.count + 1 }
      : { ...purchase },
  );
}

function validPurchaseCount(count: number): number {
  return Number.isInteger(count) && count > 0 ? count : 0;
}

export function calculateTotalSpent(purchases: Purchase[]): number {
  return purchases.reduce((total, purchase) => {
    const product = PRODUCT_BY_ID.get(purchase.productId);
    if (!product) return total;
    return total + product.price * validPurchaseCount(purchase.count);
  }, 0);
}

export function calculateRemainingWealth(purchases: Purchase[]): number {
  return Math.max(0, INITIAL_WEALTH - calculateTotalSpent(purchases));
}

export function getCategorySpend(
  purchases: Purchase[],
): Record<ProductCategory, number> {
  const categorySpend: Record<ProductCategory, number> = {
    luxury: 0,
    power: 0,
    world: 0,
    viral: 0,
  };

  for (const purchase of purchases) {
    const product = PRODUCT_BY_ID.get(purchase.productId);
    if (!product) continue;
    categorySpend[product.category] +=
      product.price * validPurchaseCount(purchase.count);
  }

  return categorySpend;
}

export function calculateBillionaireStyle(
  purchases: Purchase[],
): BillionaireStyle {
  if (
    purchases.some(
      (purchase) =>
        purchase.productId === 'golden-toilet' && validPurchaseCount(purchase.count) > 0,
    )
  ) {
    return 'chaos';
  }

  const categorySpend = getCategorySpend(purchases);
  const entries = Object.entries(categorySpend) as Array<[
    ProductCategory,
    number,
  ]>;
  const highestSpend = Math.max(...entries.map(([, spend]) => spend));

  if (highestSpend <= 0) return 'visionary';

  const leaders = entries.filter(([, spend]) => spend === highestSpend);
  if (leaders.length !== 1) return 'visionary';

  const winner = leaders[0][0];
  if (winner === 'luxury') return 'luxury';
  if (winner === 'power') return 'empire';
  if (winner === 'world') return 'world-changer';
  return 'visionary';
}

function trimCompactNumber(value: number): string {
  return value.toFixed(1).replace(/\.0$/, '');
}

export function formatCompactUsd(value: number, _locale: SpendGameLocale): string {
  const safeValue = Math.max(0, Math.round(value));
  if (safeValue >= 1_000_000_000) {
    return `$${trimCompactNumber(safeValue / 1_000_000_000)}B`;
  }
  if (safeValue >= 1_000_000) {
    return `$${trimCompactNumber(safeValue / 1_000_000)}M`;
  }
  if (safeValue >= 1_000) {
    return `$${trimCompactNumber(safeValue / 1_000)}K`;
  }
  return `$${safeValue}`;
}

export function formatFullUsd(value: number, locale: SpendGameLocale): string {
  return new Intl.NumberFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(value)));
}

export function getSpentBucket(spent: number): string {
  if (spent <= 0) return '0';
  if (spent < 1_000_000_000) return 'under_1b';
  if (spent < 10_000_000_000) return '1b_to_10b';
  if (spent < 50_000_000_000) return '10b_to_50b';
  return '50b_plus';
}
