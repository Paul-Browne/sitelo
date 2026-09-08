import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/zh.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: '面包屑',
    description: '一条以当前页面收尾的层级路径。',
    activeHref: '/zh/ui/breadcrumbs',
    extraHead: uiHead(),
    children: [
      p(
        '面包屑说明一个页面所处的位置。最后一项就是当前页面：它以纯文本呈现，并标上 ',
        code('aria-current="page"'),
        '，因为指向你已经在看的页面的链接只是噪音。',
      ),

      h2('基础面包屑'),
      demo(`breadcrumbs({
  items: [
    { label: '首页', href: '/' },
    { label: '文档', href: '/docs' },
    { label: '路由' },
  ],
})`, { align: 'stretch' }),

      h2('分隔符'),
      p('任意字符串或标记。无论用哪个，分隔符对屏幕阅读器都是隐藏的。'),
      demo(`stack({ gap: 'md' },
  breadcrumbs({
    separator: '/',
    items: [{ label: '首页', href: '/' }, { label: 'UI', href: '/ui' }, { label: '面包屑' }],
  }),
  breadcrumbs({
    separator: '›',
    items: [{ label: '首页', href: '/' }, { label: 'UI', href: '/ui' }, { label: '面包屑' }],
  }),
  breadcrumbs({
    separator: '·',
    items: [{ label: '首页', href: '/' }, { label: 'UI', href: '/ui' }, { label: '面包屑' }],
  }),
)`, { align: 'stretch' }),

      h2('纯字符串'),
      p('没有 href 的项就只是文字，出现在哪里都一样——不只是最后一项。'),
      demo(`breadcrumbs({
  items: ['首页', '归档', '2026', '三月'],
})`, { align: 'stretch' }),

      h2('由路径生成'),
      p(
        '在静态站点里，这条路径通常是从路由推导出来的，而不是手写的。',
      ),
      demo(`return (() => {
  const path = '/docs/guides/routing'
  const segments = path.split('/').filter(Boolean)

  return breadcrumbs({
    items: [
      { label: '首页', href: '/' },
      ...segments.map((segment, index) => ({
        label: segment.replace(/-/g, ' '),
        href: index === segments.length - 1 ? undefined : '/' + segments.slice(0, index + 1).join('/'),
      })),
    ],
  })
})()`, { align: 'stretch' }),

      h2('给 nav 命名'),
      p(
        '整块是一个带无障碍名称的 ',
        code('<nav>'),
        '，屏幕阅读器可以直接跳到这里。当一个页面有不止一个导航地标时，用 ',
        code('label'),
        ' 改掉这个名称。',
      ),
      demo(`breadcrumbs({
  label: '文档面包屑',
  items: [{ label: '文档', href: '/docs' }, { label: '组件' }],
})`, { align: 'stretch' }),

      h2('属性'),
      propsTable([
        ['items', 'Array', '[]', '字符串，或 { label, href } 对象。最后一项是当前页面。'],
        ['separator', 'Child', "'/'", '画在各项之间，对屏幕阅读器隐藏。'],
        ['label', 'string', "'Breadcrumb'", 'nav 地标的无障碍名称。'],
      ]),
    ],
  })
