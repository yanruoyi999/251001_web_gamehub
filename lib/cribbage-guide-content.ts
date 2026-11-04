import type { Locale } from '@/i18n/config';
import type {
  SeoLandingPage,
  SeoLandingSection,
} from '@/lib/seo-landing-content';

type Localized = Record<Locale, string>;
export type CribbageCard = {
  readonly rank: number;
  readonly suit: 'C' | 'D' | 'H' | 'S';
};
export type CribbageCell = number | 'na' | Localized;
export type CribbageChartRow = {
  id: string;
  label: Localized;
  hand: CribbageCell;
  crib: CribbageCell;
  pegging: CribbageCell;
};

export const CRIBBAGE_SOURCES = {
  index: 'https://www.cribbage.org/NewSite/rules/default.asp',
  rules: 'https://www.cribbage.org/NewSite/rules/rulebook_2025.pdf',
  crossCheck: 'https://www.cribbage.org/NewSite/about/ScoringCheatSheet.pdf',
} as const;

// Fixed, original examples only. This module does not calculate a player's hand.
export const CRIBBAGE_EXAMPLES = {
  flush: {
    held: [
      { rank: 1, suit: 'H' },
      { rank: 3, suit: 'H' },
      { rank: 7, suit: 'H' },
      { rank: 13, suit: 'H' },
    ],
    starter: { rank: 12, suit: 'C' },
    matchingStarter: { rank: 12, suit: 'H' },
    hand: 4,
    crib: 0,
    matchingHand: 5,
    matchingCrib: 5,
  },
  doubleRun: {
    held: [
      { rank: 2, suit: 'C' },
      { rank: 3, suit: 'D' },
      { rank: 3, suit: 'H' },
      { rank: 4, suit: 'S' },
    ],
    starter: { rank: 1, suit: 'C' },
    runs: 8,
    pairs: 2,
    total: 10,
  },
  pegging: { ranks: [6, 4, 5, 3], scores: [5, 4] },
  endings: {
    lead: [12, 9, 8],
    blocked: 6,
    to31: 4,
    toGo: 7,
    thirtyOne: 2,
    below31: 1,
  },
  twentyNine: {
    held: [
      { rank: 5, suit: 'C' },
      { rank: 5, suit: 'D' },
      { rank: 5, suit: 'H' },
      { rank: 11, suit: 'S' },
    ],
    starter: { rank: 5, suit: 'S' },
    fifteenCombinations: 8,
    fifteens: 16,
    pairs: 12,
    nobs: 1,
    total: 29,
  },
} as const satisfies {
  flush: {
    held: readonly CribbageCard[];
    starter: CribbageCard;
    matchingStarter: CribbageCard;
    hand: number;
    crib: number;
    matchingHand: number;
    matchingCrib: number;
  };
  doubleRun: {
    held: readonly CribbageCard[];
    starter: CribbageCard;
    runs: number;
    pairs: number;
    total: number;
  };
  pegging: { ranks: readonly number[]; scores: readonly number[] };
  endings: {
    lead: readonly number[];
    blocked: number;
    to31: number;
    toGo: number;
    thirtyOne: number;
    below31: number;
  };
  twentyNine: {
    held: readonly CribbageCard[];
    starter: CribbageCard;
    fifteenCombinations: number;
    fifteens: number;
    pairs: number;
    nobs: number;
    total: number;
  };
};

const perFifteen = { en: '2 per distinct combination', zh: '每种不同组合2分' };
const perRunCard = { en: '1 per card', zh: '每张1分' };
export const CRIBBAGE_CHART_ROWS: readonly CribbageChartRow[] = [
  {
    id: 'fifteen',
    label: { en: 'Fifteen', zh: '合计15' },
    hand: perFifteen,
    crib: perFifteen,
    pegging: { en: 'Count exactly 15: 2', zh: '当前累计恰好15：2分' },
  },
  {
    id: 'pair',
    label: { en: 'Pair', zh: '对子' },
    hand: 2,
    crib: 2,
    pegging: 2,
  },
  {
    id: 'three-kind',
    label: { en: 'Three of a kind', zh: '三同点' },
    hand: 6,
    crib: 6,
    pegging: 6,
  },
  {
    id: 'four-kind',
    label: { en: 'Four of a kind', zh: '四同点' },
    hand: 12,
    crib: 12,
    pegging: 12,
  },
  {
    id: 'run',
    label: { en: 'Run of 3 or more ranks', zh: '至少三张的顺子' },
    hand: perRunCard,
    crib: perRunCard,
    pegging: perRunCard,
  },
  {
    id: 'flush-four',
    label: { en: 'Four-card flush', zh: '四张同花' },
    hand: 4,
    crib: 0,
    pegging: 'na',
  },
  {
    id: 'flush-five',
    label: { en: 'Five-card flush', zh: '五张同花' },
    hand: 5,
    crib: 5,
    pegging: 'na',
  },
  {
    id: 'nobs',
    label: {
      en: 'Nobs: held J matches starter suit',
      zh: 'Nobs：所持J与起始牌同花',
    },
    hand: 1,
    crib: 1,
    pegging: 'na',
  },
  {
    id: 'thirty-one',
    label: { en: 'Count exactly 31', zh: '累计恰好31' },
    hand: 'na',
    crib: 'na',
    pegging: 2,
  },
  {
    id: 'last',
    label: { en: 'Sequence ends below 31', zh: '本段结束且未到31' },
    hand: 'na',
    crib: 'na',
    pegging: { en: 'Last player: 1', zh: '最后出牌者：1分' },
  },
];

