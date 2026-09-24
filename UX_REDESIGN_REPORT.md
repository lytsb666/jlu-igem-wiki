# JLU-SPH iGEM 2026 Wiki UX 改造验收报告

验收日期：2026-09-24

## 1. 修改总结

本轮在不改正文内容、不重命名历史 URL、不升级依赖的前提下，完成了顶部导航召回、hover/focus/active 反馈、分类菜单交互、键盘操作、导航区域 cursor 适配，以及 Homepage 的滚动引导和低干扰进度提示。随后统一了 25 个页面的导航结构与显示名称，并修正了 Instrument Hardware/Software 的明显页面标题错误。

## 2. 修改文件列表

- `样式/navigation.js`
- `样式/navigation.css`
- `样式/cursor-overlay.js`
- `样式/cursor.css`
- `homepage/index.html`
- `样式/home-story.js`
- `样式/style.css`
- `Instrument/hardware.html`
- `Instrument/software.html`
- `UX_REDESIGN_REPORT.md`

## 3. 需求实现情况

### Navbar 可见性与反馈

- 保留“向下滚动隐藏、向上滚动显示”。
- 桌面端在 Navbar 隐藏时，累计向上移动约 40px 可召回；鼠标向下移动会清零累计值。
- 鼠标进入视口顶部 72px 区域时立即召回 Navbar。
- Navbar 获得 hover/focus、dropdown 打开或鼠标在菜单内操作时不会被滚动逻辑隐藏。
- 一级、二级菜单增加清晰且克制的 hover、focus-visible、active 样式；active 与 hover 可区分。
- 导航区域使用系统 pointer，并隐藏网站的大型自定义 cursor；离开导航后恢复原 cursor。
- 公共脚本按 `location.pathname` 自动设置一级与二级 active，兼容现有 `Eagagement`、`Wet-lab`、`inclusity.html`、`protocal.html` 路径。
- Homepage 内点击 Home 不刷新，改为平滑滚动回顶部；其他页面仍正常导航，浏览器前进/后退正常。

### 一级/二级菜单逻辑

- Home 之外的一级菜单统一为分类触发器，不再直接跳转页面。
- 桌面 hover 与 click 均可展开；一级菜单横向切换时关闭上一菜单。
- 离开菜单有 200ms 关闭延迟，降低小间隙导致的闪烁。
- Enter、Space 展开，ArrowDown 进入第一个二级链接，Esc 关闭并把焦点交还一级菜单。
- 移动端点击一级菜单展开二级菜单，二级链接负责跳转。
- Judging 同样只负责展开，没有新增 landing page。

### Homepage

- 增加 `SCROLL TO EXPLORE` 提示，初次进入可见，开始滚动后淡出，回到顶部再次出现。
- 使用既有 story scroll 距离计算低干扰百分比进度，没有重写原动画。
- 提示与进度放在 story stage 的独立层，避免被大尺寸画布遮挡。
- Homepage 动画进行中仍可通过滚动、鼠标向上和顶部热区召回 Navbar；dropdown 打开时 Navbar 保持可用。

### 全站一致性

- 公共导航 schema 统一 25 个页面的一级顺序、二级名称与 URL。
- 统一显示为 `Parts`、`Results`，保留实际文件名 `part.html`、`result.html`。
- 修正 `Instrument/hardware.html` 与 `Instrument/software.html` 的 `<title>`。
- 未更改正文内容与历史拼写路径。

## 4. Git commits

- `d12906d feat(nav): improve navbar visibility and active states`
- `aa4df9e feat(nav): separate category menus from page navigation`
- `a796d20 feat(home): improve homepage navigation guidance`
- `c00cbe7 fix(nav): normalize navigation labels and page titles`
- `docs: add UX redesign validation report`（本报告提交）

每组逻辑改动均独立提交；`main` 未修改。

## 5. 当前 branch

`feat/wiki-ux-redesign`

## 6. Baseline tag

`baseline-before-ux-redesign`，指向 `4b1b750`。

## 7. 新 tag

`ux-redesign-nav-v1`，在最终 build、页面测试和报告提交完成后创建；仅保存在本地，未 push。

## 8. Build 结果

- 命令：`node .\node_modules\vite\bin\vite.js build --configLoader runner`
- 结果：通过。
- Vite：8.1.3。
- 转换模块：65。
- Build 时间：约 0.7 秒。
- 未重新安装、升级或降级依赖。

## 9. 页面与交互测试结果

