# 2026-10-16 当前版本上传与发布

用户本轮明确要求“把现在的版本上传仓库并更新网站”，授权将此前已经完成的本地成果一并入库，通过 PR 检查后合并 main 并更新既有固定网站。此前记录中的“仅本地／未上传”保留为历史快照，不代表本次仍禁止发布。

- 仓库：`lytsb666/jlu-igem-wiki`，功能分支 `codex/footer-card-polish-20261016`，本次开发基线 `152af97d987458170d3b4725b5879fcf21862485`。
- 公共责任人：00。按所有者本轮授权及 `CONTRIBUTING.md` 的验收规则，必要检查通过后保留 PR，以 merge commit 合并，无需重复索要发布确认。
- 固定项目与地址保持：`jlu-igem-wiki-preview`，<https://jlu-igem-wiki-preview.pages.dev/>。
- 已实读仓库 `PAGES_DEPLOY_ENABLED=true`；沿用现有 GitHub Actions 的构建及静态产物部署，不变更部署开关或创建新项目。

## 本次版本范围

| 成果 | 当前交接 |
| --- | --- |
| 页脚大半屏、左右品牌居中、四个二维码、完整单行导航、标题同高、七个原色赞助商 | [FOOTER_HALF_LAYOUT_REVIEW_20261016.md](FOOTER_HALF_LAYOUT_REVIEW_20261016.md)，以末节最新修正为准 |
| 目录大小写与分级、封面首行直体、双侧人物、Education 静态照片及原资源入口 | [REQUEST_SEQUENCE_REVIEW_20261016.md](REQUEST_SEQUENCE_REVIEW_20261016.md)、[EDUCATION_STATIC_PHOTOS_REVIEW_20261016.md](EDUCATION_STATIC_PHOTOS_REVIEW_20261016.md) |
| 《10.16.docx》、设备图限宽、Hardware／Model／Software／Contribution、Team 仅展开卡片去中文 | [DOCUMENT_REVISION_REVIEW_20261016.md](DOCUMENT_REVISION_REVIEW_20261016.md) |
| Hardware 两个入口文字、Education 27 个资源标题栏按行等高 | [HARDWARE_EDUCATION_RESOURCE_HEADERS_REVIEW_20261016.md](HARDWARE_EDUCATION_RESOURCE_HEADERS_REVIEW_20261016.md) |
| 首页机器场景刚进入即计时、视频图注清理 | [HOMEPAGE_VIDEO_REVIEW_20261016.md](HOMEPAGE_VIDEO_REVIEW_20261016.md) |
| iHP 3.0 翻卡、步骤、原图、对话排版、照片去侧框、轮播、Closing 归位 | [IHP_REVISION_3_REVIEW_20261016.md](IHP_REVISION_3_REVIEW_20261016.md) |

iHP 80 处现有图注继续按最新要求暂缓修改，独立 Summary 空出待补；未提供的 PDF 等材料不伪造。全站大白边仅保留方案，本次不额外批量裁图。原科研数据、文稿、媒体及其他工作区保持。来源清单、长期要求与待办一同入库；凭据、`.local/`、缓存、依赖和本机构建产物不入库。

## 验证与追踪

- 此前各轮已按影响范围完成桌面、手机及交互检查；本次对正式构建、资源边界、CODEOWNERS、暂缓状态及关键页面做发布检查，不重做已通过的整站穷举验证。
- 最新构建：885 文件、23 HTML、1749 引用；最大资源 22,559,008 bytes，缺失、超限、不安全项均为零。
- 仓库 PR 和 main 的 `wiki-build` 必须通过，沿用检查通过的 artifact 部署。
- 合并和部署状态以[本分支 PR](https://github.com/lytsb666/jlu-igem-wiki/pulls?q=head%3Acodex%2Ffooter-card-polish-20261016)及 [Wiki CI and Pages](https://github.com/lytsb666/jlu-igem-wiki/actions/workflows/wiki.yml) 的实际执行结果为准；上线后须再从固定地址检查当前内容与关键资源。
- 本轮上传清单、本地检查及线上证据放在 `.local/release-current-20261016/`；本文件保存长期发布范围与约束。

回退方式：必要时通过 GitHub Revert 本次 PR，再运行原构建与部署流程；不重置、强推或删除既有媒体。
