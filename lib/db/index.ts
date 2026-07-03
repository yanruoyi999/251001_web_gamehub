/**
 * 数据库客户端配置
 * 使用 Drizzle ORM + Neon PostgreSQL
 */

import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/db/schema';
import { getDatabaseConnectionMetadata } from './connection-policy';

type DatabaseClient = PostgresJsDatabase<typeof schema>;
type PostgresClient = ReturnType<typeof postgres>;

let client: PostgresClient | null = null;
let database: DatabaseClient | null = null;

function createDatabase(): DatabaseClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      'DATABASE_URL environment variable is not set. Please add it to your .env.local file.'
    );
  }

  const connection = getDatabaseConnectionMetadata(connectionString);
  if (connection.warning) {
    console.warn(connection.warning);
  }

  client = postgres(connectionString, {
    max: connection.maxConnections,
    idle_timeout: 20,
    connect_timeout: connection.connectTimeoutSeconds,
    prepare: connection.usePreparedStatements,
    ...(connection.requiresSsl ? { ssl: 'require' as const } : {}),
  });

  return drizzle(client, { schema });
}

export function getDb(): DatabaseClient {
  if (!database) {
    database = createDatabase();
  }

  return database;
}

export const db = new Proxy({} as DatabaseClient, {
  get(_target, property) {
    const activeDatabase = getDb();
    const value = Reflect.get(activeDatabase, property);
    return typeof value === 'function' ? value.bind(activeDatabase) : value;
  },
});

/**
 * 关闭数据库连接
 * 主要用于脚本执行后清理
 */
export async function closeConnection() {
  if (client) {
    await client.end();
    client = null;
    database = null;
  }
}

// 导出 schema 以便在其他地方使用
export { schema };
