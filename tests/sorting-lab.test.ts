import { describe, expect, it } from 'vitest';

import {
  evaluateSortingAnswer,
  getSortingChallenge,
  SORTING_MODES,
} from '@/lib/games/sorting-lab';

describe('Sorting Lab engine', () => {
  it('provides four modes with three deterministic levels each', () => {
    expect(SORTING_MODES).toEqual(['color', 'shape', 'size', 'pattern']);

    for (const mode of SORTING_MODES) {
      for (const level of [1, 2, 3]) {
        const challenge = getSortingChallenge(mode, level);
        expect(challenge.mode).toBe(mode);
        expect(challenge.level).toBe(level);
        expect(challenge.options).toHaveLength(3);
        expect(evaluateSortingAnswer(challenge, challenge.answer)).toBe(true);
        expect(evaluateSortingAnswer(challenge, 'not-an-option')).toBe(false);
      }
    }
  });
});
