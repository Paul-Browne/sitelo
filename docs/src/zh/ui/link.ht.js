import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/zh.js'

export default () =>
  uiLayout({
    title: '链接',
    description: '带样式的锚点，并附上外链该有的安全属性。',
    activeHref: '/zh/ui/link',
    children: [
      p(
        '链接就是带上本库下划线处理和配色的锚点。它以两个名字导出——',
        code('link'),
        ' 和 ',
        code('textLink'),
        '——因为 ',
        code('link'),
        ' 同时也是 javascript-to-html 的 ',
        code('<link>'),
        ' 元素，把两者用同一个名字导入会是语法错误。请用 ',
        code('textLink'),
        '，或者把整个库作为命名空间导入。',
      ),

      h2('基础链接'),
      demo(`text('先读一读', link({ href: '/zh/docs' }, '文档'), '再开始。')`, {
        align: 'stretch',
      }),

      h2('颜色'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  link({ href: '#', color: 'primary' }, 'Primary'),
  link({ href: '#', color: 'neutral' }, 'Neutral'),
  link({ href: '#', color: 'success' }, 'Success'),
  link({ href: '#', color: 'warning' }, 'Warning'),
  link({ href: '#', color: 'danger' }, 'Danger'),
)`),

      h2('低调样式'),
      p(
        '低调链接会继承周围的文字颜色，只在悬停时才显示下划线——适合那种每行都加下划线反而变成噪音的链接列表。',
      ),
      demo(`stack({ gap: 'xs' },
  link({ href: '/zh/docs/routing', subtle: true }, '路由'),
  link({ href: '/zh/docs/data', subtle: true }, '数据加载'),
  link({ href: '/zh/docs/assets', subtle: true }, '资源与样式'),
)`, { align: 'stretch' }),

      h2('外部链接'),
      p(
        code('external'),
        ' 会加上 ',
        code('target="_blank"'),
        ' 以及必须随之而来的 ',
        code('rel'),
        '。请在链接文字里说明它会开新标签页，或者加一段视觉上隐藏的说明——毫无预告地弹出新标签页会让人不知所措。',
      ),
      demo(`text(
  '这个库发布在 ',
  link({ href: 'https://www.npmjs.com/package/sitelo', external: true },
    'npm',
    visuallyHidden('（在新标签页中打开）'),
  ),
  ' 上。',
)`, { align: 'stretch' }),

      h2('在段落里'),
      demo(`text({ variant: 'lead' },
  'sitelo 构建在 ',
  link({ href: 'https://vite.dev', external: true }, 'Vite'),
  ' 之上，用 ',
  link({ href: 'https://ht.js.org', external: true }, 'javascript-to-html'),
  ' 渲染，而且除非你主动要求，否则不会往浏览器发任何东西。',
)`, { align: 'stretch' }),

      h2('什么时候该改用按钮'),
      p(
        '链接负责跳转，按钮负责执行操作。如果它改变的是页面上的状态、而不是把读者带去别处，那它就该是 ',
        code('button()'),
        '；如果它确实是跳转、但外观要像按钮，那就给 ',
        code('button()'),
        ' 一个 ',
        code('href'),
        '，底下渲染出来的仍是锚点。',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center', wrap: true },
  link({ href: '/zh/docs' }, '会跳转的链接'),
  button({ href: '/zh/docs', variant: 'outline' }, '长得像按钮的链接'),
  button({ variant: 'link' }, '长得像链接的按钮'),
)`),

      h2('属性'),
      propsTable([
        ['href', 'string', '', '指向哪里。'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", '取用哪一套配色。'],
        ['subtle', 'boolean', 'false', '继承周围颜色；只在悬停时加下划线。'],
        ['external', 'boolean', 'false', '加上 target="_blank" 和 rel="noopener noreferrer"。'],
      ]),
    ],
  })
