# 🚀 外链SEO优化部署清单

## ✅ 已完成的工作（由AI助手完成）

### 1. 数据库扩展
- [x] 在 `games` 表添加3个外链字段
  - `developer_name` - 开发者名称
  - `developer_url` - 开发者官网链接
  - `source_url` - 游戏官方链接
- [x] 创建迁移SQL文件: `db/migrations/add_seo_links.sql`
- [x] 更新TypeScript类型定义

### 2. 前端优化
- [x] **游戏详情页**增强 ([app/[locale]/games/[slug]/page.tsx](app/[locale]/games/[slug]/page.tsx#L566-613))
  - 显示"官方开发者"卡片（带验证标识）
  - 显示"官方来源"按钮（突出显示）
  - 增加信任度说明文案（中英双语）

- [x] **页脚友情链接** ([components/layout/Footer.tsx](components/layout/Footer.tsx#L128-162))
  - 添加7个高质量游戏平台外链
  - 使用 `rel="noopener"` 属性（SEO友好）

### 3. 管理后台
- [x] **游戏编辑表单**扩展 ([components/admin/game-edit-form.tsx](components/admin/game-edit-form.tsx#L53-55,86-88,201-238))
  - 新增3个SEO字段输入框
  - 字段标注"(SEO)"提示运营重要性

- [x] **API层URL校验** ([app/api/admin/games/[id]/route.ts](app/api/admin/games/[id]/route.ts#L73-109))
  - 自动验证URL格式
  - 拒绝无效链接（返回400错误）
  - 支持HTTPS和HTTP协议

### 4. Service层更新
- [x] 更新 `GameService` 支持新字段 ([services/game.service.ts](services/game.service.ts#L60-62,80-82,330-332))
- [x] TypeScript类型完整定义

### 5. 必需页面（AdSense审核要求）
- [x] **隐私政策页面** `/[locale]/privacy`
  - 详细说明数据收集和使用
  - 第三方服务（AdSense、Analytics）披露
  - 用户权利说明

- [x] **关于我们页面** `/[locale]/about`
  - 使命和愿景
  - 技术栈展示
  - 合作伙伴外链（7个）

- [x] **联系我们页面** `/[locale]/contact`
  - 多渠道联系方式
  - 开发者合作说明
  - 响应时间承诺

### 6. 文档与指南
- [x] **外链管理指南** ([EXTERNAL_LINKS_GUIDE.md](EXTERNAL_LINKS_GUIDE.md))
  - 完整的巡检流程和模板
  - 自动化巡检脚本代码
  - 死链处理SOP
  - 责任人分工建议

---

## 📋 你需要执行的步骤

### 第一步：数据库迁移（必需，立即执行）

```bash
# 方法1：使用psql命令行
psql -h <数据库主机> -U <用户名> -d <数据库名> -f db/migrations/add_seo_links.sql

# 方法2：直接在数据库客户端执行
ALTER TABLE games
ADD COLUMN IF NOT EXISTS developer_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS developer_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS source_url VARCHAR(500);
```

**验证迁移成功**：
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'games'
AND column_name IN ('developer_name', 'developer_url', 'source_url');
```

### 第二步：为游戏添加外链数据（分批进行）

#### 第1周（5-10个游戏）
1. 访问 `/admin/games`
2. 选择5-10个热门游戏编辑
3. 填写外链字段示例：
   ```
   Developer Name: 4399 Games
   Developer URL: https://www.4399.com
   Source URL: https://www.4399.com/flash/xxxxx.htm
   ```
4. 保存并验证前台显示

#### 第2周（10-15个游戏）
- 继续为10-15个游戏添加外链
- 检查前台展示效果
- 确保无死链

#### 第3周及以后
- 完成剩余游戏外链补充
- 新游戏上线时同步添加

### 第三步：配置Google Search Console

1. **添加网站并验证所有权**
   - 访问 [Google Search Console](https://search.google.com/search-console)
   - 添加您的网站域名
   - 选择验证方法（推荐：HTML文件上传）

2. **提交Sitemap**
   ```
   https://您的域名/sitemap.xml
   ```

3. **订阅重要通知**
   - ☑️ 手动操作通知
   - ☑️ 安全问题通知
   - ☑️ 覆盖率问题

4. **监控关键指标**
   - 每周检查"覆盖率"报告
   - 关注404错误页面
   - 查看外链状态

### 第四步：设置Google Analytics

1. 创建GA4媒体资源
2. 添加跟踪代码到网站
3. 设置转化目标：
   - 游戏播放次数
   - 页面停留时间
   - 评分提交

### 第五步：申请Google AdSense

**前置检查清单**：
- [ ] 网站运行至少1个月
- [ ] 至少20-30个游戏页面
- [ ] 隐私政策页面已上线
- [ ] 关于我们页面已上线
- [ ] 联系我们页面已上线
- [ ] 每个页面有外链（页脚7个+游戏详情0-2个）
- [ ] 无版权侵权内容
- [ ] 使用HTTPS协议
- [ ] 移动端适配良好

**申请流程**：
1. 访问 [Google AdSense](https://www.google.com/adsense)
2. 填写网站信息
3. 添加AdSense代码到网站
4. 等待审核（通常7-14天）

### 第六步：定期巡检外链（持续运营）

#### 每月1次全面检查（技术负责人）
使用巡检清单：[EXTERNAL_LINKS_GUIDE.md](EXTERNAL_LINKS_GUIDE.md#L120-161)

```bash
# 可选：运行自动化脚本
pnpm tsx scripts/check-links.ts
```

#### 每周1次抽查（内容编辑）
- 检查页脚7个友情链接
- 抽查5-10个游戏详情页链接

---

## 🎯 当前外链配置总结

### 全站外链（每页都有）
**位置**：页脚 ([components/layout/Footer.tsx](components/layout/Footer.tsx#L134-160))
- Itch.io (独立游戏平台)
- Kongregate (在线游戏门户)
- Newgrounds (创意游戏社区)
- Game Jolt (游戏社区)
- HTML5 Games (游戏资源库)
- Phaser (游戏开发框架)
- PlayCanvas (3D游戏引擎)

**数量**：7个 `rel="noopener"` 外链

### 游戏详情页外链（按需显示）
**位置**：游戏信息卡片 ([app/[locale]/games/[slug]/page.tsx](app/[locale]/games/[slug]/page.tsx#L566-613))
- 开发者链接（如果有 `developerUrl`）
- 官方来源链接（如果有 `sourceUrl`）

**数量**：最多2个外链

### 总计外链密度
- **最少**：7个（仅页脚，游戏无外链数据）
- **最多**：9个（页脚7个 + 游戏2个）

**SEO评估**：✅ 优秀（合理范围6-12个）

---

## ⚠️ 重要注意事项

### 外链质量控制
1. **避免低质量链接**
   - ❌ 个人博客
   - ❌ 垃圾站点
   - ❌ 无关行业网站
   - ✅ 知名游戏平台
   - ✅ 权威技术社区

2. **定期检查死链**
   - 使用巡检清单
   - 及时更新失效链接
   - 在Search Console提交重新抓取

3. **避免"模板化外链"惩罚**
   - 不要所有游戏使用相同外链
   - 外链应与游戏真实相关
   - 定期更新外链内容

### rel属性使用指南
```html
<!-- 当前使用（推荐） -->
<a href="..." rel="noopener">信任的合作伙伴</a>

<!-- 其他场景 -->
<a href="..." rel="noopener nofollow">用户生成内容</a>
<a href="..." rel="noopener sponsored">付费/广告链接</a>
```

---

## 📊 预期效果时间表

| 时间 | 预期效果 |
|------|---------|
| **第1周** | 数据库迁移完成，5-10个游戏有外链 |
| **第2周** | 15-25个游戏有外链，政策页面上线 |
| **第3周** | 所有游戏补齐外链，提交AdSense申请 |
| **第4-6周** | AdSense审核中，持续监控Search Console |
| **第6-8周** | AdSense审核通过（预期） |
| **第8周+** | 开始展示广告，监控收益和SEO数据 |

---

## 🔧 故障排查

### 问题1：页脚外链不显示
**原因**：Footer组件缓存
**解决**：
```bash
# 清除Next.js缓存
rm -rf .next
pnpm dev
```

### 问题2：游戏详情页外链不显示
**原因**：数据库字段为空
**检查**：
```sql
SELECT id, title, developer_name, developer_url, source_url
FROM games
WHERE id = <游戏ID>;
```

### 问题3：管理后台保存外链失败
**原因**：URL格式校验失败
**检查**：确保URL以 `http://` 或 `https://` 开头

### 问题4：TypeScript编译错误
**原因**：类型不匹配
**解决**：
```bash
pnpm type-check
# 查看具体错误信息
```

---

## 📞 技术支持

### 相关文件索引
- **数据库Schema**: [db/schema/games.ts](db/schema/games.ts#L27-30)
- **迁移SQL**: [db/migrations/add_seo_links.sql](db/migrations/add_seo_links.sql)
- **游戏Service**: [services/game.service.ts](services/game.service.ts#L60-62,80-82)
- **API路由**: [app/api/admin/games/[id]/route.ts](app/api/admin/games/[id]/route.ts#L73-109)
- **管理表单**: [components/admin/game-edit-form.tsx](components/admin/game-edit-form.tsx#L201-238)
- **游戏详情页**: [app/[locale]/games/[slug]/page.tsx](app/[locale]/games/[slug]/page.tsx#L566-613)
- **页脚组件**: [components/layout/Footer.tsx](components/layout/Footer.tsx#L128-162)
- **外链指南**: [EXTERNAL_LINKS_GUIDE.md](EXTERNAL_LINKS_GUIDE.md)

### 常见命令
```bash
# 开发模式
pnpm dev

# 类型检查
pnpm type-check

# 数据库迁移
psql -h <host> -U <user> -d <db> -f db/migrations/add_seo_links.sql

# 检查外链（需先创建脚本）
pnpm tsx scripts/check-links.ts

# 构建生产版本
pnpm build
```

---

## ✅ 最终检查清单

部署前请确认：

- [ ] 数据库迁移已执行并验证成功
- [ ] 至少5个游戏已添加外链数据
- [ ] 页脚友情链接正常显示（7个）
- [ ] 游戏详情页外链正常显示
- [ ] 隐私政策页面可访问 `/privacy`
- [ ] 关于我们页面可访问 `/about`
- [ ] 联系我们页面可访问 `/contact`
- [ ] 所有外链可点击并正常跳转
- [ ] 移动端显示正常
- [ ] TypeScript编译无错误
- [ ] 网站HTTPS已启用
- [ ] Google Search Console已配置
- [ ] Google Analytics已配置（可选）

**全部完成后，即可提交Google AdSense申请！** 🎉

---

**文档版本**: v1.0
**最后更新**: 2025-01-11
**维护者**: AI Assistant + 你的团队
