import type { SeoLandingPage } from '@/lib/seo-landing-content';

export const FIVE_HUNDRED_GUIDE: SeoLandingPage = {
  slug: '500-card-game-rules',
  primaryKeyword: '500 card game rules',
  keywords: ['500 card game rules', '500 card game scoring', 'how to play five hundred'],
  updatedAt: '2026-11-18T00:00:00.000Z',
  indexable: false,
  relatedSlugs: ['euchre-strategy', 'three-player-spades'],
  locales: {
    en: {
      metaTitle: '500 Card Game Rules and Scoring: Four-Player Five Hundred',
      metaDescription: 'Play four-player Australian Five Hundred. Set up the 43-card deck, bid, follow suit and check your score with a chart and two practice hands.',
      heading: '500 Card Game Rules and Scoring',
      subheading: 'Four-player Australian Five Hundred, with a scoring table and two practice hands.',
      overview: [
        'Five Hundred is a trick-taking card game for two partnerships. Bid on how many of the ten tricks your team can win, choose trump, then play to make the contract. This guide uses one Australian four-player ruleset. Rummy 500 is a separate game.',
      ],
      sections: [
        {
          title: 'Set up the 43-card deck',
          body: 'Sit opposite your partner. Keep 4–A in hearts and diamonds, 5–A in spades and clubs, and one joker. Deal ten cards to each player and three face down in the middle as the kitty. The deal moves clockwise after each hand.',
        },
        {
          title: 'Bid from six tricks up',
          body: 'Start to the dealer’s left. Bid 6–10 tricks with a trump suit or no trump, or pass. At the same trick count, bids rise in this order: spades, clubs, diamonds, hearts, no trump. A higher trick count outranks a lower one. A pass ends your participation in this auction. Continue until only the high bidder remains. If all four pass, deal again with the next dealer.',
          bullets: [
            'Misère is a solo bid to lose every trick. In this version, it can be bid once the auction reaches a seven-trick bid and ranks between 7 no trump and 8 spades.',
            'Open Misère also requires losing every trick. Your cards go face up after the first trick. It ranks between 10 diamonds and 10 hearts and may open the auction.',
          ],
        },
        {
          title: 'Use the kitty and play ten tricks',
          body: 'The high bidder privately takes the kitty and discards any three cards face down. The bidder leads the first trick. Each player must follow the suit led if able and may play any card when void. The highest trump wins the trick, or the highest card in the suit led if no trump was played. The winner leads next. In either Misère contract, the bidder’s partner sits out.',
          bullets: [
            'In a suit contract the joker is highest, followed by the jack of trump and then the other jack of the same colour. These three cards belong to trump for following suit. Below them, the trump suit runs from ace down to its lowest card.',
            'With no trump or in Misère, the bidder can assign a joker they hold to a suit before the first lead. It becomes that suit’s highest card. An unassigned joker wins its trick but can be played on another player’s lead only when void in the suit led. In Misère it must then be played. When leading an unassigned joker, call a suit that has not been led yet, except that you can lead it to the last trick even after all suits have been led.',
          ],
        },
        {
          title: 'Score each hand and check the game result',
          body: 'Add the contract value if the bidding team reaches its trick target and subtract it if they fall short. For suit and no-trump contracts, the defending team gets 10 per trick either way. Winning extra tricks adds nothing unless the bidding team sweeps all ten on a contract worth below 250. Then the sweep is worth 250.',
          bullets: [
            'Misère is worth +250 or −250; Open Misère is worth +500 or −500. The bidder must lose all ten tricks to earn the positive score. Defenders score zero in either case.',
            'Win by making your own contract with a total of at least 500. Reaching 500 while defending keeps the game going. A team that falls to −500 or lower loses.',
          ],
        },
        {
          title: 'Agree on regional rules before you deal',
          body: 'Some US rules use one round of bidding, call the lose-every-trick bid Nullo and let a team win on defence by crossing 500. Agree on the bidding, joker, slam and endgame rules before starting. The table and exercises here use the Australian rules above.',
        },
      ],
      recommendations: [],
      faqs: [
        { question: 'What is 7 hearts worth in Five Hundred?', answer: 'The 7♥ contract value is 200. Seven, eight or nine tricks earn +200; fewer than seven cost 200; taking all ten earns +250 under this Australian ruleset.' },
        { question: 'Can four people play with a standard deck?', answer: 'Yes. Remove the 2s and 3s and both black 4s, and add one joker. That leaves 43 cards.' },
      ],
      externalLinks: [
        { href: 'https://www.pagat.com/euchre/500.html', label: 'Pagat’s Five Hundred rules', description: 'Australian rules, score values and regional variants.' },
        { href: 'https://www.trickstercards.com/help/500/', label: 'Trickster Cards’ 500 basics', description: 'Compare Australian and US settings.' },
      ],
      ctaLabel: 'Browse more games',
      ctaDescription: 'Explore more games and card rules on Luma Game Hub.',
    },
    zh: {
      metaTitle: '500 扑克牌规则和计分：四人 Five Hundred',
      metaDescription: '用 43 张牌玩澳式四人 Five Hundred。掌握发牌、叫牌、跟花和计分，用计分表和两道牌例核对结果。',
      heading: '500 扑克牌规则和计分',
      subheading: '澳式四人 Five Hundred，附计分表和两道练习。',
      overview: [
        'Five Hundred 是四人两队的赢墩牌戏。两队叫牌争取定主，承诺拿下十墩中的若干墩，再按实际牌局结算。本页用一套澳式四人规则。Rummy 500 是另一种牌戏。',
      ],
      sections: [
        {
          title: '43 张牌，两人一队',
          body: '队友相对而坐。红桃和方块保留 4 到 A，黑桃和梅花保留 5 到 A，再加一张鬼牌。每人发十张，桌中央扣三张底牌。每局结束后顺时针换发牌人。',
        },
        {
          title: '从六墩开始叫牌',
          body: '发牌人左手开始。可叫 6–10 墩，指定主花色或无主，也可以过。同样墩数时，从低到高依次为黑桃、梅花、方块、红桃、无主；更多墩数优先。过牌后本轮不能再叫。最后未过的最高叫牌者拿下定约。全员都过则由下一位重发。',
          bullets: [
            'Misère 是独打并输掉每一墩。本玩法中，叫牌达到七墩后可叫 Misère，顺位在七无主与八黑桃之间。',
            'Open Misère 同样要输掉所有墩，首墩结束后亮出手牌。它排在十方块与十红桃之间，也可作为首叫。',
          ],
        },
        {
          title: '换底牌，再打十墩',
          body: '最高叫牌者私下收起三张底牌，再扣回任意三张并领出首墩。有领出花色就必须跟花，缺门可以出任意牌。有主牌时最大的主牌赢墩，否则由领出花色的最大牌赢。赢墩者领下一墩。两种 Misère 定约中，叫牌者的队友退出这局。',
          bullets: [
            '有主时，鬼牌最大，其次是主花色 J、同色另一门的 J。这三张都算主牌，跟花时也一样。之后是主花色的 A、K、Q 等。',
            '在无主或 Misère 中，叫牌者若持有鬼牌，可在领首墩前为它指定花色，它随即成为该花色最大牌。未指定的鬼牌能赢该墩，但在别人领出时只能缺门才打，在 Misère 中缺门必须打。用未指定的鬼牌领出时要指定尚未被领出的花色，最后一墩例外。',
          ],
        },
        {
          title: '结算本局和总分',
          body: '叫牌方达到墩数加定约分，未达到扣同样的分。花色定约和无主定约里，防守方每拿一墩加 10 分。叫牌方超墩通常不加分，但定约低于 250 分且全拿十墩时，改记 250 分。',
          bullets: [
            'Misère 成功加 250，失败扣 250；Open Misère 是正负 500。叫牌者要输掉全部十墩才成功，防守方不计分。',
            '完成己方定约且累计达到 500 分才赢。防守加到 500 分时继续打。任一方跌到 −500 分或更低即输。',
          ],
        },
        {
          title: '开局前确认地区规则',
          body: '部分美式玩法只叫一轮，把零墩定约称为 Nullo，并允许防守方靠赢墩加到 500 分直接获胜。开局前先确认叫牌、鬼牌、全拿和终局规则。下方计分表和牌例均使用上述澳式规则。',
        },
      ],
      recommendations: [],
      faqs: [
        { question: '叫七红桃值多少分？', answer: '7♥ 的定约是 200 分。拿七到九墩加 200，少于七墩扣 200；按本文澳式规则全拿十墩加 250。' },
        { question: '能用普通扑克牌吗？', answer: '可以。去掉所有 2、3 和两张黑色 4，再加入一张鬼牌，即为 43 张。' },
      ],
      externalLinks: [
        { href: 'https://www.pagat.com/euchre/500.html', label: 'Pagat 的 Five Hundred 规则', description: '澳式规则、计分及地区变体。' },
        { href: 'https://www.trickstercards.com/help/500/', label: 'Trickster Cards 的 500 入门', description: '对照澳式和美式设置。' },
      ],
      ctaLabel: '浏览更多游戏',
      ctaDescription: '探索 Luma Game Hub 的其他游戏和纸牌规则。',
    },
  },
};
