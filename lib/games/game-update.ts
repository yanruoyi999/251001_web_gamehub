import { isValidHttpsUrl, isValidUrl } from '@/lib/utils/validation';
import { isValidSlug } from '@/lib/utils/slug';

const GAME_STATUSES = new Set(['active', 'inactive', 'pending']);

export interface UpdateGameInput {
  title?: string;
  titleEn?: string | null;
  description?: string | null;
  descriptionEn?: string | null;
  instructions?: string | null;
  instructionsEn?: string | null;
  thumbnailUrl?: string | null;
  iframeUrl?: string;
  slug?: string;
  featured?: boolean;
  isNew?: boolean;
  isHot?: boolean;
  status?: 'active' | 'inactive' | 'pending';
  developerName?: string | null;
  developerUrl?: string | null;
  sourceUrl?: string | null;
  categoryIds?: number[];
  tagIds?: number[];
}

export type GameScalarUpdateInput = Omit<
  UpdateGameInput,
  'categoryIds' | 'tagIds'
>;

export interface NormalizedGameUpdateInput {
  scalarUpdates: GameScalarUpdateInput;
  categoryIds?: number[];
  tagIds?: number[];
}

function hasOwn(record: Record<string, unknown>, key: string) {
  return Object.prototype.hasOwnProperty.call(record, key);
}

function normalizeRequiredString(
  value: unknown,
  field: string,
  maxLength?: number
) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${field} must be a non-empty string`);
  }

  const normalized = value.trim();
  if (maxLength && normalized.length > maxLength) {
    throw new Error(`${field} must be ${maxLength} characters or fewer`);
  }
  return normalized;
}

function normalizeNullableString(
  value: unknown,
  field: string,
  maxLength?: number
) {
  if (value === null) return null;
  if (typeof value !== 'string') {
    throw new Error(`${field} must be a string or null`);
  }

  const normalized = value.trim();
  if (!normalized) return null;
  if (maxLength && normalized.length > maxLength) {
    throw new Error(`${field} must be ${maxLength} characters or fewer`);
  }
  return normalized;
}

function normalizeRelationIds(value: unknown, field: string) {
  if (!Array.isArray(value)) {
    throw new Error(`${field} must be an array`);
  }

  const ids = value.map(item => Number(item));
  if (ids.some(id => !Number.isInteger(id) || id <= 0)) {
    throw new Error(`${field} must contain only positive integer IDs`);
  }

  return Array.from(new Set(ids));
}

function isSafeAssetUrl(value: string) {
  return (
    (value.startsWith('/') && !value.startsWith('//')) || isValidUrl(value)
  );
}

export function normalizeGameUpdateInput(
  input: unknown
): NormalizedGameUpdateInput {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Game update payload must be an object');
  }

  const record = input as Record<string, unknown>;
  const scalarUpdates: GameScalarUpdateInput = {};

  if (hasOwn(record, 'title')) {
    scalarUpdates.title = normalizeRequiredString(record.title, 'title', 255);
  }

  for (const field of [
    'titleEn',
    'description',
    'descriptionEn',
    'instructions',
    'instructionsEn',
  ] as const) {
    if (hasOwn(record, field)) {
      scalarUpdates[field] = normalizeNullableString(
        record[field],
        field,
        field === 'titleEn' ? 255 : undefined
      );
    }
  }

  if (hasOwn(record, 'slug')) {
    const slug = normalizeRequiredString(
      record.slug,
      'slug',
      255
    ).toLowerCase();
    if (!isValidSlug(slug)) {
      throw new Error('Invalid slug format');
    }
    scalarUpdates.slug = slug;
  }

  if (hasOwn(record, 'iframeUrl')) {
    const iframeUrl = normalizeRequiredString(
      record.iframeUrl,
      'iframeUrl',
      500
    );
    if (!isValidUrl(iframeUrl)) {
      throw new Error('Invalid iframe URL');
    }
    scalarUpdates.iframeUrl = iframeUrl;
  }

  if (hasOwn(record, 'thumbnailUrl')) {
    const thumbnailUrl = normalizeNullableString(
      record.thumbnailUrl,
      'thumbnailUrl',
      500
    );
    if (thumbnailUrl && !isSafeAssetUrl(thumbnailUrl)) {
      throw new Error('Invalid thumbnail URL');
    }
    scalarUpdates.thumbnailUrl = thumbnailUrl;
  }

  if (hasOwn(record, 'developerName')) {
    scalarUpdates.developerName = normalizeNullableString(
      record.developerName,
      'developerName',
      255
    );
  }

  for (const field of ['developerUrl', 'sourceUrl'] as const) {
    if (hasOwn(record, field)) {
      const url = normalizeNullableString(record[field], field, 500);
      if (url && !isValidHttpsUrl(url)) {
        throw new Error(`${field} must be a valid HTTPS link`);
      }
      scalarUpdates[field] = url;
    }
  }

  for (const field of ['featured', 'isNew', 'isHot'] as const) {
    if (hasOwn(record, field)) {
      if (typeof record[field] !== 'boolean') {
        throw new Error(`${field} must be a boolean`);
      }
      scalarUpdates[field] = record[field];
    }
  }

  if (hasOwn(record, 'status')) {
    if (
      typeof record.status !== 'string' ||
      !GAME_STATUSES.has(record.status)
    ) {
      throw new Error('Invalid game status');
    }
    scalarUpdates.status = record.status as UpdateGameInput['status'];
  }

  const categoryIds = hasOwn(record, 'categoryIds')
    ? normalizeRelationIds(record.categoryIds, 'categoryIds')
    : undefined;
  const tagIds = hasOwn(record, 'tagIds')
    ? normalizeRelationIds(record.tagIds, 'tagIds')
    : undefined;

  if (
    Object.keys(scalarUpdates).length === 0 &&
    categoryIds === undefined &&
    tagIds === undefined
  ) {
    throw new Error('No valid fields provided');
  }

  return { scalarUpdates, categoryIds, tagIds };
}
