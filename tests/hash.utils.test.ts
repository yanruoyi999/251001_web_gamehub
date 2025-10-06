import { describe, expect, it } from 'vitest';

import { generateAnonymousToken, hashIp } from '@/lib/utils/hash';

describe('hash utils', () => {
  it('hashIp should generate deterministic sha256 hashes', () => {
    const first = hashIp('192.168.0.1');
    const second = hashIp('192.168.0.1');
    expect(first).toHaveLength(64);
    expect(first).toBe(second);
  });

  it('hashIp should produce different hashes for different inputs', () => {
    expect(hashIp('192.168.0.1')).not.toBe(hashIp('192.168.0.2'));
  });

  it('generateAnonymousToken should combine user agent and language', () => {
    const token = generateAnonymousToken('Mozilla/5.0', 'en-US,en;q=0.9');
    expect(token).toHaveLength(64);
  });

  it('generateAnonymousToken should change when input changes', () => {
    const base = generateAnonymousToken('Mozilla/5.0', 'en-US');
    const variant = generateAnonymousToken('Mozilla/5.0', 'zh-CN');
    expect(base).not.toBe(variant);
  });
});
