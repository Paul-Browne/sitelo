import {
  a,
  button,
  code,
  div,
  h1,
  h2,
  h3,
  img,
  li,
  p,
  span,
  ul,
} from 'javascript-to-html'
import { landingLayout } from '../lib/zh.js'
import { arrowIcon, icons } from '../lib/landing-icons.js'
import { gettingStartedSnippets } from '../lib/snippets/getting-started.js'

const { install } = gettingStartedSnippets('zh')

const features = [
  [
    'routing',
    '路由',
    'src/about.ht.js → /about，还有 [slug] 与全捕获路由',
    '/zh/docs/routing',
  ],
  [
    'code',
    'JSX 与 TSX',
    '用 .jsx / .tsx 写页面，路由和构建完全一致',
    '/zh/docs/pages#jsx-的限制',
  ],
  ['data', '数据加载', '构建时的 data()，并带有 fetch 缓存', '/zh/docs/data'],
  [
    'pipeline',
    '资源流水线',
    '被引用的 JS/TS/CSS 会被打包；其余的只留在服务端',
    '/zh/docs/assets',
  ],
  [
    'image',
    '图片优化',
    '缩放、格式与 srcset —— 用 images: true 开启（需安装 sharp）',
    '/zh/docs/images',
  ],
  [
    'feather',
    '默认零 JavaScript',
    '只有你引用的脚本才会被打包 —— 其余一概不上页面，站点因此更快',
    '/zh/docs/assets#默认零-js',
  ],
  [
    'terminal',
    '开发服务器 + 工具栏',
    '按请求实时渲染，开发时还能看到文件、参数、区块数量和视口切换',
    '/zh/docs/cli',
  ],
  [
    'search',
    'Pagefind 搜索',
    '可选的静态搜索 —— 安装 pagefind，sitelo build 就会索引到 dist/pagefind/',
    '/zh/docs/configuration#pagefind-搜索',
  ],
  [
    'layers',
    '服务端区块',
    '静态页面，其中某些区域在请求时于服务端渲染',
    '/zh/docs/islands',
  ],
  [
    'sparkles',
    '为 AI 准备好',
    'llms.txt、项目规则与建议，让智能体写出 sitelo，而不是 React',
    '/zh/docs/build-with-ai',
  ],
  [
    'deploy',
    '一键部署',
    '内置 Netlify、Vercel、Cloudflare Pages 与 AWS Amplify 的配置',
    '/zh/docs/deployment',
  ],
  ['gift', '额外功能', '需要时提供 404.html、sitemap.xml 和 RSS', '/zh/docs/configuration'],
]

export default () =>
  landingLayout({
    pageTitle: 'sitelo —— 打造快速网站的现代框架',
    description:
      'sitelo 把一个装满页面的文件夹变成快速的静态网站。工作时实时预览，一条命令即可发布 —— 不需要笨重的框架。',
    children: [headerHero(), mainSections()],
  })

function headerHero() {
  return div(
    { class: 'hero' },
    div(
      { class: 'hero-center' },
      img({
        class: 'hero-logo',
        src: '/logo.svg',
        alt: 'sitelo',
        width: '280',
        height: '80',
        // Above the fold and the hero's first paint, so it should not queue
        // behind the page's other subresources.
        fetchpriority: 'high',
      }),
      h1(
        { class: 'hero-headline' },
        span(
          { class: 'hero-headline-text' },
          '打造',
          span(
            {
              class: 'hero-typed',
              'data-phrases':
                '快速网站|博客|作品集|落地页|内容站点|电商网站',
              'aria-live': 'polite',
            },
            '快速网站',
          ),
          '的现代框架',
        ),
      ),
      p(
        { class: 'hero-lede' },
        '零配置。构建快如闪电。随处部署 —— 只需一次安装。',
      ),
      div(
        { class: 'hero-actions' },
        a({ class: 'btn', href: '/zh/docs' }, '开始使用'),
        div(
          { class: 'install-glow' },
          div(
            { class: 'install' },
            code({ class: 'install-cmd' }, install),
            button(
              {
                class: 'install-copy',
                type: 'button',
                'data-copy': install,
                'aria-label': '复制安装命令',
              },
              '复制',
            ),
          ),
        ),
      ),
    ),
  )
}

function mainSections() {
  return div(
    { class: 'landing-sections' },
    sectionBlock(
      '你会得到什么',
      ul(
        { class: 'feature-list' },
        ...features.map(([icon, name, detail, href]) => {
          const body = div(
            { class: 'feature-card-body' },
            span({ class: 'feature-chip' }, icons[icon]),
            h3(name),
            p(detail),
          )
          return li(
            href
              ? a({ class: 'feature-card', href }, body)
              : div({ class: 'feature-card' }, body),
          )
        }),
      ),
    ),
    sectionBlock(
      '文档',
      p('涵盖路由、数据加载、TypeScript、配置与 CLI 的指南。'),
      p(
        a({ class: 'btn btn-inline', href: '/zh/docs' }, '阅读文档', arrowIcon),
      ),
    ),
    sectionBlock(
      '示例',
      p('面向真实场景的范例 —— 从一个基于 WordPress REST API 的站点开始。'),
      p(
        a({ class: 'btn btn-inline', href: '/zh/examples' }, '浏览示例', arrowIcon),
      ),
    ),
  )
}

function sectionBlock(heading, ...children) {
  return div({ class: 'section' }, h2(heading), ...children)
}
