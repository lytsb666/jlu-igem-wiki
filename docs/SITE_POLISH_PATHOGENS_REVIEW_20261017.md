# 光标、媒体入口、目录与病原体口径核查

2026-10-17，本轮按用户八项页面要求及截图修改，随后明确两项范围：Feedback PPT 暂不加入；病原体核查文档的 Education／Entrepreneurship E01–E09 一并修正。已有所有本地成果保留，没有提交、上传或发布。

## 显示与交互

- 原自定义光标放在普通 DOM 中，即使 z-index 最大也无法显示在浏览器原生 dialog 顶层之上；同时系统光标仍被 `cursor:none` 隐藏。现跟踪弹窗、全屏与嵌入区域状态，使用系统光标和正常的按钮指针，关闭后恢复页面光标；失焦、离开页面及图标加载失败均有原生回退。通过状态类更新样式，避免长页面逐步排版时反复匹配整页顶层选择器。
- Education 目录圆点删除。Engineering 原十组 details 目录改为公共一级锚点／子项列表／加减号控件，保留四模块切换、全部 Node／Edge、旧锚点、当前位置和准确平滑跳转。
- 图片与 PDF 下附加的源文件文字入口共清理 85 个，包含总图 `View the full activity map`、原图箭头和 PDF 的打开／下载行；后加载的图示入口也执行相同清理。参考文献、图片点击、图内互动、独立 APK 下载和全部 74 个 PDF 折叠阅读器保留，原文件无删除。Hardware 视频内部三个不兼容浏览器的回退链接保留，它们不是播放器下方的图注或附加入口。

## 图表注与技术规格

全站 18 个实际内容入口共核查 378 个图表注：Times New Roman、12pt、700 粗体、逐行居中。正确的原稿章节式编号（Entrepreneurship）和 Model 模块独立编号保持。

| 页面 | 修正 |
| --- | --- |
| Hardware | 原第一张表误排 Table 6，现为 Table 1；其后五表顺延为 Table 2–6。图按正文顺序修为 Figure 1–22，消除缺 1、缺 21 和夹杂 6.3 的混排，所有正文 Figure 引用同步映射 |
| Hardware 技术规格 | 仅删除用户选中的 `Power and measured temperature-control values were not provided.`，首表标题更新为 `Technical specifications of first- and second-generation ByeGerm instruments`，不补填缺少的技术数值 |
| Software | 原 3、4、5、1、2 顺序改为 Figure 1–5，说明内容保持 |
| Measurement | RSV 候选组合 Table 2 原有可见表注和重复隐藏 caption，保留可见表注并用 aria-labelledby 标记表格，删除隐藏重复；14 表及全部单元格保持 |
| Contribution | Figure 6 去掉绕过公共格式化的预处理标记，使末尾句点、编号元数据使用公共规范；文字含义保持 |
| Education | 新增 B08 合图说明后，后续图号按阅读顺序自然顺延，共 27 图注；图号和标题采用连续行内文字，照片数量单独一行 |

完整 Hardware／Software 旧号到新号映射保存在 `assets/site-revision-20261017/source-manifest.json`。

## 照片与图库

- Education B10 的原两张照片之间插入本轮第三张照片，顺序为原对话、新对话、原合照，共三张，原比例静态纵排、点击放大。
- B08 的 14 张原照片完整接入同组图库；正文静态展示课堂讲解、师生合影、桌面讨论等五张代表照片，点击任一张可浏览全部 14 张。其余九张作为该组图库原图保留，不把 14 张全堆在左栏制造新的空白失衡。活动正文、地点、日期、原 PDF 和其他活动不改。
- B08 原字节照片与 ZIP 文件名映射、SHA-256、静态选择和图库顺序保存在 `a  图片/education/activities/gallery/b08-source.json`；新文件为 `b08-01` 至 `b08-14`，其中原 PNG 保持 PNG，没有转码。
- B10 新原图为同目录 `b10-03.jpg`。iHP Figure 81 的李娟教授照片替换为 `assets/human-practice/revision-9-20261017/li-juan-high-resolution.png`（1095×1436），不替换其他复用位置，不改变人物身份、旧图注或已确认的其他肖像背景。

## 病原体核查 E01–E09

用户明确同意一并修正。面板统一为 RSV、hMPV-B、SPN、BP、HI，即两项病毒、三项细菌；不是对全部正文进行机械替换。

- E01：Education 主名单改为当前五项，补足 hMPV-B 范围，并联动引用 [3]／[4]／[6]／[7]／[8]。
- E02–E03：项目展示中的新冠／流感卡位改为 BP／HI，类别改细菌，说明及教育重点重写。RSV、hMPV-B、SPN 保留对应科普，卡片按当前名单排列，并扩大阅读宽度；完整菌名使用斜体。
- E04：Entrepreneurship 概览标签改 Five-pathogen panel，名单使用 RSV／hMPV-B／SPN／BP／HI。
- E05：执行摘要 Targets 行更正完整名称与两病毒／三细菌组成。
- E06：客户选择段的结果名单更正，移除 pneumocococcus 旧拼写；不修改性能数值。
- E07：专家意见后的作者归纳句改为当前五项，专家引文保持原样。
- E08：风险表改为 Single five-pathogen respiratory panel。
- E09：长期影响段明确三种细菌为 SPN、BP、HI，不再延用旧 4+1 归纳。

Education 两张 COVID-19 趋势图及原六条文献保留，明确这些是额外公共卫生背景，不属于当前检测面板；新增 [7]／[8] 使用 [CDC 百日咳说明](https://www.cdc.gov/pertussis/about/) 和 [CDC 流感嗜血杆菌说明](https://www.cdc.gov/hi-disease/about/index.html)。BP／HI 基础描述经上述原始来源核对，未扩大验证范围或新增实验结论。其他页面的特异性非靶标对照、表达宿主和一般流感／新冠背景不误删。

核查原 Word、所有新增媒体的哈希、编号映射及 Feedback 暂缓状态保存在 `assets/site-revision-20261017/`。本轮没有将 Feedback PPT 导出、插图或加入页面。

## 必要检查与边界

- 18 页桌面与手机图表注检查通过；378 个标签均为统一字体、字号、粗体与居中，按页面／Model 模块唯一且顺序正确，章节编号保持。
- 1440／390／320px 共九次真实弹窗光标检查（iHP 反馈表、iHP 原图、Education 照片）通过；系统光标可见、按钮为 pointer、顶层不再遮住唯一光标，PDF 区域也有可见光标。
- Engineering 四模块共 12 次目录真实点击、方向键展开、目标定位通过；无脚本错误或整页横向溢出。B08 全组 14 张、五张静态、B10 新图顺序及原图字节、Figure 81 清晰原件通过。
- 74 个 PDF 阅读器的原 URL 与本轮开始时逐项相同。八个变更 HTML 的旧锚点全部保留；Education 24 个活动正文、iHP 源文段、Engineering 四模块正文、Measurement 全部表格单元格保持。Hardware 除所选句子与图号引用外的正文／表格数据相同。
- 正式构建与资源检查通过：960 文件、23 HTML、1779 引用，缺失／超限／不安全项均为 0。长 Protocol 页面完成加载约 1 秒，未引入整页光标选择器导致的长文档排版开销。
- 内部检查、源对照、Word 解包和截图位于 `.local/site-polish-20261017/`；长期资料及规则在正常仓库目录保存。没有上传或发布，也没有借用以前的发布授权。

本地预览：<http://127.0.0.1:5221/Eagagement/education.html#activity-b10>。
