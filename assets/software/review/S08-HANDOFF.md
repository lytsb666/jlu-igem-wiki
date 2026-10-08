# S08 Software / Model 交接报告（交 00）

工作区：D:/JLU—Wiki/IGEMwiki/worktrees/08-instrument
分支：codex/08-instrument
开始基线：8444af2dc4e3b2a7971e111100d3b0e9501e0a3b
任务单：../_task-briefs/2026-10-03-software-protocol-46368360/08-software-task.md
初次完成日期：2026-10-03；手册增补日期：2026-10-06。最新提交编号由完成消息提供，可用 git log -1 查询。

## 2026-10-08 Model 新稿同步（最新补充）

基线：`22c2d35c593645be085edac78cc0b11a8d6f05fd`。用户要求 Model 页面内容与新稿一致。本次仅同步 Model 正文及其来源、检查和交接记录；最终提交号见完成消息或本分支 `git log -1`。

- 新来源：`D:/WeChathis/xwechat_files/wxid_te2sfwdnpar522_2c28/msg/file/2026-10/model(1).docx`，SHA256 `028d278917bd7c6c599ed03a4e382a25725a0be523b3cefc4c56fd7be81ac582`。
- 新旧文档仅两处正文变化：Introduction 的 RSV 实验最佳组合改为模型排名第二；RSV 案例结尾同样改为排名第二，并删除“该组 Hits@1 为 1”的结论。批注要求、六个表格、73 个公式对象和七张图片与旧稿一致，页面保留此前已落实的排版。
- 修改文件：`Instrument/model.html`、`assets/model/review/model-source-manifest.json`、`assets/model/review/revision-checks.json`、本交接记录。其余页面及公共文件未变，未合并其他 Agent、未推送。
- 验证：以新稿运行全文覆盖、公式、表格、图片、批注呈现、参考文献、片段链接和公共组件检查，通过；新来源 SHA256 和七张图字节验证通过。页面相对本次基线仅有上述两处正文差异。Vite 正式构建通过（637 ms）。
- 浏览器：1440 桌面、390 手机均显示两处新稿文字，旧 RSV Hits@1 结论不存在，无页面横向溢出、无已加载坏图，控制台 warning/error 为零。手机结尾段落已截图目视核对；临时视口重置、临时标签关闭。
- 页面入口和原片段链接保留：`http://127.0.0.1:5198/Instrument/model.html`。软件/设备架构未因本次文稿更改而变化；Judging 证据映射继续交 00，Model 原稿其余内容口径差异仍记录在来源清单中，未自行编造修正。
- 待办界面要求：Software 封面横向铺满；Software/Model 卷轴删除 On this page；Software 悬浮图删除 Pause 按钮。此次授权针对 Model 新稿正文，这三项仍待后续实施。Hardware 手册及视频正式入口继续待 00 提供。
- 本次查找 00 对话的应用接口仍返回 `Invalid app tool request`，自动发送未完成；请 00 通过本记录和完成消息接收提交。

## 2026-10-08 原始手册与悬浮插图

基线：`a2536237722f644a13c9cf7400507d9c82aed936`。用户提供两份完成版手册及替换插图，明确要求以第三张图替换 Software 开头的流程动画，只做悬浮效果。本次仅修改 Software 专用页面、样式、脚本、素材和手册资源；Model、Hardware、Judging 和所有公共文件未改。

### 来源与变更

