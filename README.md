# 🎮 GameHub - 游戏聚合网站

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)

> 🚀 基于 Next.js 14.2 的生产级游戏聚合平台

---

## 📖 项目简介

GameHub 是一个现代化的在线游戏聚合平台，为用户提供丰富的在线游戏体验。项目采用最新的 Web 技术栈，注重性能、SEO 优化和用户体验。

### 🎯 核心目标

- **用户端**：提供流畅的游戏浏览、搜索、播放体验
- **管理端**：高效的游戏管理、批量导入、数据分析
- **技术端**：可扩展、高性能、生产级架构

---

## 🛠️ 技术栈

### 核心框架

| 技术 | 版本 | 用途 |
|------|------|------|
| **Next.js** | 14.2 | 全栈框架 |
| **React** | 18.2 | UI 框架 |
| **TypeScript** | 5.4+ | 类型安全 |
| **Tailwind CSS** | 3.4 | 样式方案 |

### 数据层

| 技术 | 用途 |
|------|------|
| **PostgreSQL** | 主数据库 (Drizzle ORM) |
| **Redis** (Upstash) | 缓存 + 限流 |
| **Meilisearch** | 搜索引擎 |

### 存储与服务

| 技术 | 用途 |
|------|------|
| **Cloudinary** | 图片 CDN + 存储 |
| **Vercel** | 部署平台 |
| **next-intl** | 国际化方案 |

---

## 🚀 快速开始

### 环境要求

- **Node.js**: >= 18.17.0
- **pnpm**: >= 8.0.0
- **PostgreSQL**: >= 15.0
- **Redis**: 推荐 Upstash

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

```bash
# 复制环境变量示例文件
cp .env.example .env.local

# 编辑 .env.local，填入必要配置
```

**必需的环境变量**：

```bash
# 数据库（必需）
DATABASE_URL="postgresql://user:password@localhost:5432/gamehub"

# Redis（必需）
UPSTASH_REDIS_URL="https://your-redis-url.upstash.io"
UPSTASH_REDIS_TOKEN="your-redis-token"

# 管理员（必需）
ADMIN_PASSWORD="your_secure_password"

# Cron Job（必需）
CRON_SECRET="your_random_secret_min_32_chars"
```

**可选环境变量**：

```bash
# Meilisearch（可选）
MEILISEARCH_HOST="http://localhost:7700"
MEILISEARCH_API_KEY="your_master_key"

# Cloudinary（可选）
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
CLOUDINARY_PRESET_THUMBNAIL="preset-game-thumbnails"
CLOUDINARY_PRESET_SCREENSHOT="preset-game-screenshots"
CLOUDINARY_PRESET_ICON="preset-category-icons"
```

### 3. 初始化数据库

✅ **数据库 Schema 已就绪！** (Step 2 已完成)

```bash
# 推送 Schema 到数据库
pnpm db:push

# 运行种子数据（可选，导入示例数据）
pnpm db:seed

# 查看数据库（Drizzle Studio）
pnpm db:studio
```

**提示：** `pnpm db:generate` 已经运行过，迁移文件位于 `db/migrations/`。

### 4. 启动开发服务器

```bash
pnpm dev
```

访问：
- **前台**：http://localhost:3000
- **管理后台**：http://localhost:3000/admin

### 管理后台登录

- 在 `.env.local` 中设置 `ADMIN_PASSWORD`（参考 `.env.example`）
- 本地运行时访问 `http://localhost:3000/admin/login` 输入密码
- 成功登录后可在仪表盘查看基础统计，并执行后续后台功能
- 登录后可通过导航进入 **Games**、**Ratings** 页面，分别进行游戏管理与评分审核

### 运维工具

- 健康检查：`/api/health`（可作为负载均衡或监控探针）
- 运维巡检：`pnpm ops:status`（终端检查数据库/Redis/Meilisearch 状态）


### 5. 构建生产版本

```bash
# 构建
pnpm build

# 启动生产服务器
pnpm start
```

