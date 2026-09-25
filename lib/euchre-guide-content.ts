import type { Locale } from '@/i18n/config';
import type { SeoLandingPage, SeoLandingSection } from '@/lib/seo-landing-content';

type Text = Record<Locale, string>;
interface Example { title: Text; trump: string; lead: string; hand: string[]; legal: string[]; chosen: string; explanation: Text; trick?: string[]; winner?: number }
/** Original fixed exercises, not recorded games or an optimal-play solver. */
export const EUCHRE_EXAMPLES: Example[] = [
  {
    title: { en: 'Example 1: a printed diamond is not always a diamond', zh: '例1：印着方块的牌不一定属于方块' },
    trump: 'H', lead: 'KD', hand: ['JD', 'AD', '9C', 'QC', 'KS'], legal: ['AD'], chosen: 'AD',
    explanation: { en: 'You must follow with the ace of diamonds. The jack of diamonds is the left bower and counts as a heart, so it cannot replace a diamond while you hold one. This identifies the legal play; unseen opponents can still affect who wins the trick.', zh: '必须跟方块A。方块J此时是左王牌，算红桃；仍持有方块时，不能拿它代替跟花。这只确定合法出牌，不代表一定赢下本墩，其他人的牌尚未全部出现。' },
  },
  {
    title: { en: 'Example 2: follow trump with the left bower', zh: '例2：领出主花色时，左王牌也必须跟花' },
    trump: 'H', lead: '9H', hand: ['JD', 'AD', '9C', 'QC', 'KS'], legal: ['JD'], chosen: 'JD',
    explanation: { en: 'The jack of diamonds is your only heart for this hand, so you must play it. You cannot discard the ace of diamonds to save the left bower. The right bower could still beat it if another player holds and plays that card.', zh: '方块J是你手里唯一算红桃的牌，必须打出，不能为了保存左王牌而垫方块A。若别人随后打出右王牌，它仍可能被压过；合法跟花不等于保证赢墩。' },
  },
  {
    title: { en: 'Example 3: do not spend a bower on a finished partner winner', zh: '例3：末位出牌时，不必浪费王牌抢同伴的墩' },
    trump: 'C', lead: 'KS', hand: ['JS', 'QH', '10H', 'KD', '9D'], legal: ['JS', 'QH', '10H', 'KD', '9D'], chosen: '9D',
    trick: ['KS', 'AS', '9S', '9D'], winner: 1,
    explanation: { en: 'You play last and North is your partner. North’s ace of spades is already winning. Your jack of spades counts as a club, so you have no spades to follow. Discard the nine of diamonds and preserve the left bower. This conclusion depends on being last; do not assume an early partner winner is safe.', zh: '你在末位出牌，北家是同伴，其黑桃A已经领先。你的黑桃J属于梅花主牌，因此没有黑桃需要跟；垫方块9即可保留左王牌。这个结论依赖你最后行动，不能把前面暂时领先的同伴牌都当成安全赢墩。' },
  },
  {
    title: { en: 'Example 4: use the right bower when the opponents are winning', zh: '例4：对手用左王牌压住同伴时，右王牌可以夺回本墩' },
    trump: 'S', lead: 'AH', hand: ['JS', 'QC', 'KD', '10D', '9D'], legal: ['JS', 'QC', 'KD', '10D', '9D'], chosen: 'JS',
    trick: ['AH', '9S', 'JC', 'JS'], winner: 3,
    explanation: { en: 'North’s nine of spades has been overtaken by East’s jack of clubs, the left bower. You have no hearts and may trump. Playing the jack of spades, the right bower, wins this trick for your partnership. Saving a high trump is not useful when the immediate trick must be recovered.', zh: '同伴北家的黑桃9已被东家的梅花J压过；梅花J是左王牌。你没有红桃，可以出主牌；打出黑桃J这张右王牌便能为本队赢下这一墩。需要争取眼前这一墩时，不能机械地保存高主牌。' },
  },
];
const suits: Record<string, Text> = { H: { en: 'hearts', zh: '红桃' }, D: { en: 'diamonds', zh: '方块' }, C: { en: 'clubs', zh: '梅花' }, S: { en: 'spades', zh: '黑桃' } };
const ranks: Record<string, string> = { J: 'jack', Q: 'queen', K: 'king', A: 'ace', '9': 'nine', '10': 'ten' };
function cardName(card: string, locale: Locale): string {
  const suit = suits[card.slice(-1)][locale], value = card.slice(0, -1);
  return locale === 'en' ? `${ranks[value]} of ${suit}` : `${suit}${value}`;
}
function practiceSections(locale: Locale): SeoLandingSection[] {
  const zh = locale === 'zh';
  return EUCHRE_EXAMPLES.map(example => ({
    title: example.title[locale],
    body: `${zh ? '主花色：' : 'Trump: '}${suits[example.trump][locale]}. ${zh ? '领牌：' : 'Led card: '}${cardName(example.lead, locale)}. ${zh ? '你的五张手牌：' : 'Your five cards: '}${example.hand.map(card => cardName(card, locale)).join(', ')}.${example.trick ? ` ${zh ? '你坐南家，北家是同伴。西、北、东前三家依次打出：' : 'You sit South; North is your partner. West, North and East have played, in that order: '}${example.trick.slice(0, 3).map(card => cardName(card, locale)).join(', ')}.` : ''}`,
    bullets: [`${zh ? '示例选择：' : 'Example play: '}${cardName(example.chosen, locale)}. ${example.explanation[locale]}`],
  }));
}
const sources = (zh: boolean) => [
  { href: 'https://bicyclecards.com/how-to-play/euchre', label: zh ? 'Bicycle：Euchre基本规则' : 'Bicycle: Euchre rules', description: zh ? '核对叫主、跟花、独打和基本计分；牌数及目标分按本页版本。' : 'Rules for making trump, following suit, lone hands and scoring; deck and target-score variations are stated separately here.' },
  { href: 'https://www.pagat.com/euchre/euchre.html', label: zh ? 'Pagat：北美Euchre及变体' : 'Pagat: North American Euchre and variations', description: zh ? '区分24张北美版本与正文中的英国带大小王版本；桌规需要提前约定。' : 'Distinguishes North American play from the British joker variant described earlier on that page.' },
  { href: 'https://ohioeuchre.com/E_What-card-should-I-lead.php', label: zh ? 'OhioEuchre：领牌的情境判断' : 'OhioEuchre: choosing an opening lead', description: zh ? '作者按叫主者、同伴与防守角色讨论领牌，不代表适用于所有牌局的胜率保证。' : 'The author separates maker, partner and defender situations; tactical advice is not a universal win guarantee.' },
];

