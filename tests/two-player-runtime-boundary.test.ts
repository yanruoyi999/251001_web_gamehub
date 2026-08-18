import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { TWO_PLAYER_GAMES } from '@/lib/games/two-player-unblocked';

const ROOT = process.cwd();

function toPublicPath(publicUrl: string) {
  return path.join(ROOT, 'public', publicUrl.replace(/^\//, ''));
}

describe('two-player self-hosted runtime boundary', () => {
  it('ships every approved runtime and preview entirely from Luma public files', () => {
    expect(TWO_PLAYER_GAMES.length).toBeGreaterThanOrEqual(3);

    for (const game of TWO_PLAYER_GAMES) {
      expect(game.provenanceStatus).toBe('approved');
      expect(game.runtimePath).toMatch(/^\/games-runtime\/[a-z0-9-]+\/index\.html$/);
      expect(fs.existsSync(toPublicPath(game.runtimePath)), `${game.slug} runtime`).toBe(true);
      expect(fs.existsSync(toPublicPath(game.thumbnailPath)), `${game.slug} preview`).toBe(true);
      expect(fs.existsSync(toPublicPath(game.licenseNoticePath)), `${game.slug} license`).toBe(true);
    }
  });

  it('keeps executable runtime sources free of third-party network dependencies', () => {
    for (const game of TWO_PLAYER_GAMES) {
      const runtimeDir = path.dirname(toPublicPath(game.runtimePath));
      const runtimeSources = ['index.html', 'style.css', 'game.js'];

      for (const filename of runtimeSources) {
        const filePath = path.join(runtimeDir, filename);
        expect(fs.existsSync(filePath), `${game.slug}/${filename}`).toBe(true);
        const source = fs.readFileSync(filePath, 'utf8');
        expect(source, `${game.slug}/${filename}`).not.toMatch(/https?:\/\//i);
      }

      const combinedSource = runtimeSources
        .map((filename) => fs.readFileSync(path.join(runtimeDir, filename), 'utf8'))
        .join('\n');

      expect(combinedSource, `${game.slug} ready signal`).toContain('luma-game-ready');
      expect(combinedSource, `${game.slug} identity`).toContain(game.slug);
    }
  });
});
