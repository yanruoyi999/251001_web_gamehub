from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def write(path: str, content: str) -> None:
    target = ROOT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content, encoding="utf-8")


def replace_once(content: str, old: str, new: str, label: str) -> str:
    count = content.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected one match, found {count}")
    return content.replace(old, new, 1)


def insert_before(content: str, marker: str, insertion: str, label: str) -> str:
    return replace_once(content, marker, insertion + marker, label)


def font(size: int, bold: bool = False):
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf",
    ]
    for candidate in candidates:
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, size=size)
    return ImageFont.load_default()


def create_og_image() -> None:
    width, height = 1200, 630
    image = Image.new("RGB", (width, height), "#07111f")
    draw = ImageDraw.Draw(image)

    for y in range(height):
        ratio = y / (height - 1)
        r = int(7 + (17 - 7) * ratio)
        g = int(17 + (24 - 17) * ratio)
        b = int(31 + (39 - 31) * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))

    draw.ellipse((820, -180, 1320, 320), fill="#15233a")
    draw.ellipse((-180, 380, 300, 860), fill="#0f2a35")
    draw.rounded_rectangle((66, 54, 1134, 576), radius=42, outline="#f5c84c", width=4)

    gold = "#f5c84c"
    white = "#f8fafc"
    muted = "#a9b4c4"

    draw.text((100, 92), "LUMA ORIGINAL", font=font(28, True), fill=gold)
    draw.text((100, 156), "SPEND BILL GATES MONEY", font=font(56, True), fill=white)
    draw.text((100, 254), "$100 BILLION", font=font(96, True), fill=gold)
    draw.text((104, 386), "BUY  •  REMOVE  •  SHARE YOUR BILLIONAIRE IDENTITY", font=font(30, True), fill=white)
    draw.text((104, 454), "Free browser game • Mobile friendly • No download", font=font(27), fill=muted)
    draw.text((104, 522), "UNOFFICIAL ENTERTAINMENT GAME", font=font(21, True), fill="#77869b")

    target = ROOT / "public/og/spend-bill-gates-money.png"
    target.parent.mkdir(parents=True, exist_ok=True)
    image.save(target, format="PNG", optimize=True)


def patch_constants() -> None:
    write(
        "lib/games/spend-bill-gates-money-seo.ts",
        """export const SPEND_BILL_GATES_MONEY_PATH =\n  '/games/spend-bill-gates-money' as const;\n\nexport const SPEND_BILL_GATES_MONEY_PUBLISHED_AT =\n  '2026-08-03T00:00:00.000Z' as const;\n\nexport const SPEND_BILL_GATES_MONEY_UPDATED_AT =\n  '2026-08-04T00:00:00.000Z' as const;\n\nexport const SPEND_BILL_GATES_MONEY_OG_IMAGE =\n  '/og/spend-bill-gates-money.png' as const;\n\nexport const SPEND_BILL_GATES_MONEY_GUIDE_LINK_SLUGS = [\n  'games-to-play-when-bored',\n  'best-browser-games-5-minute-break',\n  'free-games-no-ads',\n] as const;\n""",
    )


