import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/zh.js'

export default () =>
  uiLayout({
    title: '手风琴',
    description: '用浏览器原生 <details> 实现的折叠区块——包括它的互斥模式。',
    activeHref: '/zh/ui/accordion',
    children: [
      p(
        '每个区块都是一个 ',
        code('<details>'),
        '。展开、收起、键盘操作和页内查找全部来自浏览器，关掉 JavaScript 也照常工作——对于最常见的用途「常见问题」来说，这一点很重要。',
      ),

      h2('基础手风琴'),
      demo(`accordion({
  items: [
    { title: 'sitelo 是什么？', content: '一个构建在 Vite 之上的静态站点生成器。页面就是返回 HTML 的函数。' },
    { title: '会附带运行时吗？', content: '不会。除非你自己引入脚本，否则没有任何东西送到浏览器。' },
    { title: '可以用 TypeScript 吗？', content: '可以——.ht.ts 和 .ht.tsx 和其他页面扩展名一样。' },
  ],
})`, { align: 'stretch' }),

      h2('默认展开'),
      demo(`accordion({
  items: [
    { title: '进来就是展开的', content: '这一项设置了 open: true。', open: true },
    { title: '收起的', content: '这一项没有。' },
  ],
})`, { align: 'stretch' }),

      h2('一次只开一个'),
      p(
        '共用一个 ',
        code('name'),
        ' 会让各区块互斥——展开一个就会收起其他。这是浏览器对 ',
        code('<details name>'),
        ' 的原生行为，不是脚本。',
      ),
      demo(`accordion({
  name: 'demo-exclusive',
  items: [
    { title: '第一项', content: '展开别的，这一项就会收起。', open: true },
    { title: '第二项', content: '这一项也一样。' },
    { title: '第三项', content: '任何时候都只有一项展开。' },
  ],
})`, { align: 'stretch' }),

      h2('富内容'),
      p(
        '当内容不止一段时，用 ',
        code('accordionItem()'),
        ' 来搭建各个区块。',
      ),
      demo(`accordion(
  accordionItem({ title: '安装', open: true },
    stack({ gap: 'sm' },
      text({ variant: 'small', tone: 'muted' }, '装上这个包和它的标记搭档：'),
      code('npm install sitelo javascript-to-html'),
    ),
  ),
  accordionItem({ title: '配置' },
    stack({ gap: 'sm' },
      text({ variant: 'small', tone: 'muted' }, '可选。Vite 的选项放在 vite 键下面。'),
      code('sitelo.config.js'),
    ),
  ),
  accordionItem({ title: '部署' },
    stack({ gap: 'sm' },
      text({ variant: 'small', tone: 'muted' }, '把输出目录发布到任意静态托管平台。'),
      stack({ direction: 'row', gap: 'sm', wrap: true },
        chip({ size: 'sm' }, 'Netlify'),
        chip({ size: 'sm' }, 'Vercel'),
        chip({ size: 'sm' }, 'Cloudflare Pages'),
        chip({ size: 'sm' }, 'GitHub Pages'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('常见问题'),
      p(
        '这正是该组件存在的意义：内容本就写在 HTML 里，折叠起来便于扫读，又因为从未离开页面而能被搜索引擎收录。',
      ),
      demo(`return (() => {
  const faq = [
    ['真的零配置吗？', 'src/ 里放一个文件、不写配置就能构建。其余一切都是按需开启。'],
    ['动态路由怎么用？', '文件名里加方括号。generateStaticParams 列出要构建的内容。'],
    ['搜索怎么办？', '设置 pagefind: true，构建时就会索引每个页面。'],
  ]

  return accordion({
    name: 'demo-faq',
    items: faq.map(([title, content]) => ({ title, content })),
  })
})()`, { align: 'stretch' }),

      h2('属性'),
      p(code('accordion()'), '：'),
      propsTable([
        ['items', 'Array', '[]', '字符串，或 { title, content, open } 对象。'],
        ['name', 'string', '', '共用的 name 会让各区块互斥。'],
      ]),
      p(code('accordionItem()'), '：'),
      propsTable([
        ['title', 'Child', '', '摘要行。'],
        ['open', 'boolean', 'false', '是否一开始就展开。'],
        ['name', 'string', '', '手写各项时，效果与父级上的相同。'],
      ]),
    ],
  })
