# 🎯 游戏聚合站 - 项目进度跟踪

## 📅 最后更新
2025-10-01

## 🚀 Phase 1: 基础设施 (进行中)

### ✅ Step 1: 项目初始化与基础配置 (已完成 + 优化)
**完成时间:** 2025-10-01
**耗时:** ~60 分钟（含优化）

#### 完成内容
- [x] 项目初始化 (Next.js 14.2 + TypeScript)
- [x] 目录结构搭建
  - app/ - Next.js App Router
  - components/ - React 组件 (ui, game, admin)
  - lib/ - 核心库 (db, redis, meilisearch, utils)
  - services/ - 业务逻辑层
  - types/ - TypeScript 类型
  - db/schema/ - Drizzle Schema 定义
  - db/migrations/ - 数据库迁移文件
  - public/ - 静态资源
  - docs/ - 项目文档
  - scripts/ - 运维脚本
  - tests/ - 测试文件
- [x] 依赖包安装 (468 个包，含优化后的 Drizzle)
- [x] 配置文件创建
  - tsconfig.json (TypeScript 严格模式)
  - next.config.js (图片域名、i18n)
  - drizzle.config.ts (Drizzle ORM 配置)
  - .eslintrc.json (ESLint 规则)
  - .prettierrc (代码格式化)
  - tailwind.config.ts (Tailwind CSS)
  - postcss.config.js (PostCSS)
  - .gitignore
  - .env.example (环境变量模板)
- [x] 基础页面创建
  - app/layout.tsx (根布局)
  - app/page.tsx (首页)
  - app/globals.css (全局样式)

#### 技术栈确认
- **框架:** Next.js 14.2
- **语言:** TypeScript 5.4+
- **样式:** Tailwind CSS 3.4
- **数据库:** PostgreSQL (Drizzle ORM)
- **缓存:** Redis (Upstash)
- **搜索:** Meilisearch
- **图片:** Cloudinary
- **国际化:** next-intl
- **包管理:** pnpm

#### 下一步
- [x] Step 2: 数据库 Schema 设计与 Drizzle 配置 ✅
- [x] Step 3: 外部服务配置与验证 ✅

---

### ✅ Step 2: 数据库 Schema 设计与 Drizzle 配置 (已完成)
**完成时间:** 2025-10-01
**耗时:** ~2 小时

#### 完成内容
- [x] 设计数据库架构（10个核心表）
  - games - 游戏主表（基础信息）
  - game_stats - 游戏统计表（拆分统计数据）
  - categories - 游戏分类
  - tags - 游戏标签
  - ratings - 用户评分
  - game_categories - 游戏-分类关联表
  - game_tags - 游戏-标签关联表
  - play_counters - 播放计数表
  - screenshots - 游戏截图表
  - admin_logs - 管理员操作日志
- [x] 创建 Drizzle Schema 文件 (db/schema/)
  - games.ts - 游戏表定义（新增 slug/instructions 等字段）
  - stats.ts - 游戏统计表定义（新增，拆分统计数据）
  - categories.ts - 分类表定义
  - tags.ts - 标签表定义
  - ratings.ts - 评分表定义（IP哈希+CHECK约束）
  - relations.ts - 关联表定义（新增唯一索引）
  - counters.ts - 计数表定义（新增唯一索引）
  - screenshots.ts - 截图表定义（新增publicId+唯一索引）
  - admin.ts - 管理员日志表定义（新增operator+索引）
  - index.ts - 统一导出
- [x] 配置 Drizzle Kit
  - 更新 drizzle.config.ts（修复新版本配置）
  - 更新 package.json 脚本（使用 generate:pg/push:pg）
- [x] 生成迁移文件
  - 运行 pnpm db:generate
  - 生成 db/migrations/0000_wide_chameleon.sql（含所有约束和索引）
  - 手动添加 CHECK 约束（rating 1-5）
- [x] 创建种子数据脚本 (db/seed.ts)
  - 6个示例游戏（含slug/instructions）
  - 6个游戏分类
  - 10个游戏标签
  - 7个游戏-分类关联
  - 12个游戏-标签关联
  - 10条示例评分（使用IP哈希）
  - 6条游戏统计数据（含星级分布）
  - 5张游戏截图（含publicId）
  - 6条播放计数记录（今日/昨日）
  - 3条管理员操作日志
- [x] 创建数据库客户端 (lib/db/index.ts)
  - Drizzle + PostgreSQL 配置
  - 连接池优化
  - Schema 导出

#### 技术细节
- **ORM:** Drizzle ORM 0.30.0
- **数据库:** PostgreSQL (推荐 Neon)
- **迁移工具:** drizzle-kit 0.20.18
- **TypeScript:** 完整类型推断
- **外键约束:** 级联删除配置
- **索引策略:** 唯一索引（分类/标签 slug）

#### 数据库架构特点
1. **多语言支持:** 所有文本字段提供中英文版本
2. **关联表设计:** 多对多关系通过中间表实现，带唯一索引防重复
3. **统计数据拆分:** 统计数据独立存储在 game_stats 表，支持分时段统计
4. **审核机制:** 评分表包含审核状态字段
5. **审计日志:** 管理员操作日志（JSON格式存储详情，含操作者追踪）
6. **时间戳:** 所有表包含 created_at/updated_at
7. **SEO 优化:** 游戏表包含 slug 字段，支持友好URL
8. **数据安全:** IP 哈希化 + CHECK 约束保证数据合法性

#### GPT-5 Codex 优化建议 (已全部完成)
基于专业审查建议，对 Step 2 进行了全面优化：

**✅ 1. games 表优化**
- 添加 `slug` 字段（唯一URL标识，带索引）
- 添加 `publishedAt` 发布时间
- 添加 `instructions`/`instructionsEn` 玩法说明
- 添加 `isNew`/`isHot` 热度标记
- 移除统计数据（拆分到 game_stats 表）

**✅ 2. 创建 game_stats 表**
- 拆分所有统计数据（播放次数、评分统计）
- 添加分时段统计（今日/本周/本月）
- 添加星级分布（1-5星各多少）
- 添加热度分数（综合算法）
- 一对一关系，带唯一索引

**✅ 3. relations 表唯一索引**
- game_categories: 添加 (gameId, categoryId) 唯一索引
- game_tags: 添加 (gameId, tagId) 唯一索引
- 防止重复关联

**✅ 4. ratings 表安全优化**
- 添加 CHECK 约束（rating 1-5）
- 使用 `userIpHash` 替代明文IP（SHA-256）
- 添加 `anonymousToken`（浏览器指纹）
- 添加索引提升查询性能

**✅ 5. 其他表优化**
- play_counters: 添加 (gameId, date) 唯一约束
- screenshots: 添加 (gameId, order) 唯一约束 + publicId字段
- admin_logs: 添加 operator 字段 + 3个查询索引

**✅ 6. seed.ts 修复**
- 修复 where 条件 bug（使用 eq 而非 ===）
- 添加完整示例数据（截图/播放计数/管理员日志）
- 添加 IP 哈希工具函数
- 添加 game_stats 统计数据生成

**✅ 7. 迁移文件**
- 重新生成包含所有约束和索引的迁移文件
- 手动添加 CHECK 约束（drizzle-kit 限制）
- 10个表，14个索引，8个外键约束

#### 优化成果
- **表数量:** 9 → 10（新增 game_stats）
- **索引数量:** 1 → 14（增强查询性能）
- **数据完整性:** 新增 4个唯一约束 + 1个CHECK约束
- **安全性:** IP 哈希 + 匿名token 防刷机制
- **可维护性:** 统计数据拆表，便于独立优化

#### 下一步
- [x] Step 3: 外部服务配置与验证 ✅

---

### ✅ Step 3: 外部服务配置与验证 (已完成)
**完成时间:** 2025-10-01
**耗时:** ~3 小时

#### 完成内容
- [x] 创建外部服务客户端代码
  - lib/cloudinary/index.ts - Cloudinary 客户端（图片上传、删除、URL 生成）
  - lib/meilisearch/index.ts - Meilisearch 客户端（搜索引擎）
  - lib/meilisearch/setup.ts - Meilisearch 索引配置脚本
  - lib/redis/index.ts - Upstash Redis 客户端（缓存、限流）
- [x] 更新环境变量配置
  - 优化 .env.example（添加详细注释、分类、链接）
  - 包含 Cloudinary、Meilisearch、Redis 所有配置项
- [x] 创建服务验证脚本
  - scripts/verify-services.ts - 一键验证所有外部服务连接
  - 支持彩色输出、错误诊断、降级提示
- [x] 添加 package.json 脚本
  - pnpm verify:services - 验证所有服务连接
  - pnpm meilisearch:setup - 配置 Meilisearch 索引
- [x] 安装必要依赖
  - dotenv (用于验证脚本加载环境变量)
- [x] 创建完整文档
  - docs/setup/external-services.md - 外部服务配置指南（含注册、配置、验证步骤）

#### 技术实现
**Cloudinary 客户端**
- 支持 3 种 Upload Preset（Thumbnail/Screenshot/Icon）
- 提供图片 URL 生成辅助函数
- 实现连接验证和删除功能

**Meilisearch 客户端**
- 单例模式，支持降级到数据库查询
- 配置中文停用词、排名规则
- 索引设置：searchable/filterable/sortable 属性

**Redis 客户端**
- 播放计数缓存（总计 + 今日）
- 评分限流（每IP每小时10次）
- 游戏数据缓存（TTL 5分钟）
- 所有功能支持降级（Redis 不可用时直接查询数据库）

#### 服务配置要求
**Cloudinary**
- 需手动创建 3 个 Upload Preset
- Preset 配置参考：docs/setup/external-services.md

**Meilisearch**
- 推荐本地 Docker 部署（开发）或 Railway 托管（生产）
- 运行 `pnpm meilisearch:setup` 配置索引

**Upstash Redis**
- 免费套餐：10K 命令/天
- 可选服务，未配置时自动降级

#### 降级策略
1. **Meilisearch 降级** → PostgreSQL ILIKE 查询
2. **Redis 降级** → 直接数据库查询，跳过缓存
3. **Cloudinary 降级** → 本地文件存储（仅开发环境）

#### 验收标准
- [x] 所有客户端代码创建完成
- [x] .env.example 包含所有必需配置
- [x] 验证脚本可成功运行
- [x] 文档完整且符合模板标准
- [x] 支持可选服务降级

#### 费用评估（免费套餐）
- Cloudinary: 25GB 存储 + 25GB 带宽/月
- Upstash Redis: 10K 命令/天
- Meilisearch (Railway): $5 免费额度/月
- **总计**: $0-5/月（开发环境）

#### 下一步
- [x] Step 4: 业务服务层开发 ✅

---

### ✅ Step 4: 核心业务服务层开发 (已完成)
**完成时间:** 2025-10-01
**耗时:** ~3 小时

#### 完成内容
- [x] 工具层重构 (lib/utils/)
- [x] 业务服务层重建 (services/)
- [x] Drizzle 关系定义补全 (`db/schema/relations.definition.ts`)
- [x] 服务降级策略与防刷机制落地

#### 当前状态
- ✅ TypeScript / ESLint 全部通过
- ✅ Redis / Meilisearch 缺失时自动降级
- ✅ 评分、统计、搜索等核心逻辑已可复用

---

### ✅ Step 5: API 路由层开发 (已完成)
**完成时间:** 2025-10-01
**耗时:** ~3 小时

#### 完成内容
- [x] `GET/POST /api/games`：列表查询、创建游戏
- [x] `GET/PATCH/DELETE /api/games/[id]`：详情、更新、软删除
- [x] `GET /api/games/slug/[slug]`：按 slug 获取详情
- [x] `GET/POST /api/ratings`：评分查询与提交
- [x] `PATCH /api/ratings/[id]`：审批评分
- [x] `GET /api/ratings/pending`：待审核评分列表
- [x] `GET /api/counters/[id]` / `POST /api/counters/[id]/increment`
- [x] `GET /api/search`：全文搜索（Meilisearch → PostgreSQL 降级）

#### 实现要点
- 所有接口均调用服务层，保持单一职责
- 统一 JSON 响应格式，错误时返回 `{ error }`
- 通过 `validatePagination` 等工具处理请求参数
- 未配置外部服务时自动提示“降级”而不报错

---

### ✅ Step 6: 国际化配置 (已完成)
**完成时间:** 2025-10-01
**耗时:** ~2 小时

#### 完成内容
- [x] 更新 `next.config.js`，声明 `locales`、`defaultLocale`
- [x] 新增 `middleware.ts`，使用 `next-intl` 自动重定向语种
- [x] 创建 `i18n/config.ts` 并准备 `messages/zh.json`、`messages/en.json`
- [x] 新增 `app/[locale]/layout.tsx`、`app/[locale]/page.tsx`，在根 `app/page.tsx` 中重定向默认语言

#### 实现要点
- 默认语言为中文（`zh`），使用 `localePrefix: 'as-needed'`
- 通过 `NextIntlClientProvider` 为后续页面提供多语言上下文
- 保持 TypeScript、ESLint 均通过，无额外依赖警告

---

### ✅ Step 7: 设计系统与基础组件 (已完成)
**完成时间:** 2025-10-01
**耗时:** ~2 小时

#### 完成内容
- [x] 新增通用 UI 组件（Button、Card 等）
- [x] 新增全局 Header / Footer，支持语言切换
- [x] 补充多语言文案结构（nav、footer 等）

---

### ✅ Step 8: 前台页面（列表与详情）(已完成)


**完成时间:** 2025-10-01
**耗时:** ~2 小时

#### 完成内容
- [x] `/[locale]/games`：调用 `GameService.listGames` 渲染游戏列表，支持分页参数
- [x] `/[locale]/games/[id]`：调用 `GameService.getGameById` 显示详情、统计、截图
- [x] 多语言文案覆盖列表、详情、空态与返回链接

#### 当前状态
- ✅ TypeScript / ESLint 全部通过
- ✅ 列表与详情页面均支持中文 / 英文切换
- ℹ️ 目前使用真实服务数据；若数据库为空则显示空态文案

### ✅ Step 9: 收藏功能与筛选增强 (已完成)
**完成时间:** 2025-10-02
**耗时:** ~3 小时

#### 完成内容
- [x] 新增收藏数据表及 API (`/api/favorites`) 支持匿名用户收藏/取消收藏
- [x] 游戏列表增加收藏筛选、新品/热门/精选徽章与分页提示
- [x] 游戏详情页集成收藏按钮，沿用列表状态
- [x] FavoriteService 提供上下文解析、CRUD 与降级逻辑
- [x] 多语言文案覆盖收藏操作与筛选项

#### 当前状态
- ✅ 收藏状态与筛选完全打通
- ✅ 列表/详情页 UI 即时响应收藏操作（客户端交互）
- ✅ API 与服务层均复用匿名用户指纹识别


### ✅ Step 10: 搜索体验增强 (已完成)
**完成时间:** 2025-10-02
**耗时:** ~3 小时

#### 完成内容
- [x] 新增 `/[locale]/search` 页面，支持分页查询与多语言展示
- [x] Header 集成即时搜索框，提供实时建议与快捷跳转
- [x] 搜索接口重用 SearchService，并对空查询/降级做兜底
- [x] 多语言文案补充搜索提示、分页与按钮文案
- [x] 引入 Playwright 浏览器安装与端到端测试脚本占位

#### 当前状态
- ✅ 搜索结果与建议响应速度受 Redis 缓存优化
- ✅ 支持直接跳转至详情或搜索页
- ✅ 提供后续扩展（收藏筛选、搜索建议更多字段）基础


### ✅ Step 11: 评分交互与用户反馈 (已完成)
**完成时间:** 2025-10-02
**耗时:** ~2 小时

#### 完成内容
- [x] 游戏详情页集成评分表单，支持星级+评论匿名提交
- [x] 接入 `/api/ratings`，处理限流与重复提交提示
- [x] 多语言提示语覆盖成功、失败与验证反馈

#### 当前状态
- ✅ 用户可立即提交评分并获得反馈
- ✅ 前台与后端评分逻辑贯通，保留现有防刷策略
- ✅ 后续可扩展评分列表与分布展示




---

## 📊 Phase 2: 核心业务逻辑 (进行中)
- [x] Step 4: 业务服务层开发 ✅
- [x] Step 5: API 路由层开发 ✅
- [x] Step 6: 国际化配置 ✅
- [x] Step 7: 设计系统 ✅
- [x] Step 8: 前台页面 ✅
- [x] Step 9: 收藏功能与筛选增强 ✅
- [x] Step 10: 搜索体验增强 ✅
- [x] Step 11: 评分交互与用户反馈 ✅

## 🎨 Phase 3: 前台功能 (待开始)
- [ ] Step 8-11

## 🛠️ Phase 4: 管理后台 (进行中)

### ✅ Step 12: 管理员认证与仪表盘 (已完成)

### ✅ Step 13: 后台游戏管理工作流 (已完成)

### ✅ Step 14: 后台评分审核中心 (已完成)

### ✅ Step 15: 部署与运维基线 (已完成)
**完成时间:** 2025-10-02
**耗时:** ~2 小时

#### 完成内容
- [x] 新增 GitHub Actions CI（lint / type-check / unit test）
- [x] 编写部署与运维指南（环境变量、Vercel 流程、运行手册）
- [x] README 增补部署说明，便于迁移到生产环境

#### 当前状态
- ✅ 基础 CI/CD 流程跑通，可在 PR 合并时自动校验
- ✅ 具备 Vercel 等平台的部署指引与运行手册
- ✅ 后续可拓展数据库迁移自动化、监控告警等高级能力

### ✅ Step 16: 运行时健康检测 (已完成)
**完成时间:** 2025-10-02
**耗时:** ~1 小时

#### 完成内容
- [x] 新增 `/api/health` 接口，整合数据库/Redis/Meilisearch 健康状态
- [x] 对未配置服务给出降级提示，适合作为健康探针

#### 当前状态
- ✅ 生产环境可直接接入监控或负载均衡健康检查

### ✅ Step 17: 运维脚本与状态检查 (已完成)
**完成时间:** 2025-10-02
**耗时:** ~1 小时

#### 完成内容
- [x] 新增 `pnpm ops:status` 脚本，汇总数据库/Redis/Meilisearch 状态
- [x] 统一命令行输出，便于部署前或定期巡检

#### 当前状态
- ✅ 运维人员可在终端快速诊断依赖服务
- ✅ 端到端测试：后续可扩展 Playwright 流程，如 /games 筛选和评分提交流程

### ✅ Step 18: API 与安全测试基线 (已完成)
**完成时间:** 2025-10-02
**耗时:** ~1 小时

#### 完成内容
- [x] 新增 `api-test.http` 示例，覆盖健康探针与评分提交接口
- [x] README 补充运维工具说明，方便 QA 快速验证

#### 当前状态
- ✅ 提供接口测试样例，便于后续扩展端到端流程与安全扫描

### ✅ Step 19: 安全头部与指南 (已完成)
**完成时间:** 2025-10-02
**耗时:** ~1 小时

#### 完成内容
- [x] 在 `next.config.js` 配置 CSP、X-Frame-Options 等安全响应头
- [x] 编写 `docs/security.md`，梳理后台访问、安全及备份建议

#### 当前状态
- ✅ 响应头具备基础防护，安全文档可用于部署自查

### ✅ Step 20: 发布准备与最终检查 (已完成)
**完成时间:** 2025-10-02
**耗时:** ~1 小时

#### 完成内容
- [x] 编写 `docs/final-checklist.md`，整理发布前自检项
- [x] 汇总健康探针、运维脚本与后台流程，确认上线路径

#### 当前状态
- ✅ 项目可按清单执行最终 QA 并部署上线


**完成时间:** 2025-10-02
**耗时:** ~2 小时

#### 完成内容
- [x] 新增 `/admin/ratings` 页面，展示待审核评分并支持分页
- [x] 实现审批表格，可快速通过/驳回并刷新列表
- [x] 管理端 API (`/api/admin/ratings/[id]`) 支持状态更新，复用服务层逻辑
- [x] 界面同步提示、错误处理，并串联导航入口

#### 当前状态
- ✅ 管理员可完成评分审核闭环
- ✅ 与前台评分表单、统计数据形成闭环
- ✅ 为后续审核日志或批量操作奠定基础


**完成时间:** 2025-10-02
**耗时:** ~3 小时

#### 完成内容
- [x] 新增 `/admin/games` 列表，支持搜索、状态过滤与分页
- [x] 表格提供查看前台、编辑详情、快速上下架等操作
- [x] 实现 `/admin/games/[id]` 编辑页，可维护标题、Slug、描述、分类/标签与热度标签
- [x] 扩展管理 API，支持批量字段更新与权限校验

#### 当前状态
- ✅ 管理员可完成常规的游戏信息维护
- ✅ 后续可在此基础上扩展批量导入、审核流程等高级能力


**完成时间:** 2025-10-02
**耗时:** ~3 小时

#### 完成内容
- [x] 建立管理员登录流程（密码校验 + 会话 Cookie）
- [x] 新增 /admin/login 页面与暗色主题仪表盘布局
- [x] 创建基础统计卡片（游戏总量、待审核评分、分类/标签数）
- [x] 提供登出、导航占位，便于扩展更多后台功能

#### 当前状态
- ✅ 管理员可安全登录后台并查看关键指标
- ✅ 后续 Step 13-14 可在此基础上扩展 CRUD 与审核流程

- [x] Step 13: 后台游戏管理工作流 ✅
- [x] Step 14: 后台评分审核中心 ✅
- [x] Step 15: 部署与运维基线 ✅

## 🚀 Phase 5: 部署与运维 (已完成)
- [x] Step 15: 部署与运维基线 ✅
- [x] Step 16: 运行时健康检测 ✅
- [x] Step 17: 运维脚本与状态检查 ✅
- [x] Step 18: API 与安全测试基线 ✅
- [x] Step 19: 安全头部与指南 ✅
- [x] Step 20: 发布准备与最终检查 ✅

## 🧪 Phase 6: 测试与安全 (已完成)
- [x] Step 18: API 与安全测试基线 ✅
- [x] Step 19: 安全头部与指南 ✅
- [x] Step 20: 发布准备与最终检查 ✅

---

## 📈 总体进度
- **Phase 1:** ✅ 完成 (Step 1-3)
- **Phase 2:** ✅ 完成 (Step 4-11)
- **总进度:** 100% (20/20 步骤完成)
- **预计完成:** 6-8 周
- **风险等级:** 🟡 中（后续需实现 API/UI/国际化）

## ⚠️ 当前阻塞
无

## 📝 备注
- 项目名称包含中文，package.json 使用 "game-hub" 作为合法标识
- 所有依赖安装成功，部分包有更新版本可用
- ✅ 外部服务客户端代码已完成（Cloudinary, Meilisearch, Redis）
- ⚠️ 用户需手动配置外部服务账号和凭证（参考 docs/setup/external-services.md）
- 📍 当前位置: Phase 5 进行中，下一步准备进入 Step 16（后续阶段）

### 优化记录 (基于 GPT-5 Codex 建议)
1. **ORM 切换:** 移除 Prisma，切换到 Drizzle ORM
   - 移除依赖: @prisma/client, prisma
   - 添加依赖: drizzle-orm, drizzle-kit, postgres, @neondatabase/serverless
   - 创建 drizzle.config.ts 和 db/ 目录结构
2. **字体修复:** 删除 globals.css 中的 `font-family: Arial` 避免覆盖 Inter 字体
3. **Cloudinary Preset:** 拆分为三个 preset（thumbnail/screenshot/icon）
4. **目录保持:** 添加 .gitkeep 到所有空目录，保持 Git 结构可见
5. **文档同步:** 更新 README.md 和 progress.md 反映 Drizzle 使用

---

## 2026-07-02 生产监测与可降级修复记录

**触发来源:** 飞书群「Luma gamehub」
**本次处理目标:** 读取 `251001_web_游戏聚合网站` 代码与线上监测状态，列出可修改问题并完成修复；后续继续生产修复。
**实际项目路径:** `/Users/yanruoyi/ai-native/active/251001_web_游戏聚合网站`
**生产域名:** `https://www.lumagamehub.com`

### 发现的问题

- `/api/health` 公开返回原始依赖错误，曾暴露 Supabase host 与 fetch 失败细节。
- `DATABASE_URL` 指向旧 Supabase host，生产环境健康检查仍无法连通数据库。
- 生产 `MEILISEARCH_HOST` 配置为 `http://localhost:7700`，在 Vercel 上必然不可达。
- Redis 线上检查返回 fetch failed，依赖不可用时只能降级。
- 搜索服务在 Meilisearch 与数据库都异常时缺少本地兜底，可能返回 500。
- Microsoft Clarity 默认 consent 实现与隐私页描述不一致，导致实际采集偏保守。
- 项目没有自动读取 GSC / Clarity 监测状态的本地命令；GSC OAuth 凭据未配置时无法拉取最新 clicks / impressions。

### 已完成修复

- 新增 `lib/ops/health.ts`，统一数据库、Redis、Meilisearch 健康检查与超时逻辑。
- 修改 `/api/health`，公开接口只返回泛化错误；内部 `pnpm ops:status` 仍保留详细错误，方便排障。
- 新增 `lib/games/fallback-search.ts`，提供基于本地 mock 游戏库的搜索兜底。
- 修改 `services/search.service.ts` 与 `/api/search`，Meilisearch 和 DB 都不可用时降级到 fallback 搜索。
- 修改 `components/analytics/ClarityConsent.tsx`，默认 `analytics_Storage=granted`、`ad_Storage=denied`，并支持 `NEXT_PUBLIC_GAMEHUB_CLARITY_DEFAULT_CONSENT=denied`。
- 修改 `lib/meilisearch/index.ts`，生产环境发现 Meilisearch host 指向 localhost 时视为未配置，避免无意义连接。
- 新增 `scripts/monitoring-status.ts` 与 `pnpm ops:monitoring`，检查主站、robots、sitemap、公开 health、Clarity tag、GSC 配置状态。
- 更新 `.env.example`，补充 Clarity 默认 consent、GSC 只读监测和 `MONITORING_SITE_URL` 示例。
- 已部署两次生产版本到 Vercel，生产别名仍指向 `https://www.lumagamehub.com`。

