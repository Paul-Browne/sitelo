import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/zh.js'

export default () =>
  uiLayout({
    title: '抽屉',
    description: '从边缘滑入的面板——和模态框一样的 popover 机制，只是形状不同。',
    activeHref: '/zh/ui/drawer',
    children: [
      p(
        '抽屉是贴在某一侧、占满高度的面板。和 ',
        code('modal()'),
        ' 一样，它是一个 ',
        code('popover'),
        '：带有对应 ',
        code('popovertarget'),
        ' 的按钮打开它，遮罩、点击外部关闭和 Esc 都由浏览器负责。',
      ),
      p(
        '在静态站点上，它最常见的活儿是手机上的导航菜单。',
      ),

      h2('基础抽屉'),
      demo(`fragment(
  button({ popovertarget: 'drawer-basic' }, '打开抽屉'),
  drawer({ id: 'drawer-basic', title: '设置' },
    stack({ gap: 'md' },
      toggle({ label: 'Pagefind 搜索', checked: true }),
      toggle({ label: '图片优化', checked: true }),
      toggle({ label: '服务端区块' }),
    ),
  ),
)`),

      h2('方位'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm' },
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-start' }, '从起始侧'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-end' }, '从末尾侧'),
  ),
  drawer({ id: 'drawer-start', side: 'start', title: '起始侧' },
    text({ variant: 'small', tone: 'muted' }, '贴在起始边缘——在从左到右的语言里就是左边。'),
  ),
  drawer({ id: 'drawer-end', title: '末尾侧' },
    text({ variant: 'small', tone: 'muted' }, '默认值：贴在末尾边缘。'),
  ),
)`),

      h2('宽度'),
      p('任意 CSS 长度。它最多为视口的 90%，所以再宽的抽屉在手机上也放得下。'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm' },
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-narrow' }, '窄'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-wide' }, '宽'),
  ),
  drawer({ id: 'drawer-narrow', width: '14rem', title: '窄' },
    text({ variant: 'small', tone: 'muted' }, 'width: 14rem'),
  ),
  drawer({ id: 'drawer-wide', width: '34rem', title: '宽' },
    text({ variant: 'small', tone: 'muted' }, 'width: 34rem'),
  ),
)`),

      h2('作为导航菜单'),
      p('多数站点想要的那种做法：栏里放一个菜单按钮，链接放进抽屉。'),
      demo(`fragment(
  appBar({ brand: 'sitelo' },
    appBarSpacer(),
    appBarActions(
      iconButton({
        label: '打开导航',
        variant: 'ghost',
        color: 'neutral',
        popovertarget: 'drawer-nav',
        icon: icon('menu'),
      }),
    ),
  ),
  drawer({ id: 'drawer-nav', title: '导航' },
    navLink({ href: '#docs', current: true }, '文档'),
    navLink({ href: '#ui' }, 'UI'),
    navLink({ href: '#examples' }, '示例'),
    navLink({ href: '#about' }, '关于'),
    divider({ spacing: 'sm' }),
    button({ block: true }, '开始使用'),
  ),
)`, { align: 'stretch' }),

      h2('筛选面板'),
      demo(`fragment(
  button({ variant: 'soft', color: 'neutral', popovertarget: 'drawer-filters' }, '筛选'),
  drawer({ id: 'drawer-filters', title: '筛选', width: '22rem' },
    stack({ gap: 'lg' },
      choiceGroup({
        legend: '类型',
        name: 'drawer-type',
        value: 'guide',
        options: [
          { value: 'guide', label: '指南' },
          { value: 'example', label: '示例' },
          { value: 'all', label: '全部' },
        ],
      }),
      choiceGroup({
        legend: '标签',
        name: 'drawer-tags',
        type: 'checkbox',
        value: ['routing'],
        options: ['routing', 'data', 'islands'],
      }),
      stack({ direction: 'row', gap: 'sm' },
        button({ variant: 'ghost', color: 'neutral', popovertarget: 'drawer-filters', popovertargetaction: 'hide' }, '取消'),
        button('应用'),
      ),
    ),
  ),
)`),

      h2('属性'),
      propsTable([
        ['id', 'string', '', '必填。触发按钮的 popovertarget 所指向的目标。'],
        ['title', 'Child', '', '标题，同时也是对话框的无障碍名称。'],
        ['side', "'start' | 'end'", "'end'", '贴在哪一侧边缘。'],
        ['width', 'string', "'20rem'", '面板宽度，上限为 90vw。'],
        ['closable', 'boolean', 'true', '在头部显示 ×。'],
        ['closeLabel', 'string', "'Close'", '该按钮的无障碍名称。'],
      ]),
    ],
  })
