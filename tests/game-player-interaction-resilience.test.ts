import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const playerSource = readFileSync(
  path.join(process.cwd(), 'components/game/game-player-facade.tsx'),
  'utf8',
);
const cardSource = readFileSync(
  path.join(process.cwd(), 'components/ui/card.tsx'),
  'utf8',
);
const globalCss = readFileSync(path.join(process.cwd(), 'app/globals.css'), 'utf8');

describe('search-session interaction resilience', () => {
  it('stretches each recommendation game link across its full card', () => {
    expect(cardSource).toContain('data-slot="card"');
    expect(globalCss).toContain(
      "#recommendations [data-slot='card'] a[href*='/games/']::after",
    );
    expect(globalCss).toContain(
      "#recommendations [data-slot='card']:has(a[href*='/games/']:focus-visible)",
    );
  });

  it('updates play state before best-effort analytics', () => {
    const analyticsCall = playerSource.indexOf("trackInteraction('game_play_start'");
    const handlerStart = playerSource.lastIndexOf('onClick={() => {', analyticsCall);
    const handler = playerSource.slice(handlerStart, handlerStart + 500);

    expect(handler.indexOf('setLoaded(true)')).toBeGreaterThanOrEqual(0);
    expect(handler.indexOf("trackInteraction('game_play_start'")).toBeGreaterThan(
      handler.indexOf('setLoaded(true)'),
    );
  });

  it('guards repeated fullscreen transitions and supports Escape fallback exit', () => {
    expect(playerSource).toContain('if (fullscreenTransitionRef.current) return;');
    expect(playerSource).toContain('disabled={isFullscreenTransitioning}');
    expect(playerSource).toContain("if (event.key !== 'Escape') return;");
  });
});
