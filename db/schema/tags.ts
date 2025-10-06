import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

/**
 * 游戏标签表
 * 如：多人、单人、3D、像素风等
 */
export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),

  // 标签名称（中英文）
  name: varchar('name', { length: 50 }).notNull().unique(),
  nameEn: varchar('name_en', { length: 50 }),

  // URL友好标识
  slug: varchar('slug', { length: 50 }).notNull().unique(),

  // 时间戳
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
