import { NextResponse } from 'next/server';

import {
  createAdminSession,
  validateAdminPassword,
  assertAdminPasswordConfigured,
} from '@/lib/auth/admin';
import { getClientIp } from '@/lib/http/client-ip';
import { hashIp } from '@/lib/utils/hash';

const MAX_FAILED_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_RATE_LIMIT_KEYS = 5_000;

type LoginAttempt = {
  count: number;
  resetAt: number;
};

const failedLoginAttempts = new Map<string, LoginAttempt>();

function getClientKey(request: Request) {
  return hashIp(getClientIp(request));
}

function getActiveAttempt(key: string, now = Date.now()) {
  const current = failedLoginAttempts.get(key);
  if (!current || current.resetAt <= now) {
    if (current) failedLoginAttempts.delete(key);
    return null;
  }
  return current;
}

function recordFailedAttempt(key: string, now = Date.now()) {
  const current = getActiveAttempt(key, now);
  const next = current
    ? { count: current.count + 1, resetAt: current.resetAt }
    : { count: 1, resetAt: now + LOGIN_WINDOW_MS };
  failedLoginAttempts.set(key, next);

  if (failedLoginAttempts.size > MAX_LOGIN_RATE_LIMIT_KEYS) {
    failedLoginAttempts.forEach((entry, candidateKey) => {
      if (entry.resetAt <= now) failedLoginAttempts.delete(candidateKey);
    });
    while (failedLoginAttempts.size > MAX_LOGIN_RATE_LIMIT_KEYS) {
      const oldestKey = failedLoginAttempts.keys().next().value as string | undefined;
      if (!oldestKey) break;
      failedLoginAttempts.delete(oldestKey);
    }
  }

  return next;
}

export async function POST(request: Request) {
  const clientKey = getClientKey(request);
  const activeAttempt = getActiveAttempt(clientKey);

  if (activeAttempt && activeAttempt.count >= MAX_FAILED_ATTEMPTS) {
    const retryAfterSeconds = Math.max(1, Math.ceil((activeAttempt.resetAt - Date.now()) / 1000));
    return NextResponse.json(
      { error: 'Too many login attempts. Try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(retryAfterSeconds) },
      },
    );
  }

  try {
    assertAdminPasswordConfigured();

    const payload = await request.json().catch(() => ({}));
    const password = typeof payload?.password === 'string' ? payload.password : '';

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    if (!validateAdminPassword(password)) {
      const attempt = recordFailedAttempt(clientKey);
      const remaining = Math.max(0, MAX_FAILED_ATTEMPTS - attempt.count);
      return NextResponse.json(
        { error: 'Invalid password', remainingAttempts: remaining },
        { status: 401 },
      );
    }

    failedLoginAttempts.delete(clientKey);
    await createAdminSession();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Admin login failed:', error);
    return NextResponse.json({ error: 'Admin login failed' }, { status: 500 });
  }
}