export const EUCHRE_GUIDE: SeoLandingPage = {
  slug: 'euchre-strategy', primaryKeyword: 'euchre strategy',
  keywords: ['euchre strategy', 'euchre strategy for beginners', 'euchre left bower', 'euchre calling trump'],
  updatedAt: '2026-09-25T02:40:00Z',
  relatedSlugs: ['categories-game-topics', 'how-to-play-dominoes'],
  locales: {
    en: {
      metaTitle: 'Euchre Strategy: Calling Trump, Bowers and Worked Examples',
      metaDescription: 'Plan a Euchre hand with a trump checklist, four original worked examples, left-bower follow-suit rules, partner leads and a clear 24-card scoring reference.',
      heading: 'Euchre Strategy: Make a Plan for Your Five Cards',
      subheading: 'A beginner decision guide with original examples, not a promise to win every hand.',
      overview: [
        'Good decisions start with the correct suit of each card, the job your team has taken on, and the order in which players act. Use the checklist before calling trump, then work through the four examples. They separate legal plays from tactical choices instead of treating every high card as an automatic winner.',
        'This guide uses four-player partnership Euchre with a 24-card deck: nine through ace in each suit, no joker, five cards per player, first team to ten points, and maker-only lone hands. Agree separately on stick-the-dealer and other house rules. It is a written learning guide, not an online table, odds calculator, or a transcript of real matches.',
      ],
      sections: [
        { title: 'Quick strategy: decide what your team needs before choosing a card', body: 'Count the left bower as trump, assess a realistic route to three tricks, and account for who gets the up-card. After the call, follow the effective suit, track the bowers, and avoid using a winner on a trick your partner has already secured. These are decision prompts, not a fixed bidding threshold or guaranteed strategy.' },
        { title: 'Know the contract and the score', body: 'The team naming trump is the maker team and needs at least three of five tricks. Three or four score one point; five together score two. A lone maker taking all five scores four, while three or four alone still score one. Fewer than three gives the defenders two. This guide plays to ten; different decks, lone-defender bonuses and target scores require different agreements.' },
        { title: 'Treat the left bower as a suit change', body: 'Without a joker, trump runs from the right bower (jack of trump), to the left bower (the other jack of the same color), then ace, king, queen, ten and nine. There are seven trumps. When hearts are trump, the jack of diamonds belongs to hearts for following suit as well as winning tricks. Its printed diamond does not let you dodge a trump lead.' },
        { title: 'Before calling: count control, not just face cards', body: 'Ask which cards can win, which need a favorable lead, and which depend on your partner. Two bowers are strong, but they are not by themselves a five-trick plan. A side ace can be trumped by a player with no cards of that suit. Passing is allowed in the usual first round, but it does not guarantee that a safer contract will follow.', bullets: ['Who is the dealer, and does ordering up strengthen your team or the opponents?', 'Which higher trumps are outside your hand, and can you regain the lead?', 'Are your side cards supported, or are you counting the same hoped-for trick twice?', 'What happens at this table if everyone passes twice?'] },
        { title: 'Dealer example: evaluate the hand after the pickup and discard', body: 'Suppose you are dealer, the up-card is the nine of hearts, and your five cards are jack of hearts, jack of diamonds, ace of clubs, king of clubs and nine of spades. If hearts become trump, taking the up-card and discarding the nine of spades leaves three trumps and two clubs. You have removed an effective suit and gained trump control. That is a reason to consider a call, not proof of a lone sweep: the remaining trumps and the opening lead still matter.' },
        { title: 'Opening leads: maker, partner and defender have different jobs', body: 'With strong trump and side winners, a maker may lead trump to remove opponents’ opportunities to cut those side suits. A partner who called trump often benefits from a trump lead too. On defense, an off-suit ace can be a candidate, but a void opponent can trump it. Do not turn any of these into “always lead trump” or “never lead trump.” Explain what the lead is meant to achieve in the actual hand.' },
        ...practiceSections('en'),
        { title: 'Going alone and calling next are decisions, not shortcuts', body: 'A lone call removes your partner from the hand, so check your weak side cards and who leads before choosing it. Four points are attractive, but a strong-looking hand need not sweep. In the second round, next means the same-color suit as the rejected up-card; crossing means the other color. Earlier passes are clues, not proof of missing cards. Use your seat, hand and score rather than automatically calling next.' },
        { title: 'A short review after each hand', body: 'Separate a legal mistake from a decision made with incomplete information. Record the trump suit, your seat, the visible up-card, the score, your chosen play and one reasonable alternative. Do not rewrite the decision as obvious after seeing hidden cards. Start by correcting missed follow-suit duties and wasted partner winners before adding more elaborate conventions.', bullets: ['Before the call: identify both bowers and the dealer’s possible pickup.', 'Before a play: check effective suit, current winner and players still to act.', 'After the hand: review one decision without inventing a win-rate claim.'] },
      ],
      recommendations: [],
      faqs: [
        { question: 'What is the best Euchre strategy for a beginner?', answer: 'First get effective suits and legal following right. Then plan for the three-trick maker contract, account for the dealer’s pickup, and distinguish a safe partner winner from one an opponent can still beat. No single bidding rule guarantees a win.' },
        { question: 'Does the left bower count as its printed suit?', answer: 'No. In the no-joker version here, it counts as trump for the whole hand. With hearts trump, the jack of diamonds is a heart, not a diamond.' },
        { question: 'Should I always lead trump?', answer: 'No. A trump lead can help a strong maker or the calling partner, but its value depends on your hand, the remaining trump and who needs the lead. The example of saving a bower is a last-seat situation, not a universal rule.' },
        { question: 'Do three trump cards guarantee a successful call?', answer: 'No. Their ranks, side cards, seat, up-card and the unknown cards all matter. Assess how the partnership could take three tricks rather than treating a card count as certainty.' },
        { question: 'Can I play a full Euchre game on this page?', answer: 'No. This page contains a strategy checklist and fixed written exercises. Use the linked rules to agree on a version before playing with your own group.' },
      ],
      externalLinks: sources(false),
      ctaLabel: 'Browse browser games', ctaDescription: 'For a different tabletop activity, see the related Categories and Dominoes guides.',
    },
    zh: {
      metaTitle: 'Euchre策略：叫主、左右王牌与原创例手',
      metaDescription: '用明确的24张Euchre规则学习叫主、左王牌跟花、同伴配合和计分。附四个原创例手与决策检查表，不承诺胜率，不冒充在线牌桌。',
      heading: 'Euchre策略：为五张手牌制定计划',
      subheading: '从有效花色与团队目标出发，附原创例手；不是每局必胜口诀。',
      overview: [
        '先弄清每张牌当前属于什么花色、哪一队承担叫主任务，以及谁先谁后行动，再谈策略。下方检查表用于叫主前思考，四个例手则把合法出牌与情境选择分开。大牌并不自动等于一墩，看到结果后也不能倒推当时一定有唯一正确选择。',
        '本页采用四人搭档、24张牌、每种花色9至A、无大小王、每人五张、先到10分的版本；只有叫主者可以独打。是否强制庄家在第二轮叫主等桌规，需要开局前另行约定。本页是文字指南，不是在线牌桌、概率计算器，也没有使用真实对局记录。',
      ],
      sections: [
        { title: '快速策略：先想本队需要什么，再选出哪张牌', body: '把左王牌归入主花色，考虑本队怎样取得三墩，并计算翻开的牌会交给哪位庄家。叫主后，先按有效花色跟牌，再关注左右王牌和仍未行动的玩家。同伴已确定赢下的墩，不必再浪费大牌。这是一套检查问题，不是固定叫牌门槛或胜率保证。' },
        { title: '分清叫主任务与当前比分', body: '确定主花色的一队是叫主方，五墩中需要至少三墩。取得三或四墩得1分，搭档拿全五墩得2分；独打拿全五墩得4分，独打三或四墩仍得1分。叫主方不足三墩，对手得2分。本页以10分结束为例；牌数、独守奖励或目标分不同的玩法不能混在一起。' },
        { title: '左王牌不是普通的同色J', body: '无大小王时，主牌从大到小为右王牌（主花色J）、左王牌（同颜色另一花色J）、A、K、Q、10、9，共七张。红桃为主时，方块J的有效花色是红桃，跟花和比大小都如此。它印着方块，不代表你可以在别人领红桃时逃避跟主。' },
        { title: '叫主前：数控制力，不只数人头牌', body: '分别判断哪些牌有机会直接赢、哪些要等合适的领牌、哪些依赖同伴。两张王牌很强，但不能单凭它们保证五墩。副花色A也可能被缺门玩家用主牌压过。通常第一轮可以不叫，但放过这次机会不保证后面会有更安全的主花色。', bullets: ['庄家是谁？叫起翻开的牌，会增强本队还是对手？', '还有哪些更高主牌不在手里？失去出牌权后怎样夺回？', '副花色是否有支撑？有没有把同一个希望重复算成两墩？', '本桌所有人连续两轮不叫时，重发还是强制庄家叫主？'] },
        { title: '庄家例手：捡牌后连同弃牌一起评估', body: '假设你是庄家，翻牌为红桃9，手中是红桃J、方块J、梅花A、梅花K、黑桃9。如果红桃成为主花色，捡红桃9并弃黑桃9后，就有三张主牌与两张梅花，减少了一种有效花色。这给了你考虑叫主的理由，却不能证明独打一定拿全五墩：剩余主牌和谁先领牌仍会改变结果。' },
        { title: '领牌：叫主者、同伴与防守方任务不同', body: '主牌强且有副花色赢张时，叫主者可能先领主，减少对手随后用主牌压副花色的机会。同伴叫主时，领主也常有帮助。防守方可以考虑副花色A，但缺门对手仍可用主牌压它。不要把这些建议变成永远领主或永不领主的口诀；应说明这一手领牌想达成什么。' },
        ...practiceSections('zh'),
        { title: '独打与叫next：先看条件，不套捷径', body: '独打会让同伴退出本手，因此要检查弱副牌及首攻位置。四分有吸引力，但看起来很强不等于一定拿全。第二轮的next指被翻下花色的同颜色另一花色；crossing指另一颜色。前面的不叫只是线索，不是别人缺牌的证明。应结合座位、手牌和比分判断，不自动叫next。' },
        { title: '每手结束，只复盘一个决定', body: '区分违反跟花规则和信息不完整时的策略选择。记下主花色、座位、已知翻牌、比分、实际选择及一个合理替代。不要看到暗牌后才说当时答案显然如此。先纠正漏跟花和抢同伴已稳的墩，再逐步加入更复杂的配合。', bullets: ['叫主前：确认左右王牌和庄家可能补到的牌。', '出牌前：确认有效花色、当前领先者和未行动玩家。', '结束后：复盘一个决策，不编造胜率或样本结论。'] },
      ],
      recommendations: [],
      faqs: [
        { question: '新手先练什么Euchre策略？', answer: '先练有效花色和合法跟牌，再考虑叫主方的三墩任务、庄家捡牌，以及同伴的领先是否已经安全。不存在对所有手牌都保证取胜的叫牌口诀。' },
        { question: '左王牌还属于印刷花色吗？', answer: '不属于。本页无大小王版本里，左王牌整手都算主花色。红桃为主时，方块J算红桃，不算方块。' },
        { question: '应该每次都领主牌吗？', answer: '不应该。领主可以帮助主牌强的叫主方或叫主同伴，但价值取决于手牌、剩余主牌与出牌权。例3保留左王牌的结论依赖末位行动，不是所有场景的通用规则。' },
        { question: '有三张主牌就一定能叫成功吗？', answer: '不一定。主牌大小、副牌、座位、翻牌和未知牌都重要。应考虑本队怎样取得三墩，而不是把张数当成必胜证明。' },
        { question: '本页可以玩完整Euchre吗？', answer: '不可以。这里只提供策略检查表和固定文字练习。实际与朋友开局前，请参考所列规则并约定具体版本。' },
      ],
      externalLinks: sources(true), ctaLabel: '浏览小游戏', ctaDescription: '想换一种桌面活动，可以查看相关的Categories和Dominoes指南。',
    },
  },
};
