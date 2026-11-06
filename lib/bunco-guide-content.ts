import type { SeoLandingPage } from '@/lib/seo-landing-content';

const source = 'https://www.worldbunco.com/rules1.html';

export const BUNCO_GUIDE: SeoLandingPage = {
  slug: 'bunco-rules',
  primaryKeyword: 'bunco game rules',
  keywords: ['bunco game rules', 'bunco rules', 'Bunco规则'],
  updatedAt: '2026-11-05T14:24:00+08:00',
  relatedSlugs: ['farkle-scoring', 'liars-dice-rules', 'left-right-center-rules'],
  indexable: true,
  locales: {
    en: {
      metaTitle: 'Bunco Game Rules: Scoring and Table Rotation',
      metaDescription: 'Learn a 12-person Bunco game, from dice scoring and the head-table bell to rotation and a worked example.',
      heading: 'Bunco Game Rules for 12 Players',
      subheading: 'Play four sets, score each roll and change partners between rounds.',
      overview: [
        'This guide explains the 12-person, three-table, four-set version on the World Bunco Association (WBA) website. House rules and other versions differ. This guide is independent and is not affiliated with the WBA.',
        'Each set has six rounds, with targets from 1 through 6. The table tally belongs to a team for that round; wins, losses and Bunco counts are recorded by each player.'
      ],
      quickAnswerLink: { href: source, label: 'World Bunco Association: Bunco rules', description: 'Source for the selected 12-person version.' },
      sections: [
        { title: 'Set up the tables', body: 'Seat four people at each of three tables, with partners opposite one another. Designate table 1 as the head table and choose a scorekeeper at each table. Each table needs three dice and a team tally; each player needs a personal record for wins, losses and their own Buncos. The head table rings a bell to start each round.' },
        { title: 'Score a roll', body: 'In round 1 the target is 1, in round 2 it is 2, and so on through 6. Roll all three dice each time. Add the result to your team’s round tally:', bullets: ['One or two target dice: 1 point per matching die.', 'Three target dice: 21 points for a Bunco, not 24. Shout Bunco and add one Bunco only to the roller’s personal record.', 'Three of the same non-target number: 5 points, with no personal Bunco.', 'Anything else: zero points.'] },
        { title: 'Continue, pass and hear the bell', body: 'After any scoring roll, roll all three dice again. After a zero, keep the points already earned and pass clockwise. When a head-table team reaches 21 or rolls a Bunco, the head table rings the ending bell. At the other tables, the current roller finishes their current turn; everyone does not get another circuit. A secondary table reaching 21 or rolling a Bunco does not end play at all tables.' },
        { title: 'Worked example: target 5 at table 2', body: 'The teal team starts at 9. Nora rolls (5, 5, 1), adding 2 for 11; then (2, 2, 2), adding 5 for 16. She rolls (1, 3, 6) for zero, keeps the 7 points earned and passes clockwise. Later her partner rolls (5, 5, 5), shouts Bunco and adds 21 for 37; only that partner records one personal Bunco. This is the score immediately after that roll, not the final round score: the scoring roller continues, and table 2 does not ring the ending bell.' },
        { title: 'Check the boundary', body: 'With target 5, a head-table team on 20 rolls (5, 1, 3), reaches 21 and rings the bell. A roll of (5, 5, 2) scores 2, not a triple; (2, 2, 2) scores 5 but is not a Bunco.' },
        { title: 'Record the round and rotate', body: 'After the bell and any current turns are finished, the higher-scoring team at each table wins that round. Both partners record a personal W; the other pair each record L. Start the next round with fresh team tallies. Rotate as follows:', bullets: ['Table 1: winners stay; losers go to table 2.', 'Table 2: winners go to table 1; losers go to table 3.', 'Table 3: winners go to table 2; losers stay at table 3.', 'At each table with a pair staying (tables 1 and 3), one of that pair changes chairs so that both receive new partners.'] },
        { title: 'Optional house convention for ties — agree before play', body: 'The WBA page calls for a roll-off but does not specify all its mechanics. This guide’s original optional house convention is: each tied team selects one player to roll three dice; compare the dice totals, and repeat on a tie until they differ. The higher total wins. For tied individual awards, each tied player rolls the same way. These roll-off totals add no round points or personal Buncos. For example, at 18–18, totals of 10 and 12 give the team rolling 12 the W. This procedure is a house convention, not a WBA mandate.' },
        { title: 'Finish four sets', body: 'After all 24 rounds, compare each player’s personal Bunco count and wins as separate categories; losses are also on the personal record. The basic guide does not treat accumulated team points as a universal party championship.' },
      ],
      recommendations: [],
      faqs: [
        { question: 'Does a Bunco add 21 plus three points?', answer: 'No. The target triple scores 21 in total and adds one Bunco to the roller’s personal record.' },
        { question: 'Does a Bunco at table 2 stop everyone?', answer: 'No. Wait for the head-table ending bell; the current roller at each other table finishes their turn.' },
        { question: 'Are team points and personal wins the same?', answer: 'No. Partners share a round tally, but each records their own W or L and only the roller records a Bunco.' },
      ],
      externalLinks: [{ href: source, label: 'World Bunco Association: Bunco rules', description: 'The selected webpage version; tie procedure above is an optional house convention.' }],
      ctaLabel: 'Browse games',
      ctaDescription: 'Explore related Farkle and Liar’s Dice guides.',
    },
    zh: {
      metaTitle: 'Bunco游戏规则：计分、换桌与示例',
      metaDescription: '学习12人Bunco的骰子计分、头桌铃声、换桌方式与完整算例。',
      heading: '12人Bunco游戏规则',
      subheading: '玩四组、记录每次掷骰，并在每轮后更换搭档。',
      overview: [
        '本指南讲解World Bunco Association（WBA）网站上的12人、三桌、四组版本。其他玩法和桌规可能不同。本指南独立制作，与WBA没有关联。',
        '每组六轮，目标点数依次为1至6。每轮桌上队分由搭档共享；胜负和Bunco次数由各人记录。'
      ],
      quickAnswerLink: { href: source, label: 'World Bunco Association：Bunco规则', description: '本页所选12人版本的来源。' },
      sections: [
        { title: '安排桌位', body: '三桌各坐四人，对坐者为搭档。指定1号桌为头桌，每桌选一位记分员。每桌准备三颗骰子和队分记录，每人准备个人记录，记胜、负及本人Bunco次数。每轮由头桌响铃开始。' },
        { title: '掷骰计分', body: '第一轮目标是1，第二轮是2，依次到6。每次都掷全部三颗骰子，把结果加到本队本轮队分：', bullets: ['一颗或两颗目标点：每颗1分。', '三颗都是目标点：Bunco得21分，不是24分；喊出Bunco，只有掷出者个人记录加一次。', '三颗相同但不是目标点：得5分，不计个人Bunco。', '其他结果：零分。'] },
        { title: '续掷、交骰与结束铃', body: '任何得分结果都继续掷全部三骰；掷出零分时保留已得分数，按顺时针交骰。头桌有队伍达到21分或掷出Bunco时，头桌响结束铃。其他桌正在掷骰的人完成当前个人回合；不是所有人再轮一圈。其他桌先到21分或掷出Bunco，都不会结束全场。' },
        { title: '算例：2号桌目标5', body: '青队起始9分。Nora掷出（5，5，1）加2至11；再掷（2，2，2）加5至16；再掷（1，3，6）得零分，保留已得的7分并顺时针交骰。后来搭档掷出（5，5，5），喊Bunco，加21至37；仅该搭档个人记一次Bunco。这是该次掷骰后的即时分数，并非本轮最终分数：得分者继续掷，2号桌也不因此响结束铃。' },
        { title: '检查边界', body: '目标为5时，头桌一队原有20分，掷出（5，1，3）加1恰好到21分，应响结束铃。（5，5，2）得2分，不是三同点；（2，2，2）得5分，但不是Bunco。' },
        { title: '记胜负并换桌', body: '结束铃后，待其他桌当前个人回合完成，各桌队分较高的一队赢得本轮，两个搭档各记一个W；另一队两人各记一个L。下一轮队分从零开始。按以下方式换桌：', bullets: ['1号桌：胜者留桌，负者去2号桌。', '2号桌：胜者去1号桌，负者去3号桌。', '3号桌：胜者去2号桌，负者留在3号桌。', '在有一对留桌的1号和3号桌，各由这对中的一人换座，使双方都与新来者搭档。'] },
        { title: '可选平手桌规——开局前约定', body: 'WBA网页要求平手进行掷骰决胜，但没有写明全部操作。以下是本指南原创的可选桌规：平手两队各派一人掷三骰，比骰面总和；再平则重掷，直到不同，较高者胜。个人奖项并列时，各并列者同样掷骰比较。决胜骰面总和不加入普通轮队分，也不增加Bunco次数。例如18比18时，两队分别掷出总和10和12，掷12的一队记W。这是桌规，不是WBA强制细则。' },
        { title: '完成四组', body: '24轮结束后，分别比较每人的Bunco次数和胜场；个人记录也保留负场。本基础指南不把累计队分当成统一的聚会总冠军标准。' },
      ],
      recommendations: [],
      faqs: [
        { question: 'Bunco是21分再加3分吗？', answer: '不是。目标三同点总共得21分，只有掷出者个人记一次Bunco。' },
        { question: '2号桌掷出Bunco会让全场停止吗？', answer: '不会。等待头桌结束铃；其他桌当前掷骰者完成自己的回合。' },
        { question: '队分和个人胜场一样吗？', answer: '不一样。搭档共享本轮队分，但各自记录W或L，只有掷出者记录Bunco。' },
      ],
      externalLinks: [{ href: source, label: 'World Bunco Association：Bunco规则', description: '所选网页版本；上面的平手操作是可选桌规。' }],
      ctaLabel: '浏览游戏',
      ctaDescription: '还可阅读Farkle和吹牛骰相关指南。',
    },
  },
};
