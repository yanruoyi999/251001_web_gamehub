import { db } from '@/lib/db';
import { tags } from '@/db/schema';
import { asc } from 'drizzle-orm';

export class TagService {
  static async listAll() {
    return db
      .select({
        id: tags.id,
        name: tags.name,
        nameEn: tags.nameEn,
        slug: tags.slug,
      })
      .from(tags)
      .orderBy(asc(tags.name));
  }
}
