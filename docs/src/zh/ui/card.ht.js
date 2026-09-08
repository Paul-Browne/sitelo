import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/zh.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: '卡片',
    description: '承载成组内容的一块面，头部、主体、页脚和媒体区都知道怎么彼此相处。',
    activeHref: '/zh/ui/card',
    extraHead: uiHead(),
    children: [
      p(
        '卡片把相关内容归拢到自己的一块面上。它的各部分——',
        code('cardHeader()'),
        '、',
        code('cardMedia()'),
        '、',
        code('cardBody()'),
        '、',
        code('cardFooter()'),
        '——是各自独立的函数而不是属性，所以你只用得着的那几个，并按设计想要的顺序摆放。',
      ),

      h2('基础卡片'),
      demo(`card(
  cardHeader({ title: '基于文件的路由', subtitle: 'src/about.ht.js → /about' }),
  cardBody(text({ variant: 'small', tone: 'muted' }, '目录变成路径，方括号变成参数。没有路由器要配置。')),
)`, { align: 'stretch' }),

      h2('变体'),
      p(
        'outlined 是默认值。elevated 用阴影换掉边框，flat 则两者都不要，改为给面上色。',
      ),
      demo(`grid({ min: '13rem' },
  card({ variant: 'outlined' }, cardBody(text({ variant: 'small' }, 'Outlined'))),
  card({ variant: 'elevated' }, cardBody(text({ variant: 'small' }, 'Elevated'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Flat'))),
)`, { align: 'stretch' }),

      h2('带页脚'),
      p(
        code('divided'),
        ' 会在页脚上方加一条细线。页脚会被推到底部，所以并排的卡片即使上方文字长短不一，操作也能对齐。',
      ),
      demo(`grid({ min: '14rem' },
  card(
    cardHeader({ title: '基础站点' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, '一个最小项目，外加部署配置。')),
    cardFooter({ divided: true }, button({ size: 'sm', variant: 'soft' }, '打开')),
  ),
  card(
    cardHeader({ title: 'Markdown 博客' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, '一个装着 .md 文件的目录，渲染成静态页面，带 RSS 订阅，完全没有客户端 JavaScript。')),
    cardFooter({ divided: true }, button({ size: 'sm', variant: 'soft' }, '打开')),
  ),
)`, { align: 'stretch' }),

      h2('媒体'),
      p(
        code('cardMedia()'),
        ' 以固定宽高比填满卡片顶部，所以不管源图多大，一排卡片都能保持整齐。',
      ),
      demo(`grid({ min: '13rem' },
  card(
    cardMedia({ src: '/logo.svg', alt: '', style: 'background: var(--su-surface-2); object-fit: contain; padding: 1rem' }),
    cardBody(text({ variant: 'small' }, '默认 16 / 9')),
  ),
  card(
    cardMedia({ src: '/logo.svg', alt: '', ratio: '4 / 3', style: 'background: var(--su-surface-2); object-fit: contain; padding: 1rem' }),
    cardBody(text({ variant: 'small' }, 'ratio: 4 / 3')),
  ),
)`, { align: 'stretch' }),

      h2('整张卡片作为链接'),
      p(
        '给卡片一个 ',
        code('href'),
        '，整块面就成了一个链接，并附带悬停上浮效果。这种形态下别在卡片里再放按钮或其他链接——可交互内容不能嵌在链接里面。改用普通卡片加一个页脚按钮。',
      ),
      demo(`grid({ min: '14rem' },
  card({ href: '/zh/docs/routing' },
    cardHeader({ title: '路由', subtitle: '阅读指南' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, '动态路由、通配路由和路由分组。')),
  ),
  card({ href: '/zh/docs/data' },
    cardHeader({ title: '数据加载', subtitle: '阅读指南' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'data() 在构建时运行，并带 fetch 缓存。')),
  ),
)`, { align: 'stretch' }),

      h2('内边距'),
      p(
        '一个属性就能一次设定卡片所有部分的内边距。',
      ),
      demo(`stack({ gap: 'md' },
  card({ padding: 'sm' }, cardBody(text({ variant: 'small' }, 'padding: sm'))),
  card({ padding: 'xl' }, cardBody(text({ variant: 'small' }, 'padding: xl'))),
)`, { align: 'stretch' }),

      h2('自由内容'),
      p(
        '这些部件是方便，而不是硬性要求——卡片接受任意子元素，',
        code('cardHeader()'),
        ' 也能在标题旁接受自己的子元素，比如右侧放一个头像或菜单按钮。',
      ),
      demo(`card(
  cardHeader(
    { title: 'Paul Browne', subtitle: '4 分钟前部署' },
    avatar({ name: 'Paul Browne', size: 'sm' }),
  ),
  cardBody(
    stack({ direction: 'row', gap: 'sm', wrap: true },
      chip({ color: 'success', dot: true }, '构建通过'),
      chip({ color: 'neutral' }, '12 个页面'),
      chip({ color: 'neutral' }, '4.1 kB'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('属性'),
      p(code('card()'), '：'),
      propsTable([
        ['variant', "'outlined' | 'elevated' | 'flat'", "'outlined'", '这块面如何与页面区分开。'],
        ['href', 'string', '', '把整张卡片渲染成链接。'],
        ['padding', 'Space', "'lg'", '卡片各部分统一使用的内边距。'],
      ]),
      p('各部件：'),
      propsTable([
        ['cardHeader', 'title, subtitle', '', '标题和副标题，以及并排放置的任意子元素。'],
        ['cardTitle', 'as', "'h3'", '单独的标题，用于手写头部时。'],
        ['cardSubtitle', '', '', '标题下方那行弱化文字。'],
        ['cardMedia', 'src, alt, ratio', "'16 / 9'", '固定宽高比的封面图。'],
        ['cardBody', '', '', '主内容区域。'],
        ['cardFooter', 'divided', 'false', '底部的操作行；divided 会在其上方加细线。'],
      ], { headers: ['部件', '属性', '默认值', '说明'] }),
    ],
  })
