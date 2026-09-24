import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/zh.js'

export default () =>
  uiLayout({
    title: 'Superneon',
    description:
      '近乎黑色的紫、发丝般的细边和霓虹光：带发光边框的深色胶囊按钮，以及从上方打光的标题。',
    activeHref: '/zh/ui/theming/superneon',
    extraHead: [presetPreviewHead('superneon')],
    children: [
      p(
        code('superneon'),
        ' 是近乎黑色的紫，配上发丝般的细边和从内部透出的光。实心按钮是一枚深色胶囊，内侧边缘被照亮，外圈是一道渐变，光晕溢出轮廓之外；大标题从明亮渐变到薰衣草色，凡是被选中或打开的东西都会带上一圈光晕。光晕永远只是装饰，所以每个标签依然落在满足 WCAG AA 的纯色上。深色模式是原本的样子；浅色模式保留深色胶囊和光晕，把它们放在淡淡的薰衣草色页面上。',
      ),
      presetPreview('superneon'),

      h2('使用'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('我的站点'),
  styles({ preset: 'superneon' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/superneon-5b0e7d21.css">`, 'javascript'),
      p(
        '把页面背景设为 ',
        code('var(--su-sn-backdrop)'),
        '，就能得到预设的底色，外加一道从顶部洒下的紫光；也可以直接用 ',
        code('var(--su-bg)'),
        '。页面加载了 Geist 时标题就用它，否则用系统字体——预设本身不下载任何东西。',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-sn-backdrop);
}`, 'css'),

      h2('自定义颜色'),
      p(
        code('theme()'),
        ' 依然可以叠在上面用，所以预设是起点，而不是分叉。这个预设给每个调色板多加了两个槽位：',
        code('glow'),
        ' 和 ',
        code('glowEnd'),
        '，也就是绘制边框和光晕所用渐变的两端。光晕上不会放要读的内容，所以想多亮都可以。',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'superneon' }),
  theme({
    primary: { glow: '#00e5ff', glowEnd: '#7f6bff' },
  }),
)`, 'javascript'),
    ],
  })