export const CRIBBAGE_RUN_SHORTCUTS = [
  {
    label: { en: 'Double three-card run', zh: '双三张顺子' },
    runs: 2,
    length: 3,
    pairPoints: [2],
    total: 8,
  },
  {
    label: { en: 'Double four-card run', zh: '双四张顺子' },
    runs: 2,
    length: 4,
    pairPoints: [2],
    total: 10,
  },
  {
    label: { en: 'Triple three-card run', zh: '三组三张顺子' },
    runs: 3,
    length: 3,
    pairPoints: [6],
    total: 15,
  },
  {
    label: { en: 'Double-double run', zh: '两组对子形成四组三张顺子' },
    runs: 4,
    length: 3,
    pairPoints: [2, 2],
    total: 16,
  },
] as const;

export const CRIBBAGE_CHART_NOTES: Record<Locale, readonly string[]> = {
  en: [
    'A = 1; J, Q and K = 10 for totals. Ranks stay distinct, with ace low. Hand and crib each use four held cards plus the starter; the starter is excluded from pegging.',
    'Hand/crib: count each distinct fifteen and each longest run combination. Cards may be reused across combinations; do not add shorter runs inside a longer one.',
    'A four-card hand flush needs all four held cards in one suit; three held cards plus the starter is not enough. A crib flush needs all five cards in one suit.',
    'Pegging pairs and runs must end with the card just played and use consecutive plays since the count reset. Run ranks may arrive in any order; skip no intervening card. There are no pegging flushes, nobs or multiple-run shortcuts.',
    'Saying go earns no point by itself. The other player continues every legal play. The last player below 31 gets 1; reaching 31 gets 2. Do not add go or last-card points again to the same ending card. Independent pair/run points can still be added.',
    'Heels is separate: a J starter gives the dealer 2 at the turn, outside hand/crib totals. It is not nobs. Show order: nondealer hand → dealer hand → dealer crib. A zero-point hand scores 0, not the nickname “19”.',
  ],
  zh: [
    '合计点数时A = 1，J、Q、K = 10；牌阶仍各不相同，A最低。手牌与庄家底牌均为原有四张加共享起始牌；起始牌不参与出牌阶段。',
    '手牌与底牌：每种不同的15组合分别计分，只计最长顺子的每种组合。同一张牌可用于不同组合；长顺子内的较短顺子不能再计。',
    '手牌四张同花要求原有四张全同花，三张加起始牌不够；底牌必须五张全同花才得分。',
    '出牌对子与顺子必须以刚出的牌结尾，并取自本次累计重置后的连续出牌。顺子可乱序，但不能跳过中间牌。出牌没有同花、nobs或多重顺子快捷分。',
    '喊go本身不得分；对方继续出所有可合法出的牌。本段最后出牌者未到31得1，恰好31得2；同一张结束牌不能再叠加go或最终一张奖励。独立的对子、顺子等组合分仍可加。',
    'Heels另算：起始牌翻出J，庄家当时加2，不计入手牌或底牌总分，也不是nobs。摊牌顺序：非庄家手牌→庄家手牌→庄家底牌。真正零分记0，不能把俗称“19”记作19分。',
  ],
};

function cards(held: readonly CribbageCard[]) {
  const suits = { C: '♣', D: '♦', H: '♥', S: '♠' };
  return held
    .map(
      card =>
        `${({ 1: 'A', 11: 'J', 12: 'Q', 13: 'K' } as Record<number, string>)[card.rank] ?? card.rank}${suits[card.suit]}`
    )
    .join(' ');
}

