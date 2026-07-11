import { NextResponse } from 'next/server';

import { destroyAdminSession } from '@/lib/auth/admin';
import { isLocalCatalogueMode } from '@/lib/games/catalog-mode';

export async function POST() {
  if (isLocalCatalogueMode()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await destroyAdminSession();
  return NextResponse.json({ success: true });
}
