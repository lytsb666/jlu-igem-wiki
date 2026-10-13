# JLU iGEM Wiki

原生 HTML / CSS / JavaScript 多页网站，使用 Vite 8；现有页面、中文素材目录及历史 URL 保持不变。

## 本地开发

安装 Node.js **24.19.0**（与 `.nvmrc` 和 CI 一致）及 npm，在仓库根目录执行：

```sh
npm ci
npm run dev
```

交付前检查：

```sh
npm run build
node scripts/check-build.mjs
```

Pages 发布目录为 **`dist/client`**。`dist/server` 和 `dist/.openai` 是既有 Sites 包装产物，不上传到 Pages。

## 团队协作

- `main` 为经过审核、可构建的稳定基线；每人从最新 `origin/main` 建立 `feat/<成员编号或用户名>-<任务>`，通过 PR 合并。
- 开发、同步与审核规则：[CONTRIBUTING.md](CONTRIBUTING.md)。
- 管理员首次绑定 GitHub、分配责任人及启用部署：[docs/COLLABORATION_SETUP.md](docs/COLLABORATION_SETUP.md)。
- Cloudflare 现状与手动发布：[DEPLOYMENT_CLOUDFLARE.md](DEPLOYMENT_CLOUDFLARE.md)。
- `HANDOFF.md` 是既有业务交接记录；公共组件由 00 负责，部署设施由 10 负责。

GitHub 仓库建议名 `jlu-igem-wiki`。当前只完成本地准备，实际 GitHub 所有者、邀请及权限由管理员绑定。自动部署默认关闭，配置完成后才启用。Pages 地址是团队预览站；正式 iGEM GitLab / 网站使用独立发布流程。
