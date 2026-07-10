import { NextRequest, NextResponse } from 'next/server';

import { GameService } from '@/services';
import { isAdminRequestAuthenticated } from '@/lib/auth/admin';
import { isValidHttpsUrl } from '@/lib/utils/validation';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const gameId = Number(id);
  if (!Number.isInteger(gameId) || gameId <= 0) {
    return NextResponse.json({ error: 'Invalid game id' }, { status: 400 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const updates: Record<string, unknown> = {};

    if (typeof body.title === 'string' && body.title.trim().length > 0) {
      updates.title = body.title.trim();
    }

    if (typeof body.slug === 'string' && body.slug.trim().length > 0) {
      updates.slug = body.slug.trim();
    }

    if (typeof body.description === 'string') {
      updates.description = body.description;
    }

    if (typeof body.thumbnailUrl === 'string') {
      updates.thumbnailUrl = body.thumbnailUrl || null;
    }

    if (typeof body.iframeUrl === 'string' && body.iframeUrl.trim().length > 0) {
      updates.iframeUrl = body.iframeUrl.trim();
    }

    if (typeof body.status === 'string') {
      const allowed = ['active', 'inactive', 'pending'];
      if (allowed.includes(body.status)) {
        updates.status = body.status;
      }
    }

    if (typeof body.isNew === 'boolean') {
      updates.isNew = body.isNew;
    }

    if (typeof body.isHot === 'boolean') {
      updates.isHot = body.isHot;
    }

    if (typeof body.featured === 'boolean') {
      updates.featured = body.featured;
    }

    if (Array.isArray(body.categoryIds)) {
      const categoryIds = body.categoryIds
        .map((value: unknown) => Number(value))
        .filter((value: number) => Number.isInteger(value) && value > 0);
      updates.categoryIds = categoryIds;
    }

    if (Array.isArray(body.tagIds)) {
      const tagIds = body.tagIds
        .map((value: unknown) => Number(value))
        .filter((value: number) => Number.isInteger(value) && value > 0);
      updates.tagIds = tagIds;
    }

    if (typeof body.developerName === 'string') {
      updates.developerName = body.developerName.trim() || null;
    }

    if (typeof body.developerUrl === 'string') {
      const url = body.developerUrl.trim();
      if (url) {
        if (!isValidHttpsUrl(url)) {
          return NextResponse.json({ error: 'Developer URL must be a valid HTTPS link' }, { status: 400 });
        }
        updates.developerUrl = url;
      } else {
        updates.developerUrl = null;
      }
    }

    if (typeof body.sourceUrl === 'string') {
      const url = body.sourceUrl.trim();
      if (url) {
        if (!isValidHttpsUrl(url)) {
          return NextResponse.json({ error: 'Source URL must be a valid HTTPS link' }, { status: 400 });
        }
        updates.sourceUrl = url;
      } else {
        updates.sourceUrl = null;
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields provided' }, { status: 400 });
    }

    const updated = await GameService.updateGame(gameId, updates);

    return NextResponse.json({ success: true, game: updated });
  } catch (error) {
    console.error('Failed to update game:', error);
    return NextResponse.json({ error: 'Failed to update game' }, { status: 500 });
  }
}
