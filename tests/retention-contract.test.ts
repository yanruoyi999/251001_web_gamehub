import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

const homeSource = await readFile(new URL('../app/[locale]/page.tsx', import.meta.url), 'utf8');
const gameSource = await readFile(new URL('../app/[locale]/games/[slug]/page.tsx', import.meta.url), 'utf8');
const favoriteSource = await readFile(new URL('../components/game/favorite-toggle.tsx', import.meta.url), 'utf8');
const recommendationSource = await readFile(
  new URL('../components/retention/daily-recommendation.tsx', import.meta.url),
  'utf8',
);

describe('retention experiment wiring', () => {
  it('places the daily recommendation on home and game detail surfaces', () => {
    expect(homeSource).toContain('<DailyRecommendation locale={locale} surface="home" />');
    expect(gameSource).toContain('surface="game_detail"');
    expect(gameSource).toContain('<DailyRecommendation');
  });

  it('tracks recommendation view and click without collecting identity fields', () => {
    expect(recommendationSource).toContain("trackInteraction('recommendation_view'");
    expect(recommendationSource).toContain("trackInteraction('recommendation_click'");
    expect(recommendationSource).not.toMatch(/email|user_id|photo|upload/i);
  });

  it('tracks successful favorite changes with non-PII game context', () => {
    expect(favoriteSource).toContain("nextState ? 'favorite_add' : 'favorite_remove'");
    expect(favoriteSource).toContain('game_slug: gameSlug');
    expect(favoriteSource).not.toMatch(/\b(email|phone|user_id|ip_address|anonymous_token)\b/i);
  });
});
