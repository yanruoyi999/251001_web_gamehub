/**
 * 数据库客户端配置
 * 使用 Drizzle ORM + Neon PostgreSQL
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/db/schema';

// 数据库连接字符串
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'DATABASE_URL environment variable is not set. Please add it to your .env.local file.'
  );
}

// 创建 PostgreSQL 客户端
// 在生产环境中使用连接池
const client = postgres(connectionString, {
  max: process.env.NODE_ENV === 'production' ? 10 : 1,
  idle_timeout: 20,
  connect_timeout: 10,
});

// 创建 Drizzle 实例
export const db = drizzle(client, { schema });

/**
 * 关闭数据库连接
 * 主要用于脚本执行后清理
 */
export async function closeConnection() {
  await client.end();
}

// 导出 schema 以便在其他地方使用
export { schema };
