import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

const gamePageSource = await readFile(
  new URL('../app/[locale]/games/[slug]/page.tsx', import.meta.url),
  'utf8',
);

const discoveryLinkSource = await readFile(
  new URL('../components/game/snake-3d-discovery-link.tsx', import.meta.url),
  'utf8',
);
const snakeGameSource = await readFile(
  new URL('../components/game/luma-snake-3d-game.tsx', import.meta.url),
  'utf8',
);

describe('Snake 3D discovery entry', () => {
  it('links to the original Snake 3D experiment from the Google Snake detail page', () => {
    expect(gamePageSource).toContain("game.slug === 'google-snake'");
    expect(gamePageSource).toContain('data-snake-3d-discovery');
    expect(gamePageSource).toContain("`/games/snake-3d`");
  });

  it('tracks one bounded discovery click without changing the destination', () => {
    expect(gamePageSource).toContain('Snake3DDiscoveryLink');
    expect(discoveryLinkSource).toContain("trackInteraction('snake_3d_discovery_view'");
    expect(discoveryLinkSource).toContain('IntersectionObserver');
    expect(discoveryLinkSource).toContain("trackInteraction('snake_3d_discovery_click'");
    expect(discoveryLinkSource).toContain("source: 'google_snake_game_detail'");
    expect(discoveryLinkSource).toContain("game_slug: 'snake-3d'");
    expect(discoveryLinkSource).toContain('onClick={() =>');
    expect(discoveryLinkSource).toContain('href={href}');
  });

  it('records readiness only after the 3D scene has been created', () => {
    const readyIndex = snakeGameSource.indexOf("trackInteraction('snake_3d_ready'");
    const sceneIndex = snakeGameSource.indexOf('sceneRef.current = controller;');

    expect(readyIndex).toBeGreaterThan(sceneIndex);
    expect(snakeGameSource).toContain("trackInteraction('snake_3d_load_error'");
  });
});
