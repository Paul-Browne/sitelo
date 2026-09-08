import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/zh.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: '列表',
    description: '一行行内容，两侧可各放一样东西——大多数设置页和信息流都是这个形状。',
    activeHref: '/zh/ui/list',
    extraHead: uiHead(),
    children: [
      p(
        '列表是由若干行组成的带边框区域。每一行有标题、可选的描述，以及行首和行尾两个位置，用来放头像、图标或控件。',
      ),

      h2('基础列表'),
      demo(`list(
  listItem({ title: '路由', description: 'src/about.ht.js 变成 /about' }),
  listItem({ title: '数据加载', description: 'data() 只在构建时跑一次' }),
  listItem({ title: '资源', description: '只有 HTML 引用到的东西才会被打包' }),
)`, { align: 'stretch' }),

      h2('行首与行尾'),
      demo(`list(
  listItem({
    start: avatar({ name: 'Ada Lovelace', size: 'sm' }),
    title: 'Ada Lovelace',
    description: '向 main 推送了 3 个提交',
    end: chip({ size: 'sm', color: 'neutral' }, '2 小时前'),
  }),
  listItem({
    start: avatar({ name: 'Grace Hopper', size: 'sm', color: 'success' }),
    title: 'Grace Hopper',
    description: '发起了一个 pull request',
    end: chip({ size: 'sm', color: 'success', dot: true }, '开放中'),
  }),
)`, { align: 'stretch' }),

      h2('可点击跳转的行'),
      p(
        '带 ',
        code('href'),
        ' 的行会把锚点放进 ',
        code('<li>'),
        ' 里面，而不是套在外面，这样列表仍然是合法的列表。别再往这种行里塞按钮——可交互内容不能嵌在链接里。',
      ),
      demo(`list(
  listItem({ title: '快速开始', description: '安装并写出第一个页面', href: '/zh/docs' }),
  listItem({ title: '路由', description: '基于文件，支持动态片段', href: '/zh/docs/routing' }),
  listItem({ title: '部署', description: 'Netlify、Vercel、Pages、Amplify', href: '/zh/docs/deployment' }),
)`, { align: 'stretch' }),

      h2('带控件的行'),
      p(
        '当一行里放着开关或按钮时，就别再给整行加链接，让控件成为那个可交互的部分。',
      ),
      demo(`list(
  listItem({
    title: 'Pagefind 搜索',
    description: '构建结束时索引每一个页面',
    end: toggle({ 'aria-label': 'Pagefind 搜索', checked: true }),
  }),
  listItem({
    title: '图片优化',
    description: '缩放并转换图片格式。需要 sharp。',
    end: toggle({ 'aria-label': '图片优化', checked: true }),
  }),
  listItem({
    title: '服务端区块',
    description: '在请求时渲染被标记的区域',
    end: toggle({ 'aria-label': '服务端区块' }),
  }),
)`, { align: 'stretch' }),

      h2('无外框'),
      p(
        code('plain'),
        ' 会去掉边框和底色，适合放进本身已经有一层面的卡片或侧栏里的列表。',
      ),
      demo(`card(
  cardHeader({ title: '最近的构建' }),
  cardBody(
    list({ plain: true },
      listItem({ title: '94a837a', description: 'main · 4 分钟前', end: chip({ size: 'sm', color: 'success', dot: true }, '通过') }),
      listItem({ title: 'dcfaaae', description: 'main · 2 小时前', end: chip({ size: 'sm', color: 'success', dot: true }, '通过') }),
      listItem({ title: 'a46a461', description: 'main · 昨天', end: chip({ size: 'sm', color: 'danger', dot: true }, '失败') }),
    ),
  ),
)`, { align: 'stretch' }),

      h2('自由排布的行'),
      p(
        '不给 ',
        code('title'),
        ' 和 ',
        code('description'),
        ' 时，一行会原样渲染你给它的子元素——用于两行式结构覆盖不了的排版。',
      ),
      demo(`list(
  listItem(
    stack({ direction: 'row', gap: 'md', align: 'center', justify: 'space-between', style: 'width: 100%' },
      stack({ gap: 'none' },
        text({ variant: 'small' }, '自定义行'),
        text({ variant: 'caption', tone: 'muted' }, '里面爱放什么放什么'),
      ),
      button({ size: 'sm', variant: 'soft' }, '操作'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('由数据生成'),
      demo(`return (() => {
  const locales = [
    { code: 'en', name: 'English', pages: 24 },
    { code: 'es', name: 'Español', pages: 24 },
    { code: 'zh', name: '简体中文', pages: 24 },
  ]

  return list(
    locales.map((locale) =>
      listItem({
        start: avatar({ name: locale.code, size: 'sm', color: 'neutral', square: true }),
        title: locale.name,
        description: locale.pages + ' 个页面',
        end: chip({ size: 'sm', color: 'neutral' }, locale.code),
      }),
    ),
  )
})()`, { align: 'stretch' }),

      h2('属性'),
      p(code('list()'), '：'),
      propsTable([
        ['plain', 'boolean', 'false', '去掉边框和底色。'],
        ['as', 'string', "'ul'", '渲染成哪个元素，比如 ol。'],
      ]),
      p(code('listItem()'), '：'),
      propsTable([
        ['title', 'Child', '', '这一行的主文字。'],
        ['description', 'Child', '', '弱化的第二行。'],
        ['start', 'Child', '', '行首位置——头像或图标。'],
        ['end', 'Child', '', '行尾位置——标签片、控件或时间戳。'],
        ['href', 'string', '', '把这行变成链接，锚点放在 li 里面。'],
        ['interactive', 'boolean', 'false', '有悬停高亮，但不变成链接。'],
      ]),
    ],
  })
