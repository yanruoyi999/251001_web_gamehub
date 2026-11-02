import type { Locale } from '@/i18n/config';
import type {
  SeoLandingPage,
  SeoLandingSection,
} from '@/lib/seo-landing-content';

/** Fixed original authored examples, not a user-input calculator. Ordinary bids only; Nil is separate. */
export const SPADES_SCORING_EXAMPLES = [
  {
    partnerBids: [4, 2],
    taken: 8,
    previousScore: 0,
    previousBags: 0,
    handPoints: 62,
    bagPenalty: 0,
    nextScore: 62,
    nextBags: 2,
  },
  {
    partnerBids: [5, 3],
    taken: 5,
    previousScore: 160,
    previousBags: 0,
    handPoints: -80,
    bagPenalty: 0,
    nextScore: 80,
    nextBags: 0,
  },
  {
    partnerBids: [2, 2],
    taken: 8,
    previousScore: 237,
    previousBags: 7,
    handPoints: 44,
    bagPenalty: 100,
    nextScore: 181,
    nextBags: 1,
  },
] as const;

function exampleSections(locale: Locale): SeoLandingSection[] {
  const [made, set, carry] = SPADES_SCORING_EXAMPLES;
  const madeBid = made.partnerBids[0] + made.partnerBids[1];
  const setBid = set.partnerBids[0] + set.partnerBids[1];
  const carryBid = carry.partnerBids[0] + carry.partnerBids[1];
  if (locale === 'en')
    return [
      {
        title: `1. Bid ${madeBid}, take ${made.taken}: ${made.handPoints} points and ${made.nextBags} bags`,
        body: `Mira and Owen bid ${made.partnerBids[0]} and ${made.partnerBids[1]}. Their contract is ${madeBid}. Together they take ${made.taken} tricks, so the contract earns ${madeBid * 10} points and the ${made.nextBags} extras add ${made.nextBags} points: ${madeBid * 10} + ${made.nextBags} = ${made.handPoints}. Record ${made.nextBags} new bags as well. Add ${made.handPoints} to their previous score, then check whether the bag total triggers a deduction.`,
      },
      {
        title: `2. Bid ${setBid}, take ${set.taken}: minus ${-set.handPoints} points`,
        body: `The same team bids ${set.partnerBids[0]} and ${set.partnerBids[1]} but takes only ${set.taken} tricks. Under this guide’s agreement, the hand is −${-set.handPoints}. Do not award ${set.taken * 10} for the ${set.taken} tricks or subtract only the ${setBid - set.taken}-trick shortfall. If their previous score was ${set.previousScore}, write ${set.previousScore} − ${-set.handPoints} = ${set.nextScore}. Existing bags remain on the record.`,
      },
      {
        title: `3. ${carry.previousBags} old bags, ${carry.taken - carryBid} new bags: carry ${carry.nextBags} forward`,
        body: `The team begins at ${carry.previousScore} points with ${carry.previousBags} bags. It bids ${carryBid} and takes ${carry.taken}, adding ${carry.handPoints} hand points and ${carry.taken - carryBid} bags. ${carry.previousBags + carry.taken - carryBid} bags cross the ten-bag threshold once: ${carry.previousScore} + ${carry.handPoints} − ${carry.bagPenalty} = ${carry.nextScore}. Keep ${carry.nextBags} bag for the next hand. The ${carry.handPoints} already includes the overtrick points; adding those ${carry.taken - carryBid} points again would count them twice. For larger totals, apply the deduction for every complete group of ten bags.`,
      },
    ];
  return [
    {
      title: `例一：合叫${madeBid}墩，拿${made.taken}墩，得${made.handPoints}分并新增${made.nextBags}袋`,
      body: `米拉叫${made.partnerBids[0]}，欧文叫${made.partnerBids[1]}，全队合约为${madeBid}墩。两人一共拿${made.taken}墩，合约部分得${madeBid * 10}分，超出的${made.nextBags}墩再加${made.nextBags}分，所以本手${madeBid * 10}＋${made.nextBags}＝${made.handPoints}分，并新增${made.nextBags}袋。先把${made.handPoints}加到原有总分，再检查新袋数是否触发罚分。`,
    },
    {
      title: `例二：合叫${setBid}墩，只拿${set.taken}墩，本手扣${-set.handPoints}分`,
      body: `两人这次分别叫${set.partnerBids[0]}和${set.partnerBids[1]}，却合计只拿${set.taken}墩。按本页选定的约定，这手记−${-set.handPoints}分，不能按已经拿到的${set.taken}墩给${set.taken * 10}分，也不能只扣少拿的${setBid - set.taken}墩。假设原来${set.previousScore}分，新总分就是${set.previousScore}−${-set.handPoints}＝${set.nextScore}；原有袋数仍留在记录中。`,
    },
    {
      title: `例三：原有${carry.previousBags}袋又新增${carry.taken - carryBid}袋，扣一次${carry.bagPenalty}并留下${carry.nextBags}袋`,
      body: `全队原来${carry.previousScore}分、${carry.previousBags}袋。这手叫${carryBid}墩、拿${carry.taken}墩，本手先得${carry.handPoints}分并新增${carry.taken - carryBid}袋。${carry.previousBags}＋${carry.taken - carryBid}＝${carry.previousBags + carry.taken - carryBid}袋，越过一次10袋门槛：${carry.previousScore}＋${carry.handPoints}−${carry.bagPenalty}＝${carry.nextScore}分。余下${carry.nextBags}袋继续累计。${carry.handPoints}分已经包含${carry.taken - carryBid}个超墩的加分，不能再额外加一次${carry.taken - carryBid}分。若累计袋数更高，就按每满10袋扣一次，最后保留不足10袋的余数。`,
    },
  ];
}

