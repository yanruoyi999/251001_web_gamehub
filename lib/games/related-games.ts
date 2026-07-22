import { shouldPromoteGameInCollections } from '@/lib/games/quality-policy';

interface RelatedGameCandidate {
  slug: string;
  categories: Array<{ slug: string }>;
  tags: Array<{ slug: string }>;
}

const RELATED_GAME_OVERRIDES: Record<string, string[]> = {
  'google-snake': ['g-switch-2', 'ovo', 'tunnel-rush'],
};

export function getRelatedGames<T extends RelatedGameCandidate>(
  current: RelatedGameCandidate,
  candidates: T[],
  limit = 3,
): T[] {
  const override = RELATED_GAME_OVERRIDES[current.slug];
  if (override) {
    const bySlug = new Map(candidates.map((candidate) => [candidate.slug, candidate]));
    return override
      .map((slug) => bySlug.get(slug))
      .filter(
        (candidate): candidate is T =>
          Boolean(candidate && shouldPromoteGameInCollections(candidate.slug)),
      )
      .slice(0, limit);
  }

  const categorySlugs = new Set(current.categories.map((category) => category.slug));
  const tagSlugs = new Set(current.tags.map((tag) => tag.slug));

  return candidates
    .filter((candidate) => {
      if (candidate.slug === current.slug) return false;
      if (!shouldPromoteGameInCollections(candidate.slug)) return false;
      return (
        candidate.categories.some((category) => categorySlugs.has(category.slug)) ||
        candidate.tags.some((tag) => tagSlugs.has(tag.slug))
      );
    })
    .slice(0, limit);
}
