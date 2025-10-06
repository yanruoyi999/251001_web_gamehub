/**
 * External Services Verification Script
 *
 * 验证所有外部服务的连接状态
 * - PostgreSQL 数据库
 * - Upstash Redis
 * - Meilisearch
 * - Cloudinary
 *
 * 运行: pnpm verify:services
 */

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { verifyRedisConnection } from '../lib/redis';
import { verifyMeilisearchConnection, checkIndexExists } from '../lib/meilisearch';
import { verifyCloudinaryConnection, CLOUDINARY_PRESETS } from '../lib/cloudinary';

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

function success(msg: string) {
  console.log(`${colors.green}✅ ${msg}${colors.reset}`);
}

function error(msg: string) {
  console.log(`${colors.red}❌ ${msg}${colors.reset}`);
}

function warning(msg: string) {
  console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`);
}

function info(msg: string) {
  console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`);
}

interface ServiceStatus {
  name: string;
  status: 'success' | 'error' | 'warning' | 'skipped';
  message: string;
  optional?: boolean;
}

const results: ServiceStatus[] = [];

/**
 * 验证 PostgreSQL 数据库连接
 */
async function verifyPostgreSQL(): Promise<ServiceStatus> {
  try {
    if (!process.env.DATABASE_URL) {
      return {
        name: 'PostgreSQL',
        status: 'error',
        message: 'DATABASE_URL not configured',
      };
    }

    const client = postgres(process.env.DATABASE_URL);
    const db = drizzle(client);

    // 测试查询
    await client`SELECT 1`;
    await client.end();

    return {
      name: 'PostgreSQL',
      status: 'success',
      message: 'Connection successful',
    };
  } catch (err) {
    return {
      name: 'PostgreSQL',
      status: 'error',
      message: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * 验证 Upstash Redis 连接
 */
async function verifyRedis(): Promise<ServiceStatus> {
  try {
    if (!process.env.UPSTASH_REDIS_URL || !process.env.UPSTASH_REDIS_TOKEN) {
      return {
        name: 'Upstash Redis',
        status: 'warning',
        message: 'Redis not configured (optional, caching will be degraded)',
        optional: true,
      };
    }

    const isConnected = await verifyRedisConnection();

    if (!isConnected) {
      return {
        name: 'Upstash Redis',
        status: 'error',
        message: 'Connection failed',
      };
    }

    return {
      name: 'Upstash Redis',
      status: 'success',
      message: 'Connection successful (PONG received)',
    };
  } catch (err) {
    return {
      name: 'Upstash Redis',
      status: 'error',
      message: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * 验证 Meilisearch 连接
 */
async function verifyMeilisearch(): Promise<ServiceStatus> {
  try {
    if (!process.env.MEILISEARCH_HOST) {
      return {
        name: 'Meilisearch',
        status: 'warning',
        message: 'Meilisearch not configured (optional, search will be degraded)',
        optional: true,
      };
    }

    const isConnected = await verifyMeilisearchConnection();

    if (!isConnected) {
      return {
        name: 'Meilisearch',
        status: 'error',
        message: 'Connection failed',
      };
    }

    // 检查游戏索引是否存在
    const indexExists = await checkIndexExists('games');

    if (!indexExists) {
      return {
        name: 'Meilisearch',
        status: 'warning',
        message: 'Connected, but "games" index not found. Run setup script to create it.',
      };
    }

    return {
      name: 'Meilisearch',
      status: 'success',
      message: 'Connection successful, "games" index exists',
    };
  } catch (err) {
    return {
      name: 'Meilisearch',
      status: 'error',
      message: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * 验证 Cloudinary 连接
 */
async function verifyCloudinary(): Promise<ServiceStatus> {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET) {
      return {
        name: 'Cloudinary',
        status: 'warning',
        message: 'Cloudinary not configured (optional, image uploads will fail)',
        optional: true,
      };
    }

    const isConnected = await verifyCloudinaryConnection();

    if (!isConnected) {
      return {
        name: 'Cloudinary',
        status: 'error',
        message: 'Connection failed (check credentials)',
      };
    }

    // 提示需要手动创建 Presets
    const presets = [
      CLOUDINARY_PRESETS.THUMBNAIL,
      CLOUDINARY_PRESETS.SCREENSHOT,
      CLOUDINARY_PRESETS.ICON,
    ];

    return {
      name: 'Cloudinary',
      status: 'success',
      message: `Connection successful. Required presets: ${presets.join(', ')}`,
    };
  } catch (err) {
    return {
      name: 'Cloudinary',
      status: 'error',
      message: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('\n🔍 Verifying External Services...\n');

  // 验证所有服务
  results.push(await verifyPostgreSQL());
  results.push(await verifyRedis());
  results.push(await verifyMeilisearch());
  results.push(await verifyCloudinary());

  // 输出结果
  console.log('\n📊 Verification Results:\n');

  let hasError = false;
  let hasWarning = false;

  for (const result of results) {
    const icon =
      result.status === 'success'
        ? '✅'
        : result.status === 'warning'
        ? '⚠️ '
        : result.status === 'error'
        ? '❌'
        : '⏭️ ';

    const color =
      result.status === 'success'
        ? colors.green
        : result.status === 'warning'
        ? colors.yellow
        : result.status === 'error'
        ? colors.red
        : colors.blue;

    console.log(`${color}${icon} ${result.name}: ${result.message}${colors.reset}`);

    if (result.status === 'error' && !result.optional) {
      hasError = true;
    }
    if (result.status === 'warning') {
      hasWarning = true;
    }
  }

  // 最终总结
  console.log('\n' + '='.repeat(60) + '\n');

  if (hasError) {
    error('Some required services failed verification');
    console.log('\n💡 Next steps:');
    console.log('1. Check your .env.local file');
    console.log('2. Make sure all required services are running');
    console.log('3. Verify credentials are correct\n');
    process.exit(1);
  } else if (hasWarning) {
    warning('All required services OK, but some optional services are not configured');
    console.log('\n💡 Optional services can be configured later for enhanced features.\n');
    process.exit(0);
  } else {
    success('All services verified successfully!');
    console.log('\n🚀 You are ready to start development!\n');
    process.exit(0);
  }
}

// 运行验证
main().catch((err) => {
  error(`Verification failed: ${err.message}`);
  process.exit(1);
});
