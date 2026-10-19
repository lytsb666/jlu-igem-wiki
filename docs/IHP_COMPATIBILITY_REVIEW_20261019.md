# iHP Overview 动画删除与两图兼容修复（2026-10-19）

## 工作区与请求边界

继续在 `D:/JLU-Wiki/.local/github-latest-20261019` 的 `codex/screenshot-revisions-20261019` 分支上修改，保留上一轮八项截图修订。提交基线仍为 `a69d7c8`；根工作区原有 iGEM 源码成果不覆盖、不合并。本轮仅本地修改，未提交、上传或发布。

用户要求删除 iHP Overview 底部白泽动画及对应内容、修复两张指定图在部分电脑上的错乱、移除 Wet lab 下方的 Click 图标。只处理这些位置，不把截图中其他内容当作新增修改要求。

## 实施

- 删除 Overview 末尾整个 `.ihp-walking-story` 区块，包括白泽、固定滚动展示区和两句 `For the Well-being of Humanity，Health Is a Right for Everyone`／`For a Better Future for Humanity, We Keep Going`。同步移除两个页面脚本中的人物替换、字体覆盖、固定位置及滚动动画处理；WHO 框的白泽、LISTEN 提示与两侧导航人物保持。覆盖此前要求保留该走动结尾的历史条款。
- Figure 2 的五问题图和 Figure 103 的回答图原为包含 Calibri 文本及绝对坐标的 SVG；字体回退可能改变文字宽度，导致截图所示越框和分段文字重叠。从原 SVG 使用本机原 Calibri 字体以 3 倍比例直接渲染，得到 3480×1971／4626×2808 的透明 PNG，原内容、布局、图标、箭头、颜色和比例不变，原 SVG 不覆盖。
- 新显示文件及 SHA-256 来源记录保存在 `assets/ihp-compatibility-20261019/`。页面及放大入口使用相同高清显示版，不要求访问者安装 Calibri。Figure 2 旧脚本原会重设显示图与放大地址，本轮同步修正该赋值，避免页面加载后恢复旧 SVG。
- 第一张图的五个区域跳转、下方五阶段快捷入口、键盘入口及两图原图注保持；第二张图可放大查看高清版本。
- 仅停止插入 Wet lab 图标下的小白泽和 `Click` 提示；黄色发光试管、反馈表弹窗、手机入口和 LISTEN 小白泽提示保持。

## 验证

- Node v24.19.0 正式构建成功，资源检查为 1,263 个文件、23 个 HTML、1,798 个引用，无缺失、超限或不安全文件。
- Chrome／Edge 各检查 1440×900 与 390×900，共四组：Overview 动画和两句文字均不存在，Wet lab 提示不存在，LISTEN 提示保留；两图实际显示 PNG，天然分辨率与导出一致，无页面脚本异常、HTTP 错误或整页横向溢出。
- Chrome 桌面逐个点击五个问题，均到达原 Stage 1–5；第二张图可放大并用 Escape 关闭。四组视口的 Wet lab 入口均仍能打开原反馈表并关闭。
- 与提交基线比较，除指定动画区外，其余页面文本、全部剩余锚点及 PDF 链接完全一致；Figure 2／103 原文与编号保留。上一轮五卡居中及其他页面成果保持。`git diff --check` 通过。
- 两张高清图及最终网页截图已目视检查，文字未越框或相互重叠。验证使用本机 Chrome／Edge；未声称实测所有操作系统。PNG 中没有浏览器需要再次排版的文字，已消除这两张图对访问者 Calibri 字体的依赖。

证据：[检查记录](verification/ihp-compatibility-20261019.json)、[五问题图显示](verification/ihp-compatibility-20261019/questions-1440.png)、[回答图显示](verification/ihp-compatibility-20261019/answers-1440.png)。本机导出脚本、完整截图与构建日志保存在 `D:/JLU-Wiki/.local/ihp-compatibility-20261019/`；原 SVG 与可迁移来源清单保存在最新 worktree 的版本化资源中。

本地预览继续使用既有服务：<http://127.0.0.1:5222/Eagagement/iHP.html>，刷新即可查看本轮修改。
