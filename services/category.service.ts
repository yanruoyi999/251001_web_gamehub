import { db } from '@/lib/db';
import { categories } from '@/db/schema';
import { asc } from 'drizzle-orm';

export class CategoryService {
  static async listAll() {
    return db
      .select({
        id: categories.id,
        name: categories.name,
        nameEn: categories.nameEn,
        slug: categories.slug,
      })
      .from(categories)
      .orderBy(asc(categories.name));
  }
}