def patch_game_page() -> None:
    path = "app/[locale]/games/spend-bill-gates-money/page.tsx"
    content = read(path)

    content = replace_once(
        content,
        "import {\n  DEFAULT_OPEN_GRAPH_IMAGES,\n  DEFAULT_TWITTER_IMAGES,\n  buildAbsoluteUrl,\n} from '@/lib/seo';",
        "import { buildAbsoluteUrl } from '@/lib/seo';",
        "game page SEO import",
    )
    content = insert_before(
        content,
        "import { serializeJsonLd } from '@/lib/utils/json-ld';",
        "import {\n  SPEND_BILL_GATES_MONEY_OG_IMAGE,\n  SPEND_BILL_GATES_MONEY_PATH,\n  SPEND_BILL_GATES_MONEY_PUBLISHED_AT,\n  SPEND_BILL_GATES_MONEY_UPDATED_AT,\n} from '@/lib/games/spend-bill-gates-money-seo';\n",
        "game page constants import",
    )

    zh_modules = """    howToTitle: '怎么玩花光比尔盖茨的钱游戏',
    howToBody:
      '点击开始后，你会得到固定的1000亿美元游戏余额。使用每张商品卡右侧的加号购买，观察顶部余额和百分比变化；至少购买一件商品后，可以从固定财富栏或购买记录底部查看结果。这个在线花钱游戏会按你的消费类别生成亿万富翁身份。',
    mobileTitle: '手机能玩，而且无需下载',
    mobileBody:
      '这款比尔盖茨花钱模拟器直接在现代手机和桌面浏览器中运行，不需要安装应用、注册账号或上传个人信息。开始游戏后，财富总额和进度条会固定在网站导航栏下方，向下浏览商品时仍然可见。',
    buySellTitle: '如何增加、减少和退回商品金额',
    buySellBody:
      '它是一款支持加减数量的在线花钱游戏：点击加号购买一件，点击减号移除一件并把对应游戏金额退回余额。所有金额都使用整数美元计算，余额不会低于零，方便反复比较不同消费组合。',
    whatCanBuyTitle: '1000亿美元能买什么？',
    whatCanBuyBody:
      '1000亿美元可以买私人飞机、超级游艇、私人岛屿、NBA球队、足球俱乐部、摩天大楼、太空计划、学校、医院和气候研究，也可以买黄金马桶等故意夸张的商品。不同选择让你直观看到百万、十亿和百亿美元之间的数量级差异。',
    fixedBalanceTitle: '为什么游戏使用固定的1000亿美元',
    fixedBalanceBody:
      '真实净资产会随市场每天变化，不适合让同一局游戏保持一致。本页使用固定的1000亿美元作为玩法基准，使每位用户面对同一预算，也避免把娱乐数值误写成比尔·盖茨当前财富的实时估值。',
"""
    content = insert_before(
        content,
        "    faqTitle: '常见问题',",
        zh_modules,
        "Chinese SEO modules",
    )

    en_modules = """    howToTitle: 'How to play the Spend Bill Gates Money game online',
    howToBody:
      'Press Start Spending to receive a fixed $100 billion gameplay balance. Use the plus button on a product card to buy an item, watch the fixed fortune bar update, and generate a result after at least one purchase. The simulator assigns a billionaire identity from the categories where you spent the most.',
    mobileTitle: 'Play on mobile with no download or account',
    mobileBody:
      'This Spend Bill Gates Money simulator runs directly in modern mobile and desktop browsers. It needs no app installation, account, or personal-data upload. After the game starts, the fortune total and progress bar remain fixed below the site header while you browse the product list.',
    buySellTitle: 'A money spending game with buy and sell controls',
    buySellBody:
      'Use plus to buy another unit and minus to remove one and refund its gameplay price. The reversible controls let you compare different $100 billion plans without restarting. Prices use integer dollars, and the remaining balance can never drop below zero.',
    whatCanBuyTitle: 'What can you buy with 100 billion dollars?',
    whatCanBuyBody:
      'The list ranges from private jets, yachts, islands, sports teams, and skyscrapers to schools, hospitals, climate research, and a space program. Deliberately absurd options such as a golden toilet make the scale of millions and billions easier to compare.',
    fixedBalanceTitle: 'Why this billionaire spending simulator uses a fixed balance',
    fixedBalanceBody:
      'Real net worth changes with markets and asset values. A fixed $100 billion keeps every player on the same budget and prevents an entertainment figure from being presented as a live estimate of Bill Gates’ current wealth.',
"""
    content = insert_before(
        content,
        "    faqTitle: 'Frequently asked questions',",
        en_modules,
        "English SEO modules",
    )

    zh_faq_marker = """      {
        question: '用比尔·盖茨的钱能买什么？',
        answer:
          '游戏提供15种选择，包括私人飞机、超级游艇、私人岛屿、NBA球队、摩天大楼、太空计划、100所学校、医院、气候研究、黄金马桶和月球陨石坑命名等。',
      },
"""
    zh_faq_extra = zh_faq_marker + """      {
        question: '花光比尔·盖茨的钱可以在手机上玩吗？',
        answer:
          '可以。页面支持现代手机浏览器，不需要下载应用或登录。开始游戏后，财富总额和进度条会固定在网站导航栏下方。',
      },
      {
        question: '购买后可以减少商品数量并退回金额吗？',
        answer:
          '可以。每张商品卡都有加号、数量和减号；点击减号会移除一件商品，并把对应的游戏金额完整退回余额。',
      },
"""
    content = replace_once(content, zh_faq_marker, zh_faq_extra, "Chinese FAQ expansion")

    en_faq_marker = """      {
        question: \"What can you buy with Bill Gates' money?\",
        answer:
          'The 15 choices include private jets, a super yacht, a private island, an NBA team, a skyscraper, a space program, 100 schools, hospitals, climate research, a golden toilet, and the right to name a moon crater.',
      },
"""
    en_faq_extra = en_faq_marker + """      {
        question: 'Can I play Spend Bill Gates Money on mobile?',
        answer:
          'Yes. The page works in modern mobile browsers with no app download or account. After the game starts, the fortune total and progress bar remain fixed below the site header.',
      },
      {
        question: 'Can I remove purchases and get the money back?',
        answer:
          'Yes. Each product card has plus, quantity, and minus controls. Minus removes one unit and refunds the full gameplay price to your balance.',
      },
"""
    content = replace_once(content, en_faq_marker, en_faq_extra, "English FAQ expansion")

    old_zh_keywords = """        ? ['花光比尔盖茨的钱', '亿万富翁模拟器', '花钱游戏', '1000亿美元']"""
    new_zh_keywords = """        ? [
            '花光比尔盖茨的钱',
            '花光比尔盖茨的钱游戏',
            '比尔盖茨花钱模拟器',
            '亿万富翁消费模拟器',
            '在线花钱游戏',
            '1000亿美元能买什么',
          ]"""
    content = replace_once(content, old_zh_keywords, new_zh_keywords, "Chinese metadata keywords")

    old_en_keywords = """        : [
            'spend bill gates money',
            'billionaire simulator',
            'spend 100 billion',
            'money spending game',
          ],"""
    new_en_keywords = """        : [
            'spend bill gates money',
            'spend bill gates money game online',
            'spend bill gates money simulator',
            'spend 100 billion dollars game',
            'billionaire spending simulator online',
            'spend bill gates money mobile',
            'spend bill gates money no download',
            'money spending game with buy and sell',
            'what can you buy with 100 billion dollars',
          ],"""
    content = replace_once(content, old_en_keywords, new_en_keywords, "English metadata keywords")

    canonical_marker = """  const canonical = getLocalizedPath(
    locale,
    '/games/spend-bill-gates-money',
  );

  return {
"""
    canonical_replacement = """  const canonical = getLocalizedPath(
    locale,
    SPEND_BILL_GATES_MONEY_PATH,
  );
  const socialImage = {
    url: buildAbsoluteUrl(SPEND_BILL_GATES_MONEY_OG_IMAGE),
    width: 1200,
    height: 630,
    alt:
      locale === 'zh'
        ? '花光比尔·盖茨的钱：1000亿美元消费模拟器'
        : 'Spend Bill Gates Money: $100 billion spending simulator',
  };

  return {
"""
    content = replace_once(content, canonical_marker, canonical_replacement, "metadata social image")
    content = replace_once(content, "      images: DEFAULT_OPEN_GRAPH_IMAGES,", "      images: [socialImage],", "Open Graph image")
    content = replace_once(content, "      images: DEFAULT_TWITTER_IMAGES,", "      images: [socialImage.url],", "Twitter image")

    locale_tag_marker = """  const localeTag = locale === 'zh' ? 'zh-CN' : 'en-US';

  const structuredData = [
"""
    locale_tag_replacement = """  const localeTag = locale === 'zh' ? 'zh-CN' : 'en-US';
  const seoSections = [
    { title: content.howToTitle, body: content.howToBody },
    { title: content.mobileTitle, body: content.mobileBody },
    { title: content.buySellTitle, body: content.buySellBody },
    { title: content.whatCanBuyTitle, body: content.whatCanBuyBody },
    { title: content.fixedBalanceTitle, body: content.fixedBalanceBody },
  ];

  const structuredData = [
"""
    content = replace_once(content, locale_tag_marker, locale_tag_replacement, "SEO section model")
    content = replace_once(
        content,
        "      description: content.metaDescription,\n      inLanguage: localeTag,",
        "      description: content.metaDescription,\n      datePublished: SPEND_BILL_GATES_MONEY_PUBLISHED_AT,\n      dateModified: SPEND_BILL_GATES_MONEY_UPDATED_AT,\n      inLanguage: localeTag,",
        "VideoGame dates",
    )

    faq_section_marker = """        <section className=\"mt-8 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-9\">
          <h2 className=\"text-2xl font-bold text-foreground sm:text-3xl\">
            {content.faqTitle}
"""
    seo_render = """        <section className=\"mt-8\" aria-labelledby=\"billionaire-game-guide\">
          <h2 id=\"billionaire-game-guide\" className=\"text-2xl font-bold text-foreground sm:text-3xl\">
            {locale === 'zh' ? '玩法、手机支持与1000亿美元说明' : 'How to play, mobile support, and the $100 billion scale'}
          </h2>
          <div className=\"mt-6 grid gap-5 md:grid-cols-2\">
            {seoSections.map((section) => (
              <section key={section.title} className=\"rounded-3xl border border-border bg-card p-6 shadow-sm\">
                <h3 className=\"text-xl font-semibold text-foreground\">{section.title}</h3>
                <p className=\"mt-3 text-sm leading-7 text-muted-foreground sm:text-base\">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        </section>

"""
    content = insert_before(content, faq_section_marker, seo_render, "SEO section rendering")

    write(path, content)


