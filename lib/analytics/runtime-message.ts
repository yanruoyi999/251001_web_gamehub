export type RuntimeMessageType = 'luma-game-ready' | 'luma-game-input' | 'luma-game-error';
export interface TrustedRuntimeMessage { type: RuntimeMessageType; gameSlug: string; session: string }

/** Sandboxed self-hosted games have an opaque origin. Never trust origin alone. */
export function parseTrustedRuntimeMessage(
  event: { source: unknown; origin: string; data: unknown },
  frameWindow: unknown,
  gameSlug: string,
  session: string,
): TrustedRuntimeMessage | null {
  if (!frameWindow || event.source !== frameWindow || event.origin !== 'null') return null;
  if (!session || !/^[a-zA-Z0-9-]{16,128}$/.test(session)) return null;
  const data = event.data;
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null;
  const message = data as Record<string, unknown>;
  if (message.gameSlug !== gameSlug || message.session !== session) return null;
  if (message.type !== 'luma-game-ready' && message.type !== 'luma-game-input' && message.type !== 'luma-game-error') return null;
  return { type: message.type, gameSlug, session };
}
