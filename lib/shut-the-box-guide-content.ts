import type { Locale } from '@/i18n/config';
import type {
  SeoLandingPage,
  SeoLandingSection,
} from '@/lib/seo-landing-content';

/** Fixed original teaching examples, not a playable game or strategy engine. */
export const SHUT_THE_BOX_EXAMPLES = {
  A: {
    open: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    dice: [3, 4],
    choices: [[7], [1, 6], [2, 5], [3, 4], [1, 2, 4]],
  },
  B: {
    open: [1, 2, 3, 4, 5, 6],
    dice: [5],
    choices: [[5], [1, 4], [2, 3]],
  },
  C: { open: [2, 6, 7, 9], dice: [4, 4], choices: [[2, 6]] },
  D: { open: [1, 4, 6], dice: [3, 5], choices: [] as number[][] },
  E: {
    open: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    steps: [
      { dice: [5, 6], close: [9, 2], remainingScore: 34 },
      { dice: [4, 6], close: [7, 3], remainingScore: 24 },
      { dice: [6, 6], close: [8, 4], remainingScore: 12 },
      { dice: [6, 6], close: [1, 5, 6], remainingScore: 0 },
    ],
  },
};

const source = 'https://www.mastersofgames.com/rules/shut-box-rules.htm';
const tiles = (values: number[]) => values.join(' + ');
const choices = (values: number[][]) => values.map(tiles).join('; ');

function exercises(locale: Locale): SeoLandingSection[] {
  const { A, B, C, D, E } = SHUT_THE_BOX_EXAMPLES;
  if (locale === 'en')
    return [
      {
        title: 'Example A — all five ways to close a total of 7',
        body: `All tiles 1–9 are open. Roll ${tiles(A.dice)} = 7. The complete list of legal choices is ${choices(A.choices)}. Choose just one of those groups, then close its tiles. You may close three tiles: 1 + 2 + 4 is legal even though you rolled two dice. You cannot use the 1 twice or close several alternative groups together.`,
      },
      {
        title: 'Example B — one die is an option after 7, 8 and 9 close',
        body: `Only ${B.open.join(', ')} remain open, so 7, 8 and 9 are all closed. You choose one die and roll ${B.dice[0]}. The complete choices are ${choices(B.choices)}. Pick one group and continue. Two dice were also allowed before this throw; switching to one die was optional.`,
      },
      {
        title: 'Example C — an 8 does not require the 8 tile',
        body: `Open tiles: ${C.open.join(', ')}. Roll ${tiles(C.dice)} = 8 with two dice. The only legal choice is ${tiles(C.choices[0])} = 8. Close those tiles, leaving 7 and 9 with a remaining sum of 16. The 8 tile is already closed and cannot be reused. You still cannot choose one die: 7 and 9 remain open. The 16 is the current remaining sum, not a final score unless the turn ends.`,
      },
      {
        title: 'Example D — no legal group ends the turn at 11',
        body: `Open tiles: ${D.open.join(', ')}. Roll ${tiles(D.dice)} = 8. No group of these open tiles adds to 8: the two-tile sums are 5, 7 and 10, and all three sum to 11. There is only one 4, so 4 + 4 is unavailable. The turn ends with 1 + 4 + 6 = 11 points, not 146. You do not get another throw to try again.`,
      },
      {
        title: 'Example E — a constructed path to zero',
        body: 'Begin with every tile open. Each line is the next throw in the same turn. These chosen dice illustrate a possible legal sequence; they are not a recorded random game, an optimal strategy or a probability estimate.',
        bullets: E.steps.map(
          (step, i) =>
            `Throw ${i + 1}: ${tiles(step.dice)} = ${step.dice.reduce((a, b) => a + b, 0)}; close ${tiles(step.close)}; remaining sum = ${step.remainingScore}.`
        ),
      },
    ];
  return [
    {
      title: '例题 A — 总点数7的全部五组关法',
      body: `1–9全开，掷出 ${tiles(A.dice)} = 7。合法组合完整列为：${choices(A.choices)}。只选其中一组并关闭对应数字。两颗骰子也能关闭三张牌，因此1 + 2 + 4合法；但不能把同一个1用两次，也不能同时关闭多个备选组合。`,
    },
    {
      title: '例题 B — 7、8、9全关后可选一骰',
      body: `只剩${B.open.join('、')}打开，7、8、9均已关闭。你选择一骰，掷出${B.dice[0]}；全部合法组合是${choices(B.choices)}，选一组关闭后继续。在这次掷骰前，也可以仍选两骰；改用一骰不是强制。`,
    },
    {
      title: '例题 C — 掷出8不一定要关数字8',
      body: `打开的数字为${C.open.join('、')}，两骰掷出 ${tiles(C.dice)} = 8，唯一合法组合是 ${tiles(C.choices[0])} = 8。关闭2和6后剩7、9，剩余和为16。数字8此前已关，不能再用；7和9仍开，也不能改用一骰。这里16只是当前剩余和，尚未结束回合就不是最终得分。`,
    },
    {
      title: '例题 D — 无合法组合，回合以11分结束',
      body: `打开的数字为${D.open.join('、')}，掷出 ${tiles(D.dice)} = 8。没有任何组合能凑8：两张牌的和分别是5、7、10，三张全选是11；只有一张4，不能凑4 + 4。回合结束，得分为 1 + 4 + 6 = 11，不是146，也不能再掷一次补救。`,
    },
    {
      title: '例题 E — 构造一个全部关闭的0分过程',
      body: '从1–9全开开始，下面四行是同一回合连续的四次掷骰。这些指定骰面只展示一条合法过程，不是真实随机对局记录、最优策略或概率估计。',
      bullets: E.steps.map(
        (step, i) =>
          `第${i + 1}掷：${tiles(step.dice)} = ${step.dice.reduce((a, b) => a + b, 0)}；关闭 ${tiles(step.close)}；剩余和 = ${step.remainingScore}。`
      ),
    },
  ];
}

