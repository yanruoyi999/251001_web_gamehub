import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

type Card = { rank: number; suit: string };

// Test-only subset oracle. It receives the published examples but no production
// scoring logic; changing a card, claimed score or flush context must fail.
function countHand(held: readonly Card[], starter: Card, crib = false) {
  const cards = [...held, starter];
  const subsets = Array.from({ length: 31 }, (_, n) =>
    cards.filter((_, i) => ((n + 1) & (1 << i)) !== 0)
  );
  const fifteens =
    subsets.filter(
      set => set.reduce((sum, card) => sum + Math.min(card.rank, 10), 0) === 15
    ).length * 2;
  const pairs =
    subsets.filter(set => set.length === 2 && set[0].rank === set[1].rank)
      .length * 2;
  const runs = subsets.filter(set => {
    const ranks = set.map(card => card.rank).sort((a, b) => a - b);
    return (
      ranks.length >= 3 &&
      ranks.every((rank, i) => i === 0 || rank === ranks[i - 1] + 1)
    );
  });
  const longest = Math.max(0, ...runs.map(run => run.length));
  const runPoints = runs.filter(run => run.length === longest).length * longest;
  const fourSuit = held.every(card => card.suit === held[0].suit);
  const fiveSuit = fourSuit && starter.suit === held[0].suit;
  const flush = fiveSuit ? 5 : fourSuit && !crib ? 4 : 0;
  const nobs = held.some(card => card.rank === 11 && card.suit === starter.suit)
    ? 1
    : 0;
  return {
    fifteens,
    pairs,
    runs: runPoints,
    flush,
    nobs,
    total: fifteens + pairs + runPoints + flush + nobs,
  };
}

function peggingPoints(sequence: readonly number[]) {
  const count = sequence.reduce((sum, rank) => sum + Math.min(rank, 10), 0);
  if (count > 31) throw new Error('Illegal count');
  let run = 0;
  for (let n = 3; n <= sequence.length; n++) {
    const tail = sequence.slice(-n);
    if (
      new Set(tail).size === n &&
      Math.max(...tail) - Math.min(...tail) === n - 1
    )
      run = n;
  }
  return { count, points: (count === 15 || count === 31 ? 2 : 0) + run };
}

async function content() {
  // A missing implementation produces a failing assertion in the first RED run.
  const loaded = await import('@/lib/cribbage-guide-content').catch(
    () => undefined
  );
  expect(loaded, 'Task 1 must provide the shared Cribbage facts').toBeDefined();
  return loaded!;
}

