import { describe, expect, it } from 'vitest';

import { getSeoLandingPages } from '@/lib/seo-landing-content';
import { getMockGameBySlug, mockGames } from '@/lib/mock-games';
import { collectGuideInternalLinkErrors } from '@/scripts/check-internal-links';

describe('internal link rights audit', () => {
  it('does not report raw guide inventory that the rights gate withholds from rendering', () => {
    const withheld = getMockGameBySlug('adam-and-eve-4');
    expect(withheld?.embedPermissionStatus).toBe('unknown');

    const errors = collectGuideInternalLinkErrors();

    expect(errors.some((error) => error.includes('adam-and-eve-4'))).toBe(false);
    expect(errors.some((error) => error.includes('non-indexable game'))).toBe(false);
  });

  it('still reports a genuinely missing recommendation slug', () => {
    const guides = getSeoLandingPages();
    const target = guides.find((guide) => guide.slug === 'free-games-no-ads');
    expect(target).toBeDefined();

    const brokenGuides = guides.map((guide) =>
      guide.slug === target?.slug
        ? {
            ...guide,
            locales: {
              ...guide.locales,
              en: {
                ...guide.locales.en,
                recommendations: [
                  ...guide.locales.en.recommendations,
                  {
                    slug: 'definitely-missing-game',
                    pitch: 'Regression fixture for the internal-link audit.',
                  },
                ],
              },
            },
          }
        : guide,
    );

    const errors = collectGuideInternalLinkErrors(brokenGuides, mockGames);

    expect(errors).toContain(
      'Guide free-games-no-ads (en) links to missing game definitely-missing-game.',
    );
  });
});
