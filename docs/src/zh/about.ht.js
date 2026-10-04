import {
  a,
  div,
  em,
  h2,
  p,
  table,
  tbody,
  td,
  th,
  thead,
  tr,
} from 'javascript-to-html'
import { code, pageLayout } from '../lib/zh.js'

function comparisonRow(tool, model, when) {
  return tr(td(tool), td(model), td(when))
}

export default () =>
  pageLayout({
    title: '关于',
    description:
      'sitelo 为何存在 —— 从 javascript-to-html 到 vite-plugin-html-pages，再到一整套静态站点工具。',
    activeHref: '/zh/about',
    children: [
      p(
        'sitelo 一开始并不是一个框架。它起于一个念头：想用一种在 JavaScript 里写起来自然的方式来写标记 —— 然后它一路生长，直到覆盖了从页面文件到发布上线的全过程。',
      ),
      h2('javascript-to-html'),
      p(
        '最先出现的是 ',
        a(
          {
            href: 'https://www.npmjs.com/package/javascript-to-html',
            rel: 'noopener',
          },
          'javascript-to-html',
        ),
        '（也叫 ',
        a({ href: 'https://ht.js.org', rel: 'noopener' }, 'ht.js'),
        '）：一种在 JavaScript 中生成 HTML 的简单直观的方式，不需要复杂的模板引擎或框架。',
      ),
      p(
        '在 React 这类全功能框架已经无处不在的当下，想找一个不把整套家当都带上的简单模板方案，竟意外地难。ht.js 只专注于把 JavaScript 变成 HTML —— 本质上就是返回字符串的函数 —— 因而始终保持轻量、易用、灵活且可扩展。',
      ),
      p(
        '这样小的表面积让它能用在很多地方：直接用在前端（类似 SPA）、用在构建中生成静态站点（SSG），甚至用于服务端渲染（SSR）。',
      ),
      h2('教会 Vite 产出 HTML'),
      p(
        '书写的问题解决了，接下来是构建：Vite 把 ',
        code('.js'),
        ' / ',
        code('.ts'),
        ' 当作脚本，而不是页面。我需要一个约定，让某些模块',
        em('本来就是'),
        '要变成 HTML 的。',
      ),
      p(
        '思路很直接：像 ',
        code('*.ht.js'),
        '、',
        code('*.html.js'),
        '、',
        code('*.ht.ts'),
        ' 这类命名的文件，应当被处理成 HTML，而不是打包成客户端 JavaScript。这个约定后来就成了 ',
        a(
          {
            href: 'https://www.npmjs.com/package/vite-plugin-html-pages',
            rel: 'noopener',
          },
          'vite-plugin-html-pages',
        ),
        ' —— 在 Vite 之上提供基于文件的路由、数据加载、资源处理与静态生成。',
      ),
      h2('sitelo'),
      p(
        'sitelo 把 Vite 和这个插件打包成一次安装、一个 CLI。你会得到一套完整而出色的开发体验：',
        code('sitelo'),
        ' 提供实时服务器，',
        code('sitelo build'),
        ' 用于生产，加上合理的默认值和插件的页面模型 —— 无需自己拼装工具链。',
      ),
      p(
        '从头到尾都是同一个想法：页面就是返回 HTML 的模块。sitelo 是让这个想法显得完整的那一层。',
      ),
      h2('组件与服务端区块'),
      p(
        '事实证明，返回 HTML 的函数可以一路组合到顶层。',
        a({ href: '/zh/docs/ui' }, 'sitelo-ui'),
        ' 是以同样方式构建的组件库 —— 按钮、卡片、表单、表格、模态框和页面区段，每一个都是返回字符串的函数。没有编译器，没有运行时，也没有水合：你构建出的就是最终落进 ',
        code('dist/'),
        ' 的内容。',
      ),
      p(
        '不过，页面上并非每个区域都能是静态的。',
        a({ href: '/zh/docs/islands' }, '服务端区块'),
        '让页面保持静态，只把需要每次请求都拿到新数据的部分 —— 缓存文章下的评论、商品页上的库存标记 —— 在页面被访问时交给服务器渲染。区块同样是一个返回 HTML 的函数：构建产物带着它的后备内容，一个很小的加载器再把渲染好的片段换进来。',
      ),
      p(
        '这两者都没有改变模型。依然没有客户端框架 —— 只有由函数产出的 HTML，在构建时或请求时。',
      ),
      h2('横向对比'),
      p(
        '能发布静态站点的好工具已经不少。sitelo 的定位是刻意收窄的：用 JavaScript（或 TypeScript）函数返回 HTML，配上 Vite 的开发体验，并尽可能少的框架成分。',
      ),
      div(
        { class: 'docs-table-scroll' },
        table(
          { class: 'docs-table docs-table--wrap-last' },
          thead(tr(th('工具'), th('模型'), th('什么时候选它'))),
          tbody(
            comparisonRow(
              'sitelo',
              'JS/TS 函数 → 基于 Vite 的 HTML，外加组件与服务端区块',
              '你想用 JavaScript 产出 HTML，并保有真正的 Vite 工作流 —— 组件和按请求渲染的区域都已具备，无需客户端框架或水合',
            ),
            comparisonRow(
              'Astro',
              '框架组件 + 客户端与服务端区块，自研编译器',
              '你想在浏览器中水合 React、Vue 或 Svelte 组件，并需要更大的生态',
            ),
            comparisonRow(
              'Next.js',
              '完整的 React 应用（SSR / SSG / ISR）',
              '你在 React 生态里构建应用',
            ),
            comparisonRow(
              'Hugo',
              'Go 模板，构建极快',
              '超大规模内容站点，且你乐于使用 Go 的工具链',
            ),
            comparisonRow(
              'Eleventy',
              '模板语言 → HTML',
              '你想要灵活的模板（Nunjucks、Liquid，…）而不引入 SPA 框架',
            ),
          ),
        ),
      ),
      p(
        '如果你想要客户端组件与水合 —— 那就用框架。如果你想用 JavaScript 函数产出 HTML，同时保有 Vite 的体验 —— 组件与服务端渲染的区域都已具备 —— sitelo 是能完整做完这件事的最小工具。',
      ),
      p(
        a({ href: '/zh/docs' }, '阅读文档'),
        ' · ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo',
            rel: 'noopener',
          },
          'GitHub',
        ),
      ),
    ],
  })
