# Luma Runtime Quality Sampling

Generated: 2026-08-21T02:26:19.040Z
Base URL: http://localhost:3221

Scope: mobile Playwright sampling for high-value indexable pages. This is a companion gate for `docs/page-quality-scorecard.md`, adding runtime performance, mobile layout, and actual playable-iframe checks that static scoring cannot prove. Analytics collection is blocked during sampling so automated visits do not contaminate GA4, Clarity, or Vercel telemetry. TTFB/transport is reported separately; page timing scores use response-relative DCL/FCP/load so one noisy network route does not downgrade every page equally.

## Thresholds

- Sampled pages must score 80 or higher before being treated as hardened index targets.
- Game pages must expose the Play button on mobile, load an iframe after the click, and keep the Luma fullscreen control visible.
- Pages are penalized for missing canonical tags, mobile horizontal overflow, slow load/FCP, excessive transfer size, many requests, and console/page errors.

## Summary

- Sampled pages: 11
- Under 80: 0
- Minimum score: 100

## Samples

| Path | Type | Score | Status | TTFB | DCL after response | Load after response | FCP after response | Transfer | Requests | Canonical | Robots | Mobile overflow | Playable | Fullscreen | Reason |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- | --- | --- |
| /en | static | 100 | 200 | 173ms | 271ms | 379ms | 284ms | 297KB | 26 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/games | static | 100 | 200 | 121ms | 232ms | 240ms | 119ms | 360KB | 26 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/games/2-player-unblocked | game | 100 | 200 | 40ms | 89ms | 175ms | 120ms | 185KB | 20 | yes | index, follow | no | yes | yes | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/guides/games-like-ovo | guide | 100 | 200 | 23ms | 20ms | 342ms | 113ms | 210KB | 19 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/guides/google-snake-mods | guide | 100 | 200 | 30ms | 93ms | 210ms | 118ms | 211KB | 19 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/guides/big-tower-tiny-square-2-walkthrough | guide | 100 | 200 | 28ms | 325ms | 490ms | 340ms | 215KB | 19 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/guides/obby-parkour-with-ragdoll-guide | guide | 100 | 200 | 39ms | 72ms | 162ms | 89ms | 203KB | 18 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/guides/rail-cart-buddies-guide | guide | 100 | 200 | 39ms | 28ms | 165ms | 93ms | 203KB | 18 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/guides/telemount-walkthrough | guide | 100 | 200 | 260ms | 168ms | 387ms | 192ms | 238KB | 21 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/games/drive-mad | game | 100 | 200 | 76ms | 256ms | 256ms | 244ms | 230KB | 20 | yes | index | no | yes | yes | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/games/duo-vikings | game | 100 | 200 | 80ms | 193ms | 351ms | 184ms | 229KB | 20 | yes | index | no | yes | yes | Mobile runtime sample passed the current performance and playability thresholds. |
