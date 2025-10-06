import { NextResponse } from 'next/server';

import {
  createAdminSession,
  validateAdminPassword,
  assertAdminPasswordConfigured,
} from '@/lib/auth/admin';

export async function POST(request: Request) {
  try {
    assertAdminPasswordConfigured();

    const payload = await request.json().catch(() => ({}));
    const password = typeof payload?.password === 'string' ? payload.password : '';

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    if (!validateAdminPassword(password)) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    createAdminSession();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Admin login failed:', error);
    return NextResponse.json({ error: 'Admin login failed' }, { status: 500 });
  }
}
