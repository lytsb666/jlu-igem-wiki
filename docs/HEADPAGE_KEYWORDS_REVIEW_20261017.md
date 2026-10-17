# 三页封面关键词更新 · 2026-10-17

按用户明确给出的文本和顺序，只修改 iHP、Notebook、Contribution 的 headpage 右下角三个关键词。

| 页面 | 第一项 | 第二项 | 第三项 |
| --- | --- | --- | --- |
| iHP | Sharing Knowledge | Enabling Reuse | Empowering iGEM |
| Notebook | Primer Validation | System Optimization | Performance Evaluation |
| Contribution | Open Tools for iGEM | Reusable iGEM Frameworks | Knowledge Sharing Across iGEM |

三处静态 HTML 的 `.lab-cover-note > span` 逐项替换；封面原图、左下角标题、正文、链接、锚点与共享 headpage 脚本／样式保持。保留单行黑色圆角框、小屏内部横向滚动及原字号。既有未提交的米色／平滑跳转／照片恢复等成果继续保留。

核对三页在 1440px 桌面与 390px 手机的文字、顺序、单行、内部滑动及整页宽度，正式构建和资源检查通过。范围限定于三页关键词，没有重跑旧页面生成器或重复全站回归。

本轮只做本地修改，未上传或发布。源码与浏览器记录在本机 `.local/headpage-keywords-20261017/`；长期要求同步全局第 33 节。
