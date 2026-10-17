# 2026-10-17 当前版本上传与发布

用户明确要求“把现在的版本上传仓库并更新网站”，授权将连续几轮已完成的本地成果整体入库，通过既有 PR 检查后合并 main 并更新固定站。以下文档中的“仅本地／未上传／未发布”均是各轮完成时的历史快照，本次发布范围以此记录及实际 PR／Actions 结果为准。

- 仓库：`lytsb666/jlu-igem-wiki`；分支：`codex/site-refinements-20261016`；开发及已核对远端基线：`497ef32`（PR #10）。
- 固定站：<https://jlu-igem-wiki-preview.pages.dev/>，既有 Pages 项目 `jlu-igem-wiki-preview`；发布开关实读为 `PAGES_DEPLOY_ENABLED=true`。不改变工作流、凭据或发布项目。
- 公共责任人 00。按 `CONTRIBUTING.md` 的所有者本人明确授权规则，完成必要检查后直接验收，保留 PR，以 merge commit 合并；无需再次索取发布批准。

## 本次版本范围

| 完成本地修改 | 实施与验证记录 |
| --- | --- |
| Protocol 白底留白、目录／References、科研斜体、Member 筛选 Arial、Hardware 裁边、Software 手册与下载对齐、页脚校徽／人物层次 | [SITE_REFINEMENTS_REVIEW_20261016.md](SITE_REFINEMENTS_REVIEW_20261016.md)、[IHP_REVISION_4_REVIEW_20261017.md](IHP_REVISION_4_REVIEW_20261017.md) |
| 页脚左右子页上下对齐，Source code 为 jlu-sph | [FOOTER_HALF_LAYOUT_REVIEW_20261016.md](FOOTER_HALF_LAYOUT_REVIEW_20261016.md) 最新修正 |
| References 单层白卡、目录准确定位及用户输入中止 | [REFERENCES_DIRECTORY_REVIEW_20261017.md](REFERENCES_DIRECTORY_REVIEW_20261017.md) |
| Education 公网左图右文、静态照片与八处图注同步，Measurement D-B-T-L 不拆行，iHP 删除地图待补框及三张人像同高 | [EDUCATION_IHP_LAYOUT_REVIEW_20261017.md](EDUCATION_IHP_LAYOUT_REVIEW_20261017.md) |
| 图注／表注类型核查、视频无注、非 iHP 无图注图片无阴影上浮 | [CAPTIONS_MEDIA_REVIEW_20261017.md](CAPTIONS_MEDIA_REVIEW_20261017.md) |
| iHP 4.0 完整 12 份 PDF／123 页、Medical Institutions 默认、Collective Growth 正文单照片、SBti 等 | [IHP_REVISION_4_REVIEW_20261017.md](IHP_REVISION_4_REVIEW_20261017.md) |
| iHP 5.0 五问题图、七阶段活动总图、共享翻转卡、类型图例、Stage 5 五图、原件与 Word 修改清单 | [IHP_REVISION_5_REVIEW_20261017.md](IHP_REVISION_5_REVIEW_20261017.md) |

原科学数据、成员身份、媒体与此前完成的首页三倍速倒计时保持。不扩展修改暂缓事项：iHP 独立 Summary 留空，两处资料缺件，38 重复／39 缺号、统计及分类矛盾不猜填；Collective Growth 正文仍只有指定的一张照片。原附件、来源映射和最新交接一同入库；环境凭据、依赖、`.local/`、缓存和本机构建产物不提交。

## 检查与发布追踪

- 已正常 fetch origin，当前分支与最新 main 基线相同；没有其他成员新增提交需要整合，不执行覆盖、重置、清理或强推。
- 本次正式构建通过：892 文件、23 HTML、1722 引用，最大资源 22,559,008 bytes；资源缺失、超限和不安全项为零。CODEOWNERS 检查通过。
- 暂存检查发现 Windows Git 将一份 PDF 当作文本，自动换行可能改变附件字节；新增 `.gitattributes`，将 PDF／DOCX／PPTX 明确标为 binary，重新暂存并核对所有新附件的 Git blob 与工作原件逐字节一致。没有改写 PDF 或转换原稿，此规则也避免 Linux 构建取到被换行转换的副本。
- 前述交接已覆盖各轮必要桌面／手机与交互检查，iHP 5.0 构建版 135 项断言通过。本次只补发布相关的远端构建、静态上传边界及上线后的重点页面／实际资源，不重做全站穷举回归。
- [本分支 PR](https://github.com/lytsb666/jlu-igem-wiki/pulls?q=head%3Acodex%2Fsite-refinements-20261016) 保留上传、合并、生产运行及上线核查的最终证据；[Wiki CI and Pages](https://github.com/lytsb666/jlu-igem-wiki/actions/workflows/wiki.yml) 的 `wiki-build` 成功后按原流程部署 `pages-client` artifact。
- 最终成功与否须以生产 Actions、远端 main 和固定地址的实际内容核对为准，不能将本文的发布流程记录直接当作已经上线。上线后重点核对 iHP 活动互动与 PDF、Education、Hardware／Software、References／目录、页脚及旧地址，结果回填同一 PR 描述。

本轮上传清单、构建与线上截图／检查数据保存在本机 `.local/release-20261017/`，本文件、页面交接和 GitHub PR 保存长期可接手结论。

回退采用 GitHub Revert 本次 PR 并重新构建部署，不重置、强推或删除原始媒体。
