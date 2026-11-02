import type { Locale } from '@/i18n/config';
import type {
  SeoLandingPage,
  SeoLandingSection,
} from '@/lib/seo-landing-content';

// Facts from the linked PlayMonster edition, with original labels and layout.
const scoringRows = [
  ['Single 1', '单个1', 100],
  ['Single 5', '单个5', 50],
  ['Three 1s', '三个1', 300],
  ['Three 2s', '三个2', 200],
  ['Three 3s', '三个3', 300],
  ['Three 4s', '三个4', 400],
  ['Three 5s', '三个5', 500],
  ['Three 6s', '三个6', 600],
  ['Four of a kind', '四个同点', 1000],
  ['Five of a kind', '五个同点', 2000],
  ['Six of a kind', '六个同点', 3000],
  ['Straight: 1, 2, 3, 4, 5, 6', '顺子：1、2、3、4、5、6', 1500],
  ['Three pairs', '三对', 1500],
  ['Four of a kind plus another pair', '四个同点加另一对', 1500],
  ['Two triplets', '两组三同点', 2500],
] as const;

/** Fixed original exercises only; no dice engine or optimal-selection claim. */
export const FARKLE_EXAMPLES = [
  {
    id: 'A',
    rolls: [[2, 2, 2, 5, 1, 6]],
    picks: [[0, 1, 2, 3, 4]],
    points: [350],
    turn: 350,
    banked: 0,
  },
  {
    id: 'B',
    rolls: [[2, 2, 2, 6, 6, 6]],
    picks: [[0, 1, 2, 3, 4, 5]],
    points: [2500],
    turn: 2500,
    banked: 0,
  },
  {
    id: 'C',
    rolls: [
      [5, 5, 2, 3, 4, 6],
      [5, 2, 3, 4],
    ],
    picks: [[0, 1], [0]],
    points: [100, 50],
    turn: 150,
    banked: 0,
  },
  {
    id: 'D',
    rolls: [
      [3, 3, 3, 1, 2, 6],
      [1, 5],
    ],
    picks: [
      [0, 1, 2, 3],
      [0, 1],
    ],
    points: [400, 150],
    turn: 550,
    banked: 0,
  },
  {
    id: 'E',
    rolls: [
      [1, 5, 2, 2, 4, 6],
      [2, 3, 4, 6],
    ],
    picks: [[0, 1], []],
    points: [150, 0],
    turn: 0,
    banked: 700,
  },
];
export const FARKLE_FINISH_EXAMPLE = {
  aBefore: 9400,
  aTurn: 650,
  aFinal: 10050,
  bBefore: 9100,
  bTurn: 1000,
  bFinal: 10100,
};

