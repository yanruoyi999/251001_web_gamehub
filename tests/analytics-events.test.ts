import { beforeEach, describe, expect, it, vi } from 'vitest';

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
});
