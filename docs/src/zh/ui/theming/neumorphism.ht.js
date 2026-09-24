import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/zh.js'

export default () =>
  uiLayout({
    title: '新拟态',
    description:
      '软 UI：每个组件都只靠光与影，从页面上凸起或压进页面里。',
    activeHref: '/zh/ui/theming/neumorphism',
    extraHead: [presetPreviewHead('neumorphism')],
    children: [
      p(
        code('neumorphism'),
        ' 是软 UI：每个表面都是页面本身，控件只靠光与影区分出来——要么从页面上凸起，要么压进页面里。这种风格通常放弃的两样东西它都保留了：达到 WCAG AA 的文字，以及焦点轮廓；它也和其他一切一样跟随深色模式。不过它要求页面自身的背景是 ',
        code('var(--su-bg)'),
        '，因为整个效果就建立在两者同色之上。',
      ),
      presetPreview('neumorphism'),

      h2('使用'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('我的站点'),
  styles({ preset: 'neumorphism' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/neumorphism-5d0e7b91.css">`, 'javascript'),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
}`, 'css'),

      h2('自定义颜色'),
      p(
        code('theme()'),
        ' 依然可以叠在上面用，所以预设是起点，而不是分叉。这个预设给每套调色板加了第十个槽位 ',
        code('glow'),
        '——进度条或开关在末端渐变过去的那个颜色——这样新的主色就能带上自己的。',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'neumorphism' }),
  theme({
    primary: { base: '#7c3aed', hover: '#6d28d9', active: '#5b21b6', glow: '#e879f9' },
  }),
)`, 'javascript'),
    ],
  })