- `D:/WeChathis/xwechat_files/wxid_te2sfwdnpar522_2c28/msg/file/2026-10/1.0.pdf` 对应 byegerm 1.0，8 页，28052399 字节，SHA256 `6c44f6ff99b1aa9be471eb88cdcea85ac5b8eeefd0ccaa88eca53a7050eecb1f`。
- 同目录 `2.0.pdf` 对应 byegerm 2.0，8 页，28636150 字节，SHA256 `1ba83a1d725af05c9cf5cca78d39c0c6917a16a0713500b1cc671d331fac3831`。
- 两份 PDF 共 16 页均渲染检查；页面为图片型 PDF，未依据空的文本提取结果推断正文。两份提供的手册包含仪器与手机操作流程。原文件逐字节复制到原先两代手册资源位置，不重排、不修改正文、不压缩。
- User Guide 章节更新为八页原版手册介绍，A/B 仍对应第一代/第二代；预览、下载 URL 及匹配 APK 不变。已解决此前“只有自行整理两页手册”的缺口。
- 用户提供的 `68e673a85dc00f6dc861715f0be056cc.jpg`（1024×1024）逐字节复制为 `device-phone-mascot.jpg`，不重绘、不裁剪，保留其黑色背景。完整来源路径与 SHA256 见 `supplied-manuals-20261008.json`。
- 开头的 SVG 流程动画、阶段标签、静态模式按钮和 JS 阶段计时器移除，改为原图；CSS 六秒循环，上下行程 10 px，配轻微投影。提供暂停/恢复按钮；减少动态效果时为静态图，切出页面时暂停。两代手册的操作说明没有用于新增设备/算法性能结论。

### 本次文件清单

1. `Instrument/software.html`
2. `样式/software.css`、`样式/software.js`
3. `public/software-resources/software-user-guide-first-generation.pdf`、`software-user-guide-second-generation.pdf`
4. 新增 `assets/software/images/device-phone-mascot.jpg`
5. 新增 `assets/software/review/replace_supplied_manuals.py`、`supplied-manuals-20261008.json`、`supplied-manuals-checks-20261008.json`
6. 更新 `assets/software/review/check-motion.mjs`、本交接记录

### 测试与入口

- Vite 正式构建通过；Software 新图原字节及两份 PDF SHA256 与来源一致。HTTP 下载两份 PDF 返回 200，内容 SHA256 相同，页数均为 8。
- 1440 桌面及 320/360/390/900 宽度检查通过，无页面横向溢出、无坏图；原流程动画节点已清除。
- 浏览器暂停/恢复均可用；恢复后 CSS play state 为 running。减少动态效果、后台暂停与无障碍按钮状态的单元检查通过。Get started 仍平滑跳到 User Guide 并更新键盘焦点。
- Navbar、Loading、页脚与本次基线比较未变；公共样式/脚本和 Model 未改。原六章、Hardware/Model Navbar 互链、手册与 APK 地址保留。`git diff --check` 通过。
- 预览：`http://127.0.0.1:5198/Instrument/software.html`。此前本地预览进程已停止，本次从 S08 工作区恢复同端口。

### 交 00 的剩余事项

两份原稿已包含仪器及 APP 联动操作，Hardware 页面是否复用这两份资源及最终入口由 00 协调；当前 Software 的 Hardware 手册和视频两个临时链接仍为 `../Instrument/hardware.html`，注明待补充，未自行替换。独立操作视频仍未提供。Judging 证据映射和跨模块事实整合继续由 00 处理。

应用对话接口本次仍返回 `Invalid app tool request`，自动发送 00 未完成；本报告及最终提交号供 00 接收。此前手册生成记录/哈希属于历史状态，当前提供版以本节和 `supplied-manuals-20261008.json` 为准，勿运行旧生成器覆盖原稿。

## 2026-10-06 两页文档修订（历史记录）

用户已明确恢复 Software 和 Model 两页修改。当前基线为 `004393822cc66ea69bcba631179405153d81e1e5`，仅在上述工作区、上述分支实施；最终提交号见完成消息或本分支 `git log -1`。未合并其他 Agent，未推送、未修改主仓库。Model 的本次授权来自用户“继续两个页面的修改”，覆盖此前暂停及职责限制。

### 资料来源及落实

