const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * 根据标题生成 URL 友好的 slug
 */
export function generateSlug(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * 验证 slug 格式
 */
export function isValidSlug(slug: string): boolean {
  return SLUG_REGEX.test(slug);
}

/**
 * 如果 slug 已存在，则在末尾追加数字后缀，直到唯一
 */
export function ensureUniqueSlug(slug: string, existingSlugs: string[]): string {
  if (!existingSlugs.includes(slug)) {
    return slug;
  }

  let counter = 2;
  let candidate = `${slug}-${counter}`;
  while (existingSlugs.includes(candidate)) {
    counter += 1;
    candidate = `${slug}-${counter}`;
  }

  return candidate;
}
