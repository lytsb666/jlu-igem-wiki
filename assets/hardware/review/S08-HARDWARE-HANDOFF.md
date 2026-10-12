# S08 Hardware 交接记录

日期：2026-10-12，Asia/Shanghai。工作区：`D:/JLU—Wiki/IGEMwiki/worktrees/08-instrument`；分支：`codex/08-instrument`。开始时工作区干净，HEAD 为 00 同步后的 `9d72d2f`；保留此前 `580bb6d` 等提交的祖先历史。最终完整 commit hash 见完成消息及本分支 `git log -1`。

## 最新版本核对

已读取当前 `HANDOFF.md`，按 00 的最新统一模板继续；未自行合并其他分支。Software/Model 的 RSV 排名第二正文、旧片段链接、无 On this page/Pause、平滑导航及自动减少动态效果检查通过；两代 Software PDF 均仍为八页，采用已同步的 Pages 兼容压缩版。当前浅色折叠目录、统一字号及移除 Software/Model 返回顶部是最新主控基线的记录，与 10 月 8 日历史交接不同。本次没有恢复旧界面，也未修改 Software/Model。Hardware 左侧 Back to top 已按用户最新要求删除。

## 本轮界面调整（2026-10-12）

在 Hardware 初版提交 `fa1bfd3a50b4c8dcd7e48fe9c303d9f8a7bcca32` 上按用户最新要求：删除左侧 Back to top 链接及专用规则；正文十个章节（含参考文献）和顶部简介采用白色圆角内容框。参照只读 `样式/wetlab-pages.css` 中 Notebook 的内容框内边距、圆角、边线和阴影；桌面内边距自适应 26～52px、圆角 24px，手机内边距 24px/19px、圆角 18px。白底使用纯白。Notebook、公共文件及其他页面未修改。

本轮文件：`Instrument/hardware.html`、`样式/hardware.css`，以及 `assets/hardware/review/` 下的生成脚本、已有检查脚本、检查结果和本交接。未修改设备文字、表格、图片、原 PDF 或视频。

正式构建通过（893 ms），完整正文/表格/资料哈希/共享组件检查通过；浏览器 1440/900/390/320 宽度均确认 11 个白色内容框与无返回顶部入口，无横向溢出。手册下载、复现指南滚动、视频播放、成本明细展开及 Judging 跳转继续通过，控制台错误与失败资源请求为零。已目视检查桌面和手机内容框截图。普通和暂存差异格式检查通过。

下列材料缺口和跨模块事项沿用初版记录，最终提交号以本分支最新提交及完成消息为准。

## 资料来源与正文处理

用户指定只读资料根目录：`C:/Users/UserTech/Desktop/Hardware/Hardware 1012 全 2`。

- `Hardware/Hardware页面.docx`：九章正文、五张表、23 个编号图、五条参考文献及 22 条批注。完整文字、图片关系、表格矩阵、批注定位和 SHA256 保存于 `source-docs.json` / `page-source-manifest.json`。
- `Hardware/图表/Fig1.Technical_Specifications.pptx`：两张原生表合并成清晰 HTML 规格表，保留全部单元格。`Fig2.Development_Timeline.pptx`：原生图形与文字转为 SVG。`Fig23.Equipment_Cost.pptx`：读取原始图表缓存值 4,428.33 / 3,980 / 158,300 CNY，生成 SVG；不使用放大的低清 TIFF，不新增经济或性能结论。
- 主 Word 的图片及 `1 流程.png` / `2 流程.png`：JPEG/PNG 原字节保留；TIFF 仅转换 PNG。视频标题占位图按批注换成对应视频，设备照片和图注保留。来源及目标哈希见 `materials.json`。
- 原版两代 reproduction guide PDF：6 / 10 页；两代 user manual PDF：4 / 5 页。四份 PDF 原字节复制，提供直接打开、下载及两份复现指南的整本滚动阅读；阅读区为原 PDF 渲染页，原 PDF 仍可打开查看矢量原稿。来源 DOCX 同步只读提取核对，未改写指南。
- 三段独立原视频：22.27 / 122.33 / 77.18 秒。`视频3.mp4` 与 `视频3 (2).mp4` 原字节相同，去重一次。网页版保留完整时长与音轨，H.264/AAC、最大宽度 1280，faststart，约 6.47 / 21.51 / 21.28 MiB；没有裁切片段或生成新镜头。

