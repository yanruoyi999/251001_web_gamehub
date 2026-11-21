const SNAKE_ACTIONS = new Set(['mod_web', 'source_status', 'standard_snake', 'related_editor', 'related_mods', 'read_guide', 'recommendations']);
const PUBLISHER_PLAY_ACTIONS = new Set(['publisher_play']);
const ACTIONS_BY_GUIDE = new Map<string, ReadonlySet<string>>([
  ['google-snake-mods', SNAKE_ACTIONS],
  ['google-snake-level-editor', SNAKE_ACTIONS],
  ['drive-mad-walkthrough', PUBLISHER_PLAY_ACTIONS],
  ['drive-mad-level-tips', PUBLISHER_PLAY_ACTIONS],
  ['apple-knight-mini-dungeons-guide', PUBLISHER_PLAY_ACTIONS],
  ['farkle-scoring', new Set(['score_check'])],
  ['best-free-iphone-games', new Set(['play_circle', 'read_guide', 'recommendations'])],
  ['word-chain-game-examples', new Set(['read_guide', 'practice_entry', 'browse_games'])],
  ['three-player-spades', new Set(['read_guide', 'browse_games'])],
  ['crazy-eights-rules', new Set(['view_rules', 'open_round_example', 'print_quick_rules', 'read_related_guide'])],
  ['gin-rummy-rules', new Set(['open_crazy_eights_rules'])],
  ['spit-card-game-rules', new Set(['open_crazy_eights_rules'])],
  ['euchre-strategy', new Set(['open_booray_rules', 'open_bid_euchre_rules'])],
  ['500-card-game-rules', new Set(['score_first_correct', 'score_first_incorrect', 'score_second_correct', 'score_second_incorrect'])],
  ['9-card-golf-rules', new Set(['score_first_correct', 'score_first_incorrect', 'score_second_correct', 'score_second_incorrect', 'practice_complete'])],
  ['bid-euchre-rules', new Set(['score_made_correct', 'score_made_incorrect', 'score_missed_correct', 'score_missed_incorrect', 'score_transfer_correct', 'score_transfer_incorrect', 'practice_complete'])],
  ['minecraft-throwing-disc', new Set(['open_from_guides', 'read_guide'])],
  ['okishima-1336', new Set(['open_from_guides', 'source_status'])],
]);

/** Only bounded editorial context; never destination URLs or browser identifiers. */
export function getGuideIntentProperties(guideSlug: string, action: string, locale: string) {
  if (!ACTIONS_BY_GUIDE.get(guideSlug)?.has(action) || !['en', 'zh'].includes(locale)) return null;
  return { guide_slug: guideSlug, action, locale, schema_version: 2 };
}
