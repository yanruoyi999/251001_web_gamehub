import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

const pageSource = await readFile(
  new URL('../app/[locale]/games/checkers-rules/page.tsx', import.meta.url),
  'utf8'
);
const componentSource = await readFile(
  new URL('../components/game/luma-checkers-game.tsx', import.meta.url),
  'utf8'
);
const seoSource = await readFile(
  new URL('../lib/games/luma-checkers-seo.ts', import.meta.url),
  'utf8'
);
const sitemapSource = await readFile(
  new URL('../app/sitemap.ts', import.meta.url),
  'utf8'
);
const gamesDirectorySource = await readFile(
  new URL('../app/[locale]/games/page.tsx', import.meta.url),
  'utf8'
);
const discoverySource = await readFile(
  new URL('../components/game/checkers-discovery-card.tsx', import.meta.url),
  'utf8'
);

describe('Luma Checkers experiment boundary', () => {
  it('keeps the original page crawlable but out of the index and sitemap', () => {
    expect(pageSource).toContain('robots: { index: false, follow: true }');
    expect(pageSource).toContain('LUMA_CHECKERS_PATH');
    expect(pageSource).toContain('LumaCheckersGame');
    expect(sitemapSource).not.toContain("'/games/checkers-rules'");
  });

  it('records bounded game states without square coordinates or PII', () => {
    expect(componentSource).toContain("trackInteraction('checkers_game_ready'");
    expect(componentSource).toContain("'checkers_game_start'");
    expect(componentSource).toContain(
      "trackInteraction('checkers_move_attempt'"
    );
    expect(componentSource).toContain(
      "trackInteraction('checkers_game_complete'"
    );
    expect(componentSource).toContain("'checkers_retry'");
    expect(componentSource).toContain('duration_bucket');
    expect(componentSource).not.toContain('row: square.row');
    expect(componentSource).not.toContain('col: square.col');
    expect(seoSource).toContain(
      "export const LUMA_CHECKERS_PATH = '/games/checkers-rules';"
    );
  });

  it('has one controlled directory entry for behavior sampling', () => {
    expect(gamesDirectorySource).toContain('CheckersDiscoveryCard');
    expect(discoverySource).toContain(
      "trackInteraction('checkers_discovery_view'"
    );
    expect(discoverySource).toContain(
      "trackInteraction('checkers_discovery_click'"
    );
    expect(discoverySource).toContain("'/games/checkers-rules'");
  });
});