function exercises(locale: Locale): SeoLandingSection[] {
  const [a, b, c, d, e] = FARKLE_EXAMPLES;
  const f = FARKLE_FINISH_EXAMPLE;
  const dice = (example: typeof a, step = 0) => example.rolls[step].join(', ');
  if (locale === 'en')
    return [
      {
        title: 'Example A — a scoring roll below the entry threshold',
        body: `Roll ${dice(a)}. Select the three 2s, the 5 and the 1: 200 + 50 + 100 = ${a.turn} points. Leave the 6. If you have not entered the score sheet yet, you cannot bank ${a.turn}: the first bank requires at least 500 in one turn. Roll the remaining die to continue; a farkle would lose this turn’s points.`,
      },
      {
        title: 'Example B — two triplets use all six dice once',
        body: `Roll ${dice(b)} and select both triplets as the six-dice combination: ${b.turn} points. Do not add 200 + 600 again for the same dice. All six dice have scored, so you may roll all six again (hot dice), or bank because this turn already meets the entry threshold. Continuing is optional.`,
      },
      {
        title: 'Example C — separate throws cannot become a triple',
        body: `Already on the score sheet, roll ${dice(c)} and keep the two 5s for ${c.points[0]}. Roll the four remaining dice: ${dice(c, 1)}. Keep this new 5 for ${c.points[1]}. The turn has ${c.points[0]} + ${c.points[1]} = ${c.turn} points, which you may bank. The three 5s came from different throws, so they do not earn the 500-point triple.`,
      },
      {
        title: 'Example D — cross 500 before the first bank',
        body: `Not yet on the score sheet, roll ${dice(d)}. Keep the three 3s and the 1: 300 + 100 = ${d.points[0]}, too little for the first bank. Roll the remaining two dice: ${dice(d, 1)}. Keeping both adds 100 + 50 = ${d.points[1]}. Now ${d.points[0]} + ${d.points[1]} = ${d.turn}, so you can make your first bank. All six dice have scored; you may instead continue with six, but are not required to risk the ${d.turn}.`,
      },
      {
        title: 'Example E — a farkle clears the turn, not the score sheet',
        body: `You have ${e.banked} banked. Roll ${dice(e)} and keep the 1 and 5 for ${e.points[0]} unbanked points. The remaining four dice show ${dice(e, 1)}: no scoring dice, so this is a farkle. The turn drops to ${e.turn}; the banked score stays ${e.banked}. It does not fall to 550, and the unbanked 150 never became saved points.`,
      },
      {
        title: 'Example F — 10,000 triggers the last turns',
        body: `In a two-player game, A banks ${f.aTurn}: ${f.aBefore} + ${f.aTurn} = ${f.aFinal}. A has reached 10,000, but has not won immediately. B gets one final turn and banks ${f.bTurn}: ${f.bBefore} + ${f.bTurn} = ${f.bFinal}. B wins with the higher final score. The linked PDF does not detail a tie procedure; agree on one before play rather than infer one from this example.`,
      },
    ];
  return [
    {
      title: '例题 A — 有得分，但还不够首次入账',
      body: `掷出 ${dice(a)}，选三个2、一个5和一个1：200 + 50 + 100 = ${a.turn} 分，留下6。若尚未入场，不能把这${a.turn}分入账，首次入账要求同一回合至少500分。要继续就掷余下的一骰；若出现farkle，本回合暂存分会丢失。`,
    },
    {
      title: '例题 B — 两组三同点，六骰只用一次',
      body: `掷出 ${dice(b)}，选完整的两组三同点组合，得${b.turn}分。不能再把同一批骰子按200 + 600重复加分。六骰全部已计分，可以重新掷六骰（hot dice），也可入账，因为本回合已达到入场门槛；继续掷并非强制。`,
    },
    {
      title: '例题 C — 两次掷骰不能拼成三个同点',
      body: `已经入场，先掷 ${dice(c)}，留下两个5得${c.points[0]}分；再掷余下四骰，得到 ${dice(c, 1)}，选新出的5得${c.points[1]}分。本回合累计 ${c.points[0]} + ${c.points[1]} = ${c.turn} 分，可以入账。这三个5来自不同次掷骰，不能按三个5计500分。`,
    },
    {
      title: '例题 D — 达到500后才能首次入账',
      body: `尚未入场，先掷 ${dice(d)}，选三个3与一个1，得 300 + 100 = ${d.points[0]} 分，此时不够首次入账。余下两骰掷出 ${dice(d, 1)}，都选入，再得 100 + 50 = ${d.points[1]} 分。累计 ${d.points[0]} + ${d.points[1]} = ${d.turn} 分，已能首次入账。六骰均已用完，也可以继续掷六骰，但不必强制冒险丢掉${d.turn}分。`,
    },
    {
      title: '例题 E — farkle只清暂存，不扣旧账',
      body: `旧已入账${e.banked}分。先掷 ${dice(e)}，选1和5得${e.points[0]}分，暂未入账；余下四骰再掷出 ${dice(e, 1)}，没有任何可计分骰，构成farkle。本回合暂存归${e.turn}，旧已入账仍为${e.banked}分，不会扣成550分，也不能把暂存150分当作已保存。`,
    },
    {
      title: '例题 F — 到10000先触发最后一轮',
      body: `两人局，A旧分${f.aBefore}，本回合入账${f.aTurn}：${f.aBefore} + ${f.aTurn} = ${f.aFinal}，达到10000但不会立即胜。B仍有最后一回合，旧分${f.bBefore}再入账${f.bTurn}：${f.bBefore} + ${f.bTurn} = ${f.bFinal}。B以较高最终分获胜。所链接PDF未细述平分处理；应在开局前约定，不从本例推造平分规则。`,
    },
  ];
}

