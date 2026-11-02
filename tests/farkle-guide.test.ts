import { describe, expect, it } from 'vitest';
import { getGuidePresentation } from '@/lib/guide-presentation';
import {
  getSeoLandingPage,
  getSeoLandingPages,
} from '@/lib/seo-landing-content';

// Independent values transcribed from the admitted PlayMonster PDF, not from production.
const expectedScores = [
  100, 50, 300, 200, 300, 400, 500, 600, 1000, 2000, 3000, 1500, 1500, 1500,
  2500,
];

describe('Farkle scoring reference', () => {
  it('registers one bilingual information page and renders all 15 admitted scores', () => {
    const page = getSeoLandingPage('farkle-scoring');
    expect(page, 'new Farkle scoring guide must be registered').toBeDefined();
    expect(
      getSeoLandingPages().filter(p => p.slug === 'farkle-scoring')
    ).toHaveLength(1);
    expect(page!.embedGame).toBeUndefined();
    expect(page!.interactiveWidget).toBeUndefined();
    for (const locale of ['en', 'zh'] as const) {
      const { detailSections } = getGuidePresentation(page!.locales[locale]);
      const rows =
        detailSections.find(section => section.bullets?.length === 15)
          ?.bullets ?? [];
      expect(rows).toHaveLength(15);
      expect(rows.map(row => Number(row.match(/= (\d+)/)![1]))).toEqual(
        expectedScores
      );
    }
  });

  it('keeps fixed exercise rolls legal, distinct and arithmetically consistent', async () => {
    expect(
      getSeoLandingPage('farkle-scoring'),
      'exercise data must be available through the new guide'
    ).toBeDefined();
    const { FARKLE_EXAMPLES } = await import('@/lib/farkle-guide-content');
    // Each step's score and final result were calculated independently from the brief.
    const oracle = [
      {
        id: 'A',
        rolls: [[2, 2, 2, 5, 1, 6]],
        picks: [[0, 1, 2, 3, 4]],
        points: [350],
        turn: 350,
        banked: 0,
      },
      {
        id: 'B',
        rolls: [[2, 2, 2, 6, 6, 6]],
        picks: [[0, 1, 2, 3, 4, 5]],
        points: [2500],
        turn: 2500,
        banked: 0,
      },
      {
        id: 'C',
        rolls: [
          [5, 5, 2, 3, 4, 6],
          [5, 2, 3, 4],
        ],
        picks: [[0, 1], [0]],
        points: [100, 50],
        turn: 150,
        banked: 0,
      },
      {
        id: 'D',
        rolls: [
          [3, 3, 3, 1, 2, 6],
          [1, 5],
        ],
        picks: [
          [0, 1, 2, 3],
          [0, 1],
        ],
        points: [400, 150],
        turn: 550,
        banked: 0,
      },
      {
        id: 'E',
        rolls: [
          [1, 5, 2, 2, 4, 6],
          [2, 3, 4, 6],
        ],
        picks: [[0, 1], []],
        points: [150, 0],
        turn: 0,
        banked: 700,
      },
    ];
    for (const [i, wanted] of oracle.entries()) {
      const actual = FARKLE_EXAMPLES[i];
      expect(actual).toEqual(wanted);
      let remaining = 6;
      actual.rolls.forEach((roll, step) => {
        expect(roll).toHaveLength(remaining);
        expect(roll.every(d => Number.isInteger(d) && d >= 1 && d <= 6)).toBe(
          true
        );
        const picks = actual.picks[step];
        expect(new Set(picks).size).toBe(picks.length); // No reused die in one selection.
        expect(picks.every(index => index >= 0 && index < roll.length)).toBe(
          true
        );
        remaining -= picks.length;
      });
      expect(actual.turn).toBe(
        actual.id === 'E' ? 0 : actual.points.reduce((a, b) => a + b, 0)
      );
    }
    // Separate throws in C earn two singles then one single, not a triple-five bonus.
    expect(FARKLE_EXAMPLES[2].turn).toBe(2 * 50 + 50);
    expect(FARKLE_EXAMPLES[0].turn < 500).toBe(true);
    expect(
      FARKLE_EXAMPLES[3].points[0] < 500 && FARKLE_EXAMPLES[3].turn >= 500
    ).toBe(true);
    expect(FARKLE_EXAMPLES[1].turn).toBe(2500); // Never 2500 + 200 + 600.
    const { FARKLE_FINISH_EXAMPLE: finish } = await import(
      '@/lib/farkle-guide-content'
    );
    expect(finish).toEqual({
      aBefore: 9400,
      aTurn: 650,
      aFinal: 10050,
      bBefore: 9100,
      bTurn: 1000,
      bFinal: 10100,
    });
    expect(finish.aFinal).toBe(finish.aBefore + finish.aTurn);
    expect(finish.aFinal >= 10000 && finish.bFinal > finish.aFinal).toBe(true);
    expect(finish.bFinal).toBe(finish.bBefore + finish.bTurn);
  });
});
