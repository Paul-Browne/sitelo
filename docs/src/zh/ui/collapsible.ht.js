import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/zh.js'

export default () =>
  uiLayout({
    title: '折叠面板',
    description: '单独一个「展开更多」，没有手风琴那样的边框和分组。',
    activeHref: '/zh/ui/collapsible',
    children: [
      p(
        '折叠面板就是单独一个 ',
        code('<details>'),
        '——和手风琴用的是同一个元素，只是没有那些外包装。页面中间有一条可选的细节时用它；成组出现时用 ',
        code('accordion()'),
        '。',
      ),
      p(
        '它不需要脚本，而且因为内容始终留在文档里，浏览器自带的页内查找和搜索引擎都能找到它。',
      ),

      h2('基础折叠面板'),
      demo(`collapsible({ trigger: '查看生成的配置' },
  text({ variant: 'small' }, '当你不带自己的配置文件运行构建时，sitelo 写下的全部内容。'),
)`, { align: 'stretch' }),

      h2('默认展开'),
      demo(`collapsible({ trigger: '为什么会有这个', open: true },
  text({ variant: 'small' }, '因为把解释藏在一次点击后面的页面，是没人会读的页面。'),
)`, { align: 'stretch' }),

      h2('富内容'),
      demo(`collapsible({ trigger: '查看完整输出' },
  stack({ gap: 'sm' },
    code('dist/index.html'),
    code('dist/404.html'),
    code('dist/sitemap.xml'),
  ),
)`, { align: 'stretch' }),

      h2('放进别的东西里'),
      p('折叠面板放在卡片、提示或表格单元格里都很自在。'),
      demo(`stack({ gap: 'md' },
  card(
    cardHeader({ title: '构建失败', subtitle: '2 条断链' }),
    cardBody(
      collapsible({ trigger: '查看出问题的链接' },
        list({ plain: true },
          listItem({ title: '/docs/old-routing', description: '来自 /docs 的链接' }),
          listItem({ title: '/blog/draft', description: '来自 /blog 的链接' }),
        ),
      ),
    ),
  ),
  alert({ color: 'warning', title: '页面偏慢' },
    stack({ gap: 'sm' },
      text({ variant: 'small' }, '有一个页面渲染用了超过 500 毫秒。'),
      collapsible({ trigger: '查看耗时' },
        text({ variant: 'small' }, '/examples/wordpress — 512 毫秒'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('触发区'),
      p(
        '只放文字和图标。',
        code('<summary>'),
        ' 本身已经是可交互的，在里面再塞按钮或链接，就是在只有一个动作的地方套了两个控件——',
        code('menu()'),
        ' 遵循的也是同一条规则。',
      ),

      h2('折叠面板还是手风琴？'),
      p(
        '单独一处展开用 ',
        code('collapsible()'),
        '。成组、带边框、可选一次只开一个，用 ',
        code('accordion()'),
        '。',
      ),

      h2('属性'),
      propsTable([
        ['trigger', 'Child', '', '摘要行的内容。只放文字和图标。'],
        ['open', 'boolean', 'false', '是否一开始就展开。'],
      ]),
    ],
  })
