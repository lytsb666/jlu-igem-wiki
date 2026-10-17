# iHP 5.0 图示与活动互动 · 2026-10-17

用户本轮提供五份附件，要求替换五个问题的互动图并改进交互，其余明确且材料齐全的项目直接修改；不确定的先保留、不提问，完成后交付修改清单文档。本轮只做本地修改，没有提交、上传或发布；保留当前分支的其他全部未提交成果。

## 已完成

- Project Evolution 首图替换为 `how hp shape的五个问题.pptx` 最新原生图形，去掉外部画布留白，五个问题框按实际形状位置提供鼠标、键盘入口，分别到 Stage 1–5。增加悬停／焦点提示、方向键和 Home／End；定位标题并转移焦点，短时校准懒加载引起的位置变化，用户输入立即停止校准。窄屏增加完整问题文字入口。
- 保留既有 Figure 1 的图注，在其后加入 `史诗大图88888(1).pptx` 的七阶段活动总图。按全部对象边界导出透明 SVG，包含幻灯片画布之外的两侧卡片和底部，未按原画布截断。保留原树形、颜色、箭头、有效图标和编号；网页版用单行 HTML 数字覆盖源 SVG 数字文本，避免两位数断行，不改编号。
- 按《活动卡片终极版》的照片和简介，接入 38 个能够唯一确定的活动。两侧每排各共用一张卡，共 14 张；默认显示该侧最前一个可确定活动。点击编号替换照片与简介，悬停无需点击即可翻至简介，移开返回；支持触屏点按、Enter／空格翻转、Escape 返回及编号方向键。保留全部原简介，包括 19 号两段反馈。照片完整等比显示，不裁人物。
- 在总图下接入 `Activity_Types_big_color_circles_muted_thin_border.pptx` 原图例。1100px 及以下按七阶段顺序显示完整宽度卡片与 44px 编号按钮，避免圆点过小；减少动态时关闭翻转过渡。
- 五阶段问题与最新 PPT 逐字一致，品牌写法按最新图为 ByeGerm，未自行修改第三个问题语法。完整文字见 `explorer-data.json` 及交付 Word。
- Stage 5 总览图及 1 | From Human Practices to Responsible Translation 下四幅图，替换为 `ihp5.0.docx` 的五张原 PNG。四张采用可撤销 SVG 显示窗口去掉外部白边，第四张原底色画布完整保留；原图入口均指向完整原 PNG，不修改科学标签或数据。

## 保留待确认

1. **38 重复、39 缺失**：活动文档的 `SBti Interactive Public Engagement` 和 `Tower-Defense Synthetic Biology Education Game` 都写作 38，未提供 39。网页保留 38／39 数字，但暂不绑定推测的照片或简介；其余 38 个活动正常操作。不能仅按顺序把第二个 38 改成 39。
2. **汇总统计矛盾**：文档开头写 29 核心 + 16 扩展（合计 45），实际正文登记 26 核心 + 14 扩展（合计 40 条），其中仅 39 个不同编号；总图为 1–40。未将该汇总导入网页，未增删活动凑数。
3. **三处颜色／类型不一致**：保留图的原色与卡片原分类，未择一覆盖。

| 编号与活动 | 总图按图例对应 | 卡片文档分类 |
| --- | --- | --- |
| 5 · Public Health and Disease Control Experts roundtable | Field Visit | Expert Interview |
| 20 · Retrospective Empathy Survey for Patients | Survey | Voting |
| 40 · Hike with Love · Embrace the Future | Presentation | Field Visit |

4. **总图缺失小图标**：PPT 图片对象 115，描述为“投票选举”，`a:blip` 为空且没有媒体关联，原文件不含图标数据。网页显示版只隐藏损坏占位，不拿箭头或其他图标补画；原 PPT 和原生导出保留原状态。

正文已有但未列入本次登记的活动继续保留，没有按总图重新编号或删除正文。此前两处缺材料资源、Closing 位置与独立 Summary 留空要求保持。新增概览卡片不恢复 Collective Growth 正文旧照片组，该正文仍只显示此前指定的一张照片。

## 来源与实现

五份原附件完整保存在 `assets/human-practice/revision-5-20261017/sources/`；Word 内五张图、39 个照片媒体及 PPT 原始媒体分别在 `requirements/`、`activity-records/`、`questions/`、`activity-map/`。原件哈希、显示窗口、实际形状坐标、来源和疑点保存在同目录的 `source-manifest.json`、`activity-register-source.json` 和 `explorer-data.json`，不依赖聊天附件目录或 `.local/` 的唯一副本。

网站修改限定于 `Eagagement/iHP.html`、`样式/ihp-manuscript.js` 的新增导入，以及新增 `样式/ihp-revision-5.js`／`.css`。未重跑旧页面生成器。五份原文件逐项 SHA-256 一致，全部 Word 内 PNG／JPEG 媒体与附件字节一致。

## 验证

- 正式构建和资源检查通过：892 文件、23 HTML、1722 资源引用，缺失／超限／不安全资源均为 0。
- 构建版 135 项针对性断言通过：38 个活动逐项核对照片数量及完整简介，14 个默认共享卡片、桌面／手机同步、悬停、触屏、键盘、五问题定位及焦点、八个原图入口、减少动态，以及 1440／1280／1100／1024／390／320px 布局。无脚本错误或整页横向溢出。
- 既有 66 条图注文本与顺序完全一致；表格、PDF 链接一致，带来源标记正文仅改五阶段问题，其余段落逐项一致，无重复 ID。Stakeholder 默认类别、12 份完整 PDF、Collective Growth 正文单照片、Summary 留空保持。
- 最后补查缺失小图标的显示处理、触屏高亮和五幅 Stage 5 显示，五个构建版原图 HTTP 响应与原 PNG 字节一致。新图、图例、卡片正反面及桌面／手机截图已检查。
- 交付文档：`docs/deliverables/iHP5修改完成与待确认事项_20261017.docx`。使用捆绑 Python 生成；本机缺少 LibreOffice，采用 Microsoft Word 隐藏自动化导出 PDF，再用技能 `render_docx.py` 栅格化生成页面 PNG，逐页检查后交付。PDF／PNG 仅为内部核查中间件。

本地预览：<http://127.0.0.1:5221/Eagagement/iHP.html>。构建预览：<http://127.0.0.1:5222/Eagagement/iHP.html>。未上传／未发布。
