import { describe, expect, it } from 'vitest';
import sitemap from '@/app/sitemap';
import {
  getSeoLandingPage,
  getSeoLandingPages,
} from '@/lib/seo-landing-content';

// Test-only rule oracle, independent of the article's data and text formatter.
// Moving a joker before the matching upper/kind boxes are full must fail.
const upper = ['aces', 'twos', 'threes', 'fours', 'fives', 'sixes'];
const lower = [
  'threeKind',
  'fourKind',
  'fullHouse',
  'smallStraight',
  'largeStraight',
  'yahtzee',
  'chance',
];
type Turn = {
  dice: readonly number[];
  category: string;
  score: number;
  bonus: number;
};

function normalScore(dice: readonly number[], category: string): number {
  const counts = Array.from(
    { length: 6 },
    (_, i) => dice.filter(d => d === i + 1).length
  );
  const sum = dice.reduce((a, b) => a + b, 0);
  const face = upper.indexOf(category) + 1;
  if (face) return counts[face - 1] * face;
  switch (category) {
    case 'threeKind':
      return Math.max(...counts) >= 3 ? sum : 0;
    case 'fourKind':
      return Math.max(...counts) >= 4 ? sum : 0;
    case 'fullHouse':
      return counts.includes(3) && counts.includes(2) ? 25 : 0;
    case 'smallStraight':
      return [0, 1, 2].some(start =>
        counts.slice(start, start + 4).every(Boolean)
      )
        ? 30
        : 0;
    case 'largeStraight':
      return [0, 1].some(start => counts.slice(start, start + 5).every(Boolean))
        ? 40
        : 0;
    case 'yahtzee':
      return counts.includes(5) ? 50 : 0;
    case 'chance':
      return sum;
    default:
      throw new Error('Unknown category');
  }
}

function checkTurns(turns: readonly Turn[]) {
  const filled = new Map<string, number>();
  let bonuses = 0;
  for (const turn of turns) {
    if (
      turn.dice.length !== 5 ||
      turn.dice.some(d => !Number.isInteger(d) || d < 1 || d > 6)
    )
      throw new Error('Invalid dice');
    if (filled.has(turn.category)) throw new Error('Reused box');
    let score = normalScore(turn.dice, turn.category);
    let bonus = 0;
    if (new Set(turn.dice).size === 1 && filled.has('yahtzee')) {
      bonus = filled.get('yahtzee') === 50 ? 100 : 0;
      const matching = upper[turn.dice[0] - 1];
      const kinds = ['threeKind', 'fourKind'].filter(box => !filled.has(box));
      const allowed = !filled.has(matching)
        ? [matching]
        : kinds.length
          ? kinds
          : lower;
      if (!allowed.includes(turn.category)) throw new Error('C2406 priority');
      if (
        ['fullHouse', 'smallStraight', 'largeStraight'].includes(turn.category)
      ) {
        score = { fullHouse: 25, smallStraight: 30, largeStraight: 40 }[
          turn.category
        ]!;
      }
    }
    if (turn.score !== score || turn.bonus !== bonus)
      throw new Error('Incorrect points');
    filled.set(turn.category, score);
    bonuses += bonus;
  }
  const upperTotal = upper.reduce(
    (sum, box) => sum + (filled.get(box) ?? 0),
    0
  );
  const lowerTotal = lower.reduce(
    (sum, box) => sum + (filled.get(box) ?? 0),
    0
  );
  return {
    boxes: filled.size,
    upperTotal,
    lowerTotal,
    bonuses,
    total: upperTotal + (upperTotal >= 63 ? 35 : 0) + lowerTotal + bonuses,
  };
}

