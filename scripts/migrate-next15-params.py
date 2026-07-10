from pathlib import Path

root = Path('.')


def rep(path: str, old: str, new: str, count: int = -1) -> None:
    target = root / path
    content = target.read_text()
    if old not in content:
        raise RuntimeError(f'Missing expected text in {path}: {old[:120]!r}')
    target.write_text(content.replace(old, new, count))


for path, interface_name, component_name in [
    ('app/[locale]/about/page.tsx', 'AboutPageProps', 'AboutPage'),
    ('app/[locale]/contact/page.tsx', 'ContactPageProps', 'ContactPage'),
    ('app/[locale]/privacy/page.tsx', 'PrivacyPageProps', 'PrivacyPage'),
]:
    rep(path, '  params: { locale: string };', '  params: Promise<{ locale: string }>;')
    rep(
        path,
        f"export async function generateMetadata({{ params }}: {interface_name}): Promise<Metadata> {{\n  const locale = params.locale === 'zh' ? 'zh' : 'en';",
        f"export async function generateMetadata({{ params }}: {interface_name}): Promise<Metadata> {{\n  const {{ locale: localeParam }} = await params;\n  const locale = localeParam === 'zh' ? 'zh' : 'en';",
    )
    rep(
        path,
        f"export default function {component_name}({{ params }}: {interface_name}) {{\n  const isZh = params.locale === 'zh';",
        f"export default async function {component_name}({{ params }}: {interface_name}) {{\n  const {{ locale }} = await params;\n  const isZh = locale === 'zh';",
    )
    target = root / path
    target.write_text(target.read_text().replace('params.locale', 'locale'))

about = root / 'app/[locale]/about/page.tsx'
about.write_text(about.read_text().replace("name: 'Next.js 14'", "name: 'Next.js 15'"))

for path, interface_name, component_name in [
    ('app/[locale]/games/4399-sample/page.tsx', 'PageProps', 'Imported4399SamplePage'),
    ('app/[locale]/games/monster-survivors/page.tsx', 'MonsterSurvivorsPageProps', 'MonsterSurvivorsPage'),
    ('app/[locale]/games/solitaire/page.tsx', 'SolitairePageProps', 'SolitairePage'),
]:
    rep(path, '  params: { locale: string };', '  params: Promise<{ locale: string }>;')
    if 'generateMetadata' in (root / path).read_text():
        rep(
            path,
            f"export function generateMetadata({{ params }}: {interface_name}): Metadata {{\n  const locale = params.locale === 'zh' ? 'zh' : 'en';",
            f"export async function generateMetadata({{ params }}: {interface_name}): Promise<Metadata> {{\n  const {{ locale: localeParam }} = await params;\n  const locale = localeParam === 'zh' ? 'zh' : 'en';",
        )
    rep(
        path,
        f"export default async function {component_name}({{ params }}: {interface_name}) {{\n  const {{ locale }} = params;",
        f"export default async function {component_name}({{ params }}: {interface_name}) {{\n  const {{ locale }} = await params;",
    )

path = 'app/[locale]/games/[slug]/page.tsx'
rep(path, '  params: { locale: string; slug: string };', '  params: Promise<{ locale: string; slug: string }>;')
rep(
    path,
    'export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {\n  const { locale, slug } = params;',
    'export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {\n  const { locale, slug } = await params;',
)
rep(
    path,
    'export default async function GamePage({ params }: GamePageProps) {\n  const { locale, slug } = params;',
    'export default async function GamePage({ params }: GamePageProps) {\n  const { locale, slug } = await params;',
)

for path, interface_name, component_name, getter in [
    ('app/[locale]/games/category/[slug]/page.tsx', 'CategoryPageProps', 'CategoryPage', 'getCategoryEntry'),
    ('app/[locale]/games/tag/[slug]/page.tsx', 'TagPageProps', 'TagPage', 'getTagEntry'),
]:
    rep(path, '  params: { locale: string; slug: string };', '  params: Promise<{ locale: string; slug: string }>;')
    rep(
        path,
        f"export function generateMetadata({{ params }}: {interface_name}): Metadata {{\n  const locale = (params.locale as Locale) ?? 'zh';\n  const entry = {getter}(params.slug);",
        f"export async function generateMetadata({{ params }}: {interface_name}): Promise<Metadata> {{\n  const {{ locale: localeParam, slug }} = await params;\n  const locale = (localeParam as Locale) ?? 'zh';\n  const entry = {getter}(slug);",
    )
    rep(
        path,
        f"export default function {component_name}({{ params }}: {interface_name}) {{\n  const locale = (params.locale as Locale) ?? 'zh';\n  const entry = {getter}(params.slug);",
        f"export default async function {component_name}({{ params }}: {interface_name}) {{\n  const {{ locale: localeParam, slug }} = await params;\n  const locale = (localeParam as Locale) ?? 'zh';\n  const entry = {getter}(slug);",
    )

