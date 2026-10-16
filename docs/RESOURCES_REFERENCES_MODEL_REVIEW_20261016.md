# 资源区、References 与 Model 图标 · 2026-10-16

本次对应用户三个本地预览反馈：Education 的 Open resources 出现大片空白；Entrepreneurship 底部 References 应独立成白框并统一格式；Model for Hardware 图标应换成区别于页面棕色的颜色。本轮只作本地修改，没有提交、上传或发布。

## Education 空白修复

普通动画模式下复现：Open resources 外框仍在，但 `.resource-collection.reveal` 的计算透明度为 0；其中 23 个活动方案 PDF 已展开、文件地址正常。整个资源区高约 13,462px，整体淡入动画没有触发，导致内容不可见。此前减少动画模式会强制显示 `.reveal`，因此不能只在该模式下验证。

在 `Eagagement/education.html` 中只去掉这一处长资源容器的 `reveal` 类，使内容直接可见。保留其他活动的动画、全部原文、23 个活动方案的默认展开、4 个 Gene Wars 指南的默认收起、完整 PDF 阅读和原文件入口，没有通过折叠方案或删掉资料缩短页面。

## Entrepreneurship 独立 References

原 References 虽然已有 `<section>`，仍处于覆盖整篇正文的同一 `.hp-content` 白框内。现在保留外层 `article#entrepreneurship-content` 与旧锚点，外层采用 `.entre-content-flow`，内部为两个独立白框：正文 `.hp-content`、末尾 `.entrepreneur-references.hp-content`。两个白框间距为 28px，侧栏仍随完整文章工作。

`样式/entrepreneurship.css` 复用原白框边框、阴影和响应式内边距，References 桌面圆角 24px、手机 18px。沿用公共棕色标题、Times New Roman 12pt 字体、`[1]`–`[7]` 列表和完整展开，条目之间留 16px。原七条文献、站内来源链接、S 编号及追溯表均保留，未补造报告地址或改变文稿内容。

## Model for Hardware 图标

仅修改 `样式/model-modules.css` 中 Hardware 图标的配色：浅紫蓝渐变底、靛蓝边框 `#4f46e5`、紫色轮廓 `#7c3aed`、青色结构线 `#06b6d4`、粉色细节 `#ec4899`。按 SVG 的实际路径指定颜色，替换原来匹配不到末尾路径的 accent 选择器。

Measurement 图标、模块按钮文字、页面棕色主题、切换逻辑、模型正文、公式、图表和数据保持。

## 必要检查

- 普通动画模式下，1440px、390px 检查资源容器透明度为 1，23 个活动方案均展开且 iframe 有完整 PDF 地址，4 个指南均默认收起。实际阅读器内容已复看，原 PDF 请求返回 200 且文件头为 `%PDF-`。
- Entrepreneurship 两个白框独立，间距 28px，白色背景；原七条文献完整展开，正文计算字号 16px／12pt，字体为 Times New Roman。桌面／手机均无整页横向溢出。
- Hardware 图标实际颜色为靛蓝、青色与粉色，鼠标切换和方向键切回 Measurement 正常；页面无脚本错误。
- 两个 HTML 页面与本轮修改前对照：所有文字、链接、锚点和表格一致，无重复 ID。原媒体与 PDF 未修改。
- 构建通过：879 个文件、23 个 HTML、1750 个站内引用，缺失／超限／不安全项均为空，最大文件 22,559,008 bytes。

全站要求第 7.3、14 节已同步更新。本机复现／修正后截图、源文件备份、`check.json` 和 `build.log` 在 `.local/resources-references-model-20261016/`；项目长期规范不依赖这些中间文件。