- Software 以 `C:/Users/UserTech/Desktop/software最新修改.docx` 为最高优先级；架构和复用正文采用 `Software_Wiki_Page_English(1).docx`，原 APP 流程图来自 `手机APP2.pdf`。最新中文功能指南作为补充，未把其与最新修改单冲突的三章目录或新增功能写入页面。文件完整 SHA256 和截图裁剪记录分别保存在已有资料审计及 `latest-revision-manifest.json`。
- 软件页面保留六章和旧片段地址；封面采用其他页面相同的 16:9 桌面、4:5 手机比例，左侧卷轴目录、棕色定位状态、平滑滚动和键盘焦点跟随；移动端目录横向滑动。数据流加入箭头，手机纵排时为向下箭头。
- 四张应用截图只裁掉顶部 80 像素状态栏，保留图内温度、曲线、坐标轴及结果日期；原图未改。删去要求删除的绿底提示、图注末句、连接图播放器原图入口、页尾核对日期/commit 句。APP 图仅裁去 PDF 空白页边；正文恢复提供的架构、三个案例和复用说明。
- 两代 PDF、APK、Hardware 手册及视频暂存入口不变；手册字节核对通过。Hardware 两入口仍为 `../Instrument/hardware.html` 并标注 `(to be added)`，最终地址由 00 提供。
- Model 以用户提供的 `D:/WeChathis/xwechat_files/wxid_te2sfwdnpar522_2c28/msg/file/2026-10/model.docx` 为准，SHA256 `667692f852dbb569db68fdb969fa766c4cb77f77b1ac559aced18e32fdd71360`。五条批注分别落实为四个编号问题、两个编号模块、三个可展开的伪代码框（默认展开）。
- Model 正文、六表、七图、十五条参考文献同步新文档。73 个 OMML 对象中 71 个转为原生 MathML，两个矩阵按批注呈现为伪代码；校对覆盖所有非空文档文字片段。前六图与原素材逐字节核对相同，第七图直接来自此次 Model 文档。重复的“Figure 5”统一编号为 Figure 7。
- Model 移除新文档不再包含的空间传质/效能因子旧正文，原片段 ID 保留为方程区域的兼容锚点；TOC 的 PDE system 改为中性的 Kinetic equations。仅在 Model 专用 CSS 修复模板手机编号框窄列、代码换行和公式局部横向滚动。

### 设备、软件和 Model 架构

Android Java 客户端负责连接、计时、温控/机械控制指令、曲线、图像及结果显示；`NetworkService` 处理 TCP，`MainActivity` 处理交互。AI Box 负责设备端控制、光学采集和图像分析。通信保留八字节大端消息头及 UTF-8 JSON 的文档描述。未填入缺失的器件型号、固件、服务端部署参数或视频。

Model 是科研模块：四路共享 DNABERT-6 序列输入与十九项数值特征组成候选组合排序模型；动力学部分按提供的质量作用方程、均匀混合假设及 LSODA 描述反应过程，提供 F、Cas12a/crRNA、RT 三参数优化表。Model 的排序指标不作为 APP 荧光图像分类准确率。

### 交叉链接与 Judging 证据对应

- Software 六章原 URL 全部保留，两代指南预览/下载以及匹配 APK 均保留；Hardware 两暂存入口已明确待补充。
- Software 和 Model 的公共 Navbar 仍保留 Hardware / Software / Model 互链，公共组件字节结构未改。Model 所有原片段 ID 及参考文献内部跳转校对通过。
- Software 的功能图、连接/温度曲线/五管案例、复用说明、两代手册和开源入口分别提供对应材料；这些页面改动没有增加实机或性能试验结论。
- Model 的数据划分、模型结构、评价/消融、RSV 候选表、动力学公式和两阶段优化表对应科研文档，实验结果文字依原稿保留。
- `Judging/hardware.html`、`Judging/model.html` 未改，判奖证据映射和跨模块事实整合交 00。

### 文件清单（本次）

