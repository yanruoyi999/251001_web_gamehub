import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { countryShapes, makeShapeRound, shapeChoices } from '@/lib/games/country-shape-quiz';

describe('Country Shape Quiz', () => {
  it('has distinct bilingual questions and local map images', () => {
    expect(countryShapes).toHaveLength(24);
    expect(new Set(countryShapes.map(({ id }) => id)).size).toBe(24);
    for (const shape of countryShapes) {
      expect(shape.en && shape.zh && shape.tip.en && shape.tip.zh).toBeTruthy();
      expect(existsSync(`public/images/country-shapes/${shape.id}.png`)).toBe(true);
      const options = shapeChoices(shape);
      expect(new Set(options.map(({ id }) => id)).size).toBe(4);
      expect(options).toContain(shape);
    }
  });

  it('makes eight unique world questions and respects regional selection and replay', () => {
    const world = makeShapeRound('all', 0);
    expect(new Set(world).size).toBe(8);
    expect(makeShapeRound('all', 1)).not.toEqual(world);
    const asia = makeShapeRound('asia', 0);
    expect(asia).toHaveLength(6);
    expect(asia.every(({ region }) => region === 'asia')).toBe(true);
  });
});
