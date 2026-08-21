import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (file: string) => readFileSync(path.join(process.cwd(), file), 'utf8');

describe('iframe sandbox policy', () => {
  it('does not use the invalid allow-fullscreen sandbox token', () => {
    const sources = [
      read('components/game/game-player-facade.tsx'),
      read('app/[locale]/games/monster-survivors/page.tsx'),
      read('app/[locale]/games/solitaire/page.tsx'),
    ];

    for (const source of sources) {
      expect(source).not.toContain('allow-fullscreen');
      expect(source).toContain('allowFullScreen');
    }
  });
});
