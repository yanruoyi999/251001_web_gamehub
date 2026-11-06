import type { SeoLandingPage } from './seo-landing-content';

const PAPER = 'https://arxiv.org/html/2407.05069v1';
const PUBLISHER = 'https://dicegames.com/products/the-original-lcr-left-center-right-dice-game';

export const LCR_GUIDE: SeoLandingPage = {
  slug: 'left-right-center-rules',
  primaryKeyword: 'left right center rules',
  keywords: ['left right center rules', 'left center right rules', 'lcr rules'],
  updatedAt: '2026-11-06',
  documentationCheckedAt: '2026-11-06',
  indexable: true,
  relatedSlugs: ['bunco-rules', 'liars-dice-rules', 'farkle-scoring'],
  locales: {
    en: {
      metaTitle: 'Left Right Center Rules: Dice, Chips and Worked Turns',
      metaDescription: 'Learn a clearly sourced classic LCR dice-game variant, how many dice to roll, what zero chips means, and original chip-count examples.',
      heading: 'Left Right Center Rules: Follow the Chips',
      subheading: 'A classic L/C/R/dot rule reference with original worked turns—not an online game or a money game.',
      overview: [
        'This guide uses the conventional three-chip dice version described in Benjamin and David Richeson’s mathematical study. It is not the boxed instruction sheet and does not replace the directions supplied with your edition. LCR Wild, the card game and house variants are outside this page.',
        'Use ordinary counters with no monetary value. The publisher’s product page confirms the classic set has three specially marked dice and 24 chips. This page provides a learning reference, not an embedded licensed game or a claim of affiliation.',
      ],
      sections: [
        { title: 'Quick answer', body: 'Start with three chips per player. Roll one die per chip, at most three. L passes one chip left, R passes one right, C sends one to the center, and a dot keeps it. Continue clockwise; zero chips means no roll, not permanent elimination. Stop when only one player has chips.' },
        { title: 'Choose the version before the first turn', body: 'Use at least three players and agree that this is the selected L/C/R/dot version. Check the rule sheet in your own set when its markings or directions differ. The linked study supplies the complete rule description used here; the publisher link identifies the original product, not a downloadable instruction manual.', bullets: ['No Wild face or card rules are mixed into this example.', 'A dot may be described as Hold; it causes no transfer.', 'Use the actual roller’s left and right, not the reader’s position on a screen.'] },
        { title: 'How many dice do you roll?', body: 'Count your chips when your turn starts: zero chips means zero dice, one chip means one die, two means two dice, and three or more means three dice. Having five chips does not grant five dice.', bullets: ['Keep the spare chips in front of you while rolling the allowed dice.', 'Resolve every face in that roll; do not roll another set because a dot kept a chip.', 'A chip received before your next turn can change your next dice count.'] },
        { title: 'Original worked turn: three chips, three different faces', body: 'Four players A, B, C and D begin with 3, 3, 3, 3 chips, with zero in the center. A has B and D as the two neighbors and rolls L, R and a dot. A sends one chip to each neighbor and keeps the third. The player counts become 1, 4, 3, 4. The center stays at zero, and the total is still 12.', bullets: ['A did not gain a chip from the dot: the dot kept one already held.', 'Both neighbors gained exactly one; the direction labels decide which face goes to which neighbor.', 'Check the conserved total before taking the next turn. This is an original arithmetic example, not a simulated game result.'] },
        { title: 'Original continuation: four chips still means three dice', body: 'On B’s turn, B holds four chips but rolls only three dice. Suppose the faces are C, C and a dot. Two chips move from B to the center. The player counts are now 1, 2, 3, 4 and the center contains 2; 1 + 2 + 3 + 4 + 2 = 12. The fourth chip was never put at risk by an extra die.', bullets: ['The two center chips remain there during later turns.', 'B keeps two chips: one untouched chip plus the chip retained by the dot.', 'Do not return center chips to an empty-handed player.'] },
        { title: 'Zero chips: skip a roll, stay in the circle', body: 'A player with zero chips does not roll. They may receive a chip from a neighbor later and roll again on their own next turn. An empty position should therefore stay part of the circle while more than one player still holds chips.', bullets: ['In a separate example, a neighbor sends one chip to an empty-handed player. That player has one die available when their next turn arrives.', 'Receiving a chip does not create an immediate extra turn.', 'Do not remove a chair or change who counts as a neighbor just because somebody temporarily has no chips.'] },
        { title: 'When does the game stop?', body: 'The selected version ends when only one player still holds chips. Check this before continuing to another roll; do not make the last chip-holder roll until all chips disappear into the center. Center chips are not another player.', bullets: ['For a plain-counter learning game, record the remaining chip-holder as the winner.', 'The guide does not add a cash stake, payout, prize or strategy guarantee.', 'If your edition has a different finish rule, follow that edition consistently rather than switching mid-game.'] },
        { title: 'A short table-side check', body: 'Before passing the dice, say the starting chip count, the number of dice rolled, the transfers and the ending chip count. When a count seems wrong, reconstruct only that turn. Keep a small center pile separate so nobody mistakes removed chips for someone’s usable stack.', bullets: ['Player chips plus center chips should stay equal to the initial total.', 'The number of rolled dice cannot exceed three or the starting chips.', 'An L/R/C face moves one chip; a dot moves none.', 'For a different dice task, use the Bunco, Liar’s Dice or Farkle references below; their scoring rules do not apply to LCR.'] },
      ],
      recommendations: [],
      faqs: [
        { question: 'Do I roll three dice with two chips?', answer: 'No. In the selected version, two chips allow two dice. The roll is capped at three when you hold three or more chips.' },
        { question: 'Am I out when I have zero chips?', answer: 'Not permanently. Skip your roll; a later chip from a neighbor can bring you back into play.' },
        { question: 'Is this the rule sheet for every LCR edition?', answer: 'No. It describes the conventional dice version in the linked study. Wild, card and house variants may differ; check your own edition.' },
        { question: 'Can I play LCR directly on this page?', answer: 'No. This is a written table-game guide with worked chip examples, not a browser LCR game.' },
      ],
      externalLinks: [
        { href: PAPER, label: 'Richeson & Richeson: selected rules and analysis', description: 'Primary study states the three-chip setup, capped roll, transfers and finish used in this guide. No simulation odds are claimed here.' },
        { href: PUBLISHER, label: 'George & Company: original LCR product', description: 'Publisher product identification and components. This overview is not the full boxed instruction sheet.' },
      ],
      ctaLabel: 'Browse other browser games',
      ctaDescription: 'This opens the general games directory, not an LCR simulator.',
    },
    zh: {
      metaTitle: 'Left Right Center规则：LCR骰子、筹码与回合示例',
      metaDescription: '学习有明确来源的经典LCR骰子版本：掷几枚骰子、零筹码能否回来、何时结束，以及原创筹码流转算例。',
      heading: 'Left Right Center规则：跟着筹码理解LCR',
      subheading: '经典L/C/R/圆点版本的桌面规则与原创算例，不是在线LCR或金钱游戏。',
      overview: [
        '本页采用Benjamin和David Richeson数学研究中说明的常规三筹码骰子版本，不是盒内原版说明书。不同套装以随附规则为准；本页不混入LCR Wild、卡牌版或自定变体。',
        '练习只使用没有金钱价值的计数物。出版方产品页确认经典套装含三枚特制骰子和24个筹码。本页是学习资料，不是获授权嵌入游戏，也不表示与出版方有合作。',
      ],
      sections: [
        { title: '快速规则', body: '每人从三个筹码开始，每个筹码对应一枚骰子、最多三枚。L传给左邻，R传给右邻，C放入中心，圆点保留。按顺时针轮流；零筹码只是本回合不掷，不一定永久出局。仅剩一人持有筹码时结束。' },
        { title: '开局先确认采用哪个版本', body: '至少三人，事先约定本次使用L/C/R/圆点规则。如果你手中骰子标记或说明不同，应核对该套装。此处完整玩法依据是所链接研究，出版方页面仅用来确认产品身份，不能冒充已取得完整官方说明书。', bullets: ['不混用Wild特殊面或卡牌效果。', '圆点也可称Hold，表示不转移筹码。', '左右以正在掷骰者的方向判断，不以屏幕读者的位置判断。'] },
        { title: '到底掷几枚骰子', body: '轮到你时先数筹码：零个不掷，一个掷一枚，两个掷两枚，三个或更多都只掷三枚。手中五个筹码，并不等于可以掷五枚骰子。', bullets: ['多出的筹码留在面前，不增加骰子。', '处理完本次每个骰面；圆点保留筹码并不触发再掷。', '轮到你之前收到筹码，会改变这次可掷数量。'] },
        { title: '原创回合示例：三个筹码与三个不同结果', body: 'A、B、C、D四人各持三个筹码，即3、3、3、3，中心为零。A两侧邻居是B和D；A掷出L、R、圆点，向两个邻居各传一个，自己保留一个。玩家筹码变为1、4、3、4，中心仍为零，总数仍是12。', bullets: ['圆点没有额外送给A筹码，只保留已有的一个。', '两个邻居各增加一个，具体L/R对应谁由座位确定。', '先确认总量守恒再进行下一回合；这是原创算例，不是模拟实验结果。'] },
        { title: '接续示例：四个筹码仍只掷三枚', body: '轮到B时，B有四个筹码但只掷三枚。若结果为C、C、圆点，B向中心移两个。玩家筹码成为1、2、3、4，中心为2，核对1+2+3+4+2=12。第四个筹码没有对应额外的骰子。', bullets: ['中心两个筹码在之后回合继续留在中心。', 'B保留两个：未用于额外掷骰的一个，加上圆点保留的一个。', '不要把中心筹码发给暂时空手的玩家。'] },
        { title: '零筹码：跳过掷骰，但留在圈中', body: '没有筹码时不掷骰，但之后邻居仍可能传给你筹码；再次轮到你便可继续。因此还有多人持筹码时，不应因为某人暂时空手而撤去座位或改变相邻关系。', bullets: ['单独举例：邻居传来一个筹码，则该玩家下次轮到时可掷一枚。', '收到筹码不会立即插入一个额外回合。', '不要把暂时空手与永久出局混为一谈。'] },
        { title: '什么时候停止', body: '所选版本在仅剩一位玩家还有筹码时结束。继续掷骰前应检查是否已到终点，不要要求最后一位也掷到筹码全部进入中心。中心筹码并不是另一个玩家。', bullets: ['无金钱练习局只需记录最后的筹码持有人。', '本页不添加现金下注、奖金、支付或胜率保证。', '若自有版本有其他结束规则，从开局起一致执行，不要中途混用。'] },
        { title: '桌边核对清单', body: '交骰前说出起始筹码、骰子枚数、各方向转移及结束数量。计数不一致时，只回放刚才那一回合；把中心筹码单独放置，避免误当成玩家可以使用的筹码。', bullets: ['所有玩家加中心的筹码总数应等于初始总数。', '掷骰数不能多于三个，也不能多于回合开始的筹码数。', 'L/R/C每面转移一个，圆点不转移。', '下方Bunco、吹牛骰与Farkle属于其他任务，其计分规则不能套入LCR。'] },
      ],
      recommendations: [],
      faqs: [
        { question: '只有两个筹码也掷三枚吗？', answer: '不是。本页采用的版本中，两筹码只掷两枚，三个及以上才掷三枚。' },
        { question: '零筹码就永久出局吗？', answer: '不一定。跳过掷骰；之后邻居传来筹码，便可在自己的回合继续。' },
        { question: '本页是所有LCR版本的官方说明吗？', answer: '不是。它描述所链接研究里的常规骰子版本，Wild、卡牌和家规可能不同，须核对自有版本。' },
        { question: '能直接在本页玩LCR吗？', answer: '不能。这是带筹码算例的桌面规则指南，不是浏览器LCR游戏。' },
      ],
      externalLinks: [
        { href: PAPER, label: 'Richeson研究：本页采用的规则', description: '研究原文说明三筹码、掷骰上限、筹码转移及结束条件。本页不引用胜率模拟结论。' },
        { href: PUBLISHER, label: 'George & Company经典LCR产品', description: '用来核对出版方、产品身份与组件，不把概览当作完整盒内说明书。' },
      ],
      ctaLabel: '浏览其他网页游戏',
      ctaDescription: '进入通用游戏目录，不是打开LCR模拟器。',
    },
  },
};
