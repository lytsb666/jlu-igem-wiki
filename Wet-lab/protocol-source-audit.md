# R03 Protocol 来源核对与交接

日期：2026-10-03。仅在 `D:/JLU—Wiki/IGEMwiki/worktrees/03-research`、`codex/03-research` 工作。开始时 HEAD 为 `8444af2dc4e3b2a7971e111100d3b0e9501e0a3b`，工作区干净。

## 文件边界与交付

- `Wet-lab/protocal.html`：只替换本页 main 正文；五项实验按新 Word 顺序更新，补齐 SPN 优化和性能评价。
- `样式/protocol.css`：限定正文换行、表格滚动容器宽度；将配方表列宽规则限定到配方表，新增矩阵行标题样式。字号不变。
- `Wet-lab/protocol-source-audit.md`：本报告。
- `样式/protocol.js` 未修改；原有事件按类名识别新增的两个 SPN 面板。
- Navbar、Loading、Footer、公共 include 在源文件中与开始时逐字节一致。未改共享科研布局、全局样式、构建配置、package/lock、其他业务页面或素材。没有 merge/cherry-pick 其他 Agent。

## 正文来源与编号

唯一实验正文来源：[9.25protocol 英文版.docx](<C:/Users/UserTech/Desktop/9.25protocol 英文版.docx>)。

原稿 SHA-256：`A47932751AEC3E5EC97809C936CEDC230905E5ED88F5DDD9673191DB7B21A6DF`。原件仅只读，副本和核对工具存于工作树忽略目录 `tmp/protocol-r03/`。

辅助定位材料为任务交接目录的 `materials/protocol.json` 和 `materials/protocol-comparison.json`。对比材料显示旧页仅匹配新稿 163 段，不能沿用旧版通用参数。本轮直接读取原 DOCX 的 `word/document.xml`，逐段回查文字、`w:vertAlign`、`w:gridSpan`、`w:vMerge`，未用扁平文本代替最终格式。

以下 B 编号对应 `protocol.json.blocks` 的 1 起始序号，包含非空段落和表格。XML 编号对应原 DOCX body 子节点的 1 起始序号，包含空段落。HTML 中 `data-source-block`、`data-source-table` 供逐项定位，不显示在正文。

786 个非空段落、28 张表均保留；五个实验总标题在该实验的三个面板页眉中重复。唯一正文排版清理为去掉 30 个材料标题中的“折叠”及其括号，并将 SPN 手打的步骤 6/7 转为列表编号，正文不重复编号。没有添加实验数值、配方、公式、结果结论或外部引用。

## 15 个面板对应

原稿实验顺序为 RSV N → hMPV-B N → SPN lytA → BP-IS1663 → HI-omp P6，面板正文按该顺序排列。顶部分类卡片保留原顺序及 ID。

| 实验 | 面板 ID | 原稿块范围 | 实验总标题 | Word 表号 |
|---|---|---|---|---|
| RSV N | `panel-rsv-1` | B2–B33 | B1 | T01 |
| RSV N | `panel-rsv-2` | B34–B106 | B1 | T02, T03, T04, T05 |
| RSV N | `panel-rsv-3` | B107–B169 | B1 | T06 |
| hMPV-B N | `panel-hmpv-b-1` | B171–B202 | B170 | T07 |
| hMPV-B N | `panel-hmpv-b-2` | B203–B280 | B170 | T08, T09, T10, T11, T12, T13, T14, T15 |
| hMPV-B N | `panel-hmpv-b-3` | B281–B343 | B170 | T16 |
| SPN lytA | `panel-spn-1` | B345–B376 | B344 | T17 |
| SPN lytA | `panel-spn-2` | B377–B437 | B344 | T18, T19 |
| SPN lytA | `panel-spn-3` | B438–B500 | B344 | T20 |
| BP-IS1663 | `panel-bp-1` | B502–B533 | B501 | T21 |
| BP-IS1663 | `panel-bp-2` | B534–B594 | B501 | T22, T23 |
| BP-IS1663 | `panel-bp-3` | B595–B657 | B501 | T24 |
| HI-omp P6 | `panel-hi-1` | B659–B690 | B658 | T25 |
| HI-omp P6 | `panel-hi-2` | B691–B751 | B658 | T26, T27 |
| HI-omp P6 | `panel-hi-3` | B752–B814 | B658 | T28 |

## 子章节与新旧排序

各实验 Primer Screening 按新稿直接呈现 Experimental Procedure，不延用旧版 RSV 的 1.1/1.2 分拆或其他旧编号。RSV、hMPV-B 优化顺序为温度 → RNP 比例 → RNP 浓度 → Mg²⁺ 浓度 → Reporter 浓度；SPN/BP/HI 优化仅前四项，没有独立 2.5 Reporter。五项性能评价均依次为 Repeatability → Sensitivity → Specificity → Mechanism Interference Resistance。

