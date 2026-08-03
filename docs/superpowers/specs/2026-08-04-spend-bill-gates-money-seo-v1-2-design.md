# Spend Bill Gates Money SEO v1.2 Design

## Goal

Strengthen the live `Spend Bill Gates Money` page as an indexable, shareable, bilingual search landing page without changing its game rules or introducing new dependencies.

## Verified baseline

- Canonical routes exist at `/games/spend-bill-gates-money` and `/en/games/spend-bill-gates-money`.
- The page already outputs canonical, hreflang, Open Graph, Twitter, `VideoGame`, `FAQPage`, and `BreadcrumbList` metadata.
- `/games` already contains a Luma Original entry outside catalogue pagination.
- `robots.txt` allows public crawling and points to `/sitemap.xml`.
- The sitemap includes both localized game URLs but originally had no `lastModified` and used priority `0.55`.
- An IndexNow implementation already exists: pure validation helpers, tests, a CLI, package script, and key file `public/9140751f1bbe87e8c99a338470f94cbc.txt`.
- The production custom domain is attached to Vercel project `251001-web-gamehub-rdg6`, not the similarly named mirror projects.

## Scope

### 1. Long-tail search coverage

Add useful bilingual sections that naturally address:

- spend bill gates money game online
- spend bill gates money simulator
- spend 100 billion dollars game
- billionaire spending simulator online
- spend bill gates money mobile
- spend bill gates money no download
- money spending game with buy and sell
- what can you buy with 100 billion dollars
- 花光比尔盖茨的钱游戏
- 比尔盖茨花钱模拟器
- 1000亿美元能买什么
- 亿万富翁消费模拟器
- 在线花钱游戏

Required modules:

1. How to play / 怎么玩
2. Mobile and no-download support / 手机与免下载
3. Buy and remove items / 增加、减少与退款
4. What $100 billion can buy / 1000亿美元可以买什么
5. Why the game uses a fixed balance / 为什么采用固定金额

FAQ expands from three to five questions by adding mobile/no-download and reversible purchases.

### 2. Dedicated social preview

Add a stable 1200×630 PNG response route using Next.js `ImageResponse` and reference it from Open Graph, Twitter, and `VideoGame` structured data. The image must remain readable at small sizes and include an unofficial-entertainment notice.

### 3. Internal links

Keep the existing `/games` entry and show a contextual inbound-link component only on:

- localized homepage
- `games-to-play-when-bored`
- `best-browser-games-5-minute-break`
- `free-games-no-ads`

The component uses the current pathname, varied localized anchor text, and `getLocalizedPath()`. It must not alter catalogue totals or create a fake iframe game record.

### 4. Sitemap and robots

- Keep the current public crawl rules and sitemap reference.
- Change this standalone game to `weekly`, priority `0.75`, and an explicit `lastModified` date shared from one SEO constants module.
- Keep Chinese and English generation through the existing locale loop.

### 5. IndexNow

Reuse and verify the existing protocol implementation without a new package:

- keep root key file `public/9140751f1bbe87e8c99a338470f94cbc.txt`
- keep the tested Node/tsx bulk submission CLI using `https://api.indexnow.org/indexnow`
- add a GitHub Actions workflow for relevant `main` changes and manual dispatch
- wait until the formal domain exposes SEO v1.2 before notifying IndexNow
- submit only the ten changed localized URLs, not the historical sitemap
- preserve validation for HTTPS, host, duplicates, empty batches, and the 10,000 URL limit
- treat HTTP 200 and 202 as accepted; fail on other responses

IndexNow requests discovery and never guarantees crawling, indexing, ranking, impressions, or clicks.

### 6. External reference

Add a contextual Luma Original link to the public GitHub README. This is the only external backlink created in code. Do not claim unverified X, Telegram, directory, or third-party links.

### 7. Execution record

Keep a release record with:

- feature and backup branches
- starting and final commits
- changed files
- exact CI evidence
- formal-domain Vercel project and deployment
- IndexNow request result
- Bing Webmaster account data that remains unavailable
- known limitations and observation window

## Non-goals

- No database, game-rule, price, identity, tracking-event, dependency, global-CSS, Tailwind, or generic iframe-route changes.
- No dynamic per-user result image or live net-worth feed.
- No duplicate keyword landing pages, paid backlinks, reciprocal links, fabricated references, or indexing guarantees.

## Acceptance criteria

1. English and Chinese metadata remain canonical and localized.
2. The dedicated PNG route is referenced by Open Graph and Twitter metadata.
3. The page contains all five useful SEO modules and five localized FAQs.
4. The homepage and three approved guides link contextually to the game.
5. The existing `/games` entry remains intact and outside pagination totals.
6. robots continues to allow the page and reference the sitemap.
7. Sitemap emits both URLs with weekly frequency, priority `0.75`, and `lastModified`.
8. Existing IndexNow tests remain green and the formal-domain workflow submits only changed URLs.
9. README contains a contextual canonical link.
10. Lint, type check, internal-link audit, unit tests, production audit, build, and Playwright pass before merge.
