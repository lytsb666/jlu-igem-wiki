**2026-10-16 首页倒计时线上修复**：上一轮版本已通过 [PR #9](https://github.com/lytsb666/jlu-igem-wiki/pull/9) 发布。用户反馈计时不动，并明确机器场景进入瞬间启动、3 倍速倒数。已复现原 IntersectionObserver 在相邻场景接触视口时报告零高度、真正进入时不再通知的漏触发；改用现有叙事时间线启动，数字直接显示，实际 10 分钟走完显示 30 分钟并循环，回滚不重置。本轮只修首页及相关记录，沿用本次网站修复的发布范围，不调整图注和其他待办。实施、边界回归及 PR／部署追踪见 [HOMEPAGE_COUNTDOWN_FIX_REVIEW_20261016.md](docs/HOMEPAGE_COUNTDOWN_FIX_REVIEW_20261016.md)，最新长期要求见全局第 24 节。

**2026-10-16 当前版本上传／发布授权**：用户本轮要求把现在版本上传仓库并更新网站，范围包含下方连续各轮已完成的本地成果及 iHP 3.0；此前“仅本地／未上传”均为当时快照。按现有 PR 检查、merge commit 和已开启的 GitHub Actions 发布既有固定 Pages 项目，保留图注暂缓、独立 Summary 留空、缺真实 PDF 与白边仅方案的状态。范围、检查及实时追踪入口见 [RELEASE_CURRENT_REVIEW_20261016.md](docs/RELEASE_CURRENT_REVIEW_20261016.md)，不复用旧授权判断后续任务。

**2026-10-16 iHP《修改意见3.0》（仅本地）**：按用户确认，80 处现有图注原样保留，统计清单存入仓库；其余完成米色正文框、三张翻卡、四步骤原图互动与分框／箭头、逆时针透明转盘、WHO 引文、九个标题框、65 个独立对话标签、统计图缩小、Stage 5 换图、照片去侧框、BioAI 补齐轮播及 CARES 标签。Overview 新图放 Project illustration，Interactive map 仍待补；删除 05 和 Stage 4 两个 PDF 待补框。原 Closing 按本次要求归入 Expanding，独立 Summary 空出待补，覆盖早期的整体暂缓。网页阅读文档仍缺实际文件路径，保留其余 16 个资源待补位置。最新见全局第 25 节、[IHP_REVISION_3_REVIEW_20261016.md](docs/IHP_REVISION_3_REVIEW_20261016.md) 和 [图注待办](docs/IHP_CAPTION_PENDING_20261016.md)；其他未提交成果保留，未上传或发布。

**2026-10-16 首页计时／视频及白边方案（仅本地）**：Homepage 倒计时在整个机器场景首次刚进入视野时启动，不等数字出现，回滚继续与 30 分钟循环保持。当前四段正文视频及首页官方视频均无图注，公共清理覆盖播放器内、上下紧邻及动态插入的图注，原图片说明和播放行为保持。22 项浏览器检查、构建与资源检查通过。白边仅只读初筛并形成逐图显示窗口方案，未批量裁图；部分科研图已有窗口，后续应收紧现有窗口。最新见全局第 24 节、[HOMEPAGE_VIDEO_REVIEW_20261016.md](docs/HOMEPAGE_VIDEO_REVIEW_20261016.md) 和 [IMAGE_WHITE_MARGIN_PLAN_20261016.md](docs/IMAGE_WHITE_MARGIN_PLAN_20261016.md)。保留其余未提交成果，未上传或发布。

**2026-10-16 Hardware／Education 展开栏（仅本地）**：Hardware Explore more 入口文字改为 Software for Hardware／Model for Hardware，原图标及地址不改；Education Open resources 的 27 个 PDF 标题栏按实际每排左右等高，缩放后重新适配，手机单列恢复自然高度。23 个活动方案仍默认展开、四份 Gene Wars 指南仍默认收起，完整原件与阅读器保留。39 项浏览器检查通过，最新见全局第 23 节及 [HARDWARE_EDUCATION_RESOURCE_HEADERS_REVIEW_20261016.md](docs/HARDWARE_EDUCATION_RESOURCE_HEADERS_REVIEW_20261016.md)，其他未提交成果保留，未上传或发布。

**2026-10-16 页脚最新同高／单行修正（仅本地）**：Contact with us 与 Explore the wiki 桌面同高；二维码区 190–240px，导航两列按内容宽度分配，1024px 及以上每组一级和全部子页同一行，20 个链接完整可见、无滚动条。用户明确手机仍允许换行以保证完整可读。62 项针对性检查通过，含六种桌面宽度、1023px 断点及手机；最新见全局第 22 节及 [FOOTER_HALF_LAYOUT_REVIEW_20261016.md](docs/FOOTER_HALF_LAYOUT_REVIEW_20261016.md) 末节，覆盖下方桌面允许换行的旧快照。未上传或发布。

**2026-10-16 页脚链接完整性补改（仅本地）**：用户反馈导航显示不全并建议中间区左移，现将中间区改为约 28% 二维码／72% 导航；子页自然换行，取消隐藏的横向滚动和裁切，保留两列三组、顶部品牌位置及校徽字号。20 个链接的完整文字／边界在六种视口逐个核对，38 项检查通过，无重叠、截断或整页溢出。更新见全局第 22 节及 [FOOTER_HALF_LAYOUT_REVIEW_20261016.md](docs/FOOTER_HALF_LAYOUT_REVIEW_20261016.md) 后续修正；手机按完整内容自然增高，不能恢复旧的单行隐藏。未上传或发布。

**2026-10-16 页脚最新草图（仅本地）**：按用户最终确认压缩为大半屏，顶部 ByeGerm／队名分别在左右半区居中、校徽居中放大；下方左侧四码两行两列，右侧导航两列三行、子页在一级右侧同一行，导航不显示进度条或滚动条。赞助商横跨下方，版权位于底部；手机自然排版。桌面页脚约 591px（900px 屏）／514px（720px 屏），45 项浏览器检查、构建与资源检查通过。详见全局第 22 节与 [FOOTER_HALF_LAYOUT_REVIEW_20261016.md](docs/FOOTER_HALF_LAYOUT_REVIEW_20261016.md)，覆盖下方旧的满屏要求；其余未提交成果保留，没有上传或发布。

**2026-10-16《10.16.docx》继续修改（仅本地）**：按附件及用户四项澄清，完成 Measurement 星号、设备插图限宽、视频图注删除、Hardware 指定流程删除与 Explore more 双图标入口、病原体轮播标题、Model 原图替换与可见图框同宽、带框链接去下划线及交互、Team 仅展开资料卡去中文、Software 指定小节删除、Contribution 三项封面主题词。页脚品牌行放大，删除第二个抖音二维码，四个原码以等大正方形白底显示。最新规则见全局第 21 节及 [DOCUMENT_REVISION_REVIEW_20261016.md](docs/DOCUMENT_REVISION_REVIEW_20261016.md)，覆盖下方五二维码等旧快照；保留原件、既有未提交成果和 iHP 总结暂缓要求。构建与资源检查通过，未上传或发布。

**2026-10-16 赞助商高清与纯二维码（仅本地）**：七个 sponsor 已接入高清透明衍生版本，原展示大小、顺序、42 秒连续滚动保持。用户明确二维码只留有效码区、五框同大小：现为五个等大正方形框，抖音去灰底与外部名称、Instagram 去表情海报与账号，其余原码直接显示；码内标志和必要留白保留，不重画或重编码。全部原件仍在仓库，最新要求写入全局第 20 节，见 [FOOTER_SPONSOR_QR_REVIEW_20261016.md](docs/FOOTER_SPONSOR_QR_REVIEW_20261016.md)。

**2026-10-16 页脚校徽与二维码补改（仅本地）**：品牌行 JLU 圆圈改用用户本次提供的蓝色吉林大学原始校徽，删除旁边独立英文校名，保留 ByeGerm／JLU-SPH iGEM Team。用户明确二维码铺满整个框、删除下方文字：5 框取消内边距及平台图注，原图按原比例铺满，桌面框上限 136px／短屏 112px，手机五列自适应；原色、原件、查看入口及辅助技术标签保留。共享页脚生效，单屏与手机布局保持，详见 [FOOTER_SEAL_QR_REVIEW_20261016.md](docs/FOOTER_SEAL_QR_REVIEW_20261016.md)。

**2026-10-16 连续改动核查与补漏（仅本地）**：用户明确检查的是 `127.0.0.1:5221`。已核对 18 个实际入口并补齐目录 RT／HP／P6 与五阶段名称大小写、iHP 横向分级支线、Hardware 删除 Figure 21 后视频误补位，以及窄边栏人物漏显和页脚回顶定位。其余最新 Education 静态照片、页脚七个标志和封面等逐项核对，详见 [REQUEST_SEQUENCE_REVIEW_20261016.md](docs/REQUEST_SEQUENCE_REVIEW_20261016.md)。原有未提交成果保留；本轮未上传或发布，待补资源与 iHP 总结暂缓要求保持。

**2026-10-16 页脚再次调整（仅本地）**：页脚导航、品牌、联系区、二维码整体放大，赞助商标志桌面高度 72→106px；删除第二个生工展示，每个连续滚动组现为 7 个标志，原始文件保留。两列三行、链接单行及一屏布局保持。最新要求已写入全局第 20 节，见 [FOOTER_SCALE_REVIEW_20261016.md](docs/FOOTER_SCALE_REVIEW_20261016.md)。

**2026-10-16 Education 同日后续修正（仅本地）**：Health Guardians、Biotech Explorers、Diversity Partners 的活动照片改为左栏纵向静态排列，不再轮播或粘性跟随；删除 Open toolkit 提示，Activity plan 阅读按钮加宽。原 75 张照片、24 项活动、文稿、原图与资源入口保留，开头三条连续总览照片带保持。最新要求已更新全局第 20 节，见 [EDUCATION_STATIC_PHOTOS_REVIEW_20261016.md](docs/EDUCATION_STATIC_PHOTOS_REVIEW_20261016.md)，覆盖下方旧记录中这 24 项活动的轮播描述。

**2026-10-16 同日后续本地修改（未上传／未发布）**：当前 `codex/footer-card-polish-20261016` 保留 Figure 21 删除与卡牌裁边，并完成页脚无外框两列三行、每组链接单行、Team 页脚行删除、原色透明赞助商连续滚动（移除 HIT／加入卫生检验徽标）；目录句首大写与分级线加强；封面队名栏目首行改直体；左侧直达页脚与右侧回顶的不同人物靠白框外侧；Education 开头三条连续照片带恢复、24 项活动统一左图右文与多图两秒轮播；iHP 三项主题词、成本最高柱括号汇率和 Contribution Figure 5 替换。最新要求见全局第 20 节及 [FOOTER_DIRECTORY_EDUCATION_REVIEW_20261016.md](docs/FOOTER_DIRECTORY_EDUCATION_REVIEW_20261016.md)，覆盖以下旧快照中的冲突显示要求。构建与受影响桌面／手机检查通过；B08 照片仍待补，iHP Closing／独立总总结继续暂缓。旧发布授权不延续。

# JLU-SPH Wiki 项目交接

**2026-10-16 本轮上传与发布授权**：用户明确要求把当前本地代码上传仓库并更新网站。本次范围包括《10.15改动》、iHP 最新文稿修订、新封面和 Contribution 卡牌、统一页脚／headpage、资源区修复、倒计时贴框、Team 中文名／Advisor 顺序、非 Team 两秒轮播及展开箭头。此前各本地验收文档的“未上传／未发布”是当时快照，不能据其回退本轮成果。发布范围与检查入口见 [RELEASE_REVIEW_20261016.md](docs/RELEASE_REVIEW_20261016.md)；最终版本以本轮 PR、GitHub Actions 和实际网站为准。本轮授权不自动延续到后续任务。

**全站人物回顶（2026-10-14 最新用户要求）**：除 Homepage 外，19 个实际正文页按主题分配用户本轮提供的人物；Team Attribution 与旧 Judging 地址继续跳转到原共享页面，使用目标页的人物。下滚超过 240px 后，只有右下角足够空白时才显示，完整按钮与动画边界都须避开文字、白色卡片、图表、视频、PDF、现有控件及装饰；空间不足尝试缩小，否则隐藏，弹窗、全屏及加载期间隐藏。不移动原布局或强行制造空白。人物为透明衍生素材，保留双人场景，原附件未修改；页面分配、来源与提示词见 `assets/mascots/back-to-top-20261014/`。CSS 提供书写、移液、气泡、镜片闪光、医护呼吸及屏幕闪动等轻动画，悬停暂停，尊重减少动态设置。原生按钮支持鼠标、触控、Enter / 空格回顶；键盘操作将焦点交给页首标题，Model 当前模块与 URL 上下文保持。新增人物按钮是用户最新明确要求，覆盖旧文档中禁止 Software / Model 返回顶部入口的条款，旧目录文本链接不恢复。公共实现为 `样式/back-to-top.js/css`，首页不加载人物入口。

**全站引用与图表说明（2026-10-14）**：正文引用序号以中括号显示在右上角，保留现有文献跳转，并消除 Model 原有重复括号；组合引用同样使用角标，科学公式的上/下标不改。已有图注和表注统一为 `Figure 数字. 内容.` / `Table 数字. 内容.`，保留原编号（含章节编号）、原说明、科学标记和链接。未编号的现有说明按页面 / Model 模块补齐不冲突的编号；不凭空编写没有原稿说明的图表标题。居中、加粗、12pt 等全站标准保持。

**Contribution 新视频（2026-10-14）**：正文 `#contribution-software-video` 改用用户本轮提供的 `c739d3551d8dd20731d50dd6e49c2166.mp4` 原文件，站内位于 `assets/research/2026-10-14-contribution/software-demonstration.mp4`。原视频 544×864、397.811667 秒、含音轨，12,952,192 字节，复制后 SHA-256 一致，无剪辑或转码。沿用原位置、图注、原比例、380px / 38rem 上限与原播放控件；进入视野尝试带声音播放、浏览器拦截时手动播放、离开视野暂停，加载动画独立。旧视频及其历史记录保留。

**链接下划线最新要求（2026-10-14）**：已有下划线的链接统一为连续实线，关闭字母下伸部分的自动避让；行内按钮的文字与箭头共用同一文字容器，避免间隔截断下划线。换行时每行各自保持直线，原链接目标和交互保持；导航、目录及 Measurement 四个机制跳转条目继续沿用不带下划线的要求。

**下载入口与 Software 配色最新要求（2026-10-14）**：全站移除图片、视频和 PDF 下的附加下载链接，保留原媒体、PDF 默认收起的完整阅读器及打开原件入口。用户随后明确 Software 的下载链接保留，因此 Software 的 APK、手册下载均为例外，不得套用移除规则。Education 资源入口改用阅读措辞。Software 数据流程和提示框的浅蓝绿色底改为白色，保留编号圆框、四点连线与交互。此条覆盖旧交接文档中要求所有 PDF 保留下载链接的描述。

**Software 顶部样式（2026-10-14）**：封面下的 `.sw-intro` 文字、按钮和吉祥物区域统一包在白色圆角卡片中，边框与内边距沿用 Software 正文卡片风格，手机上保留上下排布。原文、插图、浮动互动及两个入口保持。

**Notebook / iHP 显示修复（2026-10-14）**：截图中的异常来自共用样式覆盖，文本仍为正常 UTF-8。封面下介绍框的居中、内边距和段落宽度不能被未分层的 reset 清零；目录当前组统一棕底浅字；Notebook 深色日历沿用浅色文字及金色装饰线。实验记录、日期、日历跳转和 iHP 原稿均保持。

**Model 后续版式要求（2026-10-14）**：Hardware 模块去掉正文上方重复的“Model for Hardware”标题和“Fluorescence Image Analysis for Respiratory Pathogen Detection”副标题，右侧从 Model Background and Analysis Objectives 正文卡片直接开始，与目录顶部对齐。Measurement 首次打开的外围黑线来自浏览器对锚点模块的默认焦点轮廓；仅去掉 `.model-module-panel` 容器轮廓，保留模块按钮、目录和其他控件的键盘交互与焦点提示。

**Headpage 最新全站要求（2026-10-14）**：右下角的黑色特点圆框统一单排横向排布，不允许堆成多行。桌面留出标题与圆框各自的空间，小屏空间不足时在封面内横向滑动，保留原字号、文字与圆框样式。

**用户后续要求（2026-10-14）**：Measurement Table 4 已按当前 Table 2 的 Candidate 1 / 2 / 3 / 10 同步十二条序列、长度和组件名称，去掉旧质量分数；截图中的四个机制跳转条目去掉文字及编号下划线，保留原颜色、悬停、键盘和跨页跳转。新增全站标准：表格滚动容器上下留出 `1.5rem` 空白，不能紧贴前后内容。用户要求不要反复过度验证：根据本轮影响范围做必要构建和针对性检查，通过后停止重复全站回归。

**2026-10-14 最新本地整合**：00 从已发布 main `d763a43` 建立 `feat/00-headpages-education-20261014`，仅整合 08 的 `a19a7a3` 与 05 的 `48198bf` / `8965820` 新增量。随后按用户新要求统一 18 个静态子页面封面和参考文献链接、打磨 Education、将 Model 做成 Measurement / Hardware 双模块、加入用户提供的 Hardware Model 完整稿及五条文献，并在 Measurement 第一节之前加入 Engineering 白框。原 Model 内容、Measurement 数据与 Reference 默认收起、Team / Homepage 交互保持，所有未提交材料及其他 worktree 成果保留。详见 `docs/INTEGRATION_REVIEW_20261014.md`。本轮已完成本地构建和浏览器验收，未 push 或更新 Cloudflare；正式构建预览 `http://127.0.0.1:5222/Eagagement/education.html`。接管时实读 GitHub 的 `PAGES_DEPLOY_ENABLED=true`，旧的“自动发布关闭”描述不能作为当前事实，上传前须核对实时配置和当轮授权。

**2026-10-14 最新授权优先**：用户明确要求完成 Team / Measurement / Homepage / Model 本轮修改后上传仓库并更新网站，覆盖下文 10 月 13 日仅本地预览、等待确认的历史门槛。按所有者本人授权的直接验收流程保留 PR、等待 `wiki-build` 通过后合并，再通过现有固定项目 `jlu-igem-wiki-preview` 手动发布。自动发布开关不变；只部署构建并检查通过的 `dist/client`。主控分支以实际 Git 状态为准，本轮继续使用 `feat/00-preview-format-20261013`，保留所有历史整合成果及原未跟踪材料。

本轮完成：Bo Pang 说明改为 `Judge for iGEM Competition`；Haoyang Liu 简介去掉误加的 `Quote：` 标签，独立 quote 字段原已为空；PI / Secondary PI 展开为全称；Team 局部放大照片、文字和资料区、增强按钮状态、九位 Advisors 恢复翻页且完整贡献可自然增高。Measurement Table 2 复制 Model 的 RSV 十组候选表，保留三十条序列与长度且不保留旧质量分数，原来源锚点不变。首页各场景接缝增加渐变。Model 公式标签紧邻公式、三个黑色代码面板缩窄并增加浮动阴影、七张正文图补充贴合图框，四张机制图仅通过 CSS 裁去外围白色画布，原图字节、底色及原图链接保留。详见 `docs/REVISION_REVIEW_20261014.md`。

验证：正式构建 25 页 / 1625 个引用，无缺失、超限或不安全资源；本轮桌面 / 390px / 320px 浏览器 224 项通过，25 入口桌面 / 320px 回归 266 项通过；首页 PCR、卡片与链接交互、Model 图框 / 代码浮动及 Team 按钮状态实测通过；43 人资料、186 项任务、全部肖像、七张科研原图、所有公式与代码通过来源对照。证据在 `D:/JLU—Wiki/IGEMwiki/tmp/revision-20261014/`。发布和 PR 的最终状态以 GitHub、Cloudflare 与实际 Git 为准。

**当前待用户验收的本地预览（2026-10-13）**：用户要求整合最新改动后完成十二项全站展示调整，先提供可预览网站，确认后再上传。这项明确的验收门槛优先于下文“本人授权修改直接合并”的一般流程。本轮分支 `feat/00-preview-format-20261013`；没有 push、创建 PR 或部署。已整合 03 的 Contribution / Description / Measurement / Safety 新增量、07 Entrepreneurship 新增量、08 Model / Hardware 新增量，以及 01 尚未提交的最新首页图稿和 PCR 交互；其他 worktree 原样保留。公共调整、逐项范围及复验结果见 `docs/PREVIEW_REVIEW_20261013.md`。实际 Git 状态和最新复验文件为准。用户确认前继续保留本地，勿自动更新 GitHub 或 Cloudflare。

**同日本地预览第二轮修正**：按用户最新四张截图，取消顶部导航 / 下拉项 / 目录下划线；首页后两段改直体；正文视频进入画面后尝试带声音播放、离开暂停，浏览器拦截时显示播放按钮；Model 结果图按 Measurement 单图宽度、Parts 质粒图按 Measurement 同图显示规格对齐；通过公共 `numbered-content.css/js` 为 8 个正文入口的 463 个数字步骤 / 条目增加圆形编号、四圆点和自适应圆角内容框。参考文献、目录、表格、日期与章节标题不采用步骤组件，正文与原图文件未修改。桌面 / 手机 25 入口复验及视频播放 / 授权限制复验通过，详见同一验收说明。该轮暂未纳入 02 的独立提交 `9eaedea`；现在已按下述后续授权整合。

**同日封面替换**：按用户提供五张原图的顺序，为 Protocol / Notebook / Measurement / Safety / Parts 替换顶部插画；原图字节保留在 `a  图片/page-covers/revision-20261013/`。四个原渐变或预留封面区通过现有公共封面 CSS 引用新图，Safety 仅改原图片地址；标题、说明、关键词、信息卡、字体、颜色、位置和封面尺寸均保留。原深色渐变用于新图遮罩以维持白字可读，未删除旧资源。构建和五页桌面 / 手机 60 项对照检查通过，本地预览仍为 5220；没有 push、部署或同步其他工作区。

**最新 Team 整合同步授权与结果**：用户明确要求“整合同步最新的 team 页面”。00 检查主控与 02 工作区状态，确认未提交成果没有冲突后，合入 `codex/02-team` 的 `9eaedea` 及其历史。新版合照封面、28 人照片条、六个筛选、同页完整资料、3 PI / 3 Secondary PI / 9 Advisors、九位负责人排序和两条用户指定 PI 说明已纳入 5220 预览。43 人原资料 / 肖像、37 份完整贡献、186 项任务及历史身份修正通过原数据对照。兼容修改仅为合照跟随实际导航高度、保留 Team 原滚动提示的无下划线样式。浏览器桌面 / 手机 / 触控 / 320px 检查与正式构建通过；02 分区仅在干净状态下快进同步此整合版，其他分区不批量同步。证据在 `D:/JLU—Wiki/IGEMwiki/tmp/integrate-team-20261013/`。仍未 push、创建 PR 或更新 Cloudflare，用户本地验收门槛继续生效。

**2026-10-13 最新授权与状态**：用户已明确要求整合各部分修改并上传 GitHub，覆盖下文早期针对 GitHub / git push 的禁止约定。仓库为 `https://github.com/lytsb666/jlu-igem-wiki`，当前整合分支为 `feat/00-integrate-20261013`，以实际 Git 状态为准。用户最新确认：本人发起并授权的修改由 00 完成必要检查后直接验收、合并，无需第二人 Approve；其他成员的 PR 必须等 `@lytsb666` Approve 后合并。详细规则见 `CONTRIBUTING.md`。不要仅凭共享 GitHub 账号或 Git 作者认定用户本人授权。

本轮已整合 01 首页的 15 个修改 / 新素材文件、03 科研的四个新提交、08 仪器的 Loading 分层修复及新提供手册；补齐全站表格完整单词换行与棕底浅字居中表头。提交 `8ea5f78` 的正式构建和 GitHub CI 通过；25 个入口在桌面 / 窄屏完成 314 项回归。源 worktree 的未提交成果和主控历史未跟踪材料原样保留，没有批量同步或重放旧成果。PR #2 及实际合并状态以 GitHub 和 Git 状态为准。Cloudflare 自动发布仍关闭，固定站并未因 GitHub 上传而更新。

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

## 10. 08 Hardware 整合及固定预览更新（2026-10-12）

- 用户明确要求将 08 改动整合到主控并更新既有 Cloudflare 站。整合前主控为 `40e3b3b`，08 为 `4e97a27`；两边均无未提交跟踪修改，主控原有两项未跟踪材料保留。
- 主控已快进整合 08 的 `fa1bfd3`（Hardware 正文和资源）及 `4e97a27`（白色内容框、删除侧栏返回顶部）。保留完整 Git 历史，没有重放旧 Software / Model 修改，也未合并 03 或其他 worktree 的新任务。
- Hardware 新增九章正文、五张原稿表和一张规格表、Fig1–23、四份原 PDF（复现指南 6/10 页、手册 4/5 页）、三段完整网页视频、两份复现指南滚动阅读及跨页面链接。保留源稿限定和两处待补实验结果图；详细资料冲突及缺口见 `assets/hardware/review/S08-HARDWARE-HANDOFF.md`，没有虚构性能、固件、CAD/Gerber 或采购证据。
- Judging Hardware 继续共享 `Instrument/hardware.html?nav=judging`，旧入口保留查询参数及片段；不复制第二套内容。Hardware 原版手册与 Software 当前八页手册并存，未覆盖 Software 资源。
- 构建资源检查发现 public 目录内两份 `.gitattributes` 被 Vite 拷入产物。仅在构建输出中移除 Git 元数据，源码文件保留，网站内容和资源不受影响。
- 主控整合版已完成正文、表格、原 PDF 哈希、视频长度、导航/Loading/Footer 保护核对；浏览器 1440/900/390/320 宽度的 11 个白色内容框、局部表格滚动、成本折叠、指南键盘滚动、原 PDF 下载、视频元数据和实际播放、旧 Judging 跳转通过。最新构建及最终公网结果以本轮证据记录为准，不代表补齐实机或全站最终验收。
- 证据目录：`D:\JLU—Wiki\IGEMwiki\tmp\integrate-08-2026-10-12\`。发布沿用固定项目 `jlu-igem-wiki-preview`、`--branch main` 和第 8 节命令，仅上传成功构建的 `dist/client`，不执行 git push、不发布正式站。
