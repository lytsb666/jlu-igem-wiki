# 2026-10-15 Notebook Protocol iHP 与 Contribution 本地更新

本轮按用户提供的两份标黄 Word、一份 iHP 英文文稿及两张图片更新本地网站。工作分支为 `feat/00-manuscripts-20261015`，基线为 main `9d008de`。本轮交付本地开发预览。

## 修改范围

- Notebook：只更新五个 x.1 实验的 15 个标黄段落，名称改为 `Optimal Primer Combination Validation`，试剂清单增加 gRNA candidates，并补充 Dry-lab 筛选与 Wet-lab 验证的说明。原日期、参数、实验步骤、结果及其他章节保持。
- Protocol：更新五种病原体的初始验证部分，共 15 个标黄段落，以及对应的五个目录名称。实验体积、表格和其他实验小节保持。
- iHP：正文替换为 `ihp文稿English.docx`，整理为 12 个一级正文区块。保留原封面、公共导航、Loading、Footer、Judging 查询上下文及 56 个原正文锚点。文稿中的版式备注用于制作界面，不显示为正文。
- iHP 内容框使用用户提供的 JPG。保存原图，CSS 通过嵌入原 JPEG 的 SVG 视口和九宫格边框显示，不重绘位图。原稿媒体共 101 张，原字节保留；两张明确用作界面参考的截图改用正文中的原生交互表达。
- iHP 提供默认收起的协作策略和 CARES 内容、专家身份折叠、公共卫生／临床两条线路切换、桌面并列的儿科与老年医学内容、照片横向浏览和原图查看。手机目录位于文档流中，当前位置追踪不强制展开二级目录。
- Contribution：只替换 headpage 图片引用和原图尺寸属性，标题、特点框、遮罩和既有效果保持。

## 待用户提供的文件

iHP 共预留 20 个资源位置，界面标为 `To be provided`，没有虚构文件或失效下载入口：

| 位置 | 待补材料 |
| --- | --- |
| Overview | 项目插图、互动地图 |
| Stakeholder Strategy | 打分依据 01、复盘详述 02 |
| CARES | 知情同意 03／04、专利与审批 05 |
| Stage 2 | 社区协同应急指南 |
| Stage 4 | 回顾性问卷、设备使用说明 |
| Stage 5 | 卡牌活动说明 |
| Inclusive Engagement | 幼儿园安全资料 PDF 1／2／3、老年教育 PDF 4、盲文及对照材料 |
| Collective Growth | 项目展示视频截图、官方峰会海报、SBti 网页入口 |

各占位 ID、源文稿段落、原备注与媒体 SHA-256 记录在 `assets/human-practice/revision-20261015/source-manifest.json`。收到新文件后按具体位置替换。

## 验证

按本轮范围检查四页的桌面 1440px 与手机 390px，并检查新文稿折叠、键盘线路切换、图库、原图弹窗、旧锚点及 Judging 参数。手机检查发现的延迟加载图片尺寸问题已修正。
正式构建和仓库资源检查通过；构建与针对性浏览器记录保存在本机 `.local/revision-20261015/`。没有重跑历史全站内容验收。

本地预览：`http://127.0.0.1:5221/`。
