import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/zh.js'

export default () =>
  uiLayout({
    title: '蓝图',
    description:
      '一张技术图纸：细线、直角和套准标记，等宽大写字母的标签，以及墨色加一种蓝图蓝。',
    activeHref: '/zh/ui/theming/blueprint',
    extraHead: [presetPreviewHead('blueprint')],
    children: [
      p(
        code('blueprint'),
        ' 是一张技术图纸：近黑的底色上是细线和直角，卡片、对话框和一排统计数字的每个角上都有一个套准标记——一个小十字。凡是给东西命名或用来操作的——按钮、字段的标签、标签页、标签、列标题、栏里的链接——都用等宽字体、以拉开字距的大写字母排出，而标题和正文仍用无衬线字体，排得紧凑。实线是边缘，虚线划分其内部，就像图纸标出隐藏线那样：表格的行、分隔线、通往尚未到达的步骤的那段线。颜色很少。实心按钮、勾选的复选框、填满的进度条以及一切被选中的东西都是墨色，反白印出；一种蓝图蓝标示焦点和标题上方的标签；成功、警告和危险保留各自的颜色，用来表达它们的含义。没有任何东西投下阴影。深色模式是原本的样子；浅色模式保留每条线和每个标记，用墨色印在白纸上。',
      ),
      presetPreview('blueprint'),

      h2('使用'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('我的站点'),
  styles({ preset: 'blueprint' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/blueprint-4d1f8a20.css">`, 'javascript'),
      p(
        '用 ',
        code('var(--su-bp-backdrop)'),
        ' 作为页面背景，就能得到预设的底色和上面一层淡淡的网格；也可以只用 ',
        code('var(--su-bg)'),
        '。页面加载了 Geist 或 Inter，以及 Geist Mono、JetBrains Mono 或 IBM Plex Mono 时，预设会使用它们，否则使用系统自带的字体；预设本身不下载任何东西。',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bp-backdrop);
  color: var(--su-text);
  font-family: var(--su-font-sans);
}`, 'css'),

      h2('自定义颜色'),
      p(
        code('theme()'),
        ' 依然可以叠在上面用，所以预设是起点，而不是分叉。主色调色板就是墨色——实心按钮、勾选的复选框、填满的进度条、一切被选中的东西——所以 ',
        code('primary'),
        ' 能一次把它们全部改色。其余是这个预设自己的令牌：',
        code('--su-bp-accent'),
        '，绘制焦点、标示标题的蓝色；',
        code('--su-bp-mark'),
        '，套准标记，设为 ',
        code('transparent'),
        ' 即可去掉；',
        code('--su-bp-field'),
        '，字段周围的线；',
        code('--su-bp-track'),
        '，进度条运行的槽；',
        code('--su-bp-grid'),
        ' 和 ',
        code('--su-bp-cell'),
        '，背景网格的线条和格子大小；以及 ',
        code('--su-bp-tracking'),
        '，标签大写字母之间的字距。这里把蓝色换成信号橙，标记也随之改变。',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'blueprint' }),
  theme(
    { bpAccent: '#c2410c', bpMark: '#c2410c' },
    { dark: { bpAccent: '#ff7a3d', bpMark: '#ff7a3d' } },
  ),
)`, 'javascript'),
    ],
  })
