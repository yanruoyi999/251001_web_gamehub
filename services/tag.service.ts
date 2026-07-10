import { db } from '@/lib/db';
import { tags } from '@/db/schema';
import { asc } from 'drizzle-orm';
import { TaxonomyCacheKeys, CacheTTL } from '@/lib/utils/cache-keys';
import { getJson, setJson } from '@/lib/utils/redis-helper';
import { getRedisClient } from '@/lib/redis';
import { isNextProductionBuild } from '@/lib/utils/build-phase';

export class TagService {
  static async listAll() {
    if (isNextProductionBuild()) {
      throw new Error('Skipping tag database load during production build');
    }

    const cacheKey = TaxonomyCacheKeys.tags();
    const cached = await getJson<TagListItem[]>(getRedisClient(), cacheKey);
    if (cached) return cached;

    const rows = await db
      .select({
        id: tags.id,
        name: tags.name,
        nameEn: tags.nameEn,
        slug: tags.slug,
      })
      .from(tags)
      .orderBy(asc(tags.name));

    await setJson(getRedisClient(), cacheKey, rows, CacheTTL.TAXONOMY);
    return rows;
  }
}

type TagListItem = {
  id: number;
  name: string;
  nameEn: string | null;
  slug: string;
};
