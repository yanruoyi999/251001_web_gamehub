import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';

export const ADMIN_SESSION_COOKIE = 'gamehub-admin-session';
const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

export function isAdminAuthenticated() {
  return cookies().has(ADMIN_SESSION_COOKIE);
}

export function requireAdminAuth() {
  if (!isAdminAuthenticated()) {
    redirect('/admin/login');
  }
}

export function assertAdminPasswordConfigured() {
  if (!process.env.ADMIN_PASSWORD) {
    throw new Error('ADMIN_PASSWORD is not configured');
  }
}

export function validateAdminPassword(password: string) {
  assertAdminPasswordConfigured();
  return password === process.env.ADMIN_PASSWORD;
}

export function createAdminSession() {
  cookies().set(ADMIN_SESSION_COOKIE, 'active', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: ADMIN_SESSION_MAX_AGE,
    path: '/',
  });
}

export function destroyAdminSession() {
  cookies().set(ADMIN_SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

export function isAdminRequestAuthenticated(request: NextRequest) {
  return request.cookies.get(ADMIN_SESSION_COOKIE) !== undefined;
}
