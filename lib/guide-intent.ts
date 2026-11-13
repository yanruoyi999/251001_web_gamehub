const SNAKE_ACTIONS = new Set(['mod_web', 'source_status', 'standard_snake', 'related_editor', 'related_mods', 'read_guide', 'recommendations']);
const ACTIONS_BY_GUIDE = new Map<string, ReadonlySet<string>>([
  ['google-snake-mods', SNAKE_ACTIONS],
  ['google-snake-level-editor', SNAKE_ACTIONS],
  ['best-free-iphone-games', new Set(['play_circle', 'read_guide', 'recommendations'])],
  ['word-chain-game-examples', new Set(['read_guide', 'practice_entry', 'browse_games'])],
  ['three-player-spades', new Set(['read_guide', 'browse_games'])],
  ['crazy-eights-rules', new Set(['view_rules', 'open_round_example', 'print_quick_rules', 'read_related_guide'])],
  ['gin-rummy-rules', new Set(['open_crazy_eights_rules'])],
  ['spit-card-game-rules', new Set(['open_crazy_eights_rules'])],
  ['euchre-strategy', new Set(['open_booray_rules'])],
]);

/** Only bounded editorial context; never destination URLs or browser identifiers. */
export function getGuideIntentProperties(guideSlug: string, action: string, locale: string) {
  if (!ACTIONS_BY_GUIDE.get(guideSlug)?.has(action) || !['en', 'zh'].includes(locale)) return null;
  return { guide_slug: guideSlug, action, locale, schema_version: 2 };
}
