const UNKNOWN_CLIENT_IP = '0.0.0.0';

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
    ?.split(',')
    .map((value) => value.trim())
    .find(Boolean);

  return (
    forwarded ||
    request.headers.get('cf-connecting-ip')?.trim() ||
    request.headers.get('x-real-ip')?.trim() ||
    UNKNOWN_CLIENT_IP
  );
}
