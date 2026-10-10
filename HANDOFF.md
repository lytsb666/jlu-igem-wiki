# JLU-SPH Wiki 项目交接

更新：2026-10-10（Asia/Shanghai）。00 已接管并完成最新六项的代码修改，保留并一并提交此前未提交的公共格式、导航、Model 和 Software 成果。实际基线以 `git rev-parse HEAD`、`git status` 为准。

## 1. 仓库与操作边界

- 主仓库 / 00：`D:\JLU—Wiki\IGEMwiki\Wiki`，分支保持 `feat/wiki-ux-redesign`。
- 接管时 HEAD：`85a0dfc1cf1fef8f8becb84dd5a3b552867e567d`；它是旧基线，不包含此前工作区成果。
- 本轮新基线的完整提交 hash 和逐 worktree 同步结果记录在仓库外 `D:\JLU—Wiki\IGEMwiki\tmp\handoff-2026-10-10\sync-report.json`。
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

接管检查及最终同步时九个开发 worktree 均无未提交修改。05 / 06 / 07 / 10 已快进包含新基线，分支名保持不变；其余五个的预合并有冲突，未启动实际合并、未修改文件。完整 hash 和预检输出见 `sync-report.json`。

| Worktree | 分支 | 本轮安全同步策略 |
| --- | --- | --- |
| 01-homepage | codex/01-homepage | 预合并有 Homepage HTML / 动画脚本 / CSS 冲突，保留现场，不同步 |
| 02-team | codex/02-team | 预合并有成员数据、照片映射、HTML / CSS / 脚本冲突，保留现场，不同步 |
| 03-research | codex/03-research | 预合并 Engineering 冲突，保留现场，不同步 |
| 04-ihp | codex/04-ihp | 与旧 HEAD 预合并一致，但新基线在 Collaboration 目录包装处冲突，保留现场，不同步 |
| 05-education | codex/05-education | 已快进新基线，工作区干净 |
| 06-inclusivity | codex/06-inclusivity | 已快进新基线，工作区干净 |
| 07-entrepreneurship | codex/07-entrepreneurship | 已快进新基线，工作区干净 |
| 08-instrument | codex/08-instrument | 预合并 Model / Software CSS add/add 冲突，保留现场，不同步 |
| 10-deploy | codex/10-deploy | 已快进新基线，工作区干净；未部署 |

这些历史分叉包括被 cherry-pick 的等效提交，不能把所有独有提交当作尚未集成。01 / 02 / 03 / 04 / 08 暂不能按新公共层基线继续开发；后续需明确处理冲突，保护 00 已集成且更新的内容。

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
