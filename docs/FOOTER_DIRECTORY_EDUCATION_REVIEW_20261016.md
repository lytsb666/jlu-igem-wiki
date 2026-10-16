# 页脚、目录、人物与 Education 后续修正 · 2026-10-16

页脚随后整体放大，并删除第二个生工展示；当前滚动组为 7 个标志，最新字号／尺寸见 [FOOTER_SCALE_REVIEW_20261016.md](FOOTER_SCALE_REVIEW_20261016.md)。以下 8 个标志与旧尺寸是此前快照。

Education 活动照片随后又按用户要求改为静态竖排，并删除 Open toolkit 提示、加宽 Activity plan 阅读按钮；最新规范已写入全局第 20 节，详见 [EDUCATION_STATIC_PHOTOS_REVIEW_20261016.md](EDUCATION_STATIC_PHOTOS_REVIEW_20261016.md)。以下活动照片两秒轮播／跟随描述为此前快照，其他页面成果保持。

本轮继续在 `codex/footer-card-polish-20261016` 实施用户追加要求，保留此前未提交的 Hardware Figure 21 删除与 Contribution 卡牌裁边。仅本地修改，没有提交、上传或发布。全局入口第 20 节为同日最新规范，覆盖此前记录中相冲突的显示要求。

## 页脚

- 共享 `样式/footer.js/css` 去掉导航大外框及页脚 Team 行，顶部 Team 导航保留。Home、Project、Engagement、Wetlab、Instrument、Judging 排成两列三行，每组标题在链接上方，20 个链接分组各占一行；桌面字号由 16／14px 放大为 19／16px。窄屏组内可横向滑动，不拆行、不造成整页横向溢出。
- 保留深棕底、ByeGerm 品牌、校名、5 个原二维码与版权。导航、联系、赞助商合占一屏，不设内部纵向滚动。
- 所有页面赞助商采用原 Team 的连续横向滚动，42 秒一周期，悬停／聚焦暂停；取消非 Team 的两秒翻页、圆点与侧按钮。减少动态时停用动画、隐藏重复组并保留手动横向阅读。
- 移除 HIT 展示，原文件仍保留。加入卫生检验教研室徽标，8 个原色标志构成一个完整组，另复制一组实现无缝循环。
- 新徽标原件从用户附件复制到 `assets/site-footer/revision-20261016-followup/health-inspection.png`；其余原件继续位于 `assets/site-footer/revision-20261016/`。`assets/site-footer/sponsor-cutouts-20261016/` 的 SVG 内嵌完整原 PNG，通过显示窗口、背景 alpha 或盾牌外缘 clipPath 去掉外部纸面；不重绘、不改 RGB、不覆盖原图。盾牌内部原白底及图案保留。来源、SHA-256 与显示窗口在同目录 `sources.json`，显示文件说明见 `README.md`。取消原有赞助商灰度／反相与混色。

## 目录、封面与人物

- `样式/directory-labels.js` 只处理目录可见文本：句首大写，显式保留科研名词／缩写、基因、品牌及工程节点编号。以文本节点更新，保留 `sup`、`sub`、行内标记、链接目标和锚点；正文标题不改。公共目录与 Team 跳转目录处理新增动态条目。
- `样式/site-format.css` 的嵌套支线改为 3px 棕线，增加 2px 横向短线，每层向右错开；Measurement 四层实测左坐标约 95.6／130.6／165.6／200.6px。自动展开、离章收起及悬停时布局稳定的原逻辑不改。
- Measurement 目录 `Box of measurement` 删掉冒号；正文该段保持。Hardware 成本 SVG 仅将汇率并入最高柱文字 `CNY 158,300 (US$1 ≈ CNY 7)`，删除原左上独立标签，柱形路径、坐标和金额不变；原图入口仍指向此 SVG。
- iHP headpage 三项主题词逐字改为用户给出的英文。全部 17 个正文页及 Team 封面第一行队名／栏目使用加粗直体，第二行子页名保留斜体；Judging 查询上下文保持。iHP Closing／独立总总结不动。
- 共享 `样式/back-to-top.js/css` 在原右侧回顶人物外增加左侧直达页脚人物，沿用已有模型与动画，以固定角色偏移选取不同角色，不生成新图。按钮靠近当前正文白框左右外缘，空白不足缩小或隐藏，保持 80／104px 单人／双人上限；狭窄侧边允许更小显示。避开内容、媒体、目录与弹窗，鼠标／键盘／触控可用，键盘跳转将焦点交给对应页首或页脚。两按钮的布局观察互相排除，避免互相触发重排。Homepage 原滚动叙事与角色策略保持。

## Education 与 Contribution

- 用户明确确认“恢复之前连续横向照片带”：Education 开头三组总览照片恢复原双组连续照片带，不再使用分页轮播；原悬停暂停与减少动态支持保持。
- Health Guardians、Biotech Explorers、Diversity Partners 的 24 个活动框统一左侧照片、右侧内容，取消左右交替。桌面减少图片边距、放大到左栏完整宽度；长正文时左图可在卡片内跟随。1050px 以下先图后文。
- 23 组有照片的活动中，22 组多图套用共享两秒轮播、圆点及悬停侧箭头，单张不创建额外控件。全部原照片、文字、图注、工具包和点击看大图保留；B08 尚无照片，继续原占位，不补造素材。
- Contribution 原 Figure 5 改用 iHP 当前 Figure 4 的 `assets/human-practice/revision-20261016/image4.png`，同一原图同时用于展示和打开原件，尺寸为 960×540；说明同步，仍编号为 `Figure 5. C.A.R.E.S. Ethical Evaluation Framework`。旧 Contribution 图保留在仓库，其他图号和 Figure 6 卡牌不改。

## 必要检查

- 1440×900、1280×720、390×844、320×740：页脚分别为 900／720／844／740px；两列三行、20 链接、5 二维码、8 个赞助商、版权完整，导航外框已去掉，组内链接同一行，无整页横向溢出。连续滚动、悬停暂停、减少动态模式正常。
- 17 个正文页逐页确认：封面首行直体、子页名斜体；目录句首格式、有效锚点及不同的两侧角色正常，无页面脚本错误。Measurement 层级支线粗细与逐级偏移单独确认。
- Education 24 项左右布局、22 组多图轮播及 3 条连续总览照片带正常；H01 图片占满左栏，自动两秒切换，打开大图可读取全部三张，弹窗期间人物隐藏。手机检查先图后文、图片圆点与正文显示。
- 左人物键盘 Enter 直达页脚并正确转移焦点，右人物可返回页首；原图模型保留。iHP 手机 Judging 上下文及三项新关键词正确。Contribution Figure 5 图源和图注正确。
- 正式构建与资源检查通过：885 文件、23 HTML、1754 引用，最大资源 22,559,008 bytes，缺失／超限／不安全项均为零。既有原始 PNG 未修改或删除。
- 本机截图与检查位于 `.local/footer-followup-20261016/`；`results.json` 的错误／失败均为空。最初层级检查误把同级分支当成祖先链，已改为读取同一目录链接的真实祖先，单独复核通过，无需重复其他已通过检查。

本地入口：[页脚](http://127.0.0.1:5221/Instrument/hardware.html#site-footer)、[Education 活动](http://127.0.0.1:5221/Eagagement/education.html#health-guardians)、[Contribution Figure 5](http://127.0.0.1:5221/Project/contribution.html#contribution-image-6)。