1. `Instrument/software.html`、`Instrument/model.html`
2. `样式/software.css`、`样式/software.js`
3. 新增 `样式/instrument-navigation.js`（仅两页使用）、`样式/model-revision.css`、`样式/model-revision.js`
4. 新增 `assets/software/images/reaction-display.jpg`、`result-display.jpg`、`acquisition-a.jpg`、`acquisition-b.jpg`、`app-operation-flow.png`
5. 新增 `assets/model/images/simulation-results.jpeg`
6. 新增 `assets/software/review/apply_latest_revision.py`、`check-navigation.mjs`、`latest-revision-manifest.json`、`latest-http-checks.json`、`latest-browser-checks.json`；调整已有 `check-motion.mjs`；更新本交接文件
7. 新增 `assets/model/review/build_model_page.py`、`check_revision.py`、`model-source-manifest.json`、`revision-checks.json`

### 验证结果

- Vite 8.1.3 正式构建通过；文档文字、公式、表格行数、七图、五条批注和十五参考条目检查通过。
- 本次导航测试覆盖平滑/减少动态效果、焦点、滚动途中定位锁定、修饰键、历史去重和计时器清理；已有动画暂停、静态图、恢复和减少动态效果测试通过。
- 正式预览 `http://127.0.0.1:5199/` 的 29 个页面/资源返回 HTTP 200；两份 PDF SHA256 保持原值。
- 实际浏览器：两页 1440 桌面及 320/360/390 手机、900 边界宽度均无页面横向溢出、无坏图；长公式/数据表仅区域内横向滚动。Software 手机目录定位到 Validation 顶部约 150 px；Model Introduction 约 168 px，均避开固定导航。Model 手机子章高亮归入其可见主章；三个伪代码框的点击及 Enter 展开/折叠可用。
- 两页开发/正式页面控制台无 warning/error。Navbar、Loading、页脚结构与基线逐一比较相同；公共样式/脚本、Hardware、Judging、配置/依赖文件均未改。`git diff --check` 通过。

### 材料缺口（交 00，不阻止按用户文稿排版）

- Hardware 完整手册/视频最终入口及 APP 截图与具体发布 APK 的精确版本对应仍缺。第二代源码为五路曲线，而协议/提供截图描述两路；现有两代手册已保留版本差异说明。未声称做过 Android 构建、安装或实机测试。
- Model 原稿的 Introduction/Method/优化过程仍出现 PDE，System State 与 Simulation 则写均匀 ODE/LSODA；介绍写五参数，详细优化及表格写三参数。
- Model 仿真文字描述四条曲线与 DNA 早峰，但新文档图只提供 DNA/X 两条线，且 DNA 单调上升；未替作者生成其他曲线或改写仿真数据。
- 部分 Model 公式在 Word 中是线性文字，原文缺失的运算结构未补造；RT 初始条件与优化表单位差异仍依原文保留。以上差异完整记录在 `model-source-manifest.json`，需 00 协调科研内容确认。
- 已尝试通过应用查找 00 对话，但接口返回 `Invalid app tool request`，无法完成自动发送；本报告及完成消息供 00 接收整合，不宣称已送达。

## 2026-10-06 手册增补（历史记录）

用户本轮明确要求：根据现有材料整理 A/B 第一代、第二代两份手册；保留缺失信息标记；Hardware 手册及视频暂时链接 `../Instrument/hardware.html` 并标注待补充，最终入口交 00。此次只落实这部分。Model 文档已完成只读核对，Model 页面及 Software 其他界面调整仍暂停；不得据本次提交推断它们已经修改。

