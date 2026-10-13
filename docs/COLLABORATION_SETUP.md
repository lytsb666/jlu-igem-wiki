# GitHub 多人协作：管理员首次配置

记录日期：2026-10-13（Asia/Shanghai）。建议仓库名 **`jlu-igem-wiki`**，归团队组织或主控成员所有，初始设为 Private；要使用分支保护和 CODEOWNERS，私有仓库需相应付费套餐。若选择公开仓库，先核对成员资料与原始材料的公开范围，再创建。

## 现场与保全

| 项目 | 本次开始时核实 |
| --- | --- |
| 仓库根目录 | `D:\JLU—Wiki\IGEMwiki\Wiki`（不是上级目录） |
| 当前分支 / HEAD | `feat/wiki-ux-redesign` / `2207cd49cbb76c006f871e76d92e8e921c37acf1` |
| 旧 main | `4b1b750`，为当前 HEAD 的祖先，落后 79 个提交 |
| 远程 | 未配置；未找到 GitHub CLI 或现成仓库地址 |
| 未跟踪成果 | `JLU_WIKI_CONTROL_LEDGER.md` 和 `assets/human-practice/review-2026-10-03/` 下 4 个文件，保留且不混入提交 |
| 其他分支 | 9 个 `codex/NN-*` worktree / 分支全部保留 |
| 备份目录 | `D:\JLU—Wiki\IGEMwiki\tmp\github-collaboration-2026-10-13` |
| 恢复点 | `backup/pre-github-main-20261013`、`backup/pre-github-current-20261013` |

备份含 `repository-before.bundle`（全部 Git refs / 历史）、起始状态、worktree 清单、未跟踪文件副本及 SHA-256。没有 reset、clean、stash、删除分支或强推。既有网站代码保留，协作文件在 `feat/00-github-collaboration` 中单独提交。`main` 只在干净检出构建验证后正常快进；最终状态与验证见本指南末尾。

## 1. 创建仓库并首次推送

1. 登录实际 GitHub 账号，创建 `jlu-igem-wiki` **空仓库**，不要初始化 README、license 或 .gitignore。所有者的真实账号 / 组织名由登录者决定。
2. Settings → Collaborators / Manage access 邀请成员；普通成员 Write，00 为维护者，10 为维护者；Admin 仅给需要管理权限的人。
3. 填入实际账号：编辑 `.github/owners.json`，把 00 和 10 的 `null` 换成 `"@真实用户名"`；其他模块同样绑定，无负责人模块保留 `null`，由 00 兜底。00 / 10 可由同一人兼任，但 PR 仍须另一位 Write 成员审核。
4. 在当前协作分支运行下列命令，检查生成的 CODEOWNERS，再选择性提交绑定文件；首次上云前将它正常快进到 main。这是仅限空远程初始化的步骤，之后所有改动走 PR。先确认除已保留的历史未跟踪资料外，没有新代码修改；任何切换 / 合并命令失败都停止排查，不强制覆盖。

```sh
node scripts/configure-codeowners.mjs
node scripts/configure-codeowners.mjs --check
git add -- .github/owners.json .github/CODEOWNERS
git commit -m "docs: bind actual GitHub code owners"
git switch main
git merge --ff-only feat/00-github-collaboration
git switch feat/00-github-collaboration
```
5. 在 PowerShell 绑定真实空仓库地址（不要原样使用示例占位文本）：

```powershell
Set-Location -LiteralPath 'D:\JLU—Wiki\IGEMwiki\Wiki'
$taskRemote = 'https://github.com/实际所有者/jlu-igem-wiki.git'
git remote add origin $taskRemote
git ls-remote origin
# 只有远程为空时才按首次初始化继续。
git push -u origin main
git push -u origin feat/00-github-collaboration
```

Windows Git 凭据管理器提示登录时完成 GitHub 授权。若远程已有提交，停止空仓库初始化，先 `git fetch origin` 比较差异，再正常合并；不要 force push。不要 `push --mirror` / `push --all` 将所有旧工作分支一次性上传。旧分支已在 bundle 中保存，确需共享时逐条审查、普通 push。

本机现有 Git 作者为 `Codex Sites`；每位成员在自己的克隆执行 `git config user.name "真实姓名"`、`git config user.email "自己的 GitHub 邮箱或 noreply 邮箱"`，之后提交使用本人身份。历史作者不改写。