path = 'app/[locale]/games/page.tsx'
rep(path, '  params: { locale: string };\n  searchParams: {', '  params: Promise<{ locale: string }>;\n  searchParams: Promise<{')
rep(path, '    sortOrder?: string;\n  };', '    sortOrder?: string;\n  }>;')
rep(
    path,
    "export function generateMetadata({ params }: GamesPageProps): Metadata {\n  const locale = params.locale === 'zh' ? 'zh' : 'en';",
    "export async function generateMetadata({ params }: GamesPageProps): Promise<Metadata> {\n  const { locale: localeParam } = await params;\n  const locale = localeParam === 'zh' ? 'zh' : 'en';",
)
rep(
    path,
    "export default async function GamesPage({ params, searchParams }: GamesPageProps) {\n  const locale = locales.includes(params.locale as Locale)\n    ? (params.locale as Locale)\n    : 'zh';",
    "export default async function GamesPage({ params, searchParams }: GamesPageProps) {\n  const [{ locale: localeParam }, resolvedSearchParams] = await Promise.all([params, searchParams]);\n  const locale = locales.includes(localeParam as Locale)\n    ? (localeParam as Locale)\n    : 'zh';",
)
target = root / path
target.write_text(target.read_text().replace('searchParams.', 'resolvedSearchParams.'))

path = 'app/[locale]/guides/[slug]/page.tsx'
rep(
    path,
    "export function generateMetadata({\n  params,\n}: {\n  params: { locale: string; slug: string };\n}): Metadata {\n  const page = getSeoLandingPage(params.slug);",
    "export async function generateMetadata({\n  params,\n}: {\n  params: Promise<{ locale: string; slug: string }>;\n}): Promise<Metadata> {\n  const { locale: localeParam, slug } = await params;\n  const page = getSeoLandingPage(slug);",
)
rep(path, "  const locale = (params.locale as Locale) ?? 'zh';", "  const locale = (localeParam as Locale) ?? 'zh';", 1)
rep(path, '  params: { locale: string; slug: string };', '  params: Promise<{ locale: string; slug: string }>;')
rep(
    path,
    "export default function GuidePage({ params }: GuidePageProps) {\n  const locale = (params.locale as Locale) ?? 'zh';\n  const page = getSeoLandingPage(params.slug);",
    "export default async function GuidePage({ params }: GuidePageProps) {\n  const { locale: localeParam, slug } = await params;\n  const locale = (localeParam as Locale) ?? 'zh';\n  const page = getSeoLandingPage(slug);",
)

path = 'app/[locale]/guides/no-download-games/page.tsx'
rep(
    path,
    "export function generateMetadata({ params }: { params: { locale: string } }): Metadata {\n  const locale = (params.locale as Locale) ?? 'zh';",
    "export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {\n  const { locale: localeParam } = await params;\n  const locale = (localeParam as Locale) ?? 'zh';",
)
rep(
    path,
    "export default function NoDownloadGamesPage({ params }: { params: { locale: string } }) {\n  const locale = (params.locale as Locale) ?? 'zh';",
    "export default async function NoDownloadGamesPage({ params }: { params: Promise<{ locale: string }> }) {\n  const { locale: localeParam } = await params;\n  const locale = (localeParam as Locale) ?? 'zh';",
)

path = 'app/[locale]/guides/page.tsx'
rep(
    path,
    "export function generateMetadata({ params }: { params: { locale: string } }): Metadata {\n  const locale = (params.locale as Locale) ?? 'zh';",
    "export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {\n  const { locale: localeParam } = await params;\n  const locale = (localeParam as Locale) ?? 'zh';",
)
rep(path, '  params: { locale: string };', '  params: Promise<{ locale: string }>;')
rep(
    path,
    "export default function GuidesPage({ params }: GuidesPageProps) {\n  const locale = (params.locale as Locale) ?? 'zh';",
    "export default async function GuidesPage({ params }: GuidesPageProps) {\n  const { locale: localeParam } = await params;\n  const locale = (localeParam as Locale) ?? 'zh';",
)

