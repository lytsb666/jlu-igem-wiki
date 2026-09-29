# JLU-SPH iGEM 2026 Wiki 第二轮需求执行报告

日期：2026-09-29  
分支：`feat/wiki-ux-redesign`

## A. 已完成项目

| 项目 | 实现与验证 | 涉及文件 | Commit |
|---|---|---|---|
| 开发服务器保护 | 清理 `dist` 的插件仅在正式构建时运行，避免启动开发服务器时误删已有预览产物。 | `vite.config.js` | `cc35bfa fix(build): avoid removing dist during dev` |
| Homepage 滚动响应 | 保留原动画结构，将封面缩放的固定 125ms 缓动改为按滚动差值自适应的 52/76ms 缓动；连续滚动和反向滚动均已测试。 | `样式/home-story.js` | `c3ade85 feat(home): improve story scroll responsiveness` |
| Loading 背景衔接 | 从原视频外缘取样，将播放器和容器背景统一为 `#c6c1be`，减少黑色背景与视频边缘的色差。 | `样式/loading.css` | `c99fecc fix(loading): reduce loading background color mismatch` |
| 二级页版式统一 | 增加全站内容宽度、页边距和段落间距变量；在桌面端统一正文与目录区域宽度；表格可横向滚动；移动端恢复紧凑目录。 | `样式/navigation.css`、`样式/full-width-layout.css` | `64b352e refactor(layout): normalize secondary page layout` |
| 卷轴目录素材 | 将新文件夹中的透明卷轴素材用于 Project、iHP、Education、Inclusivity、Human Practices 等二级页目录框。桌面端显示，移动端关闭装饰以保证可读性。 | `a  图片/navigation/scroll-frame.png`、`样式/full-width-layout.css` | `64b352e refactor(layout): normalize secondary page layout` |
| Wet Lab 移动端溢出 | 修正病原体横幅的移动端负边距/内边距，并限制网格子项最小宽度；390px 宽度下横向溢出为 0。 | `样式/wetlab-pages.css` | `64b352e refactor(layout): normalize secondary page layout` |

### 最终验证结果

- 使用项目现有 Node 与 Vite `8.1.3` 构建成功，未升级依赖，`package.json` 与 `package-lock.json` 未改变。
- 源码与构建结果均有 25 个 HTML 页面；25 个生产预览 URL 均返回 HTTP 200，并显示正确标题。
- Homepage、Project/Design、iHP、Education、Wet Lab/Result、Instrument/Model、Instrument/Hardware 已做桌面与 390×844 移动端抽查。
- 生产预览中没有应用级 Console error/warning。根路径重定向时浏览器曾产生一次通用 favicon 404，不影响页面，`/homepage/index.html` 本身为零错误。
- Model 的 8 个原图链接均在运行时解析到带 hash 的构建资源，全部返回 200。
- Entrepreneurship 的 7 个 lightbox 大图地址均在运行时解析到带 hash 的构建资源，全部返回 200。
- `public/inclusivity-resources` 中被页面引用的 5 个 PDF/DOCX 均存在，并被正确复制到构建根路径。
- 当前 `dist/client`：269 个文件，126,405,256 bytes（约 120.55 MiB）；最大单文件 6,998,045 bytes（约 6.67 MiB）。

## B. 已自动判断并放置的素材

| 原始素材 | 判断依据 | 放置位置/用途 | 置信度 | 处理 |
|---|---|---|---|---|
| `微信图片_20260927160530_138_177.png`（1536×2712，透明背景） | 与参考截图中的大型卷轴目录外框一致，透明区域适合覆盖目录内容 | `a  图片/navigation/scroll-frame.png`，作为二级页桌面目录背景 | 高 | 已放置并完成响应式适配 |
| `微信图片_20260927160528_137_177.jpg`（1918×1198） | 展示 Description 页面左侧卷轴目录的预期视觉 | 仅作为视觉参考，不进入生产资源 | 高 | 已用于比对，原文件保持不动 |

### 未改动但已确认的素材映射