def patch_home() -> None:
    path = "app/[locale]/page.tsx"
    content = read(path)
    content = insert_before(
        content,
        "import { serializeJsonLd } from '@/lib/utils/json-ld';",
        "import {\n  SPEND_BILL_GATES_MONEY_OG_IMAGE,\n  SPEND_BILL_GATES_MONEY_PATH,\n} from '@/lib/games/spend-bill-gates-money-seo';\n",
        "homepage SEO imports",
    )

    zh_marker = """  const curatedEntries: CuratedEntry[] = locale === 'zh'
    ? [
        {
"""
    zh_entry = """  const curatedEntries: CuratedEntry[] = locale === 'zh'
    ? [
        {
          href: getLocalizedPath(locale, SPEND_BILL_GATES_MONEY_PATH),
          image: SPEND_BILL_GATES_MONEY_OG_IMAGE,
          eyebrow: 'Luma Original',
          title: '花光比尔·盖茨的钱',
          description: '用加减控制规划1000亿美元，比较消费选择并生成你的亿万富翁身份。',
          action: '打开亿万富翁消费模拟器',
        },
        {
"""
    content = replace_once(content, zh_marker, zh_entry, "Chinese homepage entry")

    en_marker = """    : [
        {
          href: getLocalizedPath(locale, '/guides/google-snake-mods'),
"""
    en_entry = """    : [
        {
          href: getLocalizedPath(locale, SPEND_BILL_GATES_MONEY_PATH),
          image: SPEND_BILL_GATES_MONEY_OG_IMAGE,
          eyebrow: 'Luma Original',
          title: 'Spend Bill Gates Money',
          description: 'Plan a $100 billion budget with reversible controls and reveal your billionaire identity.',
          action: 'Try the billionaire spending simulator',
        },
        {
          href: getLocalizedPath(locale, '/guides/google-snake-mods'),
"""
    content = replace_once(content, en_marker, en_entry, "English homepage entry")
    content = replace_once(content, "lg:grid-cols-4", "lg:grid-cols-5", "homepage grid")
    write(path, content)


