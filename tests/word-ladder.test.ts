import { describe, expect, it } from 'vitest';
import { ladders, checkMove, nextHint } from '@/lib/games/word-ladder';

describe('word ladder', () => {
  it('has a distinct, completable route for every authored puzzle', () => {
    expect(new Set(ladders.map(({ path }) => `${path[0]}:${path.at(-1)}`)).size).toBe(ladders.length);
    for (const { path } of ladders) {
      const previous: string[] = [path[0]];
      for (const next of path.slice(1)) {
        expect(checkMove(previous, next)).toBe('valid');
        previous.push(next);
      }
      expect(nextHint([path[0]], path.at(-1)!)).toBeTruthy();
    }
  });

  it('handles normalization, illegal changes, unknown words and repeats', () => {
    expect(checkMove(['cold'], ' CORD ')).toBe('valid');
    expect(checkMove(['cold'], 'warm')).toBe('letters');
    expect(checkMove(['cold'], 'colx')).toBe('unknown');
    expect(checkMove(['cold', 'cord'], 'cold')).toBe('repeat');
  });

  it('hints from the player position and avoids already visited words', () => {
    expect(nextHint(['cold', 'cord'], 'warm')).toBe('card');
    expect(nextHint(['warm'], 'warm')).toBeNull();
    expect(nextHint(['cold', 'cord', 'card'], 'cold')).toBeNull();
  });
});
