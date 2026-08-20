import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

const pageSource = await readFile(
  new URL('../app/[locale]/games/draw-a-perfect-circle/page.tsx', import.meta.url),
  'utf8',
);
const componentSource = await readFile(
  new URL('../components/game/luma-circle-game.tsx', import.meta.url),
  'utf8',
);
const seoSource = await readFile(
  new URL('../lib/games/luma-circle-seo.ts', import.meta.url),
  'utf8',
);
const sitemapSource = await readFile(new URL('../app/sitemap.ts', import.meta.url), 'utf8');

describe('Luma Circle test page boundary', () => {
  it('keeps the page crawlable but out of the index while the experiment runs', () => {
    expect(pageSource).toContain('robots: { index: false, follow: true }');
    expect(pageSource).toContain('LUMA_CIRCLE_PATH');
    expect(pageSource).toContain('LumaCircleGame');
    expect(sitemapSource).not.toContain("'/games/draw-a-perfect-circle'");
    expect(sitemapSource).not.toContain('LUMA_CIRCLE_PATH');
  });

  it('records bounded game behavior without sending drawing coordinates', () => {
    expect(componentSource).toContain("trackInteraction('circle_game_ready'");
    expect(componentSource).toContain("trackInteraction('circle_game_start'");
    expect(componentSource).toContain("trackInteraction('circle_draw_start'");
    expect(componentSource).toContain("trackInteraction('circle_draw_complete'");
    expect(componentSource).toContain("trackInteraction('circle_retry'");
    expect(componentSource).toContain("trackInteraction('circle_share'");
    expect(componentSource).toContain('score_bucket');
    expect(componentSource).toContain('duration_bucket');
    expect(componentSource).not.toContain('points: pointsRef.current');
    expect(seoSource).toContain("export const LUMA_CIRCLE_PATH = '/games/draw-a-perfect-circle';");
  });
});
