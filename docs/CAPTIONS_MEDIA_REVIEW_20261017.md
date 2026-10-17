# 全站图注、表注与图片效果核查 · 2026-10-17

用户要求图片只带图注、表格只带表注、视频不带注解；除 iHP 外，无图注图片不做阴影浮动。按当前分支继续本地实施，保留此前未提交成果，未上传仓库或发布网站。长期规则已同步到全局第 4.2、7.1、30 节。

## 核查与修正

- 覆盖 18 个实际内容入口，包括 Homepage、Team、Project 五页、Wet Lab 五页、Instrument 三页和 Engagement 三页；Model 两个模块同时检查。旧跳转入口沿用目标页面，不复制正文。
- 找到 Hardware 技术规格表同时有原生 `Table 6. Technical specifications` 和外层 `Figure 1. Key technical specifications of the two generations of ByeGerm instruments`。将完整说明保留为一个原生 Table 6 表注，删除外层图注。Table 1–5 和其余 Figure 2 起的图号保持，不更改表内数据。
- `样式/captions.js` 依据实际承载媒体判断 Figure／Table，不再只看旧前缀。表格外层使用 figure 仍按表格处理；单元格内的小图或 SVG 不把整个表格误当图片。SWOT 和融资等卡片化表格继续保留原 Table 类型。
- 五个正文／官方嵌入视频已经无注解，继续保留原删除规则及延后插入时的清理；Loading 视频独立处理。附近正文、图片／表格说明、视频控件与辅助技术名称不作为视频注解删除。
- 无说明的图片、无表题的表格没有补造新标题。iHP 66 条原图注和已有图片均保持；本轮没有扩改之前暂缓的图注文稿。

## 图片效果

`样式/captions.js` 给正文图片标记有无所属图注，并处理独立纯图片外框；初次渲染和后续插入／删除图注时都会更新。`样式/preview-format.css` 的公共图片阴影和悬停上浮仅适用于带图注的图片，iHP 继续沿用原规则。

非 iHP 共 219 张无图注正文图片取消公共阴影和 translate 上浮，包括 Engineering 的步骤／装饰图、Team 肖像、Software 人物及其他无图注插图；Software 的装饰性上下浮动一并停止，Advisor 照片外框也不再悬停上移。已有图注图片的常态阴影保持。

未统一重置图片的 transform：Team 指定人物放大裁切、Advisor 点击翻转、轮播切换、Homepage 场景定位与叙事仍使用原逻辑。页脚和回顶人物的原组件交互保持。

## 当前图注／表注清单

以下数量包含保留的辅助技术表格 caption；Measurement 的一份可见表注与隐藏原生 caption 仍共同对应原表，不出现 Figure 类型。未把 Homepage 的工作流正文当作科研图注。

| 页面 | Figure 图注 | Table 表注 |
| --- | ---: | ---: |
| Homepage | 0 | 0 |
| Team | 0 | 0 |
| Description | 8 | 1 |
| Design | 2 | 0 |
| Engineering | 1 | 6 |
| Contribution | 6 | 2 |
| Safety | 7 | 0 |
| Measurement | 37 | 15 |
| Result | 52 | 0 |
| Parts | 1 | 0 |
| Protocol | 0 | 0 |
| Notebook | 0 | 0 |
| Hardware | 22 | 6 |
| Software | 5 | 0 |
| Model（两个模块合计） | 26 | 6 |
| Education | 26 | 0 |
| Entrepreneurship | 7 | 39 |
| iHP | 66 | 0 |
| 合计 | 266 | 75 |

## 验证

- 源 HTML 对照：18 页仅 Hardware 两处注解标记发生预期变化；所有图片／视频来源、正文、链接及 129 张表格的单元格完整保持。未删除媒体文件。
- 初次渲染对照：除合并的 Hardware 表注外，其他图注／表注文字和编号相同；包括原固定编号及句点例外的 Contribution Figure 6。iHP 全部图片的常态 shadow／translate／transform 与修改前相同，有图注图片的常态阴影也保持。
- 构建产物 1440px 桌面和 390px 手机覆盖全部 18 页，并完成 11 组交互／动态补查，合计 47 组通过：类型对应、无视频注解、无图注图片没有阴影和上浮、无整页横向溢出、无页面脚本错误。Hardware 表注截图复看通过。
- 通过实际鼠标和浏览器 hover 状态补查 Software、Engineering、Team 无图注图片、有图注图片与表格，以及 iHP 的例外；Advisor 原点击翻转、Homepage 场景定位继续可用。
- 动态内容补查表格错用 Figure、图片错用 Table、视频上下图注、科学斜体标记，以及图注增加／移除后的效果更新。
- 正式构建与 `scripts/check-build.mjs` 通过：858 文件、23 HTML、1718 引用，最大文件 22,559,008 字节，缺失／超限／不安全项均为零。
- 本机检查记录及截图在 `.local/captions-20261017/`；本文件记录长期有效的范围和清单，不依赖本机临时目录。