def patch_guide_renderer() -> None:
    path = "app/[locale]/guides/[slug]/page.tsx"
    content = read(path)
    content = insert_before(
        content,
        "import { serializeJsonLd } from '@/lib/utils/json-ld';",
        "import {\n  SPEND_BILL_GATES_MONEY_GUIDE_LINK_SLUGS,\n  SPEND_BILL_GATES_MONEY_PATH,\n} from '@/lib/games/spend-bill-gates-money-seo';\n",
        "guide SEO imports",
    )

    function_marker = """export default async function GuidePage({ params }: GuidePageProps) {
"""
    helper = """function getBillionaireGameLinkCopy(slug: string, locale: Locale) {
  if (!(SPEND_BILL_GATES_MONEY_GUIDE_LINK_SLUGS as readonly string[]).includes(slug)) {
    return null;
  }

  const zh: Record<string, { title: string; body: string; action: string }> = {
    'games-to-play-when-bored': {
      title: '换一种方式消磨时间：规划1000亿美元',
      body: '这个亿万富翁消费模拟器不需要下载，可以用加减控制反复调整购买方案。',
      action: '开始花光1000亿美元',
    },
    'best-browser-games-5-minute-break': {
      title: '五分钟挑战：你会怎么花1000亿美元？',
      body: '快速购买、减少商品并生成身份，适合浏览器里的短时间互动。',
      action: '打开在线花钱游戏',
    },
    'free-games-no-ads': {
      title: '试试 Luma 原创的免下载花钱游戏',
      body: '页面直接在浏览器运行，不要求账号，并提供清晰的购买和退款控制。',
      action: '试玩亿万富翁消费模拟器',
    },
  };
  const en: Record<string, { title: string; body: string; action: string }> = {
    'games-to-play-when-bored': {
      title: 'A different boredom challenge: spend $100 billion',
      body: 'This billionaire spending simulator needs no download and lets you revise every purchase with plus and minus controls.',
      action: 'Try the billionaire spending simulator',
    },
    'best-browser-games-5-minute-break': {
      title: 'A five-minute $100 billion spending challenge',
      body: 'Buy, remove, and compare items quickly, then reveal a shareable billionaire identity.',
      action: 'Spend $100 billion online',
    },
    'free-games-no-ads': {
      title: 'Try a no-download Luma Original money game',
      body: 'It runs in the browser with no account and includes transparent reversible purchase controls.',
      action: 'Play the money spending game',
    },
  };

  return (locale === 'zh' ? zh : en)[slug] ?? null;
}

"""
    content = insert_before(content, function_marker, helper, "guide link helper")
    content = replace_once(
        content,
        "  const relatedPages = getRelatedPages(page, locale);",
        "  const relatedPages = getRelatedPages(page, locale);\n  const billionaireGameLink = getBillionaireGameLinkCopy(page.slug, locale);",
        "guide link state",
    )

    screenshots_marker = """      {content.screenshots?.length ? (
"""
    callout = """      {billionaireGameLink ? (
        <aside className=\"mx-auto mt-10 max-w-3xl rounded-2xl border border-amber-300/40 bg-amber-50 p-6 text-amber-950 shadow-sm dark:bg-amber-950/20 dark:text-amber-100\">
          <h2 className=\"text-xl font-semibold\">{billionaireGameLink.title}</h2>
          <p className=\"mt-2 text-sm leading-7\">{billionaireGameLink.body}</p>
          <Link
            href={getLocalizedPath(locale, SPEND_BILL_GATES_MONEY_PATH)}
            className=\"mt-4 inline-flex min-h-11 items-center rounded-xl bg-amber-300 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500\"
          >
            {billionaireGameLink.action} →
          </Link>
        </aside>
      ) : null}

"""
    content = insert_before(content, screenshots_marker, callout, "guide link callout")
    write(path, content)


