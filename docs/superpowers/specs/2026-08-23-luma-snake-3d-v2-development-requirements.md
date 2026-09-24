# Luma Snake 3D V2 开发需求文档

- 文档状态：ApprovedForImplementation
- 日期：2026-08-23
- 基线：`main@c5abe8b4cb76baddf94ea4f96b88a69a02c6405b`
- 实施分支：`feat/luma-snake-v2-quality`
- 产品：Luma Game Hub
- 页面：`/[locale]/games/snake-3d`

## 1. 目标

在不推倒现有原创 Snake 3D 的前提下，把当前版本升级为稳定、流畅、移动端友好、可量化、可作为 Luma Original 后续小游戏基线的正式版本。

本轮优先级：

1. 玩法正确性
2. 输入手感与难度曲线
3. 3D 渲染平滑度与性能
4. 移动端控制与暂停恢复
5. 低成本声音/画面反馈
6. 真实游戏埋点
7. 自研版权/来源台账
8. PC + Mobile 真实玩法验证

## 2. 已有能力必须保留

现有实现已经具备，不能回退：

- 独立纯规则层 `lib/games/luma-snake-3d.ts`
- Three.js 点击 Play 后动态加载
- UTC 每日挑战与确定性初始状态
- 本地最高分
- 方向键 / WASD
- 手机触控方向键
- 暂停、重玩、全屏
- 基础分析事件
- Vitest 规则测试
- 中英文页面

## 3. 技术边界

- Next.js 15 + React 19 + TypeScript
- 继续使用现有 Three.js，不新增 Phaser / PixiJS / LittleJS
- Three.js 必须继续延迟到用户点击 Play 后初始化
- 规则层不得依赖 DOM、React、Three.js
- 第一版声音优先使用 Web Audio API，不新增音频文件和来源不明素材
- 不接后端排行榜、账号系统、多人联网
- 不复制无明确许可证的 GitHub Snake 项目
- 代码修改限于完成本需求必需范围，不做无关重构

## 4. 功能需求

### 4.1 输入正确性

- 禁止 180° 立即反向
- 一个逻辑 tick 最多消费一次有效转向
- 快速输入（例如当前向右时连续 `Up -> Left`）不能在同一 tick 内造成等价 180° 反向
- 键盘、触控按钮、Swipe 必须共用同一输入规则，不复制碰撞/方向逻辑

### 4.2 动态速度

当前固定 `175ms/格` 改为显式速度函数，建议基线：

- 0–4 分：175ms
- 5–9 分：155ms
- 10–14 分：135ms
- 15–19 分：115ms
- 20–29 分：100ms
- 30+ 分：85ms

约束：

- 分数越高，step duration 只能持平或下降
- 最低不得低于 80ms
- 速度规则必须有边界测试

### 4.3 渲染性能与平滑度

当前实现每帧清空 `snakeGroup` 并重新创建 Mesh，需要改为可复用渲染对象。

要求：

- 不再每帧为每个蛇段 `new THREE.Mesh`
- 使用 Mesh 池或 `THREE.InstancedMesh`
- 保留 previous/current 逻辑状态
- 使用 `alpha = accumulator / stepMs` 对相邻逻辑状态进行视觉插值
- 碰撞仍严格基于网格逻辑，不使用插值坐标
- 保留 DPR 上限，避免高 DPR 移动设备 GPU 过载
- 无真实截图需求时关闭 `preserveDrawingBuffer`
- dispose 必须释放 renderer / geometry / material / observer / event listener

### 4.4 移动端与暂停

- 保留屏幕方向按钮
- 新增 Swipe 控制
- Swipe 需要最小距离阈值，点击不能误判
- 页面 `document.hidden` 后进入明确 paused 状态
- 返回页面后不自动继续，用户显式 Resume
- 全屏切换、屏幕旋转、resize 后控制正常

### 4.5 声音与反馈

至少提供：

- 吃食物反馈
- 分数里程碑反馈
- Game Over 反馈
- Mute / Unmute
- 静音偏好保存在 localStorage
- 尊重 `prefers-reduced-motion`
- 音频只在用户手势之后初始化

### 4.6 Analytics

避免每吃一个 food 都发 GA4 事件。

至少保留/新增：

- `game_play_start`
- `snake_first_move`
- `snake_score_milestone`
- `snake_game_over`
- `snake_retry`
- `game_fullscreen_toggle`
- `snake_audio_toggle`

Game Over 属性至少包括：

- `final_score`
- `best_score`
- `duration_ms`
- `attempt`
- `challenge_id`
- `control_type`：`keyboard | touch-button | swipe`

## 5. 版权与来源要求

Snake 3D 必须保持 Luma Original / self-hosted 状态。

版权台账至少记录：

- slug / title
- developer / rights holder
- code origin
- renderer 与许可证
- 图片素材来源
- 音频素材来源
- commercial use
- self-hosted / third-party iframe 状态
- verification date

Three.js 为第三方 MIT 技术库，不等于游戏内容来源。

## 6. 测试要求

### Vitest

必须覆盖：

- 立即反向被拒绝
- 单 tick 多次转向保护
- 速度曲线边界
- 撞墙
- 撞身体
- 尾部合法移动
- 食物不得刷在蛇身上
- 每日 challenge 确定性保持

### Playwright Desktop

真实完成：

`Play -> First Move -> Pause -> Resume -> Game Over -> Retry`

不能只断言 Canvas/DOM 存在。

### Playwright Mobile

至少验证：

- Swipe 可控制
- 触控按钮至少一种方向可控制
- hidden/visible 暂停恢复策略

## 7. 性能目标

以下为目标，不得在未测量时写成已通过：

- 正常桌面设备渲染目标：55–60 FPS
- 最低逻辑步长：不低于 80ms
- Three.js：click-to-load
- Desktop Play -> Ready：目标 < 800ms
- 中端移动设备 Play -> Ready：目标 < 1500ms
- 未 Play 时不初始化完整 3D 场景

### CI 性能采样口径

GitHub Actions 的 Linux headless 浏览器尤其是 WebKit/iPhone 仿真可能使用软件渲染，FPS 不代表真实桌面或手机 GPU 性能，因此：

- 所有 Playwright 浏览器都记录 `Play -> Ready` 与 rAF FPS 样本，作为回归诊断数据。
- CI 只对稳定的 Desktop Chromium 样本设置 `>20 FPS` 的最低烟雾门槛，用于发现严重渲染阻塞；其他浏览器只要求 rAF 能持续推进、WebGL context 未丢失。
- `55–60 FPS` 仍是正常真实设备目标，不能用 GitHub Actions headless 样本冒充真实设备达标证明。
- Play -> Ready 的真实设备目标同样需要在实际设备或等价浏览器环境复验；CI 中统一保留宽松 `<5000ms` 回归门槛防止明显加载退化。

## 8. 验收门禁

合并前至少运行：

```bash
pnpm type-check
pnpm lint
pnpm vitest run tests/luma-snake-3d.test.ts
pnpm vitest run
pnpm build
pnpm playwright test <Snake 专项>
```

若某项因执行环境无法运行，必须明确记录为 `尚未验证`，不能默认通过。

## 9. 本轮不做

- Classic Snake 2D 新页面
- 后端排行榜
- 用户账号
- 多人联网
- 大型 Mini Game SDK
- LittleJS / Phaser 引擎迁移
- 与 Snake V2 无关的站点重构

## 10. 交付物

1. 本需求文档
2. 隔离 GitHub 分支
3. 代码与测试提交
4. 验证结果
5. 若适合，创建 PR 供 CI/代码审查；不得自动合并 `main`
