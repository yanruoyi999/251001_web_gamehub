# Luma Runtime Quality Sampling

Generated: 2026-08-15T13:52:34.632Z
Base URL: http://127.0.0.1:3107

Scope: mobile Playwright sampling for high-value indexable pages. This is a companion gate for `docs/page-quality-scorecard.md`, adding runtime performance, mobile layout, and actual playable-iframe checks that static scoring cannot prove. Analytics collection is blocked during sampling so automated visits do not contaminate GA4, Clarity, or Vercel telemetry. TTFB/transport is reported separately; page timing scores use response-relative DCL/FCP/load so one noisy network route does not downgrade every page equally.

## Thresholds

- Sampled pages must score 80 or higher before being treated as hardened index targets.
- Game pages must expose the Play button on mobile, load an iframe after the click, and keep the Luma fullscreen control visible.
- Pages are penalized for missing canonical tags, mobile horizontal overflow, slow load/FCP, excessive transfer size, many requests, and console/page errors.

## Summary

- Sampled pages: 10
- Under 80: 0
- Minimum score: 88

## Samples

| Path | Type | Score | Status | TTFB | DCL after response | Load after response | FCP after response | Transfer | Requests | Canonical | Robots | Mobile overflow | Playable | Fullscreen | Reason |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- | --- | --- |
| /en | static | 100 | 200 | 29ms | 102ms | 682ms | 135ms | 180KB | 16 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/games | static | 88 | 200 | 46ms | 59ms | 117ms | 86ms | 359KB | 28 | yes | index | no | n/a | n/a | 4 console errors |
| /en/guides/games-like-ovo | guide | 88 | 200 | 29ms | 70ms | 141ms | 95ms | 210KB | 21 | yes | index | no | n/a | n/a | 4 console errors |
| /en/guides/google-snake-mods | guide | 88 | 200 | 10ms | 17ms | 84ms | 62ms | 211KB | 21 | yes | index | no | n/a | n/a | 4 console errors |
| /en/guides/big-tower-tiny-square-2-walkthrough | guide | 88 | 200 | 13ms | 16ms | 76ms | 51ms | 215KB | 21 | yes | index | no | n/a | n/a | 4 console errors |
| /en/guides/obby-parkour-with-ragdoll-guide | guide | 88 | 200 | 19ms | 55ms | 104ms | 69ms | 203KB | 20 | yes | index | no | n/a | n/a | 4 console errors |
| /en/guides/rail-cart-buddies-guide | guide | 88 | 200 | 15ms | 17ms | 97ms | 57ms | 203KB | 20 | yes | index | no | n/a | n/a | 4 console errors |
| /en/guides/telemount-walkthrough | guide | 88 | 200 | 18ms | 18ms | 83ms | 58ms | 238KB | 23 | yes | index | no | n/a | n/a | 4 console errors |
| /en/games/drive-mad | game | 88 | 200 | 20ms | 96ms | 98ms | 76ms | 211KB | 22 | yes | index | no | yes | yes | 4 console errors |
| /en/games/duo-vikings | game | 88 | 200 | 21ms | 57ms | 92ms | 71ms | 205KB | 22 | yes | index | no | yes | yes | 4 console errors |
