import type { SeoLandingPage } from '@/lib/seo-landing-content';

const bicycle = 'https://bicyclecards.com/how-to-play/palace';
const familyGameShelf = 'https://familygameshelf.com/2025/03/18/how-to-play-the-palace-card-game/';

export const PALACE_GUIDE: SeoLandingPage = {
  slug: 'palace-card-game-rules',
  primaryKeyword: 'palace card game rules',
  keywords: ['palace card game rules', 'how to play palace', 'palace card game setup'],
  updatedAt: '2026-11-11T00:00:00.000Z',
  documentationCheckedAt: '2026-11-11',
  indexable: true,
  relatedSlugs: ['spit-card-game-rules', 'euchre-strategy'],
  locales: {
    en: {
      metaTitle: 'Palace Card Game Rules for 2–5 Players',
      metaDescription: 'Learn Palace with standard playing cards. Set up three pairs of table cards, match or beat the pile, use 2s and 10s, and play your final cards blind.',
      heading: 'Palace Card Game Rules',
      subheading: 'Play your hand, then your face-up cards, then your face-down cards. The first player to empty all three wins.',
      overview: [
        'Palace is a shedding game for 2–5 players. Match or beat the top card to get rid of yours. If you have no legal play, add the whole center pile to your hand.',
        'This version uses Bicycle’s deal and first-out finish, with the open lead and same-player replay after four of a kind described by Family Game Shelf.',
      ],
      sections: [
        {
          title: 'Set up the table',
          body: 'Use one standard 52-card deck for two players or two decks for three to five. Remove all jokers, shuffle, and choose a dealer. Use this checklist for each player and the middle of the table.',
          bullets: [
            'Deal three face-down cards in a row. Keep them hidden. Deal each player six more cards to look at and choose three to place face up, one on each hidden card.',
            'Keep the other three cards private. Save strong cards such as aces or tens for the face-up row, which you will use near the end.',
            'Stack the undealt cards face down as the stock. Leave space for the center pile. The player to the dealer’s left leads any card or set of equal ranks from hand, then play goes clockwise.',
          ],
        },
        {
          title: 'Match or beat the pile, then refill',
          body: 'Play one card or several of the same rank from your hand. Your cards must match or outrank the current top card. Suits do not matter. Aces are high, threes are low, and 2s and 10s have special effects. After playing, draw from the stock until you have three cards in hand, or stop when it runs out. If you already have three or more cards, draw none.',
        },
        {
          title: 'Pick up when you cannot play',
          body: 'If you have a legal play, make one. Otherwise take the entire center pile into your hand and end your turn. Leave any face-up table cards where they are. The next player leads to the empty center pile. Cards you pick up must be played from your hand before you return to your table cards.',
        },
        {
          title: 'Reset with a 2 or clear the pile',
          body: 'A 2 can go on any card. It stays in the pile and lets the next player play any rank. A 10 can also go on any card. It burns the whole pile, including the 10, and those cards stay out of the deal. Four or more consecutive cards of the same rank at the top also burn the pile, including a run built across several turns. After either burn, refill your hand if needed. If you still have cards in hand or on the table, take another turn and start the new pile.',
        },
        {
          title: 'Play the face-up row, then flip blind',
          body: 'Once both the stock and your hand are empty, play one face-up card per turn, using the same rules. When all your face-up cards are gone, choose one hidden card without looking and flip it. If it is legal, play it. If it is too low, take it and the entire center pile into your hand. The next player starts a new pile, and you return to playing from your hand. The first player to finish with no hand or table cards wins immediately.',
        },
        {
          title: 'Follow a reset, a burn and a failed flip',
          body: 'The pile shows K♣. You play 2♥ and refill, so the next player can play 4♠. Later, the top three cards are all nines. You play 9♦ to make the fourth nine, set the entire pile aside, refill if needed, and lead again. In the endgame, if you flip a hidden 6♥ onto Q♠, pick up the 6 and the pile. Play those cards from your hand before trying another blind flip.',
        },
      ],
      recommendations: [],
      faqs: [
        {
          question: 'Does a 2 burn the pile like a 10?',
          answer: 'A 2 stays on the pile and resets the minimum rank unless it completes a run of four. A 10 removes the whole pile from the deal.',
        },
        {
          question: 'Can my last card be a 2 or a 10?',
          answer: 'Yes. Once you legally play your last card, you win. Some groups ban a special card as the last play or continue until one player is left. Agree on those variants before dealing.',
        },
        {
          question: 'Do you flip a starter card or give 7s a special power?',
          answer: 'Here the center starts empty and a 7 is an ordinary rank. Other versions flip the top stock card to start, add jokers, or let a 7 change the next play. Pick the opening and special cards before you deal.',
        },
      ],
      externalLinks: [
        { href: bicycle, label: 'Bicycle Palace rules', description: 'Deck size, the three-plus-six deal, and the progression from hand to table cards.' },
        { href: familyGameShelf, label: 'Family Game Shelf Palace rules', description: 'The open lead, four-of-a-kind replay and optional table rules.' },
      ],
      ctaLabel: 'Browse browser games',
      ctaDescription: 'Find other games in the Luma catalogue.',
    },
    zh: {
      metaTitle: 'Palace 扑克牌规则｜摆牌、特殊牌与残局',
      metaDescription: '用普通扑克牌玩 Palace。学会摆三组明暗牌、跟同点数或更大的牌、用 2 重置或用 10 清堆，以及最后如何盲翻。',
      heading: 'Palace 扑克牌规则',
      subheading: '先出手牌，再出桌前明牌，最后盲翻暗牌。先出完的人赢。',
      overview: [
        'Palace 是 2 至 5 人的桌面扑克牌游戏。每次出和中央牌堆顶同点数或更大的牌，尽快出完自己的牌。无牌可出时，要把整个中央牌堆收进手里。',
        '本页采用 Bicycle 的发牌和先出完即获胜规则。开局由玩家直接出牌，凑齐四张后也由该玩家再出，这两条采用 Family Game Shelf 记载的玩法。',
      ],
      sections: [
        {
          title: '按清单摆好牌桌',
          body: '两人用一副 52 张牌，三至五人用两副。去掉所有鬼牌，洗匀后选一人发牌。每位玩家和桌面中央按以下方式摆牌。',
          bullets: [
            '每人先发三张暗牌，并排摆好，不能偷看。再给每人发六张可看的牌，从中选三张翻开，各压在一张暗牌上。',
            '剩下三张作为手牌，自己拿着。可以把 A、10 等好用的牌留在桌前明牌里，等残局再用。',
            '把余牌面朝下叠成摸牌堆，旁边留空。发牌者左手边的玩家从手里先出一张或几张同点数牌，开出中央牌堆，之后顺时针轮流。',
          ],
        },
        {
          title: '跟同点数或更大的牌，出完再补牌',
          body: '从手里出一张，或一次出几张点数相同的牌。出的牌要与中央牌堆顶点数相同或更大，花色不限。A 最大，3 最小，2 和 10 有特殊效果。出牌后从摸牌堆补到三张，牌堆用完就停。手牌已有三张或更多时不用补。',
        },
        {
          title: '无牌可出就收走整堆',
          body: '有合法牌就要出。否则把中央牌堆整堆收进手里，结束这回合，桌前明牌留在原位。下一位往空出的中央重新出牌。收来的牌要先从手里出完，才能继续出桌前的牌。',
        },
        {
          title: '2 重置点数，10 或四张同点数清堆',
          body: '2 可以接在任何牌上。它留在中央牌堆，下一位可以接任意点数。10 也可以接任何牌，但会把整堆连同这张 10 移出本局。中央堆顶连续出现四张或更多同点数牌时也清堆，可以由多人分几回合凑成。两种清堆方式都由刚才出牌的人按需补牌。只要手里或桌前还有牌，就接着开新堆。',
        },
        {
          title: '先出桌前明牌，最后盲翻暗牌',
          body: '摸牌堆和你的手牌都空了，才开始每回合出一张桌前明牌，出牌规则照旧。明牌出完后，每回合选一张暗牌直接翻开，不能先看。能接就出，点数太低就把翻出的牌连同整堆收进手里。下一位开新堆，你得先出完手牌才能再盲翻。第一个把手牌和桌前牌都出完的人立即获胜。',
        },
        {
          title: '看懂重置、清堆和盲翻失败',
          body: '中央堆顶是梅花 K。你出红桃 2 并补牌，下一位就可以接黑桃 4。后来堆顶连续有三张 9，你出方块 9 凑成第四张，把整堆移到一旁，按需补牌后接着开新堆。残局里，如果堆顶是黑桃 Q，你却翻出红桃 6，就得把这张 6 和整堆收进手里。先出完这些手牌，才能再盲翻。',
        },
      ],
      recommendations: [],
      faqs: [
        {
          question: '出 2 会像出 10 一样清堆吗？',
          answer: '只要没凑成连续四张，2 就留在中央，重置下一次出牌的点数要求。10 会移走整堆。',
        },
        {
          question: '最后一张可以出 2 或 10 吗？',
          answer: '可以。合法出完最后一张就赢。有些桌规禁止用特殊牌收尾，也有些会继续打到只剩一人有牌。发牌前先选好规则。',
        },
        {
          question: '开局要先翻一张吗？7 有特殊效果吗？',
          answer: '本页从空的中央开始，7 是普通牌。其他版本可能先翻摸牌堆顶、加鬼牌，或让 7 改变下一手的出牌要求。开局前先说好。',
        },
      ],
      externalLinks: [
        { href: bicycle, label: 'Bicycle 的 Palace 规则', description: '用几副牌、先发三张再发六张，以及手牌与桌前牌的出牌顺序。' },
        { href: familyGameShelf, label: 'Family Game Shelf 的 Palace 规则', description: '直接出牌开局、四张同点数清堆后继续出牌，以及可选桌规。' },
      ],
      ctaLabel: '浏览网页游戏',
      ctaDescription: '在 Luma 目录里挑一款其他游戏。',
    },
  },
};
