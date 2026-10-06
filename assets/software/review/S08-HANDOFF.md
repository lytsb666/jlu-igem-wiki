# S08 Software 交接报告（交 00）

工作区：D:/JLU—Wiki/IGEMwiki/worktrees/08-instrument
分支：codex/08-instrument
开始基线：8444af2dc4e3b2a7971e111100d3b0e9501e0a3b
任务单：../_task-briefs/2026-10-03-software-protocol-46368360/08-software-task.md
初次完成日期：2026-10-03；手册增补日期：2026-10-06。最新提交编号由完成消息提供，可用 git log -1 查询。

## 2026-10-06 手册增补（当前交接状态）

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