## 2. main 保护与审核

首次 `wiki-build` 成功后，GitHub Settings → General 确认默认分支为 `main`；Pull Requests 允许 **Merge commits**，建议关闭其他合并方式以统一历史。Settings → Branches 添加匹配 `main` 的保护规则（也可用对应 Ruleset）：

- Require a pull request before merging；至少 **1 位非作者成员**批准。
- Dismiss stale pull request approvals when new commits are pushed。
- Require review from Code Owners（真实 owner 已有 Write 权限且 CODEOWNERS 位于 main 后启用）。
- Require status checks to pass：选择确实运行过的 **`wiki-build`**；Require branches to be up to date before merging。
- Require conversation resolution；Do not allow bypassing the above settings（包含管理员）。
- 不开启 Allow force pushes / Allow deletions；不要求线性历史。

公共组件必须由 00 审核；构建部署由 10 审核。需要两位角色均批准的全站变更，人工同时请求两位审核并检查记录；CODEOWNERS 多个 owner 只要求其中一人，不能保证“双签”。`.github/CODEOWNERS` 的初始注释只是待绑定模板，**尚未启用自动指定审核人**；PR CI 的 owner 检查会提示先完成真实账号绑定。

Private 仓库若当前套餐不提供保护或 Environment 审核，使用支持它们的套餐 / 组织。没有服务端规则时，文档约定不能技术上阻止直推。参考：[GitHub 分支保护](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)、[CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)。

## 3. 给现有 Pages 接入 GitHub Actions

