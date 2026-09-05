import { describe, expect, it } from 'vitest';
import {
  canMoveToFoundation, createDailySolitaireDeal, drawFromSolitaireStock,
  isDailySolitaireComplete, moveTableauToFoundation, moveWasteToFoundation,
  moveWasteToTableau, moveTableauToTableau,
  type DailySolitaireGameState,
} from '@/lib/games/daily-solitaire';

export function solveDeal(initial: DailySolitaireGameState, count: 1 | 3) {
  let state = initial;
  const visited = new Set<string>();
  while (!isDailySolitaireComplete(state)) {
    const fingerprint = JSON.stringify([state.stock, state.waste, state.tableau, state.foundations]);
    if (visited.has(fingerprint)) throw new Error(`Unsolved cycle: ${state.dateKey} / Draw ${count}`);
    visited.add(fingerprint);
    if (visited.size > 1000) throw new Error('Solver limit');
    const waste = state.waste.at(-1);
    if (waste && canMoveToFoundation(waste, state.foundations[waste.suit])) {
      state = moveWasteToFoundation(state, waste.suit)!;
      continue;
    }
    const from = state.tableau.findIndex(pile => {
      const top = pile.at(-1);
      return top && canMoveToFoundation(top, state.foundations[top.suit]);
    });
    if (from >= 0) {
      state = moveTableauToFoundation(state, from, state.tableau[from].at(-1)!.suit)!;
      continue;
    }
    state = drawFromSolitaireStock(state, count);
  }
  return state;
}

describe('solitaire audit regression', () => {
  it.each([1, 3] as const)('sets completed after a legal Draw %s finish', count => {
    const final = solveDeal(createDailySolitaireDeal('2026-09-05'), count);
    expect(final.completed).toBe(true);
    expect(Object.values(final.foundations).map(pile => pile.length)).toEqual([13, 13, 13, 13]);
  });

  it('Draw 3 exactly preserves three Draw 1 flips and recycle order', () => {
    const initial = createDailySolitaireDeal('2026-09-05');
    const single = [0, 1, 2].reduce(state => drawFromSolitaireStock(state, 1), initial);
    const triple = drawFromSolitaireStock(initial, 3);
    expect(triple).toEqual(single);
    const twoLeft = { ...initial, stock: initial.stock.slice(-2) };
    const remaining = drawFromSolitaireStock(twoLeft, 3);
    expect(remaining.waste.map(card => card.id)).toEqual([...twoLeft.stock].reverse().map(card => card.id));
    const recycled = drawFromSolitaireStock(remaining, 3);
    expect(recycled.stock.map(card => card.id)).toEqual(twoLeft.stock.map(card => card.id));
  });

  it('creates 365 unique complete, deterministic and legally solvable layouts in BOTH modes', () => {
    const layouts = new Set<string>();
    for (let day = 0; day < 365; day += 1) {
      const date = new Date(Date.UTC(2026, 0, 1 + day)).toISOString().slice(0, 10);
      const deal = createDailySolitaireDeal(date);
      expect(deal).toEqual(createDailySolitaireDeal(date));
      expect(deal.tableau.map(pile => pile.length)).toEqual([1, 2, 3, 4, 5, 6, 7]);
      const cards = [...deal.tableau.flat(), ...deal.stock];
      expect(cards).toHaveLength(52);
      expect(new Set(cards.map(card => card.id)).size).toBe(52);
      layouts.add(JSON.stringify([deal.tableau, deal.stock]));
      for (const count of [1, 3] as const) expect(isDailySolitaireComplete(solveDeal(deal, count))).toBe(true);
    }
    expect(layouts.size).toBe(365);
  }, 20_000);

  it('rejects invalid destination columns instead of dropping cards from state', () => {
    const deal = createDailySolitaireDeal('2026-09-05');
    const king = { id: 'spades-13', rank: 13, suit: 'spades' as const, faceUp: true };
    const state = { ...deal, waste: [king], tableau: [[king], [], [], [], [], [], []] };
    expect(moveWasteToTableau(state, 7)).toBeNull();
    expect(moveTableauToTableau(state, 0, 0, -1)).toBeNull();
    expect(moveTableauToTableau(state, 0, -1, 1)).toBeNull();
  });
});