describe('Cribbage original scoring reference', () => {
  it('computes the flush contexts, longest double run and 29 from the supplied cards', async () => {
    const { CRIBBAGE_EXAMPLES: examples, CRIBBAGE_RUN_SHORTCUTS: shortcuts } =
      await content();
    const { flush, doubleRun, twentyNine } = examples;
    expect(countHand(flush.held, flush.starter)).toEqual({
      fifteens: 0,
      pairs: 0,
      runs: 0,
      flush: 4,
      nobs: 0,
      total: flush.hand,
    });
    expect(countHand(flush.held, flush.starter, true).total).toBe(flush.crib);
    expect(flush.hand).toBe(4);
    expect(flush.crib).toBe(0);
    expect(countHand(flush.held, flush.matchingStarter).total).toBe(
      flush.matchingHand
    );
    expect(countHand(flush.held, flush.matchingStarter, true).total).toBe(
      flush.matchingCrib
    );
    expect([flush.matchingHand, flush.matchingCrib]).toEqual([5, 5]);
    expect(countHand(doubleRun.held, doubleRun.starter)).toEqual({
      fifteens: 0,
      pairs: doubleRun.pairs,
      runs: doubleRun.runs,
      flush: 0,
      nobs: 0,
      total: doubleRun.total,
    });
    expect(doubleRun.total).toBe(10);
    expect(countHand(twentyNine.held, twentyNine.starter)).toEqual({
      fifteens: twentyNine.fifteens,
      pairs: twentyNine.pairs,
      runs: 0,
      flush: 0,
      nobs: twentyNine.nobs,
      total: twentyNine.total,
    });
    expect(twentyNine.total).toBe(29);
    expect(twentyNine.fifteenCombinations * 2).toBe(twentyNine.fifteens);
    const shortcutRanks = [
      [1, 2, 2, 3, 9],
      [1, 2, 3, 3, 4],
      [1, 2, 2, 2, 3],
      [1, 2, 2, 3, 3],
    ];
    shortcuts.forEach((shortcut, i) => {
      const cards = shortcutRanks[i].map((rank, j) => ({
        rank,
        suit: ['C', 'D', 'H', 'S', 'C'][j],
      }));
      const score = countHand(cards.slice(0, 4), cards[4]);
      expect(score.runs + score.pairs).toBe(shortcut.total);
      expect(
        shortcut.runs * shortcut.length +
          shortcut.pairPoints.reduce((a: number, b: number) => a + b, 0)
      ).toBe(shortcut.total);
    });
    // Starter + only three held cards of a suit is not a four-card hand flush.
    expect(
      countHand(
        [
          { rank: 1, suit: 'H' },
          { rank: 3, suit: 'H' },
          { rank: 7, suit: 'H' },
          { rank: 13, suit: 'C' },
        ],
        { rank: 12, suit: 'H' }
      ).flush
    ).toBe(0);
  });

  it('checks unordered trailing pegging runs and mutually exclusive end awards', async () => {
    const {
      CRIBBAGE_EXAMPLES: { pegging, endings },
    } = await content();
    expect(peggingPoints(pegging.ranks.slice(0, 3))).toEqual({
      count: 15,
      points: pegging.scores[0],
    });
    expect(peggingPoints(pegging.ranks)).toEqual({
      count: 18,
      points: pegging.scores[1],
    });
    expect(pegging.scores).toEqual([5, 4]);
    expect(peggingPoints([6, 4, 5, 4]).points).toBe(0); // duplicate cannot extend run
    expect(peggingPoints([6, 10, 4, 5]).points).toBe(0); // cannot skip intervening card
    const count = endings.lead.reduce(
      (sum: number, rank: number) => sum + Math.min(rank, 10),
      0
    );
    expect(count).toBe(27);
    expect(count + endings.blocked).toBeGreaterThan(31);
    expect(count + endings.to31).toBe(31);
    expect(count + endings.toGo).toBeGreaterThan(31);
    const endAward = (total: number) => (total === 31 ? 2 : 1);
    expect(endAward(count + endings.to31)).toBe(endings.thirtyOne);
    expect(endAward(count)).toBe(endings.below31);
    expect([endings.thirtyOne, endings.below31]).toEqual([2, 1]);
    // Reset starts a new sequence; no carry-over run or additional go award.
    expect(peggingPoints([3]).points).toBe(0);
  });

  it('renders both real SSR tables with scoped headers, explicit contexts and standalone notes', async () => {
    await content();
    const { CribbageScoringChart } = await import(
      '@/components/seo/cribbage-scoring-chart'
    );
    for (const locale of ['en', 'zh'] as const) {
      const html = renderToStaticMarkup(
        createElement(CribbageScoringChart, { locale })
      );
      expect(html).toContain('data-cribbage-print-root');
      expect(html.match(/<table\b/g)).toHaveLength(2);
      expect(html.match(/<caption\b/g)).toHaveLength(2);
      expect(html.match(/<thead\b/g)).toHaveLength(2);
      expect(html.match(/<tbody\b/g)).toHaveLength(2);
      expect(html.match(/scope="col"/g)).toHaveLength(7);
      expect(html.match(/scope="row"/g)).toHaveLength(14);
      const scoringRows = [...html.matchAll(/<tr>([\s\S]*?)<\/tr>/g)]
        .slice(1, 11)
        .map(match => match[1]);
      expect(
        scoringRows.every(row => (row.match(/<td\b/g) ?? []).length === 3)
      ).toBe(true);
      expect(scoringRows[5]).toMatch(/<td[^>]*>4<\/td><td[^>]*>0<\/td>/);
      expect(scoringRows[6]).toMatch(/<td[^>]*>5<\/td><td[^>]*>5<\/td>/);
      expect(html).toContain(locale === 'en' ? 'Not applicable' : '不适用');
      expect(html).toContain(
        locale === 'en'
          ? 'starter is excluded from pegging'
          : '起始牌不参与出牌阶段'
      );
      expect(html).toContain(
        locale === 'en' ? 'already include pair points' : '已包含对子分'
      );
      expect(html).toContain('2025');
      expect(html).toContain('2026-11-04');
      expect(html).toContain(
        'https://www.cribbage.org/NewSite/rules/rulebook_2025.pdf'
      );
      expect(html).not.toMatch(/<button|<script|<input/);
    }
  });
});
