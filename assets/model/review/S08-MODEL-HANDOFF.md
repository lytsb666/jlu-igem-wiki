## 2026-10-14 结果图与 Measurement 一致

本轮只调整 `样式/model-revision.css` 的结果图及图注规则，保留 Model 正文、数据、公式、原始图像与链接。对照本分支只读的 Measurement 页面，在 1440 / 390 / 320 宽度核对居中、比例、宽高上限、无边框阴影、字体字号、加粗、颜色及图注间距一致；完整 Model 展示检查在 1440 / 900 / 390 / 320 通过，公式滚动条继续隐藏。报告见 `presentation-checks-20261014.json` 和 `assets/hardware/review/results-checks-20261014.json`。跨模块最新格式由 00 整合，未改 Measurement 或公共文件。

# S08 Model 排版交接

日期：2026-10-13（Asia/Shanghai）。工作区 `D:/JLU—Wiki/IGEMwiki/worktrees/08-instrument`，分支 `codex/08-instrument`，起始工作区干净；本轮基线 `20e90de1b5304c9b0d2539146bf46d447e36970e`。最终 commit hash 见完成消息及本分支最新提交。未操作主仓库、其他 Agent 分支或自行合并。

## 本轮要求与来源

依据用户本轮逐项排版要求及 `C:/Users/UserTech/AppData/Local/Temp/codex-clipboard-b44872fa-5347-40f5-b7d6-f6738873d6c9.png` 中 Reaction Pathway 蓝色标题条示例。科研正文、公式、表格和原图采用当前 Model 页面；其原始来源仍为 `model-source-manifest.json` 记录的 `D:/WeChathis/xwechat_files/wxid_te2sfwdnpar522_2c28/msg/file/2026-10/model(1).docx`（SHA256 028d278917bd7c6c599ed03a4e382a25725a0be523b3cefc4c56fd7be81ac582），未编辑原稿。

仅只读参考本工作区 `Wet-lab/measurement.html`、`样式/measurement.css` 当前结果图规则；不修改 Measurement、科研其他页或公共样式/脚本。

## 实施内容

- 59条完整数学/化学公式在36组中显示；去掉公式容器的框、底色、圆角、阴影，直接呈现在文章背景。全部完整公式使用 block MathML、居中排版，字体统一为现有共享 Math 字体 Cambria Math / STIX Two Math，字号16px、行高25.6px，相邻公式间隔1.25rem。正文中的单个变量、数值常量和表格符号保留行内语义。
- 原来混在6个 a/b/c/d 段落中的17条反应式逐条显示为居中公式，保留全部原编号、符号和顺序。较长公式在本组内横向滚动，保留字号和完整运算符；桌面58条直接适配宽度，1条超长；手机按实际宽度局部滚动，整页不横向溢出。
- 15个蓝色背景小标题去掉色块、边线和内衬，按普通 h4 小标题呈现；原章节标题、锚点和黑色伪代码面板保留。
- 48个引用链接所在方括号引用组改为语义 sup 上角标，链接顺序与引用编号完全一致，正文和表格字号12px，键盘跳转仍有效。
- 3个带 Abbreviation 列的表格中，33个含括号的缩写单元格改为 sub：例如 FG(m) → FG下标m，k(1f) → k下标1f，k(1)(r) → k下标1r。只改变显示格式，大小写与变量内容保持；单位列的括号不变。保留 data-source-abbreviation 供原稿核对。手机表格在自身区域内滚动，避免标题和符号挤成单字列。
- 所有图无附加框、原比例居中、统一居中加粗图注。结果图 Figure 7 按 Measurement 当前 research-chart 规则：最大宽度 min(80%,16rem)、最大高度12rem，仍可打开原图。其余6图为流程/机制图，按 Measurement 普通 research-figure 规则最大高度46rem。源图字节、图号及图注文字未改。
- 本页加上已有 Model 封面作为图标，避免默认 favicon.ico 404；没有新增图像内容。

## 文件清单

修改：`Instrument/model.html`、`样式/model-revision.css`。

新增：`assets/model/review/format_model_presentation.py`、`presentation-checks-20261013.json`、`presentation-content-checks-20261013.json`、本交接 `S08-MODEL-HANDOFF.md`。

新的格式脚本只应用显示调整，可重复运行且不改变第二次结果。旧 `build_model_page.py` 和 `check_revision.py` 属于较早模板记录，不应使用其历史卡片/折叠断言覆盖当前已批准样式。

## 核对及桌面/移动端结果

正式构建通过（842ms），普通/暂存 Git 差异格式检查通过。与本轮基线逐项比较：完整正文与所有表格数值保持、71个 MathML 对象仅显示属性变化（其余节点/符号逐项一致）、48个引用目标及顺序保持、59个ID保持、7张图的地址/尺寸/说明保持、Navbar/Loading/Footer保持。

Headless Chrome 1440/900/390/320视口：整页无横向溢出；59条完整公式检查无框/底色、字体/行距一致，可适配宽度的公式中心位置正确，宽公式键盘滚动通过；15个标题无蓝背景/边线；引用 sup 和缩写 sub 检查通过。Figure7和 Measurement 实际计算样式相同，原图HTTP200且SHA256与本地原稿一致；引用 Enter 跳转到原目标通过。浏览器控制台错误和失败资源请求为零。桌面/手机的公式、小标题、下标表格和结果图截图已目视检查，测试截图仅保存在 `.sites-work/model-format-20261013`。

本轮为显示和内容保全检查，没有重新验证设备、实验或模型性能；原稿已记录的科研口径缺口沿用原 `model-source-manifest.json`，不新增结论。

## 交叉链接与跨模块事项

原 Model 内部目录、旧锚点别名、15条参考文献和原图链接均保持。Software / Hardware / Judging / Measurement 文件均未修改；现有 Judging 路由和科研证据编号未变。跨模块整合仍交00，未自行 merge、cherry-pick、push 或部署。

预览：`http://127.0.0.1:5208/Instrument/model.html`。

00对话工具本轮仍返回 `Invalid app tool request`，无法自动发送，不宣称送达；本交接和最终提交号供00接收。

## 2026-10-13 后续：仅移除公式滚动条

按用户后续要求，在 `样式/model-revision.css` 中对 `.model-equation` 设置 scrollbar-width:none 并隐藏 WebKit 滚动条。36组公式的右侧/底部滚动条不再显示，横向触摸和键盘阅读仍保留。Model HTML、71个MathML对象、公式内容/字号/居中、引用、表格、图与原图入口全部不改。

联动检查在 Hardware 本轮 `image-revision-checks-20261013.json` 中：滚动条计算样式为none、ArrowRight仍可阅读宽公式、MathML数量71。完整来源、文件清单、Hardware图片与已批准文稿修补见同日 Hardware 最新交接；公共样式与脚本未改，跨模块整合仍交00。
