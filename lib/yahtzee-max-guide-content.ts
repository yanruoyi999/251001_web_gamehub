import type { Locale } from '@/i18n/config';
import type {
  SeoLandingPage,
  SeoLandingSection,
} from '@/lib/seo-landing-content';

const rules =
  'https://instructions.hasbro.com/api/download/C2406_en-us_yahtzee.pdf';
const faq = 'https://hasbro-new.custhelp.com/app/answers/detail/a_id/43/';
const instructions =
  'https://instructions.hasbro.com/en-us/instruction/yahtzee';

// Original fixed mathematical witness; no dice simulation or playable scoring engine.
// Both languages render these same thirteen turns.
export const YAHTZEE_MAX_WITNESS = [
  { dice: [6, 6, 6, 6, 6], category: 'yahtzee', score: 50, bonus: 0 },
  { dice: [1, 1, 1, 1, 1], category: 'aces', score: 5, bonus: 100 },
  { dice: [2, 2, 2, 2, 2], category: 'twos', score: 10, bonus: 100 },
  { dice: [3, 3, 3, 3, 3], category: 'threes', score: 15, bonus: 100 },
  { dice: [4, 4, 4, 4, 4], category: 'fours', score: 20, bonus: 100 },
  { dice: [5, 5, 5, 5, 5], category: 'fives', score: 25, bonus: 100 },
  { dice: [6, 6, 6, 6, 6], category: 'sixes', score: 30, bonus: 100 },
  { dice: [6, 6, 6, 6, 6], category: 'threeKind', score: 30, bonus: 100 },
  { dice: [6, 6, 6, 6, 6], category: 'fourKind', score: 30, bonus: 100 },
  { dice: [6, 6, 6, 6, 6], category: 'fullHouse', score: 25, bonus: 100 },
  { dice: [6, 6, 6, 6, 6], category: 'smallStraight', score: 30, bonus: 100 },
  { dice: [6, 6, 6, 6, 6], category: 'largeStraight', score: 40, bonus: 100 },
  { dice: [6, 6, 6, 6, 6], category: 'chance', score: 30, bonus: 100 },
] as const;

const labels = {
  yahtzee: ['Yahtzee', '五同点'],
  aces: ['Aces', '一点栏'],
  twos: ['Twos', '二点栏'],
  threes: ['Threes', '三点栏'],
  fours: ['Fours', '四点栏'],
  fives: ['Fives', '五点栏'],
  sixes: ['Sixes', '六点栏'],
  threeKind: ['Three of a Kind', '三条'],
  fourKind: ['Four of a Kind', '四条'],
  fullHouse: ['Full House', '满堂红'],
  smallStraight: ['Small Straight', '小顺'],
  largeStraight: ['Large Straight', '大顺'],
  chance: ['Chance', '机会栏'],
} as const;

function witness(locale: Locale): SeoLandingSection {
  return {
    title:
      locale === 'en' ? 'A complete 13-turn construction' : '完整13回合构造',
    body:
      locale === 'en'
        ? 'Start with all boxes empty. On each turn, suppose the five dice show the result below; accept it immediately, so no reroll is needed. Every line fills one new box. The last number is that turn’s box score plus its extra Yahtzee bonus, before the separate upper-section bonus. These chosen outcomes prove attainability under the selected rules; they are not a recorded random game or a recommended strategy.'
        : '从13个空栏开始，假设每回合五颗骰子出现下列结果；可以立即接受，无须重掷。每行只填一个新栏。行末合计为该回合的栏内分加额外Yahtzee奖励，尚未加独立的上栏奖励。这些指定结果证明所选规则下可以达到上界，不是真实随机对局记录，也不是策略建议。',
    bullets: YAHTZEE_MAX_WITNESS.map((turn, i) => {
      const [en, zh] = labels[turn.category];
      return locale === 'en'
        ? `Turn ${i + 1}: ${turn.dice.join(' + ')} → [${en}]; box ${turn.score} + extra bonus ${turn.bonus} = ${turn.score + turn.bonus} points.`
        : `第${i + 1}回合：${turn.dice.join(' + ')} → ${zh}[${en}]；栏内${turn.score} + 额外奖励${turn.bonus} = ${turn.score + turn.bonus}分。`;
    }),
  };
}

