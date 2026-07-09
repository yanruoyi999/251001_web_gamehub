import { NextRequest, NextResponse } from 'next/server';
import { CounterService } from '@/services';
import {
  getDatabaseConnectionMetadata,
  shouldSkipSupabaseDirectInServerless,
} from '@/lib/db/connection-policy';

function parseId(value: string): number | null {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

function canReadPersistedCounts() {
  const databaseConnection = getDatabaseConnectionMetadata();
  if (!databaseConnection.configured) return false;

  return !(
    process.env.COUNTER_ALLOW_SUPABASE_DIRECT_IN_SERVERLESS !== 'true' &&
    shouldSkipSupabaseDirectInServerless(databaseConnection)
  );
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const gameId = parseId(params.id);
  if (!gameId) {
    return NextResponse.json({ error: 'Invalid game ID' }, { status: 400 });
  }

  if (!canReadPersistedCounts()) {
    return NextResponse.json({ total: 0, today: 0, degraded: true });
  }

  try {
    const counts = await CounterService.getCounts(gameId);
    return NextResponse.json(counts);
  } catch (error) {
    console.error('Failed to fetch play counts:', error);
    return NextResponse.json(
      { total: 0, today: 0, degraded: true },
      { status: 200 },
    );
  }
}

export const dynamic = 'force-dynamic';
