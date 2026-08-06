import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { gaTrackEvent, vercelTrack } = vi.hoisted(() => ({
  gaTrackEvent: vi.fn(),
  vercelTrack: vi.fn(),
}));

vi.mock('@vercel/analytics', () => ({ track: vercelTrack }));
vi.mock('@/lib/gtag', () => ({ trackEvent: gaTrackEvent }));

import { trackInteraction } from '@/lib/analytics/events';

describe('trackInteraction', () => {
  beforeEach(() => {
    gaTrackEvent.mockReset();
    vercelTrack.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('keeps UI source context out of GA4 traffic attribution', () => {
    trackInteraction('game_play_start', {
      game_slug: 'duo-vikings',
      source: 'game_detail',
    });

    expect(vercelTrack).toHaveBeenCalledWith('game_play_start', {
      game_slug: 'duo-vikings',
      source: 'game_detail',
    });
    expect(vercelTrack).toHaveBeenCalledOnce();
    expect(gaTrackEvent).toHaveBeenCalledWith('game_play_start', {
      game_slug: 'duo-vikings',
      interaction_source: 'game_detail',
    });
    expect(gaTrackEvent).toHaveBeenCalledOnce();
  });

  it('tracks the Typeform feedback CTA once with page context', () => {
    trackInteraction('feedback_open', {
      locale: 'en',
      page: '/en/guides/hide-and-paint-guide',
      source: 'typeform',
    });

    expect(vercelTrack).toHaveBeenCalledOnce();
    expect(vercelTrack).toHaveBeenCalledWith('feedback_open', {
      locale: 'en',
      page: '/en/guides/hide-and-paint-guide',
      source: 'typeform',
    });
    expect(gaTrackEvent).toHaveBeenCalledOnce();
    expect(gaTrackEvent).toHaveBeenCalledWith('feedback_open', {
      locale: 'en',
      page: '/en/guides/hide-and-paint-guide',
      interaction_source: 'typeform',
    });
  });

  it('keeps user interactions alive when a telemetry provider throws', () => {
    vercelTrack.mockImplementationOnce(() => {
      throw new Error('analytics blocked');
    });

    expect(() =>
      trackInteraction('game_fullscreen_toggle', {
        game_slug: 'google-snake',
        source: 'guide_embed',
        entering: true,
      }),
    ).not.toThrow();

    expect(gaTrackEvent).toHaveBeenCalledWith('game_fullscreen_toggle', {
      game_slug: 'google-snake',
      interaction_source: 'guide_embed',
      entering: true,
    });
  });

  it('isolates Clarity failures from navigation and controls', () => {
    vi.stubGlobal('window', {
      clarity: () => {
        throw new Error('clarity blocked');
      },
    });

    expect(() =>
      trackInteraction('guide_recommendation_open', {
        game_slug: 'ovo',
        source: 'guide_recommendation',
      }),
    ).not.toThrow();

    expect(vercelTrack).toHaveBeenCalledOnce();
    expect(gaTrackEvent).toHaveBeenCalledOnce();
  });
});
