# R04B Collaboration 第一版交接

日期：2026-10-04（Asia/Shanghai）
负责人：04；公共区块审核与跨模块整合：00。
工作目录：`D:\JLU—Wiki\IGEMwiki\worktrees\04-ihp`
分支：`codex/04-ihp`；接手基线：`2e32255`。
交付提交的 hash 见本轮最终交接消息及 Git 记录。

## 接手状态与交付范围

接手时 `Eagagement/collaboration.html` 已修改，`样式/collaboration.css`、`样式/collaboration.js` 和 16 张活动原图未跟踪，均为 00 保存的初稿。先审查现有正文、四部分结构及交互，再在这些文件上完善；没有重写或覆盖初稿。

本轮仅实施任务单 R04B。未修改 R04A iHP、其他页面、公共样式、Navbar、Loading、Footer、光标、共享模板、依赖声明、锁文件或部署配置。未切换分支，未合并其他 Agent，未修改主仓库，未上线。

可预览入口：<http://127.0.0.1:5215/Eagagement/collaboration.html>。这是 00 已运行的服务，本轮没有停止或重启它。验收另使用本 worktree 生成的生产构建与临时本地预览；临时验收服务在交付前关闭。

## 页面结果

- 保留 Overview 与四部分九项活动：US–China、CCiC/APIc、BioAI/干实验、ZJUT、两本手册、SBti、游戏、融合徒步。
- 四项章节导航现位于桌面正文左侧并随滚动固定；900px 及以下保留顶部横向导航，正文占满宽度。
- 在页面专用 CSS 中明确封面图片高度，覆盖 HTML `height="1600"` 带来的固定高度。1280×720 下封面约 601px，CTA 底部约 621px，标题与按钮都在首屏；390×844 下封面约 619px。
- 保持既有米棕背景及公共字号，完善卡片间距、长标题换行、正文标签和 ZJUT 分栏照片墙。保留 whiteboard co-creation 的引用强调。
- 四组图集分开：CCiC 4 张、APIc 2 张、干实验 5 张、徒步 2 张；ZJUT 照片墙 3 张。没有自动轮播。图集支持按钮、方向键、Home/End 与横向滚动，首尾按钮按实际位置禁用；照片编号与末张状态一致。
- 五项知识主题使用 SVG 连线及滚动高亮。桌面横向、手机纵向；保留可读的有序列表。高亮累积至已到达的主题，支持直接滚动至末项。
- 三项社区活动均可用原生 details/summary 展开。SBti 与游戏只刊出原稿中不涉及待确认研究结论的活动文字，入口/资源仍显示真实的待补状态。
- 页内锚点为固定目录预留停靠空间，点击后移交焦点；直接链接可展开活动 details，浏览器返回可恢复对应位置。返回顶部定位整个封面。
- 16 张图均可放大，并显示与原图一致的 alt 与图注；Esc、关闭按钮及原有背景关闭处理保留，关闭后焦点返回原照片。

## 资料与图像映射

正文和原图来源：`C:\Users\UserTech\Desktop\collaboration\collaboration.docx`。本轮只读此文件，没有改动。SHA-256：`b294b6608eee1f7ae6ffd52696f1cc8e9947183dc72b3a84ec843c293512d531`。

任务范围依据：`D:\JLU—Wiki\IGEMwiki\worktrees_task-briefs\2026-10-04\04-engagement.md` 中 R04B，结合用户本轮要求。该任务单旧的现场 HEAD 描述没有替代开工时实际核对的 `2e32255`。

16 张原图均与 Word 内图片 SHA-256 一致。没有压缩、裁切或改动原图，徒步照片的原有遮挡保留。完整文件名、来源、字节数及哈希见 [image-source-map.csv](../image-source-map.csv)。

| 原图顺序 | 来源 | 页面文件/图组 |
|---|---|---|
| 1 | image1.jpeg | ccic-auditorium.jpg / CCiC |
| 2 | image2.jpeg | ccic-teams.jpg / CCiC |
| 3 | image3.jpeg | ccic-exchange.jpg / CCiC |
| 4 | image4.jpeg | ccic-presentation.jpg / CCiC |
| 5 | image5.jpeg | apic-group.jpg / APIc |
| 6 | image6.jpeg | apic-poster.jpg / APIc |
| 7 | image7.jpeg | bioai-meeting.jpg / 干实验 |
| 8 | image8.png | bioai-platform.png / 原有软件截图 |
| 9 | image9.jpeg | drylab-course.jpg / 原有课程表 |
| 10 | image10.jpeg | drylab-workshop.jpg / 干实验 |
| 11 | image11.jpeg | protein-visualization.jpg / 干实验 |
| 12 | image12.jpeg | zjut-dialogue.jpg / ZJUT |
| 13 | image13.jpeg | zjut-whiteboard.jpg / ZJUT |
| 14 | image14.jpeg | zjut-poster.jpg / ZJUT |
| 15 | image15.jpeg | inclusion-hike-group.jpg / 融合徒步 |
| 16 | image16.jpeg | inclusion-hike-support.jpg / 融合徒步 |

全部 figcaption、alt 与放大弹窗图注一致。没有新增代码前后对比、人物身份、公司名或未提供的活动照片。

## 验收结果