少量明确的编辑性修正：重复成本表编号改为 Table 1～5；不存在的 6.3 改为实际第二项 6.2，兼容性引用改指已有 6.1；删除同一句重复的二代预算；已提供的指南/手册将未来时态改为实际链接。其余非空原稿段落及全部五表单元格逐一检查。成本明细两表默认折叠，总计两表直接显示，所有网页表格使用当前棕色/米色配色。

## 设备与软件架构

一代正文描述固定观察区及光学、温控、供电、图像计算、Wi-Fi 五模块；YOLOv8n 定位反应管、OpenCV 分析区域，Android 客户端显示和记录返回数据。二代增加独立双管预处理区、三面旋转反应仓（每面五个位置，共十五个位置），并区分图像计算、STM32 外设控制及供电/机械板。原稿给出的 90°C 预处理和 43°C 主反应设计温度、尺寸及器件信息依来源保留。本次网页制作没有开展实机、温控精度、通量、检测准确率或成本采购复测。

不同资料间的计算板和控制板名称冲突未自行统一，见下方缺口。

## 文件清单与交叉链接

- 修改：`Instrument/hardware.html`。
- 新增：`样式/hardware.css`、`样式/hardware.js`。
- 新增专用素材：`assets/hardware/images/**`（主稿图片、两张流程图、两张 SVG、PDF 阅读页、视频海报）。
- 新增原 PDF 与网页视频：`public/hardware-resources/**`（4 PDF、3 MP4）。该专用目录新增 `.gitattributes` 将 PDF/MP4 标记为二进制，避免 Git 对原稿做换行转换；全局属性文件不改。
- 新增来源/检查/生成文件：`assets/hardware/review/source-docs.json`、`materials.json`、`page-source-manifest.json`、`content-checks.json`、`browser-checks.json`、`prepare_materials.py`、`build_hardware.py`、`check_hardware.py`、`browser_check.mjs`、本交接。
- 公共文件、Navbar、Loading、Footer、Software、Model、Protocol、Entrepreneurship、Judging 均未修改；Navbar/Loading/Footer 静态结构相对开始基线完全相同。

Hardware 页面内原稿要求的位置直接打开两代 reproduction / user manual PDF；Software 和 Model 交叉链接保留。两份复现指南可在 Assembly and Reproduction 内直接滚动，手册也有直接打开/下载入口。

已有 `Judging/hardware.html` 自动跳转 `Instrument/hardware.html?nav=judging`。本次保持该文件不变，测试旧入口的查询参数及片段保留，Judging 导航高亮正确；无需另行复制一套 Hardware 正文。

预览为本 worktree 的正式构建：`http://127.0.0.1:5208/Instrument/hardware.html`。使用正式预览避免开发文件监听与浏览器私有测试缓存锁冲突；未修改公共配置、未部署。

## Judging 证据位置

| 内容入口 | 可对应的材料 | 范围和缺口 |
| --- | --- | --- |
| `#hw-introduction`、`#hw-specifications` | 视频1、Fig1规格表、Fig2开发过程 | 设计与原稿规格；不是独立性能复测 |
| `#hw-first-generation` | Fig3～13、模块实物、距离比较、视频2、1.0手册 | 一代结构和操作记录；原始温控/延迟记录未提供 |
| `#hw-design-evolution`、`#hw-second-generation` | 改进动机、Fig14～21、三面旋转/两温区、视频3 | 迭代设计和对应操作；计算板名称仍需协调 |
| `#hw-validation` | Fig22四种手机系统记录、原稿限定条件 | 仅材料中的已测例；两张病原体系结果图明确待补 |
| `#hw-reproduction`、`#hw-user-manuals` | 两代完整复现指南/说明书、原 PDF 下载 | 文档可访问；CAD/Gerber/固件等源设计文件未提供 |
| `#hw-costs`、`#hw-qpcr-comparison` | 五表、原始预算、Fig23比较和适用范围 | 两代组件逐项求和核对通过；一代分摊待核、qPCR来源链接缺失 |

