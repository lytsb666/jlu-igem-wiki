# Cloudflare Pages 团队临时预览

固定项目：`jlu-igem-wiki-preview`。固定地址：`https://jlu-igem-wiki-preview.pages.dev/`。
使用 Pages Direct Upload；生产部署标识为 `main`，与本地 Git 分支名独立。以后始终传同一项目名及 `--branch main`，更新这个固定地址，不另建项目。

## 重新发布

在 PowerShell 执行：

```powershell
Set-Location -LiteralPath 'D:\JLU—Wiki\IGEMwiki\Wiki'
.\scripts\publish-pages.ps1
```

脚本先执行 `npm run build`，构建失败立即停止；再检查单文件大小，然后用固定版本 Wrangler 上传 **dist/client**。它不会推送 Git、上传仓库、创建新项目或部署 `dist/server`、`dist/.openai`。
当前机器只有 Codex 自带 Node，脚本可使用仓库外 `../tmp/cloudflare-pages-2026-10-10` 下补齐的 npm/Wrangler；其他机器已有 npm 时也可通过 npx 运行。

有正常 Node/npm 环境时，等效命令为：

```powershell
npm run build
if ($LASTEXITCODE -ne 0) { throw 'Build failed' }
npx --yes wrangler@4.149.0 pages deploy dist/client --project-name jlu-igem-wiki-preview --branch main --commit-dirty=true
```

若授权过期，运行 `npx --yes wrangler@4.149.0 login --scopes account:read user:read pages:write`，在浏览器确认后重新发布。OAuth 凭据保存在本机 Wrangler 用户配置中，未写入源码或产物。

## 构建兼容性

- 保留既有 Sites 包装结构；Pages 只需要 `dist/client` 中的静态网页、脚本、图片、视频和手册。
- Vite 构建会复制 HTML 中仍保留原路径的资源（例如 `data-full-src` 原图）；缺失文件让构建失败，避免上线后出现原图打不开。
- 旧 Judging 三个入口的 canonical 标记使用 `vite-ignore`，保持正常页面地址，避免把目标原始 HTML 作为素材发布。
- 两代 Software 手册超过 Pages 单文件 25 MiB 上限，因此只优化 PDF 图像压缩编码。每份 8 页：尺寸、文字、链接及 120 DPI 全页像素均与原件相同；原件备份保存在仓库外部署证据目录。
- 页面 HTML/CSS/JS 必须作为浏览器运行产物公开；未上传 Git 历史、项目源目录、源映射、依赖目录、环境文件或服务器包装配置。没有接入 GitHub/GitLab，也不执行 `git push`。

部署、构建及公网检查记录：`D:\JLU—Wiki\IGEMwiki\tmp\cloudflare-pages-2026-10-10\`。公网预览不是正式 iGEM 站；Hardware / Contribution 现存内容缺口维持原状。

## 官方 Agent Setup

已按照 `https://developers.cloudflare.com/agent-setup/prompt.md` 为 Codex 安装 16 个 Cloudflare skills 至 `C:\Users\UserTech\.agents\skills`，并登记 / 授权 `https://mcp.cloudflare.com/mcp`。Codex 用户配置位于 `C:\Users\UserTech\.codex\config.toml`，原配置已备份到仓库外，其他设置保留。MCP 在重启 Codex 后加载；这次发布继续使用已授权 Wrangler。
未安装可选 beta `cf` CLI，沿用用户明确指定的 Wrangler。
