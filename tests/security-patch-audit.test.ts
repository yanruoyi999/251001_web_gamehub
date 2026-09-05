import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('September audit patch floor', () => {
  it('pins the reviewed Next and image codec security patches together', () => {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
    expect(pkg.dependencies.next).toBe('15.5.25');
    expect(pkg.devDependencies['eslint-config-next']).toBe('15.5.25');
    expect(pkg.pnpm.overrides.sharp).toBe('0.35.4');
    const lock = readFileSync('pnpm-lock.yaml', 'utf8');
    expect(lock).toContain('next@15.5.25');
    expect(lock).toContain('sharp@0.35.4');
    expect(lock).not.toContain('next@15.5.21');
  });
});
