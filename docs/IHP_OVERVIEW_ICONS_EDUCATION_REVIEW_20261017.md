# iHP Overview 2.0 图注图标与 Education 封面

更新日期：2026-10-17（Asia/Shanghai）。本轮仅本地修改，尚未提交、上传或发布。全局最新要求见 [全站开发要求第 40 节](全站开发要求.md#40-ihp-overview-20漏注与图标及-education-封面2026-10-17)。其他既有未提交成果均保留。

## Overview 文稿及配图

- 用户确认替换 iHP Overview，随后明确不用第一份 Word，改用新发的《ByeGerm Overview最终版.2.0docx.docx》。本轮九段正文逐字使用 2.0 英文，不把黄色中文编辑备注展示为正文。
- 原 WHO 引语和棕色引语框保留，只有署名改为右对齐。
- 按文稿标记，在第四段后放 PPT 第 1 页原生四卡：585 Valid questionnaires、10 Stakeholder groups、24 Named contacts、45 Work entries。移除幻灯片外围空白，桌面四列、手机两列。原数值原样保留，不用这组统计反推或修改总图的 40 个活动映射。
- 在新增反馈循环引导段后放 PPT 第 2 页原反馈流程图；原图片为 1267×950 JPEG，采用内嵌完整原图的 SVG 椭圆显示窗口去外围白画布，网页不放大超过原像素，不生成替代科研图。原始 JPEG 和 PPT 原件可追溯，点击仍可查看完整原图。
- 原 `pending-overview-illustration` 锚点随反馈图保留，旧地图占位锚点也保留；旧稿最后一句已不在新稿中，按新稿移除。没有恢复已删除的 Interactive project map 占位框。

## 漏注与图号

补齐用户指出的三张图：

| 原文件／位置 | 新图注说明 |
| --- | --- |
| 原 Figure 91／92 之间 `revision-20261015/image91.png` | BioAI Agent software demonstration during the inter-team online exchange |
| 同处 `revision-20261015/image92.jpeg` | Online course timetable for the Summer Dry Lab Camp |
| Expanding → Collective Growth → Part 4 第二点，`revision-6-20261017/requirements/image1.png` | Introduction and gameplay instructions for the synthetic biology adaptation of Plants vs. Zombies |

新增四项统计图另加一条说明；原反馈流程图的原说明保持。共 102 条 Figure 图注、5 条 Table 表注，顺序交给共享编号器，Times New Roman、12pt、加粗、逐行居中。原 98 条说明逐字保留且相对顺序不变；本轮新增后，后续图号相应后移，不沿用截图中的历史图号。页面原正文没有需要跟改的 Figure 数字交叉引用。

## 图标互动

- 四个模块按钮取消常驻边框、矩形阴影和外轮廓，使用无硬边的柔和圆形呼吸光；键盘聚焦时才显示可见焦点提示。原表格、原生弹窗关闭、Escape、返回焦点、移动端横向滚动都保留。
- 40 个活动按钮保留原生位置和原始图标，选中边线画在按钮内部，取消旧外扩双圈。悬停／键盘显示活动名称，关联照片卡高亮；点击切换后有短暂光效反馈，减少动态时停用该动画。悬停新图标时隐藏其他旧焦点的名称，避免多个提示叠在一起。
- 保留两套桌面／手机入口、全部 40 个映射、14 个卡槽、28 张响应式翻卡及 Inclusivity 左侧默认 28。27／29、38／39／40 可正常切换，箭头／Home／End 及 Enter／空格操作保持；不重新显示活动编号。

## Education 封面

- 用户原 PNG 逐字节复制到 `a  图片/page-covers/education-heart-edu-20261017.png`，1678×937；旧封面保留。
- 只替换 headpage 图，保留栏目／页面名称、三个原关键词、单排及手机横向查看、原遮罩。桌面优先黑板与人物上部，手机偏向人物，避免把脸切掉。
- 活动卡、正文、资源、PDF、图库、图注和所有链接保持。

## 来源与实现

`assets/human-practice/revision-10-20261017/sources/` 保存最新 Word、原 PPT 和小圆圈参考截图；同目录上一级保存四张原生 SVG 卡片、完整统计原导出、原 JPEG、显示窗口及 `source-manifest.json`。清单记录来源、哈希、原像素、显示窗口和新增说明。Education 原 PNG 独立保存并纳入同一清单。

本轮实现涉及 `Eagagement/iHP.html`、`Eagagement/education.html`、`样式/ihp-revision-5.js`、新增 `样式/ihp-revision-10.css` 和 Education 局部封面构图。没有重跑旧页面生成器。

## 必要检查

- 对比任务开始快照：184 个旧锚点全部保留，无重复 ID；Overview 以外 501 个源内容块逐字一致；14 个 PDF 原链接、Summary 和 Closing 不变。Education 正文与全部链接逐字一致。
- 1440／390／320px 检查 102 图注顺序及字体、三处漏注、四／两列统计卡、WHO 署名、去框与光效、全部四弹窗（共 12 次实际打开／关闭与焦点返回）、默认 28、活动切换和键盘；无脚本异常或页面横向溢出。
- 桌面／手机截图已目视检查统计图、圆形反馈图、总图、圆圈互动及新 Education 封面。普通动态模式有呼吸光和切换反馈，减少动态模式保留静态提示。
- 正式构建及资源检查通过：964 文件、23 HTML、1783 引用，缺失／超限／不安全项均为 0；`git diff --check` 无空白错误。内部源对照、浏览器脚本与截图位于 `.local/overview-map-20261017/`，长期原件和规范不依赖此临时目录。

仍暂缓：`Feedback-to-Shared-Impact-polished-v4.pptx`；独立 Summary 留空，原 Closing 不搬动、不补写。
