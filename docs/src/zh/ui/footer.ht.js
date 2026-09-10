import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/zh.js'

export default () =>
  uiLayout({
    title: '页脚',
    description: '站点的底部：几列链接，下面再来一行。',
    activeHref: '/zh/ui/footer',
    children: [
      p(
        '页脚是一个会自动适配列数的网格，外加一行可选的底部内容——不管上面有多少列，它总是占满整个宽度。',
      ),
      p(
        '它同时以 ',
        code('footer'),
        ' 和 ',
        code('siteFooter'),
        ' 两个名字导出，因为 ',
        code('footer'),
        ' 也是 javascript-to-html 的 ',
        code('<footer>'),
        ' 元素，把两者用同一个名字导入会是语法错误。',
      ),

      h2('基础页脚'),
      demo(`footer(
  footerColumn({ title: '文档' },
    '<a href="/zh/docs">快速开始</a>',
    '<a href="/zh/docs/routing">路由</a>',
    '<a href="/zh/docs/data">数据加载</a>',
  ),
  footerColumn({ title: '组件' },
    '<a href="/zh/ui">概览</a>',
    '<a href="/zh/ui/button">按钮</a>',
    '<a href="/zh/ui/card">卡片</a>',
  ),
  footerColumn({ title: '项目' },
    '<a href="https://github.com/paul-browne/sitelo">GitHub</a>',
    '<a href="https://www.npmjs.com/package/sitelo">npm</a>',
  ),
)`, { align: 'stretch' }),

      h2('带底部一行'),
      p(
        code('footerBottom()'),
        ' 会横跨所有列，所以无论上面的网格怎么排，它始终是一整行。',
      ),
      demo(`footer(
  footerColumn({ title: '文档' }, '<a href="/zh/docs">指南</a>', '<a href="/zh/ui">组件</a>'),
  footerColumn({ title: '示例' }, '<a href="/zh/examples">全部示例</a>'),
  footerBottom(
    text({ variant: 'caption' }, '© 2026 Paul Browne · MIT'),
    stack({ direction: 'row', gap: 'sm' },
      chip({ size: 'sm', color: 'neutral' }, 'v2.7'),
      chip({ size: 'sm', color: 'success', dot: true }, '构建通过'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('品牌那一列'),
      p(
        '一列不一定非得是链接。凡是直接作为 ',
        code('footer()'),
        ' 子元素而不是放进某一列的东西，都会在网格里占据自己的一格。',
      ),
      demo(`footer(
  div(
    stack({ gap: 'sm' },
      text({ variant: 'h5', as: 'div' }, 'sitelo'),
      text({ variant: 'small', tone: 'muted' }, '由 Vite 驱动的零配置静态站点生成。'),
    ),
  ),
  footerColumn({ title: '文档' }, '<a href="/zh/docs">指南</a>', '<a href="/zh/ui">组件</a>'),
  footerColumn({ title: '项目' }, '<a href="#">GitHub</a>', '<a href="#">npm</a>'),
)`, { align: 'stretch' }),

      h2('固定列数'),
      p(
        '默认各列会自动适配。想要特定的排布时，',
        code('columns'),
        ' 接受任意 ',
        code('grid-template-columns'),
        ' 值——比如一列宽的品牌区加两列窄的链接。',
      ),
      demo(`footer({ columns: '2fr 1fr 1fr' },
  div(text({ variant: 'small', tone: 'muted' }, '更宽的第一列，放品牌和一句关于它的话。')),
  footerColumn({ title: '文档' }, '<a href="/zh/docs">指南</a>'),
  footerColumn({ title: '更多' }, '<a href="/zh/examples">示例</a>'),
)`, { align: 'stretch' }),

      h2('只要底部一行'),
      demo(`footer(
  footerBottom(text({ variant: 'caption' }, '© 2026 · 由 sitelo 构建')),
)`, { align: 'stretch' }),

      h2('属性'),
      p(code('footer()'), '：'),
      propsTable([
        ['columns', 'string', '', '一个 grid-template-columns 值。省略时自动适配。'],
        ['as', 'string', "'footer'", '渲染成哪个元素。'],
      ]),
      propsTable([
        ['footerColumn', 'title', '', '带标题的一列；子元素会成为一串链接。'],
        ['footerBottom', '', '', '列下方那一整行。'],
      ], { headers: ['部件', '属性', '默认值', '说明'] }),
    ],
  })
