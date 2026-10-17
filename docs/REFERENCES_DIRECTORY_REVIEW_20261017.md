# References 样式与目录准确跳转 · 2026-10-17

用户要求全部参考文献参考 Hardware，不要在正文白框中再套一个框；另反馈点击目录有时不能到达所选内容。本轮沿用当前工作区，只修改共享显示与目录定位，保留 iHP 4.0、图注暂缓、原资料、其他未提交成果及既有发布状态。

## References

- `preview-format.js` 标记参考文献章节及嵌套内层；`preview-format.css` 统一为 Hardware 的单层白色圆角卡片、标题和无内框列表。
- Measurement、Description、Design 的 `.research-reference` 保留原 ID 与 DOM，但清除其边框、底色、阴影、额外内边距和圆角，使用外层章节白卡。标题采用与 Hardware 一致的 22pt。
- Hardware、Model 两个模块、Education 的 Scientific sources、Entrepreneurship 沿用同一章节样式。条目不套逐条卡片，长来源地址可换行。
- 段落型文献采用 24px 悬挂缩进，列表型文献沿用中括号 marker；手机不裁掉 `[1]` 等编号。没有修改参考文献原文、顺序、原 ID、来源地址或正文引用转换脚本，Reference → References 的复数名称保持。

## 目录问题与实现

修改前用真实鼠标点击复现：Hardware 桌面点击 Second generation 后目标距视口顶部约 4045px，点击 References 后仍在约 3846px；手机 Hardware References 曾落在约 15037px、iHP Summary 在约 3833px、Education 后半章节在约 1772px。这些页面在原平滑滚动途中出现懒加载图片、折叠／目录布局变化，滚动仍使用原坐标。旧的 scrollIntoView 还会把 root scroll-padding 与 target scroll-margin 相加。

- 新增 `directory-navigation.js`，仅处理目录／Team 跳转条中的同页锚点；保留原页面先行的模块／折叠展示逻辑，再用实时坐标直接定位。
- 必要时展开原生 details 与原自定义折叠，旧别名锚点定位到邻接可见内容；不删除或重命名旧 ID。
- 每次读取当前目标坐标，只应用一次页首避让，至少 88px。短时间内随附近待加载图片和布局变化校准，稳定后结束，最长 4 秒；用户的滚轮、触控、指针或键盘输入立即中止，第二次点击取代第一次。
- `preview-format.js` 在校准期间维持所选目录项，并暂缓分组自动收放／内框自动居中，避免两套滚动互相打断；结束后恢复原正文跟随规则。
- 普通行文链接、正文引用角标、图片、PDF、页脚导航、顶部导航和其他跨页地址不走该定位逻辑。未重跑页面生成器或更改正文 HTML。

## 验证

- 7 页 × 桌面／390px × 首段／中段／末段，共 42 次实际目录点击，目标全部在视口顶部 88–140px 附近，URL 对应正确。覆盖 Hardware、Measurement、Description、iHP、Model Measurement、Education、Entrepreneurship。
- 7 个参考文献页面的桌面／手机共 14 组样式检查通过，包括 Model Hardware；外层白卡、内层无框、无逐条框、22pt 标题、完整编号和长链接。已复看 Hardware／Measurement／Description 的实际截图，修正初次清除内边距时遗留的旧负缩进，编号现完整位于卡片内。
- 另有 10 组边界检查通过：Protocol／Parts／Engineering 手机首末段键盘跳转、Measurement 展开后的二级章节、快速连续选择、用户滚轮中止、原正文角标到原参考条目。Engineering 按实际用户方式先展开相应目录组，再选择该组条目；不把自动收起的隐藏链接当成可点击链接。
- 正式构建通过：867 文件、23 HTML、1727 资源引用，最大资源 22,559,008 bytes；缺失、超限、不安全项均为零。构建版复查 Measurement 单层白卡与目录定位、Model 两个模块的 References、Software 手机 Open Source 定位均通过，模块状态及页面脚本正常。
- 必要浏览器检查无脚本错误，Git 差异空白检查通过。此前 iHP 4.0 的文件、原图片、66 条图注及独立 Summary 留空均未修改；本轮仅新增目录定位脚本、修改共享样式／显示增强和交接规范。
- 原始记录和截图在 `.local/references-directory-20261017/`，长期要求与结论保存于本文件及全局第 28 节。

本地预览：[Measurement](http://127.0.0.1:5221/Wet-lab/measurement.html)、[Hardware](http://127.0.0.1:5221/Instrument/hardware.html)。本轮未提交、上传或发布。
