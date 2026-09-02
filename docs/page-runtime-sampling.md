# Luma Runtime Quality Sampling

Generated: 2026-08-30T15:45:28.166Z
Base URL: http://localhost:3217

Scope: mobile Playwright sampling for high-value indexable pages. This is a companion gate for `docs/page-quality-scorecard.md`, adding runtime performance, mobile layout, and actual playable-iframe checks that static scoring cannot prove. Analytics collection is blocked during sampling so automated visits do not contaminate GA4, Clarity, or Vercel telemetry. TTFB/transport is reported separately; page timing scores use response-relative DCL/FCP/load so one noisy network route does not downgrade every page equally.

## Thresholds

- Sampled pages must score 80 or higher before being treated as hardened index targets.
- Game pages must expose the Play button on mobile, load an iframe after the click, and keep the Luma fullscreen control visible.
- Pages are penalized for missing canonical tags, mobile horizontal overflow, slow load/FCP, excessive transfer size, many requests, and console/page errors.

## Summary

- Sampled pages: 15
- Under 80: 0
- Minimum score: 84

## Samples

| Path | Type | Score | Status | TTFB | DCL after response | Load after response | FCP after response | Transfer | Requests | Canonical | Robots | Mobile overflow | Playable | Fullscreen | Reason |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- | --- | --- |
| /en | static | 84 | 200 | 42ms | 2707ms | 2815ms | 2714ms | 193KB | 16 | yes | index | no | n/a | n/a | slow DOMContentLoaded 2707ms; slow FCP 2714ms |
| /en/games | static | 100 | 200 | 534ms | 689ms | 689ms | 286ms | 438KB | 34 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/games/2-player-unblocked | game | 100 | 200 | 64ms | 107ms | 193ms | 128ms | 209KB | 22 | yes | index, follow | no | yes | yes | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/guides/games-like-ovo | guide | 100 | 200 | 34ms | 97ms | 175ms | 118ms | 286KB | 23 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/guides/google-snake-mods | guide | 100 | 200 | 20ms | 105ms | 235ms | 120ms | 234KB | 21 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/guides/big-tower-tiny-square-2-walkthrough | guide | 100 | 200 | 15ms | 71ms | 183ms | 89ms | 266KB | 23 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/guides/obby-parkour-with-ragdoll-guide | guide | 100 | 200 | 24ms | 104ms | 168ms | 120ms | 241KB | 22 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/guides/rail-cart-buddies-guide | guide | 100 | 200 | 25ms | 91ms | 164ms | 115ms | 261KB | 22 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/guides/telemount-walkthrough | guide | 100 | 200 | 23ms | 88ms | 150ms | 109ms | 261KB | 23 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/games/drive-mad | game | 100 | 200 | 81ms | 143ms | 208ms | 171ms | 268KB | 24 | yes | index | no | yes | yes | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/games/duo-vikings | game | 100 | 200 | 58ms | 142ms | 217ms | 171ms | 233KB | 22 | yes | index | no | yes | yes | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/games/draw-a-perfect-circle | game | 100 | 200 | 11ms | 25ms | 180ms | 109ms | 208KB | 19 | yes | noindex, follow | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/games/chinese-checkers | game | 100 | 200 | 15ms | 91ms | 155ms | 113ms | 208KB | 19 | yes | noindex, follow | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/games/stacker-game | game | 100 | 200 | 20ms | 69ms | 122ms | 84ms | 207KB | 19 | yes | noindex, follow | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/games/two-player-games | game | 100 | 200 | 16ms | 28ms | 135ms | 96ms | 207KB | 19 | yes | noindex, follow | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
