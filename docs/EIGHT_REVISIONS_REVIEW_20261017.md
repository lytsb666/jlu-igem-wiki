# 八项截图修订 · 2026-10-17

本轮按用户消息的八项要求实施，附件仅作为定位和原图来源。开始前读取全站规范、交接、开发约定、相关最新验收与实时 Git 状态；保留原分支及全部已有未提交成果。没有上传 GitHub 或发布网站。

## 具体调整

| 用户要求 | 结果 |
| --- | --- |
| 第一张图注及编号 | Hardware 的 Development Timeline 只删图注、保留图。原 Figure 2–22 改为 Figure 1–21，正文及图片替代文字内的 Figure 引用同步；六张表保持 |
| iHP 图注顺序 | 102 条源图注写入连续 Figure 1–102，避免只依赖运行时补号；删除五个临床科室图注和卡牌图注中残留的 1／2／3／4／5 活动序号，其他说明保持，Table 独立编号 |
| Education 右下留白 | B08 静态展示由五张减为四张，将截图底部的 `b08-13.jpg` 移入同组图库的隐藏档案区；图库仍为 14 张，全部原件及原顺序保留 |
| iHP 右下关键词 | Responsibility → Global Perspective → Multi-cycle Iterative |
| 设备图和留白 | 第一代设备两图按各自原比例分配列宽，完整并排同高；Stage 5 系统流程图去掉顶部大片空白 |
| PDF 标签 | 删除 Stakeholder scoring criteria、Stakeholder review and adaptation 和两份 Informed consent 的 01–04 尾号；四份安全／老年教育资源的 1–4 保留 |
| Contribution 右下关键词 | 原第二项移至首位并去掉 iGEM：Reusable Frameworks；原第一项去掉 for iGEM：Open Tools；第三项改为 iGEM Sprint |
| Sponsor | 槽底改为浅棕 `#c69d77`，添加上侧内阴影和下侧浅色内沿；原色标志在槽内连续移动，原内容、尺寸和速度保持 |
| Stakeholder 三卡 | 使用原透明素材中的医护、研究与书写人物，加浅色贴纸边缘；鼠标移入翻面、移出恢复，鼠标点击不跳转也不将已翻开的卡片反向翻回；保留触屏、键盘与减少动画 |
| Model 四图 | 按 Primer Complex → Reverse Transcription → RPA → Cas12a 替换原机制图位置，保留 Figure 3–6 的原说明和所有正文／公式／参数 |

## 图片与编号说明

用户所指顶部大片留白的 Figure 67 是新增 Overview 统计卡之前的编号。当前 Figure 67 是 Priority settings 的紧凑图，大片留白实际在当前 Figure 68 的四列系统流程图。按媒体内容定位后，只将该图的显示窗口由 `0 0 1265 711` 调整为 `20 160 1225 520`，未裁掉图内标题、流程节点、箭头或证据声明。原文件和原图入口保持；衍生 SVG 及来源记录在 `assets/human-practice/revision-11-20261017/`。

Model 四份附件逐字节存入 `assets/model/revision-20261017/`，分别为 2943×2109、3072×2211、3162×2148、2745×1965。显示 SVG 内嵌完整原 PNG，只重排标题条的矢量文字和外围显示窗口，白色标题在编号圆右侧的标题区域居中；原数字仍为 1–4，科研图内的黑色文字、变量、箭头和分子图形不动。裁切窗口在四边保留外框，不切内部内容。四张旧 JPEG 没有删除，放大入口使用新 PNG 原件；文件名、尺寸、SHA-256、标题条和窗口写入同目录 `source-manifest.json`。

三张卡片复用 `assets/mascots/back-to-top-20261014/` 的既有透明角色，只使用 SVG 窗口呈现对应人物，没有生成或修改原透明图。旧锚点、矩阵默认 Medical Institutions、40 项活动映射、总图、原文、Summary／Closing、PDF 和暂缓 Feedback PPT 均保持。

Hardware 旧号到新号、iHP 全部 102 条说明、B08 静态清单和贴纸角色窗口另存于 `assets/site-revision-20261017/eight-revisions-source.json`。

## 验证记录

- 源码对照确认五页共 460 个原锚点保留且无重复；Hardware 六表、iHP 九表、Model 九表及各页原 PDF 链接保持。iHP 原稿段落、Education 24 项活动文字和 Model 正文／公式完全相同，Hardware 正文仅同步 Figure 引用。
- Hardware 21 条及 iHP 102 条图注按阅读顺序连续；iHP 六个活动序号不再与 Figure 编号混排，说明及引用语义保持。
- 13 组浏览器检查通过：桌面 1440px、手机 390px，并补测 iHP／Model 320px。检查关键词、同高完整设备图、新图裁边、B08 四张静态照片／14 张图库、卡片悬停／鼠标点击／键盘／触屏、赞助商浅槽及四码／20 个页脚链接；另确认普通动态模式下 sponsor 42 秒连续移动且悬停暂停。
- 320px 检查发现既有总图手机入口的两条长名称提示越出屏幕 10px，已局部限制提示宽度；不隐藏名称、不改活动内容或按钮位置。
- 使用 Node 24.19.0 正式构建与资源检查通过：964 文件、23 HTML、1786 引用，缺失／超限／不安全项均为 0。`git diff --check` 检查通过。
- 本机源对照、浏览器检查与截图保存在 `.local/eight-revisions-20261017/`；长期要求、原图、来源与上述实施记录均在正常项目文件内，不依赖临时目录的唯一副本。

本地预览沿用开发服务 `http://127.0.0.1:5221/`，构建版检查使用 `http://127.0.0.1:5222/`；服务运行时可访问。本轮没有提交、上传或发布。
