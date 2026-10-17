# 最终文稿与交互版本发布验收（2026-10-18）

## 授权与基线

用户在本轮创业页格式整理之后明确要求“然后把网站上传仓库和公网”，授权上传当前网站版本及相关原件和交接记录。此次授权包含全局第 43–48 节连续本地成果，覆盖这些记录中完成当时“未上传／未发布”的历史状态。

上传前实时核对：当前分支 `codex/final-manuscripts-20261017`，基线与 `origin/main` 均为 `f902bed`（PR #12）。不重置工作区，不合并其他 worktree，不修改原 CI、凭据、发布开关或 Pages 项目。无关的本地 `docs/JUDGING_ASSESSMENT_20261017.md` 不提交。

## 本次内容

- 五份最终附件：iHP 7.0、总结与三页 PPT 图示／数字／白泽侧行；创业正文与目录、七张原图；Hardware 样式、图片尺寸和末尾原稿。385 和 585 继续作为用户确认的两项不同统计。见 [FINAL_MANUSCRIPT_REVIEW_20261017.md](FINAL_MANUSCRIPT_REVIEW_20261017.md)。
- Results 开篇 Overview 及目录；首页灯塔向下方人群持续照明、PCR 文字提前。见 [RESULTS_OVERVIEW_REVIEW_20261018.md](RESULTS_OVERVIEW_REVIEW_20261018.md)、[HOMEPAGE_LIGHTHOUSE_REVIEW_20261018.md](HOMEPAGE_LIGHTHOUSE_REVIEW_20261018.md)。
- Education／创业目录去点、左右人物悬停修复、全站跳转返回框、平滑图组和箭头反馈，以及《10.17湿实验建议》明确文字／字号调整。见 [SHARED_INTERACTION_WETLAB_REVIEW_20261018.md](SHARED_INTERACTION_WETLAB_REVIEW_20261018.md)。
- 创业页最终格式对齐、无 View 角标、38 原表／41 表注和七图注规范。见 [ENTREPRENEURSHIP_STANDARD_REVIEW_20261018.md](ENTREPRENEURSHIP_STANDARD_REVIEW_20261018.md)。

## 检查与发布路径

公共责任人 **00**；公共改动影响各正文页的目录、光标／人物、页内返回和图组。前轮已完成 18 页双宽度 36 组及关键交互回归，本轮补查创业页三宽度的最终构建。原科研数据、序列、媒体、链接及此前成果保留。

全站构建和资源边界检查通过：973 文件、23 HTML、1796 引用，最大单文件 22,559,008 字节，无缺失／超限／不安全文件。源文件差异检查通过；本机缓存、凭据、构建产物和无关评估文件不提交。

发布沿用仓库 [lytsb666/jlu-igem-wiki](https://github.com/lytsb666/jlu-igem-wiki)，保留本次 PR。等待 `wiki-build` 成功后，依 CONTRIBUTING 中所有者本人明确授权的验收规则，使用 merge commit 合并；原 Actions 更新固定站 [jlu-igem-wiki-preview.pages.dev](https://jlu-igem-wiki-preview.pages.dev/)。实际提交、生产运行、不可变部署和公网验收结果记录于对应 PR 与 [Actions](https://github.com/lytsb666/jlu-igem-wiki/actions)，不能用上传前的本记录代替线上发布结果。