> 首次运行端到端测试前，请执行 `npx playwright install` 安装浏览器。

---

## 📁 项目结构

```
/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── admin/             # 管理后台
│   └── [locale]/          # 国际化路由
├── components/            # React 组件
│   ├── ui/               # UI 基础组件
│   ├── game/             # 游戏相关组件
│   └── admin/            # 管理后台组件
├── lib/                   # 核心库
│   ├── db/               # 数据库客户端
│   ├── redis/            # Redis 客户端
│   ├── meilisearch/      # Meilisearch 客户端
│   └── utils/            # 工具函数
├── services/              # 业务逻辑层
├── types/                 # TypeScript 类型定义
├── db/                    # Drizzle Schema & Migrations
│   ├── schema/           # 数据库 Schema 定义
│   └── migrations/       # 迁移文件
├── public/               # 静态资源
├── docs/                 # 项目文档
└── scripts/              # 运维脚本
```

---

## 📜 可用命令

### 开发命令

```bash
# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# 代码检查
pnpm lint

# 格式化代码
pnpm format

# 类型检查
pnpm type-check

# 单元测试
pnpm test

# 单元测试（监听模式）
pnpm test:watch

# 端到端测试（需先启动应用并安装浏览器）
pnpm test:e2e
```

### 数据库命令

✅ **数据库 Schema 已就绪！**

```bash
# 生成迁移文件（已执行，迁移文件已生成）
pnpm db:generate

# 推送 Schema 到数据库
pnpm db:push

# 查看数据库（Drizzle Studio）
pnpm db:studio

# 运行迁移
pnpm db:migrate

# 运行种子数据（导入示例游戏/分类/标签）
pnpm db:seed
```

**数据库结构：**
- 10个核心表（games, game_stats, categories, tags, ratings, screenshots, play_counters, admin_logs, 等）
- 多语言支持（中英文）
- 完整的关联关系（游戏-分类、游戏-标签）
- 统计数据拆分（game_stats 独立表，支持分时段统计）
- 审计日志（管理员操作记录）

---

## 📊 开发进度

查看详细开发进度：[docs/progress.md](docs/progress.md)

### 当前状态

- ✅ **Phase 1 - Step 1**：项目初始化与基础配置（已完成）
- ✅ **Phase 1 - Step 2**：数据库 Schema 设计（已完成）
- ✅ **Phase 1 - Step 3**：外部服务配置与验证（已完成）
- ✅ **Phase 2 - Step 4**：核心业务逻辑开发（已完成）
- ✅ **Phase 2 - Step 5**：API 路由层开发（已完成）
- ✅ **Phase 2 - Step 6**：国际化配置（已完成）
- ✅ **Phase 2 - Step 7**：设计系统与基础组件（已完成）
- ✅ **Phase 2 - Step 8**：前台列表与详情页（已完成）

**最新更新：**
- ✅ **Phase 1 完成！** 基础设施搭建完毕
- ✅ **Phase 2 - Step 4-8 完成！** 服务层、API、多语言、前台页面全面打通
- 🔌 外部服务客户端已配置（Cloudinary / Meilisearch / Redis）
- 📚 配置文档完整：[docs/setup/external-services.md](docs/setup/external-services.md)

---

## 🤝 贡献指南

### 提交规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试
chore: 构建/工具链更新
```

---

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源协议。

---

## 📞 联系方式

- **问题反馈**: GitHub Issues
- **讨论区**: GitHub Discussions

---

**🎮 Happy Gaming! Built with ❤️ using Next.js**

---

<p align="center">
  <sub>最后更新: 2025-10-01</sub>
</p>

## 🚀 部署与运维

- 仓库提供 GitHub Actions 工作流（`.github/workflows/ci.yml`）自动执行 lint / type-check / 单元测试
- 推荐使用 Vercel 部署：导入仓库 → 配置环境变量 → `pnpm build` 即可
- 更详细说明见 [docs/setup/deployment.md](docs/setup/deployment.md)
