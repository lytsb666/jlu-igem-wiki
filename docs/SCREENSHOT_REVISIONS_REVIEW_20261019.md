# Contribution、Hardware 与 iHP 八项截图修订（2026-10-19）

## 基线与范围

用户明确要求在本地最新版本上修改。先核对两个工作区：根目录基线为 `2320253`（10 月 18 日，另有未提交 iGEM 成果）；本地最新部署为 `a69d7c839cb7d0bbc7e1e9176e1369ef912e71bd`，提交时间 2026-10-19 17:19:12 +0800，对应 PR #18 的 PDF 响应式修复。该版本于 10 月 19 日部署到 `D:/JLU-Wiki/.local/github-latest-20261019`。

本轮页面修改全部在上述最新 worktree 中完成，分支为 `codex/screenshot-revisions-20261019`。根工作区已有源码改动完整保留；这里只同步长期规范和交接证据，不把旧页面覆盖到最新版本。本轮仅本地修改，未提交、上传或发布。附件用于定位这八处，不执行截图中其他旧内容或历史附件备注。

## 八项修改

1. Contribution 的 DRYLAB 首个二级标题改为 `A Transferable Framework for Model-Guided Primer–crRNA Screening and Ranking`。
2. 删除 `One geometry for every candidate group` 标题及其后两段全文。原 `contribution-section-2-2` 仅作为不可见旧锚点保留；不进入目录。
3. 后一个二级标题改为 `A Kinetic Modeling Framework for Reaction Optimization`，保留原 `contribution-section-2-3` 锚点。
4. 该节首句改为 `Primers, Cas12a–crRNA complexes, and reverse transcriptase are typically optimized individually, one component at a time.`，其余段落保留。
5. iHP 的五项原图仍为 770+ Participants、50+ Replicable Engagement Activities、43 Professional contacts、20 Fields、14 Published resources。仅通过 CSS 沿原圆角轮廓遮去外围白角；五卡桌面同排、整组居中并限制最大宽度为 54rem，手机两列且末卡居中、五卡等大。修正旧普通样式覆盖分层样式、仍按六列／三列排版的问题。原 SVG、内嵌 PNG、原 PPT 和统计数据完全不变。
6. DRYLAB 开篇整段改为下列用户提供原文。
7. Hardware 的原 `Compatibility results for the tested systems are provided in Section 6.1` 改为 `Compatibility results for the tested systems are provided in Functional Validation and Design Evaluation`；其后的逗号、technical details 及 Software 链接保留。
8. Hardware Table 4 只删 `per-unit allocation pending verification`，同步去掉遗留分号，单元格为 `Subtotal of the list above`。金额、计算方法和其他表格内容保留。

DRYLAB 开篇新原文：

> Our dry-lab work approaches RPA–CRISPR/Cas12a assay development from two complementary directions: selecting promising primer–crRNA combinations and exploring suitable reaction conditions. We developed a model-guided framework to screen and rank candidate primer–crRNA designs, alongside a kinetic modeling framework that examines how key reagent concentrations jointly influence the reaction. Together, these approaches connect sequence-level design with reaction-level optimization, providing a systematic way to narrow the experimental search space before validation in the laboratory.

Contribution 使用现有自动目录，读取更新后的正文标题生成两项二级入口，删除项不再生成。目录继续遵守全站句首大写规则，标题原指定大小写保留；旧有效锚点保持。

## 验证与预览

- 使用 Node v24.19.0 直接运行 Vite 正式构建，构建通过；资源检查 1,266 个文件、23 个 HTML、1,799 个引用，无缺失、超限或不安全文件。
- Chrome 在 1440×900／390×900 下检查 Contribution、iHP、Hardware 共六组：替换文本逐字匹配，Contribution 两项新目录存在、删除项消失，Software 原链接和成本数值保留；无页面脚本异常、HTTP 错误或整页横向溢出。
- iHP 最终布局单独复验两种宽度：桌面五卡同排，手机两列、末卡居中，五卡宽度差小于 1px，整组中心偏差为 0px；查看截图确认白角已去掉、卡片内文字及边框保留。
- 与基线逐单元格比较 Contribution／Hardware 全部表格，仅允许指定成本备注删除；两页媒体地址不变。没有修改 PDF 相关代码、文件或阅读入口。`git diff --check` 通过。
- [可迁移检查记录](verification/screenshot-revisions-20261019.json)、[桌面统计卡](verification/screenshot-revisions-20261019/ihp-1440.png)、[手机统计卡](verification/screenshot-revisions-20261019/ihp-390.png)。其他本机截图和日志保存在 `D:/JLU-Wiki/.local/screenshot-revisions-20261019/`。
- 当前本地生产预览使用最新 worktree 的构建产物：<http://127.0.0.1:5222/Project/contribution.html>、<http://127.0.0.1:5222/Eagagement/iHP.html>、<http://127.0.0.1:5222/Instrument/hardware.html>。关闭或重启服务后需要重新启动；这不是公网发布。
