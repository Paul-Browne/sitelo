import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/zh.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: '堆叠',
    description: '用间距令牌当作间隙的 flex 行或列——多数页面就是由这块布局基元搭起来的。',
    activeHref: '/zh/ui/stack',
    extraHead: uiHead(),
    children: [
      p(
        '堆叠负责在东西之间留出空隙。它是一个只干一件事的 flex 容器，也是「这几个怎么隔开」这类问题的通用答案——默认竖排，加上 ',
        code("direction: 'row'"),
        ' 就变成横排。',
      ),
      p(
        '间隙取自间距尺度，所以整页的节奏保持一致，没人需要去挑像素值。',
      ),

      h2('基础堆叠'),
      demo(`stack({ gap: 'md' },
  card(cardBody('第一个')),
  card(cardBody('第二个')),
  card(cardBody('第三个')),
)`, { align: 'stretch' }),

      h2('方向'),
      demo(`stack({ direction: 'row', gap: 'md' },
  button('一'),
  button({ variant: 'outline' }, '二'),
  button({ variant: 'outline' }, '三'),
)`),

      h2('间隙'),
      p(
        '一个令牌名（',
        code("'xs'"),
        ' … ',
        code("'3xl'"),
        '）、若干个间距单位，或者一个原始 CSS 长度。',
      ),
      demo(`stack({ gap: 'lg' },
  stack({ direction: 'row', gap: 'xs' }, chip('xs'), chip('xs'), chip('xs')),
  stack({ direction: 'row', gap: 'md' }, chip('md'), chip('md'), chip('md')),
  stack({ direction: 'row', gap: 6 }, chip('6 个单位'), chip('6 个单位')),
  stack({ direction: 'row', gap: '3rem' }, chip('3rem'), chip('3rem')),
)`, { align: 'stretch' }),

      h2('对齐'),
      p(
        code('align'),
        ' 和 ',
        code('justify'),
        ' 直接接受 flexbox 的原始取值，所以 CSS 认得的写法都能用。',
      ),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm', justify: 'space-between', style: 'background: var(--su-surface-2); padding: 0.6rem; border-radius: 0.5rem' },
    chip('起始'),
    chip('末尾'),
  ),
  stack({ direction: 'row', gap: 'sm', justify: 'center', align: 'center', style: 'background: var(--su-surface-2); padding: 0.6rem; border-radius: 0.5rem' },
    button({ size: 'sm' }, '居中'),
    chip('并且对齐'),
  ),
)`, { align: 'stretch' }),

      h2('换行'),
      p(
        '一排可能放不下的标签片或按钮需要 ',
        code('wrap'),
        '——不加它，它们会被挤扁，而不是换到下一行。',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  ...['routing', 'data', 'islands', 'images', 'pagefind', 'lighthouse', 'sitemap', 'rss'].map(
    (name) => chip({ color: 'neutral' }, name),
  ),
)`, { align: 'stretch' }),

      h2('行内'),
      p(
        code('inline'),
        ' 会把堆叠变成 ',
        code('inline-flex'),
        '，于是它落在一行文字之中，而不是占满整行宽度。',
      ),
      demo(`text(
  '用 ',
  stack({ direction: 'row', gap: 'xs', inline: true, align: 'center' },
    chip({ color: 'primary', size: 'sm' }, 'sitelo'),
    chip({ color: 'neutral', size: 'sm' }, 'vite'),
  ),
  ' 搭起来，别的什么都没用。',
)`, { align: 'stretch' }),

      h2('渲染为其他元素'),
      demo(`stack({ as: 'nav', direction: 'row', gap: 'sm' },
  navLink({ href: '/zh/docs' }, '文档'),
  navLink({ href: '/zh/ui', current: true }, 'UI'),
  navLink({ href: '/zh/examples' }, '示例'),
)`),

      h2('属性'),
      propsTable([
        ['direction', "'row' | 'column'", "'column'", '主轴方向。'],
        ['gap', 'Space', "'md'", '子元素之间的间距。'],
        ['align', 'string', "'stretch'", '任意 align-items 值。'],
        ['justify', 'string', "'flex-start'", '任意 justify-content 值。'],
        ['wrap', 'boolean | string', 'false', 'true 表示换行；传字符串则原样当作 flex-wrap。'],
        ['inline', 'boolean', 'false', '渲染成 inline-flex。'],
        ['as', 'string', "'div'", '渲染成哪个元素，比如 nav 或 ul。'],
      ]),
    ],
  })
