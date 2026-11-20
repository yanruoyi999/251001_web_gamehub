import { describe, expect, it } from 'vitest';
import { planPokemonGoQuest } from '@/lib/duolingo-pokemon-go-guide-content';

function plan(date: string, days: number, joined: boolean) {
  return planPokemonGoQuest(date, days, joined, '2026-11-17');
}

describe('Duo’s Pokémon Party planner', () => {
  it('counts the selected date as available and includes December 29', () => {
    expect(plan('2026-12-23', 0, true)).toEqual({
      status: 'on-track',
      remaining: 7,
      finish: '2026-12-29',
      spare: 0,
    });
    expect(plan('2026-12-24', 0, true).status).toBe('not-enough-days');
  });

  it('requires joining by December 21 and supports planning on that day', () => {
    expect(plan('2026-12-21', 0, false).status).toBe('join-first');
    expect(plan('2026-12-22', 0, false).status).toBe('join-closed');
  });

  it('separates the Duolingo and Pokémon GO deadlines', () => {
    expect(plan('2026-12-29', 7, true).status).toBe('claim-code');
    expect(plan('2026-12-30', 7, true).status).toBe('practice-closed');
    expect(plan('2027-01-01', 7, true).status).toBe('event-ended');
  });

  it('handles month boundaries and rejects malformed dates or day counts', () => {
    expect(plan('2026-11-30', 5, true)).toEqual({
      status: 'on-track',
      remaining: 2,
      finish: '2026-12-01',
      spare: 28,
    });
    expect(plan('2026-11-31', 3, true).status).toBe('invalid');
    expect(plan('2026-12-01', 8, true).status).toBe('invalid');
    expect(plan('2026-11-01', 0, false).status).toBe('before-start');
  });

  it('respects the first local calendar date at the global opening instant', () => {
    expect(plan('2026-11-16', 0, true).status).toBe('before-start');
    expect(planPokemonGoQuest('2026-11-16', 0, true, '2026-11-16').status).toBe(
      'on-track'
    );
  });
});
