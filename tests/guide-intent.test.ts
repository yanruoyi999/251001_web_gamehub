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
});