- `图片.zip` 内含 71 张图片，并附 `image_manifest.csv`；编号顺序与 Word 中图片出现顺序高度相关。
- `ihp文稿English.docx` 是完整度较高的 iHP 英文文稿，共 396 个非空段落、7 个表格、73 个内嵌图形。
- `team member.zip` 内有 37 份成员贡献文档，内容更接近个人贡献/Attribution 材料，而不是可直接发布的统一成员卡片数据。

## C. 无法可靠判断、因此未自动改动的项目

### 1. iHP 新文稿和 71 张图片

文稿与图片存在明显对应关系，但素材说明要求后续提供图片顺序；同时 Word 中仍含以下内部标记或占位内容：

- `+相关利益者地图`
- `+打分依据`
- “做成上面这样的图，点击展开”
- `+pdf`
- `Company xxx`
- 若干中文排版说明

因此没有覆盖现有 `Eagagement/iHP.html`。现有 iHP 页面链接已审计：只有两个明确标注的 PDF 链接，均指向存在的 `assets/human-practice/quantitative-model.pdf`；普通页面导航和图片没有被误设为 PDF 下载。

建议：收到最终图片顺序、占位文字和公司名称后，再按章节一次性导入并人工复核。

### 2. Team member 文档

压缩包中共 37 份文件，包含 Advisor、Dry Lab、Wet Lab、HP、Designer、Hardware 等人员信息，但格式和用途不完全一致。主要不确定点：

- 多数文档标题为 Team Member Contribution，更适合 `Team/attribution.html`；当前 `Team/member.html` 更像统一成员介绍页。
- `Team Member-杨鏐玉.docx` 的正文姓名为 `Jingyi Kang`，与文件名不一致。
- `陈博远-Team Member Contribution(1).docx` 的压缩包图片条目 CRC 异常，但 Word 正文可读取。
- 两份旧 `.doc` 文件和其余 `.docx` 均可读取；没有删除、转换或覆盖原文件。

文档清单：

| 文件 | 正文姓名 | 角色/主题 |
|---|---|---|
| `20260924_王飞跃.docx` | Feiyue Wang | Advisor |
| `Advisor  孙兰超.docx` | Lanchao Sun | Advisor |
| `Advisor-何梓侨.docx` | Ziqiao He | Advisor |
| `Advisor王晗宇.doc` | Hanyu Wang | Advisor |
| `advisor王洛钊.docx` | Luozhao Wang | Advisor |
| `Dry Lab 金墨.docx` | Mo Jin | Dry Lab |
| `drylab尹冠博.docx` | Guanbo Yin | Dry Lab |
| `Drylab张博韬.docx` | Botao Zhang | Dry Lab |
| `hardware鲁怡蕊(1).docx` | Yirui Lu | Wiki / Hardware |
| `HP 夏宇.docx` | Yu Xia | HP |
| `HP+郭睿垚.docx` | Ruiyao Guo | HP |
| `HP韦佳乐.docx` | Jiale Wei | HP |
| `HP组  张瞬尧.docx` | Shunyao Zhang | HP |
| `HP组+高文娴.docx` | Wenxian Gao | HP |
| `Team Member-杨鏐玉.docx` | Jingyi Kang（文件名冲突） | Student leader |
| `Wet Lab 邓恒奇.docx` | Hengqi Deng | Wet Lab |
| `wet lab 李彤.docx` | Tong Li | Wet Lab |
| `Wetlab 董梓伊.docx` | Ziyi Dong | Wet Lab |
| `Wetlab 金智媛.docx` | Zhiyuan Jin | Member |
| `wetlab 孟小杰.docx` | Xiaojie Meng | Wet Lab |
| `Wetlab 张朵.docx` | Duo Zhang | Wet Lab |
| `陈博远-Team Member Contribution(1).docx` | Chen Boyuan | Advisor |
| `康靖宜.docx` | Jingyi Kang | Student leader |
| `梁森.docx` | Sen Liang | Advisor |
| `刘皓阳.docx` | Haoyang Liu | Member |
| `马梓云.docx` | Ziyun Ma | Advisor |
| `美工 骆茜雯.docx` | Qianwen Luo | Visual Designer |
| `美工组 艾文琦(1).docx` | Wenqi Ai | Designer |
| `美工组 王芊雯.docx` | Qianwen Wang | Designer |
| `美工组张家乐(1).doc` | Jiale Zhang | Designer |
| `秦梓严.docx` | Ziyan Qin | Dry Lab |
| `王鹏涛-Team Member Contribution.docx` | Wang Pengtao | Advisor |
| `肖博文_Team_Member_Contribution.docx` | Bowen Xiao | Hardware |
| `邢辰Team Member Contribution.docx` | Chen Xing | Designer |
| `杨雨佳team member.docx` | Yujia Yang | Human Practices |
| `姚文松.docx` | Wensong Yao | HP |
| `尹桐辉 Team Member Contribution.docx` | Tonghui Yin | HP / Instrument |

