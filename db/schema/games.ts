import { pgTable, serial, varchar, text, integer, boolean, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

/**
 * 游戏主表
 * 存储游戏的核心信息（不含统计数据）
 */
export const games = pgTable('games', {
  id: serial('id').primaryKey(),

  // URL 标识（SEO）
  slug: varchar('slug', { length: 255 }).notNull().unique(),

  // 基本信息（中英文）
  title: varchar('title', { length: 255 }).notNull(),
  titleEn: varchar('title_en', { length: 255 }),
  description: text('description'),
  descriptionEn: text('description_en'),

  // 游戏玩法说明
  instructions: text('instructions'),
  instructionsEn: text('instructions_en'),

  // 游戏资源
  thumbnailUrl: varchar('thumbnail_url', { length: 500 }),
  iframeUrl: varchar('iframe_url', { length: 500 }).notNull(),

  // SEO 外链字段
  developerName: varchar('developer_name', { length: 255 }), // 开发者名称
  developerUrl: varchar('developer_url', { length: 500 }), // 开发者官网
  sourceUrl: varchar('source_url', { length: 500 }), // 游戏原始链接/官方页面

  // 分类标记
  featured: boolean('featured').default(false), // 精选游戏
  isNew: boolean('is_new').default(true), // 新游戏（可通过定时任务自动更新）
  isHot: boolean('is_hot').default(false), // 热门游戏（根据统计数据计算）

  // 状态
  status: varchar('status', { length: 20 }).default('active'), // active, inactive, pending

  // 发布时间
  publishedAt: timestamp('published_at').defaultNow().notNull(),

  // 时间戳
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  slugIdx: uniqueIndex('games_slug_idx').on(table.slug),
}));

export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;
