import { db } from '@/lib/db';
import { categories } from '@/db/schema';
import { asc } from 'drizzle-orm';
import { TaxonomyCacheKeys, CacheTTL } from '@/lib/utils/cache-keys';
import { getJson, setJson } from '@/lib/utils/redis-helper';
import { getRedisClient } from '@/lib/redis';
import { isNextProductionBuild } from '@/lib/utils/build-phase';

export class CategoryService {
  static async listAll() {
    if (isNextProductionBuild()) {
      throw new Error('Skipping category database load during production build');
    }

    const cacheKey = TaxonomyCacheKeys.categories();
    const cached = await getJson<CategoryListItem[]>(getRedisClient(), cacheKey);
    if (cached) return cached;

    const rows = await db
      .select({
        id: categories.id,
        name: categories.name,
        nameEn: categories.nameEn,
        slug: categories.slug,
      })
      .from(categories)
      .orderBy(asc(categories.name));

    await setJson(getRedisClient(), cacheKey, rows, CacheTTL.TAXONOMY);
    return rows;
  }
}

type CategoryListItem = {
  id: number;
  name: string;
  nameEn: string | null;
  slug: string;
};
