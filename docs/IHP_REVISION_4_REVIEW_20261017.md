# iHP 4.0 与分章、页脚修正 · 2026-10-17

用户先要求理解四项显示修正，之后明确 Measurement 两个条目都带星号，授权与本次附件一起本地实施。来源为 `ihp4.0.docx`、`ihp文件.zip` 及两张聊天截图；附件只在指定页面和范围用于实施。现有分支 `codex/site-refinements-20261016` 的未提交成果全部保留，本次没有提交、上传或发布。

## 页面修改

- Protocol 的五个病原体章节改为五张白色正文卡片，以空白隔开；连续长页面、实验文字、数值、表格、路径与旧锚点保持。去掉上一轮米色底和粗棕顶边。
- 左侧人物目标改为实时文档底部，滚动时重新读取页面高度，兼容延迟媒体与高于视口的手机页脚。滚轮、触控、键盘与指针输入立即中止程序滚动；减少动态时直接定位。右侧回顶、角色、安全留白与 Model 状态逻辑保持。
- Measurement 的 Box 与 How do we achieve the D-B-T-L cycle 两项都带星号，正文和目录一致。参考文献沿用原来的排版、角标和跳转，保留前一轮仅增加 s 的 References 标签，不重写引用脚本。
- iHP Medical Institutions 默认选中：矩阵点、类别按钮和原有十位人员同时对应，其他九类仍可切换。
- 四步骤图片用 SVG 可撤销窗口只显示原四卡和箭头，去掉外围画布、最外框和下方重复导航；四个原锚点与可聚焦图内入口保持。未改 PNG 或生成替代科研图。
- Expanding 的 Opening 原标题和四段原文整体使用与 Closing 相同的米棕色框，未移动 Closing 或填写独立 Summary。
- 按用户追加确认，整个 Collective Growth 只留附件 `word/media/image3.png` 的指定照片，放在 US-China 峰会原两处待补图片的位置。其余 18 张图从页面展示中移除，原文件保留；各活动文字、标题与网页入口保留。原 14 条随图说明一同移除，剩余 66 条图注原字保持，未补写新图注。
- SBti 链接替换 Part 4 / Public Engagement 的原网页待补位置，网址为用户提供的 `https://sbti-hkustgz-jlu.netlify.app/`，可在新窗口打开。
- 页脚人物作为棕色栏后方的独立图层，上移约 26px（手机约 16px），下部被页脚自然遮挡，保留轻摆、投影及减少动态支持。校徽仍在前方跨边界三分之一，导航与四码等原布局保持。
- 修正页脚导航被公共正文链接增强附加固定字号的问题：导航使用原有响应式 UI 规格，1024px 桌面略收紧左右内边距，整组导航及子页同一行且完整可见；手机自然换行。避免窗口从宽到窄变化后链接超出页面。

## 附件资源映射

站内资源位于 `public/ihp-resources/revision-4-20261017/`。文件 SHA-256、原路径、转换方式、页数和目标锚点记录在 [source-manifest.json](../assets/human-practice/revision-4-20261017/source-manifest.json)，不依赖微信临时目录。八份原 PDF 复制后字节一致；四份 Word 原件同时保存，用 Microsoft Word 的完整文档导出生成网页 PDF，没有改写或删页。

| 压缩包材料 | 网页位置 | 完整页数 |
| --- | --- | --- |
| 01pi打分依据.docx | Stakeholder scoring criteria · 01 | 3 |
| 02详述.pdf | Stakeholder review and adaptation · 02 | 30 |
| 03养老院.docx | Informed consent · 03 | 7 |
| 04幼儿园.docx | Informed consent · 04 | 6 |
| 01Inclusive Engagement 活动1pdf.pdf | Kindergarten safety resource · 1 | 2 |
| 02Inclusive Engagement 活动1.pdf | Kindergarten safety resource · 2 | 2 |
| 03Inclusive Engagement活动1.pdf | Kindergarten safety resource · 3 | 2 |
| 04Inclusive Engagement活动三pdf.pdf | Older-adult education resource · 4 | 4 |
| 05盲文活动四.docx | 视障活动唯一完整盲文阅读器 | 56 |
| stage401回溯性共情问卷.pdf | Stage 4 患者问卷说明后 | 2 |
| stage402说明书.pdf | Stage 4 第一代仪器迭代后，ByeGerm 1.0 | 4 |
| stage405放说明书.pdf | Stage 4 最后 Instructions 后，ByeGerm 2.0 | 5 |

共 12 份 PDF、123 页。盲文原 DOCX 的保存页数就是 56 页，转换结果一致，不压缩成摘录。两个设备手册按文件实际内容分别接入，未把 2.0 手册误放到卡牌说明位置。所有阅读器沿用棕色折叠栏、默认收起、完整原 PDF 和打开原件入口，没有附加下载栏。

原 `pending-braille-comparison` 与 `pending-summit-poster` 留作别名锚点。仍缺实际资料的三处保持待补：Overview Interactive project map、Community Collaborative Emergency Response Guide、Card game instructions。没有借用外站资料或编造内容。

## 检查

- 源码核对：iHP 所有带来源标记的原正文段落逐项一致，没有重复 ID；除用户明确移除照片的板块外，剩余图注文本和顺序一致。原图片和 PDF 不改字节。
- 转换的四份 PDF 共 72 页已渲染检查，中文、英文、表格和盲文正常；保留完整原件和来源哈希。新照片与附件字节一致。
- 33 项针对性浏览器检查通过：默认 Medical Institutions 及十位人员、类别切换、四步骤键盘跳转、12 个默认收起的完整阅读器、Opening 同色、新照片大图入口、SBti 链接、三处待补、四种宽度下直达真实底部（包括途中延迟增加 570px）、用户输入中止、减少动态、Protocol 五章白底／留白、Measurement 双星号和原引用效果。1440／1024／390／320px 页脚 20 个导航链接完整、无整页横向溢出，没有脚本错误。
- 正式构建通过：867 文件、23 HTML、1727 资源引用，最大资源 22,559,008 bytes；缺失、超限、不安全资源均为零。原图仍留在源码，只因本轮删除展示而不再打入无引用的构建资源。
- 构建预览额外确认 iHP 12 个阅读器／默认类别／裁切窗口正确，逐份 HTTP 获取的 12 个 PDF SHA-256 均与保存原件一致；Homepage、Member、Model 在 1440／1024／390px 的页脚 20 个链接全部可见，无横向溢出。Model Hardware 切换状态及 URL 在直达底部再回顶后保持；首页仍实测 30:00 → 29:57。
- 八份原 PDF、四份原 DOCX 与压缩包逐项哈希一致，新照片与 Word 内图片哈希一致；Git 差异空白检查通过。只核对本轮影响范围，没有重跑旧页面生成器或再次全站回归。
- 本轮原始数据、脚本与截图位于被忽略的 `.local/ihp4-20261017/`，长期要求、来源和结果保存于仓库文件。

本地预览：[iHP](http://127.0.0.1:5221/Eagagement/iHP.html)、[Protocol](http://127.0.0.1:5221/Wet-lab/protocal.html)、[Measurement](http://127.0.0.1:5221/Wet-lab/measurement.html)。本轮未上传或发布。
