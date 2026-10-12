# JLU-SPH Wiki 项目交接

更新：2026-10-12（Asia/Shanghai）。最新业务代码基线为 `4b9dc184ea01710f3d778446ed962e78c50fc5bc`，已由 00 同步到 01～08、10 全部独立 worktree，并保留各自分支和历史。本交接的同步状态更新也会提交并同步；最终基线以最新同步报告、`git rev-parse HEAD`、`git status` 为准。

## 1. 仓库与操作边界

- 主仓库 / 00：`D:\JLU—Wiki\IGEMwiki\Wiki`，分支保持 `feat/wiki-ux-redesign`。
- 接管时 HEAD：`85a0dfc1cf1fef8f8becb84dd5a3b552867e567d`；它是旧基线，不包含此前工作区成果。
- 最新统一基线的完整提交 hash、恢复 tag 和逐 worktree 同步结果记录在仓库外 `D:\JLU—Wiki\IGEMwiki\tmp\worktree-sync-2026-10-12\sync-report.json`。10 月 10 日的同步报告只保留为历史记录，不代表当前状态。
- 早于本轮的未跟踪 `JLU_WIKI_CONTROL_LEDGER.md`、`assets/human-practice/review-2026-10-03/` 原样保留，不混入本轮提交。
- 本轮没有 push、Netlify 发布或官方站部署。
- 官方仓库 `D:\JLU—Wiki\IGEMwiki\official-jlu-sph` 未动；其维护页任务仍搁置，不能继续上线。
- 保留各 worktree 的 `codex/NN-*` 分支，不 reset、clean、stash、强推或覆盖未提交成果。

## 2. 最新六项的实施结果

1. **Member 顶部铺满宽度并贴顶**：现有 `.team-hero` 在桌面和手机均为 100% 宽度，取消宽度上限、两侧留白和圆角。根据后续截图反馈，移除 `.team-page` 的顶部空隙，背景从页面顶端开始；封面内容内部仍留出固定导航的 60px 空间。当前 HTML/CSS 封面是渐变区域，没有引用封面图片；保留现有封面，没有猜测或添加图片。
2. **Member 当前导航项可见**：最新截图要求替代此前半透明方案，当前项与 ALL 筛选按钮统一为 `#6f4e37` 深棕底、`#fffaf5` 浅色字；通过局部 `--wiki-ink` 保证公共文字规则不会吞掉字色。成员 HTML、数据、照片及翻卡脚本原样保留。
3. **删除 iHP Our working principle**：移除 `.ihp-preface__aside` 及专属样式，将桌面前言由三列改为两列，手机仍为单列；原正文不变。
4. **Judging Hardware 共享内容**：导航指向 `Instrument/hardware.html?nav=judging`；公共导航识别该上下文并高亮 Judging。旧 `Judging/hardware.html` 保留，重定向时保留其他查询参数及锚点，HTML fallback 也指向同一内容。Instrument Hardware 原文未修改。
5. **Parts 目录显示修复**：旧 `.parts-toc-row` 的 28px 第一列挤压文字；公共格式显式改为 block，并将复用的展开按钮移到目录组直接子级。保留原标题、全部层级、跳转与 Parts 模块展开脚本，不重编码正文。
6. **删除返回顶部**：移除 Software `.sw-toc-top`、Model `.model-toc-top` 节点及公共格式中的对应规则，保留 `page-top` 历史锚点。

后续要求：Measurement 的 `#reference` 初始 HTML 虽无 open 属性，但实际测试发现带 `#reference` 进入时锚点脚本会自动展开。已修改页面锚点脚本及公共目录点击处理：进入、刷新和历史恢复时收起，目录/锚点只定位到 Reference，点击标题才展开；参考文献正文保持完整。
同时发现旧 Vite 预览服务返回已缓存的旧脚本，已重启同端口 5216 的主仓库服务，使当前源码生效。

同时限定公共棕色规则的作用域，让人文页面的深色封面、信息框和结尾区域保留原有对比色；普通正文继续使用棕色。后续验收修复及实际浏览器局部复验见第 7 节。

## 3. 一并保留并提交的此前成果

