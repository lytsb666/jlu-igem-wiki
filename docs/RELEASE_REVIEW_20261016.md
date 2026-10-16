# 2026-10-16 本地版本上传与发布

用户明确要求“把本地代码上传仓库然后更新网站”。本轮上传当前项目内已经完成并提供预览的成果，保留此前科研内容、原始媒体、成员记录及待补位置。本记录是本次发布范围和检查入口；最终合并提交、CI／部署结果及线上核验见本轮 PR 的执行记录。

- 仓库：`lytsb666/jlu-igem-wiki`。
- 功能分支：`feat/00-green-feedback-20261016`，开发基线 `3fd710043cdb53d38a30c87eb994238d5f7b1dc7`。
- 公共责任人：00。按所有者本人本轮授权，必要检查后使用 merge commit 直接验收，保留 PR。
- 固定项目：`jlu-igem-wiki-preview`；网站：[固定预览站](https://jlu-igem-wiki-preview.pages.dev/)。
- 实读 `PAGES_DEPLOY_ENABLED=true`，沿用现有 `Wiki CI and Pages` 自动部署；只上传其检查通过的静态产物，不重复手动发布或修改部署开关。

## 本轮范围

| 成果 | 实施与验证记录 |
| --- | --- |
| 《10.15改动》、标绿文稿、Hardware 2.0 手册与成员资料、首页 PCR／倒计时、回顶留白缩放 | [REVISION_REVIEW_20261016.md](REVISION_REVIEW_20261016.md) |
| iHP 章节／卡片／图表互动、访谈文稿和原图替换 | [IHP_REVIEW_20261016.md](IHP_REVIEW_20261016.md) |
| Measurement／Contribution 新封面和 Figure 6 五阶段翻卡 | [COVER_CONTRIBUTION_REVIEW_20261016.md](COVER_CONTRIBUTION_REVIEW_20261016.md) |
| 深棕单屏页脚、封面两行斜体、Hardware 图内汇率 | [FOOTER_HEADPAGE_REVIEW_20261016.md](FOOTER_HEADPAGE_REVIEW_20261016.md) |
| Education 资源显示、Entrepreneurship 独立参考文献白框、Model 图标配色 | [RESOURCES_REFERENCES_MODEL_REVIEW_20261016.md](RESOURCES_REFERENCES_MODEL_REVIEW_20261016.md) |
| Team 全员括号中文名／直体／Advisor 顺序、非 Team 两秒轮播、展开箭头 | [TEAM_CAROUSEL_REVIEW_20261016.md](TEAM_CAROUSEL_REVIEW_20261016.md) |

Homepage 滚动叙事及 Team 滚动保留。iHP 的 Closing／独立 Summary & Reflection 继续按用户指示暂缓，原 20 处待补材料保留，不编造资源或科研数据。全部新增原图、来源清单和全站开发要求一同入库，本机 `.local/` 证据、凭据和构建产物不入库。

## 验证与追踪

- 最新本地正式构建与资源检查通过：879 文件、23 HTML、1750 引用，缺失、超限及不安全文件均为零。
- 各轮按影响范围完成桌面／手机验证，详见上表；最近轮播在正常动画下自动切换、手动按钮和圆点、Team 姓名及 Advisor 顺序通过。展开箭头、触控和减少动画单独检查。
- `teamMembers`／`teamFaculty` 的全部 43 人原数据记录与本轮前保持一致，中文名仅作为展示映射。
- 本轮 PR 可由[分支对应的拉取请求](https://github.com/lytsb666/jlu-igem-wiki/pulls?q=feat%2F00-green-feedback-20261016)查找；[构建与部署运行](https://github.com/lytsb666/jlu-igem-wiki/actions/workflows/wiki.yml)提供实时版本、构建和发布状态。
- 发布后检查固定地址的最终 URL、受影响页面、最新交互与原图／手册资源；不能仅凭提交或部署任务成功认定线上功能正常。