describe('C2406 theoretical Yahtzee guide', () => {
  it('registers a bilingual article on the two real public paths without claiming publication', async () => {
    const page = getSeoLandingPage('highest-scoring-yahtzee-game');
    expect(page, 'the bounded theoretical guide is registered').toBeDefined();
    expect(
      getSeoLandingPages().filter(p => p.slug === page!.slug)
    ).toHaveLength(1);
    expect(page!.publishedAt).toBeUndefined();
    expect(page!.embedGame).toBeUndefined();
    expect(page!.interactiveWidget).toBeUndefined();
    expect(page!.printablePath).toBeUndefined();
    const urls = (await sitemap()).map(entry => entry.url);
    expect(urls.filter(url => url.endsWith(`/guides/${page!.slug}`))).toEqual([
      `https://www.lumagamehub.com/guides/${page!.slug}`,
      `https://www.lumagamehub.com/en/guides/${page!.slug}`,
    ]);
    for (const related of page!.relatedSlugs)
      expect(getSeoLandingPage(related)).toBeDefined();
  });

  it('legally attains the upper bound with 13 unique boxes and 12 extra bonuses', async () => {
    expect(getSeoLandingPage('highest-scoring-yahtzee-game')).toBeDefined();
    const { YAHTZEE_MAX_WITNESS: turns } = await import(
      '@/lib/yahtzee-max-guide-content'
    );
    expect(turns).toHaveLength(13);
    expect(new Set(turns.map(turn => turn.category))).toEqual(
      new Set([...upper, ...lower])
    );
    expect(checkTurns(turns)).toEqual({
      boxes: 13,
      upperTotal: 105,
      lowerTotal: 235,
      bonuses: 1200,
      total: 1575,
    });

    // Enumerate every five-die result: the article cannot invent a larger box maximum.
    const categories = [...upper, ...lower];
    const maxima = categories.map(() => 0);
    for (let n = 0; n < 6 ** 5; n++) {
      const dice = Array.from(
        { length: 5 },
        (_, i) => (Math.floor(n / 6 ** i) % 6) + 1
      );
      categories.forEach((box, i) => {
        maxima[i] = Math.max(maxima[i], normalScore(dice, box));
      });
    }
    expect(maxima).toEqual([5, 10, 15, 20, 25, 30, 30, 30, 25, 30, 40, 50, 30]);
    expect(maxima.reduce((a, b) => a + b, 0) + 35 + 12 * 100).toBe(1575);

    // A premature full-house substitution still has an unfilled Four of a Kind box.
    const premature = [...turns];
    [premature[8], premature[9]] = [premature[9], premature[8]];
    expect(() => checkTurns(premature)).toThrow('C2406 priority');
    // The first extra Yahtzee cannot bypass its still-empty matching Aces box.
    expect(() =>
      checkTurns([turns[0], { ...turns[1], category: 'threeKind' }])
    ).toThrow('C2406 priority');
    expect(() => checkTurns([{ ...turns[0], bonus: 100 }])).toThrow(
      'Incorrect points'
    );
    expect(() => checkTurns([...turns, turns[12]])).toThrow('Reused box');
    const zeroStart = [
      { dice: [1, 2, 3, 4, 6], category: 'yahtzee', score: 0, bonus: 0 },
    ];
    expect(() =>
      checkTurns([
        ...zeroStart,
        { dice: [6, 6, 6, 6, 6], category: 'sixes', score: 30, bonus: 100 },
      ])
    ).toThrow('Incorrect points');
    expect(
      checkTurns([
        ...zeroStart,
        { dice: [6, 6, 6, 6, 6], category: 'sixes', score: 30, bonus: 0 },
      ]).bonuses
    ).toBe(0);
  });

  it('validates the visible witness in both languages, including category names and displayed totals', () => {
    const page = getSeoLandingPage('highest-scoring-yahtzee-game');
    expect(page).toBeDefined();
    const labels: Record<string, string> = {
      Aces: 'aces',
      Twos: 'twos',
      Threes: 'threes',
      Fours: 'fours',
      Fives: 'fives',
      Sixes: 'sixes',
      'Three of a Kind': 'threeKind',
      'Four of a Kind': 'fourKind',
      'Full House': 'fullHouse',
      'Small Straight': 'smallStraight',
      'Large Straight': 'largeStraight',
      Yahtzee: 'yahtzee',
      Chance: 'chance',
    };
    for (const locale of ['en', 'zh'] as const) {
      const rows = page!.locales[locale].sections.find(section =>
        section.title.startsWith(
          locale === 'en' ? 'A complete 13-turn' : '完整13回合'
        )
      )!.bullets!;
      expect(rows).toHaveLength(13);
      const parsed = rows.map((row, i) => {
        const numbers = row.match(/\d+/g)!.map(Number);
        expect(numbers[0]).toBe(i + 1);
        const category = Object.keys(labels)
          .sort((a, b) => b.length - a.length)
          .find(label => row.includes(`[${label}]`));
        expect(category).toBeDefined();
        expect(numbers[8]).toBe(numbers[6] + numbers[7]);
        return {
          dice: numbers.slice(1, 6),
          category: labels[category!],
          score: numbers[6],
          bonus: numbers[7],
        };
      });
      expect(checkTurns(parsed).total).toBe(1575);
    }
  });
});
