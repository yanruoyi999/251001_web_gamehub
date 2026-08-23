import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (file: string) =>
  readFileSync(path.join(process.cwd(), file), 'utf8');

describe('search rights policy', () => {
  it('requires verified embed rights in Meilisearch, database search, and cache versioning', () => {
    const service = read('services/search.service.ts');
    const setup = read('lib/meilisearch/setup.ts');

    expect(service).toContain('embedPermissionStatus = "verified"');
    expect(service).toContain("hit.embedPermissionStatus !== 'verified'");
    expect(service.match(/eq\(games\.embedPermissionStatus, 'verified'\)/g)?.length).toBeGreaterThanOrEqual(2);
    expect(service).toContain("rightsPolicy: 'verified-v1'");
    expect(setup).toContain("'embedPermissionStatus'");
  });

  it('does not expose search thumbnails without separate verified media permission', () => {
    const service = read('services/search.service.ts');

    expect(service).toContain("hit.thumbnailPermission === 'verified'");
    expect(service).toContain("thumbnailPermission === 'verified'");
  });
});
