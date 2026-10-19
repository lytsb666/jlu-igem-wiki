# 当前完整版本：GitHub 与 iGEM 发布（2026-10-19）

用户在完成八项截图及 iHP 追加修订后明确授权上传仓库和 iGEM 官网，并追加确认：不仅补此前未发布的三个页面，上次官网发布后各页的全部修改也要同步到对应位置。本轮以本地最新 `a69d7c8` 及连续未提交成果为基础，发布 18 个完整内容页及原兼容入口；覆盖 iHP／Measurement／Hardware 只发布框架的旧分阶段限制。

源码工作区为 `D:/JLU-Wiki/.local/github-latest-20261019`，分支 `codex/screenshot-revisions-20261019`；GitHub 为 `lytsb666/jlu-igem-wiki`。保留根工作区所有原有成果，用逐项增量把此前已在官网运行的首访优化合入最新源码，未用旧整页覆盖新稿；仅增加按场景准备首页图片、原加载海报、正文／页脚图片临近加载及官网路径识别，保留新版 PDF.js。文本逐项对照保持当前版本，Hardware 的本轮两处文字、Contribution 与 iHP 的连续修改保留。

官网基线为 GitLab `6723a94`，仓库 `https://gitlab.igem.org/2026/jlu-sph.git`，正式地址 `https://2026.igem.wiki/jlu-sph/`。在独立 `D:/JLU-Wiki/.local/igem-release-20261019/repository` 的 `codex/full-site-20261019` 分支准备更新，不改官方 CI、依赖、Flask 或 LICENSE。完整页面打包脚本及媒体映射负责替换实际官方地址，不重跑旧正文生成器。PDF.js 库、worker、WASM 与 CMap 保持自托管；仅额外接受本队 `https://static.igem.wiki/teams/6074/wiki/` 下的 PDF，其他主机／队伍不放开。

已完成本地正式构建、资源检查和 18 页桌面／手机共 36 项检查：首页七场景、正文、目录、PDF 默认展开及临近加载均通过，无页面脚本异常、失败资源或整页横向溢出。第一版完整官方媒体清单共 718 项，复用 405 项，待补 310 份图片／文档及 3 个视频；真实官方地址和实际发布状态将在完成后追加，当前记录不表示已上线。

本轮 GitHub 按 PR／wiki-build／merge commit 流程，既有自动 Pages 配置保持；实读 `PAGES_DEPLOY_ENABLED=true`，因此原固定预览站也会由既有流程正常更新。没有启停发布开关、变更凭据或创建其他站点。无关裁判评估、本机配置、临时包及媒体上传认证资料不进入提交。

## GitHub 实际结果

[PR #19](https://github.com/lytsb666/jlu-igem-wiki/pull/19) 已合并，合并提交为 `30a7556c8645973cfe7936071f0081f648f14032`，功能提交为 `91d29ccee7c399bb7fe3bff50928b0faab77cc61`。PR 构建和预览通过，main [Actions 39263606288](https://github.com/lytsb666/jlu-igem-wiki/actions/runs/39263606288) 成功，既有固定 Pages 预览站已按原流程更新。

iGEM 完整发布包已另通过官网路径下 18 页、两种宽度的 36 项检查。现有媒体清单共 714 项，复用 405 项，另需 306 份图片／文档和 3 段视频；PDF.js 标准字体保留原自托管库路径。官网原生控件已接收第一组媒体，其余继续处理，目前尚未发布官网新版本。

## 官网媒体及实际限制（2026-10-20 续发）

714 项媒体中，全部 710 项图片／文档均已取得并核验真实官方地址，HTTP 检查全部通过；Contribution 视频已通过平台审核，公共 API 确认为 Public／Published。18 页官网路径的 36 项检查和四个重点页面桌面／手机的正式媒体检查通过，PDF.js 实际渲染本队官方 PDF。新显示图、最新正文及上次发布后的改动均在包中，三页正文不再暂缓。

Hardware 三段原始视频暂受外部限制：当前已登录 jingyikang 账号在 Video Universe 发布页显示上传禁用。核对该平台 8.3.1 官方源码，提示由账号总配额或每日配额为 0 触发；公开默认配置为总 5GB、每日 0。这是默认配置，不能断言所有账号均如此，也无法从公开数据确认管理员设置原因。官方提交日历标注 Wiki 10 月 21 日、Presentation Video 10 月 28 日，当前尚未到这两个日期，没有证据将本限制归因于截止时间。来源：[公开配置](https://video.igem.org/api/v1/config)、[判断源码](https://github.com/Chocobozzz/PeerTube/blob/v8.3.1/client/src/app/core/users/user.model.ts#L108)、[官方日历](https://competition.igem.org/deliverables/)。已告知用户需要管理员恢复非零配额；未更改账号或尝试绕过限制。

其余页面照常发布；三个视频位置保留已上传的原封面和真实未可用状态，原 MP4、哈希、比例及待补清单保留。没有猜测视频 ID、嵌入本机地址或借用其他视频。生产构建仍拒绝缺失图片／文档地址，只允许记录了该明确外部限制的三个视频显示待上传状态。完整公开映射见 `IGEM_OFFICIAL_MEDIA_UPLOAD_20261019.json`。本段是提交准备状态，实际官网提交、流水线和上线核验结果另记。

## iGEM 实际上线结果

[合并请求 !2](https://gitlab.igem.org/2026/jlu-sph/-/merge_requests/2) 已合并，功能提交 `71aec1a`，主分支合并提交 `6952e2a55ad9912a9938a31dc6426cb8c1d3e78c`。[官方流水线 774278](https://gitlab.igem.org/2026/jlu-sph/-/pipelines/774278) 的 Node 构建与 Flask／Pages 部署均成功，原 CI、依赖、Flask、LICENSE 及发布配置未修改。

[正式官网](https://2026.igem.wiki/jlu-sph/) 已更新。18 个完整内容页、根入口和五项 PDF.js 库资源共 24 项均返回 200，实际响应 SHA-256 与最终生产包全部一致；MJS 以 application/javascript 正确提供，WASM／字体／CMap 保持二进制。官网浏览器实测 PDF 渲染出两张页面画布，无脚本错误。全站最新正文与本轮截图修订已同步，三页旧占位框架已被完整文章替换。

仍未完成的仅为 Hardware 三段视频本体上传，原因和需恢复的账号配额见上节；官网保留对应原始封面及未可用状态，不能将其称为已上传或待审核。完整原 MP4 在源码中保留。已发布的 Contribution 视频正常可用。证据位于 `docs/verification/igem-release-20261019/`，公开地址和阻塞清单见本轮官方媒体映射。