| 面板 | 来源子章节（B 编号） |
|---|---|
| `panel-rsv-2` | 2.1 Optimal Reaction Temperature（B57）; 2.2 Optimal RNP Ratio（B66）; 2.3 Optimal RNP Concentration（B76）; 2.4 Optimal Mg²⁺ Concentration（B85）; 2.5 Optimal Reporter Concentration（B96） |
| `panel-rsv-3` | 3.1 Repeatability（B130）; 3.2 Sensitivity（B140）; 3.3 Specificity（B150）; 3.4 Mechanism Interference Resistance（B160） |
| `panel-hmpv-b-2` | 2.1 Optimal Reaction Temperature（B227）; 2.2 Optimal RNP Ratio（B237）; 2.3 Optimal RNP Concentration（B247）; 2.4 Optimal Mg²⁺ Concentration（B257）; 2.5 Optimal Reporter Concentration（B269） |
| `panel-hmpv-b-3` | 3.1 Repeatability（B304）; 3.2 Sensitivity（B314）; 3.3 Specificity（B324）; 3.4 Mechanism Interference Resistance（B334） |
| `panel-spn-2` | 2.1 Optimal Reaction Temperature（B400）; 2.2 Optimal RNP Ratio（B409）; 2.3 Optimal RNP Concentration（B419）; 2.4 Optimal Mg²⁺ Concentration（B428） |
| `panel-spn-3` | 3.1 Repeatability（B461）; 3.2 Sensitivity（B471）; 3.3 Specificity（B481）; 3.4 Mechanism Interference Resistance（B491） |
| `panel-bp-2` | 2.1 Optimal Reaction Temperature（B557）; 2.2 Optimal RNP Ratio（B566）; 2.3 Optimal RNP Concentration（B576）; 2.4 Optimal Mg²⁺ Concentration（B585） |
| `panel-bp-3` | 3.1 Repeatability（B618）; 3.2 Sensitivity（B628）; 3.3 Specificity（B638）; 3.4 Mechanism Interference Resistance（B648） |
| `panel-hi-2` | 2.1 Optimal Reaction Temperature（B714）; 2.2 Optimal RNP Ratio（B723）; 2.3 Optimal RNP Concentration（B733）; 2.4 Optimal Mg²⁺ Concentration（B742） |
| `panel-hi-3` | 3.1 Repeatability（B775）; 3.2 Sensitivity（B785）; 3.3 Specificity（B795）; 3.4 Mechanism Interference Resistance（B805） |

## 28 张表逐项核对

行数包含表头；列数为 Word 的底层网格列数，不能当作可见单元格数。T08 有 6 格底层网格，使用不同横向跨度组成 Module / Component / Volume 三个表头；保留原有跨度，不擅自扁平化为普通 3 列。

