import { describe, expect, it } from 'vitest';

import {
  changeSnakeDirection,
  createSnakeGameState,
  getDailyChallengeId,
  getFirstDeathDurationBucket,
  getFirstDeathDurationMs,
  getSnakeScoreMilestone,
  getSnakeStepMs,
  getSwipeDirection,
  getUtcChallengeKey,
  queueSnakeDirection,
  resetSnakeGameState,
  stepSnakeGame,
} from '@/lib/games/luma-snake-3d';

describe('Luma Snake 3D challenge rules', () => {
  it('uses one UTC calendar key for every player', () => {
    expect(getUtcChallengeKey(new Date('2026-08-16T23:59:59.999Z'))).toBe('2026-08-16');
    expect(getUtcChallengeKey(new Date('2026-08-17T00:00:00.000Z'))).toBe('2026-08-17');
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
    expect(changeSnakeDirection(direction, { x: 0, z: 1 })).toEqual({ x: 0, z: 1 });
  });

  it('accepts at most one valid turn before the next game tick', () => {
    const right = { x: 1, z: 0 } as const;
    const up = { x: 0, z: -1 } as const;
    const left = { x: -1, z: 0 } as const;
    const queued = queueSnakeDirection(right, null, up);
    expect(queued).toEqual(up);
    expect(queueSnakeDirection(right, queued, left)).toEqual(up);
    expect(queueSnakeDirection(right, null, left)).toBeNull();
    expect(queueSnakeDirection(right, null, right)).toBeNull();
  });

  it('maps deliberate swipes to cardinal directions and ignores taps', () => {
    expect(getSwipeDirection({ x: 10, y: 10 }, { x: 80, y: 15 })).toEqual({ x: 1, z: 0 });
    expect(getSwipeDirection({ x: 80, y: 10 }, { x: 10, y: 15 })).toEqual({ x: -1, z: 0 });
    expect(getSwipeDirection({ x: 10, y: 80 }, { x: 15, y: 10 })).toEqual({ x: 0, z: -1 });
    expect(getSwipeDirection({ x: 10, y: 10 }, { x: 15, y: 80 })).toEqual({ x: 0, z: 1 });
    expect(getSwipeDirection({ x: 10, y: 10 }, { x: 20, y: 20 })).toBeNull();
  });

  it('only emits deliberate score milestones instead of one event per food', () => {
    expect(getSnakeScoreMilestone(0)).toBeNull();
    expect(getSnakeScoreMilestone(1)).toBeNull();
    expect(getSnakeScoreMilestone(4)).toBeNull();
    expect(getSnakeScoreMilestone(5)).toBe(5);
    expect(getSnakeScoreMilestone(6)).toBeNull();
    expect(getSnakeScoreMilestone(10)).toBe(10);
    expect(getSnakeScoreMilestone(15)).toBe(15);
    expect(getSnakeScoreMilestone(20)).toBe(20);
    expect(getSnakeScoreMilestone(30)).toBe(30);
    expect(getSnakeScoreMilestone(50)).toBe(50);
    expect(getSnakeScoreMilestone(100)).toBe(100);
    expect(getSnakeScoreMilestone(101)).toBeNull();
  });

  it('speeds up in explicit score bands without going below the floor', () => {
    expect(getSnakeStepMs(0)).toBe(175);
    expect(getSnakeStepMs(4)).toBe(175);
    expect(getSnakeStepMs(5)).toBe(155);
    expect(getSnakeStepMs(10)).toBe(135);
    expect(getSnakeStepMs(15)).toBe(115);
    expect(getSnakeStepMs(20)).toBe(100);
    expect(getSnakeStepMs(30)).toBe(85);
    expect(getSnakeStepMs(10_000)).toBeGreaterThanOrEqual(80);
    expect(getSnakeStepMs(-1)).toBe(175);
    expect(getSnakeStepMs(Number.NaN)).toBe(175);
  });

  it('dies when the next head position crosses the board boundary', () => {
    const initial = createSnakeGameState({ challengeKey: '2026-08-16', gridSize: 8 });
    const dead = stepSnakeGame({
      ...initial,
      snake: [
        { x: 7, z: 4 },
        { x: 6, z: 4 },
        { x: 5, z: 4 },
      ],
      direction: { x: 1, z: 0 },
      food: { x: 0, z: 0 },
    });
    expect(dead.status).toBe('dead');
  });

  it('dies when the head moves into the snake body', () => {
    const initial = createSnakeGameState({ challengeKey: '2026-08-16', gridSize: 8 });
    const dead = stepSnakeGame({
      ...initial,
      snake: [
        { x: 3, z: 3 },
        { x: 3, z: 4 },
        { x: 2, z: 4 },
        { x: 2, z: 3 },
        { x: 2, z: 2 },
      ],
      direction: { x: -1, z: 0 },
      food: { x: 7, z: 7 },
    });
    expect(dead.status).toBe('dead');
  });

  it('allows moving into the cell vacated by the tail when not eating', () => {
    const initial = createSnakeGameState({ challengeKey: '2026-08-16', gridSize: 8 });
    const moved = stepSnakeGame({
      ...initial,
      snake: [
        { x: 2, z: 2 },
        { x: 2, z: 3 },
        { x: 1, z: 3 },
        { x: 1, z: 2 },
      ],
      direction: { x: -1, z: 0 },
      food: { x: 7, z: 7 },
    });
    expect(moved.status).toBe('playing');
    expect(moved.snake[0]).toEqual({ x: 1, z: 2 });
  });

  it('never respawns food on the snake after eating', () => {
    const initial = createSnakeGameState({ challengeKey: '2026-08-16', gridSize: 8 });
    const moved = stepSnakeGame({
      ...initial,
      snake: [
        { x: 3, z: 3 },
        { x: 2, z: 3 },
        { x: 1, z: 3 },
      ],
      direction: { x: 1, z: 0 },
      food: { x: 4, z: 3 },
    });
    expect(moved.score).toBe(1);
    expect(moved.snake).not.toContainEqual(moved.food);
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