def patch_sitemap() -> None:
    path = "app/sitemap.ts"
    content = read(path)
    content = insert_before(
        content,
        "import { buildAbsoluteUrl } from '@/lib/seo';",
        "import {\n  SPEND_BILL_GATES_MONEY_PATH,\n  SPEND_BILL_GATES_MONEY_UPDATED_AT,\n} from '@/lib/games/spend-bill-gates-money-seo';\n",
        "sitemap constants import",
    )

    old_block = """const standaloneGamePaths = [
  '/games/monster-survivors',
  '/games/solitaire',
  '/games/spend-bill-gates-money',
];
"""
    new_block = """const standaloneGamePaths: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
  lastModified?: Date;
}> = [
  {
    path: '/games/monster-survivors',
    changeFrequency: 'monthly',
    priority: 0.55,
  },
  {
    path: '/games/solitaire',
    changeFrequency: 'monthly',
    priority: 0.55,
  },
  {
    path: SPEND_BILL_GATES_MONEY_PATH,
    changeFrequency: 'weekly',
    priority: 0.75,
    lastModified: new Date(SPEND_BILL_GATES_MONEY_UPDATED_AT),
  },
];
"""
    content = replace_once(content, old_block, new_block, "standalone sitemap model")

    old_loop = """    for (const gamePath of standaloneGamePaths) {
      entries.push({
        url: buildAbsoluteUrl(getLocalizedPath(locale, gamePath)),
        changeFrequency: 'monthly',
        priority: 0.55,
      });
    }
"""
    new_loop = """    for (const game of standaloneGamePaths) {
      entries.push({
        url: buildAbsoluteUrl(getLocalizedPath(locale, game.path)),
        ...(game.lastModified ? { lastModified: game.lastModified } : {}),
        changeFrequency: game.changeFrequency,
        priority: game.priority,
      });
    }
"""
    content = replace_once(content, old_loop, new_loop, "standalone sitemap loop")
    write(path, content)