- 新增两份英文图文 PDF，每份 2 页；保留原 `software-user-guide.pdf` 作为参考，字节未改。
- `Instrument/software.html` 仅 User Guide 章节变化：A/B 分别为第一代、第二代手册，均有预览、下载和匹配 APK 入口；增加两个注明待补充的 Hardware 链接；通用 quick start 不再写死二代曲线数量。
- 手册资料来自已提供的 Software Word、原指南、真实截图，以及已读取的 `b06ba6ae99be8757e911f468d2fd0670d99b2e48` 两代 Android `MainActivity.java` 和布局。连接及曲线截图作为共享界面参考，未伪称已确认对应某一发布 APK；第二代结果截图保留原消息日期，PDF 内仅裁去手机顶部状态栏。原始图片未改写。
- 第一代手册涵盖安装、连接、Ded./Data/Setting、应用计时、两路曲线、两管结果、图像请求及保存、重连。第二代补充五管标签及 Servo 入口。Android 客户端负责交互、通信和显示；图像结果来自设备服务器。手册未新增性能、检测准确率或实机验证结论。
- 二代资料差异：当前公开 Java 源码接收 `tube1` 至 `tube5` 并绘制五路，旧协议文档/截图描述两路。新手册注明版本差异及缺少精确 APK/截图对应关系；其他章节中的旧表述属于后续文稿修改范围，尚未改动。

本次文件清单：

1. `Instrument/software.html`
2. `public/software-resources/software-user-guide-first-generation.pdf`
3. `public/software-resources/software-user-guide-second-generation.pdf`
4. `assets/software/review/build_generation_manuals.py`
5. `assets/software/review/generation-manuals.json`
6. `assets/software/review/generation-manuals-checks.json`
7. `assets/software/review/S08-HANDOFF.md`

验证结果：Vite 8.1.3 既有构建通过（728 ms），产物两份 PDF 与源文件字节一致；两份手册共 4 页均已渲染并逐页查看，文字及链接批注可读取；页面、两份 PDF、Hardware 临时目标均返回 HTTP 200。1440×1000 桌面双栏正常；320/360/390×844 手机为单栏，页面无横向溢出；手册按钮支持键盘 Tab，下载属性和目标正确；浏览器 warn/error 为零。未安装 APK 或开展实机操作测试。验证详情见 `generation-manuals-checks.json`。页面 User Guide 以外的内容对比提交前字节一致，包括公共 Navbar/Loading/Footer；未改公共样式、脚本或构建配置。

需要 00 补齐：Hardware 手册/视频最终入口，设备网络凭据与兼容关系，设备启动/关闭流程，确认的反应温度和时长，发布 APK 与截图的精确对应，第一代温度按钮与命令的对应，Servo 位置含义，结果阈值及完整测量导出/历史回看说明。现有内容不足的操作未补造。Judging 文件未改动，本次新增证据仅为用户指南和资源入口的可用性，实验性能证据仍由对应科研内容负责。

下面保留 2026-10-03 初次交接记录；其 Manual/Demo 布局和二代曲线描述以本节及用户后续任务要求为准。

本次完成 Instrument/software.html 的英文正文、专用样式和交互、两页英文图文 PDF、真实 Demo 拍摄清单和来源审计资料。没有修改 Hardware、Model、Judging、主仓库、公共文件、构建配置或 package/lock；没有切换分支、合并或 cherry-pick 其他 Agent。此分支由 00 负责整合。

## 资料来源及文档到页面映射

两份原始 Word 是任务单明确授权的读取来源，未改写原文件：

- C:/Users/UserTech/Desktop/Software_Wiki_Page_English.docx，SHA-256 51495d085cc61aab1db538e1fe4e8d2c09893a83314b7830a2cef3f7b6ec0b39。
- C:/Users/UserTech/Desktop/Software_Wiki页面.docx，SHA-256 6eca895ba2613a772ff9a5554e6615fda9ee4ed87b72daa1a7143f006339ffe5。
- 任务目录 materials/software-en.json、software-zh.json、software-images.json；在 review/ 保留任务提供的提取结果。重新验证英文 Word 的 9 张、中文 Word 的 10 张嵌入图片与清单的 SHA-256 一致。
- https://gitlab.igem.org/2026/software/jlu-sph/sph-software ，核对远端 main 的 b06ba6ae99be8757e911f468d2fd0670d99b2e48。README.md、docs/PROTOCOL.md、LICENSE、downloads/README.md 返回 HTTP 200，原文快照保存于 review/。APK 仅验证链接可达，没有下载、重建、安装或实机运行。

