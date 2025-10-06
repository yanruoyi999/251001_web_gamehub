import { pgTable, serial, integer, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { games } from './games';
import { categories } from './categories';
import { tags } from './tags';

/**
 * 游戏-分类关联表（多对多）
 * 一个游戏可以属于多个分类
 */
export const gameCategories = pgTable('game_categories', {
  id: serial('id').primaryKey(),

  gameId: integer('game_id')
    .notNull()
    .references(() => games.id, { onDelete: 'cascade' }),

  categoryId: integer('category_id')
    .notNull()
    .references(() => categories.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  // 防止重复关联：同一个游戏不能重复关联同一个分类
  gameCategoryIdx: uniqueIndex('game_categories_game_category_idx').on(table.gameId, table.categoryId),
}));

/**
 * 游戏-标签关联表（多对多）
 * 一个游戏可以有多个标签
 */
export const gameTags = pgTable('game_tags', {
  id: serial('id').primaryKey(),

  gameId: integer('game_id')
    .notNull()
    .references(() => games.id, { onDelete: 'cascade' }),

  tagId: integer('tag_id')
    .notNull()
    .references(() => tags.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  // 防止重复关联：同一个游戏不能重复关联同一个标签
  gameTagIdx: uniqueIndex('game_tags_game_tag_idx').on(table.gameId, table.tagId),
}));

export type GameCategory = typeof gameCategories.$inferSelect;
export type NewGameCategory = typeof gameCategories.$inferInsert;
export type GameTag = typeof gameTags.$inferSelect;
export type NewGameTag = typeof gameTags.$inferInsert;
