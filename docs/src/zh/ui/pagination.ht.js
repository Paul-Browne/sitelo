import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/zh.js'

export default () =>
  uiLayout({
    title: '分页',
    description: '围绕当前页开一扇窗的页码，而且是真正的链接。',
    activeHref: '/zh/ui/pagination',
    children: [
      p(
        code('href'),
        ' 是一个从页码到 URL 的函数，所以 ',
        code('/blog/2'),
        ' 和 ',
        code('/blog?page=2'),
        ' 这两种形式它都能应付。这样每一页都是真正的链接——可被抓取、可在新标签页打开、没有 JavaScript 也照样能用，静态站点要的正是这个。',
      ),

      h2('基础分页'),
      demo(`pagination({ page: 1, count: 5, href: (page) => '#page-' + page })`),

      h2('开窗'),
      p(
        '第一页和最后一页始终显示，再加上当前页周围的一扇窗，序号跳跃的地方会出现省略号。',
      ),
      demo(`stack({ gap: 'md' },
  pagination({ page: 1, count: 12, href: (page) => '#a-' + page }),
  pagination({ page: 6, count: 12, href: (page) => '#b-' + page }),
  pagination({ page: 12, count: 12, href: (page) => '#c-' + page }),
)`, { align: 'start' }),

      h2('相邻页数'),
      p(
        code('siblings'),
        ' 指当前页两侧各留几页。',
      ),
      demo(`stack({ gap: 'md' },
  pagination({ page: 6, count: 12, siblings: 0, href: (page) => '#d-' + page }),
  pagination({ page: 6, count: 12, siblings: 1, href: (page) => '#e-' + page }),
  pagination({ page: 6, count: 12, siblings: 3, href: (page) => '#f-' + page }),
)`, { align: 'start' }),

      h2('两端'),
      p(
        '在第一页时「上一页」被禁用，在最后一页时「下一页」被禁用，所以这个控件绝不会指向一个不存在的页面。',
      ),
      demo(`stack({ gap: 'md' },
  pagination({ page: 1, count: 3, href: (page) => '#g-' + page }),
  pagination({ page: 3, count: 3, href: (page) => '#h-' + page }),
  pagination({ page: 1, count: 1, href: (page) => '#i-' + page }),
)`, { align: 'start' }),

      h2('颜色与文字'),
      demo(`stack({ gap: 'md' },
  pagination({ page: 3, count: 6, color: 'neutral', href: (page) => '#j-' + page }),
  pagination({
    page: 3,
    count: 6,
    color: 'success',
    previousLabel: '更新',
    nextLabel: '更早',
    href: (page) => '#k-' + page,
  }),
)`, { align: 'start' }),

      h2('不给 href'),
      p(
        '不给 ',
        code('href'),
        ' 时，页码会渲染成带 ',
        code('data-su-page'),
        ' 的按钮——留给那种用自己的脚本原地筛选的页面。能用链接就用链接：JavaScript 被关掉时它们照样活着。',
      ),
      demo(`pagination({ page: 2, count: 4 })`),

      h2('用在博客里'),
      p(
        '静态站点上的常见做法：',
        code('generateStaticParams'),
        ' 为每一段生成一个页面，',
        code('href'),
        ' 指向它们。',
      ),
      demo(`return (() => {
  const posts = 47
  const perPage = 10
  const current = 3

  return stack({ gap: 'md', align: 'center' },
    text({ variant: 'small', tone: 'muted' },
      '显示第 ' + ((current - 1) * perPage + 1) + '–' + Math.min(current * perPage, posts) + ' 条，共 ' + posts + ' 条',
    ),
    pagination({
      page: current,
      count: Math.ceil(posts / perPage),
      href: (page) => page === 1 ? '#blog' : '#blog-' + page,
    }),
  )
})()`, { align: 'stretch' }),

      h2('属性'),
      propsTable([
        ['page', 'number', '1', '当前页。会被夹到有效范围内。'],
        ['count', 'number', '1', '一共有多少页。'],
        ['href', '(page: number) => string', '', '从页码到 URL。不给它，页码就渲染成按钮。'],
        ['siblings', 'number', '1', '当前页两侧各显示几页。'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", '当前页的颜色。'],
        ['label', 'string', "'Pagination'", 'nav 地标的无障碍名称。'],
        ['previousLabel', 'Child', "'‹'", '「上一页」控件的内容。'],
        ['nextLabel', 'Child', "'›'", '「下一页」控件的内容。'],
      ]),
    ],
  })
