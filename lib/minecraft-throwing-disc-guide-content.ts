import type { SeoLandingPage } from '@/lib/seo-landing-content';

const announcement =
  'https://www.minecraft.net/en-us/article/twitchcon-gamedrop-features';
const javaSnapshot =
  'https://www.minecraft.net/en-us/article/minecraft-26-4-snapshot-9';
const bedrockPreview =
  'https://feedback.minecraft.net/hc/en-us/articles/50449951148429-Minecraft-Beta-Preview-26-70-26';

export const THROWING_DISC_GUIDE: SeoLandingPage = {
  slug: 'minecraft-throwing-disc',
  primaryKeyword: 'minecraft throwing disc',
  keywords: [
    'throwing disc',
    'minecraft throwing disc',
    'Bedrock off-hand parity',
    'throwing disc release',
  ],
  updatedAt: '2026-11-20',
  indexable: false,
  relatedSlugs: ['games-to-play-when-bored', 'best-free-iphone-games'],
  locales: {
    en: {
      metaTitle:
        'Throwing Disc Guide for Minecraft | Release and Version Check',
      metaDescription:
        'Check what Mojang announced for the throwing disc, which Bedrock off-hand features you can test now, and why Java Snapshot 26.4 is a separate update.',
      heading: 'Throwing Disc Guide for Minecraft',
      subheading:
        'An independent Luma guide. This publication is not official and is not approved by or associated with Mojang or Microsoft.',
      overview: [
        'Build notes checked on November 20, 2026. Match your edition and build number below before looking for the disc in a world or trying a crafting recipe.',
      ],
      sections: [
        {
          title: 'When does the throwing disc arrive?',
          body: 'Mojang announced the throwing disc on November 14 for the first game drop of 2027. The announcement gives no exact launch day. Bedrock off-hand testing began separately, so seeing a new off-hand option does not establish that the disc is available in your build.',
        },
        {
          title: 'Java Edition build check',
          body: 'Check the selected installation in the launcher. Mojang’s November 17 notes for Java 26.4 Snapshot 10 cover the 2026 update and do not list a throwing disc. When a new snapshot appears, read the changes for that specific build and look for the item name. Keep the version number with any test result you report.',
        },
        {
          title: 'Bedrock Preview and Android Beta build check',
          body: 'Bedrock Preview and Beta 26.70.26 list the Off-hand Parity experiment. With it enabled, you can test holding and using items with the other hand. That build’s changelog does not list the throwing disc. Check the changelog again if the build number changes. For regular Bedrock, use the stable release notes instead of Preview notes.',
        },
        {
          title: 'What the disc does in Mojang’s reveal',
          body: 'The disc returns after a throw. Mojang describes a short direct flight, a bounce off hard surfaces that can extend the path, and hits on several enemies along that path. Picture two mobs in one line, then a second setup with a wall beside the line. These illustrate the difference between piercing and ricochet without assuming an exact angle, range, or damage value.',
        },
        {
          title: 'Materials and recipe checks',
          body: 'The written announcement names copper, iron, gold, diamond, and netherite. Check for the complete recipe and the material-specific stats in the notes for a build that actually contains the item. Treat a recipe from a third-party add-on as specific to that add-on.',
        },
      ],
      recommendations: [],
      faqs: [
        {
          question: 'I can use the Bedrock off-hand. Can I craft the disc now?',
          answer:
            'Preview 26.70.26 documents testing the Off-hand Parity experiment. The same notes do not list the throwing disc.',
        },
        {
          question: 'Can I use a music disc for the same purpose?',
          answer:
            'Mojang announced Throwing Disc as a separate item. The 26.4 music-disc updates are a different feature.',
        },
        {
          question: 'What should I look for in the next patch notes?',
          answer:
            'Look for the item name, edition, build number, and any experiment required. Use those four details when comparing recipes or player tests.',
        },
      ],
      quickAnswerLink: {
        href: announcement,
        label: 'Mojang’s reveal and release window',
        description: 'The first 2027 game drop, mechanics, and five materials.',
      },
      externalLinks: [
        {
          href: javaSnapshot,
          label: 'Java 26.4 Snapshot 10 notes',
          description: 'Check the 2026 snapshot changes for this build.',
        },
        {
          href: bedrockPreview,
          label: 'Bedrock Preview and Beta 26.70.26 notes',
          description: 'See the Off-hand Parity experiment and its controls.',
        },
      ],
      ctaLabel: 'Browse browser games',
      ctaDescription: 'Pick a game for a short break.',
    },
    zh: {
      metaTitle: '投掷圆盘指南｜Minecraft 版本、上线时间和副手',
      metaDescription:
        '核对投掷圆盘的上线窗口、官方公布的机制和材料，以及 Java 26.4 快照、基岩版副手测试分别能体验什么。',
      heading: '投掷圆盘指南（适用于 Minecraft）',
      subheading:
        'Luma 独立编辑的非官方指南，未获 Mojang 或 Microsoft 批准，与两者无关联。',
      overview: [
        '2026 年 11 月 20 日核对版本日志。找道具或试配方前，先对照自己用的是 Java、基岩正式版还是测试版。',
      ],
      sections: [
        {
          title: '投掷圆盘什么时候上？',
          body: 'Mojang 于 11 月 14 日公布投掷圆盘，计划随 2027 年第一个游戏更新推出，公告未给具体日期。基岩版提前测试了副手功能。看到副手可以用了，仍要按版本日志确认有无圆盘。',
        },
        {
          title: 'Java 版怎么核对？',
          body: '在启动器里确认当前选中的版本。Mojang 11 月 17 日的 Java 26.4 Snapshot 10 日志属于 2026 年更新，其中未列出投掷圆盘。若换了快照，用该版本的日志搜索道具名，并在记录实测时写上版本号。',
        },
        {
          title: '基岩版 Preview 和安卓 Beta 怎么核对？',
          body: '基岩版 Preview／Beta 26.70.26 已列出 Off-hand Parity 实验。打开后可试副手持物和使用物品。该版本日志未列出投掷圆盘。下次换版本时按新日志核对；如果玩的是基岩正式版，查正式版的更新说明。',
        },
        {
          title: '官方演示了什么机制？',
          body: '圆盘投出后会返回，直线飞行距离较短，碰到硬质表面能弹开并延长路线，路径上的多个敌人也可以一起被命中。可以把两种情况分开理解：一条线上站着两个目标，或者路线旁有一面墙。前者解释穿过多个目标，后者解释反弹。具体角度、距离和伤害要等版本实测。',
        },
        {
          title: '合成要先确认材料和版本',
          body: '官方文字公告点名了铜、铁、金、钻石和下界合金。等对应版本明确加入道具后，再核对完整配方、各材质属性和是否需要打开实验选项。社区扩展中的配方只对该扩展负责。',
        },
      ],
      recommendations: [],
      faqs: [
        {
          question: '基岩版副手能用了，就能做圆盘吗？',
          answer:
            '26.70.26 写明可以测试副手实验，该版本的更新日志未列出投掷圆盘。',
        },
        {
          question: '投掷圆盘和音乐唱片是同一件东西吗？',
          answer:
            'Mojang 把投掷圆盘作为单独的新道具公布。26.4 更新里的音乐唱片是另一项功能。',
        },
        {
          question: '之后该看更新日志的哪些信息？',
          answer:
            '核对道具名、游戏版本类型、具体构建号和实验选项，再对照配方或玩家实测。',
        },
      ],
      quickAnswerLink: {
        href: announcement,
        label: 'Mojang 官方公布及上线窗口',
        description: '首个 2027 年更新、已公布机制和五种材料。',
      },
      externalLinks: [
        {
          href: javaSnapshot,
          label: 'Java 26.4 Snapshot 10 更新日志',
          description: '核查这一版 2026 年快照的改动。',
        },
        {
          href: bedrockPreview,
          label: '基岩版 Preview／Beta 26.70.26 更新日志',
          description: '核对副手实验及已开放操作。',
        },
      ],
      ctaLabel: '浏览在线小游戏',
      ctaDescription: '短暂休息时可以直接开一局。',
    },
  },
};
