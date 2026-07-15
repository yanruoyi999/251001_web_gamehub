import type { MockGame } from '@/lib/mock-games';

const FALLBACK_TIMESTAMP = new Date('2024-01-01T00:00:00.000Z');

export function buildFallbackGameDetail(game: MockGame) {
  return {
    id: game.id,
    slug: game.slug,
    title: game.title,
    titleEn: game.titleEn,
    description: game.description,
    descriptionEn: game.descriptionEn,
    instructions: game.instructions.zh.join('\n') || null,
    instructionsEn: game.instructions.en.join('\n') || null,
    iframeUrl: game.iframeUrl,
    thumbnailUrl: game.thumbnailUrl,
    featured: game.featured,
    isNew: game.isNew,
    isHot: game.isHot,
    status: 'active',
    developerName: game.developerName,
    developerUrl: game.developerUrl,
    sourceUrl: game.sourceUrl,
    sourceType: game.sourceType,
    sourceHost: game.sourceHost,
    sourcePageUrl: game.sourcePageUrl,
    embedHost: game.embedHost,
    developerVerified: game.developerVerified,
    embedPermissionStatus: game.embedPermissionStatus,
    publishedAt: null,
    createdAt: FALLBACK_TIMESTAMP,
    updatedAt: FALLBACK_TIMESTAMP,
    stats: null,
    categories: game.categories,
    tags: game.tags,
    screenshots: game.screenshots.map((screenshot, index) => ({
      id: game.id * 100 + index,
      gameId: game.id,
      url: screenshot.url,
      publicId: null,
      order: screenshot.order,
      createdAt: FALLBACK_TIMESTAMP,
    })),
    degraded: true,
    source: 'fallback' as const,
  };
}