| 输入主题 | 成品位置与处理 |
| --- | --- |
| 中英文稿首页、流程示意、六功能卡 | 首屏标题；8 秒示意动画；Overview 六卡、五步数据流、三阶段开发；图注明确示意曲线 |
| 中英文稿 Architecture 与系统图 | Architecture；按远端协议绘制原生 HTML/SVG 责任图与八字节帧结构，不复用其他团队架构 |
| 英文稿连接、温度曲线、五管结果案例 | Validation 与 Overview 实图；保留原始数值、轴和日期；连接图片仅裁剪播放器外框 |
| 中文稿额外荧光 ROI 照片 | Validation Figure 4，加英文图注；保留原百分比，但不宣称它们是模型准确率 |
| 中英文稿 Reusability | 客户端复用、服务端适配、验证步骤；真实源码构建前提和已知测试缺口 |
| Manual/Demo 草图 | 草图不作为成品发布；生成两页英文图文指南；真实视频待提供，发布拍摄清单 |
| Open Source 与两代应用说明 | 仓库、协议、许可证、README、两代 APK、下载元数据分别标注；实际版本与包名依据远端文档 |
| MESA/Streamlit/FastAPI 外部页面参考 | 只作为原始需求的参考信息留在审计 JSON，未作为 JLU 架构、图片或正文发布 |

## 设备与软件架构

页面记录 Java Android TCP 客户端，NetworkService 解析输入，MainActivity 管理交互与显示，MPAndroidChart 绘制两条接收曲线。AI Box 承担设备控制、图像获取与分析，客户端接收显示结果。Android 仓库不包含设备服务器、固件、推理模型、权重或实验数据集。未新增未经材料支持的器件型号、规格、分析算法或性能结论。

协议为 4 字节大端 int32 payload length + 4 字节大端 int32 frame type + payload；类型 0 为 UTF-8 文本/JSON、1 为图片。二代 tubeluminance 的 string content 包含 data1/data2；绘图时间为客户端接收时间，tem 温度更新单独接收。五管 tubelabels 与两条曲线是不同输出。set_tem43/set_tem90 发送开关值 1/0，set_servo 为二代指令。代码 0/1/2/3 对应 green/red/blue/null，生物学含义依赖实验与服务端实现。

两代均声明版本 1.0、最低 Android 7/API 24；包名分别 com.chuangxin.socket_test 和 com.chuangxin.socket，目标 SDK 34。构建前提 JDK 17、SDK 34、Gradle 8.2、AGP 8.2.0。发布的两代 APK 开启 debuggable，未由此任务重建。源码许可证 Apache-2.0 与现有 Wiki 页脚 CC BY 4.0 分别标注。

## 原图与裁剪

| 文件 | 来源/用途 |
| --- | --- |
| originals/doc1-image2.jpeg | 英文 Word word/media/image2.jpeg；Overview 反应监测界面 |
| originals/doc1-image3.png | 英文 Word 原系统示意图；仅原始审计保留，页面采用与协议一致的原生图 |
| originals/doc1-image5.jpeg | 英文 Word 播放器连接截图；页面提供原图链接 |
| images/connection.jpg | image5 的 (0,455,1260,2408) 裁剪；Validation Figure 1 |
| images/connection-controls.jpg | image5 的 (0,455,1260,1160) 裁剪；PDF 控件说明 |
| originals/doc1-image6.jpeg | 英文 Word 43.1°C、两条曲线；Validation Figure 2 与 PDF |
| images/curve-detail.jpg | image6 的 (30,760,1570,1860) 裁剪；PDF 曲线细节 |
| originals/doc1-image7.jpeg | 英文 Word 43.0°C、两条曲线；Validation Figure 3 |
| originals/doc1-image8.jpeg | 英文 Word 五管标签结果；Overview、PDF；保留 2025 原始日期 |
| originals/doc2-image3.jpeg | 中文 Word 额外荧光 ROI 图片；Validation Figure 4 |

