# 部署与运维指南

## 1. 部署目标
- **前端/SSR**：Vercel（推荐）
- **数据库**：Neon PostgreSQL 或 Supabase
- **缓存与限流**：Upstash Redis
- **搜索服务**：Meilisearch（Railway / 自建 Docker）
- **静态资源**：Cloudinary

## 2. 环境变量清单
在 Vercel 或其他平台上设置以下变量：

| 变量 | 说明 |
| --- | --- |
| `DATABASE_URL` | PostgreSQL 连接串 |
| `UPSTASH_REDIS_URL` / `UPSTASH_REDIS_TOKEN` | Redis 凭证 |
| `ADMIN_PASSWORD` | 后台登录密码 |
| `CRON_SECRET` | 定时任务校验密钥 |
| `MEILISEARCH_HOST` / `MEILISEARCH_API_KEY` | 搜索服务（可选） |
| `CLOUDINARY_*` | 上传与 CDN 配置（可选） |

建议将 `.env.local` 中的配置同步拷贝至 `Environment Variables`，保证本地与生产一致。

## 3. CI/CD
已经提供 `.github/workflows/ci.yml`，在 PR/合并时会执行：
- `pnpm lint`
- `pnpm type-check`
- `pnpm test`

需要：
1. 在 GitHub 仓库的 *Settings → Secrets* 中配置 `DATABASE_URL` 等变量供单元测试使用（若需要）。
2. 如需 Playwright 端到端测试，可在 CI 中补充 `pnpm test:e2e` 并安装浏览器：
   ```yaml
   - name: Install Playwright browsers
     run: npx playwright install --with-deps
   - name: E2E tests
     run: pnpm test:e2e
   ```

## 4. 部署步骤（以 Vercel 为例）
1. 推送代码到 GitHub 仓库。
2. 在 Vercel 导入该仓库，选择 `pnpm`，构建命令 `pnpm build`，输出目录 `.next`。
3. 在 Vercel 的 `Project Settings → Environment Variables` 中填入所有变量。
4. 触发部署，完成后即可访问生产环境。

## 5. 数据迁移与种子
- 构建阶段可执行 `pnpm db:push` 保持 schema 一致；如需迁移，改为 `pnpm db:migrate`。
- 若要导入示例数据，可在本地运行 `pnpm db:seed`，生产环境请谨慎操作。
- 推荐为生产数据库设置自动备份与只读账号。

## 6. 日志与监控
- 可引入 Sentry（前端 + Server Components）或 Logtail 记录错误日志。
- 设定 Vercel 的 `Alerts` 监控部署失败。
- 数据库和 Redis 需定期查看使用量（Neon/Upstash 控制台）。

## 7. 维护建议
- 定期 `pnpm update --interactive` 检查依赖。
- 结合 Roadmap，逐步完善端到端测试、负载监控与自动化备份。
- 管理员密码建议使用 16 位以上随机字符串，并通过 1Password 等管理。
