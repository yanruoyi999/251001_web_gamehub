import { describe, expect, it } from 'vitest';

import {
  getDatabaseConnectionMetadata,
  shouldSkipSupabaseDirectInServerless,
} from '@/lib/db/connection-policy';

describe('getDatabaseConnectionMetadata', () => {
  it('flags Supabase direct URLs as risky in Vercel serverless runtimes', () => {
    const metadata = getDatabaseConnectionMetadata(
      'postgresql://postgres:secret@db.atbmcpmdqrnetlxnchwv.supabase.co:5432/postgres',
      {
        VERCEL: '1',
        VERCEL_ENV: 'production',
        NODE_ENV: 'production',
      } as NodeJS.ProcessEnv,
    );

    expect(metadata.provider).toBe('supabase-direct');
    expect(metadata.warning).toContain('Supabase direct database URL');
    expect(metadata.maxConnections).toBe(1);
    expect(metadata.requiresSsl).toBe(true);
    expect(shouldSkipSupabaseDirectInServerless(metadata)).toBe(true);
  });

  it('uses pooler-safe options for Supabase pooler URLs', () => {
    const metadata = getDatabaseConnectionMetadata(
      'postgresql://postgres.atbmcpmdqrnetlxnchwv:secret@aws-0-us-east-1.pooler.supabase.com:6543/postgres',
      {
        VERCEL: '1',
        VERCEL_ENV: 'production',
        NODE_ENV: 'production',
      } as NodeJS.ProcessEnv,
    );

    expect(metadata.provider).toBe('supabase-pooler');
    expect(metadata.warning).toBeUndefined();
    expect(metadata.usePreparedStatements).toBe(false);
    expect(metadata.requiresSsl).toBe(true);
    expect(shouldSkipSupabaseDirectInServerless(metadata)).toBe(false);
  });
});