人工/浏览器自动化覆盖 Homepage、Project（Description/Design/Engineering）、Engagement（iHP/Education）、Wetlab（Protocol/Notebook/Results）、Instrument（Hardware/Software/Model）、Team Member 和 Judging 页面。

以下行为通过：

- 滚动向下隐藏、向上显示 Navbar。
- 明显向上移动鼠标与顶部 72px 热区召回 Navbar。
- 菜单打开或操作 dropdown 时 Navbar 不消失。
- 一级 hover/click 展开、横向切换、二级链接跳转。
- 一级和二级 active 正确。
- Homepage Home 点击不刷新并回到顶部；其他页面 Home 正常跳转，前进/后退正常。
- Homepage 引导与进度提示正常。
- 导航区域 custom cursor 不遮挡文字。
- Tab、Enter、Space、ArrowDown、Esc 基本键盘操作正常。
- 390×844 移动视口下一级点击展开、二级 Results 跳转正常；测试后已恢复默认视口。
- 25 个页面的运行时导航 schema 一致，一级 active 为 25/25，非首页二级 active 为 23/23。

## 10. 25 个 URL 自动检查

对根页、Homepage、5 个 Project、5 个 Engagement、5 个 Wetlab、3 个 Instrument、2 个 Team、3 个 Judging URL 执行 HTTP 检查：`25/25` 返回 HTTP 200。

另外检查了 25 个 HTML、17 个 CSS 中的本地 `href`、`src` 和 `url()` 引用，共解析 270 个候选本地路径；按 Vite 的 `public/` 根目录规则解析后，缺失引用为 0。

14 个项目 JavaScript 文件全部通过 `node --check`。

## 11. Console error

代表页面及全量导航复核后，浏览器 console 中新增 warning/error：0。

## 12. 仍未解决的问题

本轮范围内没有阻塞问题。开发服务器必须保持运行，`127.0.0.1:5173` 才能访问；关闭终端或服务后浏览器会显示 `ERR_CONNECTION_REFUSED`。

## 13. 发现但没有修改的问题

- 历史目录/文件拼写 `Eagagement`、`protocal.html`、`inclusity.html` 仍保留，避免破坏现有 URL。
- Collaboration、Contribution、Team、部分 Judging 等页面仍是已有占位正文；本轮明确不修改正文。
- 页面 title 的品牌后缀仍存在 `JLU-SPH`、`JLU-SPH Wiki`、`JLU-SPH iGEM 2026` 三种历史格式；除 Hardware/Software 的明显复制错误外未扩大修改。
- 若干原始 PNG/JPG 资源较大，最终构建中最大单项约 7 MB；未删除、压缩或迁移原始素材。
- 仓库当前没有 remote；按要求未擅自配置。

## 14. 下一轮建议

- 单独规划历史 URL 拼写迁移，并为旧路径保留重定向兼容。
- 在正文定稿后补全占位页，再统一全站 title/metadata 品牌格式。
- 单独做图片格式、尺寸和懒加载优化，不与交互修改混在同一批提交。
- 用真实触摸设备复核窄屏导航的视觉密度；当前功能可用，但小屏横向空间仍较紧。

## 15. 如何安全回退

仅查看改造前版本，不改变任何分支：

```powershell
git switch --detach baseline-before-ux-redesign
```

查看后回到开发分支：

```powershell
git switch feat/wiki-ux-redesign
```

推荐的可追溯回退方式是新增 revert commit，保留全部历史：

```powershell
git switch feat/wiki-ux-redesign
git branch backup/wiki-ux-redesign-v1
git revert --no-commit baseline-before-ux-redesign..feat/wiki-ux-redesign
git commit -m "revert: return to pre UX redesign baseline"
```

上面的范围会回退 baseline 之后的全部提交，包括 `.gitignore` 加固提交。若只需撤销 UX 功能而保留 `2006131`，可使用：

```powershell
git switch feat/wiki-ux-redesign
git branch backup/wiki-ux-redesign-v1
git revert --no-commit d12906d^..c00cbe7
git commit -m "revert: remove navbar and homepage UX redesign"
```

只有在确认该开发分支上的后续提交全部可丢弃、且已经建立 backup branch 后，才考虑重写分支指针：

```powershell
git switch feat/wiki-ux-redesign
git branch backup/wiki-ux-redesign-v1
git reset --hard baseline-before-ux-redesign
```

本轮没有实际执行任何 reset、rebase、force push、branch/tag 删除或 remote 操作。
