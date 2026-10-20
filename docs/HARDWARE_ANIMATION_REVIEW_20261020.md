# Hardware 高清动画与滚动播放（2026-10-20）

用户明确要求优先上传 iGEM、优先保留清晰度，随后要求滚动到对应演示区域才播放、下方两段可以提前加载。本轮从已验收 GitHub main `f06e6ea` 接续，在 `codex/hardware-lossless-animation-20261020` 实施；不覆盖根工作区的旧基线和其他成果。

## 媒体和播放

原始三个 MP4 保留在 `public/hardware-resources/`，没有修改。WebP／AVIF 分段、源文件及逐帧哈希和校验结果在 `assets/hardware/animations-20261020/`。保持 1280×720、原始 30fps、全部 6,652 帧及时间顺序；WebP 对完全相同的帧合并储存并保留时长，播放器按原帧映射显示。全部分段逐帧解码与原片像素比对通过，像素不一致数为 0。

| 演示 | 时长 | 分段 | 无损动画字节 |
| --- | ---: | ---: | ---: |
| Instrument introduction | 22.27 秒 | 24 | 129,752,476 |
| ByeGerm 1.0 operation | 122.33 秒 | 79 | 348,943,523 |
| ByeGerm 2.0 operation | 77.13 秒 | 37 | 197,470,155 |

单文件不超过 8,000,000 字节。动画无音轨，原片内字幕保留；不能把它记录为原视频上传 Video Universe 成功。原账号的禁用状态和本队官方媒体要求见 [重试记录](VIDEO_UNIVERSE_RETRY_REVIEW_20261020.md)。

播放器滚动进入视口至少 40% 后开始播放，离开或页面切到后台时暂停；手动暂停保持，减少动态时手动开始。提供暂停、重新开始、定位和全屏。当前段预取下一段，下方两段按顺序低优先级缓存首段，首屏不批量下载全部动画。支持 ImageDecoder 的浏览器逐帧绘制；其他浏览器使用原生动画图片按分段播放。

无损媒体的体积明显大于原 MP4。以 20Mbps 连接计算，第一段全量理论约 52 秒，首个 4.15MB 分段理论约 1.66 秒，不含延迟、解码和其他带宽竞争；后续高变化画面需要更高带宽，连接不足时保留全部帧并等待缓冲，不通过降低分辨率或丢帧掩盖。

## 发布方式和验证

本队 Uploads 页面明确 WebP／AVIF 按上传文件原样储存。真实上传返回地址及 CDN 下载 SHA256 校验另行保存在媒体映射和 `docs/verification/hardware-animation-20261020/`，不根据文件名猜地址。

本轮同时核对官方源码构建要求：把可编辑的最新页面、样式和脚本放入官方 `frontend/`，媒体引用指向已核验的官方地址，由原 CI 的 `npm run build` 执行 Vite。依赖锁、原 CI、Flask 发布及根许可证保留；不以提交预生成 bundle 代替源码。

当前状态：140 个分段均已取得实际官方地址；676,166,154 字节全部通过 CDN 下载 SHA256 核验，未被平台改写。播放器的桌面／手机自动播放、离屏暂停、手动暂停、跨段定位和减少动态检查通过；原生 AVIF 回退检查通过。全部 18 页双宽度共 36 次检查无缺图、重叠、横向溢出或浏览器／网络错误，结果图框保持居中。锁文件构建通过，真实官方工作区与验收包的 364 个输出文件完全一致。

派生动画文件在 iGEM CDN 长期保存；仓库保存原始 MP4、每帧哈希、分段清单、真实地址和转换／核验脚本，浏览器直接从官方 CDN 分段加载。可再生成的本机编码缓存不重复提交到 Git。

## 实际官方发布

- [GitLab !4](https://gitlab.igem.org/2026/jlu-sph/-/merge_requests/4) 已合并，main 为 `04cd769a9512362327f970664256376b4db72ea2`。[流水线 777137](https://gitlab.igem.org/2026/jlu-sph/-/pipelines/777137) 成功；原 CI、依赖锁、Flask 发布与根 LICENSE 字节保持。
- [官网 Hardware](https://2026.igem.wiki/jlu-sph/Instrument/hardware.html) 的三段动画已上线。89 个正式页面／脚本／样式文件与真实 CI 产物逐字节一致；CI 与 Windows 本地构建仅存在第三方文本换行符及 team／Team 别名路径大小写差异，归一化比较无内容差异。
- 官网桌面／手机三段的进入视口播放、离开暂停、手动暂停保持、跨段定位、1280×720 画布与减少动态检查通过。实际确认第一段播放时，下方两段首段均已加载完成，而两段本身仍未播放；全屏内控件可见。证据在 `official-player/`、`official-preloading.json`、`official-fullscreen.json`、`official-deployed-files.json`。
- GitHub 同步入口为 [PR #22](https://github.com/lytsb666/jlu-igem-wiki/pull/22)，保留 PR、wiki-build 和 merge commit 流程；该 PR 的实时状态与 main 生产 Actions 是仓库／固定预览站发布状态的最终依据。
