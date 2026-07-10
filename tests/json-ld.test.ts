import { describe, expect, it } from 'vitest';

import { serializeJsonLd } from '@/lib/utils/json-ld';

describe('serializeJsonLd', () => {
  it('escapes script-breaking characters and preserves the JSON value', () => {
    const value = {
      name: '</script><script>alert("xss")</script>',
      description: 'Games & guides > downloads',
    };

    const serialized = serializeJsonLd(value);

    expect(serialized).not.toContain('</script>');
    expect(serialized).not.toContain('<script>');
    expect(serialized).toContain('\\u003c');
    expect(serialized).toContain('\\u0026');
    expect(JSON.parse(serialized)).toEqual(value);
  });

  it('rejects values that JSON.stringify cannot serialize', () => {
    expect(() => serializeJsonLd(undefined)).toThrow('must be serializable');
  });
});
