import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';

/**
 * 游戏分类表
 * 如：动作、益智、冒险等
 */
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),

  // 分类名称（中英文）
  name: varchar('name', { length: 100 }).notNull().unique(),
  nameEn: varchar('name_en', { length: 100 }),

  // URL友好标识
  slug: varchar('slug', { length: 100 }).notNull().unique(),

  // 分类描述
  description: text('description'),
  descriptionEn: text('description_en'),

  // 图标
  iconUrl: varchar('icon_url', { length: 500 }),

  // 时间戳
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
