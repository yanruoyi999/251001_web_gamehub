import { getMockGameBySlug } from '@/lib/mock-games';
import { DAILY_RECOMMENDATION_POOL } from '@/lib/retention/daily-recommendation';

export interface SavedGameSummary {
  id: number;
  slug: string;
  title: string;
  titleEn: string;
  thumbnailUrl: string;
}

const recommendationSummaries = new Map(
  DAILY_RECOMMENDATION_POOL.map(entry => [entry.slug, entry])
);

function fromRecommendation(slug: string): SavedGameSummary | null {
  const entry = recommendationSummaries.get(slug);
  if (!entry) return null;

  return {
    id: entry.gameId,
    slug: entry.slug,
    title: entry.title.zh,
    titleEn: entry.title.en,
    thumbnailUrl: entry.image,
  };
}

function fromMockGame(slug: string): SavedGameSummary | null {
  const game = getMockGameBySlug(slug);
  if (!game) return null;

  return {
    id: game.id,
    slug: game.slug,
    title: game.title,
    titleEn: game.titleEn,
    thumbnailUrl: game.thumbnailUrl,
  };
}

export function getSavedGameSummaries(slugs: readonly string[]) {
  return slugs
    .map(slug => slug.trim().toLowerCase())
    .filter(Boolean)
    .filter((slug, index, values) => values.indexOf(slug) === index)
    .map(slug => fromRecommendation(slug) ?? fromMockGame(slug))
    .filter((game): game is SavedGameSummary => Boolean(game));
}