def patch_indexnow_workflow() -> None:
    write(
        ".github/workflows/indexnow.yml",
        """name: IndexNow changed URLs

on:
  workflow_dispatch:
  push:
    branches: [main]
    paths:
      - 'app/[locale]/games/spend-bill-gates-money/**'
      - 'app/[locale]/page.tsx'
      - 'app/[locale]/guides/[slug]/page.tsx'
      - 'app/sitemap.ts'
      - 'lib/games/spend-bill-gates-money-seo.ts'
      - 'public/og/spend-bill-gates-money.png'
      - 'public/9140751f1bbe87e8c99a338470f94cbc.txt'
      - 'scripts/submit-indexnow.ts'
      - '.github/workflows/indexnow.yml'

permissions:
  contents: read

jobs:
  submit:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10.28.0
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - name: Wait for the formal-domain release
        shell: bash
        run: |
          set -euo pipefail
          for attempt in $(seq 1 20); do
            page="$(curl -fsSL --max-time 20 'https://www.lumagamehub.com/en/games/spend-bill-gates-money' || true)"
            if grep -Fq 'money spending game with buy and sell' <<<"$page"; then
              exit 0
            fi
            echo "Formal-domain SEO v1.2 not visible yet (attempt $attempt/20)."
            sleep 30
          done
          echo 'Formal-domain release was not visible before the IndexNow timeout.' >&2
          exit 1
      - name: Notify IndexNow about changed URLs
        run: >-
          pnpm seo:indexnow --
          --url /
          --url /en
          --url /games/spend-bill-gates-money
          --url /en/games/spend-bill-gates-money
          --url /guides/games-to-play-when-bored
          --url /en/guides/games-to-play-when-bored
          --url /guides/best-browser-games-5-minute-break
          --url /en/guides/best-browser-games-5-minute-break
          --url /guides/free-games-no-ads
          --url /en/guides/free-games-no-ads
""",
    )


