# Hardware、Contribution 与页脚优化 · 2026-10-16

后续页脚导航、赞助商及共享显示要求已由 [FOOTER_DIRECTORY_EDUCATION_REVIEW_20261016.md](FOOTER_DIRECTORY_EDUCATION_REVIEW_20261016.md) 和全局第 20 节更新；以下导航大框、21 个链接与非 Team 两秒赞助商记录是此前快照。Hardware Figure 21 删除与 Contribution 卡牌裁边继续有效。

本轮是 PR #8 发布后的新增要求，仅在本地实现，没有上传或发布。分支 `codex/footer-card-polish-20261016` 从已发布 main `152af97d987458170d3b4725b5879fcf21862485` 建立，其他历史分支和成果保留。

## 修改

- `Instrument/hardware.html`：只移除 ByeGerm 2.0 Device Operation Workflow 下原 Figure 21 的图片、原图入口及图注。操作视频、`workflow-2-clean.svg`、说明与手册入口保持，其他图号未重排；源文件 `assets/hardware/images/image24.png` 继续保存。
- `样式/contribution-pathway.css`：以 875×1220 的显示窗口展示 1086×1448 原图内的卡牌，偏移约左 105px／上 98px，去掉外围浅黄画布与阴影；使用匹配轮廓的圆角、保持比例，不改原 PNG。正反面使用同一轮廓；背面减少内边距和段间距，确保五张原文字完整。
- `样式/footer.js/css`：导航增加 Explore the wiki 标签及圆角分区；原学校信息前增加 ByeGerm 品牌字样；联系与赞助商标题以细线连接；五个二维码使用同高半透明卡片，赞助商区域独立描边。深棕底增加柔和光晕、淡圆环及淡品牌字样，装饰不接受鼠标事件。
- 继续保留导航整行在全部原内容上方、单屏高度、21 个链接、5 个二维码、8 个赞助商、原版权与图片。导航链接无下划线；非 Team 两页赞助商仍每两秒切换，Team 继续原连续滚动。没有改动轮播逻辑、二维码或赞助商原始文件。

## 必要检查

- 1440×900、1280×720、390×844、320×740：最终页脚分别为 900／720／844／740px，无整页横向溢出；链接、二维码、赞助商和版权完整。短屏使用较紧间距，320px 栏目名称不拆行。
- 1440px 和 390px 的五张卡牌逐一翻转：背面没有垂直或水平裁切，Escape 可回到正面。复看正面确认外部留白去除、金色卡框保留；原图和正文未修改。
- Hardware 原 Figure 21 不再展示，Workflow 操作示意图与视频保留；删除范围之外的源文和锚点不变。
- Team 桌面／手机仍使用原滚动行为与共享页脚，没有应用非 Team 轮播替换。浏览器无页面脚本错误。
- 正式构建与资源检查通过：877 文件、23 HTML、1748 引用，缺失／超限／不安全项均为零；原图片文件未删除，产物少两个已不再引用的图片文件。
- 本机截图、源码备份及检查结果位于 `.local/footer-card-polish-20261016/`；最终页脚尺寸见 `footer-final.json`，长期要求写入全局入口第 19 节。

本地预览：[新版页脚](http://127.0.0.1:5221/Instrument/hardware.html#site-footer)、[Contribution 卡牌](http://127.0.0.1:5221/Project/contribution.html#contribution-image-7)。
