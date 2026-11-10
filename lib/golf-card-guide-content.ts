import type { SeoLandingPage } from '@/lib/seo-landing-content';

const bicycle = 'https://bicyclecards.com/how-to-play/six-card-golf';
const pagat = 'https://www.pagat.com/draw/golf.html';

export const GOLF_CARD_GUIDE: SeoLandingPage = {
  slug: 'golf-card-game-rules',
  primaryKeyword: 'golf card game rules',
  keywords: ['golf card game rules', 'six card golf rules', 'card golf scoring', 'how to play card golf'],
  updatedAt: '2026-11-10T00:00:00.000Z',
  documentationCheckedAt: '2026-11-10',
  indexable: false,
  relatedSlugs: ['cribbage-scoring-chart', 'euchre-strategy', 'gin-rummy-rules'],
  locales: {
    en: {
      metaTitle: 'Golf Card Game Rules: Six-Card Setup, Turns and Scoring',
      metaDescription: 'Play six-card Golf with one deck. See the 2×3 layout, when to draw or swap, how columns cancel, and an example score. Compare four- and nine-card versions.',
      heading: 'Golf Card Game Rules',
      subheading: 'A six-card table guide: make pairs in columns and aim for the lowest total over nine deals.',
      overview: [
        'Golf is a multiplayer card game for the table. In the version below, two to four players each work with six cards in two rows and three columns. A deal is a hole, and nine holes make a game.',
        'Use this guide if your group wants six-card Golf with no jokers and an immediate end to each hole. Four-card Golf often uses a knock, while a common nine-card version needs three equal cards to cancel a column. Pick the version before shuffling.',
      ],
      sections: [
        { title: 'Deal a 2×3 layout', body: 'Shuffle one standard 52-card deck without jokers. Deal six cards face down to each player, arranged in two rows of three. Stack the rest as the stock and flip its top card beside it to start the discard pile. Everyone turns any two of their own six cards face up for the whole table to see. Leave the other four hidden and do not peek.' },
        { title: 'Draw, replace or discard', body: 'Start with the player left of the dealer and go clockwise. Draw the top stock card or take the top face-up discard. A card taken from the discard pile must replace one of your six cards. A stock draw can be used for a swap or discarded. For a swap, put the drawn card face up in the chosen slot and discard the old card face up. Choose a hidden slot before looking at the card there.' },
        { title: 'Try a sample turn', body: 'Suppose your right column shows an 8♣ above a face-down card, and the discard pile shows 8♥. Take the 8♥ and put it in the lower-right slot without peeking first. The old lower-right card becomes the top discard. Both eights stay in your layout, and that column scores zero if it stays unchanged through the end of the hole.' },
        { title: 'End the hole and add the scores', body: 'As soon as someone turns their sixth card face up, stop play. Everyone reveals any cards still face down and scores all six positions. Ace is 1; a two is −2; 3 through 10 count face value; jack and queen count 10; king is 0. For each of the three columns, matching ranks cancel the entire column, even a pair of twos. Matching cards in a row do not cancel. Record each player’s score, then deal the next hole. The lowest total after nine holes wins.' },
        { title: 'Work through a score of 9', body: 'Read across the top row: 7♣, 2♥, A♠. The bottom row is 7♦, K♠, Q♦. The left column is 0 for the pair of sevens. The center is −2 from the two and king. The right is 11 from the ace and queen. Write 0 − 2 + 11 = 9 for this hole. A negative hole is possible and reduces the running total.' },
        { title: 'Agree on house rules first', body: 'Some tables give every opponent one last turn when a player goes face up; this guide stops immediately. Agree before the deal on what to do if the stock runs out, since the base sources do not give a single procedure. One practical house rule is to keep the visible discard and shuffle the rest of the discard pile into a new stock. For four- or nine-card layouts, use that version’s own end and scoring rules.' },
      ],
      recommendations: [],
      faqs: [
        { question: 'Can I take and immediately return the top discard?', answer: 'No. Use a card taken from the discard pile to replace a card in your layout. You may discard a card drawn from the face-down stock instead.' },
        { question: 'Do two twos in one column score −4?', answer: 'In this six-card ruleset they cancel to zero. An unmatched two is −2. Some groups keep the negative value for a pair, so agree on that variant before you deal.' },
        { question: 'Is Golf Solitaire the same game?', answer: 'No. This is multiplayer table Golf with a separate layout and a low score for each player. Golf Solitaire is a different one-player game.' },
      ],
      externalLinks: [
        { href: bicycle, label: 'Bicycle: Six Card Golf', description: 'One-deck setup, six-card layout and the scoring values.' },
        { href: pagat, label: 'Pagat: Golf and its variants', description: 'The discard-pile rule, immediate finish, and separate four- and nine-card rules.' },
      ],
      ctaLabel: 'Browse browser games',
      ctaDescription: 'Find a different game to play in your browser.',
    },
    zh: {
      metaTitle: 'Golf 扑克牌规则｜六张牌摆法、换牌和计分',
      metaDescription: '用一副牌玩六张 Golf：每人摆两行三列，学习如何摸牌换牌、同列抵消及九轮计分，并区分四张和九张玩法。',
      heading: 'Golf 扑克牌规则',
      subheading: '六张牌摆两行三列，同列凑对子，九轮累计分最低的人获胜。',
      overview: [
        'Golf 是多人桌面扑克牌游戏。本页用 2 至 4 人的六张版：每人把牌摆成两行三列。一轮叫一洞，通常玩九洞。',
        '这套规则不使用鬼牌，有人六张全翻开就立刻结算。四张版常用敲桌结束；九张版常要同列三张一样才抵消。洗牌前先选定版本。',
      ],
      sections: [
        { title: '发牌：每人摆两行三列', body: '洗匀一副不含鬼牌的 52 张扑克牌。每人发六张暗牌，摆成两行三列。余牌叠作摸牌堆，翻开最上面一张作弃牌堆。每人任选自己的两张翻给全桌看；其余四张先不看。' },
        { title: '轮到你：摸牌、换牌或弃牌', body: '从发牌者左手边开始，顺时针轮流。你可以摸牌堆顶，或拿弃牌堆顶的明牌。拿弃牌必须用它替换自己的一张；从摸牌堆抽到的牌，可以换也可以直接弃掉。换牌时新牌正面朝上放进原位，旧牌翻开放到弃牌堆。如果换的是暗牌，先选位置再看旧牌。' },
        { title: '用一回合试试凑同列对子', body: '假设你右列上面是梅花 8，下面是暗牌，弃牌堆顶刚好是红桃 8。你可以拿红桃 8 换到右下角，选定前不能偷看。把换出的旧牌翻开弃掉。若结算前不再动这两张 8，右列就是 0 分。' },
        { title: '六张全开就结算', body: '一旦有人六张都已翻开，本轮立即结束。所有人翻开剩下的暗牌，给自己的六个位置计分。A 是 1 分，2 是 −2 分，3 到 10 按牌面计，J 和 Q 各 10 分，K 为 0。每列的两张若同点数，整列为 0，包括一对 2。同一行里相同的牌不抵消。每洞记下各自得分，九洞累计最低者获胜。' },
        { title: '算一例：这一洞得 9 分', body: '上排从左到右是梅花 7、红桃 2、黑桃 A；下排是方块 7、黑桃 K、方块 Q。左列一对 7 算 0；中列 2 加 K 为 −2；右列 A 加 Q 为 11。这一洞记录 0 − 2 + 11 = 9 分。一洞也可能得负分，会拉低累计总分。' },
        { title: '开局前说清桌规', body: '有人习惯六张全开后给其他人各一次最后机会，本页采用立即结束版。基础来源没有给出统一的牌堆抽完规则，可以事先约定保留弃牌堆最上面一张，把其余弃牌洗回摸牌堆。四张版和九张版请按各自的结束和计分规则玩。' },
      ],
      recommendations: [],
      faqs: [
        { question: '可以拿起弃牌堆顶，再把它原样放回吗？', answer: '不可以。拿弃牌就要换掉自己的一张；从暗牌堆抽到不想要的牌才可直接弃掉。' },
        { question: '同列两张 2 是 −4 分吗？', answer: '本页规则是同列同点数抵消，所以一对 2 是 0 分；单独的 2 是 −2。也有人保留对子负分，开局前先约定。' },
        { question: '这和 Golf Solitaire 是同一个游戏吗？', answer: '不是。本页是多人各自摆牌、争取低分的桌面牌戏；Golf Solitaire 是另一种单人接龙。' },
      ],
      externalLinks: [
        { href: bicycle, label: 'Bicycle 的六张 Golf 规则', description: '一副牌的摆法、基本回合和牌面分值。' },
        { href: pagat, label: 'Pagat 的 Golf 与变体规则', description: '弃牌换牌、立即收尾，以及四张和九张版本。' },
      ],
      ctaLabel: '浏览网页游戏',
      ctaDescription: '也可以从 Luma 目录里挑另一款网页游戏。',
    },
  },
};
