# Hardware 提示与进度条修正（2026-10-20）

基于 GitHub main `3108502` 与 iGEM main `04cd769` 的最新已发布版本。用户要求删除截图中的 Loading demonstration… 提示，并在移动进度条时不要暂停。沿本次连续发布授权优先更新 iGEM，再同步 GitHub 和固定预览站。

- 删除常规加载提示，隐藏空提示行，不留其原有最小高度；真实加载失败时保留可操作错误反馈。
- 播放中拖动进度条保持播放状态，并从选定位置继续；连续快速拖动只处理最新位置，过时的排队渲染不再发起加载。手动暂停后的定位仍保持暂停。
- 三段的原分辨率、30fps、已核验的媒体、预加载、离屏暂停、原件及其他页面均保持。仅修改播放器 JS／CSS 及相关验证和要求记录。

桌面／手机三段的播放中定位、连续拖动、暂停后定位、无提示文字及零占位高度验证见 `docs/verification/hardware-seek-playback-20261020/`。本地与官网的桌面／手机三段共六组检查均通过；原生动画图片回退的播放中定位、暂停后定位检查通过。正式源码构建通过，364 个输出无缺失引用；除 Hardware 页面和其播放器 JS／CSS 外，其他页面和媒体无实质变化。

实际发布：[GitLab !5](https://gitlab.igem.org/2026/jlu-sph/-/merge_requests/5) 已合并，main 为 `205785bad3ba404b9d84248eb350134e698b2fdf`；[流水线 777299](https://gitlab.igem.org/2026/jlu-sph/-/pipelines/777299) 成功。[官网 Hardware](https://2026.igem.wiki/jlu-sph/Instrument/hardware.html) 的上述六组检查已通过，底部提示高度为 0，播放中快速连续拖动后仍继续，手动暂停后定位仍暂停。媒体不需要重新上传。

GitHub 与固定预览站沿本轮修正 PR／wiki-build／merge commit 和原自动部署流程同步，实际状态以该 PR 及 main 的最新 Actions 为准。
