import { pgTable, serial, integer, date, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { games } from './games';

/**
 * 游戏播放计数表
 * 用于同步 Redis 缓存的播放次数到数据库
 * 按日期统计每个游戏的播放次数
 */
export const playCounters = pgTable('play_counters', {
  id: serial('id').primaryKey(),

  // 关联游戏
  gameId: integer('game_id')
    .notNull()
    .references(() => games.id, { onDelete: 'cascade' }),

  // 统计日期
  date: date('date').notNull(),

  // 当天播放次数
  count: integer('count').default(0).notNull(),

  // 时间戳
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  // 防止重复：同一个游戏在同一天只能有一条记录
  gameDateIdx: uniqueIndex('play_counters_game_date_idx').on(table.gameId, table.date),
}));

export type PlayCounter = typeof playCounters.$inferSelect;
export type NewPlayCounter = typeof playCounters.$inferInsert;