- Judging iHP 的 `?nav=judging` 上下文及旧 URL 查询/锚点保护。
- Navbar 按文档实际 scroll 判定下滑隐藏、上滑显示；去掉 wheel 重复判定及普通鼠标上移误显，保留顶部唤出、焦点、菜单及恢复/尺寸变化处理。
- Protocol 平滑定位和焦点，Entrepreneurship 目录内部滚动，Member 侧栏位置。
- 公共浅色目录：一级常显、二级默认折叠，鼠标/键盘/按钮可展开；手机在文档流中。
- 正文标题棕色和短下划线，隐藏装饰编号；Times New Roman，一级 22pt、二级 16pt、三级/四级 14pt、正文及图表标题 12pt（图表标题加粗），MathML 使用数学字体。
- Model Introduction 只改格式；四个问题和两个模块编号列表、无蓝色外图框、三个始终展开的黑色代码面板、紧凑米棕交替表格。原始数值、引用和代码保留。
- 按此前授权修复 GELU、LayerNorm、MRR、Hits@k 为结构化 MathML，定义依据已在此前核对 PyTorch 官方文档；未改变实验事实。
- Software Architecture 三部分重排、设备侧分工、默认折叠 Java 图像请求、温度 JSON；Validation 删除连接图及 Case 01 标签并重排图号。
- 软件透明吉祥物 `assets/software/images/device-phone-mascot-transparent.png` 保留；它是此前 image_gen 去黑底生成的 RGBA 资产，原 JPG 仍在，并非逐像素无损处理。
- Homepage 动画和场景、43 位成员及确认过的照片映射、Engineering 四模块、两代真实 Software 手册和 APK / 源码入口均保留。

## 4. 验证证据与未完成项

通过：

- 既有源码保护检查 **66/66**：包括 Model 正文、数值、代码、引用、公式结构、Homepage / Member 源码保护及全页历史 ID。
- 本轮内容检查 **48/48**：iHP 仅删除指定框、原稿段落保持、Parts 20 个目录目的地及原标题、两页返回顶部节点移除等。
- Node VM 导航逻辑检查 **23/23**：文档滚动方向、内部 wheel 不干扰、边界、交互保留、恢复/resize、共享菜单上下文，以及旧 Hardware / iHP URL 保留查询及锚点。
- 修改过的外部 JavaScript 语法和 Git 空白检查通过。
- 最终隔离 Vite 构建：**25 HTML 入口、1317 引用、0 缺失资源**。沿用既有 `build.mjs`，输出在仓库外，配置及主仓库 dist 未改。
- 后续 Measurement 修复通过独立 headless Chrome 实测 **21 项**：1440px 桌面 / 390px 手机的普通进入、带锚点进入和刷新、目录定位、点击/Enter 展开收起、展开后刷新及历史返回，无 JavaScript 页面错误。证据在 `measurement-reference-browser.json` 和两个 `measurement-reference-*-closed.png`；该局部检查不代表全站验收完成。

