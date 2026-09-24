import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/zh.js'

export default () =>
  uiLayout({
    title: '新粗野主义',
    description:
      '平涂的颜色、粗墨线和硬阴影：每个组件都有描边，按下时沉入自己的阴影里。',
    activeHref: '/zh/ui/theming/neubrutalism',
    extraHead: [presetPreviewHead('neubrutalism')],
    children: [
      p(
        code('neubrutalism'),
        ' 是平涂的颜色加粗重的墨线：每个表面都有描边，凡是从页面上凸起的东西都会投下没有模糊的硬阴影。按下控件时，它会沉进自己的阴影里，打开的切换按钮会一直停在那里。柔和填充是鲜亮的粉彩色，上面放深色文字；实心填充保持足够深，可以承载白色标签；到了深色模式，墨色会变成奶油色，因为黑色阴影在深色页面上根本看不见。',
      ),
      presetPreview('neubrutalism'),

      h2('使用'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('我的站点'),
  styles({ preset: 'neubrutalism' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/neubrutalism-3f1a9c42.css">`, 'javascript'),
      p(
        '把页面本身也涂成 ',
        code('var(--su-bg)'),
        '，它就会用上预设的奶油色，白色的表面在上面格外醒目。',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
}`, 'css'),

      h2('自定义颜色'),
      p(
        code('theme()'),
        ' 依然可以叠在上面用，所以预设是起点，而不是分叉。这个预设带有两个自己的令牌：',
        code('--su-nb-ink'),
        '，所有线条和阴影所用的颜色；以及 ',
        code('--su-nb-lift'),
        '，凸起的控件离页面有多远，也就是按下时它移动多远。',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'neubrutalism' }),
  theme({
    primary: { base: '#c2185b', hover: '#a8144e', active: '#8e1042', soft: '#ffb3d0', softFg: '#5c0a2a' },
    '--su-nb-lift': '6px',
  }),
)`, 'javascript'),
    ],
  })
