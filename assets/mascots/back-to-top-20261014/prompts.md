# 人物透明素材处理提示词

模式：内置 `image_gen.imagegen`，两次 background-extraction 编辑，均指定 `transparent_background: true`。输入为用户本轮提供的两张拼图；输出是用于网页的透明衍生素材，原始附件未修改。人物动作由 CSS 实现。

## lab-roles-transparent.png

输入：`54a63576db22a091f6e01d846ca05c55.png`

Use case: background-extraction. Edit target: the supplied image of eight original illustrated white sheep/deer scientists, arranged in four columns and two rows. Task: remove ONLY the outer plain white background, including the plain white gaps around and between all eight scenes, to make a genuinely transparent PNG sprite sheet for a website. Preserve the exact original artwork, character identities, poses, colors, antlers, white fur, white coats, blue surgical gowns and masks, lettering on the protocol board, microscope, glassware, clipboard, book stacks, sink and medical equipment. Do not redraw, reimagine, add, omit or rearrange any character or object. Keep every scene at its original position and size, keep the same overall wide canvas aspect ratio and the original 4-column by 2-row arrangement. All white regions inside the characters, fur, coats, objects and text board MUST stay opaque white. Remove only the outside background. No new text, no labels, no border, no shadow, no colored backdrop.

## research-roles-transparent.png

输入：`0054f367d10290ecd615ddce5d7d38a2.png`

Use case: background-extraction. Edit target: the supplied original wide illustrated sheet of sheep/deer scientists. Task: remove ONLY the exterior plain white background and plain white gaps between the six scenes, producing a genuinely transparent PNG sprite sheet for a website. Preserve the exact original artwork, faces, bodies, antlers, colors, white fur and coats, all objects and all lettering. Preserve the original arrangement and wide canvas aspect ratio: top row has the pipette scientist at left, green surgical gown surgeon next, and the TWO scientists together with a bioreactor and Success! sign across the right half. Bottom row has the colorful beaker scientist at left, the TWO scientists together at their computer workstation across the middle half, and the skeleton researcher at right. Keep the paired scenes intact as pairs. Do not rearrange or separate those paired scenes, redraw, crop, add, omit or reimagine anything. Keep every scene at its original position and size. White areas inside characters and objects must remain opaque white. Only outside background becomes transparent. No new objects, labels, shadows, border or colored backdrop.
