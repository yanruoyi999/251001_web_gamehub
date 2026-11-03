import { describe, expect, it } from 'vitest';
import { getGuidePresentation } from '@/lib/guide-presentation';
import {
  getSeoLandingPage,
  getSeoLandingPages,
} from '@/lib/seo-landing-content';

// Independent exhaustive oracle: each open tile can appear zero or one times.
function subsets(open: readonly number[], total: number): number[][] {
  const found: number[][] = [];
  for (let mask = 1; mask < 2 ** open.length; mask++) {
    const choice = open.filter((_, index) => mask & (1 << index));
    if (choice.reduce((sum, tile) => sum + tile, 0) === total)
      found.push(choice);
  }
  return found;
}
const normalized = (choices: readonly (readonly number[])[]) =>
  choices.map(choice => [...choice].sort((a, b) => a - b).join(',')).sort();

describe('Shut the Box rules guide', () => {
  it('registers one bilingual static guide with complete exercises and real related routes', () => {
    const page = getSeoLandingPage('shut-the-box-rules');
    expect(
      page,
      'new Shut the Box rules guide must be registered'
    ).toBeDefined();
    expect(
      getSeoLandingPages().filter(p => p.slug === 'shut-the-box-rules')
    ).toHaveLength(1);
    expect(page!.embedGame).toBeUndefined();
    expect(page!.interactiveWidget).toBeUndefined();
    expect(page!.publishedAt).toBeUndefined();
    expect(page!.primaryKeyword).toBe('shut the box game rules');
    expect(page!.relatedSlugs).toEqual([
      'how-to-play-dominoes',
      'farkle-scoring',
    ]);
    for (const slug of page!.relatedSlugs)
      expect(getSeoLandingPage(slug)).toBeDefined();
    for (const locale of ['en', 'zh'] as const) {
      const { detailSections } = getGuidePresentation(page!.locales[locale]);
      expect(
        detailSections.filter(s => /^(Example|例题) [A-E] —/.test(s.title))
      ).toHaveLength(5);
      expect(page!.locales[locale].faqs).toHaveLength(5);
    }
  });

  it('exhaustively checks legal subsets and one-die boundaries in A–D', async () => {
    expect(getSeoLandingPage('shut-the-box-rules')).toBeDefined();
    const { SHUT_THE_BOX_EXAMPLES: ex } = await import(
      '@/lib/shut-the-box-guide-content'
    );
    for (const example of [ex.A, ex.B, ex.C, ex.D]) {
      const total = example.dice.reduce((sum, die) => sum + die, 0);
      expect(
        example.dice.every(d => Number.isInteger(d) && d >= 1 && d <= 6)
      ).toBe(true);
      expect(normalized(example.choices)).toEqual(
        normalized(subsets(example.open, total))
      );
      for (const choice of example.choices) {
        expect(new Set(choice).size).toBe(choice.length);
        expect(choice.every(tile => example.open.includes(tile))).toBe(true);
      }
    }
    // Hand-checked independent results catch omitted alternatives and a sum-vs-digits mistake.
    expect(normalized(ex.A.choices)).toEqual([
      '1,2,4',
      '1,6',
      '2,5',
      '3,4',
      '7',
    ]);
    expect(normalized(ex.B.choices)).toEqual(['1,4', '2,3', '5']);
    expect(ex.B.dice).toHaveLength(1);
    expect([7, 8, 9].every(tile => !ex.B.open.includes(tile))).toBe(true);
    expect(normalized(ex.C.choices)).toEqual(['2,6']);
    expect(
      ex.C.open
        .filter(tile => !ex.C.choices[0].includes(tile))
        .reduce((a, b) => a + b, 0)
    ).toBe(16);
    expect(ex.C.open.some(tile => [7, 8, 9].includes(tile))).toBe(true);
    expect(ex.C.dice).toHaveLength(2);
    expect(ex.D.choices).toEqual([]);
    expect(ex.D.open.reduce((a, b) => a + b, 0)).toBe(11);
    // No repeated 4 can invent 8, and no already-closed 8 can be selected in C.
    expect(subsets([1, 4, 6], 8)).toEqual([]);
    expect(subsets(ex.C.open, 8)).not.toContainEqual([8]);
  });

  it('checks every constructed E transition, dice total and remaining sum independently', async () => {
    expect(getSeoLandingPage('shut-the-box-rules')).toBeDefined();
    const {
      SHUT_THE_BOX_EXAMPLES: { E },
    } = await import('@/lib/shut-the-box-guide-content');
    let open = [...E.open];
    const remaining = [34, 24, 12, 0];
    const totals = [11, 10, 12, 12];
    expect(open).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(E.steps).toHaveLength(4);
    E.steps.forEach((step, i) => {
      expect(step.dice).toHaveLength(2);
      expect(
        step.dice.every(d => d >= 1 && d <= 6 && Number.isInteger(d))
      ).toBe(true);
      expect(step.dice.reduce((a, b) => a + b, 0)).toBe(totals[i]);
      expect(normalized(subsets(open, totals[i]))).toContain(
        normalized([step.close])[0]
      );
      expect(new Set(step.close).size).toBe(step.close.length);
      open = open.filter(tile => !step.close.includes(tile));
      expect(open.reduce((a, b) => a + b, 0)).toBe(remaining[i]);
      expect(step.remainingScore).toBe(remaining[i]);
    });
    expect(open).toEqual([]);
  });
});
