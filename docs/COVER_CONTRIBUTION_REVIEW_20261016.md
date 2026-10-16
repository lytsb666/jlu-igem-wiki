# 封面与 Contribution 卡牌修改 · 2026-10-16

本次为用户在 iHP 修改过程中追加的两个请求：更换 Measurement／Contribution 封面，将 Contribution Figure 6 改为箭头连接的五阶段翻转卡牌。本轮只作本地修改，没有提交、上传或发布。

## 原始素材

| 用途 | 用户附件 | 站内文件 |
| --- | --- | --- |
| Measurement 封面 | `63b433af307923dbd531d50f5d2585d.png` | `a  图片/page-covers/revision-20261016/measurement.png` |
| Contribution 封面 | `e694f1e80fd2eddd6380bce296b3421.png` | `a  图片/page-covers/revision-20261016/contribution.png` |
| LISTEN | `c2dd09d06ddc110f21a104b789735fe.png` | `assets/contribution/revision-20261016/listen.png` |
| DEFINE | `9da1802bd858694a2002bb84e00cbbe.png` | `assets/contribution/revision-20261016/define.png` |
| BUILD | `daca1093251720229c08a35f43c7d3d.png` | `assets/contribution/revision-20261016/build.png` |
| ENGINEER | `212f81bd8d78e41ff781a7bebcc3ef0.png` | `assets/contribution/revision-20261016/engineer.png` |
| EXTEND | `e36ef533c372bb37d0becd6bf3395ea.png` | `assets/contribution/revision-20261016/extend.png` |

两张封面均为 1678×937，五张卡牌均为 1086×1448。微信临时 PNG 路径在处理中失效，随后在对应的微信原始图片缓存中找回全部七张图，恢复原始 PNG 字节，没有重新压缩、裁剪文件或改变像素。两处 `source-manifest.json` 保留附件名、对应缓存文件名、尺寸及 SHA-256；站内已独立保存，不依赖微信缓存继续存在。

## 实施

- Measurement 仅在 `样式/page-covers.css` 中更换原封面 URL，保留现有背景遮罩与其他样式；正文、标题与四个关键词保持。
- Contribution 在 `Project/contribution.html` 中换图并更新真实尺寸和说明，现有斜体标题、三个黑色关键词框、遮罩、导航与页脚保持。
- 原 Figure 6 对应的 `contribution-image-7` 锚点保留，替换为五张原图组成的卡牌序列。每张正面为本轮原始图片，背面为图片中已有的阶段问题和 Project Shift 文本，没有添加新的研究事实。中间箭头显示阶段顺序；原流程图保留为 Open original pathway 链接。
- 新增本页专用 `样式/contribution-pathway.css`／`.js`。按钮支持鼠标／触控、Enter／Space 翻转以及 Escape 复位，并同步 `aria-pressed` 与正反面的辅助阅读状态。桌面五张横排，窄屏居中竖排并切换向下箭头；减少动画时取消过渡。
- 修正旧原图脚本对所有 `.research-original` 都含图片的假设，跳过新增的纯文字原图入口。
- 用户指定图注完整保留为 **Figure 6. ByeGerm’s five-stage iterative pathway.**，包含末尾句点，通过本图已格式化标记避免公共图注脚本再次改写。此例外已写入全站要求第 16 节。

## 必要检查

- 1440px 桌面逐一翻转五张卡牌，确认原图加载、正反面辅助状态与键盘 Enter／Space／Escape；背面没有文字裁切。
- 1280px、390px、320px 检查响应式排布，页面无横向溢出，背面文字均完整；保留箭头与阶段顺序。减少动画模式保持可立即翻转。
- 两页浏览器没有页面脚本错误；Measurement 计算后的背景地址与 Contribution 的图片地址均指向本轮原图，标题与关键词效果保留。
- 与修改前对照，Contribution 的全部正文段落、原锚点、表格和页脚保持；20 张本轮 iHP／封面／卡牌图片的 SHA-256 均与来源清单一致。
- 合并本次 iHP 修改后构建通过：879 个文件、23 个 HTML、1750 个站内引用，缺失／超限／不安全项均为空，最大文件 22,559,008 bytes。

本机证据位于 `.local/ihp-polish-20261016/`，包括原页面备份、桌面／手机截图、`final-check.json` 和 `build.log`。

预览：[Measurement](http://127.0.0.1:5221/Wet-lab/measurement.html)、[Contribution Figure 6](http://127.0.0.1:5221/Project/contribution.html#contribution-image-7)。开发服务运行时可访问。
