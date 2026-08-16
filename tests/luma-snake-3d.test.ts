import { describe, expect, it } from 'vitest';

import {
  changeSnakeDirection,
  createSnakeGameState,
  getDailyChallengeId,
  getFirstDeathDurationBucket,
  getFirstDeathDurationMs,
  getUtcChallengeKey,
  resetSnakeGameState,
  stepSnakeGame,
} from '@/lib/games/luma-snake-3d';

describe('Luma Snake 3D challenge rules', () => {
  it('uses one UTC calendar key for every player', () => {
    expect(getUtcChallengeKey(new Date('2026-08-16T23:59:59.999Z'))).toBe(
      '2026-08-16'
    );
    expect(getUtcChallengeKey(new Date('2026-08-17T00:00:00.000Z'))).toBe(
      '2026-08-17'
    );
  });

  it('creates a stable daily challenge id and deterministic opening state', () => {
    const challengeId = getDailyChallengeId('2026-08-16');
    const first = createSnakeGameState({ challengeKey: '2026-08-16' });
    const second = createSnakeGameState({ challengeKey: '2026-08-16' });

    expect(challengeId).toMatch(/^snake-3d-2026-08-16-/);
    expect(first).toEqual(second);
    expect(first.challengeId).toBe(challengeId);
  });

  it('resets score and position without changing the daily challenge', () => {
    const initial = createSnakeGameState({ challengeKey: '2026-08-16' });
    const played = stepSnakeGame({
      ...initial,
      food: { x: initial.snake[0].x + 1, z: initial.snake[0].z },
    });
    const reset = resetSnakeGameState(played);

    expect(played.score).toBe(1);
    expect(reset.score).toBe(0);
    expect(reset.challengeId).toBe(initial.challengeId);
    expect(reset.snake).toEqual(initial.snake);
  });

  it('rejects an immediate reverse turn', () => {
    const direction = { x: 1, z: 0 } as const;

    expect(changeSnakeDirection(direction, { x: -1, z: 0 })).toEqual(direction);
    expect(changeSnakeDirection(direction, { x: 0, z: 1 })).toEqual({
      x: 0,
      z: 1,
    });
  });

  it('reports the first-death duration and preserves the user-facing buckets', () => {
    expect(getFirstDeathDurationMs(1_000, 60_000)).toBe(59_000);
    expect(getFirstDeathDurationMs(60_000, 1_000)).toBeNull();
    expect(getFirstDeathDurationBucket(29_999)).toBe('under-30s');
    expect(getFirstDeathDurationBucket(30_000)).toBe('30s-to-45s');
    expect(getFirstDeathDurationBucket(45_000)).toBe('45s-to-3m');
    expect(getFirstDeathDurationBucket(180_000)).toBe('45s-to-3m');
    expect(getFirstDeathDurationBucket(180_001)).toBe('3m-to-5m');
    expect(getFirstDeathDurationBucket(300_001)).toBe('over-5m');
  });
});
