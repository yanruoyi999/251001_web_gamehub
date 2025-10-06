import { pgTable, serial, integer, varchar, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { games } from './games';

/**
 * 游戏收藏表
 * 使用 IP 哈希与匿名 Token 标识匿名用户
 */
export const favorites = pgTable(
  'favorites',
  {
    id: serial('id').primaryKey(),

    gameId: integer('game_id')
      .notNull()
      .references(() => games.id, { onDelete: 'cascade' }),

    userIpHash: varchar('user_ip_hash', { length: 64 }).notNull(),
    anonymousToken: varchar('anonymous_token', { length: 64 }).notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    userGameIdx: uniqueIndex('favorites_user_game_idx').on(
      table.gameId,
      table.userIpHash,
      table.anonymousToken
    ),
  })
);

export type Favorite = typeof favorites.$inferSelect;
export type NewFavorite = typeof favorites.$inferInsert;