export const YAHTZEE_MAX_GUIDE: SeoLandingPage = {
  slug: 'highest-scoring-yahtzee-game',
  primaryKeyword: 'highest scoring yahtzee game',
  keywords: [
    'highest scoring yahtzee game',
    'highest yahtzee score',
    'maximum yahtzee score',
    'Yahtzee理论最高分',
  ],
  updatedAt: '2026-11-04T08:09:26+08:00',
  documentationCheckedAt: '2026-11-04',
  relatedSlugs: ['farkle-scoring', 'shut-the-box-rules'],
  indexable: true,
  locales: {
    en: {
      metaTitle:
        'Highest Scoring Yahtzee Game: C2406 Theoretical Maximum of 1,575',
      metaDescription:
        'Derive a theoretical 1,575 under Classic C2406 rules with a legal 13-turn example. See the Hasbro FAQ’s conflicting 1,535 and why neither proves a world record.',
      heading: 'Highest Scoring Yahtzee Game: A C2406 Theoretical Maximum',
      subheading:
        'A 1,575-point construction for one specified rules version, with the official-source conflict explained.',
      overview: [
        'Under the linked Classic C2406 rules (©2016), our calculation gives a theoretical maximum of 1,575: upper boxes 105 + upper bonus 35 + lower boxes 235 + extra Yahtzee bonuses 1,200. The complete 13-turn construction below attains it. This is a mathematical result for that version, not a verified real-world high score.',
        'There is an official-source conflict: Hasbro’s separate high-score FAQ states 1,535. It does not explain a rules difference that reconciles that figure with C2406; the cause is unknown. We show both sources rather than call 1,575 an official universal maximum.',
      ],
      quickAnswerLink: {
        href: rules,
        label: 'Hasbro Classic C2406 rules (PDF)',
        description:
          'The two-page ©2016 rules used for this derivation; the PDF does not itself state a 1,575 total.',
      },
      sections: [
        {
          title: 'Quick answer: 1,575 is the C2406 theoretical result',
          body: 'For this specified Classic rules PDF, one player’s theoretical maximum is 105 + 35 + 235 + 1,200 = 1,575. Each player has 13 scoring turns on their own scorecard, with one scoring box filled per turn. Start by scoring 50 in the Yahtzee box, then score 12 further Yahtzees for 100 extra points each while filling the other boxes. Hasbro’s separate FAQ says 1,535; the unresolved conflict prevents treating this as an official answer for every edition.',
        },
        {
          title: 'The upper bound: no box or bonus can exceed these amounts',
          body: 'The six upper boxes have maxima 5, 10, 15, 20, 25 and 30: five copies of each face. Their total cannot exceed 105. C2406 awards another 35 when the upper subtotal is at least 63. That bonus is added once, not once per qualifying turn.',
          bullets: [
            'Lower boxes: Three of a Kind 30 + Four of a Kind 30 + Full House 25 + Small Straight 30 + Large Straight 40 + Yahtzee 50 + Chance 30 = 235.',
            'The dice-sum boxes cannot exceed 30 with five six-sided dice; the other lower boxes have the fixed values shown above.',
            'Each player has only 13 scoring turns on their own scorecard. After the initial 50-point Yahtzee, at most 12 turns can earn an extra 100 each: 1,200.',
            'Adding these independent ceilings gives 1,575. An upper bound alone is insufficient: the sequence below shows that all ceilings can be reached together.',
          ],
        },
        {
          title: 'The C2406 priority that makes the example legal',
          body: 'An extra Yahtzee still fills one empty scoring box. Use the matching upper box first. If it is already filled, use an available Three of a Kind or Four of a Kind box, counting all five dice. Only after both kind boxes are also filled may you use Chance or substitute the five matching dice for another lower combination, taking its usual fixed score. This is why five sixes can score a straight in turns 11–12 here; five equal dice are not an ordinary straight.',
          bullets: [
            'The initial Yahtzee must be entered as 50 in the Yahtzee box for this construction. Merely rolling five equal dice earlier is not enough to activate the extra 100-point bonuses.',
            'If the Yahtzee box contains zero, subsequent Yahtzees earn no extra 100. C2406 still permits its described box-filling path, but it does not restore that bonus.',
            'A bonus is an addition to a turn’s score, not a new turn or a fourteenth scoring box. Each box is used once.',
          ],
        },
        witness('en'),
        {
          title: 'Check the construction and add the final bonus',
          body: 'Turns 2–7 fill each matching upper box and total 105. Turns 8–9 fill the two kind boxes after Sixes is full. Turns 10–12 can then use the substitution path for Full House and both straights; turn 13 uses Chance. All 13 boxes are distinct. The lower subtotal is 235, including the first turn’s 50. Turns 2–13 contribute 12 × 100 = 1,200 extra points. Finally add the upper bonus of 35: 105 + 235 + 1,200 + 35 = 1,575.',
        },
        {
          title:
            'Why 375, 1,535 and an electronic display are different questions',
          body: '375 = 105 + 35 + 235 is the sum of box maxima and the upper bonus with extra Yahtzee bonuses left out. It includes the 50-point Yahtzee box, so it is not a maximum for a game in which no Yahtzee is ever rolled. The 1,535 figure comes from the separate Hasbro FAQ, last updated May 31, 2023. That FAQ does not provide a turn-by-turn derivation or identify a rule that resolves the disagreement. Its Electronic Yahtzee discussion concerns a three-digit display; that display is not evidence of a universal scoring limit. Do not combine Classic C2406, Yatzy, Triple Yahtzee and electronic editions into one ruleset.',
        },
        {
          title: 'A theoretical maximum is not a world-record claim',
          body: 'A legal construction answers what could fit the rules. A personal score, a simulator leaderboard and an independently documented real-world record need different evidence. Neither this constructed sequence nor the FAQ establishes a verified world record. This article makes no probability estimate or optimal-play claim. It is an original written explanation, with no playable Yahtzee game, score calculator or printable scorecard; it is not affiliated with Hasbro.',
        },
        {
          title: 'Version and source notes',
          body: 'Documentation checked November 4, 2026. The selected PDF is labelled C2406, ©2016, with a December 2, 2016 print stamp. Its bonus and box-filling instructions support our derivation; its upper bonus starts at at least 63. The current Hasbro instruction page is linked as the source entry point. The separate high-score FAQ is retained as conflicting evidence, not presented as corrected or reconciled. Check the instructions in your own edition before applying this total.',
        },
      ],
      recommendations: [],
      faqs: [
        {
          question: 'What is the highest possible Yahtzee score?',
          answer:
            'Our derivation for the linked ©2016 Classic C2406 PDF gives 1,575, attained by the 13-turn sequence above. Hasbro’s separate FAQ says 1,535 without explaining the difference. Treat the answer as version-specific and theoretical, not an official universal total or a verified record.',
        },
        {
          question: 'Why is the maximum not just 375?',
          answer:
            '375 adds the box maxima and upper bonus but omits extra Yahtzee bonuses. C2406 permits 12 extra bonuses of 100 after the initial 50-point Yahtzee in this sequence. Because 375 includes that 50-point box, it is not a never-roll-Yahtzee maximum.',
        },
        {
          question:
            'Can I receive a Yahtzee bonus after writing zero in that box?',
          answer:
            'No extra 100-point bonus is available once the Yahtzee box is zero. The C2406 box-filling instructions can still apply, but they do not turn that zero into 50 or enable later 100-point bonuses.',
        },
        {
          question: 'Can five equal dice count as a Full House or straight?',
          answer:
            'In this C2406 extra-Yahtzee path, only after the matching upper box and both kind boxes have been filled. Then a remaining Full House, Small Straight or Large Straight can take its fixed 25, 30 or 40 points. Five equal dice do not ordinarily form those combinations.',
        },
        {
          question:
            'Does 1,575 prove a world record, or does a display of 999 cap the score?',
          answer:
            'Neither. The 1,575 example proves a theoretical construction for the selected rules. The FAQ’s three-digit Electronic Yahtzee display discussion does not establish a universal score ceiling or document a real-world record.',
        },
      ],
      externalLinks: [
        {
          href: rules,
          label: 'Classic C2406: selected rules PDF',
          description:
            'Two-page ©2016 rules: scoring, extra Yahtzee priority, zero-box restriction and the upper bonus.',
        },
        {
          href: faq,
          label: 'Hasbro high-score FAQ: conflicting 1,535',
          description:
            'Updated May 31, 2023. Its total differs from our C2406 derivation; the reason is unknown.',
        },
        {
          href: instructions,
          label: 'Hasbro Yahtzee instruction page',
          description:
            'Official entry point for the C2406 download; confirm the edition of your own game.',
        },
      ],
      ctaLabel: 'Browse browser games',
      ctaDescription:
        'Read the related Farkle and Shut the Box rules below for other tabletop dice games.',
    },
    zh: {
      metaTitle: 'Yahtzee 理论最高分：按 Classic C2406 规则算到1575',
      metaDescription:
        '按 Classic C2406 规则推导 Yahtzee 理论最高分1575，完整列出13回合合法构造，并披露 Hasbro FAQ 的1535冲突；不作为现实世界纪录。',
      heading: 'Yahtzee 理论最高分：Classic C2406 的1575分构造',
      subheading:
        '限定一个规则版本，逐回合证明上限，并公开官方来源之间的数值冲突。',
      overview: [
        '按所链 Classic C2406（©2016）规则，我们自行推导的理论最高分为1575：上栏105 + 上栏奖励35 + 下栏235 + 额外Yahtzee奖励1200。下方完整13回合构造可以同时达到这些数值。这是指定版本的数学结论，不是经过核验的现实最高分纪录。',
        '官方来源存在冲突：Hasbro 另一篇最高分FAQ写的是1535，却未解释能与C2406对齐的规则差异，原因未知。本文同时保留两种来源，不把1575称为所有版本统一的官方最高分。',
      ],
      quickAnswerLink: {
        href: rules,
        label: 'Hasbro Classic C2406 规则PDF',
        description:
          '本次推导使用的两页©2016规则；PDF本身没有直接写出1575总分。',
      },
      sections: [
        {
          title: '简答：C2406 指定版本的理论结果是1575',
          body: '按这份Classic规则，单名玩家的理论最高分为105 + 35 + 235 + 1200 = 1575。每名玩家在自己的计分卡中有13个计分回合，每回合填一个计分栏；先在Yahtzee栏记50，之后12次五同点各得额外100，同时填完其余栏。Hasbro另一篇FAQ写1535，两者尚未解释清楚，因此不能把这里的结果当作所有版本通用的官方答案。',
        },
        {
          title: '先证上界：每栏和奖励都不能超过多少',
          body: '六个上栏分别最多为5、10、15、20、25、30，即对应点数各有五颗，合计最多105。C2406规定上栏小计至少63时再加35；这项奖励只加一次，不是每个合格回合都加。',
          bullets: [
            '下栏上界：三条30 + 四条30 + 满堂红25 + 小顺30 + 大顺40 + Yahtzee 50 + Chance 30 = 235。',
            '按五骰总和计分的栏最多30；其余下栏采用上述固定分值。',
            '每名玩家在自己的计分卡中只有13个计分回合。首次Yahtzee记50后，最多再有12次额外奖励，每次100，合计1200。',
            '这些上界相加为1575。但仅相加还不够；下方构造进一步证明它们可以在同一局同时达到。',
          ],
        },
        {
          title: 'C2406 的填栏顺序：为什么五同点能在这里记顺子',
          body: '额外Yahtzee仍须填一个空栏。先填对应点数的上栏；若该栏已填，再选尚空的三条或四条，计五骰总和。只有这两个栏也都填过，才可以填Chance，或用五同点替代其他下栏组合，取得该组合的通常固定分。正因如此，下面第11–12回合的五个6可以分别记小顺和大顺；五个相同点数本身并不是普通顺子。',
          bullets: [
            '本构造首次Yahtzee必须在Yahtzee栏记50。此前只掷出过五同点，并不等于已开启额外100分奖励。',
            '若Yahtzee栏已记0，后来再掷五同点也没有额外100。C2406仍允许按其所述路径填其他栏，但不会恢复这项奖励。',
            '额外奖励附加在当前回合上，不会多出第14回合或新计分栏；每栏只能使用一次。',
          ],
        },
        witness('zh'),
        {
          title: '复核顺序与最终合计',
          body: '第2–7回合分别填对应上栏，合计105；六点栏已填后，第8–9回合先填三条和四条。此后第10–12回合才能依替代路径填满堂红与两种顺子，第13回合填Chance。13个栏没有重复。下栏合计235，已含首回合50；第2–13回合额外奖励为12 × 100 = 1200。最后另加上栏奖励35，得到105 + 235 + 1200 + 35 = 1575。',
        },
        {
          title: '375、1535与电子显示上限分别在说什么',
          body: '375 = 105 + 35 + 235，是忽略额外Yahtzee奖励后，各计分栏最大值加上栏奖励的总和。它本身包含Yahtzee栏50分，因此不是“整局从未掷出Yahtzee”的最高分。1535来自另一篇Hasbro FAQ，该页最后更新于2023年5月31日，没有给逐回合推导，也没有说明能解释差异的具体规则。该FAQ谈到的Electronic Yahtzee三位数显示是设备显示问题，不能证明通用分数上限。Classic C2406、Yatzy、Triple Yahtzee及电子版不能混为同一个规则集。',
        },
        {
          title: '理论可达不等于现实世界纪录',
          body: '合法构造回答的是规则允许什么；个人高分、模拟器榜单和有独立证据的现实纪录需要不同的核验材料。这段构造及该FAQ都不足以建立经过核验的世界纪录。本文不估计发生概率，不声称最优策略；只提供原创文字解释，没有Yahtzee在线对局、自动计分器或可打印计分纸，与Hasbro没有合作关联。',
        },
        {
          title: '版本与来源说明',
          body: '资料核查日期为2026年11月4日。所选PDF标有C2406、©2016及2016年12月2日印刷时间；其额外奖励和填栏路径支持本文推导，上栏奖励门槛是至少63。另链Hasbro当前说明页作为下载入口。最高分FAQ作为冲突证据保留，未声称它已被官方更正或与本文结果调和。应用总分前，请核对自己游戏盒内的具体版本。',
        },
      ],
      recommendations: [],
      faqs: [
        {
          question: 'Yahtzee 最高可能得多少分？',
          answer:
            '本文按所链©2016 Classic C2406规则自行推导为1575，并给出完整13回合构造。Hasbro另一篇FAQ写1535，未解释差异。因此这里只给指定版本的理论结论，不把它称为所有版本统一的官方最高分或现实纪录。',
        },
        {
          question: '为什么不只是375分？',
          answer:
            '375只合计各栏最大值和上栏奖励，没有计入额外Yahtzee奖励。本构造先在Yahtzee栏记50，之后C2406允许12次各100的额外奖励。375本身含Yahtzee栏50，不能叫作“从不掷出Yahtzee”的上限。',
        },
        {
          question: 'Yahtzee栏记0后还能拿100分奖励吗？',
          answer:
            '不能。该栏记0后，后续五同点没有额外100分奖励。C2406所述填其他栏的路径仍可适用，但不会把0改成50，也不会重新开启100分奖励。',
        },
        {
          question: '五个相同点数能算满堂红或顺子吗？',
          answer:
            '本页C2406额外Yahtzee路径下，须先填过匹配上栏以及三条、四条，才可把五同点用于尚空的满堂红、小顺或大顺，分别记固定25、30、40。五同点本身通常不构成这些组合。',
        },
        {
          question: '1575是世界纪录吗？电子显示999就封顶吗？',
          answer:
            '都不能这样推断。1575这里只是指定规则下的理论构造；FAQ对Electronic Yahtzee三位数显示的说明，既不能建立通用分数上限，也不能证明现实世界纪录。',
        },
      ],
      externalLinks: [
        {
          href: rules,
          label: 'Classic C2406：本页选用的规则PDF',
          description:
            '两页©2016规则：计分、额外Yahtzee优先顺序、零分限制和上栏奖励。',
        },
        {
          href: faq,
          label: 'Hasbro最高分FAQ：冲突的1535',
          description: '2023年5月31日更新；数值与本页C2406推导不同，原因未知。',
        },
        {
          href: instructions,
          label: 'Hasbro Yahtzee 说明页',
          description: 'C2406下载的官方入口；请核对自己游戏的版本。',
        },
      ],
      ctaLabel: '浏览浏览器游戏',
      ctaDescription:
        '下方Farkle和Shut the Box相关指南介绍其他实体骰子游戏的规则。',
    },
  },
};
