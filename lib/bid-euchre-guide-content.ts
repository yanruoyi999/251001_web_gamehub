import type { SeoLandingPage } from '@/lib/seo-landing-content';

const soloValues = { 'call-two': 12, 'call-one': 18, moonshot: 24 } as const;
type Contract = number | keyof typeof soloValues;

export function scoreOntarioBidEuchreHand(contract: Contract, tricks: number) {
  const isOrdinary = typeof contract === 'number';
  const bidders = isOrdinary
    ? (tricks >= contract ? tricks : -contract)
    : (tricks === 8 ? soloValues[contract] : -soloValues[contract]);
  return { bidders, defenders: 8 - tricks };
}

const pagatRules = 'https://www.pagat.com/euchre/bideuch.html';

export const BID_EUCHRE_GUIDE: SeoLandingPage = {
  slug: 'bid-euchre-rules',
  primaryKeyword: 'bid euchre rules',
  keywords: ['bid euchre rules', 'bid euchre scoring'],
  updatedAt: '2026-11-18T00:00:00.000Z',
  indexable: false,
  relatedSlugs: ['euchre-strategy', '500-card-game-rules'],
  locales: {
    en: {
      metaTitle: 'Bid Euchre Rules & Scoring (Ontario Four-Player Version)',
      metaDescription: 'Learn Bid Euchre with a 32-card double deck. Make a bid, follow suit, and practise scoring three hands under the Ontario 55+ rules.',
      heading: 'Bid Euchre Rules and Scoring',
      subheading: 'Ontario 55+ four-player version, with three scoring exercises.',
      overview: [
        'Four players form two partnerships. Players compete to name trump by bidding how many tricks they can win. Classic Euchre starts by turning up a card. In this version of Bid Euchre, the winning bidder chooses a suit or no trump.',
      ],
      sections: [
        {
          title: 'Deal eight cards to each player',
          body: 'Sit opposite your partner. Take J, Q, K and A of each suit from two decks for 32 cards. Deal them one by one clockwise, starting on the dealer’s left, until everyone has eight. There is no kitty.',
        },
        {
          title: 'Bid once, starting left of the dealer',
          body: 'On your turn, pass or state a number of tricks and a trump suit or no trump. Start at two tricks. To beat an ordinary bid, name a higher number. The winning bidder leads the first trick. For an Ontario game, confirm the table’s all-pass procedure before the deal.',
        },
        {
          title: 'Follow suit and count eight tricks',
          body: 'Follow the led suit if you can. When you have none, you may play any card. The highest trump wins, or the highest card of the led suit if nobody trumps. With identical high cards, the first one played wins. The trick winner leads next.',
          bullets: [
            'With trump, the jack of that suit is highest. Next is the other jack of the same colour, which counts as trump for following suit. Then come A, K and Q of trump.',
            'In no trump, each card keeps its printed suit and the order in each suit is A, K, Q, J.',
          ],
        },
        {
          title: 'Score each side',
          body: 'For an ordinary bid that succeeds, the bidders get one point per trick they actually took, including extra tricks. If they miss, subtract the number bid. The defence adds one point per trick regardless of whether the bid succeeds.',
          bullets: [
            'Call two, call one and moonshot are solo attempts to win all eight tricks. For a call, discard the named number of cards and get that many from your partner. For moonshot, keep your dealt hand. The partner sits out.',
            'A solo success adds 12, 18 or 24 points respectively. A miss subtracts that same amount. The defence still scores its tricks.',
          ],
        },
        {
          title: 'Finish a game and check your house rules',
          body: 'The Ontario Senior Games rules published in March 2024 use eight hands, giving everyone two deals. Add the hand scores to decide the winner. Event standings use separate tournament points. Some groups use 48 cards or award only the bid on a success. Confirm the current rules with your event organizer.',
        },
      ],
      recommendations: [],
      faqs: [
        { question: 'What if a five-trick bid takes six?', answer: 'The bidders get +6 and the defence gets +2 in the Ontario rules.' },
        { question: 'Does the other same-colour jack count as trump?', answer: 'Yes, when a suit is trump. In a no-trump hand both jacks keep their printed suits.' },
      ],
      externalLinks: [
        { href: pagatRules, label: 'Pagat’s Bid Euchre rules and variants', description: 'See the 32-card Barrie rules and duplicate-card play. The Barrie game ends at a target score.' },
      ],
      ctaLabel: 'Browse more games',
      ctaDescription: 'Explore more games and card rules on Luma Game Hub.',
    },
    zh: {
      metaTitle: 'Bid Euchre 叫牌与计分规则（安大略四人版）',
      metaDescription: '用 32 张双副牌玩四人 Bid Euchre，掌握叫牌、跟花和结算，练完三道安大略 55+ 赛制计分题。',
      heading: 'Bid Euchre 叫牌与计分规则',
      subheading: '安大略 55+ 四人版，附三道计分练习。',
      overview: [
        '四人分两队，队友相对而坐。玩家竞叫自己能拿的墩数，赢得叫牌的人选主花色或无主。标准 Euchre 从翻牌定主开始，这一版 Bid Euchre 由竞叫决定。',
      ],
      sections: [
        {
          title: '每人发八张牌',
          body: '用两副牌各取出每个花色的 J、Q、K、A，共 32 张。从发牌人左手开始顺时针逐张发，每人八张，桌中央没有底牌。',
        },
        {
          title: '每人只叫一次',
          body: '同样从发牌人左手开始。轮到时可以过牌，也可以报墩数加主花色或无主，最低叫两墩。普通叫牌用更高墩数压过前一家，最高叫牌者领出首墩。安大略牌局里若无人叫牌，先向当桌确认处理方式。',
        },
        {
          title: '按花色跟牌，打八墩',
          body: '手里有领出的花色就必须跟，缺门可以出任意一张。有主牌时最大主牌赢，否则由领出花色的最大牌赢。两张同样大的牌，先打的赢。拿到这墩的人领下一墩。',
          bullets: [
            '有主时，主花色的 J 最大，其次是同色另一门的 J。后者跟花时也归主花色。之后按主花色 A、K、Q 排列。',
            '无主时，牌面花色不变。每个花色从大到小是 A、K、Q、J。',
          ],
        },
        {
          title: '分别结算叫牌方和防守方',
          body: '普通定约成功，叫牌方按实际拿到的墩数加分，超出的墩也算。失败就扣叫牌墩数。防守方始终每拿一墩加一分。',
          bullets: [
            '叫换两张、叫换一张和月亮叫牌，都是独打拿齐八墩。前两种先丢掉指定数量的牌，再从队友手里拿同样数量。月亮叫牌用原手牌。队友三种都不上场。',
            '三种独打成功分别加 12、18、24 分。失败扣对应分值，防守方照常按墩加分。',
          ],
        },
        {
          title: '一场打完再比较总分',
          body: '安大略 55+ 赛事在 2024 年 3 月公布的规则是一场打八手，每人当两次发牌员，按每手得分累加决定胜负。赛事排名积分另计。有的地方用 48 张牌，也有成功时只加叫牌墩数的版本。参加赛事前请向组织者确认当届规则。',
        },
      ],
      recommendations: [],
      faqs: [
        { question: '叫五墩拿六墩，双方得几分？', answer: '按安大略规则，叫牌方加六分，防守方加两分。' },
        { question: '同色另一门的 J 算主牌吗？', answer: '指定主花色时算主牌。无主时，J 仍按牌面花色跟牌。' },
      ],
      externalLinks: [
        { href: pagatRules, label: 'Pagat 的 Bid Euchre 规则与变体', description: '可核对 Barrie 的 32 张牌和同张牌赢墩规则。Barrie 打到目标分数才结束。' },
      ],
      ctaLabel: '浏览更多游戏',
      ctaDescription: '探索 Luma Game Hub 的其他游戏和纸牌规则。',
    },
  },
};