function workedExamples(locale: Locale): SeoLandingSection[] {
  const {
    flush: f,
    doubleRun: d,
    pegging: p,
    endings: e,
    twentyNine: t,
  } = CRIBBAGE_EXAMPLES;
  return locale === 'en'
    ? [
        {
          title: 'Example 1: a hand flush can be a zero-point crib',
          body: `Keep ${cards(f.held)}; starter ${cards([f.starter])}. There are no fifteens, pairs, runs or nobs: the hand scores ${f.hand}, but the same cards as a crib score ${f.crib}. Change only the starter to ${cards([f.matchingStarter])}: hand ${f.matchingHand}, crib ${f.matchingCrib}. The starter must join four already matching held cards for the fifth flush point.`,
        },
        {
          title: 'Example 2: the double four-card run totals 10',
          body: `Keep ${cards(d.held)}; starter ${cards([d.starter])}. Each 3 forms an A–2–3–4 run: two runs give ${d.runs}, and the pair gives ${d.pairs}, totaling ${d.total}. There are no other points. The shortcut includes that pair, so do not add it again. Likewise, three runs of three plus three pairs total 15; four runs of three plus two pairs total 16.`,
        },
        {
          title: 'Example 3: pegging runs need not arrive in order',
          body: `Play ${p.ranks.slice(0, 3).join(', ')} in the same count sequence. The 5 makes 15: fifteen 2 + run 3 = ${p.scores[0]}. The next card, ${p.ranks[3]}, makes 18 and a four-card run worth ${p.scores[1]}. Assume play continues: no last-card award is included. A starter is never part of this sequence.`,
        },
        {
          title: 'Example 4: go and 31 are alternatives',
          body: `P plays Q, D plays 9, P plays 8: count 27. D holds ${e.blocked} and says go. If P can play ${e.to31}, that makes 31 for ${e.thirtyOne}, not 3. Alternatively, if P has only ${e.toGo}, neither can play: P gets ${e.below31}, then the count resets. These are alternative local situations, not a complete deal. The final card of the whole pegging phase below 31 earns just 1; final 31 earns just 2, before independent combination points.`,
        },
        {
          title: 'Example 5: 29 includes nobs, not heels',
          body: `Keep ${cards(t.held)}; starter ${cards([t.starter])}. Four J-plus-5 choices and four choices of three fives give ${t.fifteenCombinations} fifteens for ${t.fifteens}. Six pairs give ${t.pairs}; the held J matches the starter suit for nobs ${t.nobs}. Total: ${t.fifteens} + ${t.pairs} + ${t.nobs} = ${t.total}. The starter is a 5, so there is no heels award. In another deal, turning a J gives the dealer 2; that starter J cannot itself be the held J for nobs.`,
        },
      ]
    : [
        {
          title: '例1：手牌同花，放在底牌却是零分',
          body: `保留${cards(f.held)}，起始牌${cards([f.starter])}。没有15、对子、顺子或nobs：手牌得${f.hand}，同样五张若为底牌则得${f.crib}。只把起始牌改为${cards([f.matchingStarter])}，手牌${f.matchingHand}、底牌${f.matchingCrib}。第五张同花分的前提，是原有四张已经全同花。`,
        },
        {
          title: '例2：双四张顺子合计10分',
          body: `保留${cards(d.held)}，起始牌${cards([d.starter])}。两张3各组成一条A–2–3–4：两条顺子${d.runs}分，加对子${d.pairs}分，共${d.total}分，没有其他分。快捷分已含对子，不能再加。类似地，三条三张顺子加三组对子得15；四条三张顺子加两组对子得16。`,
        },
        {
          title: '例3：出牌顺子可以不按牌阶顺序出现',
          body: `同一段依次出${p.ranks.slice(0, 3).join('、')}。出5后累计15：合计15得2，加三张顺子3，共${p.scores[0]}分。接着出${p.ranks[3]}，累计18，延长为四张顺子，得${p.scores[1]}分。假设还会继续出牌，这里不含最后一张奖励；起始牌始终不参与。`,
        },
        {
          title: '例4：go与31是两种不同结局',
          body: `P出Q，D出9，P出8，累计27。D持${e.blocked}，只能喊go。若P可出${e.to31}，达到31，P得${e.thirtyOne}而非3。另一种情形，若P只剩${e.toGo}，双方都无法再出，P得${e.below31}，随后累计归零。这是两种局部备选情形，不是一副完整发牌。整个出牌阶段最终一张低于31只得1，最终31只得2；独立组合分另加。`,
        },
        {
          title: '例5：29分包含nobs，不含翻J奖励',
          body: `保留${cards(t.held)}，起始牌${cards([t.starter])}。J加任一5有四种，三个5的选法也有四种，共${t.fifteenCombinations}种15，得${t.fifteens}分；六组对子得${t.pairs}；所持J与起始牌同花，nobs得${t.nobs}。合计${t.fifteens} + ${t.pairs} + ${t.nobs} = ${t.total}。起始牌为5，没有heels。另一局若翻出J，庄家当时加2；起始牌J本身不能充当手里的nobs J。`,
        },
      ];
}

