import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

const COMPONENT_PATH = path.join(
  process.cwd(),
  'components/game/two-player-collection-player.tsx',
);

const REQUIRED_EVENTS = [
  'two_player_collection_view',
  'two_player_game_click',
  'game_play_start',
  'game_load_success',
  'game_load_error',
  'game_play_10s',
  'game_play_30s',
  'game_switch',
  'game_fullscreen_toggle',
];

describe('two-player collection player contract', () => {
  it('loads a single sandboxed runtime only after an explicit play action', () => {
    expect(fs.existsSync(COMPONENT_PATH)).toBe(true);
    const source = fs.readFileSync(COMPONENT_PATH, 'utf8');

    expect((source.match(/<iframe\b/g) ?? []).length).toBe(1);
    expect(source).toContain("sandbox=\"allow-scripts allow-fullscreen\"");
    expect(source).toContain('activeSlug');
    expect(source).toContain('startGame');
    expect(source).toContain('setActiveSlug(null)');
  });

  it('tracks the complete play funnel with a stable game_slug', () => {
    const source = fs.readFileSync(COMPONENT_PATH, 'utf8');

    for (const eventName of REQUIRED_EVENTS) {
      expect(source).toContain(`'${eventName}'`);
    }

    expect(source).toContain('game_slug:');
    expect(source).toContain("'luma-game-ready'");
    expect(source).toContain("'luma-game-error'");
    expect(source).toContain('10_000');
    expect(source).toContain('30_000');
  });
});
