import type { SeoLandingPage } from '@/lib/seo-landing-content';

/** Original local movement example; not a complete board or game state. */
export const CHINESE_CHECKERS_HOP_EXAMPLE = {
  start: [0, 0],
  stops: [[2, 0], [2, 2]],
  occupied: [[1, 0], [2, 1]],
} as const;
const point = (p: readonly number[]) => `(${p.join(',')})`;
const route = [CHINESE_CHECKERS_HOP_EXAMPLE.start, ...CHINESE_CHECKERS_HOP_EXAMPLE.stops].map(point).join(' → ');
const source = 'https://www.winning-moves.com/images/ChineseCheckers_Rules.pdf';

export const CHINESE_CHECKERS_GUIDE: SeoLandingPage = {
  slug: 'chinese-checkers-rules',
  primaryKeyword: 'chinese checkers rules',
  keywords: ['chinese checkers rules', 'how to play chinese checkers', 'chinese checkers jumping rules'],
  updatedAt: '2026-11-08T00:00:00.000Z',
  documentationCheckedAt: '2026-11-08',
  indexable: true,
  relatedSlugs: ['how-to-play-dominoes', 'left-right-center-rules', 'shut-the-box-rules'],
  locales: {
    en: {
      metaTitle: 'Chinese Checkers Rules: Setup, Hops and Finishing Your Triangle',
      metaDescription: 'Learn a named Chinese Checkers rules edition: player setup, adjacent steps, legal hop chains, no captures, edition differences and an original worked turn.',
      heading: 'Chinese Checkers Rules: A Clear First Game',
      subheading: 'A tabletop guide to the Winning Moves rules edition, with an original hop example—not an online game.',
      overview: [
        'Move your ten pegs into the triangle directly opposite your start. This guide follows the linked Winning Moves instruction sheet, checked on 8 November 2026. House rules differ, especially for blocking, so agree on the edition before play.',
        'Unlike capture-based checkers, jumping is a way to travel: the peg you cross stays on the board. Bring a physical board and pegs; this page explains decisions rather than providing a playable board.',
      ],
      sections: [
        { title: 'Set up for 2 / 3 / 4 / 6 players', body: 'Give each player 10 pegs in one starting triangle. Assign the directly opposite triangle as that player’s destination. For two players use opposite points; for three use alternating points; for four use two opposing pairs; six fills every point. Refer to the publisher’s setup diagrams when arranging colors.' },
        { title: 'Choose one step OR a chain of hops', body: 'On your turn move one peg. Either step into a neighboring empty hole, or hop over an adjacent peg into the empty hole immediately beyond it on the same straight line. A hop may cross your own or another player’s peg. Do not remove that peg.', bullets: ['A distant peg with a gap before it is not an adjacent hop anchor.', 'The landing hole must be empty; seeing a useful peg beyond an occupied landing does not make the jump legal.', 'A step cannot be followed by a hop in the same turn.'] },
        { title: 'Continue a hop chain—or stop', body: 'After a legal hop, the same peg may hop again, changing direction when the next adjacent peg and empty landing permit it. Continuing is optional. Steps and hops may go in any direction; advancing toward the goal is a strategic choice, not a forward-only rule.' },
        { title: 'Worked turn: two hops, zero captures', body: `Use these axial coordinates as labels for a small triangular-lattice example, not as a complete board. Put the moving peg at (0,0), other pegs at (1,0) and (2,1), and leave (2,0) and (2,2) empty. The route is ${route}. The first hop crosses (1,0); the second crosses (2,1). Both crossed pegs remain where they were. You could instead stop at (2,0).`, bullets: ['Before: three pegs are present in this local example.', 'After: the moving peg is at (2,2), while the two hop anchors remain; there are still three pegs.', 'Counterexample: if (2,0) is occupied, the first hop is illegal. A later empty hole does not rescue it.'] },
        { title: 'Separate the written rules from house rules', body: 'The linked two-page sheet does not specify a ban on stopping in another triangle, a rule preventing a peg from leaving its goal, or an exchange remedy for blocking. Do not present those as this publisher’s rules. Agree any extra restrictions before play, or use the instructions supplied with your own set.' },
        { title: 'Winning, five players and optional variations', body: 'The single-set winner is first to bring all 10 pegs into the opposite point. The sheet also offers a five-player teaching variant: a beginner faces the empty point and receives an advantage, so do not describe that setup as balanced competition. Optional two- and three-player multi-set games and a longer-game points variant are described separately in the source.' },
        { title: 'A practical checklist before moving', body: 'Point to the moving peg, its first anchor and its landing. Check each proposed hop independently, then check where the entire turn ends. A long chain is not automatically better if it strands another peg or removes a useful bridge for your next turn.', bullets: ['Say “step” or “hops” before beginning a demonstration turn.', 'Trace the full route without lifting any crossed peg.', 'Check each landing and any extra stopping rule your group agreed before play.', 'Keep practice discussions separate from your agreed competitive turn rules.'] },
        { title: 'Resolve a disagreement without inventing a rule', body: 'First identify the disputed action: an empty landing, the direction of travel, a stopping triangle, or final blocking. Compare that action with the chosen instruction sheet. If your set uses a different rule, record it before the next game rather than quietly switching versions mid-turn.' },
      ],
      recommendations: [],
      faqs: [
        { question: 'Do you capture pieces in Chinese Checkers?', answer: 'No. Under the rules used here, a crossed peg stays in place. Removing it changes the later hop routes and is not part of the game.' },
        { question: 'Can you jump backward?', answer: 'Yes. A legal hop can go in any direction. It still needs an adjacent occupied hole and an empty landing directly beyond it, following a straight board line.' },
        { question: 'Must you take every available jump?', answer: 'No. The sheet permits one or more jumps rather than requiring every available jump. Check any additional house restrictions separately.' },
        { question: 'Can five people play this rules edition?', answer: 'Yes. The publisher describes a five-player teaching variant that gives the beginner or youngest player the empty opposite point as an advantage. It is distinct from the usual 2 / 3 / 4 / 6-player arrangements.' },
      ],
      externalLinks: [{ href: source, label: 'Winning Moves Chinese Checkers instructions (PDF)', description: 'Two-page publisher rules and setup diagrams, Item 1244, ©2021. Additional blocking and goal restrictions are not specified in this sheet.' }],
      ctaLabel: 'Explore more tabletop guides',
      ctaDescription: 'Compare other rules-based games using the related guides below. This page does not launch a Chinese Checkers game.',
    },
    zh: {
      metaTitle: '跳棋规则：人数摆法、连续跳跃与进入目标三角区',
      metaDescription: '按 Winning Moves 指定版本学习 Chinese Checkers：人数与摆法、相邻移动、连续跳跃、不吃子、版本差异及原创走子例子。',
      heading: 'Chinese Checkers 跳棋规则：从摆棋到走完一回合',
      subheading: '依据 Winning Moves 说明书的桌面玩法指南，附原创跳跃例子；不是在线跳棋游戏。',
      overview: [
        '目标是把自己的 10 枚棋子全部移进起点正对面的三角区。本页采用下方 Winning Moves 两页规则版本，核对日期为 2026 年 11 月 8 日。堵门和停留区域的家规可能不同，开局前请先约定版本。',
        '这里的“跳过”不是吃子：被越过的棋子留在原处。请准备实体棋盘与棋子；本页帮助理解走法，不提供可操作的在线棋盘。',
      ],
      sections: [
        { title: '2 / 3 / 4 / 6 人如何摆棋', body: '每人选一种颜色，把 10 枚棋子放在一个起始三角区，以正对面的三角区为目标。两人相对而坐；三人使用相隔的三个角；四人使用两组成对的相对角；六人占满六角。颜色位置不确定时，以出版方说明书的摆法图为准。' },
        { title: '一回合选“走一步”或“连续跳”', body: '每回合只移动一枚棋子。可以走到相邻空位，也可以越过紧邻的一枚棋子，落到同一直线上紧接其后的空位。可以越过自己或别人的棋子，但不能拿走被跳过的棋子。', bullets: ['中间先隔着空位的远处棋子，不是相邻的跳跃支点。', '落点必须为空；更远处有空位，也不能跨过被占据的直接落点。', '不能先走一步，再在同一回合接着跳。'] },
        { title: '跳过一次后可以继续，也可以停', body: '同一枚棋子完成一次合法跳跃后，可以寻找新的相邻支点继续跳，方向也可以改变；不强制跳到底。平移和跳跃均可朝任意方向，向目标推进是策略，不是“只能向前”的规则。' },
        { title: '原创例子：两次跳跃，不吃任何棋子', body: `以下坐标只标示三角网格中的一个局部例子，不代表完整棋盘。移动棋子位于 (0,0)，另外两枚棋子位于 (1,0) 和 (2,1)，而 (2,0) 与 (2,2) 为空。路线为 ${route}。第一跳越过 (1,0)，第二跳越过 (2,1)，两枚支点棋子始终留在原处；也可以在 (2,0) 停下。`, bullets: ['开始时局部有三枚棋子。', '结束时移动棋子在 (2,2)，两枚支点棋子仍在，合计仍是三枚。', '反例：如果 (2,0) 被占，第一跳就不合法，不能因为后面有空位而跳过它。'] },
        { title: '说明书规则与家规要分开', body: '所引两页说明书未规定不能停在其他三角区、进入目标区后不能退出，或堵门时可以交换棋子。不要把这些补充约定写成该出版方规定。如果你的棋具或同伴采用额外限制，应在开局前讲清楚。' },
        { title: '胜利、五人教学变体与其他玩法', body: '单套棋子玩法中，先把全部 10 枚移入正对面星角的人获胜。说明书另列五人教学变体：让新手或年龄最小者面向空角，使其获得优势，不能把它说成均衡竞赛摆法。两人或三人控制多套棋子、以及多局积分玩法属于另列变体，请按原说明分别约定。' },
        { title: '落子前的四步自查', body: '先指出要移动的棋子、第一枚支点棋子和空落点；再逐跳检查，最后检查整条路线的终点。跳得更远不一定更好：还需要考虑落单棋子，以及移动后会不会失去下一回合可用的支点。', bullets: ['演示前说清“走一步”还是“连续跳”。', '沿完整路线指过去，不拿走任何被越过的棋子。', '确认每个落点为空，并核对开局前另行约定的停留家规。', '练习讨论和正式对局的回合约定分开处理。'] },
        { title: '发生争议时先查版本', body: '先确认争议属于空落点、移动方向、终点三角区还是最后堵门，再对照已约定的说明书。如果你的棋具采用不同规则，应在下一局开始前明确记录，而不是在一回合中临时换规则。' },
      ],
      recommendations: [],
      faqs: [
        { question: '跳棋跳过对手后要吃子吗？', answer: '不要。本页版本中，被越过的棋子留在原处，拿走它会改变后续跳跃路线，并不属于本规则。' },
        { question: '可以向后跳吗？', answer: '可以朝任意方向跳，但仍须有紧邻支点，并沿棋盘直线落在支点紧接其后的空位。' },
        { question: '有路就必须一直跳下去吗？', answer: '不必，说明书允许跳一次或多次，并未要求把所有可用跳跃都走完。额外家规须另行约定。' },
        { question: '这个版本可以五个人玩吗？', answer: '可以。说明书列出五人教学变体，让新手或年龄最小者面向空角以获得优势；它与常见的 2 / 3 / 4 / 6 人摆法分开说明。' },
      ],
      externalLinks: [{ href: source, label: 'Winning Moves 跳棋说明书（PDF）', description: '出版方两页规则与图示，Item 1244、©2021；该页未规定额外的堵门交换和目标区停留限制。' }],
      ctaLabel: '查看更多桌游规则指南',
      ctaDescription: '下方提供相关游戏规则的入口，本页不会启动在线跳棋。',
    },
  },
};
