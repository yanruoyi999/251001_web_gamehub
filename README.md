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

```bash
# Drizzle 迁移
pnpm db:generate
pnpm db:push

# 运行种子数据（可选，在 Step 2 之后）
# pnpm db:seed
```

### 4. 启动开发服务器

```bash
pnpm dev
```

访问：
- **前台**：http://localhost:3000
- **管理后台**：http://localhost:3000/admin

### 5. 构建生产版本

```bash
# 构建
pnpm build

# 启动生产服务器
pnpm start
```

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
```

### 数据库命令

```bash
# 生成迁移文件
pnpm db:generate

# 推送 Schema 到数据库
pnpm db:push

# 查看数据库（Drizzle Studio）
pnpm db:studio

# 运行迁移
pnpm db:migrate

# 运行种子数据（Step 2 后）
# pnpm db:seed
```

---

## 📊 开发进度

查看详细开发进度：[docs/progress.md](docs/progress.md)

### 当前状态

- ✅ **Phase 1 - Step 1**：项目初始化与基础配置（已完成）
- ⏳ **Phase 1 - Step 2**：数据库 Schema 设计（待开始）
- ⏳ **Phase 1 - Step 3**：外部服务配置（待开始）

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
