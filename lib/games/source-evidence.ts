import legacy from './legacy-sources-20260905.json';

export interface CatalogueSourceIdentity {
  slug?: string | null;
  iframeUrl?: string | null;
  sourcePageUrl?: string | null;
  embedPermissionStatus?: 'verified' | 'unknown' | 'blocked' | null;
}

export interface CatalogueSourceEvidence {
  slug: string;
  iframeUrl: string;
  sourcePageUrl: string;
  author: string;
  license: string;
  sourceRevision: string;
  evidencePath: string;
  reviewedAt: string;
  playableCheckedAt: string;
  commercialUse: true;
  embeddingAllowed: true;
  status: 'approved';
}

// New catalogue sources are deliberately empty until documentary evidence and a
// playable check are reviewed. The independent self-hosted two-player registry
// retains its existing per-game license records; it is not an imported mirror.
export const APPROVED_CATALOGUE_SOURCES: readonly CatalogueSourceEvidence[] = [];
export const LEGACY_CATALOGUE_SOURCES = legacy.entries;
const legacyBySlug = new Map(legacy.entries.map((entry) => [entry.slug, entry]));

function validDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}

export function isCompleteSourceEvidence(record: CatalogueSourceEvidence) {
  return record.status === 'approved' && record.commercialUse === true && record.embeddingAllowed === true &&
    [record.author, record.license, record.sourceRevision].every((value) => typeof value === 'string' && value.trim().length > 0) &&
    /^docs\/licenses\/[a-zA-Z0-9_./-]+\.md$/.test(record.evidencePath) && !record.evidencePath.includes('..') &&
    /^https:\/\//.test(record.iframeUrl) && /^https:\/\//.test(record.sourcePageUrl) &&
    validDate(record.reviewedAt) && validDate(record.playableCheckedAt);
}

export function hasReviewedCatalogueSource(
  input: CatalogueSourceIdentity | null | undefined,
  records = APPROVED_CATALOGUE_SOURCES,
) {
  if (!input || input.embedPermissionStatus === 'blocked' || !input.iframeUrl) return false;
  return records.some((record) => isCompleteSourceEvidence(record) && record.slug === input.slug && record.iframeUrl === input.iframeUrl && record.sourcePageUrl === input.sourcePageUrl);
}

export function isLegacyCatalogueSlug(slug: string) {
  return legacyBySlug.has(slug);
}

export function hasFrozenLegacySource(input: CatalogueSourceIdentity) {
  const record = legacyBySlug.get(input.slug ?? '');
  return Boolean(record && input.embedPermissionStatus !== 'blocked' && input.iframeUrl === record.iframeUrl && (input.sourcePageUrl ?? null) === record.sourcePageUrl);
}

export function assertReviewedCatalogueSource(input: CatalogueSourceIdentity) {
  if (!hasReviewedCatalogueSource(input)) {
    throw new Error('Source approval required: register license evidence, author, pinned revision, review date and playable check before publishing a new or changed source');
  }
}
