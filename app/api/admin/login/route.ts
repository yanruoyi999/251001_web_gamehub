import { NextResponse } from 'next/server';

import {
  createAdminSession,
  validateAdminPassword,
  assertAdminPasswordConfigured,
} from '@/lib/auth/admin';
import { getClientIp } from '@/lib/http/client-ip';
import { hashIp } from '@/lib/utils/hash';
import { isLocalCatalogueMode } from '@/lib/games/catalog-mode';
import {
  clearAdminLoginAttempts,
  consumeAdminLoginAttempt,
} from '@/lib/auth/admin-rate-limit';

const MAX_FAILED_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

function getClientKey(request: Request) {
  return hashIp(getClientIp(request));
}

function hasAllowedAdminOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return process.env.NODE_ENV !== 'production';

  return origin === 'https://www.lumagamehub.com' || origin === 'https://lumagamehub.com';
}

export async function POST(request: Request) {
  if (isLocalCatalogueMode()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (!hasAllowedAdminOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const clientKey = getClientKey(request);
  const rateLimit = await consumeAdminLoginAttempt(
    clientKey,
    MAX_FAILED_ATTEMPTS,
    Math.ceil(LOGIN_WINDOW_MS / 1000),
  );

  if (!rateLimit.available) {
    return NextResponse.json(
      { error: 'Admin login is temporarily unavailable' },
      { status: 503 },
    );
  }

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many login attempts. Try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) },
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
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 },
      );
    }

    await clearAdminLoginAttempts(clientKey);
    await createAdminSession();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Admin login failed:', error);
    return NextResponse.json({ error: 'Admin login failed' }, { status: 500 });
  }
}
