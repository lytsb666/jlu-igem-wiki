# 仅撤回 2026-10-18 图片显示处理

用户要求允许随时撤回本轮图片裁切／背景融合，其他修改保留。不要用整批回滚、覆盖页面、恢复旧分支或撤销整次提交来完成此操作。

## 持久关闭

在仓库根目录执行：

```powershell
node scripts/set-media-presentation.mjs --disable
```

此命令只将 `assets/media-presentation-20261018/settings.json` 的 `enabled` 改为 `false`。本地开发页面刷新后恢复；已构建预览需要重新构建。公网是否更新仍按当前用户的发布授权执行。

恢复本轮图片显示：

```powershell
node scripts/set-media-presentation.mjs --enable
```

也可直接修改上述 JSON 的一个布尔值。不要删除原图、原图链接、`profile.json`、已存在的历史显示 SVG，或旧轮次专用裁切样式。

## 只预览当前页面的恢复效果

浏览器控制台运行：

```javascript
window.wikiMediaPresentation.restore()
```

重新开启当前页面：

```javascript
window.wikiMediaPresentation.setEnabled(true)
```

临时预览不改文件，刷新会按持久开关重新加载。开启前会保存受影响的原有窗口变量，关闭时逐项恢复，重复开关不会叠加裁切。

## 撤回范围

恢复本轮的外围空白裁切、纸白／近白背景融合和纯图片外层白底／边框。保留原件，图片放大链接仍指向完整原图。

以下内容全部保留：

- 《10.18湿实验建议》中的文字、标题、基因名和 Results 图注修改。
- 创业页卡片改普通标题、实际 Table 1–38、iHP 课表 Table 6 和 Figure 1–100，以及对应正文引用。
- Back 紧贴正文框右侧、返回原阅读位置和滚出视口消失的行为。
- 此前已完成的 Software／Hardware、新图、PDF 和其他页面成果。
- 后续 iHP 10.18 明确要求的三张照片替换、Summary 新完整图、图注、WHO 图标与 Figure 1 缩小等独立修改。

原件哈希和裁切窗口见 [图片清单](../assets/media-presentation-20261018/profile.json)，本轮验证见 [实施记录](SITE_MEDIA_CAPTION_BACK_REVIEW_20261018.md)。
