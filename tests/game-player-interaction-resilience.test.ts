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
  it('uses a real image link instead of a pseudo-element click overlay', () => {
    expect(cardSource).toContain('data-slot="card"');
    expect(globalCss).not.toContain(
      "#recommendations [data-slot='card'] a[href*='/games/']::after",
    );
    expect(globalCss).toContain(
      "#recommendations [data-slot='card']:has(a[href*='/games/']:focus-visible)",
    );
    const guideSource = readFileSync(
      path.join(process.cwd(), 'app/[locale]/guides/[slug]/page.tsx'),
      'utf8',
    );
    expect(guideSource).toContain(
      'href={getLocalizedPath(locale, `/games/${item.slug}`)}',
    );
    expect(guideSource).toContain('className="group block focus-visible:outline-none');
    expect(guideSource).toContain('className="relative aspect-[4/3]');
  });

  it('updates play state before best-effort analytics', () => {
    const handlerStart = playerSource.indexOf('const startGame = () => {');
    const handler = playerSource.slice(handlerStart, handlerStart + 500);

    expect(handlerStart).toBeGreaterThanOrEqual(0);
    expect(handler.indexOf('setLoaded(true)')).toBeGreaterThanOrEqual(0);
    expect(handler.indexOf("trackInteraction('game_start_attempt'")).toBeGreaterThan(
      handler.indexOf('setLoaded(true)'),
    );
  });

  it('keeps a native guide fallback when hydration is delayed', () => {
    expect(playerSource).toContain('fallbackHref?: string;');
    expect(playerSource).toContain('href={fallbackHref}');
    expect(playerSource).toContain('event.preventDefault();');
  });

  it('guards repeated fullscreen transitions and supports Escape fallback exit', () => {
    expect(playerSource).toContain('if (fullscreenTransitionRef.current) return;');
    expect(playerSource).toContain('disabled={isFullscreenTransitioning}');
    expect(playerSource).toContain("if (event.key !== 'Escape') return;");
  });
});
