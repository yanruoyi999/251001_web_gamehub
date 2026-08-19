# Two-Player Unblocked MVP Design

## Goal

Build one bilingual, indexable `2 Player Unblocked Games` collection centered on legal, self-hosted, directly playable local-multiplayer browser games. Validate real search and play behavior before creating any derivative keyword pages.

## Baseline and branch

- Repository: `yanruoyi999/251001_web_gamehub`
- Base: `main@b6cef8ec81bff68c375d742332ed8aa14f2ce4e4`
- Feature branch: `feat/two-player-unblocked-mvp-20260818`
- English canonical route: `/en/games/2-player-unblocked`
- Chinese localized route: `/games/2-player-unblocked`

## Non-negotiable licensing gate

Before a third-party game is shipped, record repository URL, pinned commit/tag, author, license, commercial-use permission, redistribution/self-host permission, modification permission, attribution requirement, and any asset-specific licensing. Preserve the upstream license text and provenance note in-repo.

Status values:

- `approved`: source and bundled assets are legally reusable under an identified license, or Luma replaces uncertain assets with original assets while retaining required notices.
- `needs-review`: source license exists but bundled media, dependency, trademark/IP, or distribution obligations are not yet sufficiently clear.
- `blocked`: no license, noncommercial-only license, unknown provenance, or third-party mirror/iframe used as the claimed authorization source.

GPL candidates are never auto-approved; they require a separate distribution-obligation review. CC BY-NC and other noncommercial licenses are blocked.

## MVP game quantity

- Target: 5 games.
- Minimum launchable collection: 3 games.
- If fewer than 5 external games survive the licensing gate, add at most 2 Luma-original games built from original code, names, visual treatment, and mechanics expression.
- Never lower copyright/provenance standards to hit a quantity target.

## Runtime architecture

Approved games run from `/public/games-runtime/<slug>/` and must not depend on unauthorized external scripts, images, audio, fonts, or game URLs. Each game is isolated in an iframe and loaded only after an explicit Play action.

For the MVP, same-origin runtime files are sandboxed and do not receive access to parent DOM or application state. The collection mounts exactly one runtime at a time. Switching games unloads the previous iframe by changing the active game and iframe URL rather than keeping all runtimes mounted.

Each runtime must:

- launch without a server-side dependency;
- support the documented two-player controls;
- avoid critical console errors;
- avoid unauthorized network requests;
- expose no fake ratings, play counts, or user reviews;
- keep the upstream license notice when third-party code is used.

## Collection page

Create a dedicated landing page rather than using the generic category template.

First screen priorities:

1. `2 Player Unblocked Games` H1.
2. Short truthful explanation: browser-based, no download, and `unblocked` used as a search/category term rather than a promise to bypass school/work filters.
3. Game picker/cards showing player count, P1/P2 controls, genre, keyboard/mobile support, and Play Now.
4. One active player area; games are lazy and demand-loaded.

Below the playable area, add useful content covering what the term means, co-op/same-keyboard/racing/puzzle/quick picks, control comparison, download/account requirements, Chromebook notes, mobile limitations, and FAQ.

Do not create separate pages for near-duplicate queries in the first release.

## SEO

Primary query cluster:

- `two-player unblocked`
- `2 player unblocked games`
- `two player games unblocked`
- `2 player browser games`
- `two player games same keyboard`

Requirements:

- natural primary-term coverage in Title/H1/description;
- canonical/hreflang consistent with Luma locale rules;
- sitemap inclusion only when launch gates pass;
- `CollectionPage` and `ItemList` JSON-LD for the collection;
- individual indexable game details keep `VideoGame` schema when/if they are added to the normal catalogue;
- no duplicate thin pages for query variants.

## Internal links

Create relevant contextual links from:

- `/games` / `/en/games`;
- keyboard-only browser games guide;
- any existing game detail pages that are genuinely two-player relevant.

The collection links to every shipped game runtime/detail destination. A future dedicated game detail page must link back to the collection and at least one related two-player game.

Minimum: collection receives at least 3 relevant body links before considering the experiment mature. Do not manufacture irrelevant links just to meet a count.

## Trust and provenance data

For each shipped game record:

- author;
- source repository;
- pinned source revision;
- license and local notice path;
- last test date;
- tested browser(s);
- controls;
- touch support;
- account/download requirements;
- whether extra network resources are required;
- measured load time only when actually measured.

Never fabricate player counts, ratings, play counts, load speed, or reviews.

## Analytics

Track these events with a distinct `game_slug`:

- `two_player_collection_view`
- `two_player_game_click`
- `game_play_start`
- `game_load_success`
- `game_load_error`
- `game_play_10s`
- `game_play_30s`
- `game_switch`
- `game_fullscreen_toggle`

Telemetry must continue to respect Luma production-host and automated-test isolation. Game telemetry is best-effort and must never block controls.

## Retention decision rule

Do not automatically remove games from small samples.

A game can enter `replacement-candidate` only after at least 30 valid `game_play_start` events, preferably 50, with normal `game_load_success`. Then evaluate `game_play_30s / game_play_start` together with average play time, startup failure rate, and switching behavior.

- sustained >= 50%: keep;
- sustained < 50% with sufficient sample: replacement candidate;
- insufficient sample: `insufficient-data`.

## Accessibility and compatibility

Before production release verify:

- Chrome and Safari desktop;
- simultaneous two-player key input;
- fullscreen;
- switching games;
- refresh/re-entry;
- iPhone Safari layout without severe overflow;
- clear mobile unsupported labels where applicable;
- keyboard focus and 44px-priority interactive controls;
- 200% zoom and reduced-motion layout sanity.

## Experiment boundary

Do not add `/games/2-player-same-keyboard`, `/games/2-player-puzzle`, or `/games/2-player-racing` until the core page is indexed and 2–6 weeks of real GSC/play data supports expansion.

Summer Rider is research evidence only: no unauthorized playable page, copied source, art, names, or assets.
