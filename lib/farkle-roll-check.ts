export const FARKLE_FACES = [1, 2, 3, 4, 5, 6] as const;
export const FARKLE_FIRST_BANK = 500;

export const FARKLE_POINTS = {
  singles: [100, 0, 0, 0, 50, 0],
  triplets: [300, 200, 300, 400, 500, 600],
  largerGroups: [1000, 2000, 3000],
  straight: 1500,
  threePairs: 1500,
  fourAndPair: 1500,
  twoTriplets: 2500,
} as const;

const sixDiceCombinations = new Map([
  ['1,1,1,1,1,1', FARKLE_POINTS.straight],
  ['2,2,2', FARKLE_POINTS.threePairs],
  ['2,4', FARKLE_POINTS.fourAndPair],
  ['3,3', FARKLE_POINTS.twoTriplets],
]);

export type FarkleRollResult = {
  rollPoints: number;
  scoringDice: number;
  turnPoints: number;
  status: 'farkle' | 'first-bank-blocked' | 'can-bank';
};

/** Maximum legal score from this throw, with any previously earned turn points kept separate. */
export function checkFarkleRoll(
  dice: readonly number[],
  earlierTurnPoints = 0,
  hasBanked = false,
): FarkleRollResult | null {
  if (dice.length < 1 || dice.length > 6 ||
      dice.some(die => !Number.isInteger(die) || die < 1 || die > 6) ||
      !Number.isSafeInteger(earlierTurnPoints) || earlierTurnPoints < 0 || earlierTurnPoints % 50 !== 0) {
    return null;
  }

  const counts = FARKLE_FACES.map(face => dice.filter(die => die === face).length);
  const groups = counts.filter(Boolean).sort((a, b) => a - b);
  const combination = dice.length === 6 ? sixDiceCombinations.get(groups.join(',')) : undefined;
  let rollPoints = combination ?? 0;
  let scoringDice = combination ? 6 : 0;

  if (!combination) {
    for (const [face, count] of counts.entries()) {
      const points = count >= 4 ? FARKLE_POINTS.largerGroups[count - 4]
        : count === 3 ? FARKLE_POINTS.triplets[face]
          : count * FARKLE_POINTS.singles[face];
      rollPoints += points;
      if (points > 0) scoringDice += count;
    }
  }

  if (rollPoints === 0) return { rollPoints: 0, scoringDice: 0, turnPoints: 0, status: 'farkle' };

  const turnPoints = earlierTurnPoints + rollPoints;
  if (!Number.isSafeInteger(turnPoints)) return null;

  return {
    rollPoints,
    scoringDice,
    turnPoints,
    status: hasBanked || turnPoints >= FARKLE_FIRST_BANK ? 'can-bank' : 'first-bank-blocked',
  };
}
