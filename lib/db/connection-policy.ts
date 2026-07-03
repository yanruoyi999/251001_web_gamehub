export type DatabaseProvider = 'local' | 'supabase-direct' | 'supabase-pooler' | 'other' | 'unknown';

export interface DatabaseConnectionMetadata {
  configured: boolean;
  provider: DatabaseProvider;
  host?: string;
  port?: string;
  isServerlessRuntime: boolean;
  usePreparedStatements: boolean;
  requiresSsl: boolean;
  maxConnections: number;
  connectTimeoutSeconds: number;
  warning?: string;
}

function toPositiveInteger(value: string | undefined, fallback: number) {
  const parsed = value ? Number(value) : NaN;
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function isServerlessRuntime(env: NodeJS.ProcessEnv) {
  return env.VERCEL === '1' || Boolean(env.VERCEL_ENV);
}

export function getDatabaseConnectionMetadata(
  connectionString = process.env.DATABASE_URL,
  env: NodeJS.ProcessEnv = process.env,
): DatabaseConnectionMetadata {
  const serverlessRuntime = isServerlessRuntime(env);

  if (!connectionString) {
    return {
      configured: false,
      provider: 'unknown',
      isServerlessRuntime: serverlessRuntime,
      usePreparedStatements: true,
      requiresSsl: false,
      maxConnections: 1,
      connectTimeoutSeconds: toPositiveInteger(env.DATABASE_CONNECT_TIMEOUT_SECONDS, 5),
      warning: 'DATABASE_URL is not configured',
    };
  }

  try {
    const parsed = new URL(connectionString);
    const host = parsed.hostname;
    const port = parsed.port || (parsed.protocol.startsWith('postgres') ? '5432' : '');
    const isLocal = host === 'localhost' || host === '127.0.0.1' || host === '::1';
    const isSupabaseDirect = /^db\.[^.]+\.supabase\.co$/i.test(host);
    const isSupabasePooler = /\.pooler\.supabase\.com$/i.test(host);
    const provider: DatabaseProvider = isLocal
      ? 'local'
      : isSupabaseDirect
        ? 'supabase-direct'
        : isSupabasePooler
          ? 'supabase-pooler'
          : 'other';

    const defaultMaxConnections = serverlessRuntime ? 1 : env.NODE_ENV === 'production' ? 3 : 1;
    const connectTimeoutSeconds = toPositiveInteger(
      env.DATABASE_CONNECT_TIMEOUT_SECONDS,
      serverlessRuntime ? 5 : 10,
    );
    const warning =
      provider === 'supabase-direct' && serverlessRuntime
        ? 'Supabase direct database URL is configured in a serverless runtime; use Supavisor pooler transaction mode for production traffic.'
        : undefined;

    return {
      configured: true,
      provider,
      host,
      port,
      isServerlessRuntime: serverlessRuntime,
      usePreparedStatements: provider !== 'supabase-pooler',
      requiresSsl: provider === 'supabase-direct' || provider === 'supabase-pooler',
      maxConnections: toPositiveInteger(env.DATABASE_MAX_CONNECTIONS, defaultMaxConnections),
      connectTimeoutSeconds,
      warning,
    };
  } catch {
    return {
      configured: true,
      provider: 'unknown',
      isServerlessRuntime: serverlessRuntime,
      usePreparedStatements: true,
      requiresSsl: false,
      maxConnections: 1,
      connectTimeoutSeconds: toPositiveInteger(env.DATABASE_CONNECT_TIMEOUT_SECONDS, 5),
      warning: 'DATABASE_URL is not a valid URL',
    };
  }
}

export function shouldSkipSupabaseDirectInServerless(metadata: DatabaseConnectionMetadata) {
  return metadata.provider === 'supabase-direct' && metadata.isServerlessRuntime;
}
