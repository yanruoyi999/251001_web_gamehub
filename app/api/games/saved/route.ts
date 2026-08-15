import { NextRequest, NextResponse } from 'next/server';

import { getSavedGameSummaries } from '@/lib/retention/saved-games';

const MAX_SAVED_SLUGS = 50;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function parseSlugs(value: string | null) {
  if (!value) return [];

  return value
    .split(',')
    .map(slug => slug.trim().toLowerCase())
    .filter(slug => SLUG_PATTERN.test(slug))
    .slice(0, MAX_SAVED_SLUGS);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slugs = parseSlugs(searchParams.get('slugs'));

  return NextResponse.json(
    {
      games: getSavedGameSummaries(slugs),
      source: 'local',
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  );
}

export const dynamic = 'force-dynamic';