证据目录：`D:\JLU—Wiki\IGEMwiki\tmp\handoff-2026-10-10\`，含 `before/` 接管现场备份、`initial-status.txt`、`content-checks.json`、`navigation-checks.json`、验证脚本和 `sync-report.json`。
既有检查及最终构建报告：`D:\JLU—Wiki\IGEMwiki\tmp\format-revision-2026-10-09\source-audit.json`、`build-report.json`。

**仍未完成：Navbar 和全站桌面/手机视觉验收。** 此前按 computer-use 技能尝试用户 Windows 浏览器验收，工具因不能可靠确认当前 URL 而终止；未绕过安全限制。后续局部测试使用独立 headless Chrome 访问已知本地项目 URL。Measurement 的实测与 Node VM / 源码检查不能替代全站、触摸、键盘菜单、视觉对比度和控制台验收。不要宣称最终全站验收通过。

真实设备演示视频及部分原始验证数据仍缺失，不得虚构。

## 5. Worktree 检查和同步

2026-10-12 同步前九个开发 worktree 均无未提交修改。00 已为每个原 HEAD 建立独立恢复 tag，再进行正常合并或快进更新；未执行 reset、clean、stash 或强推。

01 / 02 / 03 / 04 / 08 的冲突来自此前已 cherry-pick 整合的旧成果及 00 后续修改；00 核对提交映射与预合并后，仅对已审查的冲突文件采用最新集成版本。两代 PDF 保留最新 Pages 兼容压缩版，成员确认信息、首页新叙事、科研与导航修复均保留。旧分支历史和恢复点完整保留。

| Worktree | 分支 | 最新同步结果 |
| --- | --- | --- |
| 01-homepage | codex/01-homepage | 已正常合并，历史保留，工作区干净 |
| 02-team | codex/02-team | 已正常合并，历史保留，工作区干净 |
| 03-research | codex/03-research | 已正常合并，历史保留，工作区干净 |
| 04-ihp | codex/04-ihp | 已正常合并，历史保留，工作区干净 |
| 05-education | codex/05-education | 已快进更新，工作区干净 |
| 06-inclusivity | codex/06-inclusivity | 已快进更新，工作区干净 |
| 07-entrepreneurship | codex/07-entrepreneurship | 已快进更新，工作区干净 |
| 08-instrument | codex/08-instrument | 已正常合并，历史保留，工作区干净 |
| 10-deploy | codex/10-deploy | 已快进更新，工作区干净；未部署 |

每个 worktree 的完整跟踪文件树均与最新主控基线一致，均包含主控基线和各自同步前的 HEAD；因为保留了合并历史，HEAD 可以不同。所有对话现在可以从最新基线继续开发：先重读本文件，保持自己的目录和分支，仅修改获准模块文件；公共层和跨模块整合交 00，不自行合并其他 Agent。

最新业务基线的隔离 Vite 构建通过：25 个 HTML 入口、1427 个引用、0 缺失资源。同步本身不修改页面或设计，也不代表补做了此前未完成的全站视觉验收。本轮没有 push、部署或修改官方仓库。

## 6. 架构、关键文件与后续入口

- Vite 8 原生 HTML / CSS / JavaScript，多页构建；`vite.config.js` 自动收集 HTML，现有 `dist/client`、`dist/server`、`dist/.openai` 包装设施不重构。
- 公共入口 `样式/main.js`；导航 `样式/navigation.js` / `navigation.css`；格式 `样式/site-format.css` / `site-format.js`；字号 `typography.css`；布局 `full-width-layout.css`。
- Member：`Team/member.html`、`Team/member-data.js`、`样式/member.css` / `member.js`。
- Parts：`Wet-lab/part.html`、`样式/parts-page.css` / `parts-page.js`；公共目录脚本拥有增强后的展开按钮，页面脚本继续处理 Parts 内容模块。
- Engineering 控制器在 `Project/engineering.html` 的 `data-engineering-controller` 内嵌脚本；模块名称必须可见，切换不自动展开全部目录。
- 人文页面部分不加载 style.css，公共格式须继续从 main.js 接入。
- 保留历史拼写 `Eagagement/`、`inclusity.html`、`protocal.html`，不直接重命名。
- 素材目录含中文和空格，使用 LiteralPath / 正确引号。
- 不修改 Navbar 信息架构、Loading、Footer、光标、Homepage 动画、成员数据、科研事实，除非新需求明确涉及。
- 不重跑旧页面生成器或 `implement_pages.py`，避免恢复旧结构并损坏新成果。
- 未完成的下一步为浏览器实际验收和五个冲突 worktree 的安全同步；最新六项不需重新实施。
- 本地预览为 `http://127.0.0.1:5216/`，后续已用独立 headless Chrome 确认主工作区服务及第 7 节所列修正。
- 原 Netlify 项目 `https://prismatic-sfogliatella-cf9000.netlify.app/`；官方 GitLab `https://gitlab.igem.org/2026/jlu-sph`；正式站 `https://2026.igem.wiki/jlu-sph`，均未发布。
- 官方资源继续遵守 iGEM uploads / static.igem.wiki / Video Universe 限制，不引入外部 CDN、字体或运行依赖。

