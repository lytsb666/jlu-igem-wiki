# 2026-10-14 全站封面与引用及 Model 和 Measurement 整合验收

本轮由用户本人明确要求整合 08 / 05 最新修改，并增加全站引用、静态子页面封面、Education 展示、Model 双模块及 Measurement Engineering 说明框。基线为已发布 main `d763a43`。工作分支为 `feat/00-headpages-education-20261014`；本轮先交付本地预览，没有 push、创建 PR 或更新 Cloudflare。

## 最终改动

- 审查并仅取 08 的 `a19a7a3`、05 的 `48198bf` / `8965820` 增量。08 病原检测六张原图、图文来源和高度规则，05 活动计划、Gene Wars 原型和指南、完整图片浏览及白色内容框均保留。08 中与最新 main 冲突的旧 Model 缩图规则未重新引入，现有 Measurement 对齐尺寸保持。
- 18 个具有静态 headpage 的子页面采用 Design 格式：原插画横向覆盖，页面名称在左下，原有或从现有页面内容提取的特点位于右下黑色圆角框。手机采用上下错开的位置，避免标题与特点重叠。原封面说明、教育循环入口和统计转入封面下方内容区；Team / Homepage 的合照和叙事场景保留。历史跳转入口继续指向共享正文。
- 参考文献序号使用中括号，原 DOI、现有地址及核实后的机构 / 出版物地址在条目后显示为可点击链接。保留原引用文字、顺序和旧锚点；正文中有对应条目的单个引用序号可跳转。Model 的两个模块分别使用各自参考文献，避免相同数字跳到另一个模块。
- Education 保留 24 个活动卡片、三类社区、DBTL、反馈与图库，活动计划和 Gene Wars 的 27 份原 PDF 使用默认折叠、棕色标题栏、整本原 PDF 阅读及打开 / 下载入口。修正白色继续发展内容区的文字颜色，移除正文章节的装饰前置编号。
- Model 同页提供 `Model for Measurement` / `Model for Hardware` 两个按钮和原创 SVG 图标。切换具有当前状态、键盘方向键 / Home / End / Enter、触控、减少动画、深链接和历史恢复；隐藏模块不接收焦点。原序列排序、反应动力学、71 个 MathML、三个始终展开代码面板、七张原图及全部旧锚点保留。
- Hardware Model 来自用户后续明确指定的《Hardware的Model竞赛页面.docx》：93 个非空源段落（首行 Model 用模块名称承载）、19 个编号图、13 个原始 PNG、三张数据表。按 Word 的实际裁切参数显示对应图段，完整原图可打开，图像字节不重绘或压缩，显示宽度不超过可见原图像素。保留数据集划分、检测置信度解释、重复拍摄不等于独立实验、BP / HI 尚未覆盖等原文限定。
- Hardware Model 底部按用户顺序增加五条文献。两条只有标题的文献通过 PubMed 确认 DOI；五条的作者、标题和出版信息核对 Crossref 出版者登记记录。Hardware 页的荧光分析 Model 链接指向新模块。
- Measurement 在原 `#section-1` 前增加白色 Engineering 内容框及目录入口，完整保留《Measurement_Engineering_box.docx》的八个非空段落。前三个数字条目使用既有圆形编号 / 四圆点组件；未编号的 Human Practices 段落不擅自新增编号。Engineering 跳转可用，原各章编号、候选表和 Reference 默认收起保持。

## 来源

Hardware Model 的段落、图号、裁切、图片哈希与五条文献在 `assets/model-hardware/review/source-manifest-20261014.json`；Measurement 说明框原段落和文档哈希在 `assets/research/2026-10-14-measurement/engineering-box-source.json`。Education 来源清单沿用 `a  图片/education/source-manifest.json`，08 病原图来源沿用对应交接和来源清单。本轮没有执行旧页面生成器，也没有同步覆盖其他 worktree。

五条新文献的固定地址如下，顺序与用户一致：

1. https://doi.org/10.1016/j.talanta.2024.126441
2. https://doi.org/10.1016/j.talanta.2023.125458
3. https://doi.org/10.1016/j.aca.2023.341956
4. https://doi.org/10.1021/acsnano.3c10181
5. https://doi.org/10.1038/s41598-024-59558-7

## 验证与保护

- 正式构建执行 `package.json` 中的 Vite build 命令及 `node scripts/check-build.mjs`：25 个 HTML、727 个文件、1729 处本地资源引用；缺失、超限、不安全文件均为零，最大文件 22,559,008 字节。
- 25 入口 × 1440 / 390 / 320px 共 675 项回归通过：封面完整覆盖、文字不重叠、导航无下划线、参考文献链接、中括号、资源、唯一 ID、页面无横向溢出，以及 Model / Measurement / Education 的专项行为和源内容保护。浏览器 JavaScript 与本地 HTTP 资源错误均为零。
- 另 73 项交互与资源检查通过：Education DBTL 与键盘、图库原图与方向键 / Escape、PDF 原字节 HTTP 哈希，Model 按钮 / Enter、局部表格横滚、五条文献顺序与 Hardware 跨页链接。触控会话覆盖 390 / 320px。
- 正式构建预览另完成 98 项检查：25 个入口的 HTTP / 视口 / 引用地址，三种宽度的 Model 深链接及正确目录层级、图像不超过原像素、Measurement 白框与 Reference 状态、Education 活动与 PDF 全集。控制台和资源错误均为零。
- 675 项中的源码保护确认原 Measurement Model 内部 HTML 保留，原 Measurement 现有 `data-source-block` 文字均相同，新 Hardware Model 的所有原文段落和图注对照通过；13 张新原图的 SHA256 相同。页面和资源验收不代表重新开展实验或训练评估。
- 主控原未跟踪 `JLU_WIKI_CONTROL_LEDGER.md`、`assets/human-practice/review-2026-10-03/` 保留；01 首页原六项修改和两个未跟踪素材目录保留，其他 worktree 没有切换分支或批量同步。main 发布工作区继续保留。

证据、测试脚本和截图：`D:/JLU—Wiki/IGEMwiki/tmp/site-headpages-education-20261014/`。开发预览端口 5221，正式构建预览端口 5222；服务使用前仍需核查。

## 后续发布

公网当前基线仍为此前的 `d763a43`。后续用户授权上传时，按所有者直接验收规则保留 PR，等待 `wiki-build`，采用 merge commit，再从干净 main 的发布 worktree 更新固定 `jlu-igem-wiki-preview` 项目。接管时读取的 GitHub `PAGES_DEPLOY_ENABLED` 为 `true`，与旧文档中的关闭记录不同；上传前检查实时配置与当轮发布范围，不能声称自动发布已经关闭。
