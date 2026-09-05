import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { APPROVED_CATALOGUE_SOURCES, isCompleteSourceEvidence, hasReviewedCatalogueSource, type CatalogueSourceEvidence } from '@/lib/games/source-evidence';

const example: CatalogueSourceEvidence = {
  slug: 'test-fixture-only', iframeUrl: 'https://example.test/game', sourcePageUrl: 'https://example.test/permission',
  author: 'Test fixture, not a real license', license: 'fixture', sourceRevision: 'fixture-1',
  evidencePath: 'docs/licenses/fixture.md', reviewedAt: '2026-09-05', playableCheckedAt: '2026-09-05',
  commercialUse: true, embeddingAllowed: true, status: 'approved',
};
describe('reviewed source records', () => {
  it('keeps the legacy snapshot frozen instead of silently grandfathering future imports', () => {
    const raw = readFileSync('lib/games/legacy-sources-20260905.json');
    expect(createHash('sha256').update(raw).digest('hex')).toBe('be996c4b568278651dee97651a9ea028f24001b0915aca1fd73c07e6f3293e7d');
  });
  it('requires complete evidence and an exact identity match', () => {
    expect(isCompleteSourceEvidence(example)).toBe(true);
    for (const field of ['author', 'sourceRevision', 'license', 'evidencePath', 'reviewedAt', 'playableCheckedAt']) {
      expect(isCompleteSourceEvidence({ ...example, [field]: '' })).toBe(false);
    }
    expect(hasReviewedCatalogueSource(example, [example])).toBe(true);
    expect(hasReviewedCatalogueSource({ ...example, iframeUrl: 'https://example.test/new' }, [example])).toBe(false);
    expect(hasReviewedCatalogueSource({ ...example, embedPermissionStatus: 'blocked' }, [example])).toBe(false);
    expect(hasReviewedCatalogueSource(example)).toBe(false); // Fixture is never in the published registry.
  });
  it('requires every published approval to point to an actual checked-in evidence file', () => {
    for (const record of APPROVED_CATALOGUE_SOURCES) {
      expect(isCompleteSourceEvidence(record)).toBe(true);
      expect(existsSync(record.evidencePath)).toBe(true);
    }
  });
});
