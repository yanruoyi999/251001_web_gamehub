import type { SeoLandingPage } from '@/lib/seo-landing-content';

const publisher = 'https://www.zygomatic-games.com/discover-perudo/';
const rulebook = 'https://cdn.svc.asmodee.net/production-zygomatic/uploads/2026/03/ZYGPER01FREN_RULES_EN_20240808.pdf';

export const LIARS_DICE_GUIDE: SeoLandingPage = {
  slug: 'liars-dice-rules',
  primaryKeyword: 'liars dice rules',
  keywords: ['liars dice rules', 'liar’s dice rules', '吹牛骰规则'],
  updatedAt: '2026-11-05T12:58:19+08:00',
  relatedSlugs: ['farkle-scoring', 'shut-the-box-rules'],
  indexable: true,
  locales: {
    en: {
      metaTitle: 'Liar’s Dice Rules: Bids, Wild Ones and a Worked Round',
      metaDescription: 'Learn a Perudo-style ordinary round of Liar’s Dice, including legal raises, wild ones, challenges and a worked example.',
      heading: 'Liar’s Dice Rules: A Perudo-Style Round',
      subheading: 'Make a bid about all the hidden dice, raise it or challenge it.',
      overview: [
        'This guide teaches the ordinary-round rules of a Perudo-style game using the official Zygomatic English rulebook. Other Liar’s Dice versions differ. The optional Last die/Palifico and Bullseye/Calza rules are off here.',
        'Each bid says that at least a given number of dice across all players match a face. Ones are wild in this round, so they also count toward an ordinary face.'
      ],
      quickAnswerLink: { href: rulebook, label: 'Zygomatic: English Perudo rulebook', description: 'Official source for the selected ordinary-round rules.' },
      sections: [
        { title: 'Set up and roll', body: 'Give each player five standard six-sided dice and a cup or other cover. Everyone rolls secretly and looks only at their own dice. Play proceeds clockwise. The opening bid must name an ordinary face from 2 through 6; it cannot name ones.' },
        { title: 'Make and raise a bid', body: 'A bid such as “four twos” claims that at least four dice among all players are twos or wild ones. On your turn, raise the previous bid or challenge it. For ordinary faces, keep the count and name a higher face, or increase the count and choose any ordinary face. A legal raise can still be false.' },
        { title: 'Switch between ordinary faces and ones', body: 'To switch from an ordinary bid of quantity q to ones, bid at least half q rounded up. To switch from q ones back to an ordinary face, bid at least 2q + 1. For example, five fours can become at least three ones; three ones can become at least seven of an ordinary face, not six.' },
        { title: 'Challenge, reveal and start the next round', body: 'Challenge the immediately preceding bid and everyone reveals their dice. Count the named ordinary face plus ones; when the bid names ones, count ones. If the count is at least the bid, the challenger loses one die. Otherwise the bidder loses one die. The loser starts the next round after everyone rolls their remaining dice again. If the loser lost their last die and is eliminated, the player to their left starts. The last player with dice wins.' },
        { title: 'Worked round: four twos, seven twos, challenge', body: 'Three players each have five hidden dice: A has 1, 2, 3, 4, 6; B has 1, 2, 2, 5, 6; C has 2, 3, 4, 5, 6. A bids four twos. B raises to seven twos. C challenges B and all reveal. There are four natural twos and two wild ones, for six matches. Six is below seven, so B loses one die: B has four, A and C have five each, and the total falls from 15 to 14. B starts the next round.' },
        { title: 'Equality counts as enough', body: 'With the same revealed dice, a final bid of six twos would be true: six matches is at least six. The challenger, C, would lose one die. The bid does not have to be exceeded.' },
        { title: 'Agree on the version', body: 'This explanation keeps Last die/Palifico and Bullseye/Calza switched off. Other sets and house rules can change wild dice, bidding or challenges; agree on the rules before playing instead of mixing versions.' },
      ],
      recommendations: [],
      faqs: [
        { question: 'Do ones count as twos?', answer: 'In this ordinary-round version, ones are wild and count toward a bid on any ordinary face, including twos.' },
        { question: 'Can the first bid be ones?', answer: 'No. The opening bid names a face from 2 to 6. Later bids may switch to ones using the stated conversion.' },
        { question: 'What if the revealed count equals the bid?', answer: 'The bid is true because it means at least that many. The challenger loses one die.' },
        { question: 'Who starts after an elimination?', answer: 'If the player who lost a die is eliminated, the player to their left starts the next round.' },
      ],
      externalLinks: [
        { href: publisher, label: 'Zygomatic: Discover Perudo', description: 'Publisher’s game page linking to the English rulebook.' },
        { href: rulebook, label: 'Zygomatic: English rulebook', description: 'Source for the ordinary-round rules and the two optional rules excluded here.' },
      ],
      ctaLabel: 'Browse games',
      ctaDescription: 'For more tabletop rules, see the related Farkle and Shut the Box guides.',
    },
    zh: {
      metaTitle: '吹牛骰规则：叫点、万能1点与完整示例',
      metaDescription: '学习Perudo式普通回合的吹牛骰规则，包括合法加叫、万能1点、质疑和原创算例。',
      heading: '吹牛骰规则：Perudo式普通回合',
      subheading: '对所有隐藏骰子叫点，接着加叫或质疑。',
      overview: [
        '本指南依据Zygomatic官方英文规则书，讲解Perudo式普通回合。其他吹牛骰版本可能不同；本页关闭Last die/Palifico和Bullseye/Calza两项可选规则。',
        '每次叫点都断言所有玩家的骰子中，至少有指定数量匹配某个点数。普通回合中1点是万能点，也计入普通点数。'
      ],
      quickAnswerLink: { href: rulebook, label: 'Zygomatic：Perudo英文规则书', description: '本页普通回合规则的官方来源。' },
      sections: [
        { title: '准备与掷骰', body: '每人准备五颗普通六面骰和骰盅或遮挡物。所有人秘密掷骰，只看自己的骰面，按顺时针行动。第一口必须叫2至6的普通点数，不能叫1。' },
        { title: '叫点和加叫', body: '例如“四个2”表示所有玩家的骰子合计至少有四颗2或万能1。轮到你时，可以加叫上一口，也可以质疑。同叫普通点时，数量不变须叫更高的点数；数量增加则可以改叫任意普通点数。合法加叫不代表它一定真实。' },
        { title: '在普通点数与1之间换叫', body: '从数量为q的普通点数换叫1，数量至少是q的一半向上取整；从q个1换回普通点数，数量至少为2q + 1。例如五个4可换叫至少三个1；三个1换回普通点数至少叫七个，不能叫六个。' },
        { title: '质疑、揭骰和下一回合', body: '质疑紧前一口后，所有人揭骰。普通点数叫点要把该点数和1点一起计数；叫1时只数1。实际数量至少等于叫点，质疑者失去一骰；否则叫点者失去一骰。大家用剩余骰子重新掷骰，由失骰者开始下一回合；若其失去最后一骰而出局，则由其左边玩家开始。最后仍有骰子的玩家获胜。' },
        { title: '算例：四个2、七个2、质疑', body: '三人各有五颗隐藏骰子：A为1、2、3、4、6；B为1、2、2、5、6；C为2、3、4、5、6。A叫四个2，B加叫七个2，C质疑B后全部揭骰。真正的2有四个，万能1有两个，共六个匹配。六小于七，因此B失去一骰，剩四骰；A和C各五骰，总数由15变14。B开始下一回合。' },
        { title: '恰好相等也算达到', body: '相同骰面下，若最后一口是六个2，则六个匹配已达到“至少六个”，叫点成立，质疑者C失去一骰。实际数量不必超过叫点。' },
        { title: '先约定使用哪个版本', body: '本页关闭Last die/Palifico和Bullseye/Calza。其他规则或桌规可能改变万能点、叫点或质疑办法；开局前先约定，避免混用。' },
      ],
      recommendations: [],
      faqs: [
        { question: '1点算作2点吗？', answer: '在本页普通回合中，1是万能点，叫任何普通点数（包括2）时都计入。' },
        { question: '第一口能叫1吗？', answer: '不能。第一口必须叫2至6；之后可按换叫规则叫1。' },
        { question: '揭骰数量恰好等于叫点怎么办？', answer: '叫点表示至少该数量，因此叫点成立，质疑者失去一骰。' },
        { question: '有人出局后谁先叫？', answer: '如果失骰者因此出局，由其左边玩家开始下一回合。' },
      ],
      externalLinks: [
        { href: publisher, label: 'Zygomatic：Perudo介绍', description: '出版方游戏页面，提供英文规则书链接。' },
        { href: rulebook, label: 'Zygomatic：英文规则书', description: '普通回合与本页关闭的两项可选规则的来源。' },
      ],
      ctaLabel: '浏览游戏',
      ctaDescription: '还可阅读相关的Farkle和Shut the Box桌面规则指南。',
    },
  },
};
