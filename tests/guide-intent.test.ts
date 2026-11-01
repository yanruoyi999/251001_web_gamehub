import { describe, expect, it, vi } from 'vitest';
const { trackInteraction } = vi.hoisted(() => ({ trackInteraction: vi.fn() }));
vi.mock('@/lib/analytics/events', () => ({ trackInteraction }));
import { getGuideIntentProperties } from '@/lib/guide-intent';
import { GuideIntentLink } from '@/components/seo/guide-intent-link';

describe('bounded guide intent', () => {
  it('uses only finite guide, action, locale and schema values', () => {
    expect(getGuideIntentProperties('google-snake-mods', 'mod_web', 'en')).toEqual({
      guide_slug: 'google-snake-mods', action: 'mod_web', locale: 'en', schema_version: 2,
    });
    expect(getGuideIntentProperties('private/path?email=x', 'mod_web', 'en')).toBeNull();
    expect(getGuideIntentProperties('google-snake-mods', 'https://unknown.test/', 'en')).toBeNull();
    expect(getGuideIntentProperties('google-snake-mods', 'mod_web', 'unknown')).toBeNull();
  });
  it('keeps a native destination and queues one event for one activation', () => {
    trackInteraction.mockClear();
    const link = GuideIntentLink({ guideSlug: 'google-snake-mods', action: 'mod_web', locale: 'en', href: 'https://googlesnakemods.com/', children: 'Open', target: '_blank', rel: 'noopener noreferrer' });
    expect(link.type).toBe('a');
    expect(link.props.href).toBe('https://googlesnakemods.com/');
    link.props.onClick();
    expect(trackInteraction).toHaveBeenCalledTimes(1);
    expect(trackInteraction).toHaveBeenCalledWith('guide_intent_click', { guide_slug: 'google-snake-mods', action: 'mod_web', locale: 'en', schema_version: 2 });
  });
  it('does not collect events on unrelated guides', () => {
    trackInteraction.mockClear();
    GuideIntentLink({ guideSlug: 'other-guide', action: 'source_status', locale: 'en', href: '#details', children: 'Read' }).props.onClick();
    expect(trackInteraction).not.toHaveBeenCalled();
  });

  it.each([
    ['word-chain-game-examples', 'read_guide'],
    ['word-chain-game-examples', 'practice_entry'],
    ['word-chain-game-examples', 'browse_games'],
    ['three-player-spades', 'read_guide'],
    ['three-player-spades', 'browse_games'],
  ])('allows the bounded %s / %s entry in both locales', (guideSlug, action) => {
    for (const locale of ['en', 'zh']) {
      expect(getGuideIntentProperties(guideSlug, action, locale)).toEqual({
        guide_slug: guideSlug, action, locale, schema_version: 2,
      });
    }
  });

  it.each([
    ['three-player-spades', 'practice_entry', 'en'],
    ['word-chain-game-examples', 'game_start', 'en'],
    ['three-player-spades', 'game_complete', 'zh'],
    ['categories-game-topics', 'browse_games', 'en'],
    ['word-chain-game-examples', 'https://unknown.test/', 'en'],
    ['word-chain-game-examples', 'practice_entry', 'en-US'],
  ])('rejects unapproved entry context %s / %s / %s', (guideSlug, action, locale) => {
    expect(getGuideIntentProperties(guideSlug, action, locale)).toBeNull();
  });

  it('reports one practice entry activation without changing its native target', () => {
    trackInteraction.mockClear();
    const link = GuideIntentLink({
      guideSlug: 'word-chain-game-examples', action: 'practice_entry', locale: 'en',
      href: '#word-chain-practice', children: 'Try the eight puzzles',
    });
    expect(link.type).toBe('a');
    expect(link.props.href).toBe('#word-chain-practice');
    expect(trackInteraction).not.toHaveBeenCalled();
    link.props.onClick();
    expect(trackInteraction).toHaveBeenCalledExactlyOnceWith('guide_intent_click', {
      guide_slug: 'word-chain-game-examples', action: 'practice_entry',
      locale: 'en', schema_version: 2,
    });
  });
});