path = 'app/[locale]/guides/quick-play-guide/page.tsx'
rep(
    path,
    "export function generateMetadata({ params }: { params: { locale: string } }): Metadata {\n  const locale = (params.locale as Locale) ?? 'zh';",
    "export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {\n  const { locale: localeParam } = await params;\n  const locale = (localeParam as Locale) ?? 'zh';",
)
rep(
    path,
    "export default function Page({ params }: { params: { locale: string } }) {\n  const locale = (params.locale as Locale) ?? 'zh';",
    "export default async function Page({ params }: { params: Promise<{ locale: string }> }) {\n  const { locale: localeParam } = await params;\n  const locale = (localeParam as Locale) ?? 'zh';",
)

path = 'app/[locale]/layout.tsx'
rep(path, '  params: { locale: string };', '  params: Promise<{ locale: string }>;')
rep(
    path,
    "export async function generateMetadata({\n  params: { locale },\n}: LocaleLayoutProps): Promise<Metadata> {\n  const typedLocale = locale as Locale;",
    "export async function generateMetadata({\n  params,\n}: LocaleLayoutProps): Promise<Metadata> {\n  const { locale } = await params;\n  const typedLocale = locale as Locale;",
)
rep(
    path,
    "export default async function LocaleLayout({\n  children,\n  params: { locale },\n}: LocaleLayoutProps) {\n  const typedLocale = locale as Locale;",
    "export default async function LocaleLayout({\n  children,\n  params,\n}: LocaleLayoutProps) {\n  const { locale } = await params;\n  const typedLocale = locale as Locale;",
)

path = 'app/[locale]/page.tsx'
rep(
    path,
    "  params: { locale: string };\n}) {\n  const locale = locales.includes(params.locale as Locale)\n    ? (params.locale as Locale)\n    : 'zh';",
    "  params: Promise<{ locale: string }>;\n}) {\n  const { locale: localeParam } = await params;\n  const locale = locales.includes(localeParam as Locale)\n    ? (localeParam as Locale)\n    : 'zh';",
)

path = 'app/[locale]/search/page.tsx'
rep(path, '  params: { locale: string };\n  searchParams: { q?: string; page?: string };', '  params: Promise<{ locale: string }>;\n  searchParams: Promise<{ q?: string; page?: string }>;')
rep(
    path,
    'export default async function SearchPage({ params, searchParams }: SearchPageProps) {\n  const locale = params.locale;',
    'export default async function SearchPage({ params, searchParams }: SearchPageProps) {\n  const [{ locale }, resolvedSearchParams] = await Promise.all([params, searchParams]);',
)
target = root / path
target.write_text(target.read_text().replace('searchParams.q', 'resolvedSearchParams.q').replace('searchParams.page', 'resolvedSearchParams.page'))

path = 'app/api/admin/games/[id]/route.ts'
rep(path, 'export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {', 'export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {')
rep(path, '  const gameId = Number(params.id);', '  const { id } = await params;\n  const gameId = Number(id);')

path = 'app/api/admin/ratings/[id]/route.ts'
rep(path, 'export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {', 'export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {')
rep(path, '  const ratingId = Number(params.id);', '  const { id } = await params;\n  const ratingId = Number(id);')

path = 'app/api/counters/[id]/increment/route.ts'
rep(path, '  { params }: { params: { id: string } },\n) {\n  const gameId = parseId(params.id);', '  { params }: { params: Promise<{ id: string }> },\n) {\n  const { id } = await params;\n  const gameId = parseId(id);')

path = 'app/api/counters/[id]/route.ts'
rep(path, '  { params }: { params: { id: string } },\n) {\n  const gameId = parseId(params.id);', '  { params }: { params: Promise<{ id: string }> },\n) {\n  const { id } = await params;\n  const gameId = parseId(id);')

path = 'app/api/games/[id]/route.ts'
target = root / path
content = target.read_text().replace('  { params }: { params: { id: string } },', '  { params }: { params: Promise<{ id: string }> },')
content = content.replace('  const gameId = parseId(params.id);', '  const { id } = await params;\n  const gameId = parseId(id);')
target.write_text(content)

path = 'app/api/games/slug/[slug]/route.ts'
rep(path, '  { params }: { params: { slug: string } },\n) {\n  const slug = params.slug.trim().toLowerCase();', '  { params }: { params: Promise<{ slug: string }> },\n) {\n  const { slug: slugParam } = await params;\n  const slug = slugParam.trim().toLowerCase();')

path = 'app/api/ratings/[id]/route.ts'
rep(path, '  { params }: { params: { id: string } },', '  { params }: { params: Promise<{ id: string }> },')
rep(path, '  const ratingId = parseId(params.id);', '  const { id } = await params;\n  const ratingId = parseId(id);')

print('Migrated Next.js 15 async route and page parameters.')
