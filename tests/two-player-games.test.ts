import { describe, expect, it } from 'vitest';

import {
  claimGridCell,
  createGridClaimState,
  createSyncSwitchState,
  createTapDuelState,
  playerForControlCode,
  recordMatchRound,
  registerSyncSwitchInput,
  registerTapDuelInput,
} from '@/lib/games/two-player-games';

describe('two-player original microgame pack', () => {
  it('ends a best-of-three match only when one player reaches two wins', () => {
    const one = recordMatchRound({ one: 0, two: 0 }, 'one');
    expect(one).toEqual({ score: { one: 1, two: 0 }, winner: null });
    expect(recordMatchRound(one.score, 'one')).toEqual({
      score: { one: 2, two: 0 },
      winner: 'one',
    });
  });

  it('handles Tap Duel false starts once and a valid post-cue reaction', () => {
    let state = createTapDuelState(1_000);
    state = registerTapDuelInput(state, 'one', 900);
    expect(state.score).toEqual({ one: 0, two: 1 });
    expect(registerTapDuelInput(state, 'one', 920)).toEqual(state);

    state = createTapDuelState(1_000);
    state = registerTapDuelInput(state, 'two', 1_045);
    expect(state.roundWinner).toBe('two');
    expect(state.reactionMs).toBe(45);
  });

  it('uses a seeded Grid Claim board and scores each completed line once', () => {
    expect(createGridClaimState(42).bonusCells).toEqual(createGridClaimState(42).bonusCells);
    let state = createGridClaimState(42);
    for (const index of [0, 4, 1, 5, 2]) state = claimGridCell(state, index);
    expect(state.score.one).toBe(1);
    expect(claimGridCell(state, 2)).toEqual(state);
  });

  it('shrinks Sync Switch timing after a success but never below its floor', () => {
    let state = createSyncSwitchState(500, 180);
    state = registerSyncSwitchInput(state, 'one', 1_000);
    state = registerSyncSwitchInput(state, 'two', 1_420);
    expect(state.successes).toBe(1);
    expect(state.windowMs).toBe(460);

    for (let index = 0; index < 20; index += 1) {
      state = registerSyncSwitchInput(state, 'one', 2_000 + index * 1_000);
      state = registerSyncSwitchInput(state, 'two', 2_020 + index * 1_000);
    }
    expect(state.windowMs).toBe(180);
  });

  it('maps two simultaneous keyboard zones without overlap', () => {
    expect(['KeyA', 'Space'].map(playerForControlCode)).toEqual(['one', 'one']);
    expect(['KeyL', 'Enter'].map(playerForControlCode)).toEqual(['two', 'two']);
    expect(playerForControlCode('KeyQ')).toBeNull();
    expect(new Set(['KeyA', 'KeyL'].map(playerForControlCode))).toEqual(
      new Set(['one', 'two']),
    );
  });
});
