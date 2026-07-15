export const MANUAL_REVIEW_GAME_REASONS = {
  'adam-and-eve-zombies': 'Zombie theme; review tone, iframe behavior, and age suitability before indexing.',
  'adam-and-eve-8': 'Duplicate iframe mapping with Adam and Eve 7; keep out of index until the correct playable source is verified.',
  'balance-duel': 'Public store descriptions center on gun/recoil shooting duels; keep out of index during AdSense review prep.',
  'gun-battle-3': 'Gun combat query and title risk; keep out of index until source and presentation are reviewed.',
  'hero-tower-wars': 'War-themed title; review violence level and source clarity before surfacing.',
  'hunter-hitman': 'Hitman/assassin wording; review content suitability before indexing.',
  'merge-alphabet-lore': 'Possible third-party IP/trend term; review trademark and source risk.',
  'metal-black-ops': 'Military shooter wording; review violence and source quality.',
  'raft-wars': 'War-themed title; review content and iframe behavior before indexing.',
  'raft-wars-2': 'War-themed title; review content and iframe behavior before indexing.',
  'rublox-space-farm': 'Possible Roblox-adjacent trademark confusion; review IP risk before indexing.',
  'skibidi-shooter': 'Trend/IP-adjacent shooter title; review source, violence, and trademark risk.',
  'state-wars-conquer-them-all': 'War/conquest wording; review policy fit and source clarity.',
  'stick-war-infinity-duel': 'War/combat title; review suitability before indexing.',
  'stick-warrior': 'Combat title; review suitability before indexing.',
  'stickman-shooter': 'Shooter title; review violence and source quality before indexing.',
  'super-omar-climb': 'Possible Mario-like naming/IP confusion; review before indexing.',
  'temple-run-2': 'Known franchise term; review authorization/source risk before indexing.',
  'temple-run-2-holi-festival': 'Known franchise term; review authorization/source risk before indexing.',
  'wild-bullets': 'Gun/bullet wording; review violence and source quality before indexing.',
} as const;

export type ManualReviewGameSlug = keyof typeof MANUAL_REVIEW_GAME_REASONS;

const MANUAL_REVIEW_GAME_SLUGS = new Set<string>(Object.keys(MANUAL_REVIEW_GAME_REASONS));

export const REMOVED_GAME_REDIRECT_TARGETS = {
  'rublox-space-farm': 'cow-bay',
  'super-omar-climb': 'apple-knight',
  'temple-run-2': 'tunnel-rush',
  'temple-run-2-holi-festival': 'tunnel-rush',
} as const;

export type RemovedGameSlug = keyof typeof REMOVED_GAME_REDIRECT_TARGETS;

export const RETIRED_CATALOGUE_REDIRECT_TARGETS = {
  'duo-survival': 'duo-vikings',
  'duo-survival-2': 'duo-vikings-2',
  'duo-survival-3': 'duo-vikings-2',
  'fly-car-stunt': 'drive-mad',
  'fly-car-stunt-2': 'drive-mad',
  'fly-car-stunt-5': 'drive-mad',
} as const;

export type RetiredCatalogueGameSlug = keyof typeof RETIRED_CATALOGUE_REDIRECT_TARGETS;

export const CORE_INDEXABLE_GAME_SLUGS = [
  'adam-and-eve-4',
  'adam-and-eve-5-part-1',
  'adam-and-eve-5-part-2',
  'adam-and-eve-6',
  'adam-and-eve-7',
  'adam-and-eve-go',
  'adam-and-eve-go-2',
  'adam-and-eve-go-3',
  'adam-and-eve-go-xmas',
  'adam-and-eve-night',
  'adam-and-eve-sleepwalker',
  'adam-and-eve-snow',
  'apple-knight',
  'apple-knight-mini-dungeons',
  'beat-line',
  'big-tower-tiny-square',
  'big-tower-tiny-square-2',
  'blockman-climb',
  'blumgi-ball',
  'blumgi-bloom',
  'blumgi-rocket',
  'castle-pals',
  'catch-the-candy',
  'cats-love-cake',
  'cats-love-cake-2',
  'city-bike-stunt',
  'cover-orange',
  'cover-orange-journey',
  'cow-bay',
  'crazy-kick',
  'dadish',
  'dadish-2',
  'dadish-3',
  'drive-mad',
  'duo-vikings',
  'duo-vikings-2',
  'fireboy-watergirl-6',
  'g-switch-2',
  'g-switch-3',
  'google-snake',
  'monkey-mart',
  'monster-tracks',
  'ovo',
  'rolling-ball',
  'string-theory-2-remastered',
  'tunnel-rush',
] as const;

const CORE_INDEXABLE_GAME_SLUG_SET = new Set<string>(CORE_INDEXABLE_GAME_SLUGS);

export function normalizeGameSlug(slug: string | null | undefined) {
  return (slug ?? '').trim().toLowerCase();
}

export function isGameUnderManualReview(slug: string | null | undefined) {
  return MANUAL_REVIEW_GAME_SLUGS.has(normalizeGameSlug(slug));
}

export function getManualReviewReason(slug: string | null | undefined) {
  const normalized = normalizeGameSlug(slug) as ManualReviewGameSlug;
  return MANUAL_REVIEW_GAME_REASONS[normalized] ?? null;
}

export function getRemovedGameRedirectTarget(slug: string | null | undefined) {
  const normalized = normalizeGameSlug(slug) as RemovedGameSlug;
  return REMOVED_GAME_REDIRECT_TARGETS[normalized] ?? null;
}

export function isRemovedGameSlug(slug: string | null | undefined) {
  return Boolean(getRemovedGameRedirectTarget(slug));
}

export function getRetiredCatalogueRedirectTarget(slug: string | null | undefined) {
  const normalized = normalizeGameSlug(slug) as RetiredCatalogueGameSlug;
  return RETIRED_CATALOGUE_REDIRECT_TARGETS[normalized] ?? null;
}

export function isRetiredCatalogueGameSlug(slug: string | null | undefined) {
  return Boolean(getRetiredCatalogueRedirectTarget(slug));
}

export function getGameRedirectTarget(slug: string | null | undefined) {
  return getRemovedGameRedirectTarget(slug) ?? getRetiredCatalogueRedirectTarget(slug);
}

export function isCoreIndexableGame(slug: string | null | undefined) {
  const normalized = normalizeGameSlug(slug);
  return CORE_INDEXABLE_GAME_SLUG_SET.has(normalized) && !isGameUnderManualReview(normalized);
}

export function shouldIncludeGameInSitemap(slug: string | null | undefined) {
  return isCoreIndexableGame(slug);
}

export function shouldNoIndexGame(slug: string | null | undefined) {
  return !isCoreIndexableGame(slug) || isGameUnderManualReview(slug);
}

export function shouldPromoteGameInCollections(slug: string | null | undefined) {
  return isCoreIndexableGame(slug);
}

export function canRenderGameIframe(slug: string | null | undefined) {
  return !isGameUnderManualReview(slug);
}

export function getGameQualityTier(slug: string | null | undefined) {
  if (isGameUnderManualReview(slug)) return 'review' as const;
  if (isCoreIndexableGame(slug)) return 'core-indexed' as const;
  return 'catalogue-only' as const;
}
