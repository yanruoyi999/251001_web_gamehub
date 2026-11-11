import type { SeoLandingPage } from '@/lib/seo-landing-content';

const source = 'https://www.pagat.com/rummy/ginrummy.html';

export const GIN_RUMMY_GUIDE: SeoLandingPage = {
  slug: 'gin-rummy-rules',
  primaryKeyword: 'gin rummy rules',
  keywords: ['gin rummy rules', 'how to play gin rummy', 'gin rummy scoring'],
  updatedAt: '2026-11-09T00:00:00.000Z',
  documentationCheckedAt: '2026-11-09',
  indexable: true,
  relatedSlugs: ['cribbage-scoring-chart', 'euchre-strategy', 'shut-the-box-rules', 'crazy-eights-rules', 'garbage-card-game-rules'],
  locales: {
    en: {
      metaTitle: 'Gin Rummy Rules: How to Knock, Go Gin and Score',
      metaDescription: 'Learn two-player Gin Rummy with a standard deck: deal ten cards, form sets and runs, count deadwood, and score knocks, gin and undercuts.',
      heading: 'Gin Rummy Rules for Two Players',
      subheading: 'Play with a standard deck and a scorepad. Learn when to end a hand and how to check who actually scores.',
      overview: [
        'Draw one card, discard one, and try to leave as few points as possible outside your sets and runs. You may end your turn by knocking if the ten cards you keep leave at most 10 unmatched points. With none left, you have gin.',
        'This tabletop guide uses the basic two-player version documented by Pagat: a 20-point gin bonus and a 10-point undercut bonus. Agree on bonuses before the first deal if your group uses another version.',
      ],
      sections: [
        { title: 'Deal and offer the first card', body: 'Use all 52 cards without jokers. Draw for the first dealer; the lower card deals. Deal ten cards to each player and turn the next card up beside the face-down stock. Offer that card to the non-dealer, then to the dealer if the non-dealer passes. If both pass, the non-dealer draws from the stock. The player who takes a card finishes the first turn with a discard. The winner of a scored hand deals next.' },
        { title: 'Keep sets and runs separate', body: 'A set groups three or four cards of one rank. A run needs at least three consecutive ranks in the same suit. The ace goes below the two, so A♥–2♥–3♥ works and Q♥–K♥–A♥ does not. A card cannot serve in two combinations. Unmatched cards are deadwood: count an ace as 1, number cards at face value, and J, Q and K as 10 each.' },
        { title: 'Draw, discard, then decide whether to knock', body: 'After the opening offer, take either the top stock card or the visible top discard. If you took the discard, choose a different card to throw away. Count deadwood in the ten you keep. With 1–10 points you may knock or keep playing; with zero you may declare gin. This also applies on the first turn. To end the hand, set your final discard face down and reveal all ten cards, arranged into melds and deadwood. If the third-last stock card is drawn and that turn ends without a knock, cancel the hand with no score and have the same player deal again.' },
        { title: 'Give the defender their layoff before scoring', body: 'Against an ordinary knock, the defender shows their own combinations and may attach spare cards to the knocker’s displayed sets or runs where they legally fit. A spare card cannot attach to another spare card. The knocker cannot attach cards to the defender’s hand, and there is no layoff against gin.' },
        { title: 'Worked hand: a legal knock still loses', body: 'Suppose you keep 4♣–5♣–6♣, three eights (♦ ♥ ♠), three queens (♣ ♦ ♥), and 7♠. Only the 7♠ is unmatched, so you can knock with 7. Your opponent shows A♥–2♥–3♥, three nines (♦ ♥ ♠), three fives (♦ ♥ ♠), and 7♣. Their 7♣ can extend your club run, leaving them 0 deadwood. They score 7 − 0 + 10 = 17. The knock was legal; it simply did not win the hand.' },
        { title: 'Record the hand score, then check the game total', body: 'After layoffs on a regular knock, compare the deadwood totals. If the knocker has fewer points, the knocker scores the difference. Otherwise, the defender scores the difference plus 10. For example, 7 against 11 earns the knocker 4; 7 against 7 earns the defender 10. For gin, add 20 to the defender’s deadwood without allowing any layoff: gin against 14 earns 34. Stop when a player has at least 100 in hand points. Then the winner adds 100 (200 if the other player never scored), and each player adds 20 per hand won.' },
      ],
      recommendations: [],
      faqs: [
        { question: 'Can you knock at exactly 10?', answer: 'Yes, after choosing your discard. Eleven deadwood points in the ten cards you keep is too high for this version.' },
        { question: 'Who scores when the deadwood totals tie?', answer: 'The defender gets the 10-point undercut bonus after an ordinary knock. Gin has its own scoring rule and cannot be undercut.' },
        { question: 'Are 25-point bonuses a mistake?', answer: 'They are used in some variants. This guide uses 20 for gin and 10 for an undercut; decide which values apply before play.' },
      ],
      externalLinks: [{ href: source, label: 'Pagat: Gin Rummy', description: 'Basic two-player rules, scoring and separately documented variants.' }],
      ctaLabel: 'Explore more tabletop rules',
      ctaDescription: 'Use the related guides for other games you can teach at the table.',
    },
    zh: {
      metaTitle: 'Gin Rummy 规则：两人拉米牌、敲牌和计分',
      metaDescription: '用一副扑克牌学会双人 Gin Rummy：十张发牌、顺子与同点牌组、计算散牌，以及敲牌、Gin 和反杀的计分例子。',
      heading: 'Gin Rummy 规则：两人怎么玩',
      subheading: '准备一副扑克牌和一张计分纸，从第一张牌开始学，最后一起核对谁得分。',
      overview: [
        '每回合摸一张、弃一张，尽量让手里的牌组成顺子或同点牌组。弃牌后保留的十张牌里，未成组的散牌总点数不超过 10，就可以敲牌结束这一手；散牌为零就是 Gin。',
        '本页采用下方 Pagat 的基本双人版本：Gin 奖 20 分，反杀奖 10 分。如果同伴采用其他奖金，请在发牌前先约定。',
      ],
      sections: [
        { title: '发牌，决定谁拿第一张明牌', body: '用不含鬼牌的 52 张牌，先抽牌，抽到较低牌的人先发。每人发十张，再翻一张作弃牌堆的起始牌，其余面朝下放成摸牌堆。先让非发牌者选要不要明牌；如果不要，再给发牌者选择。两人都不要，由非发牌者摸暗牌。拿牌的人弃一张，结束第一回合。已计分的一手结束后，由该手胜者发下一手。' },
        { title: '分出顺子、同点牌组和散牌', body: '同一点数的三张或四张可以成组；同花色连续三张或更多可以成顺子。A 只能接在 2 下方，A♥–2♥–3♥ 合法，Q♥–K♥–A♥ 不合法。一张牌不能同时算进两组。没成组的牌才算散牌：A 为 1 分，数字牌按牌面，J、Q、K 每张 10 分。' },
        { title: '先摸后弃，再判断能否敲牌', body: '正常回合可以摸暗牌堆顶，也可以拿弃牌堆顶；如果拿的是刚弃的明牌，这回合要弃另一张。按留下的十张计分。散牌 1–10 分时可以敲，也可以继续；零分时可以宣告 Gin。第一回合同样适用。结束时面朝下放出最后一张弃牌，亮出其余十张并分出牌组和散牌。如果摸走暗牌堆倒数第三张后没有敲牌，这一手作废、不计分，由同一人重新发牌。' },
        { title: '普通敲牌后，让防守方先接牌', body: '防守方亮出自己的牌组，然后可以把散牌接到敲牌者亮出的合法牌组上，例如给顺子接一个同花色相邻点数。不能接到散牌上，也不能反过来让敲牌者接对手的牌组。对手宣告 Gin 时，防守方不能接牌。' },
        { title: '原创算例：合法敲牌，结果被反杀', body: '你留下 4♣–5♣–6♣、三张 8（♦ ♥ ♠）、三张 Q（♣ ♦ ♥）和 7♠。只有 7♠ 是散牌，7 分可以敲。对手亮出 A♥–2♥–3♥、三张 9（♦ ♥ ♠）、三张 5（♦ ♥ ♠）和 7♣。把 7♣ 接到你的梅花顺子后，对手散牌为 0，因此对手得 7 − 0 + 10 = 17 分。合法敲牌不保证赢下这一手。' },
        { title: '先记单手得分，再核对整局', body: '普通敲牌在接牌后比较散牌点数：敲牌者点数较低时得点差，否则防守方得点差加 10。例如敲牌者 7 分对 11 分，敲牌者得 4；双方都是 7 分，防守方得 10。Gin 不允许接牌，用防守方散牌点数加 20，所以 Gin 对上 14 分时得 34。先累计单手分数，任一方达到或超过 100 即结束；胜者之后加 100（对手整局没得分则加 200），双方再按各自赢的手数每手加 20。' },
      ],
      recommendations: [],
      faqs: [
        { question: '散牌正好 10 分能敲吗？', answer: '可以，按弃牌后留下的十张计算。其中散牌合计 11 分则不能敲。' },
        { question: '双方散牌同分，谁得分？', answer: '普通敲牌后接牌仍同分，由防守方得 10 分反杀奖金。Gin 走独立计分规则，不会被反杀。' },
        { question: '有些地方写奖金 25 分，是错的吗？', answer: '不同版本的奖金可以不同。本页是 Gin 奖 20、反杀奖 10 的版本，开局前先说清楚。' },
      ],
      externalLinks: [{ href: source, label: 'Pagat：Gin Rummy 规则', description: '双人基础玩法、计分和单独列出的变体。' }],
      ctaLabel: '继续看桌面游戏规则',
      ctaDescription: '下方相关指南可以帮助你准备其他桌面游戏。',
    },
  },
};
