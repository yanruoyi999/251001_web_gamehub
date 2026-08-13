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
  it('places the homepage recommendation before the existing curated cards', () => {
    expect(homeSource).toContain('<DailyRecommendation locale={locale} surface="home" />');
    expect(homeSource.indexOf('<DailyRecommendation locale={locale} surface="home" />')).toBeLessThan(
      homeSource.indexOf('<section aria-labelledby="curated-starts"'),
    );
  });

  it('places the game-detail recommendation before the game information sidebar', () => {
    expect(gameSource).toContain('surface="game_detail"');
    expect(gameSource.indexOf('<DailyRecommendation')).toBeLessThan(
      gameSource.indexOf("{locale === 'zh' ? '游戏信息' : 'Game Info'}"),
    );
  });

  it('gives mobile and desktop game-detail recommendations explicit responsive placements', () => {
    expect(gameSource).toContain('placement="mobile"');
    expect(gameSource).toContain('className="mb-8 lg:hidden"');
    expect(gameSource).toContain('placement="desktop"');
    expect(gameSource).toContain('className="hidden lg:block"');
    expect(recommendationSource).toContain("placement?: 'default' | 'desktop' | 'mobile'");
    expect(recommendationSource).toContain("window.matchMedia('(min-width: 1024px)')");
  });

  it('renders three visible recommendation cards with local favorite actions', () => {
    expect(recommendationSource).toContain('getDailyRecommendations');
    expect(recommendationSource).toContain('data-recommendation-card');
    expect(recommendationSource).toContain('<FavoriteToggleButton');
    expect(recommendationSource).toContain('surface="daily_recommendation"');
    expect(recommendationSource).toContain('storageMode="local"');
  });

  it('tracks recommendation view and click without collecting identity fields', () => {
    expect(recommendationSource).toContain("trackInteraction('recommendation_view'");
    expect(recommendationSource).toContain("trackInteraction('recommendation_click'");
    expect(recommendationSource).not.toMatch(/email|user_id|photo|upload/i);
  });

  it('tracks successful favorite changes with non-PII game context', () => {
    expect(favoriteSource).toContain("nextState ? 'favorite_add' : 'favorite_remove'");
    expect(favoriteSource).toContain('game_slug: gameSlug');
    expect(favoriteSource).toContain('data-favorite-toggle');
    expect(favoriteSource).not.toMatch(/\b(email|phone|user_id|ip_address|anonymous_token)\b/i);
  });
});
