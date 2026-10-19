# 当前完整版本：GitHub 与 iGEM 发布（2026-10-19）

用户在完成八项截图及 iHP 追加修订后明确授权上传仓库和 iGEM 官网，并追加确认：不仅补此前未发布的三个页面，上次官网发布后各页的全部修改也要同步到对应位置。本轮以本地最新 `a69d7c8` 及连续未提交成果为基础，发布 18 个完整内容页及原兼容入口；覆盖 iHP／Measurement／Hardware 只发布框架的旧分阶段限制。

源码工作区为 `D:/JLU-Wiki/.local/github-latest-20261019`，分支 `codex/screenshot-revisions-20261019`；GitHub 为 `lytsb666/jlu-igem-wiki`。保留根工作区所有原有成果，用逐项增量把此前已在官网运行的首访优化合入最新源码，未用旧整页覆盖新稿；仅增加按场景准备首页图片、原加载海报、正文／页脚图片临近加载及官网路径识别，保留新版 PDF.js。文本逐项对照保持当前版本，Hardware 的本轮两处文字、Contribution 与 iHP 的连续修改保留。

官网基线为 GitLab `6723a94`，仓库 `https://gitlab.igem.org/2026/jlu-sph.git`，正式地址 `https://2026.igem.wiki/jlu-sph/`。在独立 `D:/JLU-Wiki/.local/igem-release-20261019/repository` 的 `codex/full-site-20261019` 分支准备更新，不改官方 CI、依赖、Flask 或 LICENSE。完整页面打包脚本及媒体映射负责替换实际官方地址，不重跑旧正文生成器。PDF.js 库、worker、WASM 与 CMap 保持自托管；仅额外接受本队 `https://static.igem.wiki/teams/6074/wiki/` 下的 PDF，其他主机／队伍不放开。

已完成本地正式构建、资源检查和 18 页桌面／手机共 36 项检查：首页七场景、正文、目录、PDF 默认展开及临近加载均通过，无页面脚本异常、失败资源或整页横向溢出。第一版完整官方媒体清单共 718 项，复用 405 项，待补 310 份图片／文档及 3 个视频；真实官方地址和实际发布状态将在完成后追加，当前记录不表示已上线。

本轮 GitHub 按 PR／wiki-build／merge commit 流程，既有自动 Pages 配置保持；实读 `PAGES_DEPLOY_ENABLED=true`，因此原固定预览站也会由既有流程正常更新。没有启停发布开关、变更凭据或创建其他站点。无关裁判评估、本机配置、临时包及媒体上传认证资料不进入提交。
