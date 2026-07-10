import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';
import { createHash, createHmac, timingSafeEqual, randomBytes } from 'crypto';

export const ADMIN_SESSION_COOKIE = 'gamehub-admin-session';
const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours
const ADMIN_SESSION_VERSION = 1;

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return verifyAdminSessionToken(token);
}

export async function requireAdminAuth() {
  if (!(await isAdminAuthenticated())) {
    redirect('/admin/login');
  }
}

export function assertAdminPasswordConfigured() {
  if (!process.env.ADMIN_PASSWORD) {
    throw new Error('ADMIN_PASSWORD is not configured');
  }
}

function getAdminSessionSecret() {
  const explicitSecret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (explicitSecret) return explicitSecret;

  if (process.env.NODE_ENV === 'production') {
    throw new Error('ADMIN_SESSION_SECRET is not configured');
  }

  assertAdminPasswordConfigured();
  return `dev-admin-session:${process.env.ADMIN_PASSWORD}`;
}

function hashSecret(value: string) {
  return createHash('sha256').update(value).digest();
}

export function validateAdminPassword(password: string) {
  assertAdminPasswordConfigured();
  const configuredPassword = process.env.ADMIN_PASSWORD ?? '';
  return timingSafeEqual(hashSecret(password), hashSecret(configuredPassword));
}

function signPayload(payload: string) {
  return createHmac('sha256', getAdminSessionSecret()).update(payload).digest('base64url');
}

function createAdminSessionToken() {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    v: ADMIN_SESSION_VERSION,
    iat: now,
    exp: now + ADMIN_SESSION_MAX_AGE,
    nonce: randomBytes(16).toString('base64url'),
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${encodedPayload}.${signPayload(encodedPayload)}`;
}

function signaturesMatch(actual: string, expected: string) {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  );
}

export function verifyAdminSessionToken(token?: string | null) {
  if (!token) return false;

  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature) return false;

  try {
    if (!signaturesMatch(signature, signPayload(encodedPayload))) {
      return false;
    }

    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8')) as {
      v?: number;
      exp?: number;
    };

    if (payload.v !== ADMIN_SESSION_VERSION || typeof payload.exp !== 'number') {
      return false;
    }

    return payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export async function createAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, createAdminSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: ADMIN_SESSION_MAX_AGE,
    path: '/',
  });
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

export function isAdminRequestAuthenticated(request: NextRequest) {
  const cookieStore = request.cookies;
  if (!cookieStore || typeof cookieStore.get !== 'function') {
    return false;
  }

  return verifyAdminSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}
