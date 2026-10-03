import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/zh.js'

export default () =>
  uiLayout({
    title: '终端',
    description:
      '一个系统控制台：黑底上只用一种等宽字体，细线面板，粗体大写的标签，青色强调色，选中项以反色显示。',
    activeHref: '/zh/ui/theming/terminal',
    extraHead: [presetPreviewHead('terminal')],
    children: [
      p(
        code('terminal'),
        ' 是一个系统控制台：黑色底色上只用一种等宽字体，细线面板的标题栏用一条线隔开，每个标签——按钮、字段的说明、标签页、列标题——都用大写字母，多数加粗。青色是强调色：大标题、面板标题、实心按钮和焦点。选中项——指针下的表格行、按下的分段、选中的胶囊标签页、当前页码、指针下的菜单项——以反色显示，青底深字，就像终端高亮一行那样。成功、警告和危险调色板是它的状态色，绿、黄、红；描边按钮或标签用各自的颜色绘制，线条和文字都是。除了单选按钮，没有圆角，也没有阴影。深色模式是原本的样子；浅色模式保留每一条线、每个大写字母和每个直角，以黑色印在近白的底上。',
      ),
      presetPreview('terminal'),

      h2('使用'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('我的站点'),
  styles({ preset: 'terminal' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/terminal-06767808.css">`, 'javascript'),
      p(
        '把页面本身也设成这样——它的底色、文字颜色和字体——组件就会像上面那样落在页面上。页面加载了 JetBrains Mono、IBM Plex Mono 或 Source Code Pro 时预设会使用它，否则使用系统自带的等宽字体；预设本身不下载任何东西。',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
  color: var(--su-text);
  font-family: var(--su-font-mono);
}`, 'css'),

      h2('自定义颜色'),
      p(
        code('theme()'),
        ' 依然可以叠在上面用，所以预设是起点，而不是分叉——这里把强调色改成荧光屏的琥珀色，连同绘制它的线条。这个预设带有三个自己的令牌：',
        code('--su-tm-tracking'),
        '，标签大写字母之间的字距；',
        code('--su-tm-track'),
        '，进度条或滑块运行的槽；以及 ',
        code('--su-tm-field'),
        '，字段周围的线，在深色模式下与面板同为淡淡的灰色——想让字段边缘更醒目就把它调亮。',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'terminal' }),
  theme(
    {
      primary: {
        base: '#8a5200', hover: '#734400', active: '#5c3600',
        soft: '#f6e6cc', softHover: '#efd9b3', softFg: '#4d2e00',
        border: '#c9a066', ring: 'rgba(138, 82, 0, 0.3)',
      },
    },
    {
      dark: {
        primary: {
          base: '#ffb000', hover: '#ffd480', active: '#e69e00',
          soft: '#33260d', softHover: '#45330f', softFg: '#ffd480',
          border: '#d99600', ring: 'rgba(255, 176, 0, 0.4)',
        },
      },
    },
  ),
)`, 'javascript'),
    ],
  })
