import { relations } from 'drizzle-orm';
import { games } from './games';
import { gameStats } from './stats';
import { gameCategories, gameTags } from './relations';
import { categories } from './categories';
import { tags } from './tags';
import { screenshots } from './screenshots';
import { ratings } from './ratings';
import { playCounters } from './counters';
import { favorites } from './favorites';

export const gamesRelations = relations(games, ({ one, many }) => ({
  gameStats: one(gameStats, {
    fields: [games.id],
    references: [gameStats.gameId],
  }),
  gameCategories: many(gameCategories),
  gameTags: many(gameTags),
  screenshots: many(screenshots),
  ratings: many(ratings),
  playCounters: many(playCounters),
  favorites: many(favorites),
}));

export const gameStatsRelations = relations(gameStats, ({ one }) => ({
  game: one(games, {
    fields: [gameStats.gameId],
    references: [games.id],
  }),
}));

export const gameCategoriesRelations = relations(gameCategories, ({ one }) => ({
  game: one(games, {
    fields: [gameCategories.gameId],
    references: [games.id],
  }),
  category: one(categories, {
    fields: [gameCategories.categoryId],
    references: [categories.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  gameCategories: many(gameCategories),
}));

export const gameTagsRelations = relations(gameTags, ({ one }) => ({
  game: one(games, {
    fields: [gameTags.gameId],
    references: [games.id],
  }),
  tag: one(tags, {
    fields: [gameTags.tagId],
    references: [tags.id],
  }),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  gameTags: many(gameTags),
}));

export const screenshotsRelations = relations(screenshots, ({ one }) => ({
  game: one(games, {
    fields: [screenshots.gameId],
    references: [games.id],
  }),
}));

export const ratingsRelations = relations(ratings, ({ one }) => ({
  game: one(games, {
    fields: [ratings.gameId],
    references: [games.id],
  }),
}));

export const playCountersRelations = relations(playCounters, ({ one }) => ({
  game: one(games, {
    fields: [playCounters.gameId],
    references: [games.id],
  }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  game: one(games, {
    fields: [favorites.gameId],
    references: [games.id],
  }),
}));