| 检查 | 结果 |
|---|---|
| JavaScript 语法、Git 空白检查 | 通过 |
| 本 worktree 生产构建 | Vite 8.1.3 构建通过，锁文件及配置未改 |
| 页面 HTTP | 生产预览返回 200 |
| 生产图片 | 封面 + 16 张活动图片全部返回 200，17/17 与源码资源字节一致 |
| 生产 CSS/JS/图标资源 | 8/8 返回 200 |
| 静态结构 | 28 个 ID 无重复，6 个页内锚点有效，本地资源存在；九项活动与图片顺序核对通过 |
| 桌面 1280×720 | 首屏标题/CTA 可见，四图集首尾与编号、分栏照片墙、横向知识链及生产弹窗通过 |
| 手机 390×844 | 正文无横向溢出，四图集按钮与键盘翻页、纵向知识链、社区展开通过 |
| 窄屏 320×740 | clientWidth 与 scrollWidth 均 305px（其余为浏览器滚动条）；封面、正文卡片、章节标题无越界 |
| 首屏 CTA 与四部分锚点 | URL/focus/目录追踪正常；左侧导航更新后，桌面章节停靠约 100px，手机约 160px |
| 直接链接 | #sbti 与生产 #game 可展开正文；#game 顶部约 160px；浏览器返回 #knowledge 正常 |
| 三项社区活动 | SBti 点击展开、游戏键盘展开、徒步键盘收起/再展开均通过 |
| 照片弹窗 | 16/16 图片、alt、图注对应；Esc 关闭及焦点返回通过；生产版另验证关闭按钮 |
| reduced motion | 已检查本页 JS 分支及 CSS：锚点/图集可立即滚动、知识链取消过渡；未模拟浏览器系统偏好 |
| 缺失附件/入口 | 没有 download 控件、假 PDF、假试玩、死链接或外部运行时依赖 |
| 浏览器控制台 | 验收记录中 error/warn 为零 |

详细浏览器状态：[browser-checks.json](browser-checks.json)。生产资源与哈希：[production-assets.json](production-assets.json)。记录中的临时生产预览端口仅用于本地验收。

构建依赖按现有锁文件准备在本 worktree 的忽略目录 `node_modules/`；准备工具与缓存位于 `tmp/collaboration-qa/`。未借用或写入主仓库的依赖目录，没有更改 package.json/package-lock.json。

## 首版截图（266ac11）

- [桌面首屏](desktop-1280.jpg)
- [手机 390px 首屏](mobile-390.jpg)
- [ZJUT 分栏与照片墙](desktop-zjut.jpg)
- [桌面知识链](desktop-knowledge.jpg)
- [手机社区展开](mobile-community.jpg)

## 左侧导航更新

用户截图后续要求：将四项页内导航移到左侧。本次在 `266ac11` 基础上修改三个 Collaboration 页面文件；正文、原图与公共区块保留。

- 桌面大于 900px：左侧 200–240px 导航栏与右侧正文构成两列，导航固定在视口顶部 84px；1024px 时 ZJUT 与手册卡片使用单列。
- 900px 及以下：导航保留顶部横向布局；正文全宽。
- 章节追踪按正文的 scroll-margin 计算，适配左侧导航；锚点、URL 与键盘焦点仍有效。
- 1280px 下四项导航的 Enter 跳转与高亮全部通过，导航滚动位置始终为 84px；1024px 两栏无重叠；390px 页面无横向溢出，直接链接、点击与浏览器返回通过。
- JavaScript 语法、生产构建及 Git 空白检查通过。公共 Navbar/Loading/Footer 与部署配置未修改。

最新截图：[左侧导航桌面版](left-navigation-desktop.jpg)、[手机导航](left-navigation-mobile.jpg)。验收状态：[left-navigation-checks.json](left-navigation-checks.json)。此前的 browser-checks.json 记录首版交互验收；最新导航位置以本节及新记录为准。

## 待补事项与公共接入交给 00

1. 两本手册 PDF 尚未提供，继续标明 Handbook in progress；未伪装出版或制作下载入口。
2. SBti 入口、源码及支持材料尚未提供；没有外链或内嵌交互页面。
3. 清华游戏代码与截图尚未提供；没有试玩按钮或伪造游戏截图。
4. US–China 路演视频截图及官方海报尚未提供；页面只有如实的待补提示。
5. 原稿中 biosafety lock、kill switch、工程菌外用、灭活版本及其研发反馈口径仍待用户确认。本轮继续不发布相关句子为本队成果，未自行重写研究事实。原句留在来源 Word，页面没有制作批注。
6. Navbar/Footer 的页内标记沿用 00 保存的初稿，本轮未调整它们；Loading/光标/导航继续由公共 main.js 提供。collaboration.js 只导入一次 main.js，HTML 只有一个页面模块入口；没有再加载 placeholder-page.js。请 00 在整合时审核这一公共接入方式及全站目录方案。
7. 当前公共 Navbar 在手机端为横向滚动、桌面滚动时自动隐藏，均沿用公共行为；没有在 Collaboration 专用样式中覆盖它们。

线程查询工具本轮仍返回 `Invalid app tool request`，没有自动发送消息给 00。本文件与最终回复提供完整交接内容，不代表已经整合或上线。

## 交付文件清单

页面文件：`Eagagement/collaboration.html`、`样式/collaboration.css`、`样式/collaboration.js`。
素材目录：`assets/collaboration/2026-10-04/` 中 16 张原图和 `image-source-map.csv`。
专用审查目录：本 README、7 张截图、`browser-checks.json`、`production-assets.json`、`left-navigation-checks.json`。

16 张图片及文件名见上表。全部交付文件位于 R04B 允许范围。截图与审查记录没有作为页面运行时资源引入；生产构建只引用实际展示的封面、16 张图片和页面依赖。