本次只读 API 已核实：账户 `a6583d5a0552492a4633a04223d85662`，项目 `jlu-igem-wiki-preview`，`source: null`，`production_branch: main`。固定地址 [团队预览站](https://jlu-igem-wiki-preview.pages.dev/)；当前部署 ID `2054433b-d322-4c4e-b17c-d45f1239f7c0`，创建时间 2026-10-12 19:11:55（Asia/Shanghai），成功，提交 `2207cd4`，dirty 标记为 true。本次未改变这次部署。

保留 Direct Upload，使用 GitHub Actions 自动上传；无须安装 Cloudflare GitHub App，也不迁移域名或创建第二个 Pages 项目。若改用原生 Git 集成，则必须另建项目，不能转换当前项目。依据：[Cloudflare Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/)、[GitHub Actions 上传](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/)。

1. Cloudflare 管理台 → API Tokens → Create Token → Custom Token：权限 **Account → Cloudflare Pages → Edit**；Account Resources 只包含上述账号。按实际账户界面创建，令牌只填 GitHub Secret，不发聊天、不写源码。该账号级权限可写同账号的 Pages 项目，GitHub Environment 是进一步限制使用途径的边界。
2. GitHub Settings → Secrets and variables → Actions → Variables 添加：

| 名称 | 值 |
| --- | --- |
| `CLOUDFLARE_ACCOUNT_ID` | `a6583d5a0552492a4633a04223d85662` |
| `PAGES_PROJECT_NAME` | `jlu-igem-wiki-preview` |
| `PAGES_DEPLOY_ENABLED` | 先留空或 `false`；完成下面步骤才改 `true` |

3. Settings → Environments 创建 **`pages-production`** 和 **`pages-preview`**；分别添加 Environment Secret `CLOUDFLARE_API_TOKEN`。不要将部署令牌设为所有工作可读取的 Repository Secret。
4. `pages-production` 的 Deployment branches and tags 使用 Selected branches，只允许 **`main`**。套餐支持时可以设置 10 / 指定维护者为 Required reviewer，Prevent self-review，用于上线审核；不设置审核人则 main 合并后自动发布。
5. `pages-preview` 设置 Selected branches 的规则 **`refs/pull/*/merge`**，允许本仓库 PR 合并引用；套餐支持时建议设置 10 或另一位维护者为 Required reviewer、Prevent self-review，首次审核工作流和上传产物后批准。不要将 preview 允许范围扩大为任意分支。GitHub Free / Pro / Team 的 Required reviewers 只支持公开仓库；私有 Pro / Team 可以使用 Environment Secret 和分支限制，但没有这项人工审批。要求私有 PR 上传前人工审批时，使用支持它的 Enterprise 方案，配置完成前保持自动部署关闭。依据：[GitHub Environment 限制](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments)。
6. Settings → Actions → General 允许工作流所用官方 actions；默认 token 只需 Read repository contents。保持 `PAGES_DEPLOY_ENABLED=false`，先验证 main 和一个普通功能 PR 构建通过、CODEOWNERS 正确。
7. 改 `PAGES_DEPLOY_ENABLED=true`，对普通功能 PR 推送一次提交 / Re-run all jobs（草稿先 Ready for review）；检查 `pr-<编号>` 的独立预览。预览链接在 Actions 运行摘要和 Environment。固定地址仍保持现有版本。
8. 00 / 10 检查预览后合并 PR，`main` 才更新固定地址。若没有业务 PR，可在 Actions → Wiki CI and Pages → Run workflow 选择 **main**，经过配置的上线审核完成首个生产发布。不要选功能分支进行生产部署。

构建：Linux + Node 24.19.0，`npm ci` → `npm run build` → `node scripts/check-build.mjs`，产物 `dist/client`。CI 不执行 `scripts/publish-pages.ps1`。上传作业只下载构建产物，不执行 PR 代码的 npm scripts；检查静态边界、文件数量与大小后用固定 Wrangler `4.149.0` 上传。`main` → 固定地址；同仓库 PR → `pr-<编号>` 分支；Fork 仅构建。非 PR 的功能分支 push 只构建，避免重复预览上传。

预览默认公开，可在 Pages Settings → General 启用 Access policy 并将成员加入，按需限制预览访问。GitHub 私有仓库不自动使网页私有。当前静态站没有后端数据绑定，工作流不上传 `dist/server`、`.openai`、Git 元数据或源码映射。

## 4. 成员加入后

每位成员独立 `git clone`，从最新 `origin/main` 创建自己的 `feat/<编号>-<任务>`；只修改所属页面，提交、push、开 PR。公共文件交 00 审核；部署文件交 10 审核。通过构建与预览检查后由维护者合并，详细操作见 [CONTRIBUTING.md](../CONTRIBUTING.md)。旧 worktree 不批量改名或切换。

## 5. 本次验证记录

- 干净源码副本只包含已跟踪文件和本次协作文件，排除原有未跟踪材料；`npm ci`、Vite 8.1.3 构建与静态检查通过。25 个 HTML 页面，634 个静态文件，1,530 处本地引用，缺失 / 超限 / 非公开配置文件均为 0，最大单文件 22,559,008 字节。
- 新工作流 YAML、JS / PowerShell 语法与 Git 空白检查通过。24 项针对性检查通过，含缺失资源 / 密钥文件 / 服务端 worker / 超限文件拒绝、责任人绑定与 CODEOWNERS 一致性检查、原有 5 个未跟踪文件 SHA-256 保全。
- 起始依赖审计发现 3 项 high 级开发依赖告警；仅更新 lockfile 中 `nanoid 3.3.15 → 3.3.20`、`postcss 8.5.16 → 8.5.30`、`source-map-js 1.2.1 → 1.2.2`，`package.json`、Vite 8.1.3、构建配置及网站源码保持原版本。重新干净安装、构建和审计通过，审计告警为 0。
- 634 个构建文件对比通过内容等价验证：一次构建对相同 PNG 使用不同重名后缀，两个 HTML 的对应资源引用随之变化；归一化该后缀后全部文件 SHA-256 一致。图片字节、CSS / JS 与页面内容未变。
- 检查全部 Git 历史，无超过 GitHub 100 MiB 限制的 blob；无需改写历史或引入 LFS 迁移。
- 证据：`build-check-after.json`、`validation.json`、`npm-audit-after.json`、`build-output-equivalence.json`，位于上述仓库外目录。验证是在本机 Windows 上执行；GitHub Ubuntu runner 的首次实际运行仍须管理员在上云后核实。
- 本地 main 正常快进到本次协作配置提交，与 `feat/00-github-collaboration` 相同；`feat/wiki-ux-redesign` 仍保留 `2207cd4`，其余旧分支和 worktree 未改。主工作区现有预览服务、dist 与 node_modules 未替换；新克隆或下次 `npm ci` 才会安装新锁定依赖。
- GitHub 仓库、成员邀请、真实 CODEOWNERS 绑定、分支保护、Environment 和 token 仍需登录后的管理员配置；本次未 push、未创建远程 PR、未部署，Pages 固定地址及官方 iGEM 站保持既有版本。这些本地验证不代表全站视觉验收通过。
