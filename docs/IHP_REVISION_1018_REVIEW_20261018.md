# iHP 10.18 文档与配图实施

用户明确要求按本轮 Word、PPT 及全局要求修改，并上传仓库和网站。原件与媒体保存在 `assets/human-practice/revision-1018-20261018/`，来源和哈希随仓库保存；此前未提交成果保持。

## 逐项实施

1. Overview 白泽与两行原文缩小为 64px 人物／12pt 文字，同一横排，人物在左、文字在后，两者一起随页面滚动从右向左移动。
2. 这一横排移到 Overview 原纸框的末段之后；移除旧独立大框、全屏固定和 200svh 等待区。窄屏保留横向查看、键盘焦点，减少动态时完整静态显示。
3. Collective Growth 删除地球图标、Overview 词及其标题外框，保留原正文和 `collaboration-overview` 旧锚点。
4. 修正 770+ 的 SVG 画布宽度／横向偏移，六项统计框同宽同高；原顺序、数字、加号及同步增长保持。
5. Summary 两张图补 `Figure 101. From Feedback to Shared Impact` 和 `Figure 102. Answering Our Opening Questions`，均按全站格式。现为 Figure 1–102、Table 1–6。
6. Summary 首图使用本轮 PPT 第一页完整 3200px 原生 PNG 导出，Context、Iteration 图标可见。原生 SVG 分组导出会丢失这两个图标，故未用于网页；没有生成或重绘图内内容。
7. Stage 2 寇教授访谈中的五种病原体全称斜体，RSV／hMPV-B／SPN／BP／HI 缩写直体；保留原科学表述。
8. Stakeholder Strategy 开篇段落末补 `Click the four steps to explore!`，四步原互动保持。
9. WHO 格言在 `for everyone` 前换行，文字每行居中、WHO 署名右对齐。动态测量原版框高，仅调整内部排布，保持原宽高和 16pt 字号。
10. WHO 棕框左下加入与页脚相同的透明白泽，无棕色截图边框、无动画；窄屏缩小人物并为署名留出空间。
11. Summary 六个二级标题去边框、叠层阴影和底板，原标题、正文与锚点保持。
12. Figure 71 换 Word 指定原照片，保留原图注。
13. Explore the activities 下两段提示逐字按新稿替换，保留 40 个活动映射、翻卡和四个反馈表入口。
14. LISTEN 右下棕色活动图标（活动 4）加小型透明提示贴纸，下写 8px click；鼠标事件穿透，不妨碍选择或翻卡，手机入口同步。
15. Project Evolution 开篇核心问题为 `What Global Health Challenges Matter Most?`，补 `Please click the five questions to explore.`；其余指定前后段原文保持。Stage 1 开篇整段和强调文字直体。
16. Figure 45、46 分别替换为指定上下两张原 PNG；Figure 1 显示直径减 2cm，原图及放大入口保留。

## 保留与验证

- 保留 210 个旧锚点，无重复 ID；9 张原生表格数据、全部 PDF 链接、Summary 六段正文保持。385 与 585 仍为两项不同统计。
- 原有带来源编号段落只有指定核心问题和 Stakeholder Strategy 提示两处文本变化，其余为格式调整；替换照片逐字节匹配附件，原件与媒体哈希通过。
- iHP 在 1440／390／320px 检查：无整页横向溢出或脚本错误；Figure 1–102／Table 1–6 连续，12pt、加粗、逐行居中。统计六框高度差不超过浏览器 1/64px 舍入范围。
- WHO 框宽高在三宽度分别与修改前一致，字号均为 21.3333px（16pt）；原框高分别为 141.296875、175.953125、252.1875px。换行、居中、右侧署名及透明静态人物已目视核对。
- 白泽区高 88px、与 Overview 同一纸框，人物 64px、两行文字 16px。正常动画在 0／50%／100% 滚动位置共同从右向左、间距持续 12px；减少动态不移动，窄屏无正文溢出。
- 两宽度正常动画检查：活动 4 选择、键盘翻卡及页内 Back 通过；Back 在框右侧 2px、原阅读位置和 URL 恢复，误差为 0。
- 18 页双宽度 36 组发布前检查，全站 382 条图表注格式、顺序及实际媒体对应通过，无整页溢出或脚本异常。
- 构建及资源检查通过：976 文件、23 HTML、1,798 引用，缺失／超限／不安全路径均为 0；差异空白检查通过。

结构化检查结果见 [审计记录](IHP_REVISION_1018_AUDIT_20261018.json)。本轮图片替换、明确要求的 2cm 缩小与新图标保留；上一轮仅图片裁切／背景融合的独立开关继续有效，不得整批回滚文字或 Back。

## 上传与发布

本轮使用 `codex/software-hardware-20261018`，基线 `baea53e`（PR #13），包含全局第 50–52 节当前成果。公共责任人 00；不改原工作流、凭据、项目或发布开关。按现有 PR、wiki-build、所有者授权验收、merge commit 与原 Actions 流程发布至固定站点。实际 PR／生产运行及公网验收结果见 [发布记录](RELEASE_IHP_1018_REVIEW_20261018.md) 指向的仓库 PR／Actions。
