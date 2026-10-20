# Measurement 补文与三段 Hardware 原视频（2026-10-20）

用户明确以最新版本继续修改并优先更新 iGEM。GitHub 基线为 `d366b53`，iGEM GitLab 基线为 `5bf7c72`；根工作区原有未提交成果未覆盖。

## Measurement

删除流程图下 `↗ Open original workflow image` 附加链接，保留原图和所有图内跳转、辅助入口。在第九章用户指定的 `This replaces…` 之前插入本轮完整原文，拆开原段落以单独呈现新段，其他文字未删改；此次指令覆盖此前取消奖项段落的历史记录。

本地及真实官网 1440／390 两种宽度均确认插入位置、完整原文、链接删除、无横向溢出及无 JavaScript 错误。官方锁文件构建和资源核查通过（364 文件、42 HTML 页，缺失／超限／不安全引用均为空）。[GitLab !7](https://gitlab.igem.org/2026/jlu-sph/-/merge_requests/7) 已合并，main 为 `f7e85ec`，[流水线 779366](https://gitlab.igem.org/2026/jlu-sph/-/pipelines/779366) 成功，真实官网已确认。

## 原视频上传

重新访问当前已登录的 Video Universe，上传按钮已可用；实际页面显示总额度、每日额度均为 5 GB。此前禁用状态已发生变化，不据此猜测管理员调整原因或额度刷新机制。

三段原 MP4 未改分辨率、帧率、音轨或字节，均以原文件上传。来源哈希、标题、真实分享窗口的完整嵌入代码及独立字幕保存在 `assets/hardware/video-universe-20261020/`。

| 视频 | 原文件字节 | 实际观看入口 |
| --- | ---: | --- |
| Instrument Introduction | 6,779,615 | https://video.igem.org/w/q6SGzjQ4bFRpzdzyKBqXJN |
| ByeGerm 1.0 Operation | 22,559,008 | https://video.igem.org/w/uwHFkw36MLKcnT68W4RBYT |
| ByeGerm 2.0 Operation | 22,309,952 | https://video.igem.org/w/1Y2W6jaRTPosS4wPjpUwYV |

均使用本队标题生成器验证的 `JLU-SPH: … (2026) [English]` 形式；填写简介、团队署名和 Wiki 链接，公开、署名许可、科学与技术、英语并保留转码后发布。独立英文 VTT 根据原片屏幕指令转录，时间码及语法已在本地验证，并在平台保存后确认“已上传”；没有将无声画面编造成旁白或新增实验结论。原片的数字、温度和操作顺序保持。

截至本轮检查，三个视频均明确显示 `The video has been automatically blocked. A moderator review is required.`，匿名官方 API 均返回 401。仅账号所有者可观看的预览不能证明公众可播放。没有重复上传或绕过审核。

## 播放接入及验证

审核期间保留既有高清动画、定位、下方预加载及滚动播放。页面接近该区域时读取官方公开状态；只有公开视频、转码完成且未屏蔽，才隐藏和释放对应动画并加载真实官方嵌入。审核通过后的新访问可自动切换，仍支持有声播放入口、离屏暂停、手动暂停和全屏；减少动态设置须手动开始。

平台尚未批准，当前无法实测公众原视频播放。桌面／手机的审核前保留动画、模拟批准后切换及播放器消息交互分别核查，模拟结果不记作实际审核通过。实际官网、GitLab Hardware 流水线和 GitHub PR／生产 Actions 作为最终发布依据。

Hardware 接入的官方发布入口为 [GitLab !8](https://gitlab.igem.org/2026/jlu-sph/-/merge_requests/8)，合并提交 `388dd80`。六组本地状态／播放器交互核查通过；实际流水线与官网核查结果在完成发布后补记。