## 桌面、手机与资源测试

- Vite 8.1.3 正式构建通过，最后一次约 769 ms；普通及暂存区 `git diff --check` 通过，四个已暂存 PDF blob 的 SHA256 与来源相同。
- 全部未变正文、五表每个单元格、规格表每个单元格、连续 Fig1～23、五条参考文献、折叠/常显要求、两处结果占位、链接目的地、唯一 ID、共享组件和修改范围检查通过。
- 四份下载 PDF 的 HTTP 内容 SHA256 与来源完全相同；页数 6/10/4/5。图片和原始视频来源哈希复核，网页视频长度及每文件大小核对通过。
- 独立 headless Chrome：1440/900/390/320 宽度无页面横向溢出，无已加载坏图；封面横向覆盖。手机表格局部横向滚动，复现指南两阅读区 PageDown 滚动通过；明细点击展开和 Enter 收起通过，总计表常显。
- 三视频加载到正确元数据，1280×720，网页第一段实际播放推进时间通过。左侧返回顶部入口已删除，旧 Judging 路由参数/锚点及高亮通过。控制台错误与失败资源请求均为零。
- 封面、目录、时间线、成本图和滚动阅读区已目视检查；源 PDF 全部25页及主稿图片以渲染页/审阅图检查。截图在 `.sites-work/hardware-review-20261012`，不作为公开素材。本次是网页与视口检查，不是实机手机/设备或全站最终验收。

## 交 00 的材料缺口和跨模块确认

1. 一代主稿/规格表写 Raspberry Pi；1.0复现指南表格写 Orange Pi 5 Max/RK3588，后文又写 Raspberry Pi。当前 Software 用 RK3588。需统一具体版本和图片对应关系。
2. 二代 Fig20写 STM32 AI vision main control，与复现指南和 BOM 的 RK3588 图像计算 + STM32F407ZGT6 外设控制口径不同。
3. 二代说明书封面仍标一代尺寸 7.5×14×11 cm，正文/复现指南标二代 15×30×20 cm；说明书还重复 Before you begin 的部分文字。原 PDF 不改，交作者提供修正版。
4. 一代无线段落同时出现 802.11ac 和 Wi-Fi 6E；缺少安装版本与温控/无线延迟原始记录。本次未新增或背书验证结论。
5. Hardware 文稿将荧光 CNN 训练转到 Model，但当前 Model 是引物/crRNA排序与反应动力学，不能将该排序准确率当作荧光图像分类准确率。需 00 协调科研内容。
6. 批注15要求的两张病原检测性能结果图及其原始记录仍待补，页面已预留两处并保留原稿待确认说明。
7. 未提供 CAD、Gerber、固件、权重及采购凭证；复现指南不能替代这些源设计文件。
8. qPCR单一采购参考没有对应采购URL，保留原稿比较限定条件，未声称是当前市场价格或同等性能。
9. 批注要求复现资料最终由 Protocol 承载、说明书由 Software 承载；本次仅 Hardware 直接接入新4/5页说明书和6/10页复现指南，没有覆盖 Software 当前8页版。资源归属和最终链接由 00 整合。Entrepreneurship 成本口径同样交 00，未跨模块自行改写。

已尝试读取00对话及打开应用预览，两工具仍返回 `Invalid app tool request`。未能自动发送，不宣称已送达；本交接及最终提交号供00接收。没有 merge、cherry-pick、push 或部署。