def patch_readme_and_release() -> None:
    readme_path = "README.md"
    readme = read(readme_path)
    section = """

## Luma Original interactive game

- [Spend Bill Gates Money](https://www.lumagamehub.com/en/games/spend-bill-gates-money) — a bilingual, mobile-friendly $100 billion spending simulator with reversible purchases and shareable results.
"""
    if "https://www.lumagamehub.com/en/games/spend-bill-gates-money" not in readme:
        readme = readme.rstrip() + section + "\n"
    write(readme_path, readme)

    write(
        "docs/releases/2026-08-04-spend-bill-gates-money-seo-v1-2.md",
        """# Spend Bill Gates Money SEO v1.2 release record

## Change control

- Feature branch: `feat/spend-bill-gates-money-seo-v1-2-20260804`
- Backup branch: `backup/main-before-bill-gates-seo-v1-2-20260804`
- Starting main commit: `56f442dda4d2b3ecb2d9623d0643e7b1af3e5c5a`
- Pull request: #15
- Production custom-domain Vercel project: `251001-web-gamehub-rdg6` (`prj_2FOg6BtpI4CAsnfWUCrdIpdJQlWM`)

## Implemented scope

- Five bilingual, useful long-tail content modules and five FAQs.
- Dedicated 1200×630 PNG for Open Graph and Twitter previews.
- Contextual inbound links from the homepage and three relevant guides.
- Existing `/games` Luma Original entry retained outside catalogue pagination.
- Sitemap upgraded to weekly frequency, priority 0.75, and an explicit last-modified date.
- Existing IndexNow key, validator, submission helper, CLI, and tests retained; a formal-domain readiness workflow submits only the ten changed localized URLs.
- One legitimate public GitHub README reference added. No paid, reciprocal, fabricated, or unverified third-party backlinks are claimed.

## Discovery and indexing boundary

- `robots.txt` remains crawlable and continues to advertise `https://www.lumagamehub.com/sitemap.xml`.
- IndexNow notification requests discovery but does not guarantee crawling, indexing, ranking, impressions, or clicks.
- Private Bing Webmaster Tools crawl, indexing, query, impression, click, and backlink data were not available to this execution environment and must remain recorded as **未获取到** until account-level evidence is read.

## Verification status

- Source-contract RED evidence: pending exact GitHub Actions run record.
- Final lint, type check, internal-link audit, unit tests, production dependency audit, build, and Playwright: pending.
- Merge commit: pending.
- Formal-domain Vercel deployment ID and commit: pending.
- Formal Chinese and English HTTP/metadata/content verification: pending.
- IndexNow HTTP response and submitted URL count: pending.

## Observation window after release

- 24 hours: technical crawling, runtime, analytics, and mobile-HUD checks.
- 7–14 days: Bing/Google discovery, impressions, long-tail queries, completion, and sharing intent.
- 28–45 days: decide whether additional supporting pages or external promotion are justified by first-party data.
""",
    )


def patch_docs_for_existing_indexnow() -> None:
    for path in [
        "docs/superpowers/specs/2026-08-04-spend-bill-gates-money-seo-v1-2-design.md",
        "docs/superpowers/plans/2026-08-04-spend-bill-gates-money-seo-v1-2.md",
    ]:
        content = read(path)
        content = content.replace("4accfd418d9633ccd239a4ed51d4f6b4", "9140751f1bbe87e8c99a338470f94cbc")
        content = content.replace("add a Node/tsx bulk submission script", "reuse and verify the existing Node/tsx bulk submission script")
        content = content.replace("Create: `lib/indexnow.ts`", "Verify/modify: `lib/indexnow.ts`")
        content = content.replace("Create: `scripts/submit-indexnow.ts`", "Verify/modify: `scripts/submit-indexnow.ts`")
        content = content.replace("Create: `public/9140751f1bbe87e8c99a338470f94cbc.txt`", "Verify: `public/9140751f1bbe87e8c99a338470f94cbc.txt`")
        write(path, content)


def main() -> None:
    patch_constants()
    create_og_image()
    patch_game_page()
    patch_home()
    patch_guide_renderer()
    patch_sitemap()
    patch_indexnow_workflow()
    patch_readme_and_release()
    patch_docs_for_existing_indexnow()


if __name__ == "__main__":
    main()