裁剪坐标与原图哈希见 crops.json；原图字节保持一致，未修图或改实验数值。prepare_images.py 可复现三张裁剪。build_user_guide.py 可复现两页指南。

## 交叉链接、评审证据候选与共享依赖

保留入口 /Instrument/software.html；六章锚点为 software-overview、software-architecture、software-validation、software-reusability、software-user-guide、software-open-source。页尾链接现有 /Instrument/hardware.html 与 /Instrument/model.html，仅供上下文访问，不暗示它们包含已核验的服务器/模型实现。

| 可供 00/Judging 引用的位置 | 支持的事实范围 | 不支持的结论/待补材料 |
| --- | --- | --- |
| Overview、Architecture、协议与开源链接 | 客户端职责、两代差异、协议字段和源代码可访问 | AI Box 型号/规格、服务器算法、端到端设备验证 |
| Validation Figure 1 | 所供画面显示连接状态与 10.42.0.1:8080 配置示例 | 所有设备通用地址、连接成功率 |
| Validation Figure 2/3 | 所供界面显示 43.1/43.0°C 和两条曲线 | 温控精度、重复性、原始时间序列、检测性能 |
| Overview 结果图、Validation Figure 4 | 五管标签与 ROI 显示；原始日期及标记保留 | 2026 新实验、百分比代表经验证的模型准确率 |
| Reusability、User Guide、Open Source | 可复用客户端结构、操作指南、真实源码/协议/许可证链接 | APK 重建安装成功、真实 Demo、实机使用效果 |

这是证据定位表，没有修改 Judging 页面或判断满足任何评审标准。若需与科研、Hardware、Entrepreneurship 核对，均由 00 协调。

Navbar、Loading、Footer、加载兜底和封面 HTML 对比基线保持一致；main.js 引用保留。所有 CSS 选择器限定 .software-page；保留 Times New Roman 及正文 15pt、h2 36pt、卡片 h4 24pt。封面仅通过本页 CSS 约束显示尺寸，未改公共规则或素材。没有需同步修改的公共文件。专用资源目录新增 .gitattributes 将 PDF 标为 binary，防止 Windows Git 对 ASCII85 PDF 做换行转换；没有修改根目录 Git 属性。

部署依赖现有 Vite 多页构建与 public 目录复制：PDF 和清单必须发布到 /software-resources/，图片由 Vite 生成 /assets/ 哈希路径，专用脚本同步原图链接到产物地址。现有本地构建已确认资源存在并可请求；生产站最终资源与子路径检查交 00/10。

## 测试结果与范围

