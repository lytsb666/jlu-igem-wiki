# Hardware 入口与 Education 展开栏等高 · 2026-10-16

本轮按用户两项明确要求修改本地项目，保留全部既有未提交成果和原始资源，没有提交、上传或发布。

## Hardware

`Instrument/hardware.html` 的 `#hw-explore-more` 两个按钮文字分别改为 Software for Hardware、Model for Hardware。其余 HTML 与本轮前相同；逐条对照全部链接目标一致，软件入口仍到 `software.html`，模型入口仍到 `model.html#model-for-hardware`。图标、两列等宽、键盘焦点、悬停与无下划线效果保持。

## Education

用户截图是 Open resources 中 Biotech Explorers 的第一对活动方案：“The Science Code of Breathing” science-poster showcase 与 “Respiration Lab” online class。前者两行、后者一行，原生 summary 自然高度不同，导致左右棕色标题栏下边缘不齐。

- `样式/education.css` 只为 `#resources` 内 `.resource-download-group` 和 `.gene-wars-guides` 的 PDF summary 增加局部自适应最小高度及内容垂直居中。
- `样式/education.js` 按实际网格行配对，读取每排标题自然高度后统一到较高者；长标题原文与箭头完整显示。窗口变化、字体就绪和动态标题加入后重新计算，宽度观察只对宽度变化触发，避免高度调整形成循环。
- 全部 27 个标题栏均处理，包括 23 个活动方案和四个 Gene Wars 指南；在 560px 以下的原单列布局中清除配对高度，恢复自然排版。
- 原 Education HTML、23 个活动方案默认展开、四个指南默认收起、PDF URL、原件入口、活动照片及原稿全部保持。

## 验证

39 项针对性浏览器检查通过，无页面脚本错误。

- Education 在同一页面连续调整为 1440／1280／1024／768／561／390／320px，再恢复 1440px，确认每个实际双列行的两个标题栏等高；截图所示一对在 1440px 下均为 94px。
- 27 个标题文字均完整，23 个活动方案及其阅读器仍展开，四个指南仍收起；普通动画设置下资源容器透明度为 1，无整页横向溢出。单列状态不残留双列的额外高度。
- 活动方案及 Gene Wars 指南的 Enter 展开／收起实测通过，原生阅读控件保持可用。
- Hardware 在 1440／1024／390／320px 检查文字、地址、等高两列和移动端换行，均无裁切或溢出；源 HTML 除这两个文字标签外完全一致。
- 正式构建、资源与差异检查通过：882 文件、23 HTML、1746 引用；缺失、超限、不安全项均为零，最大文件 22,559,008 bytes。
- 本机修改前副本、截图及测量位于 `.local/hardware-education-headers-20261016/`；长期要求已写入全局第 23 节。

本地预览：[Hardware Explore more](http://127.0.0.1:5221/Instrument/hardware.html#hw-explore-more)、[Education Open resources](http://127.0.0.1:5221/Eagagement/education.html#resources)。
