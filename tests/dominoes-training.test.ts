import { describe, expect, it } from 'vitest';

import {
  DOMINO_TRAINING_SCENARIOS,
  createDoubleSixSet,
  evaluateDominoMove,
  getDominoEnds,
  submitDominoMove,
  type DominoesTrainingState,
} from '@/lib/games/dominoes-training';

describe('dominoes training rules', () => {
  it('creates the complete double-six set without duplicate tiles', () => {
    const tiles = createDoubleSixSet();

    expect(tiles).toHaveLength(28);
    expect(new Set(tiles.map((tile) => tile.id)).size).toBe(28);
    expect(tiles.find((tile) => tile.left === 6 && tile.right === 6)).toBeDefined();
  });

  it('recognizes a tile that can connect to either open end', () => {
    const board = [
      { id: '1-6', left: 1, right: 6 },
      { id: '6-4', left: 6, right: 4 },
    ];

    expect(getDominoEnds(board)).toEqual({ left: 1, right: 4 });
    expect(
      evaluateDominoMove({
        board,
        hand: [{ id: '4-2', left: 4, right: 2 }],
        tileId: '4-2',
        side: 'right',
      }),
    ).toMatchObject({ legal: true, connectedEnd: 4 });
  });

  it('explains why an illegal move does not fit', () => {
    const result = evaluateDominoMove({
      board: [{ id: '2-5', left: 2, right: 5 }],
      hand: [{ id: '1-3', left: 1, right: 3 }],
      tileId: '1-3',
      side: 'left',
    });

    expect(result.legal).toBe(false);
    expect(result.reason).toContain('2');
    expect(result.reason).toContain('1');
  });

  it('keeps the teaching scenarios deterministic and advances after a legal move', () => {
    expect(DOMINO_TRAINING_SCENARIOS.length).toBeGreaterThanOrEqual(8);

    for (const scenario of DOMINO_TRAINING_SCENARIOS) {
      expect(
        evaluateDominoMove({
          board: scenario.board,
          hand: scenario.hand,
          tileId: scenario.answer.tileId,
          side: scenario.answer.side,
        }).legal,
      ).toBe(true);
    }

    let state: DominoesTrainingState = {
      scenarioIndex: 0,
      board: DOMINO_TRAINING_SCENARIOS[0].board,
      hand: DOMINO_TRAINING_SCENARIOS[0].hand,
      attempts: 0,
      completed: false,
    };

    const scenario = DOMINO_TRAINING_SCENARIOS[0];
    const result = submitDominoMove(state, scenario.answer.tileId, scenario.answer.side);

    expect(result.move.legal).toBe(true);
    expect(result.state.scenarioIndex).toBe(1);
    expect(result.state.attempts).toBe(1);
  });
});
