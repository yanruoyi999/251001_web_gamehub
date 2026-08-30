import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  NOINDEX_EXPERIMENT_GAME_SLUGS,
  shouldExcludeNoindexExperimentGame,
} from '@/lib/games/noindex-experiment-policy';
import { RUNTIME_QUALITY_DEFAULT_SAMPLES } from '@/scripts/audit-runtime-quality';
import { getOriginalExperimentPage } from '@/lib/games/luma-original-experiment-pages';

const newPages = [
  'draw-a-perfect-circle',
  'chinese-checkers',
  'stacker-game',
  'two-player-games',
] as const;

describe('Luma 2026-08-30 governed supply chain', () => {
  it('hard-excludes every governed experiment from sitemap catalogue inputs', () => {
    expect(NOINDEX_EXPERIMENT_GAME_SLUGS).toHaveLength(9);

    for (const slug of newPages) {
      expect(shouldExcludeNoindexExperimentGame(slug)).toBe(true);
    }

    expect(shouldExcludeNoindexExperimentGame('drive-mad')).toBe(false);
  });

  it('keeps a rights record for every new clean-room implementation', () => {
    for (const slug of newPages) {
      const recordPath = path.join(
        process.cwd(),
        'docs',
        'licenses',
        'original-experiments',
        `${slug}.md`,
      );

      expect(existsSync(recordPath)).toBe(true);
      const record = readFileSync(recordPath, 'utf8');
      expect(record).toContain('Rights status: approved');
      expect(record).toContain('Commercial use: approved');
      expect(record).toContain('Third-party code or assets: none');
      expect(record).toContain('Verified: 2026-08-30');
    }

    const checkersRecord = readFileSync(
      path.join(
        process.cwd(),
        'docs/licenses/original-experiments/chinese-checkers.md',
      ),
      'utf8',
    );
    expect(checkersRecord).toContain('Rules cross-check:');
    expect(checkersRecord.match(/Rule source [12]:/g)).toHaveLength(2);
  });

  it('samples every new page in the default mobile runtime gate', () => {
    const samplePaths = RUNTIME_QUALITY_DEFAULT_SAMPLES.map((sample) => sample.path);

    for (const slug of newPages) {
      expect(samplePaths).toContain(`/en/games/${slug}`);
    }
  });

  it('keeps the exact approved H1s, an 80+ page-quality gate, and no synonym routes', () => {
    const expectedTitles = {
      'draw-a-perfect-circle': 'Draw a Perfect Circle — Test Your Accuracy Online',
      'chinese-checkers': 'Chinese Checkers Online — Play Against AI or a Friend',
      'stacker-game': 'Stacker Game — Build the Tallest Tower Online',
      'two-player-games': 'Games to Play With 2 People — 3 Free Same-Screen Games',
    } as const;

    for (const slug of newPages) {
      const page = getOriginalExperimentPage(slug, 'en');
      expect(page.copy.title).toBe(expectedTitles[slug]);
      expect(page.qualityScore).toBeGreaterThanOrEqual(80);
    }

    for (const synonym of ['draw-perfect-circle-game', 'stack-game-online', 'stack-tower']) {
      expect(
        existsSync(path.join(process.cwd(), 'app', '[locale]', 'games', synonym)),
      ).toBe(false);
    }
  });

  it('links the four experiments from the required existing discovery surfaces', () => {
    const gamesHub = readFileSync(
      path.join(process.cwd(), 'app/[locale]/games/page.tsx'),
      'utf8',
    );
    const keyboardGuide = readFileSync(
      path.join(
        process.cwd(),
        'app/[locale]/guides/keyboard-only-browser-games/page.tsx',
      ),
      'utf8',
    );
    const twoPlayerCollection = readFileSync(
      path.join(process.cwd(), 'app/[locale]/games/2-player-unblocked/page.tsx'),
      'utf8',
    );

    for (const slug of newPages) expect(gamesHub).toContain(slug);
    expect(keyboardGuide).toContain("slug: 'stacker-game'");
    expect(keyboardGuide).toContain('`/games/${pick.slug}`');
    expect(twoPlayerCollection).toContain('/games/two-player-games');
  });
});
