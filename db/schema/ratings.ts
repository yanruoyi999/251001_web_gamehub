import { pgTable, serial, integer, text, varchar, timestamp, check, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { games } from './games';

/**
 * 游戏评分表
 * 存储用户对游戏的评分和评论
 */
export const ratings = pgTable('ratings', {
  id: serial('id').primaryKey(),

  // 关联游戏
  gameId: integer('game_id')
    .notNull()
    .references(() => games.id, { onDelete: 'cascade' }),

  // 评分（1-5星，有范围约束）
  rating: integer('rating').notNull(),

  // 评论
  comment: text('comment'),

  // 用户标识（防刷机制）
  userIpHash: varchar('user_ip_hash', { length: 64 }), // SHA-256 哈希，不存明文IP
  anonymousToken: varchar('anonymous_token', { length: 128 }), // 浏览器指纹或随机token
  userAgent: varchar('user_agent', { length: 500 }),

  // 审核状态
  status: varchar('status', { length: 20 }).default('pending'), // pending, approved, rejected

  // 时间戳
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  // 评分范围约束：1-5星
  ratingCheck: check('ratings_rating_check', sql`${table.rating} >= 1 AND ${table.rating} <= 5`),
  // 加快按游戏查询
  gameIdIdx: index('ratings_game_id_idx').on(table.gameId),
  // 加快防刷查询（基于哈希）
  userIpHashIdx: index('ratings_user_ip_hash_idx').on(table.userIpHash),
}));

export type Rating = typeof ratings.$inferSelect;
export type NewRating = typeof ratings.$inferInsert;
