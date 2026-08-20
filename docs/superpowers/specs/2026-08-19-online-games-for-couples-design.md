# Online Games for Couples Design

## Goal

Create one indexable Luma landing/product page at `/games/online-games-for-couples` that targets the `online games for couples` query cluster with genuinely playable, original browser interactions instead of duplicating the existing Two-Player collection.

## Search intent and scope

Primary English cluster:
- `online games for couples`
- `couple games online`
- `games for couples online`
- `online couples games`

The page serves two intents:
1. couples sharing one device;
2. long-distance couples who need the same prompt deck without a realtime account or room backend.

Only one core page is created in v1. Do not create near-duplicate `/couple-games-online`, `/long-distance-couple-games`, or similar keyword pages.

## Product architecture

The page contains three Luma-original interactions implemented in one client component:

1. **This or That Duo** — both players answer the same binary prompts; reveal agreement after both answers.
2. **How Well Do You Match?** — a short preference round; both players answer separately and receive a match percentage at completion.
3. **Quick Couple Challenge** — a lightweight prompt deck for talking/acting together; players advance through the deck and complete the round.

All game state stays in the browser. No answers, names, relationship data, or results are persisted to a server.

## Long-distance sharing

A deterministic `challenge` code selects the same prompt order for both people. The page exposes:
- a human-readable challenge code;
- a copy-link action using `?challenge=<code>`;
- deterministic prompt ordering from the code.

The URL contains only the challenge code, never answers or personal information. There is no realtime room, login, database write, or websocket in v1.

## Page structure

`/en/games/online-games-for-couples` and the localized default route render:
- SEO title/description and H1;
- a short intent explanation;
- the interactive game picker before long-form copy;
- same-device vs long-distance explanation;
- comparison table for the three original interactions;
- privacy/trust note that state is local-only;
- FAQ;
- related links to Two-Player and broader game discovery.

The page uses `CollectionPage`, `ItemList`, `FAQPage`, and `BreadcrumbList` JSON-LD. It is self-canonical, has `zh-CN`, `en-US`, and `x-default` alternates, is indexable, and enters sitemap.

## Internal-link strategy

Do not modify the homepage in v1.

Add contextual body links from:
- `/games` → Couples Hub;
- `/games/2-player-unblocked` → Couples Hub, with copy distinguishing same-keyboard from broader couples play;
- one relevant existing guide (`no-download-games` or equivalent) → Couples Hub.

The Couples Hub links back to Two-Player and `/games`.

## Analytics

Record only interaction metadata, never answers:
- `couples_collection_view`
- `couple_game_select`
- `couple_game_start`
- `couple_game_complete`
- `couple_share`

Common parameters:
- `game_slug`
- `locale`
- `source: 'couples_collection'`
- `challenge_code` only where useful

Completion may record non-sensitive aggregate values such as `round_count` or `match_percent`; never include prompt text or player answers.

## Accessibility and responsive behavior

- Every action is a native button/input with keyboard focus states.
- Selected states use `aria-pressed` or equivalent semantics.
- Results are announced via `aria-live`.
- No horizontal overflow at mobile widths.
- No interaction requires hover.
- Reduced-motion users must not depend on animation to understand state.

## Testing and release gates

TDD is required. Tests must first fail for the absent Couples feature, then pass after implementation.

Required final gates:
- `pnpm lint`
- `pnpm type-check`
- `pnpm test -- --run`
- `pnpm check:internal-links`
- `pnpm audit:prod`
- `pnpm build`
- Playwright coverage for game selection, same-device play, deterministic challenge sharing, completion, mobile layout, and no console/page errors
- existing runtime-quality audit including the new route

The branch remains unmerged and undeployed until review unless the user explicitly requests merge/deploy.