| 表号 | 面板 / 章节 | B / XML 编号 | 行 × 网格列 | 纵向合并起点 | 页面 colspan 数 |
|---|---|---|---|---|---|
| T01 | `panel-rsv-1` / Reaction System | B25 / XML 29 | 18 × 3 | 3 | 4 |
| T02 | `panel-rsv-2` / Reaction System | B56 / XML 66 | 18 × 3 | 3 | 4 |
| T03 | `panel-rsv-2` / 2.2 Optimal RNP Ratio | B70 / XML 84 | 5 × 6 | 0 | 0 |
| T04 | `panel-rsv-2` / 2.4 Optimal Mg²⁺ Concentration | B92 / XML 111 | 5 × 6 | 0 | 0 |
| T05 | `panel-rsv-2` / 2.5 Optimal Reporter Concentration | B103 / XML 126 | 5 × 6 | 0 | 0 |
| T06 | `panel-rsv-3` / Reaction System | B129 / XML 157 | 18 × 3 | 3 | 4 |
| T07 | `panel-hmpv-b-1` / Reaction System | B194 / XML 237 | 17 × 3 | 3 | 4 |
| T08 | `panel-hmpv-b-2` / Reaction System | B225 / XML 274 | 12 × 6 | 2 | 23 |
| T09 | `panel-hmpv-b-2` / 2.1 Optimal Reaction Temperature | B231 / XML 283 | 5 × 3 | 1 | 0 |
| T10 | `panel-hmpv-b-2` / 2.2 Optimal RNP Ratio | B241 / XML 296 | 5 × 5 | 0 | 0 |
| T11 | `panel-hmpv-b-2` / 2.3 Optimal RNP Concentration | B251 / XML 310 | 5 × 6 | 0 | 0 |
| T12 | `panel-hmpv-b-2` / 2.4 Optimal Mg²⁺ Concentration | B261 / XML 323 | 5 × 3 | 1 | 0 |
| T13 | `panel-hmpv-b-2` / 2.4 Optimal Mg²⁺ Concentration | B265 / XML 328 | 5 × 6 | 0 | 0 |
| T14 | `panel-hmpv-b-2` / 2.5 Optimal Reporter Concentration | B273 / XML 341 | 5 × 3 | 1 | 0 |
| T15 | `panel-hmpv-b-2` / 2.5 Optimal Reporter Concentration | B277 / XML 346 | 5 × 6 | 0 | 0 |
| T16 | `panel-hmpv-b-3` / Reaction System | B303 / XML 378 | 17 × 3 | 3 | 4 |
| T17 | `panel-spn-1` / Reaction System | B368 / XML 461 | 16 × 3 | 3 | 4 |
| T18 | `panel-spn-2` / Reaction System | B399 / XML 497 | 16 × 3 | 3 | 4 |
| T19 | `panel-spn-2` / 2.2 Optimal RNP Ratio | B413 / XML 516 | 4 × 7 | 0 | 0 |
| T20 | `panel-spn-3` / Reaction System | B460 / XML 574 | 16 × 3 | 3 | 4 |
| T21 | `panel-bp-1` / Reaction System | B525 / XML 657 | 16 × 3 | 3 | 4 |
| T22 | `panel-bp-2` / Reaction System | B556 / XML 697 | 16 × 3 | 3 | 4 |
| T23 | `panel-bp-2` / 2.2 Optimal RNP Ratio | B570 / XML 716 | 4 × 7 | 0 | 0 |
| T24 | `panel-bp-3` / Reaction System | B617 / XML 775 | 16 × 3 | 3 | 4 |
| T25 | `panel-hi-1` / Reaction System | B682 / XML 858 | 16 × 3 | 3 | 4 |
| T26 | `panel-hi-2` / Reaction System | B713 / XML 896 | 16 × 3 | 3 | 4 |
| T27 | `panel-hi-2` / 2.2 Optimal RNP Ratio | B727 / XML 914 | 4 × 7 | 0 | 0 |
| T28 | `panel-hi-3` / Reaction System | B774 / XML 972 | 16 × 3 | 3 | 4 |

分布：RSV 6、hMPV-B 10、SPN 4、BP 4、HI 4。所有行、非续行单元格文字、数值精度、单位、rowspan/colspan 均与原 XML 对应。保留 47 个纵向合并起点及 79 个实际 colspan；原 Word 有 81 个 gridSpan 标记，其中 2 个在纵向合并续行占位中，不重复输出单元格。

129 处 Word 上下标运行格式全部保留，包括 F/R 引物编号、10⁰–10⁵ 和五项抗干扰步骤的 10³。原稿中的 Unicode Mg²⁺、MgSO₄、ddH₂O、μL、μM、nM、mM、°C 同时逐格逐段校验，没有把指数并成普通数字。Word 未含图片、超链接、批注或修订。

## 原稿疑点，交 00 审核

以下均保持原文，仅列出需要作者说明的地方，不据常见实验配方自行修正。

1. **母液批量与单管体积的关系未写清。** T01/T02/T06 的 RPA 项为 4.39 + 4.39 + 23.22 = 32 μL，而 RPA Premix 写单管 7 μL；T17/T18/T20/T21/T22/T24/T25/T26/T28 为 3 + 3 + 18 = 24 μL，单管仍写 7 μL。需要说明批次份数、余量或其他加入成分，不能把整批量视为单管量。hMPV 的 24 μL / 单管 8 μL 同样应标注批量语义。
2. **储液与最终浓度计算依据不完整。** 比例表写 Cas12a:gRNA，但原稿未注明两者储液浓度，因此体积比不能单独证实摩尔比。MgSO₄ 储液浓度也未写明。RSV 的 RNP 浓度梯度（B79）和 SPN/BP/HI 的梯度（B422/B579/B736）未附各梯度配方/稀释表，不能从统一基础表复算。
3. **hMPV Reporter 配方需注明储液切换。** T15 明确使用 100 μM Reporter、加入 0.05–0.40 μL；T07/T08/T16 的 ssDNA Reporter 为 2 μL，未注明浓度或预稀释方法。不能默认这 2 μL 与 T15 使用相同储液，也不能推断最终浓度。
4. **仪器程序不完整。** 原稿列出温度与 40/50 cycles，但未给每周期时长、荧光通道和读取间隔。本轮没有从 Results 或旧正文拼入这些条件。
5. **抗干扰基质配方与章节用词。** B166/B340/B497/B654/B811 使用 saliva-lysis-buffer-water solution，未给三者比例及处理说明。章节名称均为 “Mechanism Interference Resistance”，是否意指 matrix interference resistance 需作者确认，暂保留原词。

