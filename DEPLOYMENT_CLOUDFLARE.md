# Cloudflare Pages 团队临时预览

固定项目：`jlu-igem-wiki-preview`。固定地址：`https://jlu-igem-wiki-preview.pages.dev/`。
使用 Pages Direct Upload；生产部署标识为 `main`。团队协作配置从 2026-10-13 起将 Git `main` 对应固定地址，功能分支对应独立预览。保持同一项目，不另建项目。

## GitHub 自动部署（2026-10-13）

已通过 Cloudflare API 只读核实：项目未连接 Git 来源（`source: null`），生产分支 `main`；最近成功部署 `2054433b-d322-4c4e-b17c-d45f1239f7c0` 对应 `2207cd49cbb76c006f871e76d92e8e921c37acf1`，2026-10-12 19:11:55（Asia/Shanghai）创建，上传标记 `commit_dirty: true`。该标记不能保证线上逐文件等于 Git 树，首次自动发布前仍需预览核对。

`.github/workflows/wiki.yml` 已配置构建检查和 Direct Upload：合并到 `main` 后更新固定地址；同仓库非草稿 PR 使用 `pr-<编号>` 上传，隔离于固定地址。自动部署需管理员设置 `PAGES_DEPLOY_ENABLED=true` 才启用。具体 GitHub 权限、Environment、API token 和首次上线步骤见 [管理员配置指南](docs/COLLABORATION_SETUP.md)。本次未上传网站或变更远程配置。

现有 Direct Upload 项目不能直接改为 Git 集成；保留项目与地址，使用 GitHub Actions 上传即可实现自动部署。如未来需要 Cloudflare 原生 GitHub App 的 PR 评论与构建服务，需要另建 Git 集成项目并单独规划迁移。依据：[Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/) 和 [CI 上传指南](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/)。

## 重新发布

在 PowerShell 执行：

```powershell
Set-Location -LiteralPath 'D:\JLU—Wiki\IGEMwiki\Wiki'
.\scripts\publish-pages.ps1
```

默认命令将当前功能分支上传为预览，不更新固定地址。发布固定地址须在**干净的 `main`** 中明确执行 `.\scripts\publish-pages.ps1 -Production`，且已经过审核；未跟踪资料也算非干净状态，不得删除资料来绕过检查。

脚本先执行 `npm run build` 和 `node scripts/check-build.mjs`，失败立即停止；再检查单文件大小，然后用固定版本 Wrangler 上传 **dist/client**。它不会推送 Git、上传仓库、创建新项目或部署 `dist/server`、`dist/.openai`。
当前机器只有 Codex 自带 Node，脚本可使用仓库外 `../tmp/cloudflare-pages-2026-10-10` 下补齐的 npm/Wrangler；其他机器已有 npm 时也可通过 npx 运行。

有正常 Node/npm 环境时，等效命令为：

```powershell
npm run build
if ($LASTEXITCODE -ne 0) { throw 'Build failed' }
node scripts/check-build.mjs
if ($LASTEXITCODE -ne 0) { throw 'Output verification failed' }
# Use the guarded script for either a feature preview or an explicit production upload.
.\scripts\publish-pages.ps1
```

若授权过期，运行 `npx --yes wrangler@4.149.0 login --scopes account:read user:read pages:write`，在浏览器确认后重新发布。OAuth 凭据保存在本机 Wrangler 用户配置中，未写入源码或产物。

## 构建兼容性

- 保留既有 Sites 包装结构；Pages 只需要 `dist/client` 中的静态网页、脚本、图片、视频和手册。
- Vite 构建会复制 HTML 中仍保留原路径的资源（例如 `data-full-src` 原图）；缺失文件让构建失败，避免上线后出现原图打不开。
- 旧 Judging 三个入口的 canonical 标记使用 `vite-ignore`，保持正常页面地址，避免把目标原始 HTML 作为素材发布。
- 构建结束时移除 public 目录随拷贝进入产物的 `.gitattributes` / `.gitignore` / `.gitkeep`，这些 Git 元数据继续保留在本地。
- 两代 Software 手册超过 Pages 单文件 25 MiB 上限，因此只优化 PDF 图像压缩编码。每份 8 页：尺寸、文字、链接及 120 DPI 全页像素均与原件相同；原件备份保存在仓库外部署证据目录。
- 页面 HTML/CSS/JS 必须作为浏览器运行产物公开；未上传 Git 历史、项目源目录、源映射、依赖目录、环境文件或服务器包装配置。没有接入 GitHub/GitLab，也不执行 `git push`。

初次部署、构建及公网检查记录：`D:\JLU—Wiki\IGEMwiki\tmp\cloudflare-pages-2026-10-10\`。后续各次更新使用各自证据目录。公网预览不是正式 iGEM 站；2026-10-12 Hardware 已接入 08 提供的正文、四份原 PDF 和三段视频，仍有两处实验结果图及资料口径待补；Contribution 现存内容缺口仍待真实材料。

## 官方 Agent Setup

已按照 `https://developers.cloudflare.com/agent-setup/prompt.md` 为 Codex 安装 16 个 Cloudflare skills 至 `C:\Users\UserTech\.agents\skills`，并登记 / 授权 `https://mcp.cloudflare.com/mcp`。Codex 用户配置位于 `C:\Users\UserTech\.codex\config.toml`，原配置已备份到仓库外，其他设置保留。MCP 在重启 Codex 后加载；这次发布继续使用已授权 Wrangler。
未安装可选 beta `cf` CLI，沿用用户明确指定的 Wrangler。
