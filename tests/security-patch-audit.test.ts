import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('October audit patch floor', () => {
  it('pins the reviewed Next and image codec security patches together', () => {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
    expect(pkg.dependencies.next).toBe('15.5.27');
    expect(pkg.devDependencies['eslint-config-next']).toBe('15.5.27');
    expect(pkg.pnpm.overrides.sharp).toBe('0.35.5');
    expect(pkg.pnpm.overrides['source-map-js']).toBe('1.2.2');
    const lock = readFileSync('pnpm-lock.yaml', 'utf8');
    expect(lock).toContain('next@15.5.27');
    expect(lock).toContain('sharp@0.35.5');
    expect(lock).toContain('source-map-js@1.2.2');
    expect(lock).not.toContain('next@15.5.21');
    expect(lock).not.toContain('next@15.5.25');
    expect(lock).not.toContain('sharp@0.35.4');
    expect(lock).not.toContain('source-map-js@1.2.1');
  });
});
