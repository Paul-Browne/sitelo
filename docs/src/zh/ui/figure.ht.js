import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/zh.js'

export default () =>
  uiLayout({
    title: '图注',
    description: '把图片和它的说明合成一个 figure——并在图片到达之前先把位置占好。',
    activeHref: '/zh/ui/figure',
    children: [
      p(
        '一个 ',
        code('<figure>'),
        ' 把说明和它所描述的东西绑在一起，而图片下面的一段普通文字做不到这点。常见情况传 ',
        code('src'),
        '，其他值得配说明的东西就传子元素。',
      ),

      h2('基础图注'),
      demo(`figure({
  src: '/logo.svg',
  alt: 'sitelo 的文字标识',
  caption: '文字标识，就是顶栏里的那个样子。',
  style: '--su-figure-bg: var(--su-surface-2)',
})`, { align: 'stretch' }),

      h2('预留固定比例'),
      p(
        code('ratio'),
        ' 会把图片包进一个 ',
        code('aspectRatio()'),
        '，这样图片加载时说明文字绝不会往下跳。',
      ),
      demo(`grid({ min: '13rem' },
  figure({ src: '/logo.svg', alt: '', ratio: '16 / 9', caption: 'ratio: 16 / 9' }),
  figure({ src: '/logo.svg', alt: '', ratio: '1 / 1', caption: 'ratio: 1 / 1' }),
)`, { align: 'stretch' }),

      h2('给别的东西加说明'),
      p('不给 ', code('src'), ' 时，子元素就是这个 figure 的内容。'),
      demo(`figure({ caption: '表 1 —— 一次默认构建的产物。' },
  table({
    dense: true,
    columns: [{ key: 'file', header: '文件' }, { key: 'size', header: '大小', align: 'end' }],
    rows: [
      { file: 'index.html', size: '4.1 kB' },
      { file: '404.html', size: '860 B' },
      { file: 'sitemap.xml', size: '155 B' },
    ],
  }),
)`, { align: 'stretch' }),

      h2('带说明的代码'),
      p(
        '注意 ',
        code('code()'),
        ' 上的 ',
        code('text'),
        ' 属性：在这个库里子元素一律按 HTML 渲染，所以含标签的示例必须转义，否则浏览器会把它构建出来，而不是显示出来。',
      ),
      demo(`figure({ caption: '一个完整的 sitelo 页面。' },
  code({ text: 'export default () => "<h1>你好</h1>"' }),
)`, { align: 'stretch' }),

      h2('替代文字'),
      p(
        code('alt'),
        ' 属性总会写上，你不给就写成空——完全没有 ',
        code('alt'),
        ' 的图片会被按文件名读出来，那比沉默还糟。说明文字不能顶替它：说明是给所有人读的，alt 是把图片描述给看不见它的人。',
      ),
      p(
        '当说明已经把图片说的话都说尽了，',
        code("alt: ''"),
        ' 就是正确答案。',
      ),

      h2('在正文里'),
      p(
        'Markdown 渲染出来的 figure 已经由 ',
        code('prose()'),
        ' 负责样式了。这个组件是给你自己搭的 figure 用的。',
      ),

      h2('属性'),
      propsTable([
        ['src', 'string', '', '图片地址。也可以省略它，改用子元素。'],
        ['alt', 'string', "''", '替代文字。总会写出来，哪怕是空的。'],
        ['caption', 'Child', '', '那段 figcaption。'],
        ['ratio', 'string', '', '在图片加载前把位置占住。'],
      ]),
    ],
  })