### 3. Hardware 内容

成员材料中只有零散的 Hardware 个人贡献陈述（Yirui Lu、Bowen Xiao、Tonghui Yin），并非可直接替换 `Instrument/hardware.html` 的完整硬件研究、规格、结构和验证文稿。因此没有根据贡献表编造 Hardware 正文。

### 4. 首页局部动画

- 仪器入口场景中的钟表是整张 WebP 背景的一部分，没有独立钟表图层。
- 最终场景中的齿轮与吉祥物合并在同一 PNG 中，无法只旋转齿轮而保持吉祥物静止。
- 队伍行进场景中的人物在背景 JPG 中，只有吉祥物是独立图层；无法可靠实现“人物向右、吉祥物向左”。
- `timer.png` 是 `30:00` 数字图，不是可旋转钟表或齿轮素材。

没有采用裁切、遮罩或重绘等可能破坏原画的猜测方案。建议提供独立透明图层后再实现。

### 5. 新增项目流程插画

`微信图片_20260928215840_150_177.png`（2752×1536）展示项目流程与吉祥物，可能适用于 Homepage 或 Project/Design，但没有明确目标页面和插入章节，因此未自动放置。

## D. 仍需团队确认/补充的信息

| 信息 | 当前状态 | 为什么需要 | 建议下一步 |
|---|---|---|---|
| iHP 71 张新图的最终顺序与章节对应表 | 未提供 | 现有编号只能推断 Word 中的出现次序，不能保证发布顺序 | 提供“文件名 → 章节/图注”表 |
| 卷轴图片素材 | 已提供并使用 | `微信图片_20260927160530_138_177.png` 已确认 | 无需再补充；如需换版，提供新透明 PNG |
| 卷轴效果预览图 | 已提供并参考 | `微信图片_20260927160528_137_177.jpg` 已确认 | 无需再补充 |
| Loading 米灰色最终色值 | 尚未指定品牌标准 | 当前 `#c6c1be` / RGB(198,193,190) 来自 loading 视频外缘像素采样；视频中央浅色矩形/光晕已烘焙进视频 | 若需完全无边界，请提供重新导出的透明或同底色视频；若只改底色，请给 HEX/RGB |
| 表格四行重排的具体表格与四行内容 | 未明确 | 页面中存在多个表格，无法判断要改哪一张、四行如何分组 | 提供页面 URL、表格标题和四行顺序 |
| iHP 占位内容 | 未完成 | 文稿含 `+pdf`、`Company xxx`、地图/评分依据等标记 | 提供最终 PDF、公司名、地图、评分依据和删除/保留指示 |
| Team 内容发布位置 | 未确认 | 37 份资料可能属于 Member，也可能属于 Attribution | 确认每份资料进入 Member、Attribution 或两者，以及是否公开个人信息 |
| 首页动画分层素材 | 未提供 | 钟表、齿轮、人物目前烘焙在背景图中 | 提供透明 PNG/SVG 分层：钟表指针、齿轮、人物、静态背景 |
| 项目流程插画放置位置 | 未确认 | Homepage 与 Project/Design 均有合理可能 | 指定页面、章节、标题/图注和是否可点击放大 |

## 素材保全说明

- 新文件夹中的原始 Word、ZIP、图片均未删除、改名或覆盖。
- 未把含内部批注/占位文字的文稿直接发布。
- 未修改 `main`，未配置或推送任何 remote，未改写 Git 历史。
- 历史路径拼写（如 `Eagagement`、`protocal.html`、`inclusity.html`）保持不变，避免破坏现有链接。
