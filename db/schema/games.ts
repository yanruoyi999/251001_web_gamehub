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

  // Legacy SEO/source fields kept for compatibility. They are not rights evidence.
  developerName: varchar('developer_name', { length: 255 }),
  developerUrl: varchar('developer_url', { length: 500 }),
  sourceUrl: varchar('source_url', { length: 500 }),

  // Auditable provenance and rights metadata. Missing values fail closed.
  originalDeveloper: varchar('original_developer', { length: 255 }),
  rightsHolder: varchar('rights_holder', { length: 255 }),
  officialGameUrl: varchar('official_game_url', { length: 500 }),
  distributionProvider: varchar('distribution_provider', { length: 255 }),
  licenseType: varchar('license_type', { length: 100 }),
  licenseUrl: varchar('license_url', { length: 500 }),
  commercialUseAllowed: boolean('commercial_use_allowed'),
  embedPermissionStatus: varchar('embed_permission_status', { length: 20 }).default('unknown'),
  adsAllowed: boolean('ads_allowed'),
  screenshotPermission: varchar('screenshot_permission', { length: 20 }).default('unknown'),
  thumbnailPermission: varchar('thumbnail_permission', { length: 20 }).default('unknown'),
  verificationEvidence: text('verification_evidence'),
  rightsVerifiedAt: timestamp('rights_verified_at'),

  // 分类标记
  featured: boolean('featured').default(false),
  isNew: boolean('is_new').default(true),
  isHot: boolean('is_hot').default(false),

  // 状态
  status: varchar('status', { length: 20 }).default('active'),

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
