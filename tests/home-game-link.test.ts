import { beforeEach, describe, expect, it, vi } from 'vitest';

const { gaTrackEvent, vercelTrack } = vi.hoisted(() => ({
  gaTrackEvent: vi.fn(),
  vercelTrack: vi.fn(),
}));

vi.mock('@vercel/analytics', () => ({ track: vercelTrack }));
vi.mock('@/lib/gtag', () => ({ trackEvent: gaTrackEvent }));

import { HomeGameLink } from '@/components/game/home-game-link';

describe('homepage game card clicks', () => {
  beforeEach(() => {
    gaTrackEvent.mockReset();
    vercelTrack.mockReset();
  });

  it.each(['big-tower-tiny-square', 'g-switch-2', 'solitaire'])(
    'reports one click for %s while preserving the destination',
    gameSlug => {
      const href = `/en/games/${gameSlug}`;
      const link = HomeGameLink({
        href, gameSlug, locale: 'en', className: 'card', children: 'Play',
      });

      expect(link.props.href).toBe(href);
      expect(link.props.className).toBe('card');
      expect(link.props.children).toBe('Play');
      expect(link.props['data-shelf-card']).toBe(true);
      expect(gaTrackEvent).not.toHaveBeenCalled();
      expect(vercelTrack).not.toHaveBeenCalled();
      expect(link.props.onClick).toBeTypeOf('function');

      const click = { preventDefault: vi.fn(), stopPropagation: vi.fn() };
      link.props.onClick(click);

      expect(gaTrackEvent).toHaveBeenCalledExactlyOnceWith('home_game_card_click', {
        game_slug: gameSlug, locale: 'en', page: '/en',
        interaction_source: 'home_more_games',
      });
      expect(vercelTrack).toHaveBeenCalledOnce();
      expect(click.preventDefault).not.toHaveBeenCalled();
      expect(click.stopPropagation).not.toHaveBeenCalled();
    },
  );

  it('keeps navigation available when a telemetry provider fails', () => {
    gaTrackEvent.mockImplementationOnce(() => { throw new Error('blocked'); });
    vercelTrack.mockImplementationOnce(() => { throw new Error('blocked'); });
    const link = HomeGameLink({
      href: '/en/games/solitaire', gameSlug: 'solitaire', locale: 'en', children: 'Play',
    });
    expect(link.props.onClick).toBeTypeOf('function');
    expect(() => link.props.onClick()).not.toThrow();
    expect(link.props.href).toBe('/en/games/solitaire');
  });
});