export const SPADES_SCORING_GUIDE: SeoLandingPage = {
  slug: 'spades-scoring',
  primaryKeyword: 'spades scoring',
  keywords: [
    'spades scoring',
    'spades scoring rules',
    'spades bags scoring',
    'spades nil scoring',
  ],
  updatedAt: '2026-11-02T07:56:48+08:00',
  relatedSlugs: ['three-player-spades', 'euchre-strategy'],
  indexable: true,
  locales: {
    en: {
      metaTitle: 'Spades Scoring: Four-Player Bids, Bags and Nil',
      metaDescription:
        'Check four-player partnership Spades scoring with a quick reference, three worked examples, bag carryover and Nil notes. Agree on your table’s rules first.',
      heading: 'Spades Scoring: Four-Player Bids, Bags and Nil',
      subheading:
        'A four-player partnership reference with three worked examples.',
      overview: [
        'For four-player partnership Spades, start with the two partners’ bids and the tricks they actually took. Keep that hand’s points separate from the running game score and bag count. Writing all three down makes a surprising score easier to check.',
        'This guide uses the partnership convention described by Pagat: a made contract scores ten times the bid, with one point for each overtrick; a missed contract loses ten times the bid. Every ten accumulated bags costs 100 points. Check the agreement before the first deal, because published rules differ.',
      ],
      sections: [
        {
          title: 'Quick scoring reference',
          body: 'There are two teams and thirteen tricks in a hand. The first two rules below cover ordinary positive bids without Nil. Add the partners’ bids to get the team contract; do not score each partner’s ordinary bid as a separate contract. Keep the bid written down until the hand is settled. Counting what happened afterward is easier than reconstructing what everyone originally promised.',
          bullets: [
            'Made positive bid: ten times the team bid, plus one point and one bag per extra trick.',
            'Missed positive bid: subtract ten times the team bid; this missed contract adds no bags.',
            'Every complete group of ten accumulated bags: subtract 100, remove ten bags and retain the remainder.',
            'Nil: settle its bonus or penalty separately; use the agreement below.',
          ],
        },
        ...exampleSections('en'),
        {
          title: 'Keep Nil separate from the partner’s bid',
          body: 'An ordinary Nil is a player’s promise to take no tricks. In the convention used here, success adds 100 points and failure subtracts 100; the partner’s contract is still settled. Failed-Nil tricks do not rescue that partner’s contract and count toward the team’s bags under Pagat’s usual rule. Agree how your table records those tricks before play. Blind Nil is optional, not automatically enabled by these examples. If your group uses it, confirm eligibility, card exchanges and scoring first. Published Nil and bag options vary; do not insert a new bonus halfway through a game.',
        },
        {
          title: 'Use a record you can audit',
          body: 'For each team, keep columns for previous score, previous bags, bid, tricks, hand points, bag deduction, new score and carried bags. Mark any Nil beside the player who declared it. Count all thirteen tricks across both teams before accepting the totals. Read the finished row aloud, resolve a discrepancy while the hand is still understandable, then start a new row.',
        },
      ],
      recommendations: [],
      faqs: [
        {
          question: 'Why does another guide give zero for a missed bid?',
          answer:
            'Bicycle’s explanation uses zero for a broken contract. This page uses the negative-contract convention above. Choose one before dealing; neither instruction should silently replace the other.',
        },
        {
          question: 'Do bags disappear after a penalty?',
          answer:
            'Remove only the ten that caused that deduction. Example three carries one forward.',
        },
        {
          question: 'Is this the three-player game?',
          answer:
            'This is four-player partnership scoring. For the separate solo, seventeen-trick setup, use the three-player Spades guide. Keep its declared house rules separate.',
        },
      ],
      externalLinks: [
        {
          href: 'https://www.pagat.com/auctionwhist/spades.html',
          label: 'Pagat: four-player partnership scoring and variants',
          description:
            'The declared positive-contract, bags and Nil convention used here; its optional rules are not all enabled.',
        },
        {
          href: 'https://bicyclecards.com/how-to-play/spades/',
          label: 'Bicycle: a different missed-contract convention',
          description:
            'This explanation scores a broken contract as zero. Do not merge that choice into this page’s negative-contract examples.',
        },
      ],
      ctaLabel: 'Browse browser games',
      ctaDescription:
        'The related three-player guide is a separate solo setup. Euchre is another partnership card game with different bidding and scoring; do not apply these Spades scores to it.',
    },
    zh: {
      metaTitle: '四人搭档Spades怎么算分：叫墩、袋子与Nil',
      metaDescription:
        '四人搭档Spades计分参考，附合约成功与失败、累计袋数进位的三个原创例子，说明Nil独立结算及不同桌规的差异。先约定再记分。',
      heading: '四人搭档Spades怎么算分：叫墩、袋子与Nil',
      subheading: '四人搭档计分参考，三个例子把一手账算清。',
      overview: [
        '四人搭档Spades先看两名伙伴合计叫了几墩，再看他们实际拿了几墩。本手得分、累计总分、累计袋数要分开记。有人对结果有疑问时，留下这三项比只报一个总分更容易核对。',
        '本页采用 Pagat介绍的常见四人搭档约定：完成合约得叫墩数的十倍，每个超墩再加1分；未完成扣叫墩数的十倍。超墩同时记袋，累计每满10袋扣100分。各处公开规则并不完全相同，请在发牌前约定好。',
      ],
      sections: [
        {
          title: '快速计分参考',
          body: '四个人组成两队，一手共有13墩。下方前两条只用于没有Nil的普通正数叫墩：把两名伙伴的叫墩加起来，作为一个团队合约，不分别结算两个普通合约。原始叫墩数要保留到这一手结算完。先写清大家叫过什么，再记录结果，不要打完后凭记忆改叫墩。',
          bullets: [
            '完成正数合约：叫墩数×10，每个超墩再加1分并记1袋。',
            '未完成正数合约：扣叫墩数×10，这次未完成的普通合约不新增袋数。',
            '累计袋数每满10：扣100分、去掉10袋，余数继续累计。',
            '有人叫Nil：单独结算奖励或罚分，按下方约定处理。',
          ],
        },
        ...exampleSections('zh'),
        {
          title: 'Nil和伙伴合约分开结算',
          body: '普通Nil是某一位玩家承诺自己一墩也不拿。本页采用成功加100、失败扣100的约定；伙伴的合约仍要另外结算。按Pagat所述常见规则，失败Nil玩家拿到的墩不能替伙伴补足合约，但会计入全队袋数。开局前应说清这类墩如何记账。 Blind Nil（盲叫零墩）是可选变体，不会因为看了本页例子就自动启用。若要使用，先确认谁能叫、能否换牌，以及成功和失败各记多少分。Nil和袋子有多种公开选项，不要打一半临时增加奖励。',
        },
        {
          title: '留下一行能复算的记录',
          body: '每队可以依次写：原总分、原袋数、本手叫墩、实得墩、本手分、袋子罚分、新总分、剩余袋数。有人叫Nil，就另记在该玩家名下。两队拿墩合计应为13，再确认分数。把整行读给同桌核对，趁这一手还记得清楚时解决差异，下一手另起一行。',
        },
      ],
      recommendations: [],
      faqs: [
        {
          question: '为什么别的说明说没完成合约记0？',
          answer:
            'Bicycle的计分说明确实采用未完成记0；本页采用上面声明的扣分约定。请先选定一种，不能结算时悄悄换用另一种。',
        },
        {
          question: '罚过100分以后，袋数全部归零吗？',
          answer: '只去掉触发这次罚分的10袋，余数保留；例三留下1袋。',
        },
        {
          question: '这也是三人Spades的计分法吗？',
          answer:
            '本页针对四人搭档。三人各自记分、每手17墩的设置请看三人Spades指南，并单独遵守那篇已经声明的桌规。\n\n到指南目录查看其他明确标注玩法的桌面游戏参考。',
        },
      ],
      externalLinks: [
        {
          href: 'https://www.pagat.com/auctionwhist/spades.html',
          label: 'Pagat：四人搭档计分与变体',
          description:
            '本页采用的正数合约、袋子与Nil约定来源；未整套启用其所有可选规则。',
        },
        {
          href: 'https://bicyclecards.com/how-to-play/spades/',
          label: 'Bicycle：未完成合约记0的不同约定',
          description: '该说明将未完成合约记0，不能与本页采用扣分的例子混用。',
        },
      ],
      ctaLabel: '浏览小游戏',
      ctaDescription:
        '三人指南采用独立单打桌规。相关Euchre指南是另一种搭档牌戏，叫墩与计分规则不同，不能套用本页Spades分数。',
    },
  },
};
