import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/zh.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: '应用栏',
    description: '站点顶部的那一条：一边是品牌，另一边是导航和操作。',
    activeHref: '/zh/ui/app-bar',
    extraHead: uiHead(),
    children: [
      p(
        '应用栏就是一个内含一行内容的 ',
        code('<header>'),
        '。各个部件是分开的，方便你自行排布：',
        code('appBarNav()'),
        ' 放链接，',
        code('appBarSpacer()'),
        ' 把后面的内容顶到另一端，',
        code('appBarActions()'),
        ' 放末尾的按钮。',
      ),

      h2('基础应用栏'),
      demo(`appBar({ brand: 'sitelo' },
  appBarSpacer(),
  appBarActions(
    button({ size: 'sm', variant: 'soft' }, '登录'),
  ),
)`, { align: 'stretch' }),

      h2('带导航'),
      p(
        code('navLink()'),
        ' 是应用栏里的链接样式；',
        code('current'),
        ' 除了配色，还会用 ',
        code('aria-current'),
        ' 标出当前页面。',
      ),
      demo(`appBar({ brand: 'sitelo' },
  appBarNav(
    navLink({ href: '#docs', current: true }, '文档'),
    navLink({ href: '#ui' }, 'UI'),
    navLink({ href: '#examples' }, '示例'),
  ),
  appBarSpacer(),
  appBarActions(
    button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'GitHub'),
    button({ size: 'sm' }, '开始使用'),
  ),
)`, { align: 'stretch' }),

      h2('带标识的品牌'),
      p(
        '品牌位可以放任意标记，默认链接到 ',
        code('/'),
        '，除非 ',
        code('href'),
        ' 另有指定。',
      ),
      demo(`appBar({
  href: '#home',
  brand: stack({ direction: 'row', gap: 'sm', inline: true, align: 'center' },
    avatar({ name: 'S', size: 'sm', square: true, color: 'primary' }),
    'sitelo',
  ),
},
  appBarSpacer(),
  appBarActions(chip({ size: 'sm', color: 'neutral' }, 'v2.6.3')),
)`, { align: 'stretch' }),

      h2('吸顶与毛玻璃'),
      p(
        code('sticky'),
        ' 把栏钉在滚动容器顶部；',
        code('blur'),
        ' 让它半透明，内容从下面穿过。这里两者都放在一个可滚动的方框里演示，而不是用在页面本身。',
      ),
      demo(`div({ style: 'height: 12rem; overflow: auto; border: 1px solid var(--su-border); border-radius: 0.6rem' },
  appBar({ brand: 'sitelo', sticky: true, blur: true },
    appBarSpacer(),
    appBarActions(chip({ size: 'sm', color: 'primary' }, 'sticky')),
  ),
  container({ size: 'sm', style: 'padding-block: 1rem' },
    stack({ gap: 'md' },
      ...Array.from({ length: 6 }, (unused, index) =>
        text({ variant: 'small', tone: 'muted' }, '滚动看看——第 ' + (index + 1) + ' 段。'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('小屏配抽屉'),
      p(
        '常见做法：桌面端把链接放在栏里，手机端用一个按钮打开 ',
        code('drawer()'),
        '。抽屉是 popover，所以按钮不需要脚本。',
      ),
      demo(`fragment(
  appBar({ brand: 'sitelo' },
    appBarSpacer(),
    appBarActions(
      themeToggle(),
      iconButton({
        label: '打开导航',
        variant: 'ghost',
        color: 'neutral',
        popovertarget: 'app-bar-drawer',
        icon: icon('menu'),
      }),
    ),
  ),
  drawer({ id: 'app-bar-drawer', title: '导航' },
    navLink({ href: '#docs' }, '文档'),
    navLink({ href: '#ui' }, 'UI'),
    navLink({ href: '#examples' }, '示例'),
  ),
)`, { align: 'stretch' }),

      h2('属性'),
      p(code('appBar()'), '：'),
      propsTable([
        ['brand', 'Child', '', '开头那个品牌链接的内容。'],
        ['href', 'string', "'/'", '品牌链接指向哪里。'],
        ['sticky', 'boolean', 'false', '滚动时把栏钉在顶部。'],
        ['blur', 'boolean', 'false', '半透明背景，并对其后内容做模糊。'],
        ['as', 'string', "'header'", '渲染成哪个元素。'],
      ]),
      p('各个部件：'),
      propsTable([
        ['appBarNav', '', '', '承载链接的 nav 元素。'],
        ['appBarSpacer', '', '', '弹性空隙；它之后的一切都会靠到另一端。'],
        ['appBarActions', '', '', '末尾的按钮组。'],
        ['navLink', 'href, current, color', '', '应用栏样式的链接；current 标出当前页面。'],
      ], { headers: ['部件', '属性', '默认值', '说明'] }),
    ],
  })
