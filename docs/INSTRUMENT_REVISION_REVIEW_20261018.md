# Software 与 Hardware 1018 新稿修订

用户在上一版本发布完成后提供《Software修改1018最终版.docx》《Hardware 修改1018.docx》。本轮按同一对话的文稿修订范围落实明确改动；参考截图仅定位，不恢复截图中的浏览器双语翻译、旧页面排版或旧图号。

基线为已合并／发布的 PR #13，`baea53e0c86389add0afc7293f746cb45abc6abf`。当前本地分支 `codex/software-hardware-20261018`；无关的 `docs/JUDGING_ASSESSMENT_20261017.md` 保持原状。

## Software

- 截图明确指向 Architecture 的原 Figure 3，图注改为 `Figure 3. Application Design Architecture`；原架构图保持。
- 采纳文档内的建议，在 Validation 加入 Model 图像分析验证／盲测入口，链接到已有 `model.html#hardware-model-section-107`。目标为 Model for Hardware → Validation and Blind Testing，不改模型验证数据或 Software 已有验证说明。

## Hardware

- Development Timeline 原 SVG 文件未丢失；浏览器实测原链接及图片盒为 0 × 0。原因是只有 viewBox 的 SVG 在原 fit-content 图片链接内发生宽度收缩。为这一张图明确设置链接和图片宽度，恢复完整原生矢量图及点击原图入口。原时间线无图注的既定要求保持，不重新绘制数据或恢复已删除图注。
- Table 2 全部内容保留，以正常 12pt 字号、紧凑单元格和按内容宽度排版避免横向拖动。本表是单行表头规则的明确例外：桌面允许表头按整词换行；容器不足 620px 时逐行展示同一表格的三个字段，左侧要求作为棕色标题，两个说明字段显示各自原表头。保留原生表格／表头及全部单元格，不用缩小字体或截断信息来塞入手机。
- Figure 3 图注按新稿替换为 `Photograph of the metal reaction tube support block, cooling fan, and optical filter components`；同步已有编号 alt。
- 删除截图高亮的四级 LED 电量指示器一句；此前的电池、保护、供电优先级及快充参数保持原样。
- Figure 9 换为附件嵌入 `word/media/image6.jpeg` 的完整原字节（1014 × 239），说明改为 `Schematic of the image analysis workflow`。移除只适用于旧竖图的裁切参数；新图完整等比，原旧图文件保留。
- 用户手册附近完整显示 `Detailed operating instructions are provided in the user manual.`；复现指南附近完整显示 `Further details are provided in the reproduction guide.`。同时修复同页两代共四处同类缺词：原段落里的 PDF 链接经公共增强转换／清除后会留下 `provided in the .`。现在保留完整正文，并把相同原链接单独交给既有完整阅读器处理，没有新增图下下载行。
- 第二代操作流程原图补 `Figure 19. Operation proceeds through connection, loading, running the device, and viewing results`；原相同正文句移入此图注，不重复显示。后续三图及正文引用顺延为 20／21／22；其他图号和六张表号不变。

## 来源与检查

完整原始 DOCX、替换图、哈希和来源说明保存在 `assets/instrument-revision-20261018/`。其余截图及原时间线 TIFF 均完整保留在原 DOCX 内。仅新增一张网页媒体，时间线继续使用原 SVG。

- 源对照：两页全部旧锚点、六张 Hardware 表格的每个单元格、两页所有 PDF 地址、视频及其余图片保持。仅指定 Figure 9 换图；新增的 Model 链接定位现有小节。
- 页面检查覆盖 Hardware 1440／901／390／320px、Software 1440／390px；核对时间线可见、表格无内部横向溢出、正常字号、22 条连续图注、完整说明句、替换图比例、手册展开和 Model 跨模块定位。截图与临时检查在本机 `.local/instrument-revision-20261018/`。
- 最终构建版六组检查通过，无脚本错误或整页横向溢出。1440px 下时间线为 916.8 × 515.7px（此前为 0 × 0）；Table 2 高度从约 594.9px 收紧到 505.3px，所有单元格仍为 16px／12pt。窄容器的要求标题完整占满每项宽度，320px 仍不产生横向拖动。Software 链接在两种宽度均自动切到 Model for Hardware，并定位到 Validation and Blind Testing。
- 全站构建与资源边界检查通过：974 文件、23 HTML、1797 引用，最大资源 22,559,008 字节，无缺失、超限或不安全文件；差异检查通过。

本轮为本地修改，未提交／上传／发布。上一版本的上传授权和成功发布记录不自动延续至这两份新稿。
