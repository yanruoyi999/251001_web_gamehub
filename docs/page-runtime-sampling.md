# Luma Runtime Quality Sampling

Generated: 2026-07-22T00:05:10.564Z
Base URL: http://127.0.0.1:3030

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
| /en | static | 88 | 200 | 103ms | 80ms | 125ms | 97ms | 241KB | 24 | yes | index | no | n/a | n/a | 4 console errors |
| /en/games | static | 88 | 200 | 64ms | 27ms | 84ms | 64ms | 327KB | 25 | yes | index | no | n/a | n/a | 4 console errors |
| /en/guides/games-like-ovo | guide | 88 | 200 | 16ms | 12ms | 68ms | 44ms | 193KB | 20 | yes | index | no | n/a | n/a | 4 console errors |
| /en/guides/google-snake-mods | guide | 88 | 200 | 9ms | 13ms | 69ms | 47ms | 194KB | 20 | yes | index | no | n/a | n/a | 4 console errors |
| /en/guides/big-tower-tiny-square-2-walkthrough | guide | 88 | 200 | 12ms | 13ms | 70ms | 48ms | 198KB | 20 | yes | index | no | n/a | n/a | 4 console errors |
| /en/guides/obby-parkour-with-ragdoll-guide | guide | 88 | 200 | 11ms | 12ms | 70ms | 45ms | 186KB | 19 | yes | index | no | n/a | n/a | 4 console errors |
| /en/guides/rail-cart-buddies-guide | guide | 88 | 200 | 11ms | 12ms | 76ms | 73ms | 186KB | 19 | yes | index | no | n/a | n/a | 4 console errors |
| /en/guides/telemount-walkthrough | guide | 88 | 200 | 11ms | 12ms | 73ms | 53ms | 186KB | 19 | yes | index | no | n/a | n/a | 4 console errors |
| /en/games/drive-mad | game | 88 | 200 | 19ms | 14ms | 80ms | 61ms | 193KB | 19 | yes | index | no | yes | yes | 4 console errors |
| /en/games/duo-vikings | game | 88 | 200 | 19ms | 18ms | 91ms | 74ms | 190KB | 19 | yes | index | no | yes | yes | 4 console errors |
