import type { SeoLandingPage } from '@/lib/seo-landing-content';

export const golfCardValues = {
  A: 1, '2': -2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,
  '8': 8, '9': 9, '10': 10, J: 10, Q: 10, K: 0,
} as const;

type Rank = keyof typeof golfCardValues;
type GolfHand = readonly [Rank, Rank, Rank, Rank, Rank, Rank, Rank, Rank, Rank];

export const golfHands = [
  ['7', '4', '8', '7', '4', 'K', 'Q', '4', '2'],
  ['8', '8', '8', '3', 'K', '6', 'A', '2', '5'],
] as const satisfies readonly GolfHand[];

export function golfColumns(hand: GolfHand) {
  return [
    [hand[0], hand[3], hand[6]],
    [hand[1], hand[4], hand[7]],
    [hand[2], hand[5], hand[8]],
  ] as const;
}

export function scoreGolfHand(hand: GolfHand) {
  const columns = golfColumns(hand).map(([top, middle, bottom]) =>
    top === middle && middle === bottom
      ? 0
      : golfCardValues[top] + golfCardValues[middle] + golfCardValues[bottom]
  );
  return { columns, total: columns.reduce((sum, value) => sum + value, 0) };
}

const reference = 'https://www.pagat.com/draw/golf.html#nine';

export const NINE_CARD_GOLF_GUIDE: SeoLandingPage = {
  slug: '9-card-golf-rules',
  primaryKeyword: '9 card golf card game rules',
  keywords: ['9 card golf card game rules', 'nine card golf scoring', 'crazy nines card game'],
  updatedAt: '2026-11-19T00:00:00.000Z',
  documentationCheckedAt: '2026-11-19',
  indexable: false,
  relatedSlugs: ['golf-card-game-rules', 'cribbage-scoring-chart'],
  locales: {
    en: {
      metaTitle: 'Nine Card Golf Rules: Setup, Turns and Scoring Practice',
      metaDescription: 'Deal a 3×3 grid, learn when a column counts zero, and score two Nine Card Golf hands before seeing the worked answers.',
      heading: 'Nine Card Golf Rules and Scoring',
      subheading: 'Learn the 3×3 version of Crazy Nines and score two hands.',
      overview: [
        'Deal nine cards to each player. Use draws and swaps to lower the value of your layout. In this version, three matching ranks in a column score zero. The lowest combined score after nine deals wins.',
      ],
      sections: [
        {
          title: 'Set up a 3×3 grid',
          body: 'Shuffle at least two standard decks together without jokers. Deal nine cards face down to each player in three rows of three. Put the unused cards face down as the stock and turn its top card up to start the discard pile. Each player turns any three of their own cards face up.',
        },
        {
          title: 'Draw and swap',
          body: 'Start to the dealer’s left and play clockwise. Draw the top stock card or take the top discard. Swap the drawn card into either a face-up or a face-down slot, placing it face up and discarding the old card. Choose a hidden slot before seeing its card. A stock draw may be discarded immediately. A card taken from the discard pile has to be swapped in.',
        },
        {
          title: 'End the deal and score each column',
          body: 'In this version, the deal ends as soon as one player has all nine cards face up. Reveal the remaining hidden cards. A column of three cards of the same rank is worth zero, even a column of twos. Score all other cards individually. A is 1, a two is −2, J and Q are 10, K is 0, and 3 through 10 count at face value.',
        },
        {
          title: 'Agree on table variations before the deal',
          body: 'Some tables also cancel rows or diagonals, turn up just two cards at the start, or include jokers. The exercises use only vertical triples and the card values above.',
        },
      ],
      recommendations: [],
      faqs: [
        { question: 'Does a pair in one column cancel?', answer: 'In this nine-card version, the full column needs three matching ranks. A pair counts normally. Six-card Golf uses pairs.' },
        { question: 'Who wins after nine deals?', answer: 'Add each player’s nine scores. The player with the lowest total wins.' },
      ],
      externalLinks: [{ href: reference, label: 'Pagat’s Nine Card Golf rules', description: 'The basic setup, column rule, and common variants.' }],
      ctaLabel: 'Browse more games',
      ctaDescription: 'Explore other card games on Luma Game Hub.',
    },
    zh: {
      metaTitle: '九张 Golf 纸牌规则与计分练习',
      metaDescription: '用 3×3 牌阵学九张 Golf。了解发牌、摸牌和同列三张抵消，并在两手原创牌例中先算分再看解析。',
      heading: '九张 Golf 纸牌规则与计分',
      subheading: '学习 3×3 的 Crazy Nines 玩法，自己算两手牌。',
      overview: [
        '每人九张牌，靠摸牌和换牌降低分数。本版同一竖列三张点数相同就记零。打完九局，总分最低者获胜。',
      ],
      sections: [
        {
          title: '摆成三行三列',
          body: '用至少两副标准扑克牌，去掉大小王后一起洗牌。每人面朝下发九张，摆成三行三列。剩下的牌放桌中央当摸牌堆，翻开顶牌作为弃牌堆。每人任选自己的三张牌翻开。',
        },
        {
          title: '摸牌、换牌、弃牌',
          body: '从发牌人左手开始顺时针行动。轮到你时，取摸牌堆或弃牌堆的顶牌。用新牌换掉牌阵中的一张，正面朝上放入，把旧牌正面朝上弃掉。换暗牌要先选位置再看旧牌。摸到的牌可以直接弃掉，从弃牌堆拿的则必须换入牌阵。',
        },
        {
          title: '结束一局，按竖列结算',
          body: '本版有人九张全明时立即结束该局。翻开所有剩余暗牌。同一竖列三张点数相同，整列计零，三个 2 也计零。其余逐张计分，A＝1，2＝−2，J 和 Q＝10，K＝0，3 至 10 按牌面计分。',
        },
        {
          title: '发牌前约定桌规',
          body: '有的桌规也抵消横排或斜线，有的开局只翻两张，或加入大小王。下面的练习统一用竖列三张抵消和上面的分值。',
        },
      ],
      recommendations: [],
      faqs: [
        { question: '同一列只有两张相同能抵消吗？', answer: '九张版要三张同点数才抵消。只有两张照常计分。六张版用对子抵消。' },
        { question: '打满九局后谁赢？', answer: '分别加总每个人的九局分数，总分最低者获胜。' },
      ],
      externalLinks: [{ href: reference, label: 'Pagat 九张 Golf 规则', description: '可核对基础发牌、竖列计分和常见变体。' }],
      ctaLabel: '浏览更多游戏',
      ctaDescription: '在 Luma Game Hub 探索其他纸牌游戏。',
    },
  },
};
