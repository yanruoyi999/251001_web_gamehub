import type { SeoLandingPage } from '@/lib/seo-landing-content';

const bicycle = 'https://bicyclecards.com/how-to-play/presidents/';
const pagat = 'https://www.pagat.com/climbing/president.html';
const ormgames = 'https://ormgames.com/en/president/';

export const PRESIDENT_GUIDE: SeoLandingPage = {
  slug: 'president-card-game-rules',
  primaryKeyword: 'president card game rules',
  keywords: ['president card game rules', 'how to play president', 'scum card game rules'],
  updatedAt: '2026-11-12T00:00:00.000Z',
  indexable: false,
  relatedSlugs: ['palace-card-game-rules', 'spit-card-game-rules'],
  locales: {
    en: {
      metaTitle: 'President Card Game Rules and Card Exchange',
      metaDescription:
        'Learn to play President (Scum) with 4–7 players. See why 2 is highest, how to beat pairs, when to pass or clear the pile, and how to trade cards.',
      heading: 'President Card Game Rules',
      subheading: 'A 4–7 player tabletop guide to beating sets, passing and trading cards between hands.',
      overview: [
        'President, also called Scum, rewards the first player to empty their hand. Keep playing until only one person has cards left. That finishing order decides who swaps cards before the next hand.',
        'This guide uses the play and passing rules described by Bicycle and Pagat, with Pagat’s two-card and one-card exchanges. Agree on any house rules before dealing.',
      ],
      sections: [
        {
          title: 'How to play President',
          body: 'Lead a single card or a set of one rank. On your turn, beat the current play with the same number of cards at a higher rank, or pass. The first player to get rid of every card becomes President.',
          bullets: [
            'Three is lowest, two is highest, and suits have equal value.',
            'Clear the pile when all other players still in the hand pass in succession after the latest play.',
            'From the second hand, the previous finishing order determines who trades cards.',
          ],
        },
        {
          title: 'Deal all 52 cards and learn their order',
          body: 'Seat 4–7 players and remove the jokers. Deal one card at a time clockwise, starting to the dealer’s left, until the deck is gone. Four players get 13 cards each. With five players, the first two dealt to get 11 each and the other three get 10 each. The player to the dealer’s left opens the first hand.',
          bullets: ['Card order from weakest to strongest is 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K, A, 2.'],
        },
        {
          title: 'Match the number of cards and beat the rank',
          body: 'The leader chooses a single, a pair, three of a kind or four of a kind. Keep that number of cards for every play until the pile clears. Use cards of one rank per play and compare them with the most recent play. Straights and equal ranks are illegal in this version.',
          bullets: [
            'On two 8s, play two 10s or any other higher pair. A single ace has the wrong card count, and another pair of 8s ties.',
            'If you hold three jacks, you can use two of them to beat the pair of 8s and keep the third.',
            'A pair of 2s is the highest pair. It still has to follow a pair or open an empty pile.',
          ],
        },
        {
          title: 'Pass for one turn and reset the pile after a full lap',
          body: 'You can pass even with a legal play in hand. If someone else beats the pile before your turn comes around again, you can play on that new set. Count passes from the latest play. Once every other player who still has cards passes without a new play, set the pile aside. The last player to put down cards must lead a new pile with any legal set. If that player has gone out, the next player clockwise who still has cards leads.',
        },
        {
          title: 'Play through a pair and a fresh lead',
          body: 'Alex leads two 6s. Blair passes, Casey plays two 9s, and Devon and Alex pass. Blair can now play two queens because Casey’s 9s started a new count of passes. Casey, Devon and Alex then pass. Blair clears the pile and leads a single 4 from their remaining cards. The next player now needs a higher single.',
        },
        {
          title: 'Record finishing order, then exchange cards after the next deal',
          body: 'When a player goes out, skip their turns for the rest of that hand. The first player out is President, the second is Vice President, the second-to-last is Vice Scum and the last player holding cards is Scum. With five or more players, anyone between the two vice positions is a Citizen. Gather and shuffle the whole deck once only one player still holds cards. The previous Scum deals the next hand, then the trades happen before the previous President leads.',
          bullets: [
            'Scum gives their two highest cards to the President, who returns two cards of their choice from the hand they were dealt.',
            'Vice Scum gives their highest card to the Vice President, who returns one card of their choice from the hand they were dealt. Citizens keep their hands.',
            'For example, if Scum’s best cards are a 2 and an ace, those go to the President. The President can return a 3 and a 5.',
            'To end the session, agree on a number of hands or use Pagat’s optional scoring. Award 2 points for President, 1 for Vice President and 0 for everyone else. End after the first hand in which someone reaches the agreed target, such as 11 points.',
          ],
        },
        {
          title: 'Choose house rules before you shuffle',
          body: 'Keep the rules above for your first game. If your table already plays President, settle these differences before someone leads.',
          bullets: [
            'First lead. Some tables give it to the player with a named 3, such as the 3 of clubs. Agree whether that card must be in the opening play.',
            'Passing. Some tables make a player who passes wait until the next pile. The ormgames version uses this rule.',
            'Exchange. Pagat’s basic version trades one card between the President and Scum. The two-card and one-card trades above are another option.',
            'Special plays. Some tables allow a matching rank or use a revolution that reverses card order after four of a kind. Leave both out for the rules above.',
          ],
        },
      ],
      recommendations: [],
      faqs: [
        {
          question: 'What beats a 2 in President?',
          answer: 'A 2 is the highest single in this version. Aces rank below it, and a pair cannot answer a single. The other players pass and the pile clears.',
        },
        {
          question: 'Can I pass and then play again on the same pile?',
          answer: 'Yes. If someone else plays after your pass and the turn gets back to you before the pile clears, you can beat the latest set or pass again.',
        },
        {
          question: 'Do we trade cards before the first hand?',
          answer: 'No. Play the first hand to establish the finishing order. Make the trades after the next deal, before the first play.',
        },
      ],
      externalLinks: [
        { href: bicycle, label: 'Bicycle’s Presidents rules', description: 'Dealing, higher sets of the same size, and passing.' },
        { href: pagat, label: 'Pagat’s President rules and variants', description: 'Card order, finishing positions, lead changes and exchanges.' },
        { href: ormgames, label: 'ormgames’ four-player President version', description: 'An example with a different first lead, passing rule and scoring.' },
      ],
      ctaLabel: 'Browse browser games',
      ctaDescription: 'Find more games in the Luma catalogue.',
    },
    zh: {
      metaTitle: 'President（总统）扑克牌规则｜牌序、过牌与换牌',
      metaDescription:
        '学会 4 至 7 人的 President（也叫 Scum）扑克牌玩法。看 2 为什么最大、怎样用同张数的大牌压牌、过牌后何时能再出，以及下一局如何按名次换牌。',
      heading: 'President（总统）扑克牌规则',
      subheading: '4 至 7 人桌游玩法，学会压牌、过牌和下一局换牌。',
      overview: [
        'President 也叫 Scum。最先出完手牌的人当总统，其他人继续出牌，直到只剩一人还有手牌。按出完牌的先后排出名次，下一局再据此换牌。',
        '本页采用 Bicycle 和 Pagat 记载的出牌和过牌方式，以及 Pagat 记载的两张和一张换牌玩法。要用其他桌规，发牌前先说好。',
      ],
      sections: [
        {
          title: 'President 怎么玩',
          body: '先手可以出一张牌，也可以出一组同点数的牌。轮到你时，用张数相同、点数更大的牌压住桌上最后一手，或者选择过牌。最先出完手牌的人当总统。',
          bullets: [
            '3 最小，2 最大，花色没有大小。',
            '最后一手打出后，其他仍有手牌的人都连续过牌，就收起桌上的牌。',
            '从第二局开始，按上一局的名次换牌。',
          ],
        },
        {
          title: '发完 52 张牌，先认清点数顺序',
          body: '4 至 7 人围坐，用一副扑克牌，去掉两张鬼牌。从发牌人左边开始，按顺时针每人一张，直到发完。四人时每人 13 张。五人时先拿牌的两人各 11 张，其余三人各 10 张。第一局由发牌人左边的玩家先出。',
          bullets: ['从小到大依次是 3、4、5、6、7、8、9、10、J、Q、K、A、2。'],
        },
        {
          title: '张数要相同，点数要更大',
          body: '先手可以出单张、对子、三张同点数或四张同点数。桌上的牌收走之前，每手都要保持相同的张数。每一手都用同点数的牌，和上一手实际打出的牌比大小。本玩法里顺子和同点数的牌都不能用来压牌。',
          bullets: [
            '对 8 可以用对 10 或其他更大的对子来压。单张 A 的张数不对，另一对 8 则一样大。',
            '手里有三张 J，可以只出两张压对 8，留下一张。',
            '对 2 是最大的对子，只能接在对子上，或在桌上没牌时首出。',
          ],
        },
        {
          title: '过牌只跳过这一次，连续过牌才收牌',
          body: '有能压住的牌也可以选择过。如果有人在你之后打出了更大的牌，轮回到你时仍然可以接。从最近一次实际出牌开始计算过牌，其他仍有手牌的人都连续过牌后，收起桌上的牌。最后出牌的人必须用任意合法牌型开新一轮。如果这个人已经出完，就由顺时针下一位仍有手牌的人先出。',
        },
        {
          title: '走一遍出对子、过牌和重新领出',
          body: '小安出对 6，小柏过牌，小陈出对 9，小杜和小安都过。轮回到小柏，他可以出对 Q，因为小陈出对 9 后重新计算过牌。接下来小陈、小杜和小安都过，小柏收牌，再从手里出一张 4。下一位要接的话，就得出更大的单张。',
        },
        {
          title: '按出完的顺序排位，下局发牌后换牌',
          body: '谁出完了，之后就跳过谁。第一名是总统（President），第二名是副总统（Vice President），倒数第二名是 Vice Scum，最后还拿着牌的是 Scum。五人或更多时，名次在第二名和倒数第二名之间的玩家叫平民（Citizen）。只剩一人有手牌时，本局结束，收回整副牌洗匀。上一局的末名负责发牌，换完牌后由上一局的总统领出。',
          bullets: [
            '末名把最大的两张交给总统。总统从自己刚拿到的手牌中任选两张给末名。',
            '倒数第二名把最大的一张交给副总统。副总统从自己刚拿到的手牌中任选一张给对方。平民不用换牌。',
            '例如，末名最大的两张是 2 和 A，就把它们交给总统。总统可以给回一张 3 和一张 5。',
            '开局前可以约定打几局，也可以按 Pagat 的可选计分法玩。每局总统得 2 分，副总统得 1 分，其余人得 0 分。有人达到约定分数（例如 11 分）时，打完这一局就结束。',
          ],
        },
        {
          title: '发牌前说好要不要加桌规',
          body: '第一次玩可以照上面的规则。如果有人玩过其他版本，先确认这几处。',
          bullets: [
            '开局首出。有的桌指定拿到某张 3 的人先出，比如梅花 3。还要约定第一手是否必须带上这张牌。',
            '过牌。有的桌规定过牌后要等到下一轮才能再出。ormgames 的版本就采用这种玩法。',
            '换牌。Pagat 的基础版只让总统和末名各换一张。本页采用的是两张加一张的变体。',
            '特殊出牌。有的桌允许同点数的牌接上，也有的规定出四张同点数就触发“革命”，把点数顺序反过来。本页的玩法不用这两条。',
          ],
        },
      ],
      recommendations: [],
      faqs: [
        {
          question: '哪张牌能压单张 2？',
          answer: '按本页的玩法，2 是最大的单张。A 比 2 小，对子也不能接在单张上。其他玩家过牌后就收牌。',
        },
        {
          question: '过牌后，同一轮还能出牌吗？',
          answer: '可以。只要在你过牌后有人打出新的一手，且收牌前又轮到你，你就可以压最新一手，也可以再过。',
        },
        {
          question: '第一局发牌后就要换牌吗？',
          answer: '第一局先打出名次。第二局发完牌后、第一手打出前，才按上一局的名次换牌。',
        },
      ],
      externalLinks: [
        { href: bicycle, label: 'Bicycle 的 Presidents 规则', description: '发牌、同张数压牌和过牌。' },
        { href: pagat, label: 'Pagat 的 President 规则与变体', description: '点数顺序、名次、领出顺序和换牌。' },
        { href: ormgames, label: 'ormgames 的四人 President 玩法', description: '对照另一种开局领出、过牌和计分方式。' },
      ],
      ctaLabel: '浏览网页游戏',
      ctaDescription: '在 Luma 目录里挑选更多游戏。',
    },
  },
};
