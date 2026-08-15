import { describe, expect, it } from 'vitest';

import {
  canRenderGameIframe,
  getGameQualityTier,
  shouldIncludeGameInSitemap,
  shouldNoIndexGame,
} from '@/lib/games/quality-policy';
import { getSeoLandingPages } from '@/lib/seo-landing-content';

describe('OvO source safety policy', () => {
  it('withholds the unverified mirror until the source is explicitly reviewed', () => {
    expect(getGameQualityTier('ovo')).toBe('review');
    expect(canRenderGameIframe('ovo')).toBe(false);
    expect(shouldNoIndexGame('ovo')).toBe(true);
    expect(shouldIncludeGameInSitemap('ovo')).toBe(false);
  });

  it('does not render manual-review games in guide recommendations', () => {
    const recommendedSlugs = getSeoLandingPages().flatMap((page) =>
      Object.values(page.locales).flatMap((content) => content.recommendations.map((item) => item.slug)),
    );

    expect(recommendedSlugs).not.toContain('ovo');
  });
});