需求来源仍在本机：`C:\Users\UserTech\Desktop\model页面优化建议.docx`、`二改software.docx`、`Software_System_Architecture_EN.docx`、`Software页面_App与硬件程序补充建议 (2).docx`，以及 `10.5最终版wiki湿实验\10.5最终版wiki湿实验\配色.docx`。Model 原稿映射在 `assets/model/review/model-source-manifest.json`。
此前原稿抽取在 `D:\JLU—Wiki\IGEMwiki\tmp\requirements-2026-10-09\`；旧导航验收记录在 `tmp\navigation-revision-2026-10-09\REPORT.md`，不能当成本轮最终浏览器验收。

## 7. 验收报告修复（2026-10-10，c2471d2 后续）

依据用户提供的 `D:\JLU—Wiki\acceptance\2026-10-10_c2471d2\本轮改动验收报告.md`，原报告和证据未修改。

- **R02 已修复**：从公共 `样式/main.js` 导入既有 `typography.css`，补齐 iHP / Inclusivity / Education / Entrepreneurship 的图注 12pt 加粗、三级/四级标题 14pt 加粗规则；没有重写页面正文或重新实现已经正常的目录和图库。
- **R03 已修复**：Software 颜色例外只保留黑底 `pre`；Education 例外只保留反馈区域的深底标题和控制区。白底协议链接、五张浅底反馈卡标题及正文采用棕色，黑底代码和深底标题保留浅色。
- **R05 已修复**：旧 `Judging/model.html` 使用 `location.replace` 指向 `Instrument/model.html`，保留查询参数和锚点，附 canonical / 无脚本 fallback；后退无循环，Judging 导航仍不含 Model。
- 用户确认通过的 Model 原图底色及已移除的外围蓝框保持；三个黑底代码区始终展开，Software 新增代码默认收起。
- 开发版及新构建版分别通过 **59 项**实际 headless Chrome 检查（1440×900 / 390×844），覆盖四页排版、Collaboration 保护、Education 五张卡片和图库、Software 链接和代码开关、Model 图框/代码/目录以及旧 URL 跳转。两版无 JavaScript 页面错误、所检查页面无整页横向溢出。Measurement **21 项**另行回归通过；既有源码保护 **66 项**通过。
- 新隔离构建：**25 HTML 入口、1313 引用、0 缺失资源**，输出 `D:\JLU—Wiki\IGEMwiki\tmp\format-revision-2026-10-09\build-1791609780445`。主仓库 dist 未覆盖。
- 复验记录及截图：`D:\JLU—Wiki\acceptance\2026-10-10_c2471d2-followup\复验记录.md`。这次局部修复不代表全站或公网最终验收通过。
- **R01 待发布**：公网旧版问题不能通过本地改源码关闭；当前仍未 push / 发布 / 官方站部署，待用户明确授权发布目标后使用已验证产物，记录部署版本并复验公网。
- **R04 / R06 待真实材料**：Hardware / Contribution 的占位内容是现存缺口，没有找到可明确映射到这两页的确认稿；不猜测硬件实验、项目贡献或证据，不用模糊链接替代真实内容。

最新提交及九个 worktree 的再预检 / 安全同步结果继续见 `sync-report.json`；有冲突或未提交修改者跳过，保留分支和现场。

## 8. Cloudflare 临时公网预览授权及固定发布入口

用户已明确授权通过 Cloudflare Pages Direct Upload / Wrangler 发布团队临时预览，这项新授权覆盖前文对此临时预览的未发布限制；仍禁止 git push / GitHub 或 GitLab 上传，正式 iGEM 站和原 Netlify 项目不在本次发布范围。

- 固定 Pages 项目 `jlu-igem-wiki-preview` 已创建，Wrangler 已完成浏览器 OAuth；固定地址 `https://jlu-igem-wiki-preview.pages.dev/`，以后更新均使用这个项目和 `--branch main`。
- 始终先 `npm run build` 成功后上传 `dist/client`；兼容修改仅为原路径资源纳入构建、canonical 避免被转换为原始 HTML 素材、两份 PDF 无损压缩到 Pages 限制以内。网站正文 / 成员数据 / 图像内容均未改变。
- 发布脚本 `scripts/publish-pages.ps1` 和说明 `DEPLOYMENT_CLOUDFLARE.md`；公网部署及 homepage / Member / 图片 / 跳转实测证据保存至 `D:\JLU—Wiki\IGEMwiki\tmp\cloudflare-pages-2026-10-10\`，以其中的实际部署记录为准。
- 按用户追加的官方 Agent Setup 安装 Cloudflare skills 并登记 / 授权 Codex Cloudflare MCP；凭据留在用户配置，未进入仓库或 dist。MCP 在重启 Codex 后加载，不阻塞当前 Wrangler 发布。

## 9. 页面优化 10.10（用户确认后实施）

- 用户已授权开始修改，并明确第二项仅删除顶部横幅标题下方的横线；正文章节下划线保留。
- 公共 `typography.css` 为子页面横幅 h1 单独设置 `clamp(36px, 5vw, 72px)`，移除其 `::after` 横线；正文标题和图注字号不变，Homepage 动画不变。
- Engineering 全部 29 个 node 的 Design / Build / Test / Learn & Outcome 共 116 个标签改为深棕 `#432b1c`、加粗，并使用用户提供的四张原始 PNG。阶段图标映射为 Design 右上、Build 右下、Test 左下、Learn 左上，匹配文档示意；仅 CSS 显示为小图标，原始文件未修改。
- 根据用户明确确认，删除 Wet Lab Engineering 的 `engineering-figure-2` 六宫格曲线图及其图注；上方 RSV Candidate 2 表格、其他图片、所有实验正文和模块切换脚本保留。
- **高清总览图已补齐（2026-10-12）**：用户提供的 `e67ea3baa57a58f3ffa06dd1e6dbafe5.png` 是四模块总览图，对应正文顶部 `#engineering-overview`，并非横幅插画。已以原始 2752×1536 PNG 替换原 1429×797 JPEG，页面显示和“查看原图”链接均指向 `assets/engineering/overview-2026-10-12.png`；原图片保留，横幅插画不变。用户提供的图中文字原样保留，不据此改写实验正文。
- `npm run build` 成功；构建产物 25 HTML 入口、1427 引用、0 缺失资源、0 超限文件。桌面 1440×900 / 手机 390×844 在新构建版完成 184 项浏览器检查：18 个页面横幅字号 / 横线 / 标题边界、四模块图标与文字颜色、表格保护、模块切换和键盘激活、Measurement 引用默认收起，未发现 JavaScript 错误或失败资源。
- 本轮修改及发布复验证据存于仓库外 `D:\JLU—Wiki\IGEMwiki\tmp\page-optimization-2026-10-10\`；继续使用第 8 节固定 Cloudflare 项目，不执行 git push。
