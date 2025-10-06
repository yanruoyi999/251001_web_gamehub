/**
 * 数据库 Schema 统一导出
 * 包含所有表定义和类型
 */

// 核心表
export * from './games';
export * from './categories';
export * from './tags';
export * from './ratings';

// 统计表
export * from './stats';

// 关联表
export * from './relations';
export * from './relations.definition';
export * from './favorites';

// 辅助表
export * from './counters';
export * from './screenshots';
export * from './admin';

// 导入所有表以便在一个对象中导出
import { games } from './games';
import { categories } from './categories';
import { tags } from './tags';
import { ratings } from './ratings';
import { gameStats } from './stats';
import { gameCategories, gameTags } from './relations';
import { favorites } from './favorites';
import { playCounters } from './counters';
import { screenshots } from './screenshots';
import { adminLogs } from './admin';

/**
 * 所有表的集合
 * 用于 Drizzle 关系定义和查询
 */
export const schema = {
  games,
  categories,
  tags,
  ratings,
  gameStats,
  gameCategories,
  gameTags,
  favorites,
  playCounters,
  screenshots,
  adminLogs,
};