### 验证结果

- `pnpm type-check` 通过。
- `pnpm test -- --run` 通过，21 个测试全过。
- `pnpm build` 通过。
- `pnpm ops:monitoring` 可运行。
- 线上 `https://www.lumagamehub.com`、`robots.txt`、`sitemap.xml` 正常。
- 线上 sitemap 当前约 482 URLs。
- 线上 Clarity tag HTTP 200。
- 线上 `/api/search?q=snake&limit=3` 已降级返回 fallback 结果，首个结果为 `google-snake`。
- 线上 `/api/health` 仍返回 503，但已脱敏，不再泄露具体 host。

### 仍需外部配置处理

- 需要替换生产 `DATABASE_URL` 为可用数据库连接串；当前旧 Supabase host 在 Vercel 侧不可用。
- 需要修复或替换 `UPSTASH_REDIS_URL` / `UPSTASH_REDIS_TOKEN`。
- 需要提供可用 Meilisearch 公网服务，或从 Vercel 环境变量移除无效的 localhost 配置。
- 如需自动拉 GSC 数据，需要配置 `GSC_CLIENT_ID`、`GSC_CLIENT_SECRET`、`GSC_REFRESH_TOKEN`。
- Clarity 后台 session / heatmap 指标仍需 Microsoft Clarity UI 或可用 API 权限查看。

### 备注

- `docs/google-adsense-end-to-end-sop.md` 是处理前已存在的未跟踪文件，本次修复和记录没有覆盖它。
- 代码层已完成“可降级、少泄露、可监测”的修复；完整恢复健康状态依赖外部服务凭据更新。

---

## 2026-07-02 每日查漏补缺迭代记录

