import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/zh.js'

export default () =>
  uiLayout({
    title: '首屏区块',
    description: '落地页最上面那块：一句标题、一句说明，以及接下来该做什么。',
    activeHref: '/zh/ui/hero',
    children: [
      p(
        '首屏区块是营销页或文档首页上的第一样东西。它渲染出一个内含 ',
        code('<h1>'),
        ' 的 ',
        code('<section>'),
        '——所以它就是页面的标题，而不是一条碰巧很大的装饰横幅。',
      ),

      h2('基础首屏区块'),
      demo(`hero({
  level: 2,
  title: '静态站点，不必带上框架',
  description: '写一些返回 HTML 的函数，就能得到一个完整站点。',
},
  button({ size: 'lg' }, '开始使用'),
  button({ size: 'lg', variant: 'outline', color: 'neutral' }, '阅读文档'),
)`, { align: 'stretch' }),

      h2('带引题'),
      p('标题上面的一小行——版本号、分类，或者一条公告。'),
      demo(`hero({
  level: 2,
  eyebrow: 'sitelo 2.7',
  title: '现在带上了组件库',
  description: '七十个组件、零运行时，外加一个可选脚本。',
},
  button({ size: 'lg', href: '/zh/ui' }, '浏览组件'),
)`, { align: 'stretch' }),

      h2('左对齐'),
      demo(`hero({
  level: 2,
  align: 'start',
  eyebrow: '开源',
  title: '一切都摆在明面上',
  description: 'MIT 许可，小到一个下午就能读完。',
},
  button({ href: 'https://github.com/paul-browne/sitelo' }, '在 GitHub 上查看'),
)`, { align: 'stretch' }),

      h2('带媒体'),
      p(
        '传入 ',
        code('media'),
        ' 后，空间够时会切成两栏，屏幕窄了又叠回一栏。它和 ',
        code('mockup()'),
        ' 天生是一对。',
      ),
      demo(`hero({
  level: 2,
  align: 'start',
  title: '看它跑起来',
  description: '页面送到浏览器时，已经是静态 HTML 了。',
  media: mockup({ variant: 'browser', url: 'example.com' },
    div({ style: 'padding: 1.5rem; background: var(--su-surface-2)' },
      text({ variant: 'h5', as: 'div' }, '你好，世界'),
      text({ variant: 'small', tone: 'muted' }, '在构建时渲染。'),
    ),
  ),
},
  button('开始使用'),
)`, { align: 'stretch' }),

      h2('放进容器里'),
      p(
        '首屏区块自己不限制宽度——把它放进 ',
        code('container()'),
        '，它才会和页面上其余内容对齐。',
      ),
      demo(`container({ size: 'md', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
  hero({
    level: 2,
    title: '被容器包着',
    description: '容器定宽度，首屏区块定节奏。',
  }),
)`, { align: 'stretch' }),

      h2('标题层级'),
      p(
        '标题默认就是页面的 ',
        code('<h1>'),
        '，落地页正该如此。用在页面中段的首屏区块并不是页面标题，所以要用 ',
        code('level'),
        ' 把它降级——本页每个示例都这么做了，因为页面本身已经有一个 h1。',
      ),

      h2('只要一个标题'),
      p('每个部分都是可选的，空的部分不会被渲染出来。'),
      demo(`hero({ level: 2, title: '文档' })`, { align: 'stretch' }),

      h2('属性'),
      propsTable([
        ['eyebrow', 'Child', '', '标题上方的小号大写行。'],
        ['title', 'Child', '', '渲染成页面的 h1。'],
        ['description', 'Child', '', '下面那句说明。'],
        ['media', 'Child', '', '宽屏时在文字旁边，窄屏时在文字上方。'],
        ['align', "'center' | 'start'", "'center'", '没有媒体时的文字对齐方式。'],
        ['level', 'number', '1', '标题的层级。用在页面中段时请调低。'],
        ['as', 'string', "'section'", '渲染成哪个元素。'],
      ]),
      p('子元素会成为描述下方的那一行操作。'),
    ],
  })