## 跨页面一致性，交 00 整合

只读核对工作树当前 Design、Results、Measurement 和 Part；未修改这些页面。五个目标类别与 Design/Measurement 的五病原体范围一致；本稿明确限定 hMPV-B 及各模拟质粒靶基因。存在下列正文版本差异，不能据此擅改新 Protocol 或旧 Results：

- **RSV 温度/周期：** 新 Protocol 的优化和性能步骤多数写 41 °C、50 cycles（如 B74、B137、B148）；Results 的优化步骤写 40 cycles，性能评价程序写 40 °C、50 cycles。
- **RSV Mg²⁺ 单位：** 新稿 T04 为 5–25 mM；Results 的最优条件文字写 “25 nM”。该数量级差异需来源作者核定。
- **hMPV 梯度：** 新稿比例 B240/T10 为 1:0.8、1:1、1:1.2、1:1.5；Results 的比例梯度为 3:1、2:1、1:1、1:2、1:3。新稿 RNP 为 50/100/150/200/300 nM（B250/T11），Results 为 25/50/100/200/300 nM；新稿 Mg²⁺ 为 16/18/20/22/24 mM（B263/T13），Results 为 5/10/15/20 mM；Reporter 梯度新稿包含 250 nM，Results 包含 1500 nM。
- **hMPV 周期：** 新稿为 50 cycles；Results 相关优化为 40 cycles。新稿 T16 的 Cas12a/gRNA 为 0.3/0.24 μL，Results 最优比例文字为 1:1；在储液浓度未明确前，不把二者直接判为相同或不同摩尔比。
- **引物名称映射：** 新 Protocol 使用 F/R 编号（如 RSV F1R2），Part 使用 HRSV S1/A2 等命名，尚无编号别名或序列对应表。本轮不新增 Registry ID、链接或推测对应关系。

## 验证结果

- 来源完整性：786 段、28 表、129 处上下标、所有实际单元格文字/数值/单位及合并跨度逐项核对通过；15 个面板表数依次为 RSV 1/4/1、hMPV 1/8/1、SPN/BP/HI 各 1/2/1。
- 边界：49 个原有正文 ID 全部保留；仅增加 SPN 2/3 的 panel、index、heading 共 6 个 ID，无重复或失效控制关系；正文之外的公共 HTML 与基线逐字节一致。
- 构建：使用原有 `build` 脚本（`vite build --configLoader runner`），退出码 0，Vite 8.1.3；依赖按现有 package-lock 安装，配置与锁文件没有变更。
- 桌面浏览器：15 面板/28 表均可达，单面板展示、分类展开/收起、标题焦点、返回目录焦点、设备折叠通过；控制台 error/warn 为 0。
- 键盘：全部 15 面板使用 Enter/Space 打开、再次关闭和返回通过；分类与试剂 details 的 Enter/Space 切换通过；表格可聚焦，ArrowRight 可横向滚动。
- 320 px 与 390 px：各 15 面板全检，合计 56 次表格检查；试剂列表展开时正文无水平溢出，所有表均在自己的容器内滚动。测试后恢复浏览器默认尺寸。
- 可视检查：桌面查看 RSV 10³、hMPV T08 合并格；窄屏查看 SPN 七列比例表与滚动条。Word 内容回查采用 OOXML；未复现 Word 的分页版式（当前 Windows 未提供 bundled LibreOffice），不据 Word 页码推断内容。
- **深链接限制：** 历史 ID 存在且保留；直接加载 `#panel-spn-3` 后，目标仍 hidden，未自动展开。现有 protocol.js 不读取 hash；本轮保持既有脚本行为，没有把 ID 保留误报为自动展开通过。是否补齐 hash 初始化/导航由 00 确认后安排。
- 日历：Protocol 无日历组件，本轮未改 Notebook，未验收其日历。
- 原图与 Registry：原 DOCX 无图或链接，Protocol 正文无原图/Registry 入口，因此本轮无新增项可验证；不声称其他页面素材或 Registry 链接已通过。

## 公共依赖与交接送达状态

内容和表格无需新增公共依赖。旧静态 Navbar 的 Attribution 标记、全局光标/字号/Loading 等保留，按 README 由 00 接续处理。跨页数值与引物名称映射同样由 00 协调来源作者。

对话列表工具返回 `Invalid app tool request`，未取得 00 的对话 ID，未自动发送消息。交接已准备于本报告及最终回复，不能表述为已送达。提交 hash、实际文件清单和最终 Git 状态见最终交接回复，供 00 整合。
