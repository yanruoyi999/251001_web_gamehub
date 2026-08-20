import { describe, expect, it } from 'vitest';

import {
  getCircleChallenge,
  getCircleDurationBucket,
  getUtcDateKey,
  scoreCircle,
} from '@/lib/games/luma-circle';

function circlePoints(count = 64, radius = 0.3) {
  return Array.from({ length: count }, (_, index) => {
    const angle = (index / (count - 1)) * Math.PI * 2;
    return {
      x: 0.5 + Math.cos(angle) * radius,
      y: 0.5 + Math.sin(angle) * radius,
    };
  });
}

describe('Luma Circle scoring', () => {
  it('uses a UTC date key and deterministic daily challenge', () => {
    expect(getUtcDateKey(new Date('2026-08-18T23:59:59.999Z'))).toBe('2026-08-18');
    expect(getUtcDateKey(new Date('2026-08-19T00:00:00.000Z'))).toBe('2026-08-19');
    expect(getCircleChallenge('2026-08-18')).toEqual(getCircleChallenge('2026-08-18'));
    expect(getCircleChallenge('2026-08-18')).not.toEqual(getCircleChallenge('2026-08-19'));
  });

  it('scores a complete smooth circle highly', () => {
    const result = scoreCircle(circlePoints());

    expect(result.pointCount).toBe(64);
    expect(result.roundness).toBeGreaterThanOrEqual(95);
    expect(result.closure).toBeGreaterThanOrEqual(95);
    expect(result.score).toBeGreaterThanOrEqual(90);
  });

  it('does not give a short straight stroke a high score', () => {
    const result = scoreCircle([
      { x: 0.2, y: 0.5 },
      { x: 0.35, y: 0.5 },
      { x: 0.5, y: 0.5 },
      { x: 0.65, y: 0.5 },
      { x: 0.8, y: 0.5 },
    ]);

    expect(result.score).toBeLessThan(75);
    expect(result.coverage).toBeLessThan(60);
  });

  it('keeps duration buckets stable for the behavior report', () => {
    expect(getCircleDurationBucket(null)).toBe('invalid');
    expect(getCircleDurationBucket(14_999)).toBe('under-15s');
    expect(getCircleDurationBucket(15_000)).toBe('15s-to-60s');
    expect(getCircleDurationBucket(60_000)).toBe('1m-to-3m');
    expect(getCircleDurationBucket(180_001)).toBe('over-3m');
  });
});
