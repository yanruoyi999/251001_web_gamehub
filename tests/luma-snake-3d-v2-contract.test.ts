import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

import {
  getSnakeFeedbackTone,
  getSnakeScoreMilestone,
} from '@/lib/games/luma-snake-feedback';

const snakeComponentSource = await readFile(
  new URL('../components/game/luma-snake-3d-game.tsx', import.meta.url),
  'utf8'
);
const provenanceSource = await readFile(
  new URL('../docs/licenses/luma-originals/snake-3d.md', import.meta.url),
  'utf8'
);

describe('Luma Snake 3D V2 feedback contract', () => {
  it('uses bounded synthesized tones for eat, milestone and game over feedback', () => {
    expect(getSnakeFeedbackTone('eat')).toEqual({
      frequencyHz: 520,
      durationMs: 55,
      gain: 0.045,
      type: 'sine',
    });
    expect(getSnakeFeedbackTone('milestone').frequencyHz).toBeGreaterThan(
      getSnakeFeedbackTone('eat').frequencyHz
    );
    expect(getSnakeFeedbackTone('game-over').frequencyHz).toBeLessThan(
      getSnakeFeedbackTone('eat').frequencyHz
    );
    expect(getSnakeFeedbackTone('game-over').durationMs).toBeLessThanOrEqual(220);
  });

  it('only emits meaningful score milestones instead of one analytics event per food', () => {
    expect(getSnakeScoreMilestone(4, 5)).toBe(5);
    expect(getSnakeScoreMilestone(9, 10)).toBe(10);
    expect(getSnakeScoreMilestone(19, 20)).toBe(20);
    expect(getSnakeScoreMilestone(29, 30)).toBe(30);
    expect(getSnakeScoreMilestone(30, 31)).toBeNull();
    expect(getSnakeScoreMilestone(4, 6)).toBe(5);
  });

  it('keeps sound local, user-controlled and motion-aware', () => {
    expect(snakeComponentSource).toContain('luma-snake-3d-muted');
    expect(snakeComponentSource).toContain('data-snake-audio-toggle="true"');
    expect(snakeComponentSource).toContain("matchMedia('(prefers-reduced-motion: reduce)')");
    expect(snakeComponentSource).toContain("trackInteraction('snake_audio_toggle'");
  });
});

describe('Luma Snake 3D V2 analytics contract', () => {
  it('tracks first move, milestones and game over without per-food GA4 spam', () => {
    expect(snakeComponentSource).toContain("trackInteraction('snake_first_move'");
    expect(snakeComponentSource).toContain("trackInteraction('snake_score_milestone'");
    expect(snakeComponentSource).toContain("trackInteraction('snake_game_over'");
    expect(snakeComponentSource).not.toContain("trackInteraction('snake_food_eaten'");
  });

  it('records the required game-over dimensions and control type', () => {
    expect(snakeComponentSource).toContain('final_score:');
    expect(snakeComponentSource).toContain('best_score:');
    expect(snakeComponentSource).toContain('duration_ms:');
    expect(snakeComponentSource).toContain('control_type:');
    expect(snakeComponentSource).toContain("'keyboard'");
    expect(snakeComponentSource).toContain("'touch-button'");
    expect(snakeComponentSource).toContain("'swipe'");
  });
});

describe('Luma Snake 3D provenance contract', () => {
  it('records the game as self-hosted original code with no third-party gameplay assets', () => {
    expect(provenanceSource).toContain('Developer: Luma Game Hub');
    expect(provenanceSource).toContain('Renderer: `three@0.185.1`');
    expect(provenanceSource).toContain('Renderer license: MIT');
    expect(provenanceSource).toContain('Audio assets: none');
    expect(provenanceSource).toContain('Third-party iframe: no');
    expect(provenanceSource).toContain('External runtime game URL: no');
  });
});