const primarySource =
  'https://playmonster.com/wp-content/uploads/2018/06/Farkle-Rules.pdf';

export const FARKLE_GUIDE: SeoLandingPage = {
  slug: 'farkle-scoring',
  primaryKeyword: 'farkle scoring',
  keywords: [
    'farkle scoring',
    'farkle scoring rules',
    'farkle points',
    'Farkle计分',
  ],
  updatedAt: '2026-11-02T12:32:19+08:00',
  relatedSlugs: ['spades-scoring', 'three-player-spades', 'euchre-strategy'],
  indexable: true,
  locales: {
    en: {
      metaTitle: 'Farkle Scoring: 15 Scores & Six Worked Examples',
      metaDescription:
        'Check Farkle scoring for the linked PlayMonster edition: all 15 scores, six original examples, the 500-point first bank and the final turn after 10,000.',
      heading: 'Farkle Scoring: Points and Worked Examples',
      subheading:
        'A six-dice tabletop reference for one clearly identified rules edition.',
      overview: [
        'This reference follows the linked PlayMonster Farkle rules PDF: the URL is dated 2018/06 and the page carries ©2016. In this edition, a single 1 scores 100, a single 5 scores 50, and three 1s score 300. Use the complete quick reference below for larger combinations.',
        'Score combinations from one throw only, and never use a die twice in the same selection. Your first bank needs at least 500 points in one turn. Reaching 10,000 or more gives every other player one final turn. Published versions differ: check your own box rules before using these values.',
      ],
      quickAnswerLink: {
        href: primarySource,
        label: 'PlayMonster Farkle rules PDF — selected edition',
        description: 'Source edition: URL 2018/06; page copyright ©2016.',
      },
      sections: [
        {
          title: 'Selected edition and quick answer',
          body: 'PlayMonster Farkle rules PDF, URL 2018/06, ©2016: single 1 = 100, single 5 = 50, three 1s = 300. First bank: at least 500 in one turn. At 10,000 or more, every other player still gets a final turn. See all 15 categories below; other editions differ.',
        },
        {
          title: 'Farkle scoring quick reference — all 15 categories',
          body: 'Each line is one scoring category in this edition, in points. A combination must appear in a single throw. Choose a valid selection without counting the same dice again as singles or smaller groups.',
          bullets: scoringRows.map(
            ([en, , points]) => `${en} = ${points} points`
          ),
        },
        {
          title: 'A turn: set aside, roll or bank',
          body: 'Start with six dice. After each scoring throw, set aside at least one scoring die or combination. You may roll the remaining dice to add to this turn, or stop and bank once eligible. If all six dice have scored, you may roll all six again and keep building the same turn. A throw with no scoring dice is a farkle: your turn ends and its unbanked points are lost; earlier banked points remain.',
          bullets: [
            'Before your first entry on the score sheet: accumulate at least 500 in one turn before banking.',
            'After you have entered: you may bank a scoring turn below 500.',
            'Keep separate columns for the saved total and this turn’s unbanked points. Only add the turn to the saved total when you bank.',
          ],
        },
        {
          title: 'Six original exercises',
          body: 'These fixed dice and scoring choices were constructed for this guide. They are arithmetic exercises, not recorded games or claims of optimal strategy. Read each selection as stated; there is no scoring calculator on this page.',
        },
        ...exercises('en'),
        {
          title: 'Finish the round before declaring a winner',
          body: 'When someone banks a total of 10,000 or more, every other player gets one final turn. Compare the final totals after those turns; the highest score wins. This edition’s PDF does not spell out tie handling, so settle that separately before starting.',
        },
        {
          title: 'Why another Farkle scoring chart may disagree',
          body: 'Do not mix versions into the quick reference. Dice Game Depot’s basic rules use three 1s = 1000 and a straight = 3000; its variants discuss other values. LITE Games’ app rules use three 1s = 1000 and three pairs = 750. Here, the selected PlayMonster edition uses 300, 1500 and 1500 respectively. Its two triplets score 2500. Short straights, consecutive-farkle penalties and taking over another player’s dice are not enabled in this guide.',
        },
      ],
      recommendations: [],
      faqs: [
        {
          question: 'How many points are three 1s in Farkle?',
          answer:
            'In the PlayMonster PDF edition linked here, three 1s score 300. Other published versions use 1000. Check the edition before scoring; this page uses 300 throughout.',
        },
        {
          question: 'Can I combine dice from different throws?',
          answer:
            'No. A combination must come from a single throw. Two 5s kept on one throw and a 5 on the next earn 100 + 50 = 150, not the 500-point triple.',
        },
        {
          question: 'Do I need 500 points on every turn?',
          answer:
            'No. This edition requires at least 500 in one turn for your first bank. After entering the score sheet, you may bank a smaller scoring turn.',
        },
        {
          question: 'Does a farkle erase my saved score?',
          answer:
            'No. A farkle ends the turn and loses its unbanked points. Previously banked points stay on the score sheet.',
        },
        {
          question: 'Does reaching 10,000 win immediately?',
          answer:
            'No. Every other player gets one final turn, then the highest final score wins. The linked PDF does not detail how to resolve ties.',
        },
      ],
      externalLinks: [
        {
          href: primarySource,
          label: 'PlayMonster: Farkle rules PDF',
          description:
            'Primary source for all 15 values, first-bank threshold, hot dice, farkles and last turns in this reference. URL 2018/06; ©2016.',
        },
        {
          href: 'https://www.dicegamedepot.com/farkle-rules/',
          label: 'Dice Game Depot: basic rules and variants',
          description:
            'Independent comparison: its basic three-1s and straight values differ from this page’s selected edition.',
        },
        {
          href: 'https://litegames.freshdesk.com/en/support/solutions/articles/60000688670-farkle-rules',
          label: 'LITE Games: app-specific Farkle rules',
          description:
            'Developer-published comparison, modified December 14, 2020: three pairs and other settings differ; those settings are not adopted here.',
        },
      ],
      ctaLabel: 'Browse other game guides',
      ctaDescription:
        'For other tabletop scoring tasks, see the related Spades and Euchre guides. This is an independent written reference, with no publisher partnership or Farkle play room.',
    },
    zh: {
      metaTitle: 'Farkle计分：15类分值与六个完整算例',
      metaDescription:
        '按所链接PlayMonster版本查Farkle的15类得分，核对六个原创算例、首次入账500分、farkle暂存清零及10000分后的最后一轮。',
      heading: 'Farkle计分：分值速查与完整算例',
      subheading: '明确采用一个版本的六骰桌面计分参考。',
      overview: [
        '本页采用所链接PlayMonster Farkle规则PDF的版本：URL路径为2018/06，页内标注©2016。此版本单个1得100分、单个5得50分、三个1得300分；更大的组合请查下面完整速查。',
        '组合只能使用同一次掷出的骰子，同一次选分不可重复使用同一骰。首次入账要求同一回合至少500分。累计达到10000或以上后，其他玩家各有最后一回合。不同出版版本分值有差异，使用本页前先核对你的盒装规则。',
      ],
      quickAnswerLink: {
        href: primarySource,
        label: 'PlayMonster Farkle规则PDF：本页采用版本',
        description: '来源版本：路径2018/06；页内版权©2016。',
      },
      sections: [
        {
          title: '所选版本与快答',
          body: '采用PlayMonster Farkle规则PDF：路径2018/06，©2016。单个1得100分，单个5得50分，三个1得300分。首次入账须同回合至少500分；达到10000或以上后，其他玩家仍各有最后一回合。下方列全15类；其他版本可能不同。',
        },
        {
          title: 'Farkle分值速查：完整15类',
          body: '每行是一类可计分情况，单位为分；组合须在一次掷骰中出现。选择合法得分后，同一批骰子不能再按单骰或较小组合重复计分。',
          bullets: scoringRows.map(([, zh, points]) => `${zh} = ${points} 分`),
        },
        {
          title: '一回合怎么走：留下、再掷或入账',
          body: '从六骰开始，每次有得分的掷骰后，至少取出一个可计分骰或组合。可以掷剩余骰继续累积，也可以在符合入账门槛时停手保存。六骰都已计分时，可再掷全部六骰，继续同一回合。若某次掷骰完全没有可计分骰，就是farkle：回合结束，本回合暂存分清零，之前已入账分保留。',
          bullets: [
            '首次进入计分表：先在同一回合累积至少500分，才能入账。',
            '已经入场后：有得分的回合不足500分也可入账。',
            '把旧已入账总分与本回合暂存分分栏记录，只在停手入账时相加。',
          ],
        },
        {
          title: '六个原创练习',
          body: '以下固定骰面与选择专为本页构造，只用于核算规则，不是真实对局记录或最优策略承诺。按每例指定的骰子计分；本页没有通用计分计算器。',
        },
        ...exercises('zh'),
        {
          title: '最后一轮完成后再判胜',
          body: '有人入账后总分达到10000或以上，其他玩家仍各有最后一回合；等这些回合都结束，再比较最终总分，最高者胜。所链接版本的PDF未细述平分处理，应在开局前另外约定。',
        },
        {
          title: '为什么别的Farkle计分表会不同',
          body: '不要把不同版本拼进主表。Dice Game Depot基本规则使用三个1得1000分、顺子得3000分，变体段另列其他值。LITE Games的App规则使用三个1得1000分、三对得750分。本页所选PlayMonster版本这三项分别为300、1500、1500分，两组三同点得2500分。本页不启用短顺子、连续farkle罚分或接上家骰子等桌规。',
        },
      ],
      recommendations: [],
      faqs: [
        {
          question: 'Farkle三个1到底多少分？',
          answer:
            '本页所链接PlayMonster PDF版本中，三个1得300分；另有出版版本使用1000分。先确认版本，本页始终使用300分。',
        },
        {
          question: '能把不同次掷骰拼成组合吗？',
          answer:
            '不能。组合必须来自同一次掷骰。前一掷留下两个5，下一掷再留一个5，只得100 + 50 = 150分，不按三个5计500分。',
        },
        {
          question: '每回合都必须500分才能入账吗？',
          answer:
            '不是。此版本仅首次入账要求同一回合至少500分；已经进入计分表后，有得分的回合不足500分也可以入账。',
        },
        {
          question: 'farkle会清掉之前已保存的分数吗？',
          answer:
            '不会。farkle结束本回合，丢失的是本回合未入账分；之前已入账分仍留在计分表。',
        },
        {
          question: '达到10000分立即获胜吗？',
          answer:
            '不会。其他玩家各有最后一回合，结束后最高最终分获胜；所链接PDF未细述平分如何处理。',
        },
      ],
      externalLinks: [
        {
          href: primarySource,
          label: 'PlayMonster：Farkle规则PDF',
          description:
            '本页15类分值、首次入账门槛、六骰重掷、farkle及最后一轮的主来源。路径2018/06；©2016。',
        },
        {
          href: 'https://www.dicegamedepot.com/farkle-rules/',
          label: 'Dice Game Depot：基本规则与变体',
          description:
            '独立对照；其基本规则的三个1与顺子分值不同于本页所选版本。',
        },
        {
          href: 'https://litegames.freshdesk.com/en/support/solutions/articles/60000688670-farkle-rules',
          label: 'LITE Games：App专用Farkle规则',
          description:
            '开发者自刊对照，页内修改日期2020-12-14；三对及其他设置存在差异，本页不采用那些设置。',
        },
      ],
      ctaLabel: '浏览其他游戏指南',
      ctaDescription:
        '其他桌游计分任务可参考相关Spades与Euchre指南。本页为独立文字参考，没有厂商合作关系或Farkle在线房间。',
    },
  },
};