export const SHUT_THE_BOX_GUIDE: SeoLandingPage = {
  slug: 'shut-the-box-rules',
  primaryKeyword: 'shut the box game rules',
  keywords: [
    'shut the box game rules',
    'shut the box rules',
    'shut the box scoring',
    'Shut the Box规则',
  ],
  updatedAt: '2026-11-03T21:31:42+08:00',
  relatedSlugs: ['how-to-play-dominoes', 'farkle-scoring'],
  indexable: true,
  locales: {
    en: {
      metaTitle: 'Shut the Box Game Rules: 1–9 Scoring & Five Examples',
      metaDescription:
        'Learn the 1–9 sum-scoring Shut the Box game rules: legal tile combinations, when one die is allowed, when a turn ends and five original worked examples.',
      heading: 'Shut the Box Game Rules: A 1–9 Guide',
      subheading:
        'Learn legal combinations and remaining-sum scoring with five worked examples.',
      overview: [
        'Roll the dice, then close one group of open numbered tiles whose sum equals the dice total. Repeat until no legal group remains; your score is the sum of the tiles still open. Lower is better. Closing every tile scores 0 and wins under the selected rules.',
        'This guide uses the 1–9 sum-scoring version described by Masters Traditional Games. Only after 7, 8 and 9 are all closed may you choose one die or keep using two. Boards and house rules differ, so agree on this version before starting.',
      ],
      quickAnswerLink: {
        href: source,
        label: 'Masters Traditional Games: Shut the Box rules',
        description:
          'Source for the selected 1–9 version and its one-die condition.',
      },
      sections: [
        {
          title: 'Quick answer: match the total, then score what remains',
          body: 'Start with 1–9 open and two dice. Close one group of open tiles that adds to the rolled total, using each tile once. Roll again after a legal closure. No legal group means your turn ends: add the remaining numbers. Low score wins; all closed means 0 and an immediate win in this version.',
        },
        {
          title: 'Set up a board or a paper practice row',
          body: 'Use a 1–9 board, two standard six-sided dice and a score sheet. For paper practice, write 1 through 9 and cross out numbers as they close. Each number represents one tile, so it can be crossed out only once per turn. Reset all nine numbers for the next player. This page is a written tabletop guide, with no playable board or dice roller.',
        },
        {
          title: 'One turn: roll, choose one group, close and repeat',
          body: 'Start the turn with all nine tiles open. Roll two dice and add them. Choose any nonempty group of still-open tiles with that exact sum, close the group, then roll again. The number of tiles need not match the number of dice. Closed tiles stay closed until the next turn. If there is no legal group, stop and record the remaining sum; you cannot pass or reroll that failed throw.',
        },
        {
          title: 'When can you use one die?',
          body: 'Before each throw, check the 7, 8 and 9 tiles. If any is still open, use two dice. Once all three are closed, you may choose either one die or two dice. This is a tile condition, not a rule based on the remaining sum being 6 or less. Choose the dice count before rolling; do not discard one die after seeing a two-dice result.',
        },
        {
          title: 'Five original worked examples',
          body: 'A–D check individual decisions; E follows one full constructed turn. Choices separated by semicolons are alternatives: close only one group per throw. The examples teach legality and arithmetic, not the best move.',
        },
        ...exercises('en'),
        {
          title: 'Score a turn, then compare the round',
          body: 'A throw with no legal closure ends that player’s turn. Add the open numbers for the score, then reset the board for the next player. In a round, players each take a turn and compare scores; the lowest wins unless someone closes everything, which is an immediate win in the selected source. Agree on tie handling and any multi-round format beforehand: the source does not establish a universal tie procedure.',
        },
        {
          title: 'Keep variants separate',
          body: 'This page uses tiles 1–9, remaining-sum scoring and the 7/8/9 condition for choosing one die. A 1–12 board, reading open digits as one large number, or allowing one die when the remaining sum is below 6 belongs to a different ruleset. Follow your own box rules if they differ; do not mix their scoring or dice conditions into these examples. No wagering is needed.',
        },
      ],
      recommendations: [],
      faqs: [
        {
          question: 'Can I close more than two tiles on one throw?',
          answer:
            'Yes. Any group of different open tiles is legal if its sum matches the dice total. For a total of 7, closing 1, 2 and 4 is allowed. Each tile can be used only once.',
        },
        {
          question: 'When is one die allowed in Shut the Box?',
          answer:
            'In this selected version, only when 7, 8 and 9 are all closed. You may then choose one die or two before the next throw. Other versions use different conditions.',
        },
        {
          question: 'What happens if I cannot make the dice total?',
          answer:
            'Your turn ends immediately. Add the numbers still open for your score; do not reroll or reopen tiles to make that throw work.',
        },
        {
          question: 'Is the score a sum or a number made from the open digits?',
          answer:
            'This guide uses the sum. Open tiles 1, 4 and 6 score 11, not 146. Digit-concatenation scoring is a different variant.',
        },
        {
          question: 'Does closing every tile win?',
          answer:
            'Yes. In the selected Masters Traditional Games version, closing all nine tiles scores 0 and wins immediately. Otherwise compare the players’ remaining sums: lower wins. Agree on ties before play.',
        },
      ],
      externalLinks: [
        {
          href: source,
          label: 'Masters Traditional Games: rules and variations',
          description:
            'Selected source for setup, legal closures, the 7/8/9 dice condition, remaining-sum scoring and closing the box. This guide’s wording and five exercises are original.',
        },
      ],
      ctaLabel: 'Browse browser games',
      ctaDescription:
        'Explore other games in the catalog, or use the related Dominoes and Farkle guides for more tabletop rules. This independent reference has no publisher affiliation.',
    },
    zh: {
      metaTitle: 'Shut the Box游戏规则：1–9计分与五个算例',
      metaDescription:
        '用五个原创算例理解Shut the Box的1–9求和版本：如何选择合法关牌组合、何时可用一骰、无解何时结束及剩余数字如何计分。',
      heading: 'Shut the Box游戏规则：1–9求和版',
      subheading: '从合法组合、一骰条件到剩余和计分，逐步核对五个算例。',
      overview: [
        '掷骰后，选一组仍打开的数字，使其和等于本次骰子总点数，再关闭它们。重复操作，直到没有合法组合，得分就是剩余数字之和，越低越好。按本页采用的版本，全部关闭得0分并立即获胜。',
        '本页采用Masters Traditional Games所述的1–9求和计分版本。只有7、8、9全关后，才可选择一骰或继续两骰。不同数字板和桌规可能不同，开局前先约定采用哪个版本。',
      ],
      quickAnswerLink: {
        href: source,
        label: 'Masters Traditional Games：Shut the Box规则',
        description: '本页1–9求和版本及一骰条件的来源。',
      },
      sections: [
        {
          title: '快答：凑出总点数，最后加剩余数字',
          body: '从1–9全开、两骰开始。每掷选一组仍打开的数字，和须等于骰子总点数，每张牌只用一次。合法关闭后再掷；没有组合就结束回合，把剩余数字相加。低分胜；本版本全部关闭得0分并立即获胜。',
        },
        {
          title: '准备数字板，也可以用纸笔练习',
          body: '准备1–9数字板、两颗普通六面骰和计分纸。纸笔练习可写下1到9，关闭时划去；每个数字只代表一张牌，同回合只能划去一次。换下位玩家时重新打开全部数字。本页是桌面规则文字指南，没有可操作棋盘或掷骰器。',
        },
        {
          title: '一回合：掷骰、选一组、关牌、再掷',
          body: '回合开始时九张牌全开。掷两骰并求和，选一组非空且仍打开的数字，和须恰好相等；关闭后继续掷。关牌张数不必等于骰子颗数。已关的牌直到下回合前都不能重用。若本次无合法组合，立即停下记录剩余和，不能跳过，也不能重掷这次失败骰面。',
        },
        {
          title: '什么时候可以用一骰？',
          body: '每次掷骰前查看7、8、9：只要有一张仍开，就必须用两骰；三张全关后，可自行选择一骰或两骰。这取决于指定数字是否关闭，不是“剩余和不超过6”。先选骰子颗数再掷，不能看完两骰结果后丢掉其中一颗。',
        },
        {
          title: '五个原创完整算例',
          body: 'A–D核对单次决策，E演示构造的完整回合。分号隔开的是备选组合，每次只关闭一组。这些例题说明合法性和算术，不判断最优选择。',
        },
        ...exercises('zh'),
        {
          title: '回合记分，再比较一轮结果',
          body: '一次掷骰没有合法关法，当前玩家回合结束，把仍打开的数字相加记分，再为下位玩家重置数字板。一轮中各玩家轮流进行一个回合，再比较分数，最低者胜；本页来源规定，全部关闭可立即获胜。平分处理和多轮赛制应事先约定，来源没有给出通用平分程序。',
        },
        {
          title: '不要混入其他变体',
          body: '本页固定用1–9数字、剩余求和计分，以及7、8、9全关后可选一骰的条件。1–12数字板、把剩余数字拼成一个大数，或剩余和小于6时才准一骰，均属于其他规则。若你的盒装说明不同，应遵循该版本，不能把它的计分或一骰条件拼入本页算例。无需下注即可进行。',
        },
      ],
      recommendations: [],
      faqs: [
        {
          question: '一次掷两骰，可以关三张或更多牌吗？',
          answer:
            '可以。只要选的都是不同且仍打开的数字，其和等于骰子总点数即可。例如总点数7时可关1、2、4；每张牌只能用一次。',
        },
        {
          question: 'Shut the Box什么时候允许一骰？',
          answer:
            '本页版本要求7、8、9全部关闭，此后每次掷骰前可选择一骰或两骰。其他版本可能采用不同条件。',
        },
        {
          question: '凑不出骰子总点数怎么办？',
          answer:
            '当前回合立即结束，把仍打开的数字相加记分。不能重掷，也不能重新打开已关的牌来凑这次点数。',
        },
        {
          question: '得分是求和，还是把剩余数字拼起来？',
          answer:
            '本页采用求和。例如剩1、4、6时得11分，不是146分。数字拼接计分属于另一个变体。',
        },
        {
          question: '所有数字都关掉就赢了吗？',
          answer:
            '是。本页采用的Masters Traditional Games版本中，九张全关得0分并立即获胜；否则比较剩余和，低分胜。平分办法请开局前约定。',
        },
      ],
      externalLinks: [
        {
          href: source,
          label: 'Masters Traditional Games：规则与变体',
          description:
            '本页开局、合法关牌、7/8/9一骰条件、剩余和计分及全部关闭结果的来源。文字表述与五个例题为本页原创。',
        },
      ],
      ctaLabel: '浏览网页游戏',
      ctaDescription:
        '可浏览游戏目录，或阅读相关的多米诺与Farkle桌面规则指南。本页为独立参考，与规则来源出版方没有隶属关系。',
    },
  },
};
