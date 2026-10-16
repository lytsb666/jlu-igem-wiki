# 《10.16.docx》后续修改 · 2026-10-16

用户要求按桌面 `10.16.docx` 继续修改，有歧义先提问。本轮在当前 `codex/footer-card-polish-20261016` 工作区增量修改，保留接手时全部未提交文件、原始媒体和其他 worktree；没有提交、上传或发布。

## 用户已确认的范围

- 图注、表注每一行均居中，包括最后一行，不采用两端对齐。
- 只统一仪器／设备图片，普通图片和科学图表不批量改尺寸。
- Team 仅点击肖像后展开的个人资料卡去掉中文名；滚动肖像、PI、Secondary PI、Advisor 保留中文名。
- First、Second 等只处理步骤开头、标题和独立标签，正文中间的普通用法保持。

这些确认及附件明确要求已写入 [全站开发要求第 21 节](全站开发要求.md)，覆盖此前冲突条款；iHP Closing／独立 Summary & Reflection 继续暂缓。

## 逐项实施

| 附件项目 | 本地结果 |
| --- | --- |
| Measurement 星号 | `Box of measurement` 正文标题和目录标签均加 `*`，保留 `#box-of-measurement` |
| 图注、表注 | 沿用公共每行居中、末行居中、加粗、12pt；未改正文或科学标记 |
| 仪器图大小 | 参考 Measurement Figure 37A 的可见画面宽度约 573px，设备插图上限 36rem（576px）；显式标记 Hardware 11 图、Description 4 图、Contribution 2 图和 iHP 张英涛访谈两图；Safety 五张设备照片按整组限宽，保留分图窗口。Measurement 原参考合图保持 |
| 视频说明 | 删除 Hardware 三段视频和 Contribution 视频的四处图注，共享脚本同步防止残留；完整视频、控件、声音及滚动播放逻辑保持 |
| Hardware 首张截图 | 删除 1.0 Operation Workflow 中 `workflow-1-clean.svg` 的展示与四个文字步骤；保留视频、手册链接、Figure 13 和全部原媒体文件，2.0 操作示意图保留 |
| Program upgrades / Explore more | 删除截图指定的 Software／Model 行内跳转句；Reference 前新增 Explore more 白框和两枚等宽图标链接，Software 打开软件页，Model 打开 `model.html#model-for-hardware`；目录补入该节，手机仍为两列 |
| First / Second | 检查标题、步骤开头和标签；Hardware 两个独立 reproduction guide 链接标签改为 First／Second，其余已有正确首字母的序列保持，不改正文中间和 URL |
| 带框跳转 | 公共 `.wiki-boxed-link` 去掉容器及文字子元素下划线，增加悬停上浮／阴影、按下反馈及可见键盘焦点；后生成的正文链接同样处理。普通正文链接仍有连续实线下划线，减少动画时停止位移 |
| Model Figure 2 | 使用本附件 `word/media/image3.png`，保存为 `assets/model-hardware/revision-20261016/training-workflow.png`；展示、原图入口一致，1014×239 原字节保留。旧 `images/image2.png` 未动，仍供 Figures 3／7 裁切 |
| Model 图框尺寸 | 14／15 与原 16 的可见框宽度 677px 一致；3／4／7 与原 17 的可见裁切框宽度约 473.64px 一致。17 的原文件宽 756px 不等于其可见窗口宽度，不能用整图宽度替代。图内比例、裁切内容、曲线与数据不改 |
| Team 资料卡 | 仅 `#selected-member-name` 改为英文名，保留所有姓名资料、滚动肖像中文名、PI／Advisor 姓名、身份、顺序及贡献 |
| Hardware 病原体结果 | 五个轮播标题为 Detection result of HI／BP／SPN／RSV／hMPV；下方标题只删 F，保留五个病原体名。六张原图、原正文和 A–F 对应说明不改 |
| 页脚 | 品牌字样 42→48px、校徽 46→54px、队名 21→25px，手机／短屏相应增加；删除原第二个抖音码，剩余微信、小红书、Bilibili、Instagram 四框等大。Instagram 在原有效码区外增加方形白底，不拉伸或重画码点。20 个页脚导航链接、七个连续滚动赞助商及一屏布局保持 |
| Software 指定截图 | 整段删除 Image results and five tube labels 的标题、说明、五管原图展示及 Figure 3 图注；原 JPEG 文件保留，其他记录、源码、APK 与手册下载不动 |
| Contribution 封面 | 三项主题词逐字换成 Open Resources for the iGEM Community、Reusable Frameworks for Future iGEM Teams、Shared Knowledge for a Stronger iGEM Community；单排及小屏内部横向滑动保持 |

替换原图和源文档 SHA-256 记录在 [source-manifest.json](../assets/model-hardware/revision-20261016/source-manifest.json)，不依赖桌面附件或 `.local/` 中间文件。

## 验证

- 全部 18 个实际入口的桌面检查：356 个图注／表注居中，145 个带框文字跳转无下划线，四个二维码平台正确，没有正文视频图注、整页横向溢出或浏览器脚本错误。
- 针对 Measurement 星号、Hardware 删除范围／轮播标题／Explore more、Model 模块定位及图片、Software 删除范围与 APK 保留、Team 中文名范围、Contribution 三项主题词做内容与交互核查；9 个受影响入口做 390px 手机溢出检查。
- 页脚在 1440×900、1280×720、390×844、320×740 下均合占一屏，版权完整，四框正方形且等大，20 个导航链接和每组七个赞助商保持；已逐张复看桌面、手机截图。
- 首轮 118 项浏览器检查仅发现 Model Figure 17 的原裁切窗口比文件尺寸小。按真实窗口修正 Figures 3／4／7 后，只复核相关图框和设备图、悬停／减少动画；不重跑已经通过的整站检查。
- 设备图和科研图在原图片实际加载、解码后复看，检查可见图框而非尚未加载的占位尺寸；Safety 合图限宽补足公共样式优先级，保留五个完整面板。
- 最终构建与资源检查：882 个文件、23 个 HTML、1746 个引用，最大资源 22,559,008 bytes；缺失、超限、不安全项均为零。
- 当前代码修改前副本、浏览器原始记录及截图位于 `.local/revision-doc-20261016/`；长期要求、来源及验证结论已保存在本仓库。

本地预览：[Hardware Explore more](http://127.0.0.1:5221/Instrument/hardware.html#hw-explore-more)、[Model for Hardware](http://127.0.0.1:5221/Instrument/model.html#model-for-hardware)、[页脚](http://127.0.0.1:5221/Instrument/hardware.html#site-footer)。仅在开发服务运行期间可用。
