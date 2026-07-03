import { NextResponse } from 'next/server';

import { getHealthSummary } from '@/lib/ops/health';

export const dynamic = 'force-dynamic';

export async function GET() {
  const summary = await getHealthSummary('public');
  const isHealthy = summary.status === 'ok';

  return NextResponse.json(summary, { status: isHealthy ? 200 : 503 });
}
