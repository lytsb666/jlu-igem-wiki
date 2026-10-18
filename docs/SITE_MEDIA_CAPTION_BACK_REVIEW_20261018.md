# 湿实验 10.18、框外 Back、图表注与可撤回图片处理

本轮依次落实《10.18湿实验建议》、全站 Back 位置、图表注核对及图片空边／背景处理。用户要求图片处理可以单独撤回。本轮仅本地修改，没有上传仓库或发布公网；此前 Software／Hardware 1018 未提交成果和其他无关文件保留。

## 湿实验附件

完整原件归档在 `assets/wetlab/revision-1018-20261018/sources/`，大小 839,685 字节，SHA-256 为 `6eae22bedf65e04bbde71d9de13d773503aac9f1806d718a32b0769c0bbb69fa`。七张截图只作为对应位置参考。

- Parts：指定表格首行 `LbCas12acompatible` 改为 `LbCas12a compatible`。
- Measurement：2.2.2 d) 标题及 2.2.3 b) 下四项小标题去末尾冒号；8.2 删除指定末句。第 5、6、7 章标题中的物种名与基因名之间改空格，正文标题和目录同步，缩写内部连字符保留。
- Measurement 第 4 章及目录改为 `Transfer to Human Metapneumovirus Subtype B N gene (hMPV-B N gene) and Performance Characterization`。
- Results：52 条图注删除 `shows the`，描述首字母大写，统一 `Figure N. Description`；保留科学上／下标。图片替代文字和放大入口说明同步，原地址保持。
- Protocol：正文、目录、各级标题共 28 处 `omp P6` 改为 `ompP6`，包括 `HI-ompP6 gene` 和完整物种名称。

## 框外 Back

共享 `样式/reading-return.js`／`.css` 移除正文内占位。44 × 48 像素棕色竖排 `↶ Back` 的左缘距正文框右边 2 像素，提示为 `Back to where you were`。窄屏预留右侧空间，不盖文字或图片。

按钮跟随页内跳转目标，目标标题滚出视口后消失；返回恢复原阅读位置、URL 和 Model／iHP 分支。弹窗及跨页链接保持原行为。首页继续全屏滚动叙事，没有正文框目录。

## 图表注核查

18 个内容页共 380 处说明：301 条 Figure、79 条 Table。各页按阅读顺序分别编号；Model 两模块保留独立编号。12pt、加粗、每行／末行居中、标签标点及无多余句末句点均通过检查。

发现并改正：

1. 创业页 BMC、SWOT quadrant、Four-round milestone financing arrangements 是结构化卡片，移除原 Table 3／9／18 标记，保留普通标题和全部卡片内容。38 张实际表格重排为 Table 1–38，正文引用同步；七条图注保持。
2. iHP 暑期网课课表虽然以 JPEG 保存，实际为表格。旧 Figure 93 改为 `Table 6. Online course timetable for the Summer Dry Lab Camp`；后续图注顺延，现为 Figure 1–100，正文引用同步。共享格式器识别 `data-wiki-media-kind="table"`。
3. Results 52 条说明按附件修改。其他符合规范的说明和科学含义保留；没有为无标题照片、资料或原有未编号实验配方表编造说明。

现行全部说明和创业编号映射见 [审计记录](SITE_MEDIA_CAPTION_BACK_AUDIT_20261018.json)。旧交接保留历史快照，第 48 节将卡片计为 Table 的口径由本轮覆盖。

## 图片和撤回边界

`样式/media-presentation.js`／`.css` 是独立显示层，原图字节不改。`assets/media-presentation-20261018/` 保存 141 份原件路径、哈希及窗口；其中 100 个空边裁切候选、133 个纸白背景候选。

裁切保留安全边距；已有科研图窗口与候选窗口求交，不重复套裁。Hardware 原专用窗口、iHP 第一代两图同高布局保持。纸白背景使用浏览器显示滤镜，检测到的彩色区域白色前景单独保护；Contribution 第一张原理图的近白纸纹单独处理。专用图片外层白底／空边框同步清理，放大仍打开完整原件。

照片、首页／封面及浮动人物保持原色和构图；四张 Model 机制图的白色标题和彩色内容底板不加纸白滤镜。曲线、坐标、图例和科研细节不重绘。已有窗口足够紧或图内色板承担内容作用时，不强行裁切。

`node scripts/set-media-presentation.mjs --disable` 只改图片设置文件；文字、图表注、框外 Back 和此前 Software／Hardware 成果保留。恢复使用 `--enable`。完整方法见 [仅撤回图片处理](MEDIA_PRESENTATION_ROLLBACK_20261018.md)，不能通过整批回滚来撤销图片效果。

## 验证

- 18 页 × 1440／390 像素，共 36 组浏览器核查：380 条说明类型、连续编号和格式通过；无孤立说明、整页横向溢出或脚本异常。
- 17 个有页内链接的内容页 × 两种宽度，共 34 组 Back 检查：距框右侧 2 像素、完整位于屏幕内；返回原阅读位置测量误差为 0，URL 恢复、滚出目标后隐藏，正文内占位为 0。
- Measurement、Results、Hardware、iHP、Contribution、Entrepreneurship × 两宽度，共 12 组图片开启／关闭对照：无整页溢出或脚本错误，关闭后说明和原图地址逐项一致。
- Model 两宽度、正常动画：四张白色标题保持；跨模块跳转后恢复原模块及位置；关闭／再开启后科研窗口样式一致，不叠加裁切。
- 18 页源文件对照：1,672 个原锚点、657 个媒体来源、全部 PDF 链接保持；133 张原生表格数据除附件明确文字修正外一致。141 份清单原件 SHA-256 全部匹配。
- 撤回命令检查当时 1,488 份文件：关闭只改变 settings.json，重新开启后全部字节一致。无关裁判评估文档未修改。
- 最终构建通过；资源检查为 974 文件、23 HTML、1,797 引用，缺失／超限／不安全路径均为 0；`git diff --check` 通过。

审计 JSON 保存现行标签全文、来源哈希、编号映射和交互检查结果。临时截图和辅助脚本在 `.local/`，不是需求、来源或实施记录的唯一副本。
