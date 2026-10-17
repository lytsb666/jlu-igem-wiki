# Education 公网排版、iHP 人像与 Measurement 断行 · 2026-10-17

本轮按用户三张截图和正文要求继续本地修改；此前未提交成果保留，未上传仓库或发布网站。最新规则见全局第 29 节。

## 公网参照与恢复范围

实际访问当前[公网 Education](https://jlu-igem-wiki-preview.pages.dev/Eagagement/education.html)，确认三个板块均使用左侧静态纵向照片、右侧完整活动文字和方案入口。1440px 视口时两栏约 411／473px，图库为 `flex-direction: column`，照片无高度上限；Feedback & Learn 位于右侧 `activity-card__stories` 内。

`样式/education.css` 恢复上述照片布局，`样式/education.js` 删除将反馈和工具入口移到通栏的处理。24 项活动的正文、标题、日期、资源链接保持；保留米棕色 See the learning loop 按钮、三条连续总览照片带、独立反馈轮播、照片放大和 Open resources 同行标题等高。B08 缺照片占位仍在，不补造内容。

## 展示照片精简与图注

恢复后测量 1440／1920／1280／1100px 下各卡片两栏。H02、H04 在宽屏上分别出现约 508／999px 的右下空白；另外六项四图活动在 1920px 下有约 225–287px。经逐图查看，精简下列九张展示照片，保留活动主场景、参与和成果画面。

源文件均位于 `a  图片/education/activities/gallery/`，**全部仍在仓库工作区**。只是移除相应 HTML 图片按钮；剩余照片顺序保持，八项图库的图注、数量、图库类别及 `Open photo n of m` 辅助技术名称同步修改。活动 Figure 编号和其他图注不重排。

| 活动 | 移出展示的源文件 | 展示数量 | 更新后图注 |
| --- | --- | --- | --- |
| H02 | `h02-04.jpg` | 4 → 3 | Postpartum-care mini-class and participant activities |
| H04 | `h04-03.jpg`、`h04-04.jpg` | 4 → 2 | Children's clay creations and workshop group |
| B03 | `b03-01.jpg` | 4 → 3 | Classroom demonstration, student participation, and learning materials |
| B06 | `b06-01.jpg` | 4 → 3 | Synthetic-biology presentations and classroom quiz |
| B07 | `b07-04.jpg` | 4 → 3 | Career seminar, participant notes, and student sharing |
| B09 | `b09-02.jpg` | 4 → 3 | Outreach conversations, visitors, and the JLU-SPH team at the fair |
| B11 | `b11-02.jpg` | 4 → 3 | Campus running, the JLU-SPH team, and the event gathering |
| B12 | `b12-04.jpg` | 4 → 3 | Festival outreach conversations and illustrated learning materials |

活动展示照片由 75 张减为 66 张，仍有 23 组图库、24 项活动。上述八项卡片的右下额外空白消除；1440px 下其他卡片最大约 52px，1920px 下最大约 186px，没有借截断文字、压缩字号或裁切原照片来调整高度。

## 另外三处修改

- Measurement：正文标题与目录标签均仅为 `D-B-T-L` 添加 `.measurement-cycle-term` 不拆行样式，保持原字母、连字符、星号、其他文字及锚点。整句可正常在词间换行，避免窄目录出现 `D-B-T-`／`L`。
- iHP Overview：移除 `Interactive project map` 及其空资源框。`pending-overview-map` 保留为不可见的旧锚点，不产生待补文字或布局留白。现在实际缺材料的待补位置为社区回应指南、卡牌说明两处；Summary 继续按此前要求留空。
- iHP 女性科学家轮播：针对 `.ihp-women-gallery` 统一三张原图的高度，桌面 320px、手机 220px。Juan Li 原件只有 156×156，原比例放大展示；后两张保留各自比例，不拉伸、不重画。所有原图、66 条源图注、跳转和轮播切换保持。

## 验证结果

- 源 HTML 对照：24 项活动正文及资源链接相同；66 张留图的原始属性相同，九张移出图源文件仍存在；总览照片带、反馈与 Open resources 原标记相同。iHP 图片来源及全部图注相同；Measurement 除两个术语包裹外完全相同。
- 正式构建后浏览器共 13 组检查通过：Education 1440／1920／390px，Measurement 与 iHP 各 1440／390／320px；三页无脚本错误和整页横向溢出。
- Education 24 卡片照片静态、原比例正确；桌面文字在右，手机在照片后；无通栏反馈。H04 第二张可直接放大，弹窗仅包含保留的两图，初始选中正确。27 个资源阅读器仍为 23 开／4 关，同行标题高度一致。
- Measurement 两处 `D-B-T-L` 在三种宽度均为同一行；实际目录点击到原内容位置，原星号保持。
- iHP 地图待补文字及框消失；三个人像在桌面为 320px、两种手机宽度均为 220px，原比例和轮播按钮有效。桌面／手机截图复看通过。
- `npm run build`、`scripts/check-build.mjs` 通过：858 文件、23 HTML、1718 资源引用，最大文件 22,559,008 字节，缺失／超限／不安全项为零。减少的九个构建资源对应移出展示的照片，源文件没有删除。
- 本机过程数据与截图：`.local/layout-revision-20261017/`。长期要求与照片清单已写入上述项目文件，不依赖本机临时记录。

本地预览：[Education](http://127.0.0.1:5221/Eagagement/education.html#health-guardians)、[Measurement](http://127.0.0.1:5221/Wet-lab/measurement.html#measurement-engineering-cycle)、[iHP](http://127.0.0.1:5221/Eagagement/iHP.html)。
