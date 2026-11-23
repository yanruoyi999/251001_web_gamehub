import type { SeoLandingPage } from '@/lib/seo-landing-content';

export const primieraValues = { A: 16, 2: 12, 3: 13, 4: 14, 5: 15, 6: 18, 7: 21, J: 10, Q: 10, K: 10 } as const;

type Rank = keyof typeof primieraValues;
type BestCards = readonly [Rank | null, Rank | null, Rank | null, Rank | null];
type Pile = {
  cards: number;
  coins: number;
  sevenOfCoins: boolean;
  sweeps: number;
  bestCards: BestCards;
};
type Hand = readonly [Pile, Pile];

export const scopaHands = [
  [
    { cards: 12, coins: 4, sevenOfCoins: true, sweeps: 0, bestCards: [7, 4, 7, null] },
    { cards: 28, coins: 6, sevenOfCoins: false, sweeps: 1, bestCards: [6, 7, 6, 7] },
  ],
  [
    { cards: 16, coins: 1, sevenOfCoins: false, sweeps: 0, bestCards: [4, 7, 7, 6] },
    { cards: 24, coins: 9, sevenOfCoins: true, sweeps: 2, bestCards: [7, 'A', 'A', 7] },
  ],
] as const satisfies readonly Hand[];

function getPrimiera(cards: BestCards) {
  let total = 0;
  for (const card of cards) {
    if (card === null) return null;
    total += primieraValues[card];
  }
  return total;
}

export function scoreScopaHand(hand: Hand) {
  const primes = hand.map(pile => getPrimiera(pile.bestCards));

  return hand.map((pile, index) => {
    const opponent = index === 0 ? 1 : 0;
    const prime = primes[index];
    const otherPrime = primes[opponent];
    const points = {
      cards: Number(pile.cards > hand[opponent].cards),
      coins: Number(pile.coins > hand[opponent].coins),
      sevenOfCoins: Number(pile.sevenOfCoins),
      primiera: Number(prime !== null && (otherPrime === null || prime > otherPrime)),
      sweeps: pile.sweeps,
    };
    return { prime, points, total: Object.values(points).reduce((sum, value) => sum + value, 0) };
  });
}

const reference = 'https://www.pagat.com/fishing/scopa.html';