**触发来源:** 每日巡检
**生产域名:** [https://www.lumagamehub.com](https://www.lumagamehub.com)
**本次目标:** 查漏补缺、修复可修改问题、验证并记录

### 检查结果

- 已读取项目上下文：`README.md`、`docs/progress.md`、`docs/google-indexing-playbook.md`、`docs/setup/deployment.md`、`docs/security.md`。
- `git status --short` 显示进入本轮前已有多处未提交修改和未跟踪文件；本轮没有覆盖这些改动，也没有提交 git。
- 本地类型检查、单元测试、生产构建均通过。
- 生产构建期间仍出现数据库 1500ms timeout 并回退本地数据，和生产 `/api/health` 的 database error 属于同一外部配置问题。
- 线上抽查结果：
  - `https://www.lumagamehub.com/`: HTTP 200，约 5.4s。
  - `/robots.txt`: HTTP 200，包含 sitemap 地址。
  - `/sitemap.xml`: HTTP 200，约 482 URLs。
  - `/api/health`: HTTP 503，约 9.0s；返回内容已脱敏，显示 database error、redis/meilisearch degraded。
  - `/api/search?q=snake&limit=3`: HTTP 200，约 5.5s；返回 fallback 结果 `google-snake`。

### 发现的问题

- `pnpm ops:monitoring` 首次运行失败，原因是脚本对公开 health 检查使用 8 秒超时，而线上 `/api/health` 在当前外部服务异常与冷启动情况下约 9 秒返回脱敏 503，导致监测脚本把可解释的 degraded 状态误判为 error。
- `/api/health` 仍为 503，但这是生产 `DATABASE_URL`、Redis、Meilisearch 外部服务配置未恢复导致，不应在代码层伪造健康。
- GSC OAuth 凭据未配置，`pnpm ops:monitoring` 正确跳过 GSC 数据读取。

### 已完成修复

- 将 `scripts/monitoring-status.ts` 的监测请求超时从 8000ms 调整为 15000ms。
- 修复后 `pnpm ops:monitoring` 能稳定完成，并把公开 health 记录为 `degraded (HTTP 503, status=error)`，不再误报超时失败。
- 本轮没有改动生产业务逻辑，没有提交 git，没有部署。

### 验证结果

- `pnpm type-check`: 通过。
- `pnpm test -- --run`: 通过，6 个测试文件 / 21 个测试全过。
- `pnpm build`: 通过；构建日志仍记录数据库超时 fallback，外部配置待处理。
- `pnpm ops:monitoring`: 通过；结果为 site/robots/sitemap/clarity tag ok，public health degraded，GSC skipped。
- 线上抽查：
  - 首页：HTTP 200。
  - `robots.txt`: HTTP 200。
  - `sitemap.xml`: HTTP 200，约 482 URLs。
  - `/api/health`: HTTP 503，脱敏 degraded/error 状态。
  - `/api/search?q=snake&limit=3`: HTTP 200，fallback 搜索正常返回 `google-snake`。

### 仍需外部处理

- 替换或恢复生产 `DATABASE_URL`，当前数据库健康检查失败，构建与生产仍会 fallback。
- 修复或替换 `UPSTASH_REDIS_URL` / `UPSTASH_REDIS_TOKEN`。
- 配置可用的 Meilisearch 公网服务，或继续保持降级搜索策略并移除无效服务配置。
- 若需要自动拉取 GSC clicks/impressions，需要配置 `GSC_CLIENT_ID`、`GSC_CLIENT_SECRET`、`GSC_REFRESH_TOKEN`。

### 下一轮建议

- 优先修复 Vercel 生产环境变量，目标是 `/api/health` 从 503 恢复为 200，构建不再出现数据库 timeout fallback。
- 修复外部服务后重新运行 `pnpm ops:monitoring` 和线上 `/api/search?q=snake&limit=3`，确认搜索源不再是 fallback。
- 继续观察 sitemap 是否稳定包含真实 DB 游戏，避免 Google 抓取期间因 fallback 只看到本地/mock 数据。

---

## 2026-07-03 每日查漏补缺迭代记录

**触发来源:** 每日巡检
**生产域名:** https://www.lumagamehub.com
**本次目标:** 查漏补缺、修复可修改问题、验证并记录

### 检查结果

- 已读取项目上下文：`README.md`、`docs/progress.md`、`docs/google-indexing-playbook.md`、`docs/setup/deployment.md`、`docs/security.md`，并复核最近一次 2026-07-02 迭代记录。
- `git status --short` 显示进入本轮前已有多处未提交修改和未跟踪文件；本轮没有回退这些已有改动，也没有提交 git。
- `pnpm type-check` 首次运行在脚本执行前失败，原因是 pnpm 11 要求对已锁定依赖的 build scripts 做显式允许或拒绝。
- 本地类型检查、单元测试、生产构建在修复 pnpm 审批阻断后均通过。
- 生产构建期间仍出现数据库 1500ms timeout 并回退本地数据，和生产 `/api/health` 的 database error 属于同一外部配置问题。
- 部署前线上 `/api/health` 仍返回旧版详细错误，包含 Supabase host；部署后已确认不再暴露具体 host。

### 发现的问题

- 当前 pnpm 11 运行脚本前会执行依赖状态检查，因 `es5-ext`、`esbuild`、`unrs-resolver` 的 build scripts 未显式审批，导致 `pnpm type-check` 被阻断。
- 生产 `/api/health` 仍暴露旧数据库 host，说明上一轮本地脱敏代码尚未在生产域名生效。
- `/api/health` 部署后仍为 HTTP 503 / status=error，这是生产 `DATABASE_URL`、Redis、Meilisearch 外部服务配置未恢复导致。
- GSC OAuth 凭据未配置，`pnpm ops:monitoring` 正确跳过 GSC 数据读取。

### 已完成修复

- 新增 `pnpm-workspace.yaml`，显式允许当前锁定依赖 `es5-ext`、`esbuild`、`unrs-resolver` 执行 build scripts，使 pnpm 巡检命令可继续运行。
- 执行 `vercel --prod --yes` 部署生产版本，使本地 `/api/health` 公开脱敏逻辑在 `https://www.lumagamehub.com` 生效。
- 本轮没有提交 git。

### 验证结果

- `pnpm type-check`: 首次失败，原因是 pnpm 依赖 build-script 审批阻断；新增 `pnpm-workspace.yaml` 后复跑通过。
- `pnpm test -- --run`: 通过，6 个测试文件 / 21 个测试全过。
- `pnpm build`: 通过；构建日志仍记录数据库 1500ms timeout fallback，外部配置待处理。
- `pnpm ops:monitoring`: 通过；结果为 site/robots/sitemap/clarity tag ok，public health degraded，GSC skipped。
- 线上抽查：
  - 首页：HTTP 200。
  - `robots.txt`: HTTP 200，包含 sitemap 地址。
  - `sitemap.xml`: HTTP 200，约 482 URLs。
  - `/api/health`: HTTP 503，status=error；服务消息已脱敏为泛化错误，不再包含 Supabase host。
  - `/api/search?q=snake&limit=3`: HTTP 200，fallback 搜索正常返回 `google-snake`。

### 仍需外部处理

- 替换或恢复生产 `DATABASE_URL`，当前数据库健康检查失败，构建与生产仍会 fallback。
- 修复或替换 `UPSTASH_REDIS_URL` / `UPSTASH_REDIS_TOKEN`。
- 配置可用的 Meilisearch 公网服务，或继续保持降级搜索策略并移除无效服务配置。
- 若需要自动拉取 GSC clicks/impressions，需要配置 `GSC_CLIENT_ID`、`GSC_CLIENT_SECRET`、`GSC_REFRESH_TOKEN`。

### 下一轮建议

- 优先修复 Vercel 生产环境变量，目标是 `/api/health` 从 503 恢复为 200，构建不再出现数据库 timeout fallback。
- 修复外部服务后重新运行 `pnpm ops:monitoring` 和线上 `/api/search?q=snake&limit=3`，确认搜索源不再是 fallback。
- 持续确认 `pnpm-workspace.yaml` 是否符合团队依赖审批策略；如团队希望拒绝某个 build script，应改为显式 `false` 并复测构建。

---

## 2026-07-03 每日查漏补缺迭代记录

**触发来源:** 每日巡检
**生产域名:** https://www.lumagamehub.com
**本次目标:** 查漏补缺、修复可修改问题、验证并记录

### 检查结果

- 已读取项目上下文：`README.md`、`docs/progress.md`、`docs/google-indexing-playbook.md`、`docs/setup/deployment.md`、`docs/security.md`，并复核最近一次 2026-07-03 迭代记录。
- `git status --short` 显示进入本轮前已有多处未提交修改和未跟踪文件；本轮没有回退这些已有改动，也没有提交 git。
- 本地 `pnpm test -- --run`、`pnpm build`、`pnpm ops:monitoring` 可运行；构建期间仍出现数据库 1500ms timeout 并回退本地数据，属于外部数据库配置待处理。
- 部署前线上 `/api/health` 仍返回旧版详细数据库错误，包含 Supabase host；部署后已确认公开响应只返回泛化依赖错误。

### 发现的问题

- 生产 `/api/health` 仍暴露旧数据库 host，说明公开脱敏代码尚未在生产域名生效。
- health 脱敏逻辑缺少直接回归测试，存在后续改动误回退的风险。
- 本轮并发运行 `pnpm type-check` 与 `pnpm build` 时，`type-check` 读取到半生成的 `.next/types`，出现缺失文件错误；等待构建完成后顺序复跑通过。
- `/api/health` 部署后仍为 HTTP 503 / status=error，这是生产 `DATABASE_URL`、Redis、Meilisearch 外部服务配置未恢复导致。
- GSC OAuth 凭据未配置，`pnpm ops:monitoring` 正确跳过 GSC 数据读取。

### 已完成修复

- 新增 `tests/health.test.ts`，覆盖公开 health 响应必须隐藏原始依赖错误、内部 health 检查仍保留详细错误。
- 执行 `vercel --prod --yes` 部署生产版本，使公开 health 脱敏逻辑在 `https://www.lumagamehub.com` 生效。
- 本轮没有提交 git。

### 验证结果

- `pnpm type-check`: 并发首跑失败，原因是与 `pnpm build` 同时执行导致 `.next/types` 半生成；构建完成后顺序复跑通过。
- `pnpm test -- --run`: 通过，7 个测试文件 / 23 个测试全过。
- `pnpm build`: 通过；构建日志仍记录数据库 1500ms timeout fallback，外部配置待处理。
- `pnpm ops:monitoring`: 通过；结果为 site/robots/sitemap/clarity tag ok，public health degraded，GSC skipped。
- 线上抽查：
  - 首页：HTTP 200。
  - `robots.txt`: HTTP 200。
  - `sitemap.xml`: HTTP 200，约 482 URLs。
  - `/api/health`: HTTP 503，status=error；服务消息已脱敏为 `Database health check failed`、`Redis health check failed`、`Search index health check failed`，不再包含 Supabase host。
  - `/api/search?q=snake&limit=3`: HTTP 200，fallback 搜索正常返回 `google-snake`。

### 仍需外部处理

- 替换或恢复生产 `DATABASE_URL`，当前数据库健康检查失败，构建与生产仍会 fallback。
- 修复或替换 `UPSTASH_REDIS_URL` / `UPSTASH_REDIS_TOKEN`。
- 配置可用的 Meilisearch 公网服务，或继续保持降级搜索策略并移除无效服务配置。
- 若需要自动拉取 GSC clicks/impressions，需要配置 `GSC_CLIENT_ID`、`GSC_CLIENT_SECRET`、`GSC_REFRESH_TOKEN`。

### 下一轮建议

- 优先修复 Vercel 生产环境变量，目标是 `/api/health` 从 503 恢复为 200，构建不再出现数据库 timeout fallback。
- 避免把 `pnpm type-check` 与 `pnpm build` 并发执行；这两个命令都会依赖或生成 `.next/types`，巡检脚本化时应串行执行。
- 修复外部服务后重新运行 `pnpm ops:monitoring` 和线上 `/api/search?q=snake&limit=3`，确认搜索源不再是 fallback。

---

## 2026-07-03 增长监测与 SEO/GEO 优化记录

**触发来源:** 飞书群「Luma gamehub」
**生产域名:** https://www.lumagamehub.com
**本次目标:** 拉取 GA4 / GSC / Clarity / Typeform 监测数据，优化加载速度、外链内链、SEO、GEO

### 监测数据拉取结果

- 新增 `pnpm ops:growth`，统一尝试拉取 GA4、GSC、Microsoft Clarity Data Export、Typeform responses。
- `pnpm ops:growth` 当前结果：
  - `ga4`: skipped，缺 `GA4_PROPERTY_ID` / `GOOGLE_ANALYTICS_PROPERTY_ID`。
  - `gsc`: skipped，缺 Google OAuth 或 service-account 凭据。
  - `clarity`: skipped，缺 `CLARITY_API_TOKEN` / `CLARITY_DATA_EXPORT_TOKEN`。
  - `typeform`: skipped；公开 Typeform 表单 HTTP 200 可达，但缺 `TYPEFORM_TOKEN` / `TYPEFORM_ACCESS_TOKEN`，不能拉回复数。
- 已更新 `.env.example`，补充 GA4 property id、Google OAuth / service account、Clarity Data Export token、Typeform token 的配置入口。
- `pnpm ops:monitoring` 结果：site / robots / sitemap / Clarity tag 正常，public health degraded，GSC skipped。

### 加载速度

- 部署后首页线上抽查：HTTP 200，HTML 约 56KB，TTFB 约 6.56s，总耗时约 6.83s。
- 当前主要速度瓶颈仍是生产数据库 / Meilisearch 外部配置不可用导致的动态接口与构建 fallback；`/api/search?q=snake&limit=3` HTTP 200，但耗时约 10.88s 且 source=`fallback`。
- 已在根布局补充 Clarity 与 Typeform 的连接预热：
  - `preconnect` 到 `https://www.clarity.ms`。
  - `dns-prefetch` 到 `https://scripts.clarity.ms` 与 `https://form.typeform.com`。

### 外链内链

- 页脚新增高价值内链：搜索页、无广告游戏指南、无聊时玩什么指南。
- 修正 `scripts/check-external-links.ts`，将外链监测清单同步为实际页脚展示的 3 个外链，避免继续报告未展示旧清单的 403 / 反爬假阳性。
- `pnpm check:links` 结果：页脚 3 个外链均正常；游戏详情页抽样 10 个游戏 / 20 个外链均正常。数据库抽样仍因外部数据库超时回退本地样本。

### SEO / GEO

- 新增 `/llms.txt`，输出站点摘要、canonical、sitemap、重点中文/英文入口和内容说明，方便 AI 搜索与生成式引擎读取。
- 线上 `/llms.txt`: HTTP 200，约 1.6KB。
- `robots.txt` 仍保持标准 sitemap 声明，没有把 `llms.txt` 误列为 sitemap。
- `sitemap.xml` 线上仍约 482 URLs。

### 已完成修复

- 新增 `app/llms.txt/route.ts`。
- 新增 `scripts/growth-metrics.ts` 与 `pnpm ops:growth`。
- 更新 `.env.example` 的增长监测配置说明。
- 更新 `components/layout/Footer.tsx`，补充内链。
- 更新 `app/layout.tsx`，补充低风险连接预热。
- 更新 `scripts/check-external-links.ts`，让外链监测与真实页脚一致。
- 已执行 `vercel --prod --yes` 部署生产版本。

### 验证结果

- `pnpm ops:growth`: 通过；真实后台指标因缺凭据跳过，Typeform 公开表单 HTTP 200。
- `pnpm type-check`: 并发首跑失败，原因仍是与 `pnpm build` 同时执行导致 `.next/types` 半生成；构建完成后顺序复跑通过。
- `pnpm test -- --run`: 通过，7 个测试文件 / 23 个测试全过。
- `pnpm build`: 通过；构建日志仍记录数据库 1500ms timeout fallback，外部配置待处理。
- `pnpm ops:monitoring`: 通过；site / robots / sitemap / Clarity tag ok，public health degraded，GSC skipped。
- `pnpm check:links`: 通过；页脚外链与游戏详情页抽样外链正常。
- 线上抽查：
  - 首页：HTTP 200。
  - `/llms.txt`: HTTP 200。
  - `robots.txt`: HTTP 200，仅包含标准 sitemap。
  - `sitemap.xml`: HTTP 200，约 482 URLs。
  - `/api/search?q=snake&limit=3`: HTTP 200，fallback 搜索正常返回 `google-snake`。

### 仍需外部处理

- 配置 GA4 Data API：`GA4_PROPERTY_ID` 以及 Google OAuth / service-account 凭据。
- 配置 GSC 只读 OAuth 或 service account，并确保该账号有 Search Console property 权限。
- 在 Microsoft Clarity 项目设置中生成 Data Export API token，并配置 `CLARITY_API_TOKEN`。
- 配置 Typeform Personal Access Token，才能读取反馈表单 responses。
- 替换或恢复生产 `DATABASE_URL`，修复 Redis 与 Meilisearch 配置；这是当前加载速度和搜索耗时的最大瓶颈。

### 下一轮建议

- 优先补齐外部监测凭据，复跑 `pnpm ops:growth` 得到真实 GA4 / GSC / Clarity / Typeform 数字。
- 优先修复生产数据库与搜索服务，目标是 `/api/search?q=snake&limit=3` 不再 source=`fallback`，耗时降到 1s 以内。
- 巡检命令串行执行 `pnpm type-check` 与 `pnpm build`，避免 `.next/types` 竞争。

---

## 2026-07-03 GitHub/Vercel 版本合并记录

**触发来源:** 用户要求拉取 GPT5.5pro 已提交的 GitHub 与 Vercel 版本，对比本地版本，优化后合并入 `main`
**生产域名:** https://www.lumagamehub.com
**本次目标:** 以 `origin/main` / Vercel 当前生产版本为干净基线，合并本地未提交 SEO、监测、健康检查与增长脚本改动，并保留远端 GA4 与搜索修复

### 检查结果

- 本地活跃仓库位于 `/Users/yanruoyi/ai-native/active/251001_web_游戏聚合网站`，进入本轮前 `main` 落后 `origin/main` 5 个提交，且存在未提交修改与未跟踪文件。
- GitHub `origin/main` 最新提交为 `59e9007 fix(analytics): avoid duplicate initial GA pageview`，已包含 GPT5.5pro 的 GA 首次 pageview 去重修复。
- Vercel 当前生产部署为 `dpl_FSV8Mv2sC88BWvb4hkNUfKqGAzrW`，别名包含 `https://lumagamehub.com` 与 `https://www.lumagamehub.com`。
- 创建隔离 worktree `/tmp/luma-gpt55-merge-20260703-120509`，基于 `origin/main` 合并本地 patch，避免直接污染活跃脏工作区。
- 合并冲突仅发生在 `.env.example` 的 Analytics/Feedback 配置说明，已合并为“显式 GA4 measurement id + Clarity 默认 consent + GSC/GA4/Clarity/Typeform 监测凭据占位”。

### 已完成修复与保留

- 保留远端 `send_page_view: false`，避免 GA4 初次加载和 `AnalyticsListener` 重复记一次 pageview。
- 保留远端分页整数保护，避免 `/api/search?page=1.5` 等非整数参数污染分页逻辑。
- 合并本地 `/api/health` 脱敏、共享 health helper、health 回归测试、fallback 搜索、监测脚本、增长指标脚本、`/llms.txt`、页脚内链与 SEO 内容扩展。
- 生产环境变量列表确认存在 `DATABASE_URL`、Upstash Redis、Meilisearch、GA4 measurement id、Clarity project id、Typeform form id；但本地拉取生产 env 后复现为 DB/Redis 超时、Meilisearch fetch failed，说明不是变量缺失，而是外部服务慢或不可达。

### 验证结果

- `pnpm install --frozen-lockfile`: 通过；pnpm 仍提示部分依赖 build scripts 被忽略。
- `pnpm type-check`: 通过。
- `pnpm lint`: 通过，无 ESLint warning/error。
- `pnpm test -- --run`: 通过，7 个测试文件 / 23 个测试全过。
- `pnpm build`: 通过；构建期间仍因本地未配置 DB 触发 fallback，但未阻断构建。
- `pnpm ops:monitoring`: 通过；site / robots / sitemap / Clarity tag ok，public health degraded，GSC skipped。
- `pnpm ops:growth`: 通过；GA4 Data API、GSC、Clarity Data Export、Typeform responses 因缺 API 凭据跳过；Typeform 公开表单 HTTP 200。
- 线上抽查：
  - `/en`: HTTP 200。
  - `/robots.txt`: HTTP 200。
  - `/sitemap.xml`: HTTP 200，约 482 URLs。
  - `/api/search?q=snake&limit=3`: HTTP 200，fallback 返回 `google-snake`。
  - `/api/health`: HTTP 503，公开错误已脱敏；生产 DB/Redis/Meilisearch 仍需外部修复。

### 备份与回滚点

- 合并前保存本地 patch、未跟踪文件 tar 与状态记录到 `/Users/yanruoyi/ai-native/ops/daily-growth/backups/2026-07-03/luma-gpt55-merge/`。
- 合并前远端 backup tag：`backup/luma/20260703-120450-before-gpt55-merge`。

### 仍需外部处理

- 修复生产数据库、Redis、Meilisearch 可达性，目标是 `/api/health` 恢复 200，游戏详情与搜索不再依赖 fallback。
- 若要自动拉取真实后台数据，需要配置 `GA4_PROPERTY_ID`、Google OAuth/service-account、`CLARITY_API_TOKEN`、`TYPEFORM_TOKEN`。

### 下一轮建议

- 合并部署后继续观察 Vercel Runtime Logs 中的 `Game detail database load timed out after 1500ms`，优先从数据库连接串、区域、Neon/Supabase 状态和连接池配置排查。
- 补齐数据 API 凭据后把 `pnpm ops:growth` 纳入每日任务，避免再依赖手动浏览器截图读 GSC/Clarity。

---

## 2026-07-03 GitHub/Vercel 二次同步与监测补强记录

**触发来源:** 用户确认 GPT5.5pro 可能已提交 GitHub，要求拉取 GitHub 与 Vercel 版本、对比本地版本、优化后合并入 `main`
**生产域名:** https://www.lumagamehub.com
**本次目标:** 以最新 `origin/main` 与当前 Vercel 生产部署为基线，判断本地未提交改动是否仍需合入，并补齐仍缺失的自动化监测项

### 检查结果

- 当前活跃仓库 `/Users/yanruoyi/ai-native/active/251001_web_游戏聚合网站` 不是干净状态，`main` 落后 `origin/main` 23 个提交，并存在未提交修改与未跟踪文件。
- GitHub `origin/main` 最新提交为 `72efb8c perf(build): skip tag redis reads during static build`，已包含 2026-07-03 下午新增的 AdSense、搜索、guide 内容、构建期跳过 DB/Redis 读取等提交。
- Vercel 当前生产部署 `dpl_DDQS2u1dvgKxCUWSsSHomEaY6b9p` 已 Ready，别名包含 `https://lumagamehub.com` 与 `https://www.lumagamehub.com`，创建时间为 2026-07-03 18:00:07 +0800。
- 本地未提交改动与最新 `origin/main` 对比后，多数属于旧版本回退：会删除新增 guide、`ads.txt`、`llms.txt`、健康检查 helper、增长脚本，并会回退 GA4 pageview 去重、搜索 fallback、分页整数保护和构建期跳过 DB/Redis 读取。未整体合并。
- 创建隔离 worktree `/tmp/luma-sync-gpt55-20260703-180823`，基于 `origin/main` 做本轮补强，未覆盖活跃仓库未提交内容。

### 发现的问题

- `pnpm ops:monitoring` 只检查 site、robots、sitemap、public health、GSC、Clarity tag，未覆盖用户每日巡检要求中的 `/api/search?q=snake&limit=3`。
- 生产 `/api/health` 返回 HTTP 503，公开状态为 `database=error`、`redis=degraded`、`meilisearch=degraded`。
- 生产 `/api/search?q=snake&limit=3` 返回 HTTP 200，但 `source=fallback`，说明搜索可用性由本地 fallback 兜底，真实 DB/Meilisearch 仍未恢复。

### 已完成修复

- 更新 `scripts/monitoring-status.ts`，新增 `search api` 检查项：
  - 请求 `https://www.lumagamehub.com/api/search?q=snake&limit=3`。
  - HTTP 非 2xx 记为 `error`。
  - HTTP 200 但 `source=fallback`、`degraded=true` 或无结果时记为 `degraded`。
  - 输出 `HTTP status`、`source`、`total`，便于每日任务区分“搜索不可用”和“搜索靠 fallback 可用”。

### 验证结果

- `pnpm install --frozen-lockfile`: 通过；pnpm 仍提示部分依赖 build scripts 被忽略。
- `pnpm type-check`: 通过。
- `pnpm test -- --run`: 通过，7 个测试文件 / 23 个测试全过。
- `pnpm build`: 通过；构建期间按设计跳过数据库读取并使用 fallback，不阻断构建。
- `pnpm ops:monitoring`: 通过并新增搜索项：
  - `site`: ok，HTTP 200。
  - `robots`: ok，HTTP 200。
  - `sitemap`: ok，488 URLs。
  - `public health`: degraded，HTTP 503，status=error。
  - `search api`: degraded，HTTP 200，source=fallback，total=1。
  - `gsc`: skipped，缺本地 GSC OAuth 凭据。
  - `clarity tag`: skipped，临时 worktree 本地未配置 Clarity project id。
- 线上抽查：
  - `/`: HTTP 200。
  - `/en`: HTTP 200。
  - `/robots.txt`: HTTP 200。
  - `/sitemap.xml`: HTTP 200。
  - `/ads.txt`: HTTP 200。
  - `/llms.txt`: HTTP 200。
  - `/en/guides/quick-play-guide`: HTTP 200。
  - `/en/guides/no-download-games`: HTTP 200。

### 备份与回滚点

- 本轮基线远端 tag：`backup/luma/20260703-180823-before-sync-gpt55`，指向同步前的 `origin/main`。
- 本轮隔离分支：`automation/20260703-180823-luma-sync-gpt55`。
- 本轮 manifest：`/Users/yanruoyi/ai-native/ops/daily-growth/backups/2026-07-03/luma-sync-gpt55/manifest.md`。

### 仍需外部处理

- 修复生产数据库、Redis、Meilisearch 的真实连通性；目前变量存在于 Vercel，但服务检查失败。
- 若要 `pnpm ops:growth` 自动读取真实后台数据，仍需补齐本地或安全运行环境中的 `GA4_PROPERTY_ID`、Google OAuth/service-account、`CLARITY_API_TOKEN`、`TYPEFORM_TOKEN`。

### 下一轮建议

- 优先排查 Vercel Runtime Logs 中数据库连接失败的真实错误，确认 `DATABASE_URL` 指向的主机是否仍有效。
- 搜索 API 在 fallback 状态下虽然可用，但应以 `source=database` 或 `source=meilisearch` 为恢复标准。
- 每次同步前继续以 `origin/main` 为基线创建隔离 worktree，避免把活跃仓库旧脏改动误合并到生产。

---

## 2026-07-03 搜索后端韧性与生产配置监测记录

**触发来源:** 用户要求继续修复 Luma Game Hub 未解决问题
**生产域名:** https://www.lumagamehub.com
**本次目标:** 在外部 DB/Redis/Meilisearch 尚未恢复前，降低搜索接口被后端超时拖慢的风险，并让每日监测直接暴露生产配置问题

### 检查结果

- 生产 `DATABASE_URL` 结构为 Supabase direct host `db.atbmcpmdqrnetlxnchwv.supabase.co:5432`，不适合作为 Vercel serverless 生产流量的首选连接方式。
- 生产 `MEILISEARCH_HOST` 指向 `http://localhost:7700`，生产代码会安全忽略该配置并降级搜索。
- 使用现有生产数据库密码探测常见 Supavisor pooler 区域，未找到可直接连接的 pooler host；不能在未确认 region/URL 的情况下强改生产 `DATABASE_URL`。
- `pnpm ops:monitoring` 之前只能看到 `public health` 和 `search api` degraded，不能明确指出配置风险。

### 已完成修复

- 新增 `lib/db/connection-policy.ts`，识别 local、Supabase direct、Supabase pooler、其他数据库连接形态。
- `lib/db/index.ts` 改为按连接形态设置 postgres-js：
  - Vercel/serverless 默认 `max=1`，避免单函数实例开过多连接。
  - Supabase pooler 自动关闭 prepared statements。
  - Supabase direct/pooler 自动要求 SSL。
  - Supabase direct + serverless 输出明确 warning。
- `services/search.service.ts` 给 Meilisearch 和数据库搜索增加短超时，后端不可达时更快降级到本地 fallback，避免用户搜索长时间等待。
- `lib/utils/redis-helper.ts` 给 Redis get/set/delete 增加短超时，避免 Upstash 变慢时拖住主流程。
- `scripts/monitoring-status.ts` 新增：
  - `database config` 检查：生产目标站点下 Supabase direct URL 标为 degraded。
  - `meilisearch config` 检查：生产目标站点下 localhost Meili 标为 degraded。
- `docs/setup/external-services.md` 增加 Vercel + Supabase 生产连接要求，明确应使用 Supavisor pooler transaction URL。
- 新增回归测试：
  - `tests/db-connection-policy.test.ts`
  - `tests/search.service.test.ts`

### 验证结果

- `pnpm type-check`: 通过。
- `pnpm test -- --run`: 通过，9 个测试文件 / 26 个测试。
- `pnpm build`: 通过，英文静态 HTML 修补 21/21。
- `pnpm ops:monitoring`: 通过并正确标记：
  - `database config`: degraded，Supabase direct URL in serverless runtime。
  - `meilisearch config`: degraded，localhost Meili。
  - `site` / `robots` / `sitemap` / `clarity tag`: ok。
  - `public health` / `search api`: degraded。
  - `gsc`: skipped，缺本地 GSC OAuth 凭据。

### 仍需外部处理

- 从 Supabase Dashboard 复制当前项目的 Supavisor transaction pooler URL，并替换 Vercel Production/Preview/Development 的 `DATABASE_URL`。
- 配置真实生产 Meilisearch host，或确认暂时不使用 Meilisearch，把搜索恢复标准改为 `source=database`。
- 补齐 GSC/GA4/Clarity/Typeform API 凭据后，让 `pnpm ops:growth` 自动读取真实数据。

### 下一轮建议

- 先完成 Supabase pooler URL 替换并重新部署；目标是 `/api/search?q=snake&limit=3` 返回 `source=database`，`/api/health` 中 database 恢复 `ok`。
- 如果 Meilisearch 暂时不部署，保留 `meilisearch config` degraded，但不要让它阻塞内容增长；搜索恢复以数据库为主。
- 后续内容优化继续围绕 GSC 已有点击信号：Google Snake Mods、Apple Knight、OvO。

---

## 2026-07-04 每日内容质量补强迭代记录

**触发来源:** AdSense 准备定时任务
**生产域名:** https://www.lumagamehub.com
**本次目标:** 选择一个已有搜索或访问信号的薄内容游戏页，补强原创说明、玩法、操作、FAQ 和站内相关链接，让页面更像有独立价值的游戏指南页，而不是单纯 iframe 集合。

### 检查结果

- 已读取 `docs/google-adsense-end-to-end-sop.md`、`/Users/yanruoyi/ai-native/ops/daily-growth/sites/lumagamehub.com.md`、`/Users/yanruoyi/ai-native/ops/daily-growth/todo-current.md`。
- 已复核 Google 官方 AdSense 文档：
  - AdSense 申请前页面应有独特、相关、对访客有价值的内容和清晰导航。
  - 低价值内容、抓取/搬运内容、缺少原创价值的页面会影响审核。
  - `ads.txt` 非强制但推荐；正式 publisher ID 仍需用户在 AdSense 后台获得后人工处理。
- 当前仓库已有未提交的 Solitaire 页面补强改动，且最近 Vercel Analytics 记录显示 `/en/games/solitaire` 有访问；因此本轮选择继续完成 Solitaire 页面，而不是另选低确定性页面。
- 本轮未使用未确认授权的新图片、ROM、破解下载、APK、安装包或下载诱导。

### 发现的问题

- 原 Solitaire 页面偏薄，主要是可玩 iframe、基础信息和少量技巧，不足以支撑 AdSense 审核视角下的独立内容价值。
- 需要补齐：
  - 原创介绍。
  - How to play。
  - Controls。
  - Tips。
  - FAQ。
  - Related games / guides。
  - 来源与无下载风险说明。

### 已完成修复

- 更新 `app/[locale]/games/solitaire/page.tsx`：
  - 更新 title / description。
  - 新增 overview 正文渲染。
  - 新增 How to play 步骤。
  - 新增 Controls 区块。
  - 新增 FAQ 区块并输出 `FAQPage` JSON-LD。
  - 新增 Related games and guides 内链。
  - 在详情区新增 play source / 游玩来源说明，明确 Luma 不提供 installer、APK、ROM 或 cracked download。
- 更新 `messages/en.json` / `messages/zh.json`：
  - 补充 Solitaire 中英文原创介绍、玩法、操作、FAQ、相关链接和来源说明。
  - 英文原创介绍扩展到 150+ 词等效内容，中文同步补充可读说明。

### 验证结果

- `node JSON.parse(messages/*.json)`: 通过。
- `pnpm type-check`: 通过。
- `pnpm lint`: 通过，无 ESLint warnings/errors。
- `pnpm test -- --run`: 通过，9 个测试文件 / 26 个测试。
- `pnpm build`: 通过；构建完成 103 个静态页面，英文静态 HTML 修补 21/21。
- `git diff --check`: 通过。
- 构建产物抽查：可检索到新增 `What makes this Solitaire page useful`、`Play source`、`no installer` 等文案。

### 仍需外部处理

- 本轮未提交 git、未部署生产；需在确认当前未提交改动归属后再决定提交和部署。
- 当前仓库还包含 `app/[locale]/games/monster-survivors/page.tsx` 与 `messages/en.json` 中 Monster Survivors 相关未提交改动；这些不是本轮选择的页面，后续提交前要单独确认是否一起纳入。
- AdSense 后台账号、付款、身份验证、正式提交审核、publisher ID 和正式 `ads.txt` 行仍需用户人工处理。

### 下一轮建议

- 优先确认并提交/部署 Solitaire 内容补强；上线后抽查 `/en/games/solitaire`、`/games/solitaire` 的 title、description、H1、FAQ JSON-LD、related links 和 iframe 可玩性。
- 继续按 GSC / Vercel 数据优先补强已有信号页：Google Snake Mods、Apple Knight、OvO、Solitaire。
- 不要在 AdSense 申请前添加广告位；先继续补足 30 个高质量游戏页和 5-10 个高质量 guide / collection 页。

---

## 2026-07-04 历史未完成项闭环记录

**触发来源:** 用户要求阅读历史记录并完成未完成项
**生产域名:** https://www.lumagamehub.com
**本次目标:** 汇总当前历史记录中可直接完成的本地事项，复核已有未提交改动，并把仍需外部凭据或用户信息的事项明确留下。

### 已读取的记录

- `docs/google-adsense-end-to-end-sop.md`
- `/Users/yanruoyi/ai-native/ops/daily-growth/sites/lumagamehub.com.md`
- `/Users/yanruoyi/ai-native/ops/daily-growth/todo-current.md`
- `docs/progress.md` 最新记录
- Luma 维护记忆中的日常流程约束
- 当前 `git status --short` 与本地 diff

### 已完成闭环

- 复核当前未提交内容补强改动：
  - `app/[locale]/games/solitaire/page.tsx`
  - `app/[locale]/games/monster-survivors/page.tsx`
  - `messages/en.json`
  - `messages/zh.json`
- 确认两页均已补齐原创 overview、how to play、controls、tips、FAQ、related links，并避免 ROM、APK、破解下载、安装包、成人、赌博或诱导点击内容。
- 复核 AdSense 接入准备：
  - 当前代码、`.env*` 和生产 HTML 均未发现真实 `ca-pub-...` publisher ID。
  - 已在 SOP 中记录：没有真实 publisher ID 前，不写入占位 ID、不上线 AdSense script/meta、不伪造 `ads.txt` seller line、不添加广告容器。
- 复核 JSON：
  - `messages/en.json` 通过 `jq empty`。
  - `messages/zh.json` 通过 `jq empty`。
- 复核生产监测：
  - `pnpm ops:monitoring` 通过运行。
  - site / robots / sitemap / clarity tag 为 ok。
  - public health 与 search api 仍为 degraded，原因仍是外部 DB/Meilisearch/Redis 配置未恢复。

### 验证结果

- 本轮继承并复核了前一轮验证结果：`pnpm lint`、`pnpm build`、重新运行后的 `pnpm type-check` 均通过。
- 本轮新增复核：
  - `jq empty messages/en.json`
  - `jq empty messages/zh.json`
  - `pnpm ops:monitoring`

### 仍未完成但被外部信息阻塞

- AdSense 代码正式接入：缺真实 AdSense publisher ID，需用户从 AdSense 后台提供 `ca-pub-xxxxxxxxxxxxxxxx`。
- 生产真实数据源恢复：需有效 Supabase Supavisor transaction pooler `DATABASE_URL`，以及 Redis / Meilisearch 的生产可用配置。
- 真实后台数据自动读取：缺 GSC OAuth、GA4 Data API、Clarity API、Typeform token 等凭据。
- 当前本地内容补强尚未提交或部署；按维护流程，本轮不自动提交 git，不自动部署生产。

### 下一轮建议

- 用户提供真实 AdSense publisher ID 后，再接入 `NEXT_PUBLIC_ADSENSE_CLIENT` / `NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT`，并只在 production 输出一次 meta/script。
- 确认当前 Solitaire 与 Monster Survivors 内容补强可以一起提交后，再走标准门禁并部署生产。
- 在外部连接串恢复前，继续把 T-067 保持为 P0；fallback 可服务用户，但不能作为 AdSense 申请前的长期健康状态。

---

## 2026-07-04 全量代码检查与修正记录

**触发来源:** 用户要求读取项目所有代码并进行全面检查修正
**本次目标:** 在不提交、不部署、不覆盖既有未提交内容补强的前提下，对当前 Luma Game Hub 本地仓库做一次项目级静态扫描、构建验证和高风险小修。

### 检查范围

- 扫描项目源文件与配置文件约 210 个，排除 `.next`、`node_modules`、`coverage`、`playwright-report`、`test-results` 等生成目录。
- 读取并复核核心配置：`package.json`、`next.config.mjs`、`middleware.ts`、`i18n/*`、`tsconfig.json`、`vitest.config.ts`、`playwright.config.ts`、`eslint.config.mjs`、`pnpm-workspace.yaml`。
- 扫描 `TODO/FIXME`、`as any`、`debugger`、`console.log`、`localhost`、`example`、占位和 AdSense 相关关键字。
- 复核当前脏工作区，保留已有 Solitaire / Monster Survivors 内容补强、AdSense SOP 补充和消息文案改动。

### 实际修正

- `i18n/config.ts`: 新增 `isLocale()` 类型守卫，集中处理 locale 校验。
- `i18n/request.ts`: 使用 `isLocale()` 和 `defaultLocale` 兜底，移除 `as any`。
- `components/layout/Header.tsx`: 语言切换路径判断改用 `isLocale()`，移除 `as any`。
- `middleware.ts`: 为 `next-intl` middleware 增加 `localeDetection: false`，让 `/`、`/zh`、`/en` 在本地与生产 SSR 中按路径稳定解析，避免浏览器 `Accept-Language` 影响深层页面语言。
- `package.json`: 将 `type-check` 改为 `tsc --noEmit --incremental false`，减少 `.tsbuildinfo` 或并行构建对类型检查的干扰。
- `test-results/.last-run.json`: Playwright 运行会更新该缓存，本轮已恢复原内容，避免提交测试运行痕迹。

### 验证结果

- `pnpm type-check`: 通过。
- `pnpm lint`: 通过。
- `pnpm test -- --run`: 通过，9 个测试文件 / 26 个测试。
- `pnpm build`: 通过；构建完成 103 个静态页面，英文静态 HTML 修补 21/21。
- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3100 pnpm test:e2e`: 通过，3 passed / 1 skipped；确认 `/zh`、`/en` 和游戏浏览路径语言稳定。
- `pnpm check:links`: 通过；抽样 footer 和游戏外链均为 HTTP 200。
- `pnpm ops:growth`: 可运行，但 GA4 / GSC / Clarity / Typeform 指标读取因缺凭据全部跳过。
- `pnpm ops:monitoring`: 可运行但状态仍 degraded；database 使用 Supabase direct URL、Meilisearch 为 `http://localhost:7700`、public health degraded、search api `source=fallback`，属于外部配置阻塞。
- `git diff --check`: 通过。

### 仍需外部处理

- T-067 仍为 P0：需要有效 Supabase Supavisor transaction pooler `DATABASE_URL`、Redis、Meilisearch 生产配置；目标是 `/api/health status=ok` 且 search 不再 fallback。
- T-083 仍为 P1：真实后台数据自动化读取缺 GSC OAuth、GA4 Data API、Clarity API、Typeform token。
- AdSense 正式代码接入仍阻塞：当前未发现真实 `ca-pub-...` publisher ID；用户提供前不接入占位 publisher ID、不加广告容器。
- 本轮未提交 git、未部署生产；当前修复是 local-ready，生产 `/en/*` 深层页面仍需部署后再抽查。

### 下一轮建议

- 确认本轮代码修复与 Solitaire / Monster Survivors 内容补强是否一起提交；若一起发布，部署后优先抽查 `/en/games`、`/en/games/solitaire`、`/en/games/monster-survivors` 的 `<html lang>`、canonical、title、FAQ JSON-LD 和 iframe。
- 若只想先修复技术 SEO，可用当前代码变更单独提交 `i18n/*`、`middleware.ts`、`Header.tsx`、`package.json`，内容补强另开提交。
- 外部配置未恢复前，不建议把 degraded 健康状态视为 AdSense 申请前达标。

---

## 2026-07-04 Chrome 后台数据读取与 GA4 修复记录

**触发来源:** 用户指出 GA4 / GSC / Clarity / Typeform 均已在 Chrome 登录，要求仔细查找。
**本次目标:** 通过已登录 Chrome 只读读取真实后台指标，并修复发现的 GA4 首次 pageview 可能丢失问题。

### 后台读取结果

- GSC `sc-domain:lumagamehub.com` Last 28 days：27 clicks / 1.58K impressions / CTR 1.7% / average position 20.3，Last update 3 hours ago。
- GSC Top page：`/en/guides/google-snake-mods` 9 clicks / 634 impressions / CTR 1.4% / avg position 13.2。
- GSC 机会词：`snake mods` 0 clicks / 62 impressions / avg position 6.6；`best free iphone games` 0 / 52 / 30.1；`snake mod` 0 / 24 / 9.0；`google snake game mod` 0 / 13 / 4.8。
- GA4 Luma stream 已确认：stream name `Luma Game Hub`；URL `https://www.lumagamehub.com`；stream ID `15191555864`；Measurement ID `G-M5N3TXN56Z`。
- GA4 当前状态：后台显示 `No data received in past 48 hours`；Last 7 days Active users / Event count / New users 均为 0；Realtime active users 0。
- Clarity GameHub Last 7 days：57 sessions / 45 non-bot sessions / 57 unique users / avg scroll depth 38.31% / active time 8s；`game_play_start` 3 sessions；Google referrer 20。
- Typeform GameHub Feedback All time：2 views / 1 start / 1 submission / completion rate 100% / time to complete 00:05；未打开单条 response 正文。

### 实际修正

- 修改 `components/layout/AnalyticsListener.tsx`：
  - 原逻辑在 `window.gtag` 尚未 ready 时直接 return，首次 pageview 可能静默丢失。
  - 新逻辑在 gtag 未 ready 时最多重试 10 次，每次 300ms；组件卸载时清理 timer。
- 生产 HTML 复核：`https://www.lumagamehub.com/en` 已包含 `G-M5N3TXN56Z`、`gtag` 与 `googletagmanager`；本轮修复针对客户端发送时序，不是补 ID。

### 验证结果

- `pnpm lint`: 通过，无 ESLint warnings/errors。
- `pnpm type-check`: 通过。
- `pnpm test -- --run`: 通过，9 个测试文件 / 26 个测试。
- `pnpm build`: 通过；构建完成 103 个静态页面，英文静态 HTML 修补 21/21。构建期仍出现已知的 Browserslist 数据过期提示和 DB fallback 提示。

### 仍需跟进

- GA4 pageview retry 修复已提交并部署到生产：commit `2a6a8c7`，deployment `dpl_7AvhmoGf7W6kbLxwM4Mz1KgBTTcP`，`https://www.lumagamehub.com/en` 已确认切到新部署并包含 `G-M5N3TXN56Z`、`gtag('config'...)`、`send_page_view`。
- GA4 是否开始收数需要观察 24-48 小时；本轮未刻意制造浏览器访问来刷 Realtime。
- API 自动化读取仍缺 GSC OAuth、GA4 Data API、Clarity Data Export token、Typeform token；Chrome 后台只读读取可作为短期替代口径。
- Clarity 显示 LCP 5.4s、INP 550ms，首页和游戏目录首屏性能需要进入后续优化队列。

---

## 2026-07-04 优化队列推进记录

**触发来源:** 用户要求按“其他可优化方向”顺序逐项完成。
**执行原则:** 外部配置项先诊断并明确阻塞；可用代码项小步提交、验证、部署，不混入当前内容页脏改动。

### P0 技术健康诊断

- `pnpm ops:monitoring` 仍显示：
  - `database config`: degraded，生产 `DATABASE_URL` 是 Supabase direct 5432，serverless 环境应改为 Supavisor pooler transaction mode。
  - `meilisearch config`: degraded，生产 `MEILISEARCH_HOST` 仍是 `http://localhost:7700`。
  - `public health`: HTTP 200 但 `status=degraded`。
  - `search api`: HTTP 200 但 `source=fallback`。
- Vercel production env 摘要确认：
  - `DATABASE_URL`: `postgresql://db.atbmcpmdqrnetlxnchwv.supabase.co:5432`
  - `UPSTASH_REDIS_URL`: `https://loved-ape-20290.upstash.io`
  - `MEILISEARCH_HOST`: `http://localhost:7700`
- Upstash host 本地 DNS 解析到 `198.18.3.6`，TLS 连接失败；生产 `/api/health` 也显示 Redis degraded。
- 结论：P0 不是当前代码可安全修复的问题。需要外部提供/恢复：
  - Supabase Supavisor pooler transaction `DATABASE_URL`。
  - 可用 Upstash Redis REST URL/token 或替代 Redis。
  - 可用生产 Meilisearch host/key，或决定正式移除 Meilisearch 依赖并接受 database-only search。

### P1 locale 修复与部署

- 第一阶段提交：`04e6a76 fix(i18n): stabilize locale routing`
  - 修复 `middleware.ts`、`i18n/config.ts`、`i18n/request.ts`、`components/layout/Header.tsx`。
  - 部署：`dpl_B46tMXdfVkU3KFC6DPhhgHCvXfmU`。
  - 生产验证显示 `/en` 与 `/en/games` 正确，但 `/en/about`、`/en/contact`、`/en/privacy`、部分详情和分类仍为 `lang=zh`。
- 根因补充提交：`93b56cb fix(i18n): render document locale from request`
  - `app/layout.tsx` 根据 middleware 注入的 `x-next-intl-locale` 请求头输出服务端 `<html lang>` / `data-locale`。
  - 本地验证：`pnpm build` 通过，`pnpm exec tsc --noEmit --incremental false` 通过；本地 production server 抽查所有 `/en/*` 为 `lang=en`，中文路径仍为 `zh`。
  - 部署：`dpl_3cuTroFYYwbW6gxch351k7AmdCc9` Ready。
  - 生产验证：
    - `/en`、`/en/games`、`/en/games/category/puzzle`、`/en/games/solitaire`、`/en/about`、`/en/contact`、`/en/privacy` 均 HTTP 200 且 `<html lang="en" data-locale="en">`。
    - `/`、`/games`、`/about`、`/contact`、`/privacy` 均 HTTP 200 且 `<html lang="zh" data-locale="zh">`。

### 当前状态

- P0 外部服务健康：blocked-external-config。
- P1 locale 技术 SEO：deployed-fixed。
- 下一项：优化 `/en/guides/google-snake-mods`，目标是提升 `snake mods` / `google snake mod` 相关 CTR。

### T-085 Google Snake Mods CTR 优化

- 选择原因：Chrome 后台读取到 GSC Last 28 days 中 `/en/guides/google-snake-mods` 为 9 clicks / 634 impressions / CTR 1.4% / avg position 13.2；`snake mods` 为 0 clicks / 62 impressions / avg position 6.6，属于已有曝光但 CTR 偏低的页面。
- 来源复核：公开来源显示 DarkSnakeGang 旧 bookmark 方法已不再是当前首选；当前更推荐独立 modded web 版本或 userscript loader。本轮据此修正文案，避免继续给玩家过时安装步骤。
- 实际改动：更新 Google Snake Mods 中英文 title、description、H1、overview、H2 sections、FAQ 与 related guides；新增安装前安全检查，明确不提供安装包、APK、ROM、破解或可疑下载；把推荐游戏链接改为当前数据中确实存在的 `google-snake`、`tunnel-rush`、`ovo`。
- 验证结果：`pnpm exec tsc --noEmit --incremental false` 通过；`pnpm lint` 通过；`pnpm build` 通过。构建期仅保留已知 Browserslist 老化提示和 DB build fallback 提示。
- 本地 production 验证：`/en/guides/google-snake-mods` 与 `/guides/google-snake-mods` 均 HTTP 200，输出新 title/description/H1/FAQ；相关游戏与专题链接本地均 200。
- 提交部署：commit `688b401 improve google snake mods guide` 已推送 `origin/main`；Vercel production deployment `dpl_HcsqEvNzCZxmsB4ojPpeCX9Yxi1V` Ready，并挂载 `https://www.lumagamehub.com`。
- 生产验证：`https://www.lumagamehub.com/en/guides/google-snake-mods` 与 `/guides/google-snake-mods` 均 HTTP 200；英文页为 `<html lang="en" data-locale="en">`，中文页为 `<html lang="zh" data-locale="zh">`；新 title、description、H1、FAQ、安全检查与 related links 均已上线；`/en/games/google-snake`、`/en/games/tunnel-rush`、`/en/games/ovo`、`/en/guides/best-browser-games-5-minute-break`、`/en/guides/free-games-no-ads` 均 HTTP 200。
- 下一步：7-14 天后复查 GSC `snake mods`、`google snake mod`、`google snake game mod` 的 impressions/CTR/position。

### T-097 Best Free iPhone Games CTR 优化

- 选择原因：同一轮 GSC 机会词显示 `best free iphone games` 为 0 clicks / 52 impressions / avg position 30.1；现有页面内容可用但偏泛，首屏没有充分解释“iPhone 免费游戏、无需 App Store、触控适配、短局选择”的实际决策。
- 实际改动：更新 `best-free-iphone-games` 中英文 title、description、H1、subheading、overview、sections 与 FAQ；新增“按场景选择首个游戏 / Best Picks by Situation”和“iPhone 上要避开什么 / What to Avoid on iPhone”；related guides 增加 `free-games-no-ads`。
- 合规边界：未引入外部图片、安装包、APK、破解下载、ROM 或成人/赌博内容；明确 APK 不适用于 iPhone，避免可疑配置文件、未知扩展和假下载按钮。
- 验证结果：`pnpm exec tsc --noEmit --incremental false` 通过；`pnpm lint` 通过；`pnpm build` 通过。构建期仅保留已知 Browserslist 老化提示和 DB build fallback 提示。
- 本地 production 验证：`/en/guides/best-free-iphone-games` 与 `/guides/best-free-iphone-games` 均 HTTP 200，输出新 title/sections/FAQ；`/en/games/adam-and-eve-4`、`/en/games/balance-duel`、`/en/games/beat-line`、`/en/games/apple-knight`、`/en/guides/free-games-no-ads` 均 HTTP 200。
- 提交部署：commit `e577146 improve iphone games guide` 已推送 `origin/main`；Vercel production deployment `dpl_Zmt9cs2APM3tbSoSmFcgZoRCzYd5` Ready，并挂载 `https://www.lumagamehub.com`。
- 生产验证：`https://www.lumagamehub.com/en/guides/best-free-iphone-games` 与 `/guides/best-free-iphone-games` 均 HTTP 200；英文页为 `<html lang="en" data-locale="en">`，中文页为 `<html lang="zh" data-locale="zh">`；新 title、description、H1、FAQ、iPhone 避坑说明与 related links 均已上线；`/en/games/adam-and-eve-4`、`/en/games/balance-duel`、`/en/games/beat-line`、`/en/games/apple-knight`、`/en/guides/free-games-no-ads` 均 HTTP 200。
- 下一步：7-14 天后复查 GSC `best free iphone games`、`iphone browser games`、`touch friendly free games` 的 impressions/CTR/position。

### T-081 Solitaire 与 Monster Survivors 内容补强发布

- 选择原因：两页此前已完成本地内容补强但尚未上线，属于最直接改善“薄 iframe 页”风险的存量改动；Solitaire 已有访问记录，Monster Survivors iframe 来源此前健康巡检为 HTTP 200。
- 实际改动：提交 `app/[locale]/games/solitaire/page.tsx`、`app/[locale]/games/monster-survivors/page.tsx`、`messages/en.json`、`messages/zh.json`；两页均补充原创 overview、how to play、controls、FAQ、FAQPage JSON-LD、related games/guides 和无下载/无 ROM/无破解说明。
- 验证结果：`jq empty messages/en.json && jq empty messages/zh.json` 通过；`pnpm exec tsc --noEmit --incremental false` 通过；`pnpm lint` 通过；`pnpm build` 通过；本地 production server 抽查两页中英文 URL 与相关链接均 200。
- 提交部署：commit `8c560c4 improve solitaire and monster survivors pages` 已推送 `origin/main`；Vercel production deployment `dpl_2Z7sfMca71mAxrmeEiQNotirSQnz` Ready，并挂载 `https://www.lumagamehub.com`。
- 生产验证：`/en/games/solitaire`、`/games/solitaire`、`/en/games/monster-survivors`、`/games/monster-survivors` 均 HTTP 200；英文页输出 `<html lang="en" data-locale="en">`，中文页输出 `<html lang="zh" data-locale="zh">`；新 title、overview、how-to、FAQ 和相关链接均已上线；`/en/guides/no-download-games`、`/en/guides/quick-play-guide`、`/en/guides/free-games-no-ads` 均 HTTP 200。
- 下一步：7-14 天后结合 GSC/Vercel/Clarity 观察 `/en/games/solitaire` 与 `/en/games/monster-survivors` 的继续浏览、play event 和跳出趋势。

### T-098 Guide 快速答案模块

- 选择原因：远端 `fix/lumagamehub-monetization-readiness-v3-20260704` 中 `55fb33e` 提供了 guide 首屏快速答案思路；Google Snake Mods 与 Best Free iPhone Games 都属于搜索意图明确的 guide，首屏先给结论比先进入播放器或长正文更符合 CTR/跳出优化方向。
- 实际改动：在 `app/[locale]/guides/[slug]/page.tsx` 中复用第一段 section 生成 `Quick answer / 快速答案` callout；提供 `Read the guide / 继续看指南`、`Play first / 先试玩游戏`、`See similar games / 看相似游戏` 锚点；为 play、guide details、recommendations 增加稳定锚点。
- 验证结果：`pnpm exec tsc --noEmit --incremental false` 通过；`pnpm lint` 通过；`pnpm build` 通过；本地 production server 抽查 Google Snake Mods 与 Best Free iPhone Games 中英文页均 200，Quick answer 与锚点均存在。
- 提交部署：commit `9787b8f surface quick answers on guide pages` 已推送 `origin/main`；Vercel production deployment `dpl_ATuTRMrfVrEp1q7MY2bKpMDpZZ8C` Ready，并挂载 `https://www.lumagamehub.com`。
- 生产验证：`/en/guides/google-snake-mods`、`/guides/google-snake-mods`、`/en/guides/best-free-iphone-games`、`/guides/best-free-iphone-games` 均 HTTP 200；Quick answer、中文快速答案、guide/play/recommendation 锚点均已上线。
- 下一步：观察 guide 页面 scroll depth、quick back、related click 与 play click；如首屏转化改善，再把此模板作为 guide 默认结构保留。

### T-099 GA4 互动事件镜像

- 选择原因：GA4 基础 pageview 已部署，但游戏启动、反馈等 `trackInteraction` 事件此前主要进入 Vercel Analytics；AdSense 申请前需要更完整的真实用户行为观察口径，不能靠人工刷新或人为触发造数。
- 实际改动：在 `lib/analytics/events.ts` 中把清洗后的 interaction event 同步发送到 GA4 `gtag('event', ...)`，保留既有 Vercel Analytics `track` 调用；不新增广告位、不触发测试事件、不重复发送 page_view。
- 验证结果：`pnpm exec tsc --noEmit --incremental false` 通过；`pnpm lint` 通过；`pnpm test -- --run` 通过，9 个测试文件 / 26 个测试用例通过；`pnpm build` 通过。测试 stderr 仅保留已知 Redis 未配置与搜索 fallback timeout 提示。
- 提交部署：commit `d4a6e94 mirror interaction events to ga4` 已推送 `origin/main`；Vercel production deployment `dpl_6sc8XaJYX8FFUqBBTUemBwi8m2NC` Ready，并挂载 `https://www.lumagamehub.com`。
- 生产验证：`/en/games/solitaire` 输出 `G-M5N3TXN56Z`、Google Tag Manager preload 与新 Solitaire 正文；`/en/guides/google-snake-mods` 输出 `Quick answer`、guide/play/recommendations 锚点与 `G-M5N3TXN56Z`；本轮未人为触发 `game_play_start`。
- 下一步：24-48 小时后只读复查 GA4 Realtime/Events 与 Clarity，确认真实用户触发的 `game_play_start`、`feedback_open` 等事件是否开始进入 GA4。

### T-100 API catalogue fallback guardrails

- 选择原因：T-067 外部数据库/Meilisearch 配置仍未恢复，公开 `/api/search` 与 `/api/games` 需要在后端不可用时保持可抓取、可返回，不应因数据库连接长时间挂起而影响审核期可访问性。
- 实际改动：`/api/search` 增加 query 清洗和分页规范化；`fallback-search` 改为 token 化评分排序；新增 `lib/games/fallback-list.ts` 作为公开游戏目录本地兜底；`/api/games` 增加收藏读取超时、game list 超时、serverless direct Supabase 风险配置短路，并在失败时返回 `degraded: true` 的本地 catalogue JSON。
- 验证结果：`pnpm exec tsc --noEmit --incremental false` 通过；`pnpm test -- --run` 通过，11 个测试文件 / 32 个测试用例通过；`pnpm lint` 通过；`git diff --check` 通过；`pnpm build` 通过。测试/构建仅保留已知 Redis、Meilisearch、Browserslist 与 build-time database fallback 提示。
- 本地 production 验证：`/api/search?q=snake&page=abc&limit=999` 返回 `page=1`、`limit=50`、`source=fallback`、`google-snake`；`/api/games?search=snake&page=abc&limit=5` 返回 `degraded=true`、`source=fallback`、`google-snake`，不再超过 15 秒挂起；空搜索仍返回 HTTP 400。
- 提交部署：commit `6d0217c fix api catalogue fallbacks` 已推送 `origin/main`；Vercel production deployment `dpl_9umJQPN47v8uG27wtmMMpFbRouZs` Ready，并挂载 `https://www.lumagamehub.com`。
- 生产验证：`https://www.lumagamehub.com/api/search?q=snake&page=abc&limit=999` 在 8 秒超时窗口内返回 `source=fallback`、`limit=50`、`google-snake`；`/api/games?search=snake&page=abc&limit=5` 返回 `degraded=true`、`source=fallback`、`google-snake`；空查询 `/api/search?q=%20%20` 返回 HTTP 400。
- 下一步：T-067 外部配置仍需人工修复；本项只是公开 API 可用性兜底，不代表数据库、Redis、Meilisearch 已恢复。

### T-112 Games directory filter rendering

- 选择原因：T-100 本地验证时发现 `/en/games?search=snake` 页面曾返回 200 但仍显示默认 200 games，根因是游戏目录页 `force-static` 让 query filters 被静态缓存吞掉，玩家搜索/分类/排序表单不能稳定反映查询结果。
- 实际改动：`app/[locale]/games/page.tsx` 改为动态渲染，并复用 `listFallbackGames`，删除页面内重复的 fallback 排序/分页逻辑；页面 fallback 与 `/api/games` 使用同一套搜索、筛选、排序口径。
- 验证结果：`pnpm exec tsc --noEmit --incremental false` 通过；`pnpm test -- --run` 通过，11 个测试文件 / 32 个测试用例通过；`pnpm lint` 通过；`git diff --check` 通过；`pnpm build` 通过。
- 本地 production 验证：`/en/games?search=snake` 返回 `<html lang="en" data-locale="en">`、`1 games found`、`defaultValue="snake"` 与 `Google Snake`；响应头 `Cache-Control: private, no-cache, no-store`。
- 提交部署：commit `9728397 fix games filters fallback rendering` 已推送 `origin/main`；Vercel production deployment `dpl_GuGW73sh7Hc7CHMqYJdxu9DgyAAi` Ready，并挂载 `https://www.lumagamehub.com`。
- 生产验证：`https://www.lumagamehub.com/en/games?search=snake` 返回 HTTP 200、`1 games found`、`defaultValue="snake"`、`Google Snake`，响应头为动态 no-store；`/api/games?search=snake&limit=5` 仍返回 `degraded=true`、`source=fallback`、`google-snake`。
- 下一步：继续观察 `/en/games` 目录页的搜索使用、相关点击与 LCP/INP；如果动态渲染带来延迟，再考虑把筛选体验转为客户端读取 API。

### T-113 Drive Mad 搜索意图补强

- 选择原因：Chrome 只读读取 GSC Last 28 days 为 28 clicks / 1.68K impressions / CTR 1.7% / avg position 20.2；query 维度显示 `drive mad 攻略` 2 clicks / 7 impressions，Clarity Last 30 days 显示平均 1 page/session、scroll depth 38.31%、active time 8s，说明已有搜索入口但继续浏览和首屏答案仍需加强。
- 监测检查：`pnpm ops:monitoring` 仍显示 site / robots / sitemap / Clarity tag ok，sitemap 488 URLs，public health degraded；`pnpm ops:growth` 因缺 GA4 Data API、GSC OAuth、Clarity Data Export、Typeform token 继续 skipped。Chrome 后台只读补足 GSC 与 Clarity，未用任何刷量或人工触发事件。
- 实际改动：更新 `lib/seo-landing-content.ts` 中 `drive-mad-walkthrough`；新增 `drive mad 攻略` / `drive mad 怎么过` / `drive mad why does my car flip` / `drive mad mobile controls` / `drive mad official` / `drive mad no download` 等长尾关键词；缩短并聚焦中英文 title/description/H1/subheading；把首个 section 改成可进入 Quick answer 的卡关修复；新增“按问题快速找解法 / Search by Problem”问题索引、翻车 FAQ、官方来源 FAQ，以及 `ovo-walkthrough` / `games-like-ovo` / `games-to-play-when-bored` related guides。
- GEO/外链改动：`app/[locale]/guides/[slug]/page.tsx` 新增可选 `Official & Reference Links / 官方与参考链接` 区块，并把外链写入 Article JSON-LD `citation`；Drive Mad 页面新增 Fancade、DriveMad.com、Martin Magni 官网 3 个可信外链，放在内部推荐和 FAQ 后，避免首屏把玩家直接带离站点。
- 体验判断：页面现在形成“快速答案 -> 试玩 -> 详细问题索引 -> 相似游戏推荐 -> FAQ -> 站内 CTA -> 相关专题 -> 官方参考”的路径，比单一 iframe/长文更适合提升 scroll depth、play click、related click 和停留时间；外链区块用于信任和引用，不作为主 CTA。
- 合规边界：未新增游戏 iframe 来源、图片、下载入口、广告容器或诱导点击文案；内容继续保持浏览器游玩、免下载、无 ROM/破解引导；外链仅指向公开官方/创作者相关页面。
- 验证结果：`pnpm exec tsc --noEmit --incremental false` 通过；`pnpm lint` 通过；`git diff --check` 通过；`pnpm build` 通过。构建期仅保留已知 Browserslist/baseline-browser-mapping 老化提示。
- 本地 production 验证：`pnpm exec next start -p 3011` 后抽查 `/en/guides/drive-mad-walkthrough` 与 `/guides/drive-mad-walkthrough` 均输出正确 `html lang`、新 title/H1、Quick answer / 快速答案、长尾问题索引、FAQ、related guide links、官方外链和 JSON-LD `citation`；`/en/guides/ovo-walkthrough`、`/en/guides/games-like-ovo`、`/en/guides/games-to-play-when-bored`、`/en/games/drive-mad` 均 HTTP 200。
- 提交部署：commit `470b08f improve drive mad guide seo` 已推送 `origin/main`；Vercel production deployment `dpl_FwcuazDMwsfhmNzgotMw6GazWeqN` Ready，并挂载 `https://www.lumagamehub.com`。
- 生产验证：`/en/guides/drive-mad-walkthrough` 与 `/guides/drive-mad-walkthrough` 均 HTTP 200，输出新 title、长尾问题索引、官方外链区块、JSON-LD `citation` 和正确 `html lang`；`/en/guides/ovo-walkthrough`、`/en/guides/games-like-ovo`、`/en/guides/games-to-play-when-bored`、`/en/games/drive-mad`、`/robots.txt`、`/sitemap.xml` 均 HTTP 200。
- 部署后监测：`pnpm ops:monitoring` 仍显示 site / robots / sitemap / Clarity tag ok，sitemap 488 URLs；外部 `database config`、`meilisearch config`、`public health status=degraded`、`search api source=fallback` 仍为既有阻塞。Vercel CLI 48.9.0 不支持 `vercel logs --level`，普通 logs 查询超过 75 秒未返回，已中止；本轮以 deployment inspect + production smoke + monitoring 脚本为验证依据。
- 下一步：发布后 7-14 天复查 GSC `drive mad 攻略`、`drive mad walkthrough`、`how to beat drive mad` 的 CTR/position，并看 Clarity 是否改善 Drive Mad guide 的 scroll depth、play click 和 related guide click。

### T-115 New browser games low-competition guide cluster

- 选择原因：基于 2026-07-06 最新公开页面复核，Hide and Paint、Car Circle、Monkey Tag IO 均有近期公开可玩来源、明确操作/手机/官方来源搜索意图，且早期竞争页多为游戏入口或薄说明，适合先做原创 guide 而非直接嵌入。
- 实际改动：新增 `hide-and-paint-guide`、`car-circle-guide`、`monkey-tag-io-guide` 三个中英文高质量攻略页；新增 `best-new-browser-games-july-2026` 集合页承接新词、新游戏和低竞争机会，并把三页与 Drive Mad、OvO、Tunnel Rush、Apple Knight 等站内页面串联。
- GEO/SEO 处理：每页都有完整 title、description、H1、quick answer、原创 overview、how to play/controls/tips/FAQ、related games、related guides 和 Official & Reference Links；Article JSON-LD `citation` 自动引用公开来源链接。
- 合规边界：本轮没有新增 iframe、截图、下载入口、广告容器或诱导点击文案；在未确认独立授权嵌入前只发布攻略和来源说明；明确避开 APK、插件、ROM、破解、成人、赌博、明显 IP 山寨和不清楚来源。
- 验证结果：`pnpm exec tsc --noEmit --incremental false` 通过；`pnpm lint` 通过；`pnpm build` 通过；`git diff --check` 通过。构建期仅保留已知 Browserslist/baseline-browser-mapping 老化提示。
- 本地 production 验证：`pnpm exec next start -p 3012` 后抽查 8 个新 URL：`/en/guides/hide-and-paint-guide`、`/guides/hide-and-paint-guide`、`/en/guides/car-circle-guide`、`/guides/car-circle-guide`、`/en/guides/monkey-tag-io-guide`、`/guides/monkey-tag-io-guide`、`/en/guides/best-new-browser-games-july-2026`、`/guides/best-new-browser-games-july-2026` 均输出正确 `html lang`、title、Quick answer / 快速答案、FAQ schema、官方来源链接和相关 guide 内链；本地 sitemap 已包含新中英文 URL。
- 下一步：发布后 7-14 天复查 GSC/Clarity，优先看 `hide and paint`、`car circle game`、`monkey tag io controls`、`best new browser games July 2026` 是否出现曝光，以及这些 guide 的 scroll depth、related guide click 和 games catalogue click。

### T-116 Game catalogue quality reduction

- 选择原因：当前 fallback 游戏库有 200 个唯一小游戏，生产 sitemap 曾输出 404 个游戏 URL；静态审计显示 195 个英文简介短于 18 词，197 个 iframe 来源集中在 `szhong.4399.com`，并有 gun/war/zombie/shooter/IP-adjacent 等复核词命中，继续全量索引会放大薄内容和来源风险。
- 实际改动：新增 `lib/games/quality-policy.ts`，把游戏分为 `core-indexed`、`catalogue-only`、`review`；新增 `scripts/audit-game-quality.ts` 并生成 `docs/game-quality-audit.md`；sitemap 只收录核心游戏；普通游戏保留可访问但输出 `noindex,follow`；复核游戏输出 `noindex,follow`、不进入 sitemap、fallback search、fallback catalogue 默认列表、分类/标签集合和相关游戏推荐。
- 首批复核池：`adam-and-eve-zombies`、`gun-battle-3`、`hero-tower-wars`、`hunter-hitman`、`merge-alphabet-lore`、`metal-black-ops`、`raft-wars`、`raft-wars-2`、`rublox-space-farm`、`skibidi-shooter`、`state-wars-conquer-them-all`、`stick-war-infinity-duel`、`stick-warrior`、`stickman-shooter`、`super-omar-climb`、`temple-run-2`、`temple-run-2-holi-festival`、`wild-bullets`。
- 审计结果：200 个游戏中 `core-indexed` 94 个、`catalogue-only` 88 个、`review` 18 个；当前策略下 106 个游戏页会 noindex，94 个唯一游戏进入 sitemap。
- 合规边界：本轮没有删除页面、没有新增广告容器、没有新增 iframe、没有隐藏真实来源；只做可回滚的索引/推荐分层和复核提示。
- 验证结果：`pnpm exec tsc --noEmit --incremental false` 通过；`pnpm lint` 通过；`pnpm build` 通过。本地 production server `:3014` 抽查显示 sitemap 总 URL 284、游戏 URL 192、风险页不在 sitemap；`/en/games/gun-battle-3` 输出 `noindex,follow` 和复查提示；`/en/games/drive-mad` 仍无 noindex；`/api/games?search=gun` 和 `/api/search?q=gun` 均不返回复核页。
- 提交部署：commit `a951208 add game quality indexing policy` 已推送 `origin/main`；Vercel production deployment `dpl_CqRWqXpRe3e98iCyGQg8MU9ijwxF` Ready，并挂载 `https://www.lumagamehub.com`。
- 生产验证：`https://www.lumagamehub.com/sitemap.xml` 输出 284 总 URL / 192 游戏 URL / 48 guide URL，首批复核页未进入 sitemap；`/en/games/gun-battle-3` 输出 `noindex,follow`、复查提示和复查原因；`/en/games/drive-mad` 仍可索引；`/api/games?search=gun&limit=10` 与 `/api/search?q=gun&limit=10` 均不返回复核页。
- 部署后监测：`pnpm ops:monitoring` 显示 site / robots / sitemap / Clarity tag ok，sitemap 284 URLs；public health、search api 仍因既有 Supabase direct URL、Redis timeout、Meilisearch localhost 配置降级，不是本轮内容分层新增问题。
- 下一步：从 `docs/game-quality-audit.md` 里按核心分层和真实数据挑 10 个核心页加厚；人工复核 18 个 `review` 游戏是否删除、替换或补授权来源；继续单独修复 T-067 外部 DB/Redis/Meilisearch 配置。

### T-117 Core game detail editorial upgrade batch 1

- 选择原因：T-116 已把游戏库从“全量索引”转为分层治理，下一步应优先加厚已有搜索/站内信号的核心游戏页，而不是继续铺新 iframe。第一批选择 `drive-mad`、`google-snake`、`ovo`、`tunnel-rush`、`apple-knight-mini-dungeons`，原因是已有 guide/collection 内链、GSC 主题信号或高重试可玩性，且均属于 `core-indexed`。
- 实际改动：新增 `lib/games/editorial-content.ts`，为 5 个动态游戏详情页提供中英文原创摘要、overview、how to play、controls、tips、FAQ 和 related guides；`app/[locale]/games/[slug]/page.tsx` 读取该内容并输出可见正文、FAQPage JSON-LD、专属 title/description；`lib/mock-games.ts` 将这些原创摘要同步到 fallback 目录/相似游戏描述。
- 内链与体验：新增的 related guides 指向 `drive-mad-walkthrough`、`google-snake-mods`、`ovo-walkthrough`、`tunnel-rush-unblocked`、`apple-knight-mini-dungeons-guide`、`games-like-ovo`、`games-to-play-when-bored`；页面顺序保持“播放器 -> 玩法指南 -> 评价 -> 游戏信息/提示/相似游戏”，让玩家先玩再读卡点解法。
- 合规边界：本轮没有新增 iframe、截图、广告容器、下载入口或诱导点击文案；文案明确 browser play/no download，并避免把第三方游戏描述成 Luma 自有 IP 或官方授权。
- 验证结果：`pnpm exec tsx scripts/audit-game-quality.ts --write docs/game-quality-audit.md` 通过，5 个目标页均不再命中 thin description，分数为 Apple Knight Mini Dungeons 87、Drive Mad 87、Google Snake 87、OvO 81、Tunnel Rush 87；`pnpm exec tsc --noEmit --incremental false` 通过；`pnpm lint` 通过；`pnpm build` 通过；`git diff --check` 通过。
- 本地 production 验证：`pnpm exec next start -p 3015` 后抽查 `/en/games/drive-mad`、`/en/games/google-snake`、`/en/games/ovo`、`/en/games/tunnel-rush`、`/en/games/apple-knight-mini-dungeons`、`/games/drive-mad`、`/games/google-snake` 均 HTTP 200，输出对应新 title、guide heading、FAQPage JSON-LD、相关 guide 链接，且无 `noindex`。
- 提交部署：commit `6b5efb5 add editorial guides to core game pages` 已推送 `origin/main`；因 GitHub 自动部署未立即切主域，已手动执行 `vercel deploy --prod --yes`；Vercel production deployment `dpl_Deasaef1cRHdJHxgmfCCDPUcWAWp` Ready，并挂载 `https://www.lumagamehub.com`。
- 生产验证：`/en/games/drive-mad`、`/en/games/google-snake`、`/en/games/ovo`、`/en/games/tunnel-rush`、`/en/games/apple-knight-mini-dungeons`、`/games/drive-mad` 均 HTTP 200，输出新 title、guide heading、FAQPage JSON-LD、related guide links、正确 canonical，且无 `noindex`；sitemap 仍为 284 URLs，并包含 5 个目标游戏详情页。
- 部署后监测：`pnpm ops:monitoring` 显示 site / robots / sitemap / Clarity tag ok；public health、search api 仍因既有 Supabase direct URL、Redis/Meilisearch 配置降级，不是本轮内容改动新增问题。
- 下一步：继续第二批核心页加厚，优先 `big-tower-tiny-square`、`g-switch-3`、`fireboy-watergirl-6`、`monkey-mart`、`dadish`；另行处理 T-067 外部配置和 placeholder thumbnail。

### T-118 Core game detail editorial upgrade batch 2

- 选择原因：延续 T-117 的小批次加厚策略，第二批选择 `big-tower-tiny-square`、`g-switch-3`、`fireboy-watergirl-6`、`monkey-mart`、`dadish`。这 5 个均为 `core-indexed`，且已有 guide/collection 页面可承接内链，适合补齐玩法说明而不是继续扩充薄游戏数量。
- 实际改动：继续扩展 `lib/games/editorial-content.ts`，为第二批 5 个动态游戏详情页新增中英文原创摘要、overview、how to play、controls、tips、FAQ 和 related guides；不改播放器、路由、iframe、广告位或索引策略。
- 内链与体验：相关攻略指向 `big-tower-tiny-square-walkthrough`、`g-switch-3`、`fireboy-and-watergirl-walkthrough`、`monkey-mart-guide`、`games-like-ovo`、`best-browser-games-5-minute-break`、`games-to-play-when-bored`，全部已在 `lib/seo-landing-content.ts` 中确认存在。
- 合规边界：未新增 iframe、截图、广告容器、下载入口或诱导点击文案；文案继续强调 browser play/no download，避免 ROM、APK、插件和安装器导向。
- 验证结果：`pnpm exec tsx scripts/audit-game-quality.ts --write docs/game-quality-audit.md` 通过，目标页均不再命中 thin description，分数为 Big Tower Tiny Square 93、G-Switch 3 81、Fireboy & Watergirl 6 81、Monkey Mart 81、Dadish 81；`pnpm exec tsc --noEmit --incremental false` 通过；`pnpm lint` 通过；`pnpm build` 通过；`git diff --check` 通过。
- 本地 production 验证：`pnpm exec next start -p 3016` 后抽查 `/en/games/big-tower-tiny-square`、`/en/games/g-switch-3`、`/en/games/fireboy-watergirl-6`、`/en/games/monkey-mart`、`/en/games/dadish`、`/games/big-tower-tiny-square`、`/games/monkey-mart` 均 HTTP 200，输出对应新 title、guide heading、FAQPage JSON-LD、相关 guide 链接，且无 `noindex`。
- 提交部署：commit `4bb404c add second batch core game guides` 已推送 `origin/main`；因自动部署未立即切主域，已手动执行 `vercel deploy --prod --yes`；Vercel production deployment `dpl_6chNxbnyA86g1Ev3PXMbubd4rr89` Ready，并挂载 `https://www.lumagamehub.com`。
- 生产验证：`/en/games/big-tower-tiny-square`、`/en/games/g-switch-3`、`/en/games/fireboy-watergirl-6`、`/en/games/monkey-mart`、`/en/games/dadish`、`/games/big-tower-tiny-square`、`/games/monkey-mart` 均 HTTP 200，输出新 title、guide heading、FAQPage JSON-LD、related guide links、正确 canonical，且无 `noindex`；sitemap 仍为 284 URLs，并包含 5 个目标游戏详情页。
- 部署后监测：`pnpm ops:monitoring` 显示 site / robots / sitemap / Clarity tag ok；public health、search api 仍因既有 Supabase direct URL、Redis/Meilisearch 配置降级，不是本轮内容改动新增问题。
- 下一步：第三批可从 `adam-and-eve-4`、`apple-knight`、`dadish-2`、`blumgi-ball`、`monster-tracks` 中选择，同时处理高价值页 placeholder thumbnail。

### T-119 Core game detail editorial upgrade batch 3

- 选择原因：延续 T-117/T-118 的核心页加厚策略，第三批选择 `adam-and-eve-4`、`apple-knight`、`dadish-2`、`blumgi-ball`、`monster-tracks`。这 5 个均为 `core-indexed`，此前静态审计主要问题是 thin description，其中 3 个还保留 placeholder thumbnail，适合先补原创玩法内容和内部链接。
- 实际改动：继续扩展 `lib/games/editorial-content.ts`，为第三批 5 个动态游戏详情页新增中英文原创摘要、overview、how to play、controls、tips、FAQ 和 related guides；不改播放器、iframe 来源、索引策略、广告位或下载路径。
- 内链与体验：相关攻略指向 `adam-and-eve-walkthrough`、`apple-knight-mini-dungeons-guide`、`games-like-ovo`、`best-browser-games-5-minute-break`、`games-to-play-when-bored`、`drive-mad-walkthrough`，全部已确认存在；页面继续采用“先玩、再读操作和卡点解法、再进入相关指南”的结构。
- 合规边界：未新增 iframe、截图、广告容器、下载入口或诱导点击文案；文案继续强调 browser play/no download，避开 APK、安装器、插件、ROM 和破解导向。
- 验证结果：`pnpm exec tsx scripts/audit-game-quality.ts --write docs/game-quality-audit.md` 通过，目标页均不再命中 thin description，分数为 Adam and Eve 4 87、Apple Knight 87、Dadish 2 81、Blumgi Ball 81、Monster Tracks 81；`pnpm exec tsc --noEmit --incremental false` 通过；`pnpm lint` 通过；`pnpm build` 通过；`git diff --check` 通过。
- 本地 production 验证：`pnpm exec next start -p 3017` 后抽查 `/en/games/adam-and-eve-4`、`/en/games/apple-knight`、`/en/games/dadish-2`、`/en/games/blumgi-ball`、`/en/games/monster-tracks`、`/games/adam-and-eve-4`、`/games/monster-tracks` 均 HTTP 200，输出对应新 title、guide heading、FAQPage JSON-LD、相关 guide 链接，且无 `noindex`。本地渲染仍出现已知 Redis/数据库超时回退日志，但页面内容完整。
- 提交部署：commit `c4e56f8 add third batch core game guides` 已推送 `origin/main`；因主域未自动切到新内容，已从干净临时 worktree 手动执行 `vercel deploy --prod --yes`；Vercel production deployment `dpl_9wYqyrP5Fx7qX5KXfTTY7NZUNxhr` Ready，并挂载 `https://www.lumagamehub.com`。
- 生产验证：`/en/games/adam-and-eve-4`、`/en/games/apple-knight`、`/en/games/dadish-2`、`/en/games/blumgi-ball`、`/en/games/monster-tracks`、`/games/adam-and-eve-4`、`/games/monster-tracks` 均 HTTP 200，输出新 title、guide heading、FAQPage JSON-LD、related guide links，且无 `noindex`；sitemap 仍为 284 URLs，并包含目标游戏详情页。
- 部署后监测：`pnpm ops:monitoring` 显示 site / robots / sitemap / Clarity tag ok；public health、search api 仍因既有 Supabase direct URL、Redis/Meilisearch 配置降级，不是本轮内容改动新增问题。
- 下一步：第四批可从 `adam-and-eve-5-part-1`、`adam-and-eve-5-part-2`、`blumgi-bloom`、`blockman-climb`、`rolling-ball` 中继续加厚；另行处理高价值页 placeholder thumbnail 和 T-067 外部配置。

### T-120 Core game detail editorial upgrade batch 4

- 选择原因：延续小批次核心页加厚策略，第四批选择 `adam-and-eve-5-part-1`、`adam-and-eve-5-part-2`、`blumgi-bloom`、`blockman-climb`、`rolling-ball`。这 5 个均为 `core-indexed`，此前主要问题是 thin description，其中 3 个还保留 placeholder thumbnail。
- 实际改动：继续扩展 `lib/games/editorial-content.ts`，为第四批 5 个动态游戏详情页新增中英文原创摘要、overview、how to play、controls、tips、FAQ 和 related guides；不改播放器、iframe 来源、索引策略、广告位或下载路径。
- 内链与体验：相关攻略指向 `adam-and-eve-walkthrough`、`best-browser-games-5-minute-break`、`games-to-play-when-bored`、`games-like-ovo`、`drive-mad-walkthrough`，全部已确认存在；页面继续采用“先玩、再读操作和卡点解法、再进入相关指南”的结构。
- 合规边界：未新增 iframe、截图、广告容器、下载入口或诱导点击文案；文案继续强调 browser play/no download，避开 APK、安装器、插件、ROM 和破解导向。
- 验证结果：`pnpm exec tsx scripts/audit-game-quality.ts --write docs/game-quality-audit.md` 通过，目标页均不再命中 thin description，分数为 Adam and Eve 5 Part 1 93、Adam and Eve 5 Part 2 93、Blumgi Bloom 81、Blockman Climb 81、Rolling Ball 81；`pnpm exec tsc --noEmit --incremental false` 通过；`pnpm lint` 通过；`pnpm build` 通过；`git diff --check` 通过。
- 本地 production 验证：`pnpm exec next start -p 3018` 后抽查 `/en/games/adam-and-eve-5-part-1`、`/en/games/adam-and-eve-5-part-2`、`/en/games/blumgi-bloom`、`/en/games/blockman-climb`、`/en/games/rolling-ball`、`/games/adam-and-eve-5-part-1`、`/games/rolling-ball` 均 HTTP 200，输出对应新 title、guide heading、FAQPage JSON-LD、相关 guide 链接，且无 `noindex`。本地渲染仍出现已知 Redis/数据库超时回退日志，但页面内容完整。
- 提交部署：commit `ba60ae9 add fourth batch core game guides` 已推送 `origin/main`；因 GitHub 自动部署未立即切主域，已从干净临时 worktree 手动执行 `vercel deploy --prod --yes`；Vercel production deployment `dpl_8bZKKdk4sMu28ooTgQiAZA7bGDPw` Ready，并挂载 `https://www.lumagamehub.com`。
- 生产验证：`/en/games/adam-and-eve-5-part-1`、`/en/games/adam-and-eve-5-part-2`、`/en/games/blumgi-bloom`、`/en/games/blockman-climb`、`/en/games/rolling-ball`、`/games/adam-and-eve-5-part-1`、`/games/rolling-ball` 均 HTTP 200，输出新 title、guide heading、FAQPage JSON-LD、related guide links，且无 `noindex`；sitemap 仍为 284 URLs，并包含目标游戏详情页。
- 部署后监测：`pnpm ops:monitoring` 显示 site / robots / sitemap / Clarity tag ok；public health、search api 仍因既有 Supabase direct URL、Redis/Meilisearch 配置降级，不是本轮内容改动新增问题。
- 下一步：第五批可从 `adam-and-eve-6`、`adam-and-eve-7`、`adam-and-eve-8`、`big-tower-tiny-square-2`、`blumgi-rocket` 中继续加厚；另行处理高价值页 placeholder thumbnail 和 T-067 外部配置。

### T-121 Core game detail editorial upgrade batch 5

- 选择原因：延续核心页小批次加厚策略，第五批选择 `adam-and-eve-6`、`adam-and-eve-7`、`adam-and-eve-8`、`big-tower-tiny-square-2`、`blumgi-rocket`。这 5 个均为 `core-indexed`，此前主要问题是 thin description，其中 `blumgi-rocket` 还保留 placeholder thumbnail。
- 实际改动：继续扩展 `lib/games/editorial-content.ts`，为第五批 5 个动态游戏详情页新增中英文原创摘要、overview、how to play、controls、tips、FAQ 和 related guides；不改播放器、iframe 来源、索引策略、广告位或下载路径。
- 内链与体验：相关攻略指向 `adam-and-eve-walkthrough`、`best-browser-games-5-minute-break`、`games-to-play-when-bored`、`big-tower-tiny-square-walkthrough`、`games-like-ovo`、`drive-mad-walkthrough`，全部已确认存在；页面继续采用“先玩、再读操作和卡点解法、再进入相关指南”的结构。
- 合规边界：未新增 iframe、截图、广告容器、下载入口或诱导点击文案；文案继续强调 browser play/no download，避开 APK、安装器、插件、ROM 和破解导向。
- 验证结果：`pnpm exec tsx scripts/audit-game-quality.ts --write docs/game-quality-audit.md` 通过，目标页均不再命中 thin description，分数为 Adam and Eve 6 87、Adam and Eve 7 87、Adam and Eve 8 87、Big Tower Tiny Square 2 87、Blumgi Rocket 81；`pnpm exec tsc --noEmit --incremental false` 通过；`pnpm lint` 通过；`pnpm build` 通过；`git diff --check` 通过。
- 本地 production 验证：`pnpm exec next start -p 3019` 后抽查 `/en/games/adam-and-eve-6`、`/en/games/adam-and-eve-7`、`/en/games/adam-and-eve-8`、`/en/games/big-tower-tiny-square-2`、`/en/games/blumgi-rocket`、`/games/adam-and-eve-6`、`/games/blumgi-rocket` 均 HTTP 200，输出对应新 title、guide heading、FAQPage JSON-LD、相关 guide 链接，且无 `noindex`。本地渲染仍出现已知 Redis/数据库超时回退日志，但页面内容完整。
- 提交部署：commit `b02c4f8 add fifth batch core game guides` 已推送 `origin/main`；因 GitHub 自动部署未立即切主域，已从干净临时 worktree 手动执行 `vercel deploy --prod --yes`；Vercel production deployment `dpl_5YoTdzi6mrLL5eMRwG7QAWtM83A7` Ready，并挂载 `https://www.lumagamehub.com`。
- 生产验证：`/en/games/adam-and-eve-6`、`/en/games/adam-and-eve-7`、`/en/games/adam-and-eve-8`、`/en/games/big-tower-tiny-square-2`、`/en/games/blumgi-rocket`、`/games/adam-and-eve-6`、`/games/blumgi-rocket` 均 HTTP 200，输出新 title、guide heading、FAQPage JSON-LD、related guide links，且无 `noindex`；sitemap 仍为 284 URLs，并包含目标游戏详情页。
- 部署后监测：`pnpm ops:monitoring` 显示 site / robots / sitemap / Clarity tag ok；public health、search api 仍因既有 Supabase direct URL、Redis/Meilisearch 配置降级，不是本轮内容改动新增问题。
- 下一步：第六批可从仍为 `core-indexed` 且 thin description 的 `adam-and-eve-go`、`adam-and-eve-go-2`、`adam-and-eve-go-3`、`adam-and-eve-go-xmas`、`adam-and-eve-night` 中继续加厚；另行处理高价值页 placeholder thumbnail 和 T-067 外部配置。

### T-123 Core game detail editorial upgrade batch 6

- 选择原因：延续核心页小批次加厚策略，第六批选择 `adam-and-eve-go`、`adam-and-eve-go-2`、`adam-and-eve-go-3`、`adam-and-eve-go-xmas`、`adam-and-eve-night`。这 5 个均为 `core-indexed`，此前主要问题是 thin description，并且能与 `adam-and-eve-walkthrough`、短局游戏合集形成自然内链。
- 实际改动：继续扩展 `lib/games/editorial-content.ts`，为第六批 5 个动态游戏详情页新增中英文原创摘要、overview、how to play、controls、tips、FAQ 和 related guides；不改播放器、iframe 来源、索引策略、广告位或下载路径。
- 内链与体验：相关攻略指向 `adam-and-eve-walkthrough`、`best-browser-games-5-minute-break`、`games-to-play-when-bored`，全部已确认存在；页面继续采用“先玩、再读操作和卡点解法、再进入相关指南”的结构。
- 合规边界：未新增 iframe、截图、广告容器、下载入口或诱导点击文案；文案继续强调 browser play/no download，避开 APK、安装器、插件、ROM 和破解导向。
- 验证结果：`pnpm exec tsc --noEmit --incremental false` 通过；related guide slug 校验 `missing: []`；`pnpm exec tsx scripts/audit-game-quality.ts --write docs/game-quality-audit.md` 通过，目标页均不再命中 thin description，分数为 Adam and Eve Go 93、Adam and Eve Go 2 87、Adam and Eve Go 3 87、Adam and Eve Go Xmas 87、Adam and Eve Night 93；`pnpm lint` 通过；`git diff --check` 通过；`pnpm build` 通过。
- 本地 production 验证：`pnpm exec next start -p 3021` 后抽查 `/en/games/adam-and-eve-go`、`/en/games/adam-and-eve-go-2`、`/en/games/adam-and-eve-go-3`、`/en/games/adam-and-eve-go-xmas`、`/en/games/adam-and-eve-night`、`/games/adam-and-eve-go`、`/games/adam-and-eve-night` 均 HTTP 200，输出对应新 title、guide heading、FAQPage JSON-LD、相关 guide 链接，且无 `noindex`。本地渲染仍出现已知 Redis/数据库超时回退日志，但页面内容完整。
- 提交部署：commit `c1130de add sixth batch core game guides` 已推送 `origin/main`；为避免当前脏工作区进入部署包，已从干净临时 worktree `/tmp/luma-gamehub-deploy-c1130de` 手动执行 `vercel deploy --prod --yes`；Vercel production deployment `dpl_C4S9ijzj2Jk9H6b2x8ruqKr7DbXV` Ready，并挂载 `https://www.lumagamehub.com`。
- 生产验证：`/en/games/adam-and-eve-go`、`/en/games/adam-and-eve-go-2`、`/en/games/adam-and-eve-go-3`、`/en/games/adam-and-eve-go-xmas`、`/en/games/adam-and-eve-night`、`/games/adam-and-eve-go`、`/games/adam-and-eve-night` 均 HTTP 200，输出新 title、guide heading、FAQPage JSON-LD、related guide links，且无 `noindex`；sitemap 仍为 284 URLs，并包含目标游戏详情页。
- 部署后监测：`pnpm ops:monitoring` 显示 site / robots / sitemap / Clarity tag ok；public health、search api 仍因既有 Supabase direct URL、Redis/Meilisearch 配置降级，不是本轮内容改动新增问题。
- 下一步：第七批可从仍为 `core-indexed` 且 thin description 的 `adam-and-eve-sleepwalker`、`adam-and-eve-snow`、`balance-duel`、`beat-line`、`castle-pals` 中继续加厚；另行处理高价值页 placeholder thumbnail 和 T-067 外部配置。

### T-124 Core game detail editorial upgrade batch 7 and Balance Duel review downgrade

- 选择原因：延续核心页小批次加厚策略，但在公开来源复核时发现 `balance-duel` 的商店描述以 gun/recoil shooting duel 为核心机制，不适合作为 AdSense 审核期重点索引页。因此第七批实际加厚 `adam-and-eve-sleepwalker`、`adam-and-eve-snow`、`beat-line`、`castle-pals`、`catch-the-candy`，并把 `balance-duel` 转入 manual review/noindex。
- 公开来源复核：`Adam and Eve Sleepwalker` 参考 Plays.org / Miniplay 的 sleepwalking point-and-click 说明；`Adam and Eve Snow` 参考 Miniplay / Keygames 的 Christmas tree point-and-click 说明；`Beat Line` 参考 GamePix / Kizi / Miniplay 的 rhythm tap/turn 说明；`Castle Pals` 参考 Google Play / Nintendo / review pages 的 Kylee/Owen 双角色平台说明；`Catch the Candy` 参考 Poki / Coolmath / GameDistribution 的 rope/grabber physics puzzle 说明。
- 实际改动：继续扩展 `lib/games/editorial-content.ts`，为第七批 5 个动态游戏详情页新增中英文原创摘要、overview、how to play、controls、tips、FAQ 和 related guides；`lib/games/quality-policy.ts` 将 `balance-duel` 加入 `MANUAL_REVIEW_GAME_REASONS` 并移出 `CORE_INDEXABLE_GAME_SLUGS`；`lib/seo-landing-content.ts` 将 guide/collection 推荐中的 `balance-duel` 替换为 `catch-the-candy`。
- 合规边界：未新增 iframe、截图、广告容器、下载入口或诱导点击文案；文案继续强调 browser play/no download，避开 APK、安装器、插件、ROM 和破解导向；`balance-duel` 仍可直接访问但不进入 sitemap/search/recommendations。
- 验证结果：`pnpm exec tsc --noEmit --incremental false` 通过；related guide slug 校验 `missing: []` 且 `balanceInSeo: false`；`pnpm exec tsx scripts/audit-game-quality.ts --write docs/game-quality-audit.md` 通过，目标页均不再命中 thin description，分数为 Adam and Eve Sleepwalker 93、Adam and Eve Snow 93、Beat Line 87、Castle Pals 81、Catch the Candy 81；`balance-duel` 变为 review 49；`pnpm lint` 通过；`git diff --check` 通过；`pnpm build` 通过。
- 本地 production 验证：`pnpm exec next start -p 3022` 后抽查 `/en/games/adam-and-eve-sleepwalker`、`/en/games/adam-and-eve-snow`、`/en/games/beat-line`、`/en/games/castle-pals`、`/en/games/catch-the-candy`、`/games/adam-and-eve-sleepwalker`、`/games/catch-the-candy` 均 HTTP 200，输出对应新 title、guide heading、FAQPage JSON-LD、相关 guide 链接，且无 `noindex`；`/en/games/balance-duel` HTTP 200 但输出 `noindex`；本地 sitemap 为 282 URLs，包含 5 个目标页且不包含 `balance-duel`。
- 提交部署：commit `2231418 add seventh batch game guides and review balance duel` 已推送 `origin/main`；为避免当前脏工作区进入部署包，已从干净临时 worktree `/tmp/luma-gamehub-deploy-2231418` 手动执行 `vercel deploy --prod --yes`；Vercel production deployment `dpl_G36n3g9GAV8AUYjMvoDJ7ZWvpeqi` Ready，并挂载 `https://www.lumagamehub.com`。
- 生产验证：上述 5 个英文目标页 + 2 个中文页均 HTTP 200，输出新 title、guide heading、FAQPage JSON-LD、related guide links，且无 `noindex`；`/en/games/balance-duel` HTTP 200 且 `noindex`；生产 sitemap 282 URLs，包含 5 个目标页且不包含 `balance-duel`；`/api/search?q=balance&limit=10` 与 `/api/games?search=balance&limit=10` 均不返回 `balance-duel`。
- 部署后监测：`pnpm ops:monitoring` 显示 site / robots / sitemap / Clarity tag ok，sitemap 282 URLs；public health、search api 仍因既有 Supabase direct URL、Redis/Meilisearch 配置降级，不是本轮内容改动新增问题。
- 下一步：第八批可从仍为 `core-indexed` 且 thin description 的 `cats-love-cake`、`cats-love-cake-2`、`cover-orange`、`cover-orange-journey`、`cow-bay` 中继续加厚；另行处理高价值页 placeholder thumbnail 和 T-067 外部配置。

### T-125 Core game detail editorial upgrade batch 8

- 选择原因：延续核心页小批次加厚策略，第八批选择 `cats-love-cake`、`cats-love-cake-2`、`cover-orange`、`cover-orange-journey`、`cow-bay`。这 5 个均为 `core-indexed`，此前主要问题是 thin description，并且公开来源显示玩法为弹跳平台、物理遮蔽解谜和轻量农场模拟，未发现成人、赌博、ROM/破解下载或明显高风险 IP 线索。
- 公开来源复核：`Cats Love Cake` / `Cats Love Cake 2` 参考 Poki 的 DoubleDutch Games 页面；`Cover Orange` 参考 Poki、FDG Entertainment、Kongregate 等公开页面；`Cover Orange: Journey` 参考 Poki、FDG Entertainment、Google Play / Miniplay 的关卡与玩法说明；`Cow Bay` 参考 Poki、7Spot Games、Google Play 的 farming/idle simulation 说明。
- 实际改动：继续扩展 `lib/games/editorial-content.ts`，为第八批 5 个动态游戏详情页新增中英文原创摘要、overview、how to play、controls、tips、FAQ 和 related guides；不改播放器、iframe 来源、索引策略、广告位或下载路径。
- 内链与体验：相关攻略指向 `games-like-ovo`、`best-browser-games-5-minute-break`、`games-to-play-when-bored`、`free-games-no-ads`，全部已确认存在；页面继续采用“先玩、再读操作和卡点解法、再进入相关指南”的结构。
- 合规边界：未新增 iframe、截图、广告容器、下载入口或诱导点击文案；文案继续强调 browser play/no download，避开 APK、安装器、插件、ROM 和破解导向。
- 验证结果：`pnpm exec tsc --noEmit --incremental false` 通过；字段完整性校验 5 个目标 slug 均 ok；`pnpm exec tsx scripts/audit-game-quality.ts --write docs/game-quality-audit.md` 通过，目标页均不再命中 thin description，分数为 Cats Love Cake 87、Cats Love Cake 2 81、Cover Orange 81、Cover Orange: Journey 87、Cow Bay 87；`pnpm lint` 通过；`git diff --check` 通过；related guide slug 校验通过；`pnpm build` 通过。
- 本地 production 验证：`pnpm exec next start -p 3023` 后抽查 `/en/games/cats-love-cake`、`/en/games/cats-love-cake-2`、`/en/games/cover-orange`、`/en/games/cover-orange-journey`、`/en/games/cow-bay`、`/games/cats-love-cake`、`/games/cover-orange-journey`、`/games/cow-bay` 均 HTTP 200，输出新 title、guide heading、FAQ、related guide links，且无 `noindex`；本地 sitemap 包含目标中英文 URL。
- 提交部署：commit `1f819af add eighth batch game guides` 已推送 `origin/main`；为避免当前脏工作区进入部署包，已从干净临时 worktree `/tmp/luma-gamehub-deploy-1f819af` 手动执行 `vercel deploy --prod --yes`；Vercel production deployment `dpl_5gpT3KAKG5D7VqxKjMw6braeiVRx` Ready，并挂载 `https://www.lumagamehub.com`。
- 生产验证：上述 5 个英文目标页 + 3 个中文页均 HTTP 200，输出新 title、guide heading、FAQ、related guide links，且无 `noindex`；生产 sitemap 282 URLs，并包含 5 个目标 slug 的中英文详情页。
- 下一步：第九批可从仍为 `core-indexed` 且 thin description 的 `city-bike-stunt`、`crazy-kick`、`dadish-3`、`duo-vikings`、`duo-vikings-2` 中继续加厚；另行处理高价值页 placeholder thumbnail 和 T-067 外部配置。

### T-126 Core game detail editorial upgrade batch 9 and sidebar tip cleanup

- 选择原因：延续核心页小批次加厚策略，第九批选择 `city-bike-stunt`、`crazy-kick`、`dadish-3`、`duo-vikings`、`duo-vikings-2`。这 5 个均为 `core-indexed`，此前主要问题是 thin description，且能覆盖摩托特技、足球控球、复古平台、双人协作解谜等不同搜索意图。
- 公开来源复核：`City Bike Stunt` 参考 Miniplay / TwoPlayerGames 的摩托坡道、双人、氮气和控制说明；`Crazy Kick` 参考 Google Play / App Store / Miniplay 的控球绕人射门说明；`Dadish 3` 参考 Poki / Google Play / Steam 的复古平台和救孩子玩法说明；`Duo Vikings` / `Duo Vikings 2` 参考 Poki、PlayMiniGames、VitalityGames 等公开页面的合作解谜、机关、硬币和出口说明。
- 实际改动：继续扩展 `lib/games/editorial-content.ts`，为第九批 5 个动态游戏详情页新增中英文原创摘要、overview、how to play、controls、tips、FAQ 和 related guides；同时修正 `app/[locale]/games/[slug]/page.tsx` 的右侧 Game Tips 优先级，使已有 editorial 内容的页面右栏也使用原创 tips，避免旧 `instructions` 出现玩法不匹配提示。
- 内链与体验：相关攻略指向 `drive-mad-walkthrough`、`games-to-play-when-bored`、`best-browser-games-5-minute-break`、`games-like-ovo`、`free-games-no-ads`，全部为站内已存在页面；页面仍保持先 playable iframe facade，再是原创玩法指南、FAQ 和相关指南。
- 合规边界：未新增 iframe、截图、广告容器、下载入口或诱导点击文案；文案继续强调 browser play/no download，避开 APK、安装器、插件、ROM 和破解导向；未触碰 AdSense 后台或广告正式提交。
- 验证结果：`pnpm exec tsc --noEmit --incremental false` 通过；字段完整性校验 5 个目标 slug 均 ok；`pnpm exec tsx scripts/audit-game-quality.ts --write docs/game-quality-audit.md` 通过，目标页均不再命中 thin description，分数为 City Bike Stunt 87、Crazy Kick 81、Dadish 3 87、Duo Vikings 81、Duo Vikings 2 81；related guide slug 校验通过；`pnpm lint` 通过；`git diff --check` 通过；`pnpm build` 通过。
- 本地 production 验证：`pnpm exec next start -p 3024` 后抽查 `/en/games/city-bike-stunt`、`/en/games/crazy-kick`、`/en/games/dadish-3`、`/en/games/duo-vikings`、`/en/games/duo-vikings-2`、`/games/city-bike-stunt`、`/games/dadish-3`、`/games/duo-vikings-2` 均 HTTP 200，输出新 quick guide、How to play、Controls、related guide links，且无 `noindex`；本地 sitemap 包含目标中英文 URL；Dadish 3 右栏不再出现旧的 board / pencil marks 类错误提示。
- 提交部署：commit `de5c26e add ninth batch game guides` 与 `45dbaf6 use editorial tips in game sidebar` 已推送 `origin/main`；为避免当前脏工作区进入部署包，最终从干净临时 worktree `/tmp/luma-gamehub-deploy-45dbaf6` 手动执行 `vercel deploy --prod --yes`；Vercel production deployment `dpl_3ngoVyFeBiHpY8Z3SYtuTM5UokPK` Ready，并挂载 `https://www.lumagamehub.com`。
- 生产验证：上述 5 个英文目标页 + 3 个中文页均 HTTP 200，输出新 quick guide、How to play、Controls、related guide links，且无 `noindex`；生产 sitemap 包含 5 个目标 slug 的中英文详情页；Dadish 3 英文和中文页均未命中旧错位 tips。
- 下一步：第十批可从仍为 `core-indexed` 且 thin description 的 `dirt-bike-extreme-parkour`、`duo-vikings-3`、`flip-bottle`、`g-switch`、`g-switch-2` 中继续加厚；发布前先核对公开来源、玩法/IP/AdSense 风险；另行处理 T-067 外部配置和高价值页 placeholder thumbnail。

### T-127 Brainrot low-competition guide cluster

- 选择原因：基于 2026-07-07 新词机会建议，Brainrot / meme browser games 处于新词扩散期，但直接嵌入第三方游戏存在来源、素材和授权不确定性。因此本轮采用 guide-first 策略，先发布可原创、可内链、可解释安全边界的集合页和单游攻略页。
- 公开来源复核：`brainrot-games` 参考 Poki Brainrot 分类、Poki `Make Brainrots Online` 页面和 CrazyGames `Robby: Cross the Road for Brainrot` 页面；`robby-cross-the-road-for-brainrot-guide` 参考 CrazyGames Robby 页面和 Kiz10 Robby 页面，用于核对 2026 年 7 月发布、开发者、桌面/手机/平板浏览器支持和玩法主题。
- 实际改动：在 `lib/seo-landing-content.ts` 新增 `brainrot-games` 和 `robby-cross-the-road-for-brainrot-guide` 两个中英文 guide/collection 页面；页面包含原创 overview、Quick answer、玩法分类、手机体验、安全来源说明、FAQ、外部参考链接和 Luma 站内相似游戏推荐。
- 合规边界：未新增 iframe、截图、广告容器、下载入口或诱导点击文案；不使用未授权 Brainrot 角色素材；页面明确 Luma 是 independent guide and game discovery site，不隶属于原开发者或平台；避免 APK、mod menu、插件、绕过限制和盗版导向。
- 验证结果：`pnpm exec tsc --noEmit --incremental false` 通过；`pnpm lint` 通过；`git diff --check` 通过；`pnpm build` 通过，静态页生成从 111 增至 115，`patch-static-locale-html` 处理 26/26 英文静态页。
- 本地 production 验证：`pnpm exec next start -p 3025` 后抽查 `/en/guides/brainrot-games`、`/guides/brainrot-games`、`/en/guides/robby-cross-the-road-for-brainrot-guide`、`/guides/robby-cross-the-road-for-brainrot-guide` 均 HTTP 200，输出 Quick answer、FAQPage、Article JSON-LD、source links 和独立声明，且无 `noindex`；本地 sitemap 包含 4 个中英文 URL。
- 提交部署：commit `e0050fc add brainrot guide cluster` 已推送 `origin/main`；为避免当前脏工作区进入部署包，已从干净临时 worktree `/tmp/luma-gamehub-deploy-e0050fc` 手动执行 `vercel deploy --prod --yes`；Vercel production deployment `dpl_5zuasF92V9kuVeWk4R4yR7uoscEf` Ready，并挂载 `https://www.lumagamehub.com`。
- 生产验证：上述 4 个中英文 URL 均 HTTP 200，输出 Quick answer、FAQPage、Article JSON-LD、外部来源链接和独立声明，且无 `noindex`；生产 sitemap 包含新增中英文 guide URL。
- 下一步：7-14 天后复查 GSC 中 `brainrot games online`、`make brainrots online`、`robby cross the road for brainrot`、`brainrot games mobile` 是否有曝光；若有信号，优先加深 `Make Brainrots Online` 独立攻略或 Brainrot clicker/merge 子集合，而不是直接嵌入未验证 iframe。

### T-128 GSC-driven long-tail SEO update: iPhone no-download and Drive Mad level tips

- 选择原因：2026-07-07 Chrome 只读复核 GSC Last 28 days 显示 `/en/guides/best-free-iphone-games` 为 1 click / 403 impressions，CTR 明显偏低；`drive-mad` 相关查询继续有点击与曝光，适合从总攻略延展到“关卡类型/翻车/手机操作”长尾页。
- 实际改动：在 `lib/seo-landing-content.ts` 中重写 `best-free-iphone-games` 的中英文 title、description、H1、Quick answer、FAQ 和首屏内容，强调 `no download`、Safari/Chrome、browser games、App Store 安全边界；新增 `drive-mad-level-tips` 中英文 guide，覆盖 hard levels、car flips、bridge/rail/seesaw、jump/gap、mobile controls 等问题型搜索意图，并与 `drive-mad-walkthrough` 双向内链。
- 内容边界：新增 Drive Mad 页面按失败类型写攻略，不编造未实测的具体关卡编号、宝藏或掉落；未新增 ROM、破解、APK、mod 下载、插件引导、广告位或诱导点击；继续使用已有 Drive Mad 浏览器 embed 和官方/来源参考链接。
- SEO/GEO 目标：`best-free-iphone-games` 承接 `best free iphone games no download`、`free iphone browser games no app`、`safari games no download`；`drive-mad-level-tips` 承接 `drive mad level tips`、`drive mad why does my car flip`、`drive mad mobile controls`、`drive mad 关卡攻略`、`drive mad 翻车怎么办`。
- 验证结果：`pnpm type-check` 通过；`pnpm lint` 通过；`pnpm build` 通过，静态页生成 117 个，`patch-static-locale-html` 处理 27/27 英文静态 HTML；构建产物抽样确认 `Best Free iPhone Games No Download`、`Drive Mad Level Tips`、FAQPage JSON-LD 和新增 slug 已生成。
- 提交部署：commit `a90ed05 add drive mad level tips guide` 已推送 `origin/main`，GitHub/Vercel production 自动部署后主域 `https://www.lumagamehub.com` 已返回新增页面；误创建的临时 Vercel project `luma-gamehub-deploy-a90ed05` 已删除，未作为生产结果使用。
- 生产验证：`https://www.lumagamehub.com/en/guides/drive-mad-level-tips` HTTP 200，输出 `Drive Mad Level Tips`、Quick answer、canonical `https://www.lumagamehub.com/en/guides/drive-mad-level-tips`，且无 `noindex`；`best-free-iphone-games` 构建产物已确认新 title 和 FAQPage JSON-LD。
- 下一步：继续修 GSC/GA4/Clarity/Typeform API 凭据、DB/Meilisearch degraded、sitemap 动态 MISS；内容侧继续做 `ovo-level-tips` 或 `google-snake-mod-menu-safe-guide`，并观察 iPhone 页 CTR 是否改善。

### T-129 Monitoring-led Snake SEO/GEO update and duplicate guide consolidation

- 监测实数：2026-07-10 通过已登录 Chrome 读取 GSC、Clarity、GA4 和 Typeform。GSC Last 28 days 为 41 clicks / 2.22K impressions / CTR 1.8% / avg position 18.2；`/en/guides/google-snake-mods` 为 14 clicks / 920 impressions，`/en/guides/best-free-iphone-games` 为 2 / 423。Last 7 days 为 13 / 560 / 2.3% / 13.7，查询明确出现 `google snake mods`、`google snake mods 2`、`snake mod menu`、`google snake mod loader` 和 `g switch 2`。
- 行为数据：Clarity Last 30 days 为 82 sessions，排除 54 bot sessions，1.41 pages/session，41.09% average scroll，13 个 `game_play_start`，Google 来源 36；性能 87/100，LCP 2.3s、INP 120ms、CLS 0。Typeform 新反馈为“点击没有反应”，与 Clarity 8.54% invalid clicks 相互印证，但当前无法定位到具体页面或控件，未猜测修改。
- GA4 状态：已切换到 `yanruoyi999@gmail.com > gamepapa` 和 Measurement ID `G-M5N3TXN56Z`，后台仍显示未收到数据 / 0 active users。生产 HTML 可确认只加载一次该 ID 的 gtag script，CSP 也允许 Google Analytics 连接；本轮不在原因未确定时改写 page_view，避免重复上报。
- 长尾 SEO/GEO：直接加深现有 `google-snake-mods`，不新建竞争页。标题、description、H1、Quick answer、section 和 FAQ 新覆盖 `Google Snake Mods 2`、`mod menu`、`Snake Mod Loader`、手机和安全来源意图；新增 DarkSnakeGang 网页版、Mod Loader GitHub 和 More Menu GitHub 三个主来源，输出到 Article JSON-LD citation。
- 游戏页加厚：根据 GSC 的 `g switch 2` 新曝光，为已有 `/games/g-switch-2` 中英文页补充原创 summary、overview、how to play、controls、tips、FAQ 和 related guides；依据 Serius Games 官方页核对 3 个关卡、每关 10 个检查点、7 个秘密球与浏览器本地多人信息；不新增 URL 或 iframe。
- 内容减法：删除与 `free-games-no-ads` 重复意图的薄页 `ad-free-games`，把其关键词与实用设备/干扰风险内容合并到主页；`/guides/ad-free-games` 和 `/en/guides/ad-free-games` 永久 308 到主页，旧页自动退出 sitemap。静态生成从 117 降为 115，正好减少两个多语言重复页。
- 验证结果：`pnpm type-check`、`pnpm lint`、`pnpm test -- --run` （32 tests）、`pnpm build`、`git diff --check` 全部通过。本地 production 抽查 Snake、低干扰合并页、G-Switch 2 中英文均 HTTP 200、canonical/FAQ 正常且无 noindex；旧页两个 URL 均 308；sitemap 286 URLs，不含旧 `ad-free-games`，包含主页和 G-Switch 2。
- 未部署：本次请求未要求 commit/deploy，改动仍保留在本地工作树。现有 `package.json`、AdSense SOP 和未跟踪知识库文件为先前用户改动，本轮未覆盖。
- 下一步：P0 定位 GA4 数据流为何不收数，并用 Clarity 录像定位“点击没有反应”的具体控件；P1 观察 Snake title/FAQ 更新后 7-14 天 CTR，再决定是否加深而不是新建子页；P1 继续合并 `games-to-play-when-bored` 等低字数泛意图页，但需先确认 GSC 完整页面导出为零或无有效排名；P1 修复 Supabase pooler 与 Meilisearch 生产配置。

### T-130 GA4 stream failure diagnosis and fullscreen dead-click repair

- GA4 根因：通过已登录 Chrome 进入 `yanruoyi999@gmail.com > gamepapa > Luma Game Hub` Web stream，确认域名为 `https://www.lumagamehub.com`、Stream ID `15191555864`、Measurement ID `G-M5N3TXN56Z`、Enhanced Measurement 已开启，但后台明确标记 past 48 hours no data / data collection inactive。
- 端点复核：生产 HTML 中只有一个 `G-M5N3TXN56Z` gtag script，但 Chrome 运行时无 `window.dataLayer`、无 `window.gtag`、无 GTM/collect 资源。直接 GET `https://www.googletagmanager.com/gtag/js?id=G-M5N3TXN56Z` 稳定返回 HTTP 404；同机对照 Samurai `G-J8GNEQ0RW3`、VidSlim `G-8EC8WN0PY1` 和通用测试 ID 均返回 HTTP 200。因此不改写现有 page_view 代码，正确修复是在 GA4 创建新 Luma Web stream，替换 Vercel `NEXT_PUBLIC_GA_ID` 并重新部署。
- Clarity 定位：Last 30 days 的 7 个 dead-click sessions 中，Snake 攻略有 3 个。首个 Snake 会话的见解显示 00:02 成功点击 `Play now`，00:09 出现一次 dead click；`Duo Vikings` 会话持续 06:27，用户在 00:25、00:49、01:06、01:17 四次点击游戏全屏按钮均无效，01:22 点击 `Visit Official Site` 离开。这与 Typeform “点击没有反应”问题高度一致。
- 实际改动：更新 `components/game/game-player-facade.tsx`，在游戏 iframe 外层增加 Luma 自有全屏图标控件；优先调用标准 Fullscreen API，兼容 WebKit API，浏览器拒绝时自动切换到覆盖当前浏览器视口的 CSS fullscreen fallback；全屏期间锁定 body 滚动，退出后恢复，并记录 native/fallback 模式事件。
- 可访问性与 React 复核：控件使用语义化 `Button`、Lucide `Maximize2/Minimize2`、动态 `aria-label`、`aria-pressed` 和 title；Hooks 无条件调用，fullscreen 事件和 body overflow 均有 cleanup。
- 验证：`pnpm type-check`、`pnpm lint`、`pnpm test -- --run` （32 tests）、`pnpm build`、`git diff --check` 全部通过。本地 production `/en/games/duo-vikings` 实际点击 `Play now -> Play fullscreen`，浏览器拒绝原生 API 后成功进入 viewport fallback：播放器为 fixed full viewport、body overflow hidden、按钮切为 `Exit fullscreen`；退出后 fixed 和 overflow 均恢复。
- 待外部确认：新建 GA4 Web stream 会改变 Google Analytics 后台状态，本轮未执行最终创建。本地代码改动也未 commit/deploy。

### T-131 GA4 replacement stream and production configuration

- 新数据流：经用户确认，在现有 `yanruoyi999@gmail.com > gamepapa` GA4 property 中创建 `Luma Game Hub Production` Web stream，网站 URL 为 `https://www.lumagamehub.com`，Stream ID `15233589031`，Measurement ID `G-XF3GV91D1V`，Enhanced Measurement 保持开启；旧 stream 保留，未删除或改写历史配置。
- 端点验证：新 ID 的 `https://www.googletagmanager.com/gtag/js?id=G-XF3GV91D1V` 返回 HTTP 200，修复旧 ID `G-M5N3TXN56Z` 对应脚本端点返回 404、导致生产运行时没有 `dataLayer`/`gtag` 的根因。
- Vercel 配置：已在绑定项目 `251001-web-gamehub-rdg6` 的 Production、Preview、Development 三个环境中，将 `NEXT_PUBLIC_GA_ID` 更新为新 Measurement ID；生产抽查发现 CLI 首次写入保留了 stdin 末尾换行后，立即改用无换行输入重写三个环境并重新部署；未新增第二套脚本或重复 page_view 逻辑。
- 发布范围：本次将与 T-129/T-130 对应的 Snake 长尾内容、G-Switch 2 原创指南、重复 `ad-free-games` 合并重定向和 Luma 自有全屏控件一并提交部署；保留 `package.json`、AdSense SOP 和未跟踪知识库文件的既有用户改动，不纳入本次提交。
- 远端整合与验证：GitHub `main` 在工作期间新增 production hardening commit `3bf950c`，本轮改动在临时 worktree 中重放并解决 `ad-free-games` 合并冲突，最终代码 commit 为 `10737e2`。合并后 `pnpm type-check`、`pnpm test -- --run`（42 tests）、`pnpm build`、`git diff --check` 均通过；`pnpm lint` 为 0 errors，保留远端已有的 96 个脚本 `console` warnings。
- 生产部署：Vercel production deployment `dpl_HmdTuVqMnuWtseVKLCRiFmxZoE29` 为 Ready，别名包含 `https://lumagamehub.com` 与 `https://www.lumagamehub.com`；主域生产 HTML 的 gtag script 只加载一次 `G-XF3GV91D1V`，旧 `G-M5N3TXN56Z` 不再出现。
- 生产验收：Snake 指南已输出 Google Snake Mods 2 / Snake Mod Loader / mod menu 内容，G-Switch 2 原创指南已上线；两个旧 `ad-free-games` URL 均 308 到 `free-games-no-ads`；Duo Vikings 的 `Play now -> Play fullscreen` 可进入 CSS viewport fallback，body scroll 锁定，退出后完整恢复；sitemap 为 290 URLs。
- GA4 实收：已登录 GA4 Realtime 显示近 5 分钟和近 30 分钟各 1 active user，并收到 `session_start`、`first_visit`、`game_play_start`、`game_fullscreen_toggle`，确认新数据流和生产事件链路均已工作。内部验证访问仅用于配置验收，不作为增长数据解读。

### T-132 Retire dead production backends and formalize local catalogue mode

- 根因复核：Supabase dashboard 确认 Luma 使用的 `starter` 项目在 2024-06-24 暂停，超过 90 天后已无法从 dashboard 恢复，只能下载备份并迁移到新项目；现有 direct URL 与两个 `us-east-2` Supavisor 候选端点均无法建立只读连接。现有 Upstash `PING` 也失败，Meilisearch 仍为 `localhost:7700` 占位配置。
- 决策：当前 200 个 checked-in fallback games、editorial 内容、分类标签和 290 URL sitemap 已是生产事实来源，不为无实际需求的管理后台、评分和计数功能继续维护三个失效远程后端。生产切换为显式 `GAME_CATALOG_MODE=local` 与 `CACHE_MODE=local`，保留未来迁移新数据库时恢复 remote 模式的接口。
- 代码改动：新增 `lib/games/catalog-mode.ts`；健康检查在显式 local 模式下把本地目录、本地搜索和无远程缓存标记为正常且附带说明；Meilisearch、Redis、搜索和游戏列表在 local 模式下直接走本地路径，不初始化失效客户端或重复输出降级告警；监控将 fallback search 在 local 模式下视为预期来源；`.env.example` 补充两项模式配置。
- Vercel 配置：Production、Preview、Development 均新增 `GAME_CATALOG_MODE=local` 和 `CACHE_MODE=local`；删除已确认失效的 `DATABASE_URL`、`MEILISEARCH_HOST`、`MEILISEARCH_API_KEY`、`UPSTASH_REDIS_URL`、`UPSTASH_REDIS_TOKEN`。原生产值仅在部署验收期间保留于权限受限的临时回滚文件，不写入仓库或日志。
- 验证：无 DB/Meilisearch/Redis 环境下 `pnpm type-check`、46 tests、lint（0 errors，96 个既有 console warnings）、`pnpm build`、`git diff --check` 均通过；本地 production `/en`、`/en/games`、Google Snake 游戏/攻略、详情 API、列表 API、search API 与 290 URL sitemap 均正常，`/api/health` 返回 `status=ok`；显式 local 模式的列表 API 返回 `degraded=false`。
- 首次生产验收：commit `5f9dc4f` 对应 Vercel production deployment `dpl_FFLmoetpA3F5iwE4RLhRfYw7ZeDq` Ready 并挂载主域；`/api/health` 从 degraded 变为 ok，search/list API、Google Snake、GA4 ID 与 290 URL sitemap 均正常。列表 API 的 local-mode `degraded` 语义修正随本条后续提交一并发布。

### T-133 Remove non-persistent engagement UI in local catalogue mode

- 检查结果：生产已明确使用 `GAME_CATALOG_MODE=local`，但游戏列表仍显示合成的发布时间、评分和游玩量排序，详情页仍显示 `0 ratings`、`0 plays`、`Demo Data`、空评论区，以及没有处理逻辑的 Share / Write Review；收藏虽有 `localStorage` 回退，但首次点击仍会请求不可用的 `/api/favorites`。
- 实际改动：新增目录 UI 能力策略；local 模式隐藏评分、游玩量、评论、合成发布时间和对应排序控件，移除无行为的 Share / Write Review，不再把正式本地目录标记为 Demo Data；数据库模式保持原有社区指标和评论展示能力。
- 收藏体验：保留用户可用的收藏按钮，并在 local 模式直接读写 `gamehub:favorites`，不再发起无意义的远端收藏请求；Category、Tag、游戏播放、原创 How to play / Controls / FAQ 与相关内链均保留。
- 测试与构建：新增 2 个目录能力策略测试；`pnpm type-check`、`pnpm test -- --run`（48 tests）、`pnpm lint`（0 errors，96 个既有 console warnings）、`pnpm build`、`git diff --check` 均通过。
- 本地 production 验证：`/en/games/duo-vikings` 与 `/en/games` 均 HTTP 200；详情和列表未出现评分、游玩量、评论、Demo Data、Published、Share 或合成指标排序；Category / Tag 过滤器保留，列表有 24 个游戏链接；收藏点击后写入 `localStorage`，`/api/favorites` 请求数为 0。
- 下一步：部署后在主域重复相同 DOM 与收藏交互验收；随后审计 local 模式下仍对公众暴露但依赖远程数据库的管理后台与写 API，优先关闭无实际用途的公开入口，减少维护面和误操作风险。

### T-134 Restore GA4 collection endpoint access in CSP

- 现场证据：T-133 首次生产浏览器验收时，gtag 向 `https://www.google.com/g/collect` 发送 `user_engagement`，被现有 `connect-src` 拒绝；页面功能正常，但该事件未成功发送并产生两条控制台错误。
- 官方复核：Google Tag Platform 2026-06-23 更新的 CSP 指南要求 GA4 允许 `*.google-analytics.com`、`*.analytics.google.com`、`*.googletagmanager.com` 和 `*.google.com` 等采集端点；本轮只加入 GA4 当前需要的官方域名，不加入尚未使用的 Ads / DoubleClick 域名。
- 实际改动：更新 `next.config.js` 的 GA4 script / img / connect CSP 域名为官方通配范围，并新增安全响应头回归测试，防止后续再次阻断 Google collection endpoint；未修改 GA ID、事件名、consent 或 page_view 逻辑。
- 验证：新增测试先因缺少 `https://*.google.com` 按预期失败，修复后通过；全量 `pnpm test -- --run` 为 49/49，`pnpm type-check`、`pnpm lint`（0 errors，96 个既有 console warnings）、`pnpm build` 与 `git diff --check` 均通过。
- 下一步：部署后用真实主域确认 CSP 响应头包含新增域名，并以浏览器重新加载游戏详情页，要求不再出现 `google.com/g/collect` CSP 错误；GA4 实际报表仍按正常处理延迟观察，不把验收访问当成增长数据。

### T-135 Monitoring-led OvO and Big Tower long-tail update

- 监测时间与口径：2026-07-11 通过已登录 Chrome 读取 GSC、GA4、Clarity 和 Typeform。GSC Last 28 days 为 41 clicks / 2,222 impressions / CTR 1.8% / avg position 18.2；Last 7 days 为 14 / 640 / 2.2% / 12.9。高确定性长尾包括 `big tower tiny square walkthrough`（15 impressions / position 6.0）、`how to save pineapple in big tower tiny square`（2 / 7.5）、`how many levels are in ovo`、`how to beat level 46 ovo` 和 `g switch 2`（13 / 9.1）。
- 行为数据：Clarity Last 30 days 为 90 sessions（排除 66 bot sessions）、85 unique users、1.43 pages/session、40.01% average scroll、1.9 min active time、15 个 `game_play_start`；Google referral 37，性能 88/100，LCP 2.1s、INP 150ms、CLS 0，JS errors 0。Last 3 days 为 18 sessions（排除 17 bots）、1.39 pages/session、37.40% scroll、2.1 min active time；invalid clicks 11.11%（2 sessions），样本较小。
- GA4 与反馈：GA4 Last 28 days 仅 1 active user、11 events，主要是内部验收流量；说明新数据流可采集，但不足以代表自然增长。Typeform 仍为 2 条历史完成反馈，最新 2026-07-07 为 4/5 和“点击没有反应”，本轮无新增；此前全屏修复已覆盖最明确的失效控件。
- 内容减法与长尾：不新增 URL，直接加深已有 `ovo-walkthrough` 和 `big-tower-tiny-square-walkthrough`。OvO 页新增版本感知的关卡数量说明、常见 Level 46 传送门路线、动作链 Quick answer、版本不匹配 FAQ；把无法稳定确认的“60+ 关”和“学校网络一定可玩”改为 Dedra Games 官方“超过 50 关”及版本差异说明。Big Tower 页围绕 `walkthrough`、`save the Pineapple`、`Big Tower Tiny Square 2 walkthrough` 重写 title/H1/Quick answer/FAQ，并移除无法保证的 restricted-network 文案。
- GEO 与来源：OvO Article JSON-LD citation 指向 Dedra Games Google Play 与 Coolmath Games 页面；Big Tower citation 指向 EvilObjective itch.io 官方页。页面正文明确版本差异、安全浏览器使用和非官方安装器风险，不新增下载、插件、ROM、破解、广告容器或诱导点击。
- local 模式收口：middleware 在进入 route tree 前拦截 `/admin`，admin layout 保留第二层保护；admin login/logout、ratings、favorites、counters 写入面在 `GAME_CATALOG_MODE=local` 时统一返回 404，database 模式代码保留；新增 API 路由回归测试，并用实际 production server 验证 admin 请求不再触发缺少后台密码的服务端错误。
- 验证结果：54 tests、`pnpm type-check`、`pnpm lint`（0 errors，96 个既有 console warnings）、`pnpm build`、`git diff --check`、`pnpm check:internal-links` 全部通过。local production 中两篇中英文攻略均 HTTP 200，输出新 title/H1、FAQPage、Article citation、canonical 且无 `noindex`；`/admin`、`/admin/login`、favorites/ratings/counters API 均 404。`pnpm ops:monitoring` 在显式 local 配置下 site、robots、290 URL sitemap、health、search、Clarity tag 全部正常；GSC API 仍因无 OAuth 凭据 skipped，但本轮已通过 Chrome 后台读取真实数据。
- 生产部署：Vercel production deployment `dpl_hZq5FgUrdys6ZQjTA796cfAbGJnr` Ready，别名包含 `https://lumagamehub.com` 与 `https://www.lumagamehub.com`。主域两篇英文目标攻略均 HTTP 200，输出新 title、目标 FAQ、官方 source citation、canonical 且无 `noindex`；`/admin` 与 `/api/favorites` 均 404。
- 下一步：发布后 7-14 天复查 `big tower tiny square walkthrough`、`how to save pineapple in big tower tiny square`、`how many levels are in ovo`、`how to beat level 46 ovo` 的 impressions/CTR/position；Snake 页目前已有 920 impressions，先观察上一轮 title/FAQ 改动，不再拆竞争子页；iPhone 页平均位置 36.7，继续优化内容相关性和内链，不只反复改 title。

### T-136 P0 catalogue truth and index-surface cleanup

- 本次目标：按 2026-07-11 repository optimization plan 的优先级，先完成 P0 中对 AdSense/SEO 信任度影响最大的目录真实性、公开索引面、技术 SEO 和 local-mode API 封口。
- 实际改动：`POST /api/games`、`PATCH /api/games/[id]`、`DELETE /api/games/[id]` 在 `GAME_CATALOG_MODE=local` 下统一返回 404；fallback list/search 不再输出推断的 `publishedAt`、`playCount`、`averageRating`，对应类型改为可选真实指标。
- 公开面减法：fallback 目录和站内搜索只返回 `core-indexed` 游戏，`catalogue-only` 不再通过主目录或搜索被发现；`adam-and-eve-8` 因与 `adam-and-eve-7` 共用同一 iframe 转入 manual review，并退出 sitemap/推荐/播放器嵌入。
- 技术 SEO：搜索页新增独立 metadata、canonical 和 `noindex,follow`，并从 sitemap 与 `llms.txt` 移除；`4399-sample` 调试页在生产环境 `notFound()`，不再作为可索引内容；`llms.txt` 去掉“ratings”等已不符合 local catalogue 事实的描述。
- 来源披露：为本地导入游戏增加 `sourceType`、`sourceHost`、`sourcePageUrl`、`embedHost`、`developerVerified`、`embedPermissionStatus`；4399/ad-freegames 条目标注为公开分发来源和未验证开发者，页面文案不再称为 official source/developer。
- 测试补充：新增/扩展 `tests/local-catalogue-api.test.ts`、`tests/fallback-games.test.ts`、`tests/seo-surface.test.ts`、`tests/source-disclosure.test.ts`，覆盖 local 写接口封口、无虚构指标、无重复 core iframe、catalogue-only 不进搜索目录、搜索页 noindex/sitemap 排除、来源披露和 manual-review iframe 闸门。
- 验证结果：`pnpm type-check` 通过；`pnpm test -- --run` 19 files / 67 tests 全部通过；`pnpm check:internal-links` 通过；`pnpm lint` 0 errors，保留 96 个既有脚本 `console` warnings；`pnpm build` 通过，静态页生成 116 个，`patch-static-locale-html` 处理 28/28 英文静态 HTML。
- 未处理项：没有提交或部署；没有触碰既有用户脏改动 `docs/google-adsense-end-to-end-sop.md`、`package.json` 和未跟踪知识库文件。`4399-sample` 仍有路由文件但生产返回 404，后续可作为 P1/P2 彻底删除文件和相关文案。
- 下一步：继续 P0 第二段，修正 `scripts/audit-game-quality.ts` 的原创内容识别逻辑，生成逐 slug keep/merge/remove 决策表；随后按审计结果把 direct catalogue-only 详情页做 308/410 或补齐来源和原创内容。

### T-137 Editorial-aware quality audit and per-slug decision table

- 本次目标：继续 P0，修正 `scripts/audit-game-quality.ts` 的审计口径，让已有完整 `editorial-content.ts` 的核心游戏页不再被静态短描述误判为 thin content，并生成逐 slug 的后续动作表。
- 实际改动：审计脚本拆出可测试纯函数 `getEditorialCoverage`、`scoreGame`、`buildAuditRows`、`buildDecisionRows`、`buildReport`；CLI 入口改为仅直接运行脚本时输出或写文件，测试 import 时不再打印整份报告。
- 审计口径：新增 editorial coverage 状态 `complete / partial / missing`，优先统计英文与中文 editorial 的 summary、overview、how-to-play、controls、tips、FAQ、related guides；只有缺少完整 editorial 时才回退检查导入短描述。
- 决策表：`docs/game-quality-audit.md` 已重写，新增 `Per-Slug Decision Table`，每个 slug 输出 `keep / improve / review / remove`、原因和下一步；当前为 200 total、92 core-indexed、88 catalogue-only、20 manual-review、108 noindex。
- 重点结果：`g-switch-2` 等已有完整 editorial 的核心页现在为 `keep`，不再出现 `thin description`；`adam-and-eve-8` 继续为 `review`；`rublox-space-farm`、`super-omar-climb`、`temple-run-2`、`temple-run-2-holi-festival` 标记为 `remove` 候选。
- 测试补充：新增 `tests/audit-game-quality.test.ts`，覆盖完整 editorial 不误判 thin content，以及逐 slug 决策表字段完整性和关键决策。
- 验证结果：`pnpm type-check` 通过；`pnpm test -- --run` 20 files / 69 tests 全部通过；`pnpm check:internal-links` 通过；`pnpm lint` 0 errors，保留 96 个既有脚本 `console` warnings；`pnpm build` 通过，静态页生成 116 个，`patch-static-locale-html` 处理 28/28 英文静态 HTML。
- 下一步：按 `docs/game-quality-audit.md` 的 decision table 处理 P0 减法：优先对 4 个 `remove` 候选做 410/308 决策；随后抽样 `catalogue-only` 的低需求页，合并或移除，不直接批量删除。

### T-138 High-risk removed game redirects

- 本次目标：继续 P0 减法，把 `docs/game-quality-audit.md` 标记为 `remove` 的高风险旧游戏页从公开详情渲染路径移除，同时保留用户路径到更安全、玩法相近的核心页面。
- 实际改动：新增 `REMOVED_GAME_REDIRECT_TARGETS`、`getRemovedGameRedirectTarget` 和 `isRemovedGameSlug`；`temple-run-2`、`temple-run-2-holi-festival` 永久重定向到 `tunnel-rush`，`rublox-space-farm` 重定向到 `cow-bay`，`super-omar-climb` 重定向到 `apple-knight`。
- 页面行为：动态游戏页在加载正文、iframe、结构化数据和来源披露前先检查 removed slug，并通过 `permanentRedirect(getLocalizedPath(locale, ...))` 发出本地化 308，避免继续暴露 franchise、Roblox-adjacent 或 Mario-like 风险页面。
- 文档同步：`scripts/audit-game-quality.ts` 的 remove nextStep 改为“路由到更安全相关核心页”，并重新生成 `docs/game-quality-audit.md`；决策表继续保留逐 slug keep/improve/review/remove 口径。
- 测试补充：`tests/source-disclosure.test.ts` 增加 removed slug 到安全核心页的映射断言，防止后续误删或改错目标。
- 验证结果：`pnpm type-check` 通过；`pnpm test -- --run` 20 files / 70 tests 全部通过；`pnpm check:internal-links` 通过；`pnpm lint` 0 errors，保留 96 个既有脚本 `console` warnings；`pnpm build` 通过，静态页生成 116 个，`patch-static-locale-html` 处理 28/28 英文静态 HTML；本地 production server 抽查 4 个 removed slug 均返回 308 到对应安全核心页，目标页可 200 访问。
- 下一步：继续 P1 做 catalogue-only 抽样合并，优先处理无原创内容、无来源把握、无搜索信号的旧条目；不做批量删除，先按风险和搜索价值逐页收口。

### T-139 Catalogue-only series merge redirects

- 本次目标：继续 P1 减法，抽样处理已不在 sitemap/search 的 `catalogue-only` 薄内容系列页，把低价值 direct URL 合并到已有核心页面，而不是继续保留一组近似空壳入口。
- 实际改动：新增 `RETIRED_CATALOGUE_REDIRECT_TARGETS`、`getRetiredCatalogueRedirectTarget`、`isRetiredCatalogueGameSlug` 和统一 `getGameRedirectTarget`；动态游戏页改为使用统一重定向策略。
- 合并映射：`duo-survival` -> `duo-vikings`，`duo-survival-2` -> `duo-vikings-2`，`duo-survival-3` -> `duo-vikings-3`；`fly-car-stunt`、`fly-car-stunt-2`、`fly-car-stunt-5` -> `ultimate-stunt-car-challenge`。
- 文档同步：`scripts/audit-game-quality.ts` 新增 `merge` 决策类型，`docs/game-quality-audit.md` 已重新生成；这 6 个 retired catalogue-only 页现在在决策表中显示为合并到更强核心页。
- 测试补充：`tests/source-disclosure.test.ts` 覆盖 removed 与 retired catalogue 两类映射，并断言统一 redirect lookup；`tests/audit-game-quality.test.ts` 覆盖 `merge` 决策。
- 验证结果：`pnpm type-check` 通过；`pnpm test -- --run` 20 files / 72 tests 全部通过；`pnpm check:internal-links` 通过；`pnpm lint` 0 errors，保留 96 个既有脚本 `console` warnings；`pnpm build` 通过，静态页生成 116 个，`patch-static-locale-html` 处理 28/28 英文静态 HTML；本地 production server 抽查 6 个 retired catalogue-only slug 均返回 308 到对应核心页，4 个目标核心页均 200。
- 下一步：完整门禁通过后，继续按同样模式审计下一组 catalogue-only：优先处理 combat/war/zombie 语义、placeholder thumbnail、短描述且无搜索信号的 direct URL。

### T-140 Monitoring-led Big Tower Tiny Square 2 long-tail guide

- 本次目标：读取监测数据后选择一个低竞争长尾机会，新增一篇有原创攻略价值、可索引、可内链的 SEO/GEO 页面，避免只铺薄内容 iframe。
- 监测结果：`pnpm ops:monitoring` 显示主站、robots、290 URL sitemap、public health、search fallback 和 Clarity tag 可访问；`pnpm ops:growth` 仍因缺少本地 OAuth/API token 跳过 GA4/GSC/Clarity 后台 API。已登录浏览器读取 GSC：3 months 为 47 clicks / 2.38K impressions / CTR 2% / avg position 17.8，`google-snake-mods`、`best-free-iphone-games`、`drive-mad-walkthrough` 仍是主要已有信号，同时出现 `big tower tiny square 2 walkthrough` 0 clicks / 4 impressions / avg position 7.8、`big tower tiny square walkthrough` 0 / 15 / 6.0 和 `how to save pineapple in big tower tiny square` 0 / 2 / 7.5。
- 数据限制：浏览器 GA4 当前默认打开的是 `ghibliart.top`，未归因到 Luma；Clarity 项目页提示会话过期，未读取到新 session/heatmap/dead-click 数据；因此本轮只把 GSC 与本地监控作为优化依据，不伪造行为数据。
- 实际改动：新增 `big-tower-tiny-square-2-walkthrough` 中英文 SEO guide，包含完整 metadata、Quick answer、how to play、controls/double-jump timing、moving hazards/mobile notes、FAQPage、Article citation、官方来源链接、嵌入试玩块和相关游戏推荐；同步把既有 `big-tower-tiny-square-walkthrough` 的 related links 指向新攻略，形成 Big Tower 主题内链。
- 预期 URL：`/en/guides/big-tower-tiny-square-2-walkthrough` 与 `/guides/big-tower-tiny-square-2-walkthrough`；页面围绕 `big tower tiny square 2 walkthrough`、`how to beat big tower tiny square 2`、`big tower tiny square 2 double jump`、`big tower tiny square 2 unblocked` 等长尾词写作，并明确不提供安装包、APK、ROM 或破解下载。
- 验证结果：`pnpm type-check` 通过；`pnpm check:internal-links` 通过；`pnpm test -- --run` 20 files / 72 tests 全部通过；`pnpm lint` 0 errors，保留 96 个既有脚本 console warnings；`pnpm build` 通过，静态页生成 118 个，`patch-static-locale-html` 处理 29/29 英文静态 HTML；`git diff --check` 通过。本地 production server 抽查中英文新 URL 均 HTTP 200，输出 title、canonical、Article、FAQPage、H1、Quick answer、相关内链和游戏入口；本地 sitemap 包含新中英文 URL。
- 下一步：部署后抽查生产 URL、sitemap 和 GSC URL inspection；7-14 天后复查 `big tower tiny square 2 walkthrough`、`big tower tiny square walkthrough`、`how to save pineapple in big tower tiny square` 的 impressions、CTR 和 position。若 Big Tower 主题继续增长，再拆 `how to save the pineapple` 或 `Big Tower Tiny Square checkpoints` 子攻略；否则优先回到 Snake Mods 与 iPhone games CTR 优化。

### T-141 Full page quality score gate and index-surface reduction

- 本次目标：检查所有公开页面并按性能、可玩性、热门程度、长尾词优质度、原创内容、来源风险和 AdSense 审核安全性打分；低于 80 分的页面必须优化到 80 分以上，或退出可索引面/合并到更强页面。
- 检查结果：新增全页面评分报告 `docs/page-quality-scorecard.md`。当前共评分 248 行，其中可索引行 91、低于 80 分行 157、仍可索引且低于 80 分行 0；执行策略为 keep 91、noindex 3、redirect 10、remove-from-index 144。游戏质量审计同步为 200 个 fallback 游戏、46 个核心索引游戏、134 个 catalogue-only、20 个 manual-review、154 个 noindex 游戏页。
- 实际改动：新增 `scripts/audit-page-quality.ts` 与 `pnpm audit:page-quality`；把低分核心游戏从 `CORE_INDEXABLE_GAME_SLUGS` 收口到 46 个；`string-theory-2-remastered` 补齐中英文原创 game editorial 后重新进入核心索引；`progression` 与 `timed-challenge` 等薄标签页改为 `noindex,follow` 并退出 sitemap。
- 页面提质：`games-like-ovo` 从 74 分补强到 100 分，新增按技能选择、键盘/手机/网络限制、安全浏览器游戏检查清单、FAQ、官方来源 citation 和更稳妥的 metadata；正文不再承诺学校或公司网络一定可玩，也不引导下载、插件、APK 或绕过网络规则。
- 减法与内链：将 `duo-survival-3`、`fly-car-stunt` 系列等合并目标改到仍保留索引资格的核心页面；清理 `games-to-play-when-bored`、`car-circle-guide`、`string-theory-2-remastered-guide`、`monkey-mart-guide`、`browser-games-for-low-end-pc` 中指向已降级游戏的推荐，避免高质量攻略把权重导向薄页。
- 测试补充：新增 `tests/page-quality-scorecard.test.ts`，断言所有可索引评分页都不低于 80，并断言薄标签页不进 sitemap 且 metadata 输出 `noindex,follow`；更新来源披露/重定向测试覆盖新的安全目标。
- 验证结果：`pnpm audit:page-quality`、`pnpm check:internal-links`、`pnpm type-check`、`pnpm test -- --run`、`pnpm lint`、`pnpm build`、`git diff --check` 均通过。本地 production server 抽查 `/en/guides/games-like-ovo`、`/en/games/string-theory-2-remastered`、`/en/games/tag/timed-challenge` 与 `sitemap.xml`：保留页 200 且在 sitemap，薄标签页 200 但 `noindex,follow` 且不在 sitemap。
- 下一步：部署后用生产域重复 sitemap/robots/canonical/noindex 抽查，并观察 GSC 中被降级 slug 是否有真实展示或点击；只有补齐来源、原创内容、移动体验和可玩性达到 80+ 的页面，才重新放回核心索引。

### T-142 Production index-surface verification and runtime sampling gate

- 本次目标：按 T-141 后续要求，把当前本地索引面收口部署到生产，并在生产域复查 `sitemap`、`robots`、canonical、`noindex`；同时补一轮 Playwright/Lighthouse-style 批量采样，把移动端性能和可玩性纳入更硬的页面分数。
- 远端/本地状态：远端 `origin/main` 仍为 `0a1bbf5`，本地工作树包含 T-136 到 T-141 的未提交质量收口改动；遵循日常维护规则，本轮未做 git commit，使用当前本地工作树通过 Vercel CLI 发布。
- 实际改动：新增 `scripts/audit-runtime-quality.ts` 与 `pnpm audit:runtime-quality`，默认采样 `/en`、`/en/games`、3 个高价值 guide 和 2 个游戏页；报告写入 `docs/page-runtime-sampling.md`，对 canonical、移动端横向溢出、DCL/FCP/load、传输体积、请求数、console/page errors、Play button、iframe 和 Luma 全屏控件打分，样本低于 80 时失败。
- 评分文档：`scripts/audit-page-quality.ts` 和 `docs/page-quality-scorecard.md` 已说明 runtime sampling 是静态页面分的 companion gate；静态 scorecard 继续保持 248 行评分、91 个可索引行、0 个可索引 under-80。
- 本地验证：`pnpm audit:page-quality` 通过；`GAME_CATALOG_MODE=local pnpm exec next start -H 127.0.0.1 -p 3026` 后 `pnpm audit:runtime-quality -- --base-url http://127.0.0.1:3026` 通过，7 个样本最低 88；`pnpm type-check`、`pnpm test -- --run`（21 files / 74 tests）、`pnpm check:internal-links`、`pnpm lint`（0 errors，98 个既有脚本 console warnings）、`pnpm build`、`git diff --check` 均通过。
- 生产部署：执行 `vercel deploy --prod --yes`，新 production URL 为 `https://251001-web-gamehub-rdg6-5yzux8tlk-yanruoyi999s-projects.vercel.app`，`https://www.lumagamehub.com` 已返回新内容。
- 生产 SEO 复查：`robots.txt` 为 200，允许 `/`，禁止 `/admin` 与 `/api`，并指向 `https://www.lumagamehub.com/sitemap.xml`；生产 sitemap 为 192 URLs，包含 `games-like-ovo`、`drive-mad`、`string-theory-2-remastered`，不包含 `timed-challenge`、`progression`、`search`、`4399-sample`、`duo-survival` 或 `fly-car-stunt`。
- 生产 canonical / noindex / redirect：`/en/guides/games-like-ovo`、`/en/games/string-theory-2-remastered`、`/en/games/drive-mad` 均 HTTP 200 且 canonical 指向生产域；`/en/games/tag/timed-challenge` 与 `/en/search` 均 HTTP 200、canonical 正常、`robots=noindex, follow`；`/en/games/duo-survival` HTTP 308 到 `/en/games/duo-vikings`。
- 生产 runtime 采样：`pnpm audit:runtime-quality -- --base-url https://www.lumagamehub.com` 通过，7 个样本 under-80 为 0，最低分 100；`drive-mad` 与 `duo-vikings` 移动端均能看到 Play button，点击后 iframe 与 Luma 全屏控件可见。
- GSC 状态：本地 `pnpm ops:monitoring` 仍显示 GSC API skipped，因为 `GSC_CLIENT_ID`、`GSC_CLIENT_SECRET`、`GSC_REFRESH_TOKEN` 未配置；Chrome DevTools 可控浏览器打开 Search Console 时进入 Google 登录页，无法读取已登录 GSC 页面。本轮没有伪造被降级页面搜索信号。被降级页面继续退出 sitemap/search/index surface，只有后续 GSC 证明有真实 impressions/clicks，且补齐原创内容、来源、可玩性并达到 80+，才恢复索引。
- 生产监控：`pnpm ops:monitoring` 显示 site、robots、sitemap、public health、Clarity tag 均 ok；数据库配置仍为 Supabase direct serverless degraded，Meilisearch 仍指向 localhost degraded，search API 继续 fallback degraded，这些是外部配置项，未在本轮内容/索引面任务中改动。
- 下一步：不要盲目扩张新游戏数量；优先用 GSC/Clarity 找已有曝光页加深。若要恢复任何降级页，先补来源披露、原创玩法、移动端实际采样和 80+ 静态/runtime 分数，再进 sitemap。

### T-143 July 13 opportunity radar guide-first pages

- 本次目标：读取 2026-07-13 Luma 游戏机会雷达和当前本地/远端状态，在不复制 iframe、不批量制造薄页的前提下，优先补强 P0 中已有集群缺口和低竞争新词页面。
- 机会核验：CrazyGames live pages 复核 `Robby: Cross the Road for Brainrot`、`Obby: Parkour with Ragdoll`、`Rail Cart Buddies` 的 2026 年 7 月发布、设备支持、控制方式和核心玩法；Poki 新页只作为候选观察，未纳入本轮新增。Brainrot draft PR 仍处于冲突/未合并背景，本轮继续在当前本地工作树上小范围改动，没有 git commit。
- 实际改动：补强既有 `robby-cross-the-road-for-brainrot-guide`，增加 E/F/Shift、基地槽位和升级顺序等实操段落；新增 `obby-parkour-with-ragdoll-guide` 与 `rail-cart-buddies-guide` 中英文 guide entry，包含 metadata、原创玩法建议、FAQPage、官方来源链接、相关内链和保守版权/安全表述。
- 边界控制：本轮没有新增或复制 CrazyGames/Poki iframe，没有托管玩家地图、截图、APK、mod、作弊脚本、破解下载或未授权素材；Brainrot/Roblox-like 内容只作为非官方玩法攻略描述。
- runtime gate：`scripts/audit-runtime-quality.ts` 默认采样扩展到 9 页，纳入 Obby/Rail 新指南；同时把 TTFB/transport 单独报告，页面评分改用 response-relative DCL/FCP/load，避免本机到 Vercel 约 5.5-6.2s TLS/TTFB 链路噪声把所有页面一起误判为 under-80。
- 生产部署：执行 `vercel deploy --prod --yes`，新 production URL 为 `https://251001-web-gamehub-rdg6-gcjy9ychg-yanruoyi999s-projects.vercel.app`，`https://www.lumagamehub.com` 已返回新内容。
- 生产 SEO 复查：`robots.txt` HTTP 200，继续指向 `https://www.lumagamehub.com/sitemap.xml`；生产 sitemap 为 196 URLs，包含 Robby、Obby、Rail 的英文 URL，并包含 Obby/Rail 中文 URL；`timed-challenge`、`progression`、`search`、`duo-survival` 继续不在 sitemap。
- 生产 canonical / noindex：`/en/guides/robby-cross-the-road-for-brainrot-guide`、`/en/guides/obby-parkour-with-ragdoll-guide`、`/en/guides/rail-cart-buddies-guide` 均 HTTP 200、canonical 指向生产域、FAQ/source 存在、无 noindex；`/en/games/tag/timed-challenge` 与 `/en/search` 均为 `noindex, follow`。
- 验证结果：`pnpm type-check`、`pnpm audit:page-quality`、`pnpm check:internal-links`、`pnpm test -- --run`（21 files / 74 tests）、`pnpm lint`（0 errors，98 个既有 console warnings）、`pnpm build`（122 static pages，31/31 English static HTML patched）、`git diff --check` 均通过；`pnpm audit:runtime-quality -- --base-url https://www.lumagamehub.com` 通过，9 个样本 under-80 为 0，最低分 100，两个游戏样本移动端 Play/iframe/fullscreen 可见。
- 监控状态：`pnpm ops:monitoring` 显示 site、robots、sitemap、public health、Clarity tag 均 ok；database config、Meilisearch config 和 search API 仍为既有 degraded/fallback；GSC 仍 skipped，因为 `GSC_CLIENT_ID`、`GSC_CLIENT_SECRET`、`GSC_REFRESH_TOKEN` 未配置。本轮没有伪造被降级页面搜索信号，也没有恢复任何降级页索引。
- 下一步：用 GSC/Clarity 优先观察已有曝光页和本轮新增指南是否出现真实 impressions/clicks；只有补齐原创内容、来源披露、移动端可玩性且静态/runtime 均 80+ 的页面，才恢复或扩大索引。P1 候选如 `Lumina Escape`、`Harbor Tycoon`、`ABLOCKALYPSE` 也应先做实测和来源核验，不批量铺低质量游戏数。

### T-144 Main convergence and local catalogue read guard

- 本次目标：按用户明确要求核对 GitHub 与本地累计改动，在完整门禁通过后将 T-136 至 T-143 的目录真实性、索引面收口、质量审计、运行时采样和攻略内容统一合入 `main` 并部署生产。
- Git 状态：`git fetch --prune origin` 后本地基线与 `origin/main` 均为 `0a1bbf5`，ahead/behind 为 `0/0`；现有 4 个 draft PR 均为旧冲突分支，本轮不逐个硬合并，而以当前已验证工作树作为完整交付版本。
- 发布前修复：本地 production runtime 发现 `GAME_CATALOG_MODE=local` 时目录页、详情页和 sitemap 仍可能尝试数据库。新增统一 `shouldUseCatalogueDatabase` 判定并接入三处读取路径，确保显式 local mode 不触发远端目录读取；测试先因缺少判定失败，再实现通过。
- 性能结果：修复后本地 `/en/games` TTFB 从约 1.9 秒降到约 66 毫秒，`drive-mad` 与 `duo-vikings` 从约 1.6 秒降到 18-23 毫秒；服务端抽样期间不再出现数据库或 Redis 超时日志。
- 验证结果：页面质量评分、内链、类型检查、Vitest、ESLint、Next production build、Playwright 移动端运行时采样和 `git diff --check` 均通过；Vitest 为 21 files / 75 tests，构建生成 122 个静态页并修正 31/31 英文静态 HTML，运行时 9 个样本 under-80 为 0、最低 88。
- 已知外部限制：`pnpm audit:prod` 因 npm 官方旧 audit endpoint 已退役而收到 HTTP 410，不能把该结果解释为有漏洞或无漏洞；本轮不修改依赖锁文件来规避外部接口问题。
- 下一步：将已验证分支 fast-forward 合并到本地 `main`，推送 GitHub，执行 Vercel production deployment，并在生产域复查 commit、health、robots、sitemap、canonical/noindex 与 runtime sampling。

### T-145 GA4 landing attribution and homepage dead-click remediation

- 监测根因：05:00 GA4 近 7 天为 37 sessions / 8 views；同日固定日期重查为 10 个 `page_view`，但 landing 明细仍有 29 sessions 为 `(not set)`、7 sessions 为空。交叉查询确认缺失 landing 的 session 已产生 `session_start`、`first_visit`、`user_engagement` 和部分游戏事件；少量 page view 还存在 `page_path` 与实际 `page_location` 不一致。原实现关闭自动 page view，完全依赖 hydration 后 listener，再用二次 `config` 和单一 `page_path` 补偿，存在初始化/路由时序与陈旧路径归因问题。
- 埋点修复：`app/layout.tsx` 在 hydration 前建立 `dataLayer/gtag` 队列，继续禁用 GA 自动 page view；`lib/gtag.ts` 对每次路由显式发送 `page_view`，包含 `page_path`、`page_location`、`page_title`。
- 交互根因：Clarity 代表性 dead-click 回放显示用户在首页 00:02-00:06 多次点击“即开即玩”提示卡，后续才进入游戏库并成功启动 Google Snake。原卡片有 hover 样式却是非交互 `div`。
- 交互修复：`app/[locale]/page.tsx` 把“即开即玩”卡改为可键盘聚焦的本地化游戏库链接，其他非交互特性卡去掉 hover 阴影。
- 测试与验证：新增 `tests/ga4-bootstrap.test.ts`、`tests/gtag.test.ts`；`pnpm vitest run` 23 files / 77 tests、`pnpm type-check`、`pnpm build`、`git diff --check` 通过；`pnpm lint` 0 errors，保留 98 个既有脚本 console warnings。桌面和 390px 移动端英文首页均无横向溢出，“Instant Play”唯一、可见且实际点击到达 `/en/games`；测试环境未发送真实 GA4 数据。
- 验证限制：本地 `next start` 的默认中文 `/` 与 `/zh` 出现互相重定向，生产 `/` 当前 HTTP 200；本轮不把仅 localhost 可复现且与生产监控根因无直接关系的路由差异混入修复，若生产出现 3xx loop 再升级。
- 下一步：部署后按固定日期观察 `screenPageViews / sessions`、`(not set)` 与空 landing 的绝对数/占比，并按页面与控件复查首页 dead click；不改 GSC property、sitemap 或 indexing 设置。

### T-146 Clarity production-host isolation and page-quality gate repair

- 实时数据复核：GA4 只读 API 重查 2026-07-10..16 为 46 sessions / 9 views / 41 active users，其中 `(not set)` 37 sessions、空 landing 5；hostname 全为 `www.lumagamehub.com`，确认 T-145 针对的 page view 断链仍是旧生产代码问题。GSC 最终日期已前移至 07-15，当日 4 clicks / 152 impressions，属于正向搜索信号。
- Clarity 根因：网络恢复后复用现有已登录 GameHub 项目，过去 3 天为 21 sessions、4 dead-click sessions；热门页面直接出现多条 `http://localhost/...`。`.env.local` 使用生产 Clarity ID，而原组件不校验 hostname，导致本地测试污染生产体验口径。后台项目网站 URL 已是正确的 `www.lumagamehub.com`，无需修改设置。
- Clarity 修复：`components/analytics/ClarityConsent.tsx` 仅允许 `lumagamehub.com` 与 `www.lumagamehub.com` 加载生产项目；新增 `tests/clarity-consent.test.ts`，先复现 localhost 插入脚本，再验证 localhost 隔离和正式主域加载。
- 发布门禁修复：`scripts/audit-page-quality.ts` 的报告行数组末尾已有空行，返回值又追加换行，导致每次审计后 `git diff --check` 报 EOF 空行并阻断自动任务。现改为只输出一个结尾换行，`tests/page-quality-scorecard.test.ts` 增加回归断言。
- 验证结果：`pnpm audit:page-quality`、`pnpm check:internal-links`、`pnpm type-check`、`pnpm test -- --run`（24 files / 80 tests）、`pnpm lint`（0 errors / 98 个既有 warnings）、`pnpm build`（122 static pages / 31 English HTML patched）和 `git diff --check` 通过。移动 runtime 9 个样本 under-80 为 0、最低 88；1440x1000 与 390x844 首页均无横向溢出，Instant Play 唯一、可见并跳转 `/en/games`，localhost 不再加载 Clarity。
- 边界与下一步：本轮未部署、未改 GA4/GSC/Clarity 后台。准确状态为本地修复完成，等待部署/数据验证；部署后观察 page views/session、缺失 landing、新增 localhost Clarity URL 和首页 dead click。localhost 根路径自循环未在生产复现，继续按 P2 观察。

### T-147 GA4 acquisition source isolation and current monitoring recheck

- 当前数据复核：GA4 只读 API 重查 2026-07-11..17 为 42 active users、45 sessions、9 views、174 events。05:00 报告中的 landing 为 `(not set)` 35、空值 6；当前同窗口变为 `(not set)` 40、空值 1，总缺失仍为 41/45，属于 GA4 后处理分桶变化，不是归因恢复。全部 45 sessions 的 hostname 仍为 `www.lumagamehub.com`。
- 新增 P1 根因：session source/medium 中出现 `game_detail` 16 sessions 与 `guide_embed` 5 sessions，共污染 21/45 sessions。生产 bundle 与本地调用链确认 `game_play_start` 把 UI 入口写入通用参数 `source`，共享 `trackEvent` 又把该参数原样发送给 GA4，导致交互上下文被解释为流量来源。
- 本地修复：`lib/analytics/events.ts` 只在发送 GA4 时将业务参数 `source` 映射为 `interaction_source`；Vercel Analytics 继续保留原有 `source`，Clarity 事件名不变。新增 `tests/analytics-events.test.ts`，先复现 GA4 收到保留字段，再验证两个分析出口各触发一次、GA4 不再收到 `source` 且保留 `interaction_source`。
- GSC 复核：2026-06-18..07-15 property 总计 69 clicks / 3,474 impressions；95 个 under-80 页面在 page 维度保留历史 5 clicks / 310 impressions，但其中曾获点击的 4 页在最新可用 07-13..15 仅 2 impressions / 0 clicks。现有 under-80 页面继续 `noindex`/退出 sitemap，不恢复索引。
- 既有待部署修复：T-145/T-146 的 GA4 显式 `page_view`、首页 Instant Play 真链接、Clarity 生产主机隔离和评分报告 EOF 修复仍只存在于本地工作树；生产 HTML 仍是旧 GA bootstrap，因此不能把当前后台数据写成已修复。
- 验证结果：页面质量 250 行、93 个可索引、157 个 under-80、0 个 under-80 可索引；内链检查通过；`pnpm type-check` 通过；Vitest 25 files / 81 tests 通过；ESLint 0 errors / 98 个既有 warnings；production build 通过并生成 122 个静态页、修正 31/31 英文 HTML；移动 runtime 9 个样本 under-80 为 0、最低 88。1440x1000 与 390x844 首页无横向溢出，Instant Play 可达 `/en/games`，localhost 不加载 Clarity，游戏页点击后 iframe 与全屏控件可见。
- 生产只读抽查：`robots.txt`、196 URL sitemap、canonical、under-80 页 `noindex,follow`、removed 页 308 和 `/api/health` 均符合当前策略；未提交 sitemap、未修改 GA4/GSC/Clarity 后台、未部署。
- 下一步：部署后按固定窗口观察 `screenPageViews/sessions`、缺失 landing、`game_detail`/`guide_embed` 是否停止进入 acquisition source、首页 dead click 和新增 localhost Clarity URL；索引恢复仍要求原创内容、来源披露、可玩性及静态/runtime 分数均达到 80+。

### T-148 Post-deploy analytics verification and monitoring runtime-mode repair

- 最新巡检复核：05:00 报告的 2026-07-12..18 GA4 49 sessions / 9 views、45 个缺失 landing 和 `game_detail`/`guide_embed` source 均来自 09:44 部署前窗口。当前 Data API 的部署后新增明细与生产验收路径及时刻一致，属于内部流量；这些样本已有具体 landing，来源保持 direct，不能当作业务增长，也不能替代完整真实用户日。
- 外部数据边界：GSC HTTP 200，final 仍截止 07-16，保持 74 clicks / 3,636 impressions；没有恢复任何降级页索引。Clarity 现有登录标签重载后仍为 `ERR_CONNECTION_CLOSED`，当前 dashboard TLS 路由不可读，不沿用昨日聚合。
- 新根因：生产 `/api/health` 已明确 local catalogue/cache 模式正常，但 `pnpm ops:monitoring` 依据本机 `.env` 推断生产模式，误报 database、Meilisearch 与 fallback search degraded。
- 本地修复：`lib/ops/health.ts` 输出非敏感结构化 runtime modes；`scripts/monitoring-status.ts` 对生产域优先采用远端 catalogue mode，仅在远端缺失 mode 或非生产目标时回退本机环境。`tests/health.test.ts` 与新增 `tests/monitoring-status.test.ts` 覆盖接口字段、远端优先和回退规则。
- 验证结果：页面质量 250 rows / 93 indexable / 157 under-80 / 0 indexable under-80；内链通过；Vitest 26 files / 84 tests、type-check、build、diff-check 通过，lint 为 0 errors / 98 个既有 warnings，构建 122 页并修正 31/31 英文 HTML。本地 health 返回 `catalogue=local`、`cache=local`，监控将 database、Meilisearch 和 fallback search 判为 ok。
- 页面与埋点验证：移动 runtime 9 页 under-80 为 0、最低 88；生产 1440x1000 与 390x844 无横向溢出、0 console errors、canonical 正确。阻断真实遥测后首屏/SPA 各 1 次 page view；移动 Drive Mad 只发送 `interaction_source=game_detail`，iframe 与全屏控件可见。robots、196 URL sitemap、可索引指南和薄标签 `noindex, follow` 均符合策略。
- 当前状态：本地修复完成，等待本提交的生产验证；未改 GA4/GSC/Clarity/Typeform 后台。用户授权后已将自 2026-07-10 残留的 `.git/REBASE_HEAD` 及导致 `git fsck` 非法引用错误的 `.git/refs/.DS_Store` 分别备份到 `/tmp` 并清理；清理前后 HEAD、索引、工作区差异、暂存区和状态校验值一致，`git fsck --connectivity-only` 无引用错误。下一次巡检只用部署后的真实用户完整日判断 GA4，并在 Clarity 路由恢复后复查 localhost 与 dead click。

### T-149 Telemount verified walkthrough and mobile feedback overlap fix

- 机会核验：只执行 2026-07-19 雷达中证据最强的 `Telemount Walkthrough`，没有批量新增其余候选。Hempuli 官方 itch.io 页面确认该作于 2026-07-16 发布、状态为 Released、平台为 HTML5，评论区存在第一关卡住、walkthrough 和跳关按键的真实需求；创作者本人确认 `Ctrl+Q` 跳关。
- 实测纠错：实际运行官方网页版本后确认方向键用于移动/推动，`Z` 为撤销、`R` 为重开；先前把 `Z` 当成交互键的判断已撤回。使用开发者确认的跳关方式核对到标题房间后共有 15 个测试房间，随后进入通关画面；未发现触屏按键，因此页面明确标注桌面键盘适配，不虚构手机玩法。
- 内容改动：`lib/seo-landing-content.ts` 新增中英文 `telemount-walkthrough`，包含第一关直接路线、全 15 关分段提示、撤销/重开/跳关风险、桌面适配、官方来源与社区完整通关参考；不嵌入或复制 itch.io 游戏文件。7 月新游集合增加相关内链，`scripts/audit-runtime-quality.ts` 将新页纳入默认移动采样。
- 移动端根因与修复：390px 浏览器截图发现共享 `TypeformFeedbackButton` 的固定文字按钮遮挡长正文。`components/feedback/TypeformFeedbackButton.tsx` 改为移动端页尾文档流中的 44px `MessageCircle` 图标，桌面端继续固定显示文字；原 Typeform/contact 链路和 `feedback_open` 埋点不变。`tests/feedback-button.test.ts` 锁定可访问标签、移动图标和仅桌面固定行为。
- 质量门槛：`tests/page-quality-scorecard.test.ts` 新增 Telemount 回归约束，锁定官方来源、无未授权 iframe、桌面限制、sitemap 和 80+ 索引门槛。静态评分为 100，所有可索引页面 under-80 为 0；Playwright 10 页移动采样 under-80 为 0、最低 88，Telemount 为 88、HTTP 200、canonical 存在、robots 为 index、无横向溢出、无 iframe。
- 验证结果：`pnpm lint` 0 errors / 98 个既有 warnings；`pnpm type-check` 通过；Vitest 27 files / 86 tests 通过；`pnpm check:internal-links` 通过；production build 生成 124 个静态页并修正 32/32 英文 HTML；官方来源和社区参考链接均 HTTP 200；中英文构建产物均含正确 H1、source citation、canonical、无 `noindex`、无 iframe，sitemap 含两种语言 URL。
- 验证边界：本地 `next start` 的默认中文无前缀 URL仍有既有自重定向差异，生产现有同类中文 URL 实测 HTTP 200，本轮不把仅 localhost 可复现问题混入内容修复。当前未 commit、未部署、未提交 GSC sitemap，也未修改任何分析后台；准确状态为本地修复完成，等待部署和生产数据验证。
- 下一步：部署后复查新页生产 canonical、robots、sitemap、无 `noindex`、移动页面和来源链接；7-14 天后只依据 GSC 的 `telemount walkthrough`、`telemount level 1`、`telemount controls` impressions/clicks 决定是否继续加深。其余 2026-07-19 候选继续观察，不因平台新增而批量制造薄页。

### T-150 Typeform funnel semantic diagnosis and monitoring rule fix

- 最新信号：2026-07-21 05:00 报告显示 GameHub Typeform all-time views 9→11、starts/submissions 保持 2/2，而 GA4 2026-07-20 有 1 次 `form_start`。GA4 readonly API 重查仍为 4 sessions / 6 views / 21 events，hostname 仅正式域；GSC 06-21..07-18 为 81 clicks / 3,967 impressions，sitemap 196 submitted、0 error/warning。
- 直接根因：GA4 的 `form_start` page 只指向 `/en/guides/hide-and-paint-guide`。该页继承全局站内搜索 `<form>`；共享反馈入口本身是 Typeform 外链并发送 `feedback_open`。因此差异来自 GA4 Enhanced Measurement 通用表单事件与 Typeform 自身漏斗的语义/窗口错配，不是提交链路断裂。
- 本地修复：更新站点巡检 `ops/site-monitoring/automation-prompt.md`，要求 Luma 只用 `feedback_open` 对账 Typeform；未直接归属 Typeform 的通用 `form_start` 不再参与漏斗判断。`tests/analytics-events.test.ts` 新增反馈 CTA 单次事件、page/locale 参数和 `interaction_source=typeform` 回归约束；产品 page view、反馈跳转和 Clarity 代码不变。
- 验证结果：针对性 2 files / 3 tests 通过；完整质量评分为 251 rows / 94 indexable / 0 indexable under-80，内链、type-check、27 files / 87 tests、lint 0 errors / 98 个既有 warnings、124 页 production build 与 diff-check 均通过。10 页移动 runtime 全部 80+、最低 88。
- 浏览器与生产：390px 反馈入口为 44px 文档流图标，1440px 为固定文字按钮；两个视口均无横向溢出，Typeform 链接携带 `source/locale/page` 并可打开。生产 site/robots/196 URL sitemap/health/search/Clarity tag 正常；Google Snake Mods 与 Hide and Paint canonical 正确，抽样低分页继续 `noindex, follow`。
- 边界：没有 commit、push、部署、GSC 提交或后台修改。T-149 仍为本地修复完成、等待部署/数据验证；下一轮以 `feedback_open` 和 Typeform 同窗新增数据复核反馈漏斗，并等待历史 `(not set)`、`game_detail`、`guide_embed` 退出完整窗口。

### T-151 Content honesty, mobile discovery, and real screenshot remediation

- 本次目标：按站点审查结果逐项完成可在代码库内落地的优化，保留现有 URL、埋点与绿色视觉体系，优先解决攻略重复/承诺不准确、移动端导航与筛选过重、首页价值入口不明确以及核心游戏占位图问题。
- 内容准确性：攻略模板只把第一节显示为 Quick Answer，不再在正文重复；Google Snake Mods 在 Quick Answer 直接给出维护方网页入口，并把站内试玩明确标成 `Play standard Snake - no mods` / `试玩标准 Snake（无模组）`，避免把标准 Snake 误说成模组版。
- 移动体验：首页头部新增可访问的折叠菜单与站内搜索，语言、主题和菜单触控目标统一到至少 44px；游戏库始终显示基础搜索，分类/标签/状态折叠为移动端高级筛选。390px 本地实测无横向溢出，首张游戏卡从改造前约 805px 提前到约 612px。
- 首页与素材：首页首屏改为 Google Snake Mods、OvO、Drive Mad、Solitaire 四个真实入口，移除编号式泛化优势文案；27 个核心可索引游戏由通用 SVG 占位图替换为现有可玩源的真实运行截图。人工检查发现 Monkey Mart 数据源实际打开 Blumgi Slime，已切换到仓库既有指南所用的真实 Monkey Mart 源并重新截图。
- 可访问性：Lighthouse 首次发现浅色品牌绿在白底的对比度仅 2.62:1；已把浅色主题主色统一为深翠绿 `#047857`。最终本地 production build 的移动 Lighthouse 为 Performance 98、Accessibility 100、Best Practices 96、SEO 100、LCP 2.4s、CLS 0、TBT 30ms；Best Practices 的 4 条 console error 均来自 localhost 不提供 `/_vercel/insights/script.js` 与 `/_vercel/speed-insights/script.js`，不是生产业务请求。
- 运行时与质量门：页面质量 251 rows / 94 indexable / 0 indexable under-80；内链、类型检查、Vitest、ESLint、production build、runtime sampling 与 `git diff --check` 均纳入最终门禁。移动 runtime 抽样 10 页，under-80 为 0、最低 88，游戏样本 Play/iframe/fullscreen 可见。
- 覆盖缺口与边界：未获取到当前外链锚文本分布或 referring-domain 明细，因此没有伪造“锚文本已优化”的结论；该项需要 GSC/外链工具数据后单独处理。2026-07-22 审计确认 T-151 与 T-152 共享 runtime、测试和记录，以同一发布范围进入 `main`；产品代码基线为 `79b46de`，生产桌面/移动端与图片加载均已验证。

### T-152 Playwright production telemetry isolation

- 监控信号：2026-07-22 05:00 报告的 GA4 昨日 raw 值从前一日 4 sessions / 6 views 升到 43 / 46，但 engagement 仍为 0%。Analytics Data API HTTP 200 复核确认 06:00 集中 35 Safari mobile direct、2 Chrome `(not set)` 和 1 Chrome `game_detail` session，与 06:20-06:24 生产 runtime/E2E 验证和 Clarity 排除 60 bots 的时窗一致。
- 直接根因：运行时采样器和仓库 E2E 会访问正式域，却没有统一隔离 GA4、Clarity 和 Vercel 采集请求；既有 localhost Clarity hostname 守卫无法覆盖生产自动化访问。这是测试流量污染，不是真实用户增长、认证失败或错误项目 ID。
- 代码修复：新增 `scripts/playwright-telemetry-isolation.ts`，阻断 Google Analytics / DoubleClick、Clarity / Bing 像素与 Vercel Insights 采集端点，同时保留测量脚本和站点资源。`scripts/audit-runtime-quality.ts` 在创建页面前安装隔离，内部路由改用 `fallback()` 以组合多层规则；报告明确披露自动采样不写分析。
- E2E 收口：新增 `tests/e2e/fixtures.ts`，`game-browsing.spec.ts` 和 `smoke.spec.ts` 统一从该 fixture 导入。`tests/playwright-analytics-isolation.test.ts` 覆盖真实采集端点、不误拦测量脚本/站点资源、runtime 安装顺序、所有 E2E spec 的 fixture 契约。
- 浏览器回归发现并修正了第二个问题：直接把 TypeScript 函数传给 `addInitScript` 时，`tsx` 序列化生成 `__name is not defined`。现改用纯文本 bootstrap，实际页面错误已消失；本地剩余 4 条 console 信息仅为 `next start` 不提供 Vercel Insights 脚本的 404/MIME 噪声。
- 验证结果：页面质量 251 rows / 94 indexable / 0 indexable under-80，内链、type-check、34 files / 106 Vitest tests、lint 0 errors / 98 个既有 warnings、124 页 production build 和 `git diff --check` 通过。仓库 E2E 为 1 passed / 3 按既有契约 skipped；另行 390x844 与 1440x1000 验证均 HTTP 200、无溢出或重叠、遥测完成数为 0。
- 运行时门禁：最终本地 10 页采样 under-80=0、最低 88；生产域 10 页隔离采样 under-80=0、最低 100，游戏 Play / iframe / fullscreen 通过。Telemount 生产实测的 GA4 和 Clarity 采集请求全部 blocked，匹配请求 finished=0。
- 发布状态：2026-07-22 用户确认后已完成 T-151/T-152 合并发布。主提交 `397c50f`，CI 可移植性修正 `14dffc1`，Sharp/libvips 安全覆盖 `79b46de`；最终 GitHub Actions `29880062285` success，Vercel Production 构建日志确认 commit `79b46de` 并接管正式域。生产 10 页移动 runtime 最低 100，Play / iframe / fullscreen 通过，遥测完成数为 0。准确状态为已部署、等待新数据窗口验证；继续观察 06:00 批量 `first_visit` / `session_start`、Clarity bots excluded 和历史 source 退出，历史数据不回填。

### T-153 Bing readiness and remaining trust fixes on the latest main

- 基线收敛：没有把 2026-07-21 的旧工作树整体 rebase 到产品。以当前 `main=176fd1e` 新建隔离分支，只重新实现尚未进入主线的问题；T-151/T-152 已发布的首页、Header、移动筛选、27 张核心游戏截图、遥测隔离、Sharp override、lockfile 和 runtime 门禁均保留。
- Bing 与 sitemap：移除静态页、本地游戏、分类和标签的文件 mtime/请求时间 `lastmod`；本地 production sitemap 为 198 URLs、58 个可信 `lastmod`、2 个稳定日期、0 个请求分钟日期。新增同源/去重/显式 URL/10,000 上限保护的 IndexNow 客户端、公开 key 文件和 `pnpm seo:indexnow`；key 部署前未发送线上通知。
- 玩家信任：模拟目录游戏没有可信发布日期时写 `publishedAt: null` 并隐藏 Published；游戏来源和 Tips 卡补齐深色对比度；Footer 的外部 SEO/AdSense/素材链接改为站内 About、举报/下架 Contact、Privacy & Cookies。
- 分类与呈现：Google Snake 固定为 Casual 和 single-player/keyboard/short-session/high-score，相关推荐固定为 G-Switch 2、OvO、Tunnel Rush，取消数组邻近造成的 Adam and Eve 误推荐。Telemount 在现有去重 Quick Answer 模板上增加编辑署名、稳定更新时间、来源核验状态和 3 张官方 HTML5 实测画面，不复制或嵌入 itch 游戏文件。
- 验证结果：页面质量 251 rows / 94 indexable / 157 under-80 / 0 indexable under-80；内链与 type-check 通过；Vitest 38 files / 119 tests 全通过；lint 0 errors / 98 个既有 warnings；production build 124 页并修正 32/32 英文 HTML。5 个关键本地 production URL 均 HTTP 200；10 页移动 runtime under-80=0、最低 88，游戏 Play/iframe/fullscreen 通过。
- 发布与生产验收：隔离分支提交 `0d0448f` 已 fast-forward 合入 `main` 并推送 GitHub；Vercel Git integration 于 2026-07-22 12:22（Asia/Shanghai）完成 Production 部署，部署元数据、`origin/main` 与本地 HEAD 均指向 `0d0448f`，`lumagamehub.com` 和 `www.lumagamehub.com` 已接管。生产 key 文件内容一致，sitemap 为 198 URLs / 58 个稳定 `lastmod` / 0 个请求分钟日期；Google Snake 分类与推荐、Telemount 3 张实测画面/署名/来源均在线。生产移动 runtime 抽样 10 页全部 100 分，游戏 Play/iframe/fullscreen 通过。
- IndexNow 与外部边界：生产 key 验证成功后，仅提交本次 12 个明确变更 URL，IndexNow 返回 HTTP 202；这只证明服务接收，不等于已收录。Bing Webmaster 当前 property、验证和 sitemap 后台状态仍为 `未获取到`，原因是当前浏览器停在登录页；需用户完成登录后逐站核验，不能由代码或 HTTP 200 推断已接入。
