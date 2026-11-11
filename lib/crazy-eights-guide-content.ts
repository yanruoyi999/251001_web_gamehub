import type { SeoLandingPage } from '@/lib/seo-landing-content';

const bicycle = 'https://bicyclecards.com/how-to-play/crazy-eights/';
const pagat = 'https://www.pagat.com/eights/crazy8s.html';

export const CRAZY_EIGHTS_GUIDE: SeoLandingPage = {
  slug: 'crazy-eights-rules',
  primaryKeyword: 'crazy eights rules',
  keywords: ['crazy eights rules', 'how to play crazy eights', 'crazy eights scoring'],
  updatedAt: '2026-11-11T00:00:00.000Z',
  indexable: true,
  relatedSlugs: ['gin-rummy-rules', 'spit-card-game-rules', 'euchre-strategy'],
  locales: {
    en: {
      metaTitle: 'Crazy Eights Rules: Deal, Wild Eights and Scoring',
      metaDescription: 'Learn Crazy Eights with one standard deck. Deal five cards, match the top discard, choose a suit with an eight, and score the cards left in hand.',
      heading: 'Crazy Eights Rules',
      subheading: 'A table guide to dealing, changing suit and scoring a round with one deck.',
      overview: ['The goal is to empty your hand first. A normal card must match the current suit or rank. An eight is wild and lets you call the suit for the next player. This guide uses the Bicycle rules, with other table conventions marked separately.'],
      sections: [
        { title: 'Set up the table', body: 'Remove the jokers from one 52-card deck. Deal five cards face down to each player, starting on the dealer’s left. Stack the rest face down as the stock. Turn its top card up to start the discard pile. If it is an eight, put it back in the middle of the stock and turn up another card. The player on the dealer’s left starts, and turns go clockwise.' },
        { title: 'Match, draw or call a new suit', body: 'If the top card is the six of spades, you can play any spade or any six. You can also play an eight and call a suit. After an eight, the next player needs a card of the called suit or another eight. The suit printed on the eight does not matter, and calling a rank is not allowed.' },
        { title: 'When you need to draw', body: 'Draw from the stock one card at a time until you can play or the stock runs out. If there is no stock and you still cannot play, pass. In the Bicycle version you may choose to draw even if you already have a legal card. Agree in advance how to end a round if everyone has to pass.' },
        { title: 'End the round and score', body: 'The first player to play their last card wins the round. Add the value of every card remaining in the other hands to that winner’s score. Each eight counts 50; a king, queen, jack or ten counts 10; an ace counts 1; all other cards count face value. For example, if your two opponents have Q♠ and 3♦, and 8♣ and A♥ respectively, you collect 10 + 3 + 50 + 1 = 64 points.' },
        { title: 'Choose the two-player deal and house rules', body: 'The Bicycle deal gives both players five cards. Pagat’s basic two-player version deals seven each. Some groups draw only once, add skip or draw-two cards, or require a last-card call. Choose one set of conventions before dealing. These rules do not add any penalty to a normal card.' },
      ],
      recommendations: [],
      faqs: [
        { question: 'Can I play an eight even if I can match the discard?', answer: 'Yes. On your turn you can play an eight and choose any of the four suits.' },
        { question: 'Can an eight be my last card?', answer: 'Yes under the Bicycle rules. The round ends when your hand is empty; some tables agree on a different rule before playing.' },
        { question: 'What if I have no playable card and the stock is empty?', answer: 'Pass. If no one can play, use the fallback your group agreed on before the deal.' },
      ],
      externalLinks: [
        { href: bicycle, label: 'Bicycle: Crazy Eights', description: 'Five-card deal, drawing and scoring used in this guide.' },
        { href: pagat, label: 'Pagat: Crazy Eights and variants', description: 'Two-player setup and common house rules.' },
      ],
      ctaLabel: 'Browse browser games',
      ctaDescription: 'Find a different game to play in your browser.',
    },
    zh: {
      metaTitle: '疯狂八扑克牌规则｜发牌、万能 8 和计分',
      metaDescription: '用一副普通扑克牌玩 Crazy Eights。了解每人发几张、怎样出牌、万能 8 如何指定花色，以及如何结算一轮。',
      heading: '疯狂八（Crazy Eights）扑克牌规则',
      subheading: '用一副牌开局，学会跟花色、用万能 8 换花色和算分。',
      overview: ['最先出完手牌的人赢一轮。普通牌要和当前花色或点数相同，8 可以当万能牌，并为下一位指定花色。下文采用 Bicycle 的规则，其他桌规单独说明。'],
      sections: [
        { title: '发牌和摆放牌堆', body: '使用一副 52 张扑克牌，去掉鬼牌。从发牌者左手边开始，每人轮流发五张暗牌。余牌叠成摸牌堆，翻开牌堆顶一张作弃牌堆。若翻到 8，把它放回摸牌堆中间，再翻一张。发牌者左手边先出，顺时针轮流。' },
        { title: '跟花色、跟点数或用 8 换花色', body: '如果弃牌堆顶是黑桃 6，你可以出任意黑桃或任意 6。也可以出一张 8，并指定下一位要跟的花色。下一位必须跟指定花色，或另出一张 8。万能牌自身的花色不影响选择，也不能指定点数。' },
        { title: '没有牌可出就摸牌', body: '一次摸一张，摸到能出为止，或者摸完牌堆。牌堆已空且仍不能出就跳过。在 Bicycle 的规则中，手里已经有牌能出时也可以选择摸牌。如果所有人都跳过，按开局前约定的方式结束这一轮。' },
        { title: '出完最后一张就结算', body: '第一位出完手牌的人赢一轮，并获得其余玩家剩牌分数的总和。8 每张 50 分，K、Q、J、10 每张 10 分，A 是 1 分，其余牌按点数计分。例如，两位对手分别剩黑桃 Q 和方块 3、梅花 8 和红桃 A，你本轮得到 10 + 3 + 50 + 1 = 64 分。' },
        { title: '两人局与常见桌规', body: '按 Bicycle 规则，两人局也各发五张。Pagat 的基础两人玩法改为各发七张。有些桌只允许摸一张，或规定跳过牌、加摸牌、剩一张时喊牌。洗牌前选定一套。这里采用的规则不会给普通牌附加惩罚。' },
      ],
      recommendations: [],
      faqs: [
        { question: '手里有可以跟的牌，还能出 8 吗？', answer: '可以。只要轮到你，就能出 8 并任选一种花色。' },
        { question: '最后一张可以出 8 吗？', answer: '按 Bicycle 规则可以。出完就结束一轮；若采用其他桌规，开局前先说清楚。' },
        { question: '摸牌堆空了又无牌可出怎么办？', answer: '这回合跳过。如果所有人都无法出牌，按开局时约定的方式收尾。' },
      ],
      externalLinks: [
        { href: bicycle, label: 'Bicycle 的疯狂八规则', description: '本文采用的五张起手、摸牌和计分依据。' },
        { href: pagat, label: 'Pagat 的疯狂八与变体', description: '两人局和常见桌规。' },
      ],
      ctaLabel: '浏览网页游戏',
      ctaDescription: '从目录中挑一款可直接玩的网页游戏。',
    },
  },
};