export const CRIBBAGE_GUIDE: SeoLandingPage = {
  slug: 'cribbage-scoring-chart',
  primaryKeyword: 'cribbage scoring chart',
  keywords: [
    'cribbage scoring chart',
    'cribbage hand scoring',
    'cribbage crib flush',
    'Cribbage计分表',
  ],
  updatedAt: '2026-11-04T00:00:00.000Z',
  documentationCheckedAt: '2026-11-04',
  indexable: true,
  relatedSlugs: ['spades-scoring', 'euchre-strategy', 'farkle-scoring'],
  locales: {
    en: {
      metaTitle: 'Cribbage Scoring Chart: Hand, Crib & Pegging + Print',
      metaDescription:
        'Compare hand, crib and pegging points in an original Cribbage scoring chart. Check flushes, runs, nobs, go and 31 with five worked examples and browser printing.',
      heading: 'Cribbage Scoring Chart',
      subheading:
        'Keep hand, crib and pegging points separate, then check the exceptions.',
      overview: [
        'Use this reference while counting a standard two-player, six-card-deal game. Keep four cards each; the dealer also counts the four-card crib. The chart distinguishes show scoring from points earned during play.',
        'The original HTML chart can be printed from your browser. Choose paper or Save as PDF in the print dialog if your browser offers it; page count depends on your settings.',
      ],
      quickAnswerLink: {
        href: CRIBBAGE_SOURCES.rules,
        label: 'ACC 2025 Tournament Rules (PDF)',
        description:
          'Rulebook used for this reference; edition and exceptions are explained below.',
      },
      sections: [
        {
          title: 'Quick answer: fifteens and pairs score 2',
          body: 'In hand and crib, each distinct fifteen scores 2, each pair 2, three of a kind 6, four of a kind 12, and each card in a run of at least three scores 1. A hand flush can score 4 or 5; a crib flush requires all five cards and scores 5. Nobs adds 1 for a held J matching the starter suit. Pegging uses the running count: exactly 15 scores 2, exactly 31 scores 2, and a sequence ending below 31 gives its last player 1.',
        },
        ...workedExamples('en'),
        {
          title: 'How to use and print this reference',
          body: 'Use the scoring chart for the current context, then check the multiple-run shortcuts and notes. Browser-menu printing works without JavaScript. The print scope contains the two tables, exceptions and source/edition notes; the longer examples stay on screen. This is an original rules reference, not a playable Cribbage game or an automatic scorer.',
        },
        {
          title: 'Edition and source notes',
          body: 'Documentation checked 2026-11-04 against ACC 2025 Tournament Rules, especially sections 1.3, 1.5–1.7, 6.3, 7.1–7.2, 8.2 and 9.2–9.3. The ACC cheat sheet was a numerical cross-check; the wording and layout here are original. This standard two-player guide is unaffiliated with ACC and is not a tournament adjudication guide. It makes no strategy, probability or record claim.',
        },
      ],
      recommendations: [],
      faqs: [
        {
          question: 'Does a four-card flush count in the crib?',
          answer:
            'No. A crib needs all four crib cards and the starter in one suit for 5. A hand scores 4 when its original four cards match suits, or 5 if the starter matches too; the starter plus only three held cards is not enough.',
        },
        {
          question: 'Does a double run already include the pair?',
          answer:
            'Yes. Double three-card runs total 8; double four-card runs 10; triple three-card runs 15; double-double runs 16. These totals include pairs. Add any separate fifteens, flush or nobs afterward.',
        },
        {
          question: 'Is go an extra point on top of 31?',
          answer:
            'No. Reaching 31 earns 2, without another go or last-card point for that ending card. Below 31, the last player gets 1 when the sequence ends. Saying go alone earns nothing.',
        },
        {
          question: 'What is the difference between nobs and heels?',
          answer:
            'Nobs is 1 in a hand or crib for a held J matching the starter suit. Heels is a separate 2 to the dealer when the starter itself is J. The starter is not a pegging card.',
        },
      ],
      externalLinks: [
        {
          href: CRIBBAGE_SOURCES.rules,
          label: 'ACC 2025 Tournament Rules',
          description: 'Primary rules: combinations, play and show scoring.',
        },
        {
          href: CRIBBAGE_SOURCES.index,
          label: 'ACC official rules index',
          description:
            'Entry point for checking the available rulebook edition.',
        },
        {
          href: CRIBBAGE_SOURCES.crossCheck,
          label: 'ACC scoring cheat sheet',
          description: 'Numerical cross-check, not reproduced as artwork here.',
        },
      ],
      ctaLabel: 'Browse browser games',
      ctaDescription:
        'Explore Luma’s browser-game catalogue, or use the related guides for other physical card and dice games.',
    },
    zh: {
      metaTitle: 'Cribbage计分速查表：手牌、底牌与出牌阶段，可打印',
      metaDescription:
        '用原创Cribbage计分表区分手牌、庄家底牌与出牌阶段，核对同花、多重顺子、nobs、go及31；含五个完整示例，支持浏览器打印。',
      heading: 'Cribbage计分速查表',
      subheading: '先分清手牌、庄家底牌与出牌阶段，再核对例外。',
      overview: [
        '本表适用于标准双人、每人发六张的Cribbage。每人保留四张，庄家另计四张底牌；摊牌计分与出牌阶段的分数分别查看。',
        '这是一份原创HTML参考表，可以通过浏览器打印。打印对话框若提供纸张打印或另存为PDF，可自行选择；页数随浏览器与设置而变。',
      ],
      quickAnswerLink: {
        href: CRIBBAGE_SOURCES.rules,
        label: 'ACC 2025锦标赛规则PDF',
        description: '本表采用的规则书；版本与例外见下方说明。',
      },
      sections: [
        {
          title: '简答：每种15与每组对子各得2分',
          body: '手牌与底牌中，每种不同的15得2，每组对子2，三同点6，四同点12；至少三张的顺子每张1分。手牌同花可得4或5，底牌必须五张全同花才得5。所持J与起始牌同花，nobs加1。出牌阶段按当前累计：恰好15得2，恰好31得2；本段结束且未到31，最后出牌者得1。',
        },
        ...workedExamples('zh'),
        {
          title: '如何查表与打印',
          body: '先选择当前计分情境，再查多重顺子快捷分和例外说明。浏览器菜单打印不依赖JavaScript。打印范围包含两张表、例外及来源版本说明；较长的示例保留在屏幕页面。这是原创规则参考，不是Cribbage在线游戏或自动计分器。',
        },
        {
          title: '版本与来源说明',
          body: '资料核查日期2026-11-04，依据ACC 2025锦标赛规则，重点为1.3、1.5–1.7、6.3、7.1–7.2、8.2及9.2–9.3节。ACC速查表仅供数值交叉核对，本文措辞与版式均为原创。本页限标准双人规则，与ACC无合作关联，不是锦标赛裁判手册，也不作策略、概率或纪录主张。',
        },
      ],
      recommendations: [],
      faqs: [
        {
          question: '底牌四张同花得分吗？',
          answer:
            '不得分。庄家底牌必须原有四张及起始牌五张全同花才得5。手牌原有四张同花得4，起始牌也同花才得5；三张手牌加起始牌不够。',
        },
        {
          question: '双顺子快捷分已经包含对子吗？',
          answer:
            '包含。双三张顺子8，双四张顺子10，三组三张顺子15，两组对子形成四组三张顺子16。不能再加同一组对子；其他15、同花、nobs另算。',
        },
        {
          question: '达到31以后还加go的1分吗？',
          answer:
            '不加。恰好31得2，同一张结束牌不再加go或最终一张分。低于31结束时，最后出牌者得1；喊go本身不得分。',
        },
        {
          question: 'Nobs与heels有什么不同？',
          answer:
            'Nobs是手牌或底牌中所持J与起始牌同花，得1。Heels是起始牌本身翻出J，庄家另加2。起始牌不用于出牌阶段。',
        },
      ],
      externalLinks: [
        {
          href: CRIBBAGE_SOURCES.rules,
          label: 'ACC 2025锦标赛规则',
          description: '主要规则来源：组合、出牌与摊牌计分。',
        },
        {
          href: CRIBBAGE_SOURCES.index,
          label: 'ACC官方规则目录',
          description: '核对现有规则书版本的入口。',
        },
        {
          href: CRIBBAGE_SOURCES.crossCheck,
          label: 'ACC计分快捷表',
          description: '仅作数值交叉核对，未复制其图片或版式。',
        },
      ],
      ctaLabel: '浏览浏览器游戏',
      ctaDescription:
        '探索Luma浏览器游戏目录，或阅读相关指南了解其他实体纸牌与骰子游戏。',
    },
  },
};
