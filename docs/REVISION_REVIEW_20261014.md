# 2026-10-14 页面修改与发布验收

用户本人明确授权修改后更新 GitHub 和现有 Cloudflare 站，覆盖 10 月 13 日的本地预览限制。本轮从 `ddc60d6` 继续，完整保留此前已整合的首页、科研、仪器、成员、公共排版与五张新封面。其他 worktree 的新增成果和未提交内容不纳入本次指定范围，不覆盖或批量同步。

## 本轮行为

- Team：Bo Pang 说明为 `Judge for iGEM Competition`。Haoyang Liu 独立 quote 字段原已为空，只去掉简介开头的误标 `Quote：`，保留简介。标题为 `Principal Investigators` / `Secondary Principal Investigators`，身份与分组数据不改。
- Team：照片条桌面从 132px 放大为 176–232px、手机从 112px 放大为 144px；教师 / 顾问三列区从最大 960px 放大到 1260px，资料区从 880px 到 1120px；局部文字、按钮、标题相应放大，保留 Times 和原棕色设计。参考页面在 1440px 下人物照片约 189–223px、标题 50px，仅参考显示尺度。
- Team：筛选、前后箭头、返回按钮具备悬停、按下、焦点与选中反馈。Advisors 恢复 3D 翻页；背面及贡献展开随内容增高，保留完整原文，不截断。返回 / Escape 回到照片焦点，非当前页为 inert，尊重减少动画设置。
- Measurement：Table 2 使用 Model 的 `RSV candidate screening and validation` 表，十组、三十条序列及长度完全一致，标题同步为 `RSV top 10 candidate combinations`。去掉旧表不再对应的质量分数，保留 `data-source-block=45` 和目录目的地。两处表格的 Candidate 行增加三列合并，不改序列或实验数据。
- Homepage：七个后续场景及长图末端使用共同接缝色渐变，两侧衔接约 12vh；独立装饰层不接收点击、不替换场景专属背景，PCR、人物、卡片和章节进度逻辑保留。
- Model：所有 a/b/c/d 等公式标签紧邻对应 MathML；超宽公式仍在自身区域横向滚动，公式内容完整保留。
- Model：三个黑色伪代码区桌面缩为正文 90%、上限 780px，手机宽度自适应，文字从 15pt 调整为 13pt，始终展开。柔和阴影与悬停浮动在整个面板上应用，圆角不漏出子面板背景。
- Model：七张正文图有贴合圆角图框及浮动阴影。四张机制图用 CSS 窗口裁去外围白色画布，保留原图、原底色、图中文字及原图链接。内图固定在图框内，与图框一起浮动，避免公共图片悬停动画露出白缝。结果图正文尺寸继续对齐 Measurement 单结果图。

## 实测证据

证据位于仓库外 `D:/JLU—Wiki/IGEMwiki/tmp/revision-20261014/`，不上传缓存或本地截图。

1. 构建及资源检查：662 文件、25 HTML 入口、1625 个引用；0 缺失、0 超限、0 不安全资源，最大文件 22,559,008 字节。
2. 本轮浏览器：1440 / 390 / 320px 共 224 项通过，全部九位 Advisors 的完整贡献可阅读、无裁切，公式标签位置、图框、三段代码、两张相同的候选表和 Reference 初始收起通过，无页面 JavaScript 错误。
3. 25 入口：1440 / 320px 266 项公共回归通过，包括编号布局、完整文字、导航无下划线、资源、视口、首页直体和视频初始等待，以及 Parts / Model 与 Measurement 图尺寸对齐。
4. 首页原交互验收：1920 / 3840 / 390px 的 PCR 鼠标和键盘循环、卡片选择 / 翻转 / 减少动画、设计图和流程场景检查通过，资源与控制台无错误。
5. 普通动画设置下悬停检查：Model 内图固定、外框与代码面板整体浮动；Team 筛选按钮悬停、选中与浅色文字通过。
6. 来源保护：43 人、186 项贡献任务、原身份缺口与肖像完整保留；七张科研原图哈希、MathML、伪代码、Model 段落保持；Measurement 除 Table 2 与对应表题外全文一致。首页文字、公共字体、编号组件及原视频控制器未改。

## 发布流程

按 `CONTRIBUTING.md` 的所有者本人授权例外，检查通过后创建并直接验收 PR，等待 `wiki-build` 通过再合并。使用干净 main 的单独发布 worktree，执行 `scripts/publish-pages.ps1 -Production`；只 Direct Upload `dist/client` 到原项目。固定地址保持 `https://jlu-igem-wiki-preview.pages.dev/`。公开页上线后重新核验首页、Team、Measurement、Model、图片及历史地址跳转。

本次不部署官方 iGEM 站，不打开 Pages 自动发布开关；既有占位内容和缺失真实视频 / 验证数据不凭空补充。回退使用 Revert 对应 PR、重新构建并发布，不覆盖未提交工作。
