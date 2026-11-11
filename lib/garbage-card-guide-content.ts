import type { SeoLandingPage } from '@/lib/seo-landing-content';

const bicycle = 'https://bicyclecards.com/how-to-play/trash/';
const pagat = 'https://www.pagat.com/patience/trash.html';
const familyGameShelf = 'https://familygameshelf.com/2022/04/14/card-game-garbage/';

export const GARBAGE_CARD_GUIDE: SeoLandingPage = {
  slug: 'garbage-card-game-rules',
  primaryKeyword: 'garbage card game rules',
  keywords: ['garbage card game rules', 'how to play garbage', 'trash card game rules'],
  updatedAt: '2026-11-11T00:00:00.000Z',
  documentationCheckedAt: '2026-11-11',
  indexable: true,
  relatedSlugs: ['spit-card-game-rules', 'gin-rummy-rules'],
  locales: {
    en: {
      metaTitle: 'Garbage (Trash) Card Game Rules for 2–6 Players',
      metaDescription: 'Learn Garbage, also called Trash, with a two-row setup, a worked turn, movable wild jacks, and the one-slot finish.',
      heading: 'Garbage (Trash) Card Game Rules',
      subheading: 'Fill your slots from ace to ten, then work down to a one-slot layout.',
      overview: [
        'Garbage, also called Trash, is a tabletop card game where every position has a number. Start with ten face-down cards. Each card you place lets you flip another. Complete your layout first to earn a shorter layout next round.',
        'This guide follows the Bicycle and Pagat rules with wild jacks. Decide which rank is wild before you deal.',
      ],
      sections: [
        {
          title: 'Deal two rows of five',
          body: 'Use one standard 52-card deck for two players, two decks for three or four, or three decks for five or six. Leave out the jokers. Shuffle and deal ten face-down cards to each player. Arrange your own cards in two rows of five and keep every card hidden.',
          bullets: [
            'The top row runs A, 2, 3, 4, 5 from left to right. An ace fills the first slot.',
            'The bottom row runs 6, 7, 8, 9, 10 from left to right.',
            'Stack the undealt cards face down as the stock. Leave space next to it for a face-up discard pile.',
          ],
        },
        {
          title: 'Draw once, then follow the cards you flip',
          body: 'The first player draws the top card of the stock. Play clockwise. On later turns, start by choosing the top stock card or the top discard, if there is one. Put an ace through ten face up in the slot for its rank. If that slot holds a face-down card, lift it, flip it, and try to place it in its own slot. Keep using the card you uncover on the same turn. If you uncover or draw a card you cannot place, discard it face up and pass the turn. A queen, king, number with no slot, or number already in its slot stops the chain.',
        },
        {
          title: 'Move a wild jack when its number turns up',
          body: 'A jack can fill any face-down slot. Flip the card it replaces and continue the chain. If you later draw or uncover the number that belongs where a jack is sitting, put that number in its slot. Move the jack to a different face-down slot and flip the card from there. Keep a jack face up in its slot until a matching number displaces it.',
        },
        {
          title: 'Try a turn that moves a jack',
          body: 'You draw 7♣ and put it in slot 7. That uncovers 3♦, which goes in slot 3 and uncovers J♠. Use the jack in slot 5 and flip the card there. It is 5♥, so put it in slot 5 and move the jack to the face-down ace slot. That card is Q♣. Discard the queen and end your turn. The ace, 3, 5 and 7 slots are now filled.',
        },
        {
          title: 'Recycle the stock if it runs out',
          body: 'Keep the top discard face up where it is. Shuffle the rest of the discards into a new face-down stock. Leave everyone’s layouts as they are and carry on with the current round.',
        },
        {
          title: 'Win a round, then play with one fewer slot',
          body: 'The round ends as soon as someone fills every slot with its number or a jack. Gather all the cards, shuffle, and deal again. Only that round’s winner gets one fewer card, dropping the highest slot. Everyone else keeps their previous layout size. A player with nine slots uses ace through nine and discards any ten they draw or uncover. The round winner plays first in the next round. When you get down to one slot, fill it with an ace or jack in a later round to win the game.',
        },
        {
          title: 'Agree on wild cards and extra turns',
          body: 'Pagat also describes a face-down version with wild kings, where jacks and queens stop the turn. Family Game Shelf describes a different version that starts face up, usually makes one replacement per turn, uses wild kings, and gives the other players one last turn. In the Bicycle and Pagat rules above, the round ends at the first completed layout.',
        },
      ],
      recommendations: [],
      faqs: [
        {
          question: 'Can I use a jack in the ace slot to win the game?',
          answer: 'Yes. With a one-slot layout, either an ace or a jack completes it and wins the game. Reaching one slot earns you the chance to win on the next deal.',
        },
        {
          question: 'Can I take a card from the discard pile?',
          answer: 'Yes, you may take the top discard at the start of your turn if one is available. A known number for an empty slot or a slot covered by a jack can be a good pick.',
        },
        {
          question: 'What happens if I turn over a second 8?',
          answer: 'If slot 8 already holds an eight, discard the new eight and end your turn. If slot 8 holds a jack, replace the jack with the eight and move the jack to a face-down slot.',
        },
      ],
      externalLinks: [
        { href: bicycle, label: 'Bicycle’s Trash rules', description: 'Deck counts, the two-row layout, wild jacks and the one-slot finish.' },
        { href: pagat, label: 'Pagat’s Trash and Garbage rules', description: 'The flip chain, shorter layouts and optional variants.' },
        { href: familyGameShelf, label: 'Family Game Shelf’s Garbage variant', description: 'The face-up layout with wild kings and an extra turn for other players.' },
      ],
      ctaLabel: 'Browse browser games',
      ctaDescription: 'Find other games in the Luma catalogue.',
    },
    zh: {
      metaTitle: 'Garbage（Trash）扑克牌规则｜两排摆法、万能 J 与胜负',
      metaDescription: '学习 Garbage（也叫 Trash）的玩法。看两排牌怎么摆、如何连续翻牌和移动万能 J，以及只剩一格时如何获胜。',
      heading: 'Garbage（Trash）扑克牌规则',
      subheading: '从 A 到 10 填满牌位，逐轮减少，直到赢下只剩一格的那轮。',
      overview: [
        'Garbage 也叫 Trash，是用普通扑克牌玩的桌面游戏。起手摆十张暗牌，每个牌位都有编号。每放一张牌，就翻出原来占着那一格的牌。先填满自己牌阵的人，下一轮少摆一张。',
        '本页采用 Bicycle 和 Pagat 的万能 J 玩法。发牌前先说好哪张牌是万能牌。',
      ],
      sections: [
        {
          title: '每人摆两排，每排五张',
          body: '两人用一副 52 张牌，三至四人用两副，五至六人用三副。去掉鬼牌，洗匀后给每人发十张暗牌。各自在面前摆两排，每排五张，摆好后先别翻开。',
          bullets: [
            '上排从左到右为 A, 2, 3, 4, 5。A 放在第一格。',
            '下排从左到右为 6, 7, 8, 9, 10。',
            '余牌面朝下叠成摸牌堆，旁边留出位置放正面朝上的弃牌。',
          ],
        },
        {
          title: '开头摸一张，之后用翻出来的牌接着走',
          body: '第一位玩家从摸牌堆顶摸一张，之后顺时针轮流。后面的回合开头，可以摸牌堆顶，也可以拿弃牌堆顶。摸到 A 至 10 时，把牌正面朝上放进对应的格子。若那里是暗牌，就拿起来翻开，再试着把它放进它自己的格子。一直用刚翻出来的牌继续。遇到放不进去的牌，就把它正面朝上弃掉，轮到下一位。Q、K、没有对应牌位的数字牌，以及已经填入该数字的重复牌，都会结束这一回合。',
        },
        {
          title: '正牌到手时，挪走原来的万能 J',
          body: 'J 可以填进任意还盖着暗牌的格子。翻开被换出的暗牌，继续往下走。若后来摸到或翻出了原本该放在 J 所占格子的数字牌，就换上这张数字牌，把 J 挪到另一个暗牌格，再翻开被换出的牌。J 放下后，要等该格对应的数字牌出现才能挪动。',
        },
        {
          title: '试一次会挪动 J 的回合',
          body: '你摸到梅花 7，放到第 7 格，翻出方块 3。把方块 3 放到第 3 格，翻出黑桃 J。你先用 J 填第 5 格，恰好翻出了红桃 5。把红桃 5 放回第 5 格，再把 J 挪到还盖着暗牌的 A 格。这次翻出梅花 Q。弃掉 Q，结束回合，这一手填好了 A、3、5 和 7 四格。',
        },
        {
          title: '摸牌堆用完就重洗弃牌',
          body: '保留弃牌堆顶那张明牌，把其余弃牌洗匀，面朝下叠成新的摸牌堆。每人的牌阵照旧，本轮接着打。',
        },
        {
          title: '赢一轮就少摆一格，赢下一格局才算获胜',
          body: '有人用对应的数字牌或 J 填满每个格子，本轮就结束。收回所有牌，洗匀重发。只有本轮赢家下一轮少发一张，去掉编号最大的一格。其他人保留各自上一轮的格数。例如，你只有九格时只摆 A 至 9，摸到或翻到 10 要弃掉。上一轮赢家在下一轮先出。只剩一格后，还要在随后的一轮把 A 或 J 放进这一格，才赢下整局。',
        },
        {
          title: '开局前约定万能牌和最后一手',
          body: 'Pagat 还记载了一种暗牌玩法，改用 K 当万能牌，J 和 Q 会结束回合。Family Game Shelf 介绍的是另一种玩法，开局就把牌翻开，通常每回合只换一张，用 K 当万能牌，并给其他玩家最后一次出手机会。按本页的 Bicycle 和 Pagat 主规则，第一位填满的人一完成，本轮就结束。',
        },
      ],
      recommendations: [],
      faqs: [
        {
          question: '只剩 A 格时，能靠 J 赢下整局吗？',
          answer: '可以。只剩一格时，放 A 或 J 都能填满并获胜。刚把格数减到一格，只是取得了下一轮获胜的机会。',
        },
        {
          question: '可以拿弃牌堆的牌吗？',
          answer: '可以。回合刚开始时，如果弃牌堆有牌，可以拿最上面一张。如果那张牌能填入你的暗牌格或换下 J，拿它就能接着走。',
        },
        {
          question: '翻到第二张 8 怎么办？',
          answer: '如果第 8 格已经摆了 8，就弃掉新翻出的 8，结束回合。如果第 8 格摆的是 J，就用 8 换下它，再把 J 挪到一个暗牌格。',
        },
      ],
      externalLinks: [
        { href: bicycle, label: 'Bicycle 的 Trash 规则', description: '牌副数量、两排摆法、万能 J 和一格局的胜负。' },
        { href: pagat, label: 'Pagat 的 Trash 与 Garbage 规则', description: '连续翻牌、逐轮缩减牌阵及可选变体。' },
        { href: familyGameShelf, label: 'Family Game Shelf 的 Garbage 变体', description: '明牌摆法、万能 K 和额外回合。' },
      ],
      ctaLabel: '浏览网页游戏',
      ctaDescription: '在 Luma 目录里挑一款其他游戏。',
    },
  },
};
