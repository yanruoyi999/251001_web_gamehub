import { describe, expect, it } from 'vitest';

import {
  buildDrawShareResult,
  calculateDailyStreak,
  createCircleFixture,
  createShapeFixture,
  getDailyShape,
  scoreCircleStroke,
  scoreDrawingStroke,
} from '@/lib/games/draw-perfect-circle';

describe('draw a perfect circle scoring', () => {
  it('scores a deterministic closed circle transparently', () => {
    const points = createCircleFixture({ centerX: 200, centerY: 150, radius: 90, samples: 96 });
    const score = scoreCircleStroke(points, { width: 400, height: 300 });

    expect(score.roundness).toBeGreaterThanOrEqual(99);
    expect(score.closure).toBeGreaterThanOrEqual(99);
    expect(score.centering).toBeGreaterThanOrEqual(99);
    expect(score.total).toBeGreaterThanOrEqual(99);
  });

  it('penalizes an open, off-center oval without hiding component scores', () => {
    const points = Array.from({ length: 50 }, (_, index) => {
      const angle = (Math.PI * 1.55 * index) / 49;
      return { x: 80 + Math.cos(angle) * 62, y: 65 + Math.sin(angle) * 28 };
    });
    const score = scoreCircleStroke(points, { width: 400, height: 300 });

    expect(score.roundness).toBeLessThan(90);
    expect(score.closure).toBeLessThan(70);
    expect(score.centering).toBeLessThan(70);
    expect(score.total).toBeLessThan(80);
  });

  it('rotates a deterministic daily shape and counts consecutive local days', () => {
    expect(getDailyShape('2026-08-30')).toBe(getDailyShape('2026-08-30'));
    expect(calculateDailyStreak(['2026-08-27', '2026-08-28'], '2026-08-30')).toBe(1);
    expect(
      calculateDailyStreak(['2026-08-27', '2026-08-28', '2026-08-29'], '2026-08-30'),
    ).toBe(4);
  });

  it('uses shape-specific fixtures instead of applying circle roundness to every guide', () => {
    const surface = { width: 600, height: 400 };
    const shapes = ['circle', 'square', 'triangle', 'spiral'] as const;

    for (const shape of shapes) {
      const fixture = createShapeFixture(shape, surface, 128);
      const ownScore = scoreDrawingStroke(fixture, surface, shape);
      const wrongShape = shape === 'circle' ? 'square' : 'circle';
      const wrongScore = scoreDrawingStroke(fixture, surface, wrongShape);

      expect(ownScore.valid).toBe(true);
      expect(ownScore.total).toBeGreaterThanOrEqual(95);
      expect(ownScore.total).toBeGreaterThan(wrongScore.total);
      expect(ownScore.pathComponent).toBe(shape === 'spiral' ? 'endpointFit' : 'closure');
    }
  });

  it('rejects invalid point payloads and builds a coordinate-free share result', () => {
    const score = scoreDrawingStroke(
      Array.from({ length: 8 }, () => ({ x: Number.NaN, y: 10 })),
      { width: 400, height: 300 },
      'circle',
    );
    const share = buildDrawShareResult({
      shape: 'circle',
      scoreBucket: '90-100',
      challengeId: '2026-08-30:circle',
      pageUrl: 'https://www.lumagamehub.com/en/games/draw-a-perfect-circle',
    });

    expect(score.valid).toBe(false);
    expect(Object.values(score).filter((value) => typeof value === 'number').every(Number.isFinite)).toBe(true);
    expect(share).toContain('90-100');
    expect(share).not.toMatch(/\bx\b|\by\b|coordinates|pointer/i);
  });
});
