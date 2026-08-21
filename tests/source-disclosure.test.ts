import { describe, expect, it } from 'vitest';

import { getMockGameBySlug } from '@/lib/mock-games';
import {
  canRenderGameIframe,
  getGameRedirectTarget,
  getGameQualityTier,
  getRemovedGameRedirectTarget,
  getRetiredCatalogueRedirectTarget,
  shouldIncludeGameInSitemap,
  shouldNoIndexGame,
} from '@/lib/games/quality-policy';

describe('game source disclosure', () => {
  it('marks imported 4399 mirror entries as unverified distribution sources', () => {
    const game = getMockGameBySlug('google-snake');

    expect(game).toBeDefined();
    expect(game?.sourceType).toBe('distribution');
    expect(game?.developerVerified).toBe(false);
    expect(game?.embedPermissionStatus).toBe('unknown');
    expect(game?.sourcePageUrl).toMatch(/^https:\/\/ad-freegames\.github\.io\//);
    expect(game?.embedHost).toBe('szhong.4399.com');
    expect(game?.sourceUrl).toBeNull();
  });

  it('prevents manual-review games from rendering playable iframes', () => {
    expect(getGameQualityTier('adam-and-eve-8')).toBe('review');
    expect(canRenderGameIframe('adam-and-eve-8')).toBe(false);
  });

  it('keeps the manually curated core surface stable while exposing the audit gap', () => {
    const game = getMockGameBySlug('google-snake');

    expect(game).toBeDefined();
    expect(getGameQualityTier(game)).toBe('core-indexed');
    expect(canRenderGameIframe(game)).toBe(true);
    expect(shouldNoIndexGame(game)).toBe(false);
    expect(shouldIncludeGameInSitemap(game)).toBe(true);
  });

  it('keeps slug-only policy checks backward-compatible for reviewed callers', () => {
    expect(getGameQualityTier('google-snake')).toBe('core-indexed');
    expect(canRenderGameIframe('google-snake')).toBe(true);
  });

  it('maps high-risk removed game slugs to safer relevant core pages', () => {
    expect(getRemovedGameRedirectTarget('temple-run-2')).toBe('tunnel-rush');
    expect(getRemovedGameRedirectTarget('temple-run-2-holi-festival')).toBe('tunnel-rush');
    expect(getRemovedGameRedirectTarget('rublox-space-farm')).toBe('cow-bay');
    expect(getRemovedGameRedirectTarget('super-omar-climb')).toBe('apple-knight');
  });

  it('maps retired catalogue-only series pages to stronger core alternatives', () => {
    expect(getRetiredCatalogueRedirectTarget('duo-survival')).toBe('duo-vikings');
    expect(getRetiredCatalogueRedirectTarget('duo-survival-2')).toBe('duo-vikings-2');
    expect(getRetiredCatalogueRedirectTarget('duo-survival-3')).toBe('duo-vikings-2');
    expect(getRetiredCatalogueRedirectTarget('fly-car-stunt')).toBe('drive-mad');
    expect(getRetiredCatalogueRedirectTarget('fly-car-stunt-2')).toBe('drive-mad');
    expect(getRetiredCatalogueRedirectTarget('fly-car-stunt-5')).toBe('drive-mad');
  });

  it('uses one redirect lookup for removed and retired catalogue entries', () => {
    expect(getGameRedirectTarget('temple-run-2')).toBe('tunnel-rush');
    expect(getGameRedirectTarget('duo-survival')).toBe('duo-vikings');
    expect(getGameRedirectTarget('google-snake')).toBeNull();
  });
});
