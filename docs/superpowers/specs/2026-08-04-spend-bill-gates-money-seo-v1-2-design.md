# Spend Bill Gates Money SEO v1.2 Design

## Goal

Strengthen the live `Spend Bill Gates Money` page as an indexable, shareable, bilingual search landing page without changing its game rules or introducing new dependencies.

## Verified baseline

- Canonical routes already exist at `/games/spend-bill-gates-money` and `/en/games/spend-bill-gates-money`.
- The page already outputs canonical, hreflang, Open Graph, Twitter, `VideoGame`, `FAQPage`, and `BreadcrumbList` metadata.
- `/games` already contains a Luma Original entry linking to the game.
- `robots.txt` already allows public crawling and points to `/sitemap.xml`.
- The sitemap already includes both localized game URLs, but the standalone entry has no `lastModified` and uses a low `0.55` priority.
- The production custom domain is attached to Vercel project `251001-web-gamehub-rdg6`, not the similarly named mirror projects.

## Scope

### 1. Long-tail search coverage

Expand the page with useful bilingual sections that naturally cover:

- spend bill gates money game online
- spend bill gates money simulator
- spend 100 billion dollars game
- billionaire spending simulator online
- spend bill gates money mobile
- spend bill gates money no download
- money spending game with buy and sell
- what can you buy with 100 billion dollars
- how to spend 100 billion dollars
- 花光比尔盖茨的钱游戏
- 比尔盖茨花钱模拟器
- 1000亿美元能买什么
- 亿万富翁消费模拟器
- 在线花钱游戏

The page must add real explanatory value rather than repeating keywords. Required modules:

1. How to play / 怎么玩
2. Mobile and no-download support / 手机与免下载
3. Buy and remove items / 增加与减少商品
4. What $100 billion can buy / 1000 亿美元可以买什么
5. Why the game uses a fixed balance / 为什么采用固定金额

FAQ expands from three to five questions by adding mobile/no-download and reversible purchases.

### 2. Dedicated social preview

Add a 1200×630 PNG dedicated to this game and use it for Open Graph and Twitter metadata. It must be readable at small sizes and must not claim affiliation with Bill Gates or Microsoft.

### 3. Internal links

Keep the existing `/games` entry and add contextual inbound links from:

- localized homepage
- `games-to-play-when-bored`
- `best-browser-games-5-minute-break`
- `free-games-no-ads`

Use varied, natural anchor text. Do not alter catalogue totals or create a fake iframe game record.

### 4. Sitemap and robots

- Keep the current public crawl rules.
- Preserve the sitemap reference in robots.
- Change the standalone game sitemap record to `weekly`, priority `0.75`, with a real `lastModified` date shared from one SEO constants module.
- Keep Chinese and English generation through the existing locale loop.

### 5. IndexNow

Implement the official protocol without a new package:

- host a root key file at `public/4accfd418d9633ccd239a4ed51d4f6b4.txt`
- add a Node/tsx bulk submission script using `https://api.indexnow.org/indexnow`
- submit only current changed URLs, not the entire historical sitemap
- add a GitHub Actions workflow restricted to relevant paths on `main` and manual dispatch
- validate host ownership, URL host, protocol, duplicates, and the 10,000 URL protocol limit
- treat HTTP 200 and 202 as accepted; report 4xx/5xx as failures

Default changed URLs:

- `https://www.lumagamehub.com/games/spend-bill-gates-money`
- `https://www.lumagamehub.com/en/games/spend-bill-gates-money`
- `https://www.lumagamehub.com/`
- `https://www.lumagamehub.com/en`
- the three localized guide pairs receiving new inbound links

IndexNow notification is discovery, not an indexing guarantee.

### 6. External reference

Add a contextual Luma Original link to the public GitHub README. This is the only external backlink created in code. Do not claim that X, Telegram, directories, or third parties have linked to the page unless independently verified.

### 7. Execution record

Create a release record documenting:

- branch and backup branch
- files changed
- verified tests and exact commit
- Vercel custom-domain project
- IndexNow request status
- Bing Webmaster account data that remains unavailable
- known limitations and next observation window

## Non-goals

- No new database tables or API routes.
- No dynamic OG result image.
- No live Bill Gates net-worth feed.
- No keyword-stuffed duplicate landing pages.
- No paid, automated, reciprocal, or fabricated backlinks.
- No change to game prices, identity rules, purchase behavior, analytics event names, global CSS, Tailwind config, or dependencies.

## Acceptance criteria

1. English and Chinese metadata remain canonical and localized.
2. Dedicated PNG is referenced by Open Graph and Twitter metadata.
3. Page contains all five useful SEO modules and five bilingual FAQs.
4. Homepage and three guide pages link contextually to the game.
5. Existing `/games` entry remains intact and pagination totals remain unchanged.
6. robots continues to allow the page and reference the sitemap.
7. Sitemap emits both URLs with weekly frequency, priority 0.75, and lastModified.
8. IndexNow key file and bulk script pass focused tests.
9. README contains a contextual external link to the English canonical page.
10. Lint, type check, internal-link audit, unit tests, production audit, build, and Playwright all pass before merge.
