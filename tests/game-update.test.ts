import { describe, expect, it } from 'vitest';

import { normalizeGameUpdateInput } from '@/lib/games/game-update';

describe('normalizeGameUpdateInput', () => {
  it('keeps explicit nulls so optional admin fields can be cleared', () => {
    const result = normalizeGameUpdateInput({
      description: null,
      thumbnailUrl: null,
      developerName: null,
      developerUrl: null,
      sourceUrl: null,
      rightsHolder: null,
      licenseUrl: null,
      commercialUseAllowed: null,
      adsAllowed: null,
    });

    expect(result.scalarUpdates).toEqual({
      description: null,
      thumbnailUrl: null,
      developerName: null,
      developerUrl: null,
      sourceUrl: null,
      rightsHolder: null,
      licenseUrl: null,
      commercialUseAllowed: null,
      adsAllowed: null,
    });
  });

  it('separates and deduplicates relation IDs from game table columns', () => {
    const result = normalizeGameUpdateInput({
      title: '  Updated title  ',
      categoryIds: [3, '2', 3],
      tagIds: [],
    });

    expect(result.scalarUpdates).toEqual({ title: 'Updated title' });
    expect(result.categoryIds).toEqual([3, 2]);
    expect(result.tagIds).toEqual([]);
    expect(result.scalarUpdates).not.toHaveProperty('categoryIds');
    expect(result.scalarUpdates).not.toHaveProperty('tagIds');
  });

  it('normalizes slugs and accepts safe local thumbnail paths', () => {
    const result = normalizeGameUpdateInput({
      slug: '  Updated-Game  ',
      thumbnailUrl: '/games/updated.webp',
    });

    expect(result.scalarUpdates.slug).toBe('updated-game');
    expect(result.scalarUpdates.thumbnailUrl).toBe('/games/updated.webp');
  });

  it('requires evidence when an admin explicitly verifies embed permission', () => {
    expect(() =>
      normalizeGameUpdateInput({ embedPermissionStatus: 'verified' }),
    ).toThrow('verificationEvidence is required');

    const result = normalizeGameUpdateInput({
      originalDeveloper: 'Example Studio',
      rightsHolder: 'Example Studio',
      officialGameUrl: 'https://example.com/game',
      licenseType: 'publisher agreement',
      licenseUrl: 'https://example.com/license',
      commercialUseAllowed: true,
      embedPermissionStatus: 'verified',
      adsAllowed: true,
      screenshotPermission: 'verified',
      thumbnailPermission: 'verified',
      verificationEvidence: 'Publisher agreement reviewed on 2026-08-23.',
    });

    expect(result.scalarUpdates.embedPermissionStatus).toBe('verified');
    expect(result.scalarUpdates.verificationEvidence).toContain(
      'Publisher agreement',
    );
    expect(result.scalarUpdates.rightsVerifiedAt).toBeInstanceOf(Date);
  });

  it('clears verification timestamp when embed rights are downgraded', () => {
    const result = normalizeGameUpdateInput({
      embedPermissionStatus: 'expired',
    });

    expect(result.scalarUpdates.embedPermissionStatus).toBe('expired');
    expect(result.scalarUpdates.rightsVerifiedAt).toBeNull();
  });

  it('rejects unsafe URLs, invalid rights enums, and invalid relation IDs', () => {
    expect(() =>
      normalizeGameUpdateInput({ iframeUrl: 'javascript:alert(1)' }),
    ).toThrow('Invalid iframe URL');
    expect(() =>
      normalizeGameUpdateInput({ thumbnailUrl: '//evil.example/image.png' }),
    ).toThrow('Invalid thumbnail URL');
    expect(() =>
      normalizeGameUpdateInput({ officialGameUrl: 'http://example.com/game' }),
    ).toThrow('valid HTTPS link');
    expect(() =>
      normalizeGameUpdateInput({ embedPermissionStatus: 'probably' }),
    ).toThrow('Invalid embed permission status');
    expect(() =>
      normalizeGameUpdateInput({ screenshotPermission: 'link-only' }),
    ).toThrow('Invalid screenshotPermission');
    expect(() => normalizeGameUpdateInput({ categoryIds: [1, 0] })).toThrow(
      'positive integer IDs',
    );
  });

  it('rejects empty or unknown-only updates', () => {
    expect(() => normalizeGameUpdateInput({})).toThrow(
      'No valid fields provided',
    );
    expect(() => normalizeGameUpdateInput({ unexpected: true })).toThrow(
      'No valid fields provided',
    );
  });
});
