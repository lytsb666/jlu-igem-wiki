# iHP《修改意见3.0》本地修改 · 2026-10-16

来源：用户桌面《修改意见3.0.docx》，SHA-256 `f8972ba3aaed3f952224a10f4e1d5221fbbf3d362391356a7e58bdb39606244d`。用户要求图注相关修改暂缓；本次只执行其余明确项，不把附件示例文字当作新科研文稿。

用户追加确认：圆形流程图替换 Overview 的 **Project illustration**；缩小统计图、替换 Stage 5 首图和照片去白框照常处理，只暂缓图注。Overview 的 Interactive project map 继续待补。

## 实施对照

| 附件条目 | 本地结果 |
| --- | --- |
| How Human Practices Shaped ByeGerm 框内米色 | 正文框内改为 #fbf4eb，保留原外框，不再让 border-image 的白色填充盖住底色 |
| Core／Direct／Indirect 三张翻卡 | 三段原文和原身份不改，正面名称、背面完整说明；鼠标、触控、Enter／Space 翻面，Escape 回正面，原锚点保留 |
| Stakeholder Step 3 展开标志 | 四个原生折叠项右侧显式显示向下箭头，展开后向上；原表格与内容不变 |
| Overview 新图 | 附件 image4.jpeg 原字节放入 Project illustration；原待补锚点保留，未补图注 |
| 四步骤图及互动 | 附件 image5.png 原图，叠加四个可聚焦、可跳转区域，下方文字入口保留，手机可直接使用 |
| 转盘嵌背景、逆时针旋转 | 复用已提供的透明原 PNG，去除共用矩形投影，嵌入米色背景；32 秒逆时针连续转，减少动态时停止，未重新绘制转盘 |
| WHO 引文强调 | 使用金棕色圆角引文卡和顶部装饰；保留原英文和 WHO 署名，没有挪用参考图中的 Einstein 肖像或署名 |
| 九个一级标题框 | 统一米棕层叠条纹标题框，五个 Stage 原副标题和问题保持，问题放最浅棕色框；Summary 也保留标题框 |
| 对话四个小标题独立 | 65 个行内 Context／Dialogue／Reflection／Iteration 拆为上方独立小标题；原来已独立的标题保持。原正文及科学标记不改 |
| 儿童反馈统计图缩小 | 仅该图上限改为 32rem；原 6%／30%／64%、N=50 与原文件保持 |
| Stage 5 第一张图 | 使用附件 image14.png 原字节，保留原位置及原图查看入口，原来无图注的状态保持 |
| 照片两侧白框 | 照片及画廊图片按实际比例自适应，链接框贴合图片；避免固定宽高 contain 带出的宽矩形边框，原照片不裁切、不拉伸 |
| Collective Growth 小标 | 仅删除 Part 1／Part 2 前面的两个 emoji，原标题和其他部分不改 |
| BioAI 的两张未轮播图片 | image91.png 和 image92.jpeg 加入原 image93／94 的画廊，现四张两秒轮播；原 image90 会议照片与全部媒体保留 |
| Closing 与 Summary | 按附件本次明确要求，将原四段 Closing 移到 Expanding 结尾并调整版式；独立 Summary & Reflection 保留空区待补，没有编造总总结。这项新要求覆盖旧交接的整体暂缓 |
| 四个 Step 的框／四个折叠项 | Step 1–4 各有外层圆角框与棕色标签，Step 3 的四个折叠项用较厚边框、交替浅棕底及右侧箭头，与步骤标题区分 |
| C.A.R.E.S. 五标签 | 改为参考图的棕色圆角、深色描边、白色字标签，五项正文继续全部展开 |
| 文件 05 | 只移除 Patents and approvals · 05 的待补文件框；原段落和原科研事实保留 |
| Stage 4 PDF | 只删除 Retrospective patient questionnaire 和 Device operating instructions 两个待补文件框，其他正文不改 |
| 图注相关 | 80 处现有图注源 HTML 和顺序逐项一致；统计与后续范围见 [待办](IHP_CAPTION_PENDING_20261016.md) |

附件开头孤立的“1.”没有实际要求，不据此猜改页面。

## 仍缺资料

第 19 条网页内阅读文档：附件没有 PDF 或嵌入的 Word 文档，页面剩余相关资源仍为 To be provided。本轮已向用户询问文件位置，尚未收到此项回复，因此没有把参考网站的文档当作本站资料，也没有伪造阅读器内容。收到真实文件后可沿用本站 PDF 阅读器，直接嵌入完整原件并保留打开原件入口。

参考网站仅用于确认内嵌阅读形式：[CJUH-JLU-China Human Practices](https://2025.igem.wiki/cjuh-jlu-china/human-practices#ihp-ethics)，不复制其研究内容或文件。现在剩余 16 个原资源待补位置，包含 Overview 地图、评分／回顾文件、同意书及活动材料等。

## 原件、实现与验证

- 页面与交互：`Eagagement/iHP.html`、`样式/ihp-manuscript.js`；新增的页内样式单独放在 `样式/ihp-revision-3.css`，没有改共享页脚、导航、首页或公共图注规则。
- 三张实际使用的附件图片保存在 `assets/human-practice/revision-3-20261016/`，与解包原件字节一致，`source-manifest.json` 保存文档和图片哈希。旧媒体未删除。
- 320 个原带来源标记的正文段落完成对照，除剥离对话标签外原文一致；原来只有“Reflection：”的空标签段提升为标题。全部原 ID 保留，只有用户要求删除的三个文件待补框 ID 删除，无重复 ID。
- 浏览器检查：翻卡三张、键盘及 Escape、四步骤跳转、折叠表格与箭头、BioAI 四图自动切换、逆时针动画与减少动态均通过。1440／1024／390／320px 布局无横向溢出，米色框和 CARES 标签正确，统计图限宽生效，没有脚本错误。
- 逐张复看翻卡、四步骤、WHO 引文、转盘、CARES、标题和 Closing 截图，修正公共样式造成的转盘方形投影、标签满宽及旧 Closing 大写字距；只复查受影响区域。照片补查确认链接框由整行 560px 变为与 156×156px 原照片贴合，原图比例保持；390px 翻卡背面原文完整、无裁切。
- 最终构建和资源检查通过：885 个文件、23 个 HTML、1749 个引用，最大资源 22,559,008 bytes；缺失、超限、不安全项为零，Git 空白检查通过。原始检查、截图及本轮修改前副本在 `.local/revision-3-input/`；来源、要求、图注待办与实施结论保存在仓库文件。

仅本地修改，未提交、上传或发布。预览：<http://127.0.0.1:5221/Eagagement/iHP.html>。
