import { pgTable, serial, varchar, text, timestamp, jsonb, index } from 'drizzle-orm/pg-core';

/**
 * 管理员操作日志表
 * 记录所有管理后台的操作，用于审计
 */
export const adminLogs = pgTable('admin_logs', {
  id: serial('id').primaryKey(),

  // 操作者标识（管理员账号或会话ID）
  operator: varchar('operator', { length: 100 }).notNull(), // admin username or session ID

  // 操作类型
  action: varchar('action', { length: 50 }).notNull(), // create, update, delete, approve, reject, etc.

  // 操作的实体类型
  entityType: varchar('entity_type', { length: 50 }).notNull(), // game, category, tag, rating, etc.

  // 实体 ID
  entityId: varchar('entity_id', { length: 50 }),

  // 操作详情（JSON 格式）
  details: jsonb('details'),

  // 操作者信息
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: varchar('user_agent', { length: 500 }),

  // 时间戳
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  // 按操作者查询日志
  operatorIdx: index('admin_logs_operator_idx').on(table.operator),
  // 按实体类型+ID查询日志
  entityIdx: index('admin_logs_entity_idx').on(table.entityType, table.entityId),
  // 按时间查询日志
  createdAtIdx: index('admin_logs_created_at_idx').on(table.createdAt),
}));

export type AdminLog = typeof adminLogs.$inferSelect;
export type NewAdminLog = typeof adminLogs.$inferInsert;
