# 团队开发约定

## 分支和职责

`main` 接收通过必要检查且符合下述验收规则的 PR。每人使用独立克隆目录；同一台机器可用独立 worktree，不能在别人正在使用的目录切换分支。新任务使用 `feat/<成员编号或用户名>-<任务>`，一条分支只做一个任务。

| 角色 | 页面 / 工作范围 | 分支示例 |
| --- | --- | --- |
| 00 主控 | 公共组件、历史 URL、跨页整合与冲突裁决 | `feat/00-navigation` |
| 01 首页 | `homepage/`、首页专用脚本与素材 | `feat/01-homepage-story` |
| 02 成员 | `Team/`、member 专用样式与脚本 | `feat/02-member-photo` |
| 03 科研 | `Project/`、`Wet-lab/`、`Instrument/model.html` | `feat/03-results` |
| 04 iHP | `Eagagement/iHP.html`、iHP 专用文件 | `feat/04-ihp` |
| 05 教育 | `Eagagement/education.html`、education 专用文件 | `feat/05-education` |
| 06 包容性资源 | 页面已删除，保留 `public/inclusivity-resources/` 的资料归属 | `feat/06-inclusivity` |
| 07 创业 | `Eagagement/entrepreneurship.html`、entrepreneurship 专用文件 | `feat/07-entrepreneurship` |
| 08 仪器 | Hardware / Software 页面、各自专用资源和脚本 | `feat/08-hardware` |
| 10 部署 | 构建、CI、依赖、Pages 配置与发布 | `feat/10-build` |

Judging 跳转页及尚未分配的文件由 00 兜底分派。实际 GitHub 账号填入 `.github/owners.json`，运行 `node scripts/configure-codeowners.mjs` 生成 CODEOWNERS。账号必须有仓库 Write 权限；团队账号必须为有 Write 权限的可见团队。

**公共组件责任人：00。** 包括 `样式/main.js`、navigation、loading、footer、cursor、style、site-format、typography、full-width-layout、placeholder-page、wetlab-pages 等共享文件。修改这些文件，或页面 HTML 内的 Navbar / Loading / Footer / 公共目录结构，PR 必须写明“公共责任人 00”、影响页面和回归结果，并请求 00 审核。构建 / 依赖 / 发布变更由 10 审核，影响全站时再由 00 审核。CODEOWNERS 按文件匹配，不能识别 HTML 内的公共区域；一个模式列出多个 owner 时 GitHub 只要求其中一个批准，不能用它替代这里的双人审核约定。

## 每位成员的日常操作

在自己的克隆中，确认工作区干净后开始新任务：

```sh
git status
git fetch origin
git switch main
git pull --ff-only origin main
git switch -c feat/01-homepage-story
npm ci
npm run dev
```

替换示例分支中的编号和任务名。只修改分工范围，保留中文目录、空格、`Eagagement` / `inclusity.html` / `protocal.html` 等已有拼写和大小写。不要重跑旧页面生成器；不要修改未经确认的成员数据或科研事实。

```sh
npm run build
node scripts/check-build.mjs
git diff --check
git add -- <本次明确修改的文件>
git commit -m "feat(homepage): update story section"
git push -u origin HEAD
```

不要用 `git add .` 混入其他人的资料。已有未提交修改时先留在自己的分支并选择性提交，或做仓库外备份后处理；不要用 reset、clean 或强推消除它们。

## PR、审核和合并

### 用户确认的验收规则（2026-10-13）

- 仓库所有者 `@lytsb666` 本人发起并授权上传的修改：00 完成构建、资源和必要页面检查后直接验收、合并，无需另一位成员在 GitHub 提交 Approve。PR 仍保留，作为改动和验证记录。
- 其他成员发起的修改：提交 PR，待 `@lytsb666` 对当前版本提交 **Approve** 后才合并。修改代码使旧审核过期时，重新请求所有者确认；未解决的问题先修复。
- 各页面负责人和 00 / 10 继续承担内容与技术检查责任。其他成员的技术检查通过不能替代所有者的 Approve；所有者本人的修改也不能跳过必要检查。
- Git 作者、提交者或共享账号不能单独证明是所有者本人发起。代理执行以人类用户的明确授权为准；其他成员的改动不能借用所有者账号绕过审核。
- 当前仓库未启用服务端强制分支保护，上述规则由 00 / 维护者执行。不得宣称 GitHub 已技术上禁止成员绕过审核。
- Cloudflare 固定站发布仍按发布授权执行；GitHub 验收或合并不会自动打开目前关闭的 Pages 自动发布开关。

1. 在 GitHub 创建目标为 `main` 的 PR，填写模板；草稿可提前打开以便讨论。
2. `wiki-build` 必须通过。检查缺失资源、文件大小、桌面 / 手机截图、旧 URL、目录、导航及控制台；构建通过不等于视觉验收通过。
3. 配置 Pages 后，同仓库 PR 会上传为 `pr-<编号>` 预览；链接在 Actions 的运行摘要和对应 Environment 中。Fork PR 仅构建，不获得 Cloudflare 密钥。
4. 请求页面负责人检查；公共改动交 00，部署改动交 10。按上面的验收规则决定是否需要所有者 Approve；所有讨论解决后才合并。GitHub 不支持作者批准自己的 PR，因此所有者本人授权的修改采用直接验收例外。
5. 合并前在自己的功能分支正常合并最新 `origin/main`：

```sh
git fetch origin
git merge origin/main
```

逐处处理冲突，找相关文件负责人确认；不要整文件选择 ours/theirs。重新构建、检查并普通 push。无需 rebase 或强推。

6. 由 00 / 指定维护者使用 GitHub **Create a merge commit** 合并，保留分支历史。不要启用强制线性历史；旧分支已含正常合并记录。
7. 合并后管理员确认稳定地址、根页、Member、Hardware、资源下载与历史跳转。出现问题用 GitHub Revert PR，并重新构建；紧急 Pages 回滚由 10 操作并随后修复 Git 基线。

已有 `codex/NN-*` worktree 和 `feat/wiki-ux-redesign` 全部保留。不要批量合并旧分支，它们可能包含已被 cherry-pick 的旧成果；新任务从新 `main` 建立 `feat/*`。未完成成果先提交在原分支备份，再由 00 审查所需增量。
