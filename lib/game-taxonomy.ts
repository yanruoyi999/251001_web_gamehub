import { mockGames, type MockCategory, type MockGame, type MockTag } from '@/lib/mock-games';
import { shouldPromoteGameInCollections } from '@/lib/games/quality-policy';

export interface TaxonomyEntry<TItem> {
  item: TItem;
  games: MockGame[];
}

function buildTaxonomyEntries<TItem extends { slug: string }>(
  pickItems: (game: MockGame) => TItem[],
): TaxonomyEntry<TItem>[] {
  const entries = new Map<string, TaxonomyEntry<TItem>>();

  for (const game of mockGames.filter((item) => shouldPromoteGameInCollections(item.slug))) {
    for (const item of pickItems(game)) {
      const existing = entries.get(item.slug);
      if (existing) {
        existing.games.push(game);
      } else {
        entries.set(item.slug, { item, games: [game] });
      }
    }
  }

  return Array.from(entries.values()).sort((left, right) =>
    left.item.slug.localeCompare(right.item.slug),
  );
}

export function getCategoryEntries(): TaxonomyEntry<MockCategory>[] {
  return buildTaxonomyEntries((game) => game.categories);
}

export function getTagEntries(): TaxonomyEntry<MockTag>[] {
  return buildTaxonomyEntries((game) => game.tags);
}

export function getCategoryEntry(slug: string): TaxonomyEntry<MockCategory> | undefined {
  const normalized = slug.trim().toLowerCase();
  return getCategoryEntries().find((entry) => entry.item.slug === normalized);
}

export function getTagEntry(slug: string): TaxonomyEntry<MockTag> | undefined {
  const normalized = slug.trim().toLowerCase();
  return getTagEntries().find((entry) => entry.item.slug === normalized);
}

export function pickLocalizedLabel(
  locale: string,
  primary?: string | null,
  english?: string | null,
): string {
  return locale === 'en'
    ? english?.trim() || primary?.trim() || ''
    : primary?.trim() || english?.trim() || '';
}
