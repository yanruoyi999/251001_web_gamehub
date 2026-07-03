import { NextResponse } from 'next/server';

import { getHealthSummary } from '@/lib/ops/health';

export const dynamic = 'force-dynamic';

export async function GET() {
  const summary = await getHealthSummary('public');
  const isAvailable = summary.status !== 'error';

  return NextResponse.json(summary, { status: isAvailable ? 200 : 503 });
}
