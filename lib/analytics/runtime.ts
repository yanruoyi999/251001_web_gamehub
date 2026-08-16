const FORMAL_PRODUCTION_HOSTS = new Set(['lumagamehub.com', 'www.lumagamehub.com']);

export function isFormalProductionHost(hostname: string) {
  if (typeof hostname !== 'string') return false;
  return FORMAL_PRODUCTION_HOSTS.has(hostname.trim().toLowerCase());
}

export function shouldLoadProductionTelemetry(
  hostname: string,
  nodeEnv: string | undefined = process.env.NODE_ENV,
) {
  return nodeEnv === 'production' && isFormalProductionHost(hostname);
}
