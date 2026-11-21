import { describe, expect, it } from 'vitest';
import { checkFarkleRoll } from '@/lib/farkle-roll-check';

describe('PlayMonster Farkle roll check', () => {
  it.each([
    [[1], 100], [[5], 50], [[1, 1, 1], 300], [[2, 2, 2], 200],
    [[3, 3, 3], 300], [[4, 4, 4], 400], [[5, 5, 5], 500], [[6, 6, 6], 600],
    [[1, 1, 1, 1], 1000], [[2, 2, 2, 2, 2], 2000], [[6, 6, 6, 6, 6, 6], 3000],
    [[6, 5, 4, 3, 2, 1], 1500], [[1, 1, 4, 4, 5, 5], 1500],
    [[4, 4, 4, 4, 5, 5], 1500], [[2, 2, 2, 6, 6, 6], 2500],
  ])('scores %j as %i without reusing dice', (dice, rollPoints) => {
    expect(checkFarkleRoll(dice)).toMatchObject({ rollPoints, scoringDice: dice.length });
  });

  it('adds legal scoring groups and leaves unused dice aside', () => {
    expect(checkFarkleRoll([2, 2, 2, 5, 1, 6])).toMatchObject({
      rollPoints: 350, scoringDice: 5,
    });
    expect(checkFarkleRoll([5, 5, 5, 5, 5, 1])).toMatchObject({
      rollPoints: 2100, scoringDice: 6,
    });
  });

  it('requires 500 for the first bank and permits exactly 500', () => {
    const dice = [1, 1, 1, 2, 3, 4];
    expect(checkFarkleRoll(dice)).toMatchObject({ rollPoints: 300, turnPoints: 300, status: 'first-bank-blocked' });
    expect(checkFarkleRoll(dice, 150)).toMatchObject({ turnPoints: 450, status: 'first-bank-blocked' });
    expect(checkFarkleRoll(dice, 200)).toMatchObject({ turnPoints: 500, status: 'can-bank' });
    expect(checkFarkleRoll(dice, 0, true)).toMatchObject({ turnPoints: 300, status: 'can-bank' });
  });

  it('clears the turn on a Farkle, even after a prior bank', () => {
    expect(checkFarkleRoll([2, 3, 4, 6], 550, true)).toEqual({
      rollPoints: 0, scoringDice: 0, turnPoints: 0, status: 'farkle',
    });
  });

  it('rejects impossible dice and prior scores', () => {
    expect(checkFarkleRoll([])).toBeNull();
    expect(checkFarkleRoll([1, 1, 1, 1, 1, 1, 1])).toBeNull();
    expect(checkFarkleRoll([1, 7])).toBeNull();
    expect(checkFarkleRoll([2.5])).toBeNull();
    expect(checkFarkleRoll([1], -50)).toBeNull();
    expect(checkFarkleRoll([1], 149)).toBeNull();
  });
});