export const SCOPA_GUIDE: SeoLandingPage = {
  slug: 'scopa-card-game-rules',
  primaryKeyword: 'scopa card game rules',
  keywords: ['scopa card game rules', 'how to play scopa', 'scopa primiera scoring'],
  updatedAt: '2026-11-23T00:00:00.000Z',
  documentationCheckedAt: '2026-11-23',
  indexable: false,
  relatedSlugs: ['gin-rummy-rules', 'crazy-eights-rules', 'cribbage-scoring-chart'],
  locales: {
    en: {
      metaTitle: 'Scopa Card Game Rules and Primiera Scoring Practice',
      metaDescription: 'Learn two-player Scopa, from matching table cards to scoring Primiera, then work through two original deals with a missing suit and a tie.',
      heading: 'Scopa Card Game Rules and Scoring',
      subheading: 'Learn the standard two-player rules and score two original deals.',
      overview: [
        'Scopa is an Italian card game where you play one card at a time to gather cards from the table. Collect cards and coins, watch for the seven of coins, and score a point when you sweep the table. This guide uses the basic rules documented by Pagat.',
      ],
      sections: [
        {
          title: 'Set up a 40-card deck',
          body: 'Use an Italian deck, or remove the 8s, 9s, 10s and jokers from a standard deck. Diamonds stand for coins, hearts for cups, clubs for batons and spades for swords. For capture, an ace counts as 1, cards from 2 to 7 use their ranks, and J, Q and K count as 8, 9 and 10.',
        },
        {
          title: 'Deal three cards each and four to the table',
          body: 'Deal three cards to each player and put four face up in the middle. If the table starts with at least three kings, shuffle and redeal. The non-dealer goes first. When both players have played all three cards, deal three more each without adding cards to the table. Alternate who deals each hand.',
        },
        {
          title: 'Match one card before looking for a sum',
          body: 'Play one card. If a table card has the same value, take one exact match, even if several other cards add to that value. For example, when the table has 5, 2 and 3 and you play a 5, take the table’s 5. Without an exact match, take a group with the right sum if there is one. If neither capture is possible, leave the played card on the table. When you capture, both the played card and the captured cards join your pile.',
        },
        {
          title: 'Finish the hand and award points',
          body: 'Clearing the table on a capture usually earns one scopa point. The final play cannot earn that point. After the last play, the player who captured most recently takes any remaining table cards without scoring a sweep for them. Add one point each for most cards, most coins, holding the seven of coins (settebello) and the best Primiera, plus your sweeps. Ties for cards or coins award no point. Play to at least 11 across completed hands. If both reach the target, the higher total wins. If totals tie at the target, play another hand.',
        },
        {
          title: 'Calculate Primiera from the best card in each suit',
          body: 'Primiera uses its own values. A 7 is worth 21, a 6 is 18, an ace is 16, and 5, 4, 3 and 2 are worth 15, 14, 13 and 12. Face cards are worth 10. Take the highest-valued card in each suit from your capture pile. Under these rules, a missing suit makes the pile ineligible and an equal total between two eligible piles earns neither player a point.',
        },
      ],
      recommendations: [],
      faqs: [
        { question: 'Does a missing suit count as zero for Primiera?', answer: 'In the basic rules used here, you need a card of every suit to qualify. A partial sum does not compete with a complete Primiera.' },
        { question: 'Are the seven of coins and Primiera scored separately?', answer: 'Yes. Capturing the seven of coins earns its own point. It can also be your highest-valued coin for the Primiera calculation.' },
        { question: 'Can you play a card that leaves a legal capture on the table?', answer: 'You may choose what to play, but in basic Scopa you must take a legal capture when the card you play makes one.' },
      ],
      externalLinks: [{ href: reference, label: 'Pagat’s basic Scopa rules', description: 'The deck, captures, scoring and regional variants.' }],
      ctaLabel: 'Browse more games',
      ctaDescription: 'Try more card games and scoring guides on Luma Game Hub.',
    },
    zh: {
      metaTitle: 'Scopa 纸牌规则与 Primiera 计分练习',
      metaDescription: '学习双人 Scopa 的发牌、抓牌和清桌规则，实算缺一门花色与 Primiera 同分的两手原创牌例。',
      heading: 'Scopa 纸牌规则与计分',
      subheading: '先学普通双人玩法，再独立结算两手原创牌。',
      overview: [
        'Scopa 是一种意大利纸牌游戏。每次出一张牌，从桌上抓取同点牌或符合点数和的一组牌。比总抓牌数、钱币牌数，还要留意钱币 7 和清桌机会。本页采用 Pagat 记载的普通规则。',
      ],
      sections: [
        {
          title: '准备 40 张牌',
          body: '用意大利纸牌，或从一副普通扑克牌里去掉 8、9、10 和大小王。方块是钱币，红桃是杯，梅花是棍棒，黑桃是宝剑。抓牌时 A 算 1，2 到 7 按牌面，J、Q、K 分别算 8、9、10。',
        },
        {
          title: '每人三张，桌面四张',
          body: '每人发三张手牌，桌面公开摆四张。若桌上至少有三个 K，收回洗牌重发。非发牌者先出，双方交替。两人手牌打完后各补三张，不向桌面补牌；一手全部打完后交换发牌人。',
        },
        {
          title: '先抓同点，再考虑点数和',
          body: '每轮出一张牌。桌上若有同点牌，必须抓一张同点牌。例如桌上有 5、2、3，出 5 必须抓桌上的 5。没有同点牌，但有一组牌的点数和相同，就抓该组；有多组时任选一组。两种都不成立，就把出牌留在桌上。成功抓牌时，把自己出的牌和抓到的牌一起放进抓牌堆。',
        },
        {
          title: '手牌打完后逐项结算',
          body: '抓空桌面通常记一次清桌，得 1 分，末次出牌例外。桌上余牌归最后抓过牌的一方，这次收余牌不计清桌。总牌数最多、钱币最多、持有钱币 7 和赢得 Primiera 各值 1 分，再加自己的清桌分。牌数或钱币数若平分，该项无人得分。完整一手后，累计至少到 11 分才可获胜。若双方达到目标，分高者胜；同分再打一手。',
        },
        {
          title: '从每门花色挑一张最佳牌',
          body: 'Primiera 的分值独立于抓牌点数。7 值 21，6 值 18，A 值 16，5、4、3、2 分别值 15、14、13、12，J、Q、K 都值 10。从抓牌堆每门选一张价值最高的牌再求和。本版缺一门花色就失去资格；双方都有四门且总值相同时，该项无人得分。',
        },
      ],
      recommendations: [],
      faqs: [
        { question: '缺一门花色可以记零继续比 Primiera 吗？', answer: '本页普通规则要求集齐四门。缺花色的部分和不参与比较。' },
        { question: '钱币 7 的分和 Primiera 分可以都拿吗？', answer: '可以。抓到钱币 7 单独得 1 分，它也可以作为 Primiera 的钱币牌参与四门求和。' },
        { question: '出牌后有牌可抓，能主动不抓吗？', answer: '你可以另选手牌，但按普通规则，若打出的牌能合法抓牌，就必须抓取。' },
      ],
      externalLinks: [{ href: reference, label: 'Pagat 普通 Scopa 规则', description: '核对牌组、抓牌、计分及地区变体。' }],
      ctaLabel: '浏览更多游戏',
      ctaDescription: '在 Luma Game Hub 发现更多纸牌玩法和计分指南。',
    },
  },
};
