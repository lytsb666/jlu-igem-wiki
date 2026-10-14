# Homepage 修复记录 · 2026-10-13

预览：http://127.0.0.1:5171/homepage/index.html
工作区：D:/JLU—Wiki/IGEMwiki/worktrees/01-homepage

## 已完成

- PCR：接入用户提供的灯塔/PCR参考图，随滚动显现；点击或 Enter/Space 依次高亮 DNA 分离、引物结合、复制。手动选择保留，反向滚动不会抢回。
- RPA-CRISPR 四模块图：使用内置 image_gen 做清晰修复，1678×937；原始图为1245×695。生成图为插画修复，并非原始4K素材。
- 仪器页字幕：通过局部 --wiki-body-size 设置，避开共享 typography 层的 16px 强制规则。1920px屏幕实测42.24px，3840px屏幕44px，390px手机19px。
- 卡片：使用纯幕布底图去除静态卡面，增大透视距离避免相邻穿插；前后面分离1px；第三张卡片的31px透明顶部通过CSS裁切补偿，不改人物图。

## 素材路径

- D:/JLU—Wiki/IGEMwiki/worktrees/01-homepage/a  图片/home-story/revision-20261013/rpa-crispr-design-restored.png
- D:/JLU—Wiki/IGEMwiki/worktrees/01-homepage/a  图片/home-story/revision-20261013/cards-curtain-backdrop.png
- D:/JLU—Wiki/IGEMwiki/worktrees/01-homepage/a  图片/home-story/revision-20261013/pcr-lighthouse-reference.png（用户提供参考图的本地副本）

## 图像生成

工具：内置 image_gen，编辑模式。两张源图均先通过view_image检查，原图保留。

### 四模块图最终提示词

Use case: precise-object-edit. Edit target: supplied RPA-CRISPR design illustration. Restore this exact 1245x695 scientific illustration at high resolution (3840x2144 or highest supported landscape resolution), crisp printed linework, crisp readable lettering. Preserve the four panels, all pictured objects, panel positions, connecting arrows, peach parchment background, burgundy lettering and Art Nouveau border exactly. Do not redesign. Restore fine details and remove blurry raster softness. Text must remain verbatim and fully legible: Synthetic Biology-Driven Rational Design of / RPA-CRISPR System; Sequence Engineering; Computational Modeling; Protein Synthesis; Hardware Engineering; Primer; Primer; Cas12a; Primer Binding; Isothermal Amplification; CRISPR/Cas12a Activation; Fluorescence Readout. No additions, no watermark, no mascot, no webpage UI, no progress bar. Output just the restored illustration, matching the original aspect ratio.

### 幕布最终提示词

Use case: precise-object-edit. Edit target: supplied four-card illustration. Remove ALL four rectangular illustrated cards completely, including their frames, characters and lettering. Reconstruct the backdrop underneath them as uninterrupted Art Nouveau theatrical drapery/fabric. Preserve the existing curtain border and ornamental botanical braid shapes along the top, sides and bottom EXACTLY, keeping the same pastel sage/ivory flowing fabric on the left transitioning into muted dusty burgundy/blush drapery on the right. Continue those existing fabric folds behind where the cards were. The middle should be low contrast softly shaded curtain fabric so it can sit behind animated cards. Landscape canvas 3200x1786 or highest supported resolution, original aspect ratio. No panels, no cards, no rectangles, no lettering, no characters, no added symbols. Just the repaired curtain background.

## 验证

1920×1080、3840×2160、390×844 Chromium：PCR显示/鼠标/Enter，图片加载，字号，四卡同步滚动、翻转中间角度及边缘、手动翻回保护、反向滚动和 reduced-motion 通过；无页面脚本异常或资源404。Vite生产构建通过，node --check 和 git diff --check通过。

测试脚本与截图：D:/JLU—Wiki/IGEMwiki/tmp/homepage-review-20261013/。

已有未提交封面和final-20261012素材保留。本次未发布或合并主控。
