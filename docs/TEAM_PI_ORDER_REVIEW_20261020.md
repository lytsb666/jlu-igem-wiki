# Team PI 位置互换（2026-10-20）

用户要求互换 PI 两位女老师的位置。基于 GitHub main `1fc8954` 和 iGEM main `205785b` 的最新版本，仅将 Principal Investigators 中宋秀玲与李金华的完整人物卡互换；显示顺序为庞博、宋秀玲、李金华。

只修改 `样式/member.js` 的 PI 显示排序。教师原始记录、照片、姓名、介绍和附注均保留；Secondary PI、Advisor 和其他成员不变。桌面 1440 与手机 390 两种宽度均确认三位姓名与对应照片一起排列，页面无脚本错误。官方源码构建与资源检查通过：364 个输出文件、767 项引用，无缺失、超限或不安全文件。

本地检查见 `docs/verification/team-pi-order-20261020.json`。[GitLab !6](https://gitlab.igem.org/2026/jlu-sph/-/merge_requests/6) 已合并，main 为 `5bf7c727380814310fab3ae8a2759bd15aeb2922`，[流水线 777440](https://gitlab.igem.org/2026/jlu-sph/-/pipelines/777440) 成功。官网桌面／手机均实测新顺序与照片对应正确，见 `docs/verification/team-pi-order-official-20261020.json`。GitHub 与固定预览站继续按本轮 PR、wiki-build、merge commit 和原自动部署流程同步，最终状态以 PR 和 main Actions 为准。
