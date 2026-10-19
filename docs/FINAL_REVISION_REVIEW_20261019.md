# 最终附件修改与 IHP 阅读器修复

基线为 2026-10-19 从 GitHub 获取的 `origin/main`，提交 `e35de4f7ab90b68e464684bdc1a807c0ce5e87ff`（PR #14）。本地独立目录为 `D:/JLU—Wiki/IGEMwiki/revision-20261019`，分支 `feat/00-final-revisions-20261019`。原 Wiki 工作区、旧 main worktree 及未提交资料均保留。

## 修改清单

- Measurement：删除 2.2.2 d) 下 i)／ii) 两个标题冒号；工程循环标题的 achieve 改 Implement；第 4–7 章改为 Application to…Gene Detection and Performance Characterization；第 9 章改 Towards the Future of Global Health；目录同步。
- Protocol：五个病原体 gene 主标题及对应目录加 Detection of。Parts：只在 Pathogen-Specific Parts 的指定表头加 Gene。Contribution：第三个封面词改 iGEM spirit。
- Model：两个模块及封面关键词改 Assay Modeling／Instrumentation Modeling，默认显示后者；原模块锚点和 Assay 深链接保持。Hardware 的 Explore more 两个入口不改。
- Software：Figure 2 换《Hardware&Software修改(1)》嵌入的原 JPEG，展示和原图入口一致，原图注保持。
- Hardware：Table 1 指定单元格只保留 Fixed observation area.；Scope and method 中第二／三段逐字按新稿替换；删除指定四段高亮补充说明；结尾 want 改为 strive to enable，指定位置加入完整奖项关联段落。其他表格数据、手册、视频及科研参数保持。
- IHP：统计图按《最后ihp改(1)》换五项原生卡片；从 PowerPoint 按原页面比例导出 3200px 图，通过 SVG 窗口显示原卡片，完整原图保留。WHO 白泽放大贴底；Overview 结尾原两句话改二级标题同号 16pt，人物和文字在展示区固定时从右向左走完，小屏自然换行，减少动态时静态完整显示。
- IHP：重放 LISTEN／Wet lab 两个提示图标；Step 4 文档前加原伦理访谈照片和 An Interview on Ethics with Professor Li Hui 图注；后续图号／编号 alt 顺延为 Figure 1–103。删除 Stage 1 的 Additional questionnaire material。Summary 按《wiki最终修改》替换明确标记的句子，其余段落保留。
- Sponsor：保留原高清图、品牌原色和原比例，清理 SVG 重复形态滤镜，减少小字笔画粘连；仍为七个标志、原顺序／尺寸、42 秒连续滚动。

用户随后追加的 Measurement 第九章长段落已按其最新撤销指令取消，最终源码中不存在该段落。

## IHP 文档问题的结论

原实现把 PDF 直接放进 iframe，依赖浏览器自身的 PDF 阅读能力。Chrome 设置“下载 PDF”或缺少相应插件时，这种嵌入显示为原生打开占位，点击走下载路径。这是网站对浏览器环境兼容不足，不能归咎于访问者操作，也不是原 PDF 丢失。

本轮只为 IHP 加入同源自托管 Mozilla PDF.js 5.6.205。库、worker、中文 CMap、标准字体及 WASM 均随站部署；不向第三方传文档，不依赖外部 CDN。展开标题栏后直接阅读原文，支持滚动、文字选择、完整页码、前后页、缩放、适合宽度和 Original PDF。14 份原文件完全不变，共 145 页；其他页面继续原阅读方式。

在独立 Chrome 配置中关闭原生 PDF 预览，实测 `navigator.pdfViewerEnabled === false`：原生 iframe 出现 PDF 打开占位；新阅读器的 14 份文档首页和末页全部渲染，通过翻页和手机适配检查，没有自动下载或脚本异常。桌面 Edge 同样通过。

实现依据：[Mozilla PDF.js 官方示例](https://mozilla.github.io/pdf.js/examples/)。第三方许可和版本说明保存在 `public/pdf-viewer/`。

## 来源和验证

本轮三份 DOCX 和两份 PPTX 原件、来源 SHA-256、替换图、透明人物及原统计图在 `assets/revision-20261019/`；旧图和原始 PDF 没有删除。Sponsor 衍生显示及来源清单在 `assets/site-footer/sharp-20261019/`。

检查覆盖 iHP 1440／390／320px，普通和减少动态；WHO 框、两处提示、五卡、访谈图、103 条图注、PDF 展开／末页、Model 默认及原 Assay 深链接，以及其他受影响页面的手机溢出。最终构建资源检查没有缺失、超限或不安全文件，`git diff --check` 通过。源表格对照只允许 Hardware 的指定单元格和 Parts 的指定表头变化。

公共责任人 00；构建和发布责任人 10。用户已明确授权上传仓库和更新公网，按 CONTRIBUTING 中所有者本人授权的既定规则，在检查通过后通过 PR／wiki-build／merge commit 验收，由既有 Actions 更新同一个 `jlu-igem-wiki-preview` Pages 项目。没有修改工作流、密钥或发布开关，不调用 iGEM 官网发布流程。

公网固定地址：[jlu-igem-wiki-preview.pages.dev](https://jlu-igem-wiki-preview.pages.dev/)。本轮 PR、CI 和部署结果由对应 GitHub PR／Actions 留存；交付 Word 修改说明另附。
