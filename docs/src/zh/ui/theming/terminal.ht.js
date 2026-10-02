import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/zh.js'

export default () =>
  uiLayout({
    title: 'Terminal',
    description:
      '深海军蓝底色上只用一种等宽字体，仿照 Advent of Code：方括号里的操作、绿色链接，以及点亮之处的辉光。',
    activeHref: '/zh/ui/theming/terminal',
    extraHead: [presetPreviewHead('terminal')],
    children: [
      p(
        code('terminal'),
        ' 在深海军蓝底色上只用一种等宽字体，排版方式与 Advent of Code 相同：灰色正文，悬停时变亮的绿色链接，用白色表示重要内容，少数点亮的元素带着与自身同色的辉光。操作是方括号里的一个词，',
        code('[保存]'),
        '；复选框在勾选前是 ',
        code('[ ]'),
        '，勾选后是 ',
        code('[X]'),
        '；二级标题两侧用横线隔开，写作 ',
        code('--- 标题 ---'),
        '。没有圆角，也没有柔和的阴影：边缘就是一条线，凸起的卡片用双线框出。深色模式是原本的样子；浅色模式保留字体、方括号和直角，以海军蓝印在浅色纸面上，不带辉光。',
      ),
      presetPreview('terminal'),

      h2('使用'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('我的站点'),
  styles({ preset: 'terminal' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/terminal-9590922b.css">`, 'javascript'),
      p(
        '把页面本身也设成这样——它的底色、灰色和字体——组件就会像上面那样落在页面上。页面加载了 Source Code Pro 时预设会使用它，否则使用系统自带的等宽字体；预设本身不下载任何东西。',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
  color: var(--su-text);
  font-family: var(--su-font-mono);
}`, 'css'),

      h2('自定义颜色'),
      p(
        code('theme()'),
        ' 依然可以叠在上面用，所以预设是起点，而不是分叉。辉光用它所在文字的颜色绘制，因此你修改过的调色板会以新的颜色发光——这里把主色改成琥珀色，像一台老式终端。成功色是星星的金色，正如参照网站标记一道已解出的谜题；如果你更喜欢绿色，也可以用同样的方式改掉。这个预设带有两个自己的令牌：',
        code('--su-tm-bright'),
        '，标题和一切选中项使用的白色；以及 ',
        code('--su-tm-glow'),
        '，点亮元素带的阴影，在浅色模式下为 ',
        code('none'),
        '。',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'terminal' }),
  theme(
    { primary: { base: '#8a5200', hover: '#734400', active: '#5c3600', soft: '#f6e6cc', softFg: '#4d2e00' } },
    { dark: { primary: { base: '#ffb000', hover: '#ffd480', active: '#e69e00', soft: '#33260d', softFg: '#ffd480' } } },
  ),
)`, 'javascript'),
    ],
  })
