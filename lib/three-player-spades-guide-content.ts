import type { Locale } from '@/i18n/config';
import type {
  SeoLandingPage,
  SeoLandingSection,
} from '@/lib/seo-landing-content';

/** Original arithmetic exercises for the explicitly labelled house rules below. */
export const SPADES_HAND_EXAMPLE = [
  { name: 'Alex', bid: 5, taken: 7, delta: 52, bags: 2 },
  { name: 'Blair', bid: 6, taken: 4, delta: -60, bags: 0 },
  { name: 'Casey', bid: 4, taken: 6, delta: 42, bags: 2 },
] as const;
export const SPADES_BAG_EXAMPLE = {
  previousScore: 249,
  previousBags: 9,
  bid: 5,
  taken: 8,
  nextScore: 202,
  nextBags: 2,
} as const;

function handExample(locale: Locale): SeoLandingSection {
  return {
    title:
      locale === 'en'
        ? 'Worked hand: account for all 17 tricks'
        : '完整例手：17墩全部算清',
    body:
      locale === 'en'
        ? 'These original scores use the house convention above, with no previous bags or penalties. The bids total 15, which is legal here; the tricks actually won must total 17. Keep the bid and the result in separate columns.'
        : '以下原创例子采用上面的本页桌规，三人原来均无袋数，也没有其他奖罚。叫墩合计15在本页规则中合法，实际赢墩则必须合计17；请分开记录叫墩和实得。',
    bullets: SPADES_HAND_EXAMPLE.map(p =>
      locale === 'en'
        ? `${p.name}: bids ${p.bid}, takes ${p.taken}; ${p.delta > 0 ? '+' : '−'}${Math.abs(p.delta)} points and ${p.bags} new bags.`
        : `${p.name}：叫${p.bid}墩、得${p.taken}墩；本手${p.delta > 0 ? '加' : '扣'}${Math.abs(p.delta)}分，新增${p.bags}袋。`
    ),
  };
}

