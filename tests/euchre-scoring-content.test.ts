import { describe, expect, it } from 'vitest';
import * as content from '@/lib/euchre-guide-content';

type Award = { readonly makers: number; readonly defenders: number };
type Outcome = { readonly makerTricks: number; readonly partnership: Award; readonly makerAlone: Award };
type Totals = { A: number; B: number };
type ScoringExample = {
  readonly start: Readonly<Totals>;
  readonly hands: readonly {
    readonly maker: 'A' | 'B';
    readonly mode: 'partnership' | 'makerAlone';
    readonly makerTricks: number;
    readonly total: Readonly<Totals>;
  }[];
};

// Independent, hand-checked rules: failure gives defenders 2; only a lone sweep gives 4.
const ruleCases = [
  [0, 'partnership', 0, 2], [1, 'partnership', 0, 2], [2, 'partnership', 0, 2],
  [3, 'partnership', 1, 0], [4, 'partnership', 1, 0], [5, 'partnership', 2, 0],
  [0, 'makerAlone', 0, 2], [1, 'makerAlone', 0, 2], [2, 'makerAlone', 0, 2],
  [3, 'makerAlone', 1, 0], [4, 'makerAlone', 1, 0], [5, 'makerAlone', 4, 0],
] as const;

describe('Euchre scoring content arithmetic', () => {
  it.each(ruleCases)('awards the correct points for %i maker tricks in %s mode', (tricks, mode, makers, defenders) => {
    const outcomes = Reflect.get(content, 'EUCHRE_SCORING_OUTCOMES') as readonly Outcome[] | undefined;
    expect(outcomes, 'the visible scoring reference needs all six outcomes').toBeDefined();
    expect(outcomes!.map(row => row.makerTricks)).toEqual([0, 1, 2, 3, 4, 5]);
    expect(outcomes!.find(row => row.makerTricks === tricks)![mode]).toEqual({ makers, defenders });
  });

  it('carries each hand into the correct team total and stops when B reaches ten', () => {
    const example = Reflect.get(content, 'EUCHRE_SCORING_EXAMPLE') as ScoringExample | undefined;
    expect(example, 'the cumulative example must publish its original hand results').toBeDefined();
    expect(example!.start).toEqual({ A: 4, B: 3 });
    expect(example!.hands).toHaveLength(4);
    const totals: Totals = { ...example!.start };
    const expectedTotals = [{ A: 5, B: 3 }, { A: 5, B: 7 }, { A: 5, B: 9 }, { A: 5, B: 10 }];
    example!.hands.forEach((hand, index) => {
      expect(Math.max(totals.A, totals.B), 'do not continue after either team has won').toBeLessThan(10);
      expect([0, 1, 2, 3, 4, 5], 'a hand has exactly five tricks').toContain(hand.makerTricks);
      expect(['A', 'B']).toContain(hand.maker);
      expect(['partnership', 'makerAlone']).toContain(hand.mode);
      const defender = hand.maker === 'A' ? 'B' : 'A';
      // Recompute from the rules, without consulting the production scoring table.
      if (hand.makerTricks < 3) totals[defender] += 2;
      else if (hand.makerTricks < 5) totals[hand.maker] += 1;
      else totals[hand.maker] += hand.mode === 'makerAlone' ? 4 : 2;
      expect(hand.total).toEqual(totals);
      expect(totals).toEqual(expectedTotals[index]);
    });
    expect(totals).toEqual({ A: 5, B: 10 });
  });
});