- 现场守卫：所有终端操作 cwd 固定本工作区，分支持续 codex/08-instrument。
- 运行现有 npm run build（使用本地官方 npm 工具和现有 package/lock；没有改配置）。Vite 8.1.3 构建成功，25 个 HTML 入口；最终构建成功约 550ms。
- git diff --check 通过；HTML 六章无模板正文，ID 无重复，片段链接有效；公共块与基线一致。结果见 source-verification.json。
- 生产预览 1440×1000：clientWidth=scrollWidth=1425，无页面溢出；目录 sticky；动画 8s；Times New Roman，正文20px、h2 48px、卡片h4 32px；六张页面图片均加载完成，console warn/error 为空。
- 320、360、390px（高度844）窄屏：页面 overflow 均 0；所有受检内容未越界。窄屏目录在自身区域可横向滚动，章节标题在固定导航下方显示。
- 六个目录链接用 Enter 跳转，hash、当前章节、滚动定位一致；Pause/Resume、静态图/播放、Build from source 折叠框可用键盘操作。新增跳转目录链接会聚焦 software-navigation。
- 浏览器最终补验：暂停后显示静态，再选择 Play workflow，会恢复 running、paused=false、static=false。
- 减少动画：实际脚本在 check-motion.mjs 中模拟媒体偏好初始值/变更并通过；浏览器手动静态模式与 CSS 静态样式已核对。未模拟浏览器操作系统级媒体偏好，不能将脚本状态测试描述为 OS 实机测试。
- PDF：2 页 A4、文本可选中；两页逐页渲染并目视复核，无裁切或重叠。源文件、Git 暂存二进制与 dist/client 发布副本哈希一致；PDF HTTP 200、application/pdf，大小4,038,017字节。渲染环境有缺少备用 Symbol/ArialUnicode 字体提示，但最终 Times/ASCII 内容可见且无版式缺陷。
- 页面、PDF、清单、六张图片与连接原图的生产路径 HTTP 200，详情见 http-results.json。远端两代 APK 的 HEAD 200，application/octet-stream；只验证链接，没有执行下载保存、安装或设备控制。
- desktop-preview.jpg、mobile-preview.jpg、browser-results.json 保留可复核的截图和测量记录；构建输出、依赖和临时 PDF 渲染保存在忽略目录，未提交。

## 材料缺口

1. 可发布的真实完整操作视频：需要检测设备和手机同框、连接、配置、曲线、请求图像、五管结果及必要的英文字幕。拍摄清单已提供，页面显示 Real recording pending。
2. 原始温度/荧光时间序列、校准日志、重复实验和模型评估数据：现有截图只能证明画面显示，无法给出温控/检测/模型准确率结论。
3. AI Box 设备服务器、固件、模型实现及版本、权重与数据集：Android 仓库未含这些内容，跨模块核对交 00。
4. Android 源码编译、APK 重建安装与实机联调：本任务未执行；远端也明确尚未完成。二代 instrumentation 模板测试仍期望一代包名，须由源码负责人后续修正并验证。
5. 2025 归档截图与本项目实验批次的关系、原始视频与实验元数据：待团队确认，页面保留原日期且没有改成 2026。

## 修改文件清单

以下均位于本工作区允许范围内；专用审计资料仅随 Git 交接，页面不会导入 review 目录。
- public/software-resources/.gitattributes
- 样式/software.css
- 样式/software.js
- assets/software/images/connection-controls.jpg
- assets/software/images/connection.jpg
- assets/software/images/curve-detail.jpg
- assets/software/originals/doc1-image2.jpeg
- assets/software/originals/doc1-image3.png
- assets/software/originals/doc1-image5.jpeg
- assets/software/originals/doc1-image6.jpeg
- assets/software/originals/doc1-image7.jpeg
- assets/software/originals/doc1-image8.jpeg
- assets/software/originals/doc2-image3.jpeg
- assets/software/review/browser-results.json
- assets/software/review/build_user_guide.py
- assets/software/review/check_sources.py
- assets/software/review/check-motion.mjs
- assets/software/review/crops.json
- assets/software/review/desktop-preview.jpg
- assets/software/review/DOWNLOADS.remote.md
- assets/software/review/http-results.json
- assets/software/review/LICENSE.remote.txt
- assets/software/review/mobile-preview.jpg
- assets/software/review/prepare_images.py
- assets/software/review/PROTOCOL.remote.md
- assets/software/review/README.remote.md
- assets/software/review/S08-HANDOFF.md
- assets/software/review/software-en.json
- assets/software/review/software-images.json
- assets/software/review/software-zh.json
- assets/software/review/source-verification.json
- Instrument/software.html
- public/software-resources/demo-recording-checklist.txt
- public/software-resources/software-user-guide.pdf
