import { describe, expect, it } from 'vitest';

import {
  canMoveToFoundation,
  canMoveToTableau,
  createDailySolitaireDeal,
  drawFromSolitaireStock,
  getDailySolitaireDateKey,
  isDailySolitaireComplete,
  moveTableauToFoundation,
  moveWasteToFoundation,
} from '@/lib/games/daily-solitaire';

describe('Daily Solitaire engine', () => {
  it('creates the same complete 52-card deal for the same date', () => {
    const first = createDailySolitaireDeal('2026-08-26');
    const second = createDailySolitaireDeal('2026-08-26');
    const cards = [...first.tableau.flat(), ...first.stock];

    expect(first).toEqual(second);
    expect(cards).toHaveLength(52);
    expect(new Set(cards.map((card) => card.id)).size).toBe(52);
    expect(first.tableau.map((pile) => pile.length)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(first.tableau.every((pile) => pile.at(-1)?.faceUp)).toBe(true);
  });

  it('uses Shanghai calendar dates and preserves draw-one/draw-three rules', () => {
    expect(getDailySolitaireDateKey(new Date('2026-08-25T23:30:00.000Z'))).toBe('2026-08-26');

    const deal = createDailySolitaireDeal('2026-08-26');
    const drawn = drawFromSolitaireStock(deal, 3);

    expect(drawn.stock).toHaveLength(deal.stock.length - 3);
    expect(drawn.waste).toHaveLength(3);
    expect(drawn.waste.every((card) => card.faceUp)).toBe(true);
  });

  it('keeps the seeded deal solvable through legal foundation moves in both draw modes', () => {
    for (const drawCount of [1, 3] as const) {
      let state = createDailySolitaireDeal(`2026-08-26-draw-${drawCount}`);

      for (let step = 0; step < 200 && !isDailySolitaireComplete(state); step += 1) {
        let moved = true;
        while (moved && !isDailySolitaireComplete(state)) {
          moved = false;
          const waste = state.waste.at(-1);
          if (waste && canMoveToFoundation(waste, state.foundations[waste.suit])) {
            state = moveWasteToFoundation(state, waste.suit)!;
            moved = true;
            continue;
          }

          for (let pileIndex = 0; pileIndex < state.tableau.length; pileIndex += 1) {
            const card = state.tableau[pileIndex].at(-1);
            if (card && canMoveToFoundation(card, state.foundations[card.suit])) {
              state = moveTableauToFoundation(state, pileIndex, card.suit)!;
              moved = true;
              break;
            }
          }
        }

        if (!isDailySolitaireComplete(state) && state.stock.length > 0) {
          state = drawFromSolitaireStock(state, drawCount);
        }
      }

      expect(isDailySolitaireComplete(state)).toBe(true);
    }
  });

  it('enforces alternating-color descending tableau moves', () => {
    expect(
      canMoveToTableau(
        { id: 'hearts-8', suit: 'hearts', rank: 8, faceUp: true },
        { id: 'spades-9', suit: 'spades', rank: 9, faceUp: true },
      ),
    ).toBe(true);
    expect(
      canMoveToTableau(
        { id: 'hearts-8', suit: 'hearts', rank: 8, faceUp: true },
        { id: 'diamonds-9', suit: 'diamonds', rank: 9, faceUp: true },
      ),
    ).toBe(false);
    expect(canMoveToTableau({ id: 'clubs-13', suit: 'clubs', rank: 13, faceUp: true }, undefined)).toBe(true);
  });
});
