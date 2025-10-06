import { pgTable, serial, integer, decimal, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { games } from './games';

/**
 * 游戏统计数据表
 * 存储游戏的可变统计信息，与主表分离以提升性能
 */
export const gameStats = pgTable('game_stats', {
  id: serial('id').primaryKey(),

  // 关联游戏（一对一）
  gameId: integer('game_id')
    .notNull()
    .unique()
    .references(() => games.id, { onDelete: 'cascade' }),

  // 播放统计
  playCount: integer('play_count').default(0).notNull(),
  playCountToday: integer('play_count_today').default(0).notNull(),
  playCountWeek: integer('play_count_week').default(0).notNull(),
  playCountMonth: integer('play_count_month').default(0).notNull(),

  // 评分统计
  averageRating: decimal('average_rating', { precision: 3, scale: 2 }).default('0'),
  ratingCount: integer('rating_count').default(0).notNull(),
  rating1Star: integer('rating_1_star').default(0).notNull(),
  rating2Star: integer('rating_2_star').default(0).notNull(),
  rating3Star: integer('rating_3_star').default(0).notNull(),
  rating4Star: integer('rating_4_star').default(0).notNull(),
  rating5Star: integer('rating_5_star').default(0).notNull(),

  // 热度分数（综合算法计算）
  hotScore: integer('hot_score').default(0).notNull(),

  // 最后播放/评分时间
  lastPlayedAt: timestamp('last_played_at'),
  lastRatedAt: timestamp('last_rated_at'),

  // 时间戳
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  gameIdIdx: uniqueIndex('game_stats_game_id_idx').on(table.gameId),
}));

export type GameStats = typeof gameStats.$inferSelect;
export type NewGameStats = typeof gameStats.$inferInsert;
