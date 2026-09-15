const GUIDES = new Set(['google-snake-mods', 'google-snake-level-editor']);
const ACTIONS = new Set(['mod_web', 'source_status', 'standard_snake', 'related_editor', 'related_mods', 'read_guide', 'recommendations']);

/** Only bounded editorial context; never destination URLs or browser identifiers. */
export function getGuideIntentProperties(guideSlug: string, action: string, locale: string) {
  if (!GUIDES.has(guideSlug) || !ACTIONS.has(action) || !['en', 'zh'].includes(locale)) return null;
  return { guide_slug: guideSlug, action, locale, schema_version: 2 };
}
