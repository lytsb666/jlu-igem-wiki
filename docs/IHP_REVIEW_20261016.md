# iHP 修改交接 · 2026-10-16

本次在保留工作区此前未提交成果的基础上，实施用户提供的《ihp修改意见.docx》。仅作本地修改；本轮没有提交、上传或发布授权，也没有执行这些操作。

来源文档 SHA-256：`430724ffccabd520cbf303fac9aa567ea68d8f6d77945b7edc91696aea981223`。

参考页：<https://2025.igem.wiki/greatbay-scie/human-practices>。只参考章节与交互组织，本站原始文稿、媒体、米棕配色及用户提供的内容外框继续保留。

## 优先级与暂缓部分

用户要求与刚才的改动冲突时优先保留刚才的改动。因此没有执行附件第 1 项中取消封面斜体、删除关键词的旧意见。iHP 的封面、共享导航、紧凑页脚、自适应回顶人物，以及首页 PCR 和数码倒计时未被本次改动覆盖。

针对附件第 33 项，用户明确回复：“先不处理这部分 做完后告诉我有什么问题”。现有 `summary-reflection` 整段内容和位置保持，未将 Closing 搬到 Expanding，也未编写独立总总结。以后处理时需要先确定独立总总结的文稿与 Closing 归属。

## 已实施

- 目录重组为 9 个主入口、6 个二级入口。How Human Practices Shaped ByeGerm 下包含 Project Evolution、Stakeholder Strategy、Reflection Cycle、C.A.R.E.S.；Expanding the Circle 下包含 Inclusive Engagement 与 Collective Growth。四个 Stakeholder 步骤仅保留正文跳转卡片，不再占用二级目录。继续复用全站正文跟随展开、离开收起、悬停冻结布局的交互。
- Overview、How、五个 Stage、Expanding 与其两个分节加上圆角标题框及四色条；Stage 的英文副标题和问题放在同一个标题框内。活动标题加框，恢复活动编号，并保留 Stage 5 的原层级编号。原文外框继续使用上一轮用户提供的原图，裁去显示层的白色边角。
- WHO 引文突出显示；四步骤以可跳转卡片呈现。五问题使用附件新图，叠加五个原生链接及手机文字入口；原图仍可打开查看。
- 三圈使用附件原图，通过 CSS 遮罩分层轻微浮动并去除圆外白底。矩阵保留附件中的坐标和数值，叠加 10 个可点击圆点；人名和群体逐项按附件的唯一表格录入，手机分类按钮使用相同数据。没有重新计算分数或推断专家身份。
- Reflection Cycle 使用附件箭头原图旋转，四段完整英文说明置于右侧。CARES 使用新图，五个标签仅保留首词，五项内容全部展开；原始同意书等缺失文件的位置继续保留。
- 替换 Stage 5 Age-Adapted Education 第一张照片；邢芳丽访谈使用两张新照片及附件中的完整 Context、Dialogue、Reflection、三条 Iteration，保留四路输入、19 项特征、275 维输入、112 组／13,552 个组合、RSV 验证等原文信息，DNABERT-6 的跨段断词合并。Model for Measurement 跳转保留。
- 替换 Tsan-Yuk Lam 访谈流程图；赵天意建议改为两条主建议，第二条下列三个括号编号标准；张英涛访谈两张仪器图缩小并排，迭代按附件完整列为 1–3，25–95 °C、18B20、PID、50 mm、Orange Pi 5 Max／RK3588、YOLOv8n 与 OpenCV 等信息保留。
- Public Context 改为正式标题；清除相同段落重复出现的 Context／Dialogue 标签；删除 Stage 2 末尾重复问题；Stage 5 原需求表增加竖线并延续 Measurement 棕色表头风格，未改表格内容。
- Public 四张新图按两个活动配成两组轮播：活动现场＋问卷样式，另一活动现场＋参与者填写。旧版额外的手机问卷截图仍保留在 Additional questionnaire material 中，没有删除原图。
- 活动照片缩小并补图注，共 20 组多图轮播，每 4.5 秒切换。支持按钮、圆点、键盘与横向触控，悬停／焦点／手动暂停时停止切换；离开可视区、页面隐藏、减少动画时停用自动播放。统计图、表、流程图保留独立展示，不按活动照片缩小。
- Inclusive Introduction 加强显示；Women Scientists 的三位人物照片改为可跳转相应访谈的轮播；删除 Collective Growth 前的 Explore our global collaboration network 链接。未恢复已删除的独立 Collaboration 或 Inclusivity 页面。

## 文件与原始素材

- 页面：`Eagagement/iHP.html`。
- 本页样式与交互：`样式/ihp-manuscript.css`、`样式/ihp-manuscript.js`，未修改公共目录交互脚本。
- 新图片：`assets/human-practice/revision-20261016/` 内的 13 张原始图片，直接从 Word 解包，未重新压缩、裁图或绘制科研内容。`source-manifest.json` 记录文档及各图片哈希。
- 此前 `revision-20261015` 的原媒体继续保留。全部原有锚点及 20 个原有待补资源位置保持；五张原始表格文字未改变。
- 全站持续要求已同步至 [全站开发要求](全站开发要求.md) 第 15 节。

## 必要检查

- 源文对照通过：全部原有锚点保留，无重复 ID；封面、导航、页脚、Summary 段落的 HTML 与本次修改前一致；20 个待补位置及五张表格的文字保持。新访谈全文与附件逐段对照，图片哈希与来源清单一致。
- 浏览器检查通过：正文进入／离开 How 章节时二级目录正确展开／收起；五个问题和四个步骤全部可跳转；矩阵圆点与分类按钮显示对应人物，五项 CARES 正文展开；两条临床分支切换与原图查看保持。
- 轮播正常自动切换，并验证悬停暂停、手动暂停、前后按钮、键盘与圆点；三圈与箭头动画存在，减少动画时停用动画及自动轮播。需求表左右边框均为 1px。390px、320px 手机页面无横向溢出，页面无脚本错误。
- 与追加的封面／Contribution 卡牌一起构建通过：879 个文件、23 个 HTML、1750 个站内引用，缺失／超限／不安全项均为空，最大文件 22,559,008 bytes。Git 差异空白检查通过。

本机提取文件、截图、检查脚本与 `browser-check.json`、`final-check.json`、`build.log` 位于 `.local/ihp-polish-20261016/`，不作为长期要求的唯一副本。

## 仍需处理

1. **Closing 与独立总总结**：按用户回复暂不处理；当前 Summary & Reflection 仍放置现有 Closing，后续需要独立文稿及版式决定。
2. **20 个既有待补位置**：原稿要求但尚未提供的图片、知情同意文件、评分标准、活动材料等继续显示 To be provided，本次没有虚构或用示例文件代替。

本地预览：<http://127.0.0.1:5221/Eagagement/iHP.html>（开发服务运行时可用）。
