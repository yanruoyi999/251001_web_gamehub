# 外部服务配置指南

## 📌 文档目的

本文档指导如何配置和验证项目所需的所有外部服务，包括：
- **Cloudinary** - 图片 CDN 与存储
- **Meilisearch** - 全文搜索引擎
- **Upstash Redis** - 缓存与限流

完成本文档后，您将能够运行 `pnpm verify:services` 验证所有服务连接正常。

---

## 👥 目标读者

- 开发人员
- 运维人员
- 需要设置开发环境的新成员

---

## 📋 前置条件

### 必需
- [x] Node.js >= 18.17.0
- [x] pnpm >= 8.0.0
- [x] 已完成 Step 1-2（项目初始化和数据库配置）
- [x] 有效的邮箱地址（用于注册服务）

### 可选
- [ ] Docker（用于本地运行 Meilisearch）
- [ ] Railway 账号（用于托管 Meilisearch）

---

## 📖 操作步骤

### 第一步：创建 Cloudinary 账号并配置 Upload Presets

#### 1.1 注册账号

1. 访问 [Cloudinary 官网](https://cloudinary.com)
2. 点击 "Sign Up for Free"
3. 填写注册信息（推荐使用 Google 账号快速注册）
4. 验证邮箱并登录

#### 1.2 获取 API 凭证

1. 登录后进入 [Dashboard](https://console.cloudinary.com)
2. 在 "Product Environment Credentials" 区域找到：
   - **Cloud Name**: `your-cloud-name`
   - **API Key**: `123456789012345`
   - **API Secret**: `abcdefghijklmnopqrstuvwxyz123` (点击 "Reveal" 显示)
3. 复制这些凭证，稍后添加到 `.env.local`

#### 1.3 创建 Upload Presets

Cloudinary 的 Upload Preset 定义了上传图片的处理规则（尺寸、格式、质量等）。

**Preset 1: 游戏缩略图 (Thumbnails)**

1. 在 Dashboard 左侧菜单选择 **Settings** → **Upload**
2. 滚动到 "Upload presets" 区域，点击 **"Add upload preset"**
3. 配置如下：
   ```
   Preset name: preset-game-thumbnails
   Signing Mode: Unsigned (允许前端直传)
   Folder: game-thumbnails

   Incoming Transformation:
     - Mode: Limit Fill
     - Width: 400
     - Height: 300
     - Gravity: Auto
     - Quality: Auto (good)
     - Format: Auto (自动选择 WebP)
   ```
4. 点击 **Save**

**Preset 2: 游戏截图 (Screenshots)**

重复上述步骤，配置如下：
```
Preset name: preset-game-screenshots
Signing Mode: Unsigned
Folder: game-screenshots

Incoming Transformation:
  - Mode: Limit
  - Width: 1280
  - Height: 720
  - Quality: Auto (best)
  - Format: Auto
```

**Preset 3: 分类图标 (Icons)**

```
Preset name: preset-category-icons
Signing Mode: Unsigned
Folder: category-icons

Incoming Transformation:
  - Mode: Fill
  - Width: 128
  - Height: 128
  - Quality: Auto (good)
  - Format: PNG
```

#### 1.4 验证配置

使用 cURL 测试上传（替换 `YOUR_CLOUD_NAME`）：

```bash
curl -X POST "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload" \
  -F "file=@test-image.jpg" \
  -F "upload_preset=preset-game-thumbnails"
```

如果返回包含 `"public_id"` 的 JSON，说明配置成功。

---

### 第二步：配置 Upstash Redis

#### 2.1 注册账号

1. 访问 [Upstash Console](https://console.upstash.com)
2. 使用 GitHub/Google 账号登录
3. 首次登录会自动创建一个免费数据库

#### 2.2 创建 Redis 数据库

如果需要创建新数据库：

1. 点击 **"Create Database"**
2. 配置：
   ```
   Name: gamehub-cache
   Type: Regional
   Region: (选择离你最近的区域，如 us-east-1 或 ap-southeast-1)
   Eviction: Enabled (自动清理旧数据)
   ```
3. 点击 **Create**

#### 2.3 获取连接信息

1. 进入数据库详情页
2. 在 "REST API" 标签下找到：
   - **UPSTASH_REDIS_REST_URL**: `https://your-endpoint.upstash.io`
   - **UPSTASH_REDIS_REST_TOKEN**: `AXXXabc...`
3. 复制这些值

#### 2.4 测试连接

使用 REST API 测试：

```bash
# 设置值
curl https://YOUR-ENDPOINT.upstash.io/set/test/hello \
  -H "Authorization: Bearer YOUR_TOKEN"

# 获取值
curl https://YOUR-ENDPOINT.upstash.io/get/test \
  -H "Authorization: Bearer YOUR_TOKEN"
```

返回 `"hello"` 说明连接成功。

---

### 第三步：部署 Meilisearch

Meilisearch 有两种部署方式，根据需求选择：

#### 方案 A: 本地 Docker 部署（推荐用于开发）

**优点**: 完全免费，快速启动
**缺点**: 仅限本地开发，需要 Docker

1. 确保已安装 [Docker Desktop](https://www.docker.com/products/docker-desktop)
2. 运行以下命令：

```bash
docker run -d \
  --name meilisearch \
  -p 7700:7700 \
  -e MEILI_MASTER_KEY="your_master_key_at_least_16_chars" \
  -v $(pwd)/meili_data:/meili_data \
  getmeili/meilisearch:v1.5
```

3. 验证是否运行：

```bash
curl http://localhost:7700/health
# 返回: {"status":"available"}
```

4. 环境变量配置：
```bash
MEILISEARCH_HOST="http://localhost:7700"
MEILISEARCH_API_KEY="your_master_key_at_least_16_chars"
```

#### 方案 B: Railway 云托管（推荐用于生产）

**优点**: 零配置，提供公网访问
**缺点**: 免费额度有限（$5/月）

1. 访问 [Railway.app](https://railway.app)
2. 使用 GitHub 账号登录
3. 点击 **"New Project"** → **"Deploy Meilisearch"**
4. 在环境变量中设置：
   ```
   MEILI_MASTER_KEY: (生成一个随机 32 字符密钥)
   ```
5. 部署后，复制 Railway 提供的公网 URL
6. 环境变量配置：
```bash
MEILISEARCH_HOST="https://your-app.up.railway.app"
MEILISEARCH_API_KEY="your_master_key"
```

#### 3.3 配置游戏索引

运行索引配置脚本：

```bash
pnpm meilisearch:setup
```

这将创建 `games` 索引并配置搜索、过滤、排序属性。

#### 3.4 测试中文搜索

```bash
curl -X POST 'http://localhost:7700/indexes/games/documents' \
  -H 'Authorization: Bearer YOUR_MASTER_KEY' \
  -H 'Content-Type: application/json' \
  -d '[
    {"id": 1, "title": "太空射击游戏", "slug": "space-shooter"}
  ]'

# 搜索测试
curl 'http://localhost:7700/indexes/games/search?q=太空' \
  -H 'Authorization: Bearer YOUR_MASTER_KEY'
```

---

### 第四步：配置环境变量

#### 4.1 创建 .env.local 文件

```bash
cp .env.example .env.local
```

#### 4.2 填入真实凭证

编辑 `.env.local`，填入前面获取的所有凭证：

```bash
# Database (已在 Step 2 配置)
DATABASE_URL="postgresql://user:password@your-db.neon.tech/gamehub"

# Redis
UPSTASH_REDIS_URL="https://your-endpoint.upstash.io"
UPSTASH_REDIS_TOKEN="AXXXabc..."

# Meilisearch
MEILISEARCH_HOST="http://localhost:7700"  # 或 Railway URL
MEILISEARCH_API_KEY="your_master_key"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="abcdefghijklmnopqrstuvwxyz123"
CLOUDINARY_PRESET_THUMBNAIL="preset-game-thumbnails"
CLOUDINARY_PRESET_SCREENSHOT="preset-game-screenshots"
CLOUDINARY_PRESET_ICON="preset-category-icons"

# Admin & Security
ADMIN_PASSWORD="your-strong-password-here"
CRON_SECRET="$(openssl rand -base64 32)"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

### 第五步：验证所有服务

运行验证脚本：

```bash
pnpm verify:services
```

**预期输出**：

```
🔍 Verifying External Services...

📊 Verification Results:

✅ PostgreSQL: Connection successful
✅ Upstash Redis: Connection successful (PONG received)
✅ Meilisearch: Connection successful, "games" index exists
✅ Cloudinary: Connection successful. Required presets: preset-game-thumbnails, preset-game-screenshots, preset-category-icons

============================================================

✅ All services verified successfully!

🚀 You are ready to start development!
```

---

## ⚠️ 常见问题

### Q1: Cloudinary 上传失败，提示 "Invalid preset"

**原因**: Upload Preset 未创建或名称不匹配

**解决**:
1. 登录 Cloudinary Console
2. 检查 Settings → Upload → Upload presets
3. 确保 Preset 名称与 `.env.local` 中的配置完全一致
4. 确保 Signing Mode 设置为 "Unsigned"

---

### Q2: Meilisearch 中文搜索结果不准确

**原因**: Meilisearch 默认分词器对中文支持有限

**解决**:
1. 运行 `pnpm meilisearch:setup` 确保索引配置正确
2. 检查 `stopWords` 配置是否包含中文常见虚词
3. 如果仍然不满意，考虑降级到 PostgreSQL `ILIKE` 查询

---

### Q3: Redis 连接超时

**原因**: 网络问题或凭证错误

**解决**:
1. 检查 `.env.local` 中的 `UPSTASH_REDIS_URL` 和 `UPSTASH_REDIS_TOKEN` 是否正确
2. 在 Upstash Console 重新复制凭证
3. 检查防火墙/代理设置
4. 如果使用 VPN，尝试关闭后重试

---

### Q4: verify:services 脚本报错 "DATABASE_URL not configured"

**原因**: `.env.local` 文件不存在或未正确加载

**解决**:
1. 确保 `.env.local` 文件在项目根目录
2. 检查文件内容是否正确
3. 重启终端/IDE
4. 确保已安装 `dotenv` 依赖: `pnpm add -D dotenv`

---

### Q5: Meilisearch Docker 容器无法启动

**原因**: 端口 7700 被占用或 Docker 未运行

**解决**:
1. 检查 Docker Desktop 是否正在运行
2. 检查端口占用: `lsof -i :7700`
3. 停止占用端口的进程或更换端口
4. 查看 Docker 日志: `docker logs meilisearch`

---

## 🔙 回滚方案

### Cloudinary 降级方案

如果 Cloudinary 不可用，可以临时使用本地文件存储：

1. 创建 `public/uploads` 目录
2. 修改上传逻辑使用 Node.js `fs` 模块
3. 图片 URL 改为 `/uploads/xxx.jpg`

**限制**: 不适合生产环境（无 CDN 加速，占用服务器存储）

### Meilisearch 降级方案

如果 Meilisearch 不可用，系统会自动降级到 PostgreSQL 查询：

```typescript
// lib/meilisearch/index.ts 已实现降级逻辑
const client = getMeilisearchClient();
if (!client) {
  // 降级到数据库 ILIKE 查询
  return db.select().from(games).where(ilike(games.title, `%${query}%`));
}
```

### Redis 降级方案

如果 Redis 不可用，系统会跳过缓存直接查询数据库：

```typescript
// lib/redis/index.ts 已实现降级逻辑
const redis = getRedisClient();
if (!redis) {
  // 直接查询数据库，不使用缓存
  return db.select().from(games).where(eq(games.id, gameId));
}
```

---

## 💰 费用说明

### 免费套餐限制

| 服务 | 免费额度 | 限制 | 超额费用 |
|------|---------|------|---------|
| **Cloudinary** | 25GB 存储 + 25GB 带宽/月 | 足够存储 ~500 个游戏 | $99/月起 (Plus 计划) |
| **Upstash Redis** | 10K 命令/天 | ~300K 命令/月，足够 1 万次播放 | $0.2/100K 命令 |
| **Meilisearch (Railway)** | $5 免费额度/月 | 足够小型项目 | 按使用量计费 (~$10-20/月) |
| **Neon PostgreSQL** | 0.5GB 存储 | 1 个数据库 | $19/月起 (Pro 计划) |

### 生产环境建议

对于生产环境（日均 5K UV，1000 个游戏），建议预算：

```
Cloudinary: $0 (免费套餐足够)
Upstash Redis: $0 (免费套餐足够)
Meilisearch: $10-15/月 (Railway 托管)
Neon PostgreSQL: $19/月 (Pro 计划)
Vercel: $20/月 (Pro 计划，支持 Cron Jobs)
---
总计: $50-55/月
```

---

## 📞 联系人

- **负责人**: [填写开发团队负责人]
- **紧急联系**: [Slack/Discord 频道]
- **问题反馈**: GitHub Issues

---

## 📅 更新记录

- **2025-10-01**: 初始版本 (Step 3 完成)
  - 创建 Cloudinary/Redis/Meilisearch 配置指南
  - 添加验证脚本和常见问题解答
  - 添加降级方案和费用说明

---

**📚 相关文档**:
- [项目进度跟踪](../progress.md)
- [数据库 Schema 设计](../step2-optimization.md)
- [README](../../README.md)
