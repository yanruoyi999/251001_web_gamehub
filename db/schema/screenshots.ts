import { pgTable, serial, integer, varchar, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { games } from './games';

/**
 * 游戏截图表
 * 存储游戏的多张截图/预览图
 */
export const screenshots = pgTable('screenshots', {
  id: serial('id').primaryKey(),

  // 关联游戏
  gameId: integer('game_id')
    .notNull()
    .references(() => games.id, { onDelete: 'cascade' }),

  // 截图 URL
  url: varchar('url', { length: 500 }).notNull(),

  // Cloudinary Public ID（用于删除/管理）
  publicId: varchar('public_id', { length: 255 }),

  // 排序顺序（同一游戏内的排序）
  order: integer('order').default(0).notNull(),

  // 时间戳
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  // 防止同一游戏的截图有相同的排序值
  gameOrderIdx: uniqueIndex('screenshots_game_order_idx').on(table.gameId, table.order),
}));

export type Screenshot = typeof screenshots.$inferSelect;
export type NewScreenshot = typeof screenshots.$inferInsert;