export const THREE_PLAYER_SPADES_GUIDE: SeoLandingPage = {
  slug: 'three-player-spades',
  primaryKeyword: 'how to play spades with only 3 players',
  keywords: [
    'how to play spades with only 3 players',
    'three player spades rules',
    '3 player spades scoring',
    'spades for three',
  ],
  updatedAt: '2026-11-02T07:56:48+08:00',
  relatedSlugs: ['spades-scoring', 'euchre-strategy', 'categories-game-topics'],
  indexable: true,
  locales: {
    en: {
      metaTitle: 'How to Play Spades with Only 3 Players: Rules & Scoring',
      metaDescription:
        'Play three-player Spades with a 51-card deal, 17 tricks and individual bids. Follow one clearly labelled house ruleset with original scoring and bag examples.',
      heading: 'How to Play Spades with Only 3 Players',
      subheading:
        'A 17-card solo setup, a complete worked hand and a scorekeeping checklist.',
      overview: [
        'Yes: remove the two of clubs from a normal deck and deal the remaining 51 cards equally. Each person receives 17 cards, bids for their own hand and keeps their own score. There are no partners or dummy hand. A trick is one card from each player; a hand contains 17 tricks, not 17 cards on the table altogether.',
        'Three-player Spades has several published variants. This guide chooses one beginner house ruleset: ace-high cards, positive bids, cumulative bags and a 500-point target. It combines the stated setup and scoring choices below; it is not the complete default rules of any linked app. This is a written tabletop guide, not a playable three-person online room.',
      ],
      sections: [
        {
          title: 'Set up the 51-card deal',
          body: 'Remove both jokers and the two of clubs. Shuffle, choose a dealer, then deal one card at a time clockwise, beginning on the dealer’s left, until everyone has 17. Rotate the dealer clockwise after each hand. VIP Spades describes this remove-the-two-of-clubs setup; other versions leave a random card out instead. Do not switch methods halfway through a game.',
        },
        {
          title: 'Agree on this table’s rules before bidding',
          body: 'Use these settings consistently for every example on this page. A bid is a target you must reach, not a promise to win exactly that many tricks. Do not add a reward or penalty only after seeing someone’s result.',
          bullets: [
            'Three individuals, 17 cards each; no partnerships, dummy or jokers.',
            'Bids are 1–17. Nil, Blind Nil and special high-bid bonuses are off.',
            'The three bids may total 17; no restriction on that total is used here.',
            'Overtricks give one point and one bag each; every 10 bags costs 100 points.',
            'Check the 500-point target after the entire hand and all penalties are settled.',
          ],
        },
        {
          title: 'Bid clockwise for your own hand',
          body: 'After looking at the cards, the player left of the dealer bids first, followed clockwise by the other two. Write each bid down. Look for high spades, side-suit winners and short suits, but do not count every high card as a guaranteed trick. Opponents can hold higher cards or trump a suit they cannot follow. You do not combine a bid with a partner.',
        },
        {
          title: 'Lead, follow suit and find the winner',
          body: 'The holder of the three of clubs leads it first, since the two of clubs is absent. Play clockwise. Follow the led suit if you can; if you cannot, discard another suit or play a spade. Spades are always trump. The highest spade wins; if no spade appears, the highest card of the led suit wins. Within a suit, rank cards A, K, Q, J, 10 down to 2. The winner leads next.',
        },
        {
          title: 'What breaking spades means',
          body: 'Before spades are broken, do not lead one unless your remaining hand contains only spades. They become broken when a player who cannot follow a non-spade suit plays a spade. That can happen on the first trick in the convention used here. Having a low club is not permission to trump a club lead: you must follow suit. Pagat’s three-player play section explains this follow-suit and lead restriction.',
        },
        {
          title: 'Score positive bids and keep bags separately',
          body: 'For a bid b and result t, making the bid earns 10 × b plus one point for each extra trick: 10 × b + (t − b). Those extras also become bags. Falling short loses 10 × b, with no partial credit. Keep a running bag count; whenever it reaches 10, deduct 100 points and remove those 10 bags, retaining any remainder. Trickster lists alternative failed-bid and bag settings; these are the choices used here.',
        },
        handExample('en'),
        {
          title: 'Bag carryover: nine old bags do not disappear',
          body: 'Suppose your score is 249 and you already have nine bags. Bid five and take eight: this hand adds 53 points and three bags. Twelve accumulated bags trigger one 100-point deduction, leaving two bags. The new score is 249 + 53 − 100 = 202. Do not subtract the same penalty again next hand, and do not confuse the two remaining bags with two extra points to add a second time.',
        },
        {
          title: 'A simple score sheet and finish rule',
          body: 'For each player, record the previous score, previous bags, bid, tricks taken, hand points, bag deduction, new score and remaining bags. Count 17 trick winners before accepting a hand’s totals. After settling the whole hand, if anyone has at least 500, the highest final score wins. If the top final scores tie, play another hand. Reaching 500 before a bag penalty does not end the game.',
        },
        {
          title: 'A short practice checklist',
          body: 'Before a turn, identify the led suit, whether you can follow it and which card currently wins. Before a new lead, check whether spades are broken. After the hand, compare your original bid with the result without pretending hidden cards were known. For a first game, use paper tokens to count tricks and review one disputed play before shuffling. This teaches the procedure; it does not promise a winning bid or a particular win rate.',
        },
        {
          title: 'Keep variants separate',
          body: 'Some tables use a dummy hand, a random unused card, immediate penalties for each overtrick, or different Nil rules. Pagat describes several such choices, including an immediate bag deduction that is not our scoring method. If your group prefers another version, write a replacement agreement before dealing and recalculate the examples under it. The linked sources document their own rules; this page’s score examples follow only its declared house convention.',
        },
      ],
      recommendations: [],
      faqs: [
        {
          question: 'How many cards does each of three players get?',
          answer:
            'In this setup, remove the two of clubs and deal all 51 remaining cards: 17 per player. There are no partners, jokers or dummy hand.',
        },
        {
          question: 'Who leads the first trick?',
          answer:
            'The player holding the three of clubs leads that card. The two of clubs was removed before dealing. A player who can follow clubs must do so.',
        },
        {
          question: 'Can the three bids add up to 17?',
          answer:
            'Yes, in the house convention on this page. A rule forbidding a total equal to the available tricks is a separate option and is not enabled here.',
        },
        {
          question: 'Can I bid zero or Nil?',
          answer:
            'Not in this beginner ruleset: bids are 1–17. Nil is a separate zero-trick contract, not an ordinary bid of zero. To add it, agree on its reward, failure penalty and whether tricks on a failed Nil count as bags before starting; published settings differ.',
        },
        {
          question: 'Can three of us play online on this page?',
          answer:
            'This page explains tabletop setup and fixed score examples. It does not host an online Spades room or connect players. Use your own cards and score sheet to play this stated version.',
        },
      ],
      externalLinks: [
        {
          href: 'https://vipspades.com/',
          label: 'VIP Spades: Spades for Three setup',
          description:
            'Supports removing the two of clubs and dealing 17 cards to each solo player; its other mode settings are not adopted wholesale.',
        },
        {
          href: 'https://www.pagat.com/auctionwhist/spades.html#three',
          label: 'Pagat: Spades for Three Players',
          description:
            'Compare three-player play, first lead and alternative scoring. Its main overtrick penalty differs from our chosen bag convention.',
        },
        {
          href: 'https://www.trickstercards.com/help/spades-rules/',
          label: 'Trickster Cards: Spades rule options',
          description:
            'Documents configurable solo play, failed bids, bags and Nil. These are choices, not a universal default.',
        },
      ],
      ctaLabel: 'Browse browser games',
      ctaDescription:
        'For other tabletop activities, compare the related Euchre strategy and Categories topic guides.',
    },
    zh: {
      metaTitle: '三人Spades怎么玩：17张单打规则与算分例子',
      metaDescription:
        '用51张牌、每人17张学习三人Spades单打。明确本页采用的叫墩、黑桃将牌与累计袋数规则，附完整17墩和跨手扣分原创例子。',
      heading: '三人Spades怎么玩：17张单打规则与算分例子',
      subheading: '先约定一套清楚的桌规，再发牌、叫墩与记分。',
      overview: [
        '三个人也能玩：普通扑克牌去掉大小王和梅花2，剩下51张平均发完，每人17张，各自叫墩、各自记分，不设搭档或虚拟手。一墩是三个人各出一张牌组成的小轮；一手共17墩，不是三个人合计只拿17张。',
        '三人Spades有多种公开玩法。本页选定一套入门桌规：A为最大牌、只叫正数墩、累计袋数、目标500分。下方牌组与计分选择已逐项说明，不代表任何来源平台的整套默认规则。这是一份用自己纸牌游玩的文字指南，不是在线三人联机牌桌。',
      ],
      sections: [
        {
          title: '准备51张牌并发完',
          body: '先移除两张大小王和梅花2。洗牌、选庄家，从庄家左边开始顺时针逐张发牌，每人17张。下一手由左边下一位坐庄。VIP Spades介绍了这种固定移除梅花2的三人单打设置；另有随机留下某张牌的版本，不能打一半再换牌组。',
        },
        {
          title: '开局前确认本页桌规',
          body: '下面所有例子都按这些选择计算。叫墩是必须至少达到的目标，不是只能赢得恰好这么多墩；奖罚应在看结果之前说清。',
          bullets: [
            '三人各自为战，每人17张；不设搭档、虚拟手或大小王。',
            '只允许叫1至17墩，暂不启用Nil零墩、盲叫零墩或高叫奖励。',
            '允许三人叫墩合计17，不采用禁止合计17的限制。',
            '每个超墩加1分并记1袋；累计每满10袋扣100分。',
            '整手结算并扣完袋数罚分后，再检查是否有人达到500分。',
          ],
        },
        {
          title: '顺时针为自己的手牌叫墩',
          body: '看牌后，由庄家左边先叫，再顺时针轮到其他两人，立即写下每人的数。黑桃是固定将牌，可以压过其他花色；高黑桃、副花色大牌和缺门情况都值得考虑，但不能把每张大牌都当作稳拿一墩。对手可能持更大的牌，或因没有首攻花色而出将牌；这里没有搭档替你补足叫墩。',
        },
        {
          title: '首攻、跟花与判断谁赢',
          body: '因为梅花2已移除，持梅花3的人先领出它。三人顺时针出牌，能跟首攻花色就必须跟；没有该花色时，才可垫其他花色或出黑桃。若本墩出现黑桃，最大黑桃赢；否则首攻花色最大牌赢。各花色从大到小为A、K、Q、J、10一直到2。赢墩的人领出下一墩。',
        },
        {
          title: '什么叫黑桃已经破开',
          body: '黑桃未破时不能主动领出，除非手中只剩黑桃。缺少首攻的非黑桃花色时出了一张黑桃，就会破开；本页桌规允许第一墩缺梅花时出黑桃。手里仍有梅花，不能为了赢牌而用黑桃代替跟梅花。Pagat三人玩法部分说明了跟花与黑桃首攻限制。',
        },
        {
          title: '正数叫墩与累计袋数如何算',
          body: '叫b墩、实得t墩：达到目标得10×b，加上每个超墩1分，即10×b＋(t−b)；超出的每墩同时记1袋。未达标扣10×b，不按已拿墩数给部分分。袋数跨手保留，每累计满10袋扣100分并移除这10袋，余袋继续留着。Trickster列出了不同失败扣分和袋数选项，这里只采用本段写明的一套。',
        },
        handExample('zh'),
        {
          title: '跨手例子：原来的9袋不能消失',
          body: '假设原有249分和9袋，这手叫5墩、拿8墩，先加53分并新增3袋。总袋数12，扣一次100分并留下2袋；新分数为249＋53−100＝202。下一手不要重复扣掉已经处理的10袋，也不要把剩下2袋再加一次分，它们对应的超墩分已在此前计入。',
        },
        {
          title: '记分表与终局顺序',
          body: '每人分别写原分数、原袋数、叫墩、实得、本手分、袋数罚分、新分数和余袋。确认三人的实得合计17，再接受本手结果。整手结算完，若有人达到500分，最终分数最高者获胜；最高分完全相同就再打一手。先加分超过500、后来扣袋又低于500，不能提前宣布结束。',
        },
        {
          title: '一份简短练习清单',
          body: '轮到出牌前，先认清首攻花色、自己能否跟花、当前谁的牌最大；轮到领牌前，再检查黑桃是否已破。结算后比较原叫墩和实得，不要假装当时已知道隐藏手牌。第一局可用纸片计数赢墩，收牌前讨论一处争议出牌；这是熟悉流程的方法，不保证某次叫墩成功或某个胜率。',
        },
        {
          title: '不同版本不要混算',
          body: '有的桌子会发虚拟手、随机留下某张牌、对每个超墩立即扣分，或启用不同的Nil规则。Pagat也列有每个超墩即时扣分的版本，与本页累计袋数法不同。想换版本，应在发牌前写下替代约定，按新约定重算例子。文末来源介绍各自规则，本页原创算分题只按已声明的桌规计算。',
        },
      ],
      recommendations: [],
      faqs: [
        {
          question: '三人每人发多少张？',
          answer:
            '本页玩法先移除梅花2，剩下51张全部发完，每人17张；不设搭档、大小王或虚拟手。',
        },
        {
          question: '谁领出第一张牌？',
          answer:
            '持梅花3的人先领出梅花3，因为梅花2已在发牌前移除。其他人只要有梅花就必须跟梅花。',
        },
        {
          question: '三个人叫墩合计可以等于17吗？',
          answer:
            '本页桌规允许。禁止叫墩总数等于本手总墩数，是另一种可选限制，这里不启用。',
        },
        {
          question: '可以叫0墩或Nil吗？',
          answer:
            '本页入门规则只叫1至17墩。Nil是特殊的零墩任务，不是普通叫0；想启用它，应先约定奖励、失败罚分和失败后赢墩是否计袋，各公开版本并不一致。',
        },
        {
          question: '能在这里三人在线联机吗？',
          answer:
            '本页提供桌面玩法和固定算分例子，不创建Spades房间或连接玩家。请用自己的纸牌与记分纸按本页约定游玩。',
        },
      ],
      externalLinks: [
        {
          href: 'https://vipspades.com/',
          label: 'VIP Spades：Spades for Three牌组',
          description:
            '支持移除梅花2、三人各发17张并单打的设置；未整套采用其其他模式计分。',
        },
        {
          href: 'https://www.pagat.com/auctionwhist/spades.html#three',
          label: 'Pagat：三人Spades规则',
          description:
            '核对三人出牌、首攻与不同计分版本；其主要超墩罚分法与本页选择不同。',
        },
        {
          href: 'https://www.trickstercards.com/help/spades-rules/',
          label: 'Trickster Cards：Spades选项',
          description:
            '说明单打、失败叫墩、袋数与Nil的可选设置，不能当作所有桌子的统一默认值。',
        },
      ],
      ctaLabel: '浏览小游戏',
      ctaDescription:
        '想换一种桌面活动，可以看看相关Euchre策略或Categories题目指南。',
    },
  },
};
