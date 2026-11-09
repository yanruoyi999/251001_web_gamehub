import type { SeoLandingPage } from '@/lib/seo-landing-content';

const source = 'https://www.pagat.com/patience/spit.html';

export const SPIT_GUIDE: SeoLandingPage = {
  slug: 'spit-card-game-rules',
  primaryKeyword: 'spit card game rules',
  keywords: ['spit card game rules', 'how to play spit', 'spit card game setup', 'spit vs speed'],
  updatedAt: '2026-11-09T00:00:00.000Z',
  documentationCheckedAt: '2026-11-09',
  indexable: true,
  relatedSlugs: ['gin-rummy-rules', 'cribbage-scoring-chart', 'euchre-strategy'],
  locales: {
    en: {
      metaTitle: 'Spit Card Game Rules for Two Players',
      metaDescription: 'Set up Spit with one deck and five piles per player. Learn which cards you can play, how to restart when both players get stuck, and how to win.',
      heading: 'Spit Card Game Rules',
      subheading: 'Split one deck, build five piles each, and race to empty your side of the table.',
      overview: [
        'Spit is a two-player card game. Both players act at the same time and can play on either shared center pile. Emptying your layout helps you start the next deal with fewer cards. To win, clear your layout in a one-pile deal with no reserve left.',
        'These rules use the five-pile version documented by Pagat. Before you deal, agree on this layout so both players start with the same rules.',
      ],
      sections: [
        { title: 'Set up five piles per player', body: 'Shuffle a standard deck of 52 cards without jokers. Give each player 26 cards. Make five piles in front of you with 1, 2, 3, 4 and 5 cards, and turn the top card of each pile face up. The 11 cards left over form your face-down reserve. Each player flips one reserve card into the middle at the same time to start two shared piles.' },
        { title: 'Play a card one rank higher or lower', body: 'Using one hand and moving one card at a time, play any exposed card from your layout on either center pile if it is one rank away. Suit and color can match or differ. Aces connect kings and twos. For example, if the center shows 9♣ and Q♦, play 8♠ on the nine or K♣ on the queen. A second nine cannot go on the nine. When both players reach the same pile, the card that touches it first goes down.' },
        { title: 'Keep your layout open', body: 'After playing a card, turn over the next card in that pile if one remains. You may move a face-up card from another pile into an empty space and reveal the card underneath. Keep at most five occupied spaces. Check those moves before you decide that play is blocked.' },
        { title: 'Restart when both players are stuck', body: 'If neither player can move and both have reserves, each flips one reserve card onto the center pile they started. With two center piles and only one reserve left, its owner chooses one pile and uses it for every restart during that deal. With one center pile, use that pile for any restart.' },
        { title: 'Collect the cards and deal again', body: 'With two center piles, the deal ends when someone clears their layout or both players are stuck with empty reserves. Both players claim a center pile. The first hand to touch a disputed pile gets it, and the other player takes the other pile. Each player combines their claimed pile with all cards left on their side, shuffles them, and makes the next layout.' },
        { title: 'Finish with one center pile', body: 'When you have 15 cards or fewer, deal as much of the five-pile layout as your cards allow. You have no reserve, so only your opponent starts a center pile. The first player to clear their layout takes no center cards. The other player collects the pile. A finisher with cards still in reserve uses them to make the next layout. A finisher with no reserve wins. Before play, agree how to handle a block if the only reserve runs out and both layouts still have cards. Pagat specifies the one-pile finish when a player clears their layout.' },
      ],
      recommendations: [],
      faqs: [
        { question: 'Can both players use either center pile?', answer: 'Yes. Either player can use either pile for a legal move. When both players have reserves at a restart, each adds a card to the pile they opened.' },
        { question: 'Can I flip a reserve card if only I am stuck?', answer: 'Wait until neither player can play, reveal a covered card or free a card by moving an exposed card into an empty space. Then restart together if both players have reserves.' },
        { question: 'Is Spit the same as Speed?', answer: 'The names sometimes overlap. This guide uses the five exposed piles of Spit. The five-card-hand version often called Speed uses one stock per player and replenishes a concealed hand.' },
      ],
      externalLinks: [{ href: source, label: 'Pagat’s Spit and Speed rules', description: 'The five-pile rules, one-pile ending and separately documented variants.' }],
      ctaLabel: 'Browse browser games',
      ctaDescription: 'Pick a game from the Luma catalogue for your next break.',
    },
    zh: {
      metaTitle: 'Spit 扑克牌规则｜双人发牌、出牌与胜负',
      metaDescription: '用一副牌学会双人 Spit，了解每人五堆的摆法、相邻点数出牌、卡住时翻牌，以及最后只剩一个中央牌堆时如何获胜。',
      heading: 'Spit 扑克牌规则',
      subheading: '两人用一副牌，各摆五堆，同时抢出手边的牌。',
      overview: [
        'Spit 是两人同时出牌的游戏。双方都可以向任一中央牌堆出牌。先清空桌前的牌，有机会让下一轮的牌更少。单中央堆的牌局里，没有备用牌的一方先清空桌前的牌，就赢下整局。',
        '本页采用 Pagat 记录的五堆版。开局前先说好用这个摆法，方便两人按同一套规则出牌。',
      ],
      sections: [
        { title: '每人摆五堆，再开两个中央牌堆', body: '用不含鬼牌的 52 张牌，洗匀后每人分 26 张。在自己面前依次摆 1、2、3、4、5 张，共五堆，把每堆最上面的一张翻开。剩下 11 张面朝下作备用牌。双方同时各翻一张备用牌，放到桌子中间，开出两个共用牌堆。' },
        { title: '中央牌上只能接相邻点数', body: '用一只手，一次移一张桌前的明牌。比中央堆顶高一点或低一点就能接，花色和颜色随意，A 两边都能接，分别是 K 和 2。例如中央是 9♣ 和 Q♦ 时，可以把 8♠ 接到 9 上，或把 K♣ 接到 Q 上。另一张 9 不能接到 9 上。两人抢同一堆时，先碰到该堆的那张牌算出成功。' },
        { title: '翻开下一张，善用空位', body: '出掉某堆的明牌后，如果下面还有牌，就翻开下一张。有空位时，可以把另一堆的顶端明牌移过去，再翻开它下面的牌。桌前最多占五个位置。确认不能出牌前，先看看还能否通过翻牌或移牌打开新选择。' },
        { title: '双方都卡住时翻备用牌', body: '如果双方都无法继续，而且都有备用牌，各翻一张盖在自己开出的中央堆上。如果有两个中央堆但只剩一方有备用牌，由这人选定一个堆，此轮每次重开都用同一堆。只有一个中央堆时，重开就往这堆盖牌。' },
        { title: '收牌，开始下一轮', body: '有两个中央堆时，只要有人清空桌前的牌，或双方都卡住且没有备用牌，本轮就结束。两人各抢一个中央堆。抢同一堆时，先碰到的人拿走它，另一人拿另一堆。各自把拿到的牌和自己这边剩余的牌合起来，洗牌，再摆下一轮。' },
        { title: '只剩一个中央堆时如何收尾', body: '当你只剩 15 张或更少时，按原来的顺序尽量摆满桌前五堆。这时你没有备用牌，只有对手翻一张开出中央堆。先清空桌前牌的人不收中央牌，另一人收走它。先清空的人若还有备用牌，就用这些牌摆下一轮；若一张不剩，就赢下整局。Pagat 的单堆收尾讲的是有人清空桌前牌的情况。如果唯一一方的备用牌用尽、两人都还有桌前牌却卡住，开局前先约定怎么处理。' },
      ],
      recommendations: [],
      faqs: [
        { question: '两人都能往任一中央堆出牌吗？', answer: '可以。正常出牌时，两人都能往任一堆接合法牌。卡住时如果双方都有备用牌，再各自往自己开出的堆盖一张。' },
        { question: '只有我卡住时能翻备用牌吗？', answer: '先等双方都不能出牌、翻开暗牌，或通过把明牌移到空位来翻出新牌。两人都有备用牌时，再一起翻牌重开。' },
        { question: 'Spit 和 Speed 一样吗？', answer: '有些玩家混用这两个名字。本页是桌前摆五堆的 Spit。常称 Speed 的五张手牌版每人只有一堆摸牌，并补足手里的暗牌。' },
      ],
      externalLinks: [{ href: source, label: 'Pagat 的 Spit 与 Speed 规则', description: '包含五堆摆法、单中央堆残局及其他变体。' }],
      ctaLabel: '浏览网页游戏',
      ctaDescription: '想在休息时玩一局，可以从 Luma 游戏目录挑选。',
    },
  },
};
