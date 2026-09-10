import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/zh.js'

export default () =>
  uiLayout({
    title: '网格',
    description: '能塞下几列就排几列的自适应网格——不用断点，也不用媒体查询。',
    activeHref: '/zh/ui/grid',
    children: [
      p(
        '不给 ',
        code('columns'),
        ' 时，网格会在空间允许的范围内尽量多排几条不小于 ',
        code('min'),
        ' 的轨道，剩下的宽度由它们平分。卡片列表要的正是这种行为，而且完全不需要断点：把这个页面拉大缩小，下面的示例自己就会重排。',
      ),

      h2('自动适配'),
      p('默认行为。每条轨道至少 16rem 宽。'),
      demo(`grid(
  ...['路由', '数据加载', '资源', '图片', '区块', '搜索'].map((name) =>
    card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, name))),
  ),
)`, { align: 'stretch' }),

      h2('轨道宽度'),
      p(
        code('min'),
        ' 决定一条轨道能窄到什么程度，再窄网格就会减少列数。设得越小，列数越多。',
      ),
      demo(`grid({ min: '9rem' },
  ...['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'].map((name) =>
    card({ variant: 'flat' }, cardBody(text({ variant: 'small', align: 'center' }, name))),
  ),
)`, { align: 'stretch' }),

      h2('固定列数'),
      p(
        '当列数不该随视口变化时，直接传一个数字。每条轨道均分宽度。',
      ),
      demo(`grid({ columns: 3 },
  ...['一', '二', '三'].map((name) =>
    card({ variant: 'flat' }, cardBody(text({ variant: 'small', align: 'center' }, name))),
  ),
)`, { align: 'stretch' }),

      h2('自定义模板'),
      p(
        '传字符串时会原样交给 ',
        code('grid-template-columns'),
        '，可以做侧栏加正文的划分，或者任何 CSS grid 表达得出来的排布。',
      ),
      demo(`grid({ columns: '12rem 1fr', gap: 'lg' },
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, '侧栏'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, '正文，占据这一行剩下的部分。'))),
)`, { align: 'stretch' }),

      h2('间距与对齐'),
      demo(`grid({ min: '10rem', gap: 'xl', align: 'center' },
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, '短的'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, '一张更高的卡片，写了两行文字，用来展示 align 会怎样影响旁边那些更矮的卡片。'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, '短的'))),
)`, { align: 'stretch' }),

      h2('属性'),
      propsTable([
        ['columns', 'number | string', '', '固定轨道数量，或原始的 grid-template-columns 值。省略则自动适配。'],
        ['min', 'string', "'16rem'", '自动适配时轨道的最小宽度。'],
        ['gap', 'Space', "'md'", '轨道之间和行之间的间距。'],
        ['align', 'string', "'stretch'", '任意 align-items 值。'],
        ['as', 'string', "'div'", '渲染成哪个元素。'],
      ]),
      p(
        '即使 ',
        code('min'),
        ' 大于可用空间，轨道也绝不会宽过网格本身——所以 16rem 的最小值不会在 320px 的手机上撑出横向滚动条。',
      ),
    ],
  })
