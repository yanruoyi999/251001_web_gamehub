# Luma Runtime Quality Sampling

Generated: 2026-08-20T12:41:53.863Z
Base URL: http://127.0.0.1:3217

Scope: mobile Playwright sampling for high-value indexable pages. This is a companion gate for `docs/page-quality-scorecard.md`, adding runtime performance, mobile layout, and actual playable-iframe checks that static scoring cannot prove. Analytics collection is blocked during sampling so automated visits do not contaminate GA4, Clarity, or Vercel telemetry. TTFB/transport is reported separately; page timing scores use response-relative DCL/FCP/load so one noisy network route does not downgrade every page equally.

## Thresholds

- Sampled pages must score 80 or higher before being treated as hardened index targets.
- Game pages must expose the Play button on mobile, load an iframe after the click, and keep the Luma fullscreen control visible.
- Pages are penalized for missing canonical tags, mobile horizontal overflow, slow load/FCP, excessive transfer size, many requests, and console/page errors.

## Summary

- Sampled pages: 11
- Under 80: 0
- Minimum score: 92

## Samples

| Path | Type | Score | Status | TTFB | DCL after response | Load after response | FCP after response | Transfer | Requests | Canonical | Robots | Mobile overflow | Playable | Fullscreen | Reason |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- | --- | --- |
| /en | static | 92 | 200 | 261ms | 127ms | 664ms | 135ms | 2501KB | 14 | yes | index | no | n/a | n/a | heavy transfer 2501KB |
| /en/games | static | 92 | 200 | 207ms | 222ms | 664ms | 69ms | 2542KB | 19 | yes | index | no | n/a | n/a | heavy transfer 2542KB |
| /en/games/2-player-unblocked | game | 100 | 200 | 2002ms | 67ms | 510ms | 74ms | 2300KB | 10 | yes | index, follow | no | yes | yes | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/guides/games-like-ovo | guide | 100 | 200 | 1086ms | 85ms | 603ms | 66ms | 2422KB | 9 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/guides/google-snake-mods | guide | 100 | 200 | 158ms | 93ms | 531ms | 70ms | 2392KB | 8 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/guides/big-tower-tiny-square-2-walkthrough | guide | 100 | 200 | 134ms | 91ms | 608ms | 66ms | 2396KB | 8 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/guides/obby-parkour-with-ragdoll-guide | guide | 100 | 200 | 130ms | 77ms | 616ms | 62ms | 2384KB | 7 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/guides/rail-cart-buddies-guide | guide | 100 | 200 | 165ms | 115ms | 670ms | 83ms | 2384KB | 7 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/guides/telemount-walkthrough | guide | 100 | 200 | 158ms | 159ms | 626ms | 70ms | 2419KB | 10 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/games/drive-mad | game | 96 | 200 | 894ms | 2044ms | 2911ms | 94ms | 2432KB | 9 | yes | index | no | yes | yes | 1 console errors |
| /en/games/duo-vikings | game | 96 | 200 | 182ms | 107ms | 548ms | 74ms | 2416KB | 9 | yes | index | no | yes | yes | 1 console errors |
