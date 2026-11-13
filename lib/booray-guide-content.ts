import type { SeoLandingPage } from '@/lib/seo-landing-content';

const rulesSource = 'https://www.pagat.com/rams/boure.html';

export const BOORAY_GUIDE: SeoLandingPage = {
  slug: 'booray-card-game-rules',
  primaryKeyword: 'booray card game rules',
  keywords: ['booray card game rules', 'bourré rules', 'how to play bourre', 'boo-ray card game'],
  updatedAt: '2026-11-13T00:00:00.000Z',
  indexable: true,
  relatedSlugs: ['euchre-strategy', 'three-player-spades'],
  locales: {
    en: {
      metaTitle: 'Booray (Bourré) Card Game Rules: Deal, Draw and Play',
      metaDescription:
        'Learn how to play Louisiana Bourré (Booray): deal five cards, reveal trump, draw or pass, and resolve ties and zero-trick hands with worked examples.',
      heading: 'Booray (Bourré) Card Game Rules',
      subheading: 'Learn the Louisiana trick-taking game with five cards each and a bowl of counters.',
      overview: [
        'Deal five cards to each player, turn the dealer’s last card up to set trump, then decide whether to play or sit out. If you stay in, try to win more tricks than any other player. A trick is one card from each player still in the hand.',
        'Bourré is also spelled Booray, Bourre or Boo-Ray. This guide uses the Louisiana rules documented by Pagat. You can use counters with no cash value.',
      ],
      sections: [
        {
          title: 'Set up and deal five cards each',
          body: 'Use a standard 52-card deck with no jokers. The game accommodates two to eight players; five to seven is a practical group. Each player puts one counter in the middle before the first deal. Deal clockwise, one card at a time, starting to the dealer’s left. Keep every card face down except the dealer’s own fifth card. Its suit is trump, and the card is part of the dealer’s hand.',
        },
        {
          title: 'Decide whether to play, then draw or pass',
          body: 'Starting to the dealer’s left, take turns announcing whether you will play. If you pass, set your whole hand face down and sit out this deal. If you play, discard zero to five cards face down and draw the same number before the next player decides.',
          bullets: [
            'If the stock runs out, shuffle the cards already discarded or set aside by earlier players. Leave out the discards of the player currently drawing.',
            'Under these rules, the dealer must play if the exposed trump is an ace. If everyone but one person passes, that person wins the hand without playing a card.',
          ],
        },
        {
          title: 'Follow suit first, then trump, and beat the best legal card if you can',
          body: 'The first active player clockwise from the dealer leads. Each other active player plays one card clockwise. The highest trump wins; if no trump was played, the highest card in the suit led wins. Aces are high, twos are low. The winner leads the next trick.',
          bullets: [
            'If you have the suit led, you must follow it, even if someone has already played a trump.',
            'If you cannot follow, you must play a trump if you have one. Only discard another suit when you have neither the suit led nor trump.',
            'Within those limits, beat the card currently winning whenever you can. If you cannot beat it, you still have to follow suit or trump as required.',
            'A cinch means your tricks already won and those still guaranteed total at least three. Lead your highest trump if you have one, or use it when following if trump is legal. An equivalent trump is allowed, such as the king when you hold both the ace and king. In last position, use the ordinary rules.',
          ],
        },
        {
          title: 'Worked example: when must you overtrump?',
          body: 'Hearts are trump. The lead is the 9 of clubs and the second player plays the 4 of hearts. You hold no clubs and have the 2 and jack of hearts. You must play the jack because it beats the 4. If the 2 were your only heart, you would still have to play it. If you had a club instead, you would have to follow clubs, even though it could not win.',
        },
        {
          title: 'Settle the hand after five tricks',
          body: 'The player with the most tricks takes the counters in the middle. Two tricks can win when the other three tricks go to three different players. If players tie for most tricks, nobody takes the counters: carry them forward. Anyone who stayed in and won no tricks goes bourré and adds the amount that was in the middle to the next hand. Sitting out does not count as going bourré.',
          bullets: [
            'For example, six players start with six counters in the middle. Four stay in and finish 2–2–1–0. The six carry forward, the player with zero tricks adds six, and the three players who neither tied for first nor went bourré add one each. The next hand starts with 15.',
            'Rotate the deal clockwise. In this version, players who tied for the lead or already paid for going bourré skip the next ordinary one-counter contribution.',
          ],
        },
        {
          title: 'Correct a wrong card before the next play',
          body: 'Playing an illegal card is called a renege. If you replace it before the next person plays, you cannot take the counters this hand or deal on your next turn. You only owe the zero-trick penalty if you actually take no tricks. If you leave the mistake uncorrected when the next player acts, the penalty is to match the counters in the middle.',
        },
        {
          title: 'Agree on table rules before you start',
          body: 'Some tables reveal a separate card for trump, ask players to declare before anyone draws, or cap how many counters can be lost in one deal. For a first game, use the deal and draw order above, keep a finite pool of counters and agree how many hands to play.',
        },
      ],
      recommendations: [],
      faqs: [
        {
          question: 'Is Booray the same as poker?',
          answer: 'No. Bourré is decided by tricks, not poker hands. It uses a trump suit and requires players to follow suit when they can.',
        },
        {
          question: 'Can a player take the hand with two tricks?',
          answer: 'Yes. With a 2–1–1–1 split, two is the sole highest total. With a 2–2–1 split, first place is tied and the counters carry forward.',
        },
        {
          question: 'Do you have to draw replacement cards?',
          answer: 'No. You can play your original five cards. If you discard any cards, draw the same number so you start play with five.',
        },
      ],
      externalLinks: [
        { href: rulesSource, label: 'Pagat’s Bourré rules', description: 'Louisiana rules, cinch, settlement and regional variations.' },
      ],
      ctaLabel: 'Browse browser games',
      ctaDescription: 'Find other games in the Luma catalogue.',
    },
    zh: {
      metaTitle: 'Booray（Bourré）扑克牌规则｜发牌、换牌与赢墩',
      metaDescription:
        '学会路易斯安那扑克牌游戏 Booray（Bourré）：每人五张牌，亮牌定主，决定参加还是退出，学会换牌、跟花、压主和平局与零墩结算。',
      heading: 'Booray（Bourré）扑克牌规则',
      subheading: '每人五张牌，用普通扑克牌和不兑钱的计数筹码练习吃墩。',
      overview: [
        '每人发五张牌，翻开发牌人最后一张牌来定主花色，然后决定参加还是退出本局。参加的人要争取比任何一个对手赢更多墩。仍在局内的人各出一张牌，就组成一墩。',
        'Bourré 也常写作 Booray、Bourre 或 Boo-Ray。下文采用 Pagat 记载的路易斯安那玩法。',
      ],
      sections: [
        {
          title: '准备一副牌，每人发五张',
          body: '用一副 52 张的扑克牌，去掉鬼牌。两到八人都能玩，五到七人较合适。第一局每人往桌中央放一个计数筹码。从发牌人的左边起按顺时针每人一张，发到每人五张。只有发牌人自己的第五张要亮出。亮牌的花色是本局主花色，这张牌仍属于发牌人。',
        },
        {
          title: '轮流决定参加或退出，参加的人可以换牌',
          body: '从发牌人左边开始，依次宣布是否参加。退出的人把手牌扣下，这局不再出牌。参加的人可以一张不换，也可以扣下最多五张，再补抽同样张数。等当前玩家补完才轮到下一人决定。',
          bullets: [
            '如果备用牌抽完，就把先前玩家已经弃掉或扣下的牌洗匀补上。正在补牌的人刚弃掉的牌不要洗进去。',
            '按这套规则，若翻开的主牌是 A，发牌人必须参加。如果只剩一人参加，此人直接赢下本局，不用出牌。',
          ],
        },
        {
          title: '先跟花，缺门才出主；能压就必须压',
          body: '发牌人左边第一位还在局内的人领出，其他人依顺时针各出一张。出了主牌就由最大的主牌赢墩；没出主牌，就由领出花色中最大的一张赢墩。A 最大，2 最小。赢墩的人领出下一墩。',
          bullets: [
            '手里有领出花色，必须跟这门花色，即使别人已经用主牌压住。',
            '没有领出花色，但有主牌，就必须出主。两者都没有，才可以垫其他花色。',
            '在跟花和出主的限制下，能压过当前领先的牌就必须压。压不过也要照样跟花，缺门时照样出主。',
            '锁定胜局（cinch）指已赢墩数加上接下来稳拿的墩数至少为三。领出时有主牌就出最大的主牌；跟出时能合法出主，也要用最大的主牌。能起到同样作用的主牌可以替代，例如同时持有主牌 A 和 K，可以出 K。若是该墩最后一人，按普通规则处理。',
          ],
        },
        {
          title: '实战例子：什么时候必须压主？',
          body: '本局红桃是主。先手出梅花 9，第二人用红桃 4 压住。你没有梅花，手里有红桃 2 和红桃 J，就必须出红桃 J。若只剩红桃 2，虽然压不过，也必须出。反过来，只要手里还有梅花，就得跟梅花，即使赢不了这墩。',
        },
        {
          title: '打完五墩后结算',
          body: '单独赢墩最多的人拿走桌中央的筹码。例如 2–1–1–1，赢两墩的人独胜；如果最多的人并列，就把筹码留到下一局。参加了却一墩没赢叫做 bourré，要给下一局补入等于本局桌中央原有数量的筹码。选择退出的人不算零墩受罚。',
          bullets: [
            '例如六个人开局各放一个筹码，四人参加，结果是 2–2–1–0。原来的六个筹码结转，零墩者补六个，另外三位既未并列第一也没有零墩处罚的人各放一个。下一局从 15 个筹码开始。',
            '按顺时针轮换发牌人。这套规则中，并列第一或已付零墩处罚的人，下局免放普通的一个筹码。',
          ],
        },
        {
          title: '出错牌要在下一人出牌前改正',
          body: '出不合规则的牌叫 renege。如果在下一人出牌前换回合法的牌，本局失去拿取桌中央筹码的资格，下次轮到自己也不能发牌；只有实际赢了零墩，才需要补零墩处罚。如果下一人出牌时还没改正，就要按桌中央原有的筹码数量补入下一局。',
        },
        {
          title: '开局前约定桌规',
          body: '有的桌另外翻一张定主，有的要求所有人先表态再统一换牌，也有的为单局筹码损失设上限。初次玩可以沿用上面的发牌和换牌顺序，用数量有限的计数筹码，并先约定总局数。',
        },
      ],
      recommendations: [],
      faqs: [
        {
          question: 'Booray 是扑克比牌型的玩法吗？',
          answer: '不是。Bourré 比谁赢的墩多，不比顺子或对子等牌型。游戏有主花色，有领出花色时必须跟。',
        },
        {
          question: '只赢两墩也能赢这一局吗？',
          answer: '可以，只要没有人和你并列。2–1–1–1 时两墩独胜；2–2–1 时并列，筹码留到下一局。',
        },
        {
          question: '一定要换牌吗？',
          answer: '不必。可以用原来的五张牌参赛。若弃牌，就补抽同样张数，出牌前仍有五张。',
        },
      ],
      externalLinks: [
        { href: rulesSource, label: 'Pagat 的 Bourré 规则', description: '路易斯安那玩法、锁定胜局规则、结算和地区变体。' },
      ],
      ctaLabel: '浏览网页游戏',
      ctaDescription: '在 Luma 目录中挑选其他游戏。',
    },
  },
};
