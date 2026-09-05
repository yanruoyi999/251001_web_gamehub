# Luma Game Hub

Luma Game Hub is a bilingual browser-game catalogue and editorial guide site built with Next.js. It combines instant-play game pages, searchable categories and tags, original interactive experiences, practical walkthroughs, SEO landing pages, analytics, and a lightweight admin surface.

## Live site

- Website: <https://www.lumagamehub.com>
- English games: <https://www.lumagamehub.com/en/games>
- Chinese games: <https://www.lumagamehub.com/games>

## Luma Original

- [Spend Bill Gates Money](https://www.lumagamehub.com/en/games/spend-bill-gates-money) — a bilingual, mobile-friendly $100 billion spending simulator with reversible purchases, a fixed fortune HUD, and shareable billionaire identities.

## Current stack

- Next.js 15.5.25
- React 19.2.7
- TypeScript 5.9.3
- Tailwind CSS 3.4.17
- next-intl 4.13.1
- Vitest 3.2.7
- Playwright 1.55.1
- pnpm 10.28.0
- Optional PostgreSQL/Drizzle, Redis, Meilisearch, and Cloudinary integrations
- Vercel deployment with GA4, Clarity, Vercel Analytics, and Speed Insights

## Local development

Requirements:

- Node.js 22.x
- pnpm 10.28.0

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

The public site is available at `http://localhost:3000`. Optional database, cache, search, media, and admin settings are documented in `.env.example` and `docs/setup/`.

## Quality gates

```bash
pnpm lint
pnpm type-check
pnpm check:internal-links
pnpm check:source-evidence
pnpm test
pnpm audit --prod
pnpm build
pnpm test:e2e
```

The GitHub Actions CI workflow runs the repository gates for pull requests. Browser E2E covers Chromium, Firefox, WebKit, Pixel 7, and iPhone 13, followed by a mobile runtime-quality sampling gate.

For safety, an unset or unknown `GAME_CATALOG_MODE` falls back to the checked-in local catalogue. Set it explicitly to `remote` only when the production database and write-path configuration have been reviewed. GA4, Vercel Analytics, Speed Insights, and Clarity are isolated from local/preview hosts; on the formal production domain GA4 and Clarity load automatically, with Clarity ad storage disabled and analytics storage enabled.

## Main routes

```text
/[locale]                         Localized homepage
/[locale]/games                   Searchable game catalogue
/[locale]/games/[slug]            Generic game detail route
/[locale]/games/spend-bill-gates-money
/[locale]/guides                  Editorial guide archive
/[locale]/guides/[slug]           SEO/editorial guide route
/admin                            Admin surface
/robots.txt                       Crawl policy
/sitemap.xml                      Localized sitemap
```

Chinese uses the unprefixed public route and English uses `/en`.

## Project structure

```text
app/                 Next.js App Router pages, metadata routes, and APIs
components/          Layout, game, analytics, feedback, SEO, and UI components
lib/                 Catalogue, SEO, analytics, database, and utility modules
services/            Application service layer
tests/               Vitest and Playwright coverage
docs/                Specifications, plans, setup, release, and audit records
scripts/             Quality, import, monitoring, and SEO operations
public/              Static images, icons, verification files, and manifests
```

## Documentation

- Deployment: [`docs/setup/deployment.md`](docs/setup/deployment.md)
- External services: [`docs/setup/external-services.md`](docs/setup/external-services.md)
- Current implementation specifications: [`docs/superpowers/specs/`](docs/superpowers/specs/)
- Execution plans: [`docs/superpowers/plans/`](docs/superpowers/plans/)
- Release records: [`docs/releases/`](docs/releases/)

## Contribution

Use Conventional Commits and keep changes focused. New public pages should include localized metadata, canonical and hreflang handling, structured data where appropriate, sitemap discovery, contextual internal links, accessibility checks, and automated coverage.

## License

Game and asset rights are source-specific; there is no blanket license for embedded third-party games. See the per-runtime notices in `public/games-runtime/` and the evidence records in [`docs/licenses/`](docs/licenses/). Frozen legacy source exceptions are not verified permissions.
