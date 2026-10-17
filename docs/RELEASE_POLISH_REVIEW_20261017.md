# 当前 Wiki 完整版本上传与固定公网更新 · 2026-10-17

用户在八项截图修改完成后明确授权“把这版传到仓库并上传公网”。本轮将当前可展示网站与必要配套原件、来源及实施记录整体上传；各页记录中的“仅本地／未发布”为当时快照，不能据此回退已确认的后续成果。

## 实时配置与范围

- 仓库：`lytsb666/jlu-igem-wiki`（Public），默认分支 main；当前分支 `codex/smooth-navigation-ihp-polish-20261017`。正常 fetch 后 HEAD 与 origin/main 同为 `8e16d1d96a65a46189da7ffc17163a038fd14d8f`，没有需要整合的远端新增提交。
- 实读 `PAGES_DEPLOY_ENABLED=true`、`PAGES_PROJECT_NAME=jlu-igem-wiki-preview`；原 `Wiki CI and Pages` 工作流在 PR 检查后合并 main 时部署同一固定项目。固定地址：[jlu-igem-wiki-preview.pages.dev](https://jlu-igem-wiki-preview.pages.dev/)。未改动工作流、账号权限、凭据或发布开关。
- 公共责任人 00。按 `CONTRIBUTING.md` 的所有者本人明确授权规则完成必要检查后直接验收，保留 PR 并采用 merge commit，不另要求第二人批准。
- 提交当前网站所需页面、脚本、样式、原媒体、完整 PDF、来源文档及交接；保留并排除与本次网站发布无关的 `docs/JUDGING_ASSESSMENT_20261017.md`。不提交 `.local/`、依赖、缓存、构建目录或凭据。

| 当前版本内容 | 长期实施与验证 |
| --- | --- |
| iHP 米色、全站平滑定位、Collective Growth 原照片恢复、Member 筛选文字 | [SMOOTH_NAVIGATION_IHP_POLISH_REVIEW_20261017.md](SMOOTH_NAVIGATION_IHP_POLISH_REVIEW_20261017.md) |
| Notebook 关键词及三页历史关键词变更 | [HEADPAGE_KEYWORDS_REVIEW_20261017.md](HEADPAGE_KEYWORDS_REVIEW_20261017.md)，iHP／Contribution 以最新八项修订覆盖 |
| iHP 6.0 材料、两份完整 PDF、新图、38／39 映射 | [IHP_REVISION_6_REVIEW_20261017.md](IHP_REVISION_6_REVIEW_20261017.md) |
| 总图卡框与完整人脸、标题层级、40 个活动图标及单人肖像 | [IHP_ACTIVITY_CARD_FIT_REVIEW_20261017.md](IHP_ACTIVITY_CARD_FIT_REVIEW_20261017.md)、[IHP_HEADING_ICON_PORTRAIT_REVIEW_20261017.md](IHP_HEADING_ICON_PORTRAIT_REVIEW_20261017.md) |
| 图标反馈表、设备合图和图注 | [IHP_NAVIGATION_CAPTIONS_REVIEW_20261017.md](IHP_NAVIGATION_CAPTIONS_REVIEW_20261017.md) |
| 光标、目录、媒体入口、B08／B10 图库和病原体名称口径 | [SITE_POLISH_PATHOGENS_REVIEW_20261017.md](SITE_POLISH_PATHOGENS_REVIEW_20261017.md) |
| Overview 2.0、统计卡／圆形流程图、漏注与 Education 新封面 | [IHP_OVERVIEW_ICONS_EDUCATION_REVIEW_20261017.md](IHP_OVERVIEW_ICONS_EDUCATION_REVIEW_20261017.md) |
| Education B14 游戏截图 | [EDUCATION_IHP_LAYOUT_REVIEW_20261017.md](EDUCATION_IHP_LAYOUT_REVIEW_20261017.md) |
| 最新八项截图修订、封面词、PDF 标签、贴纸悬停翻卡、浅色内凹 sponsor 槽和 Model 四图 | [EIGHT_REVISIONS_REVIEW_20261017.md](EIGHT_REVISIONS_REVIEW_20261017.md) |

原科学数据、成员身份、完整媒体和历史锚点保持；不插入暂缓 Feedback PPT，不补写 Summary，不搬动 Closing，不猜填仍未确认的内容。

## 验证与发布追踪

- 最近正式构建使用 Node 24.19.0，通过 `npm run build` 和 `node scripts/check-build.mjs`：964 文件、23 HTML、1786 引用，最大单文件 22,559,008 bytes，缺失／超限／不安全项均为 0。代码责任映射及暂存差异另在上传前核对。
- 各轮必要检查见上表；最新八项 13 组浏览器检查覆盖 1440／390px，iHP／Model 补测 320px；卡片悬停、鼠标点击、键盘、触屏、原图、B08 14 张图库、设备同高和 sponsor 42 秒移动／悬停暂停通过。五页 460 个原锚点、科研表格、PDF 地址、原稿正文与 Model 公式均保留。
- 图片和文档依据已有 `.gitattributes` 原字节入库；暂存后检查所有新增二进制原件与工作区字节一致。静态上传仅使用检查通过的 `pages-client`／`dist/client`，不上传服务器包装、Git 元数据、环境或私密文件。
- [本分支 PR](https://github.com/lytsb666/jlu-igem-wiki/pulls?q=head%3Acodex%2Fsmooth-navigation-ihp-polish-20261017) 保留当前提交、检查、合并与上线核查的最终结果；[生产 Actions](https://github.com/lytsb666/jlu-igem-wiki/actions/workflows/wiki.yml) 保留 `wiki-build`、`pages-deploy` 和实际部署 URL。不能将这份发布流程记录本身视为部署已经成功。
- 发布后核对固定域名的最终无后缀页面、iHP 新词／102 图注／贴纸翻面及两份资源、Education B08／B14／新封面、Model 四张新图和白色标题、Hardware 时间线无注／21 图、Contribution 新词、页脚浅色滚动槽／20 链接／四码及必要旧地址。最终结论回填同一 PR 描述。

本机上传清单、Git blob 核对、线上资源与浏览器记录保存在 `.local/release-polish-20261017/`。本文件、全站规范、相关页交接、原件／来源以及远端 PR／Actions 保存长期接手结论。

回退通过 GitHub Revert 本 PR 后重新构建和部署，不 reset、clean、强推或删除原始资料。
