import type { SeoLandingPage } from '@/lib/seo-landing-content';

const tournament = 'https://gallivantingdeuces.com/howtoplay.html';
const variants = 'https://www.pagat.com/climbing/bigtwo.html';

export const PUSOY_DOS_GUIDE: SeoLandingPage = {
  slug: 'pusoy-dos-rules',
  primaryKeyword: 'pusoy dos rules',
  keywords: ['pusoy dos rules', 'how to play pusoy dos', 'pusoy dos suit order'],
  updatedAt: '2026-11-24T00:00:00.000Z',
  documentationCheckedAt: '2026-11-24',
  indexable: false,
  relatedSlugs: ['crazy-eights-rules', 'spit-card-game-rules'],
  locales: {
    en: {
      metaTitle: 'Pusoy Dos Rules: Four Players, Card Order and a Worked Deal',
      metaDescription: 'Learn a diamonds-high Filipino Pusoy Dos table. Try two turn decisions, then deal out four original hands and follow the play to the winning card.',
      heading: 'Pusoy Dos Rules for Four Players',
      subheading: 'A diamonds-high teaching table, with two plays to call and a complete deal to try.',
      overview: ['Pusoy Dos is a shedding game, distinct from Pusoy, where each player arranges three poker hands. The player holding 3♣ opens. Be the first to empty your hand by playing a stronger combination of the same size or taking control after the other players pass. Bring a standard deck and three friends to play the example below.'],
      sections: [
        { title: 'Deal and make the opening play', body: 'Remove the jokers. Deal 13 cards to each of four seats. Play clockwise. The opening combination must include 3♣. It may be a single, a pair, three of a kind or a valid five-card hand. On a fresh lead you choose the combination and must play.' },
        { title: 'Match the number of cards', body: 'For singles, pairs and triples, the ranks rise from 3 through 10, J, Q, K, A to 2. For equal singles compare suits: clubs ♣, spades ♠, hearts ♥, diamonds ♦, lowest to highest. For equal pairs compare the highest suit in each pair. For triples compare rank. A single 2♦ beats any single, but cannot beat a pair.' },
        { title: 'Compare two five-card hands', body: 'From low to high: straight, flush, full house, four of a kind plus a fifth card, straight flush. A flush has five cards of one suit, a full house is a triple plus a pair, and a straight flush is five consecutive cards of the same suit. A stronger category wins. For straights use the sequence 2–3–4–5–6–7–8–9–10–J–Q–K–A without wrapping: 2–3–4–5–6 is allowed, J–Q–K–A–2 is not. Compare the top card, then its suit. Compare flushes by suit first, then ranks from highest down (ace high, two low). Compare full houses by the triple and quads by the four; compare straight flushes like straights.' },
        { title: 'Pass, take the lead and finish', body: 'Once you pass, sit out the current trick. Skip seats that have already passed. When everyone except the last player to lay cards has passed, clear the table. All four seats are back in; that player leads any valid combination. Stop as soon as someone plays their final card or combination.' },
        { title: 'Agree on the table before dealing', body: 'Filipino tables differ on suit order, straights, re-entry after a pass and whether play continues for second place. This lesson uses diamonds high, passing locks you out until the next lead, and the first player out wins. It does not use betting or points.' },
      ],
      recommendations: [],
      faqs: [
        { question: 'Can I switch from a pair to a single?', answer: 'Only with a fresh lead. While the pair is still on the table, play a higher pair or pass.' },
        { question: 'Do three passes have to happen after the winning play?', answer: 'No. A player who passed earlier is already out of this trick. When only the last player to play remains, that seat leads again.' },
      ],
      externalLinks: [
        { href: tournament, label: 'Gallivanting Deuces tournament rules', description: 'Compare its Philippine table conventions.' },
        { href: variants, label: 'Pagat’s Big Two variants', description: 'Compare opening cards, suits and local rules.' },
      ],
      ctaLabel: 'Browse more games', ctaDescription: 'Find another card game for your table.',
    },
    zh: {
      metaTitle: 'Pusoy Dos 菲律宾大老二规则：四人桌与完整牌例',
      metaDescription: '按方块最大的四人桌规学习 Pusoy Dos。先判断两次轮到谁出牌，再按四副原创手牌从梅花 3 打到有人出完。',
      heading: 'Pusoy Dos 菲律宾大老二四人规则',
      subheading: '方块最大的教学桌。先判断两次出牌，再用一副牌复盘整把。',
      overview: ['Pusoy Dos 比谁先出完，与把 13 张牌分成三墩的 Pusoy 不同。拿到梅花 3 的人先出。跟牌必须张数相同且更强；其他人都过后，你就可以重新领出。谁先出完谁赢。准备一副普通扑克牌，四人可以照下面的手牌摆一桌。'],
      sections: [
        { title: '发牌和首手', body: '去掉大小王，四人各发 13 张，顺时针轮流出牌。第一手必须含 3♣，可以出单张、对子、三条或合法五张牌。清桌后重新领出时，可以任选合法牌型，不能过。' },
        { title: '跟牌张数要相同', body: '单张、对子、三条的点数从小到大是 3 至 10、J、Q、K、A、2。单张同点时按梅花 ♣、黑桃 ♠、红桃 ♥、方块 ♦ 升序比较。同点对子比各自最大的花色；三条比点数。2♦ 是最大的单张，也不能压对子。' },
        { title: '两副五张牌怎么比', body: '从弱到强是顺子、同花、葫芦、四条带一、同花顺。同花是五张同一花色，葫芦是三条加一对，同花顺是同一花色的五张连续牌。牌型较强者直接胜。同为顺子时，按 2、3、4 至 K、A 连取五张，不循环；允许 2–3–4–5–6，不允许 J–Q–K–A–2。先比顺子的顶张，再比顶张花色。同花先比花色，再从最大点数逐张比（A 高、2 低）。葫芦比三条，四条带一比四条，同花顺按顺子比。' },
        { title: '过牌、领出和结束', body: '说过，本墩就退出；以后轮转跳过已过的人。当其他三席都已过，最后出牌的人清桌，四人重新入场，由他任选合法牌型领出。一人出完最后一张或最后一组，这把立即结束。' },
        { title: '开局先约定桌规', body: '不同牌桌对花色、顺子、过牌后能否重入、是否继续争第二名有不同做法。本桌方块最大，过牌退出当前墩，到首家出完为止，无下注，也不累计分数。' },
      ],
      recommendations: [],
      faqs: [
        { question: '能从对子改出单张吗？', answer: '清桌后重新领出可以。对子还在桌上时，只能用更强的对子接，或者过。' },
        { question: '一定要在最后一手之后连听三声「过」才清桌吗？', answer: '不用。此前已过的人已退出本墩，只剩最后出牌者时就清桌。' },
      ],
      externalLinks: [
        { href: tournament, label: 'Gallivanting Deuces 比赛桌规', description: '对照菲律宾风格的开局和过牌约定。' },
        { href: variants, label: 'Pagat 的大老二区域玩法', description: '核对各地的首手、花色与变体。' },
      ],
      ctaLabel: '浏览更多游戏', ctaDescription: '给下一桌找一种新玩法。',
    },
  },
};
