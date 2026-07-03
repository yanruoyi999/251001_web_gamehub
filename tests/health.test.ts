import { describe, expect, it } from 'vitest';

import { sanitizeHealthResult } from '@/lib/ops/health';

describe('sanitizeHealthResult', () => {
  it('hides dependency error details in public health responses', () => {
    const result = sanitizeHealthResult(
      {
        name: 'database',
        status: 'error',
        message: 'getaddrinfo ENOTFOUND db.example.supabase.co',
      },
      'public',
    );

    expect(result.status).toBe('error');
    expect(result.message).toBe('Database health check failed');
    expect(result.message).not.toContain('supabase.co');
  });

  it('keeps dependency error details for internal health checks', () => {
    const result = sanitizeHealthResult(
      {
        name: 'database',
        status: 'error',
        message: 'getaddrinfo ENOTFOUND db.example.supabase.co',
      },
      'internal',
    );

    expect(result.message).toBe('getaddrinfo ENOTFOUND db.example.supabase.co');
  });
});
