import { describe, expect, it, vi } from 'vitest';

import {
  INDEXNOW_KEY,
  buildIndexNowPayload,
  normalizeIndexNowUrls,
  submitIndexNow,
} from '@/lib/indexnow';

describe('IndexNow submission guard', () => {
  it('keeps only unique URLs on the configured site', () => {
    expect(
      normalizeIndexNowUrls([
        '/en/games/google-snake',
        'https://www.lumagamehub.com/en/games/google-snake',
        'https://www.lumagamehub.com/en/guides/telemount-walkthrough#controls',
        'https://example.com/copied-page',
      ]),
    ).toEqual([
      'https://www.lumagamehub.com/en/games/google-snake',
      'https://www.lumagamehub.com/en/guides/telemount-walkthrough',
    ]);
  });

  it('rejects a submission when no valid explicit URL remains', () => {
    expect(() => normalizeIndexNowUrls([])).toThrow(/explicit/i);
    expect(() => normalizeIndexNowUrls(['https://example.com/'])).toThrow(/same-site/i);
  });

  it('builds the documented IndexNow payload and public key location', () => {
    expect(buildIndexNowPayload(['/en/games/google-snake'])).toEqual({
      host: 'www.lumagamehub.com',
      key: INDEXNOW_KEY,
      keyLocation: `https://www.lumagamehub.com/${INDEXNOW_KEY}.txt`,
      urlList: ['https://www.lumagamehub.com/en/games/google-snake'],
    });
  });

  it('posts one validated JSON payload to the IndexNow endpoint', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(null, { status: 202 }));

    await expect(
      submitIndexNow(['/en/games/google-snake'], fetchImpl),
    ).resolves.toMatchObject({ status: 202, submitted: 1 });

    expect(fetchImpl).toHaveBeenCalledWith(
      'https://api.indexnow.org/indexnow',
      expect.objectContaining({
        method: 'POST',
        headers: { 'content-type': 'application/json' },
      }),
    );
  });
});
