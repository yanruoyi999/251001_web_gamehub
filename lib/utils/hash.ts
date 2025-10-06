import crypto from 'crypto';

/**
 * 对 IP 地址做哈希处理，避免存储明文
 */
export function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex');
}

/**
 * 根据 User-Agent 和语言等信息生成匿名 Token
 * 可用于识别匿名用户，减少重复提交
 */
export function generateAnonymousToken(userAgent: string, acceptLanguage: string): string {
  return crypto
    .createHash('sha256')
    .update(`${userAgent}::${acceptLanguage}`)
    .digest('hex');
}
