import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout, pageCodeTabs } from '../../lib/zh.js'
import { gettingStartedSnippets } from '../../lib/snippets/getting-started.js'

const s = gettingStartedSnippets('zh')

export default () =>
  docsLayout({
    title: '快速开始',
    description: '安装 sitelo，构建你的第一个静态站点。',
    activeHref: '/zh/docs',
    children: [
      p(
        'sitelo 是一个由 Vite 驱动、零配置的静态站点生成器。安装一个包，编写返回 HTML 的函数，然后运行 ',
        code('sitelo build'),
        '。',
      ),
      h2('安装'),
      codeBlock('shell', s.install, 'bash'),
      p('需要 Node 20.19+（或 22.12+）。Vite 已内置，无需单独安装。'),
      h2('你的第一个页面'),
      p(
        '创建 ',
        code('src/index.ht.js'),
        '（或 ',
        code('.ht.jsx'),
        '）。推荐使用 ',
        a({ href: 'https://ht.js.org', rel: 'noopener' }, 'ht.js'),
        '：',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      h2('运行'),
      codeBlock('shell', s.run, 'bash'),
      p(
        '这会生成 ',
        code('dist/index.html'),
        '（并自动补上 ',
        code('<!DOCTYPE html>'),
        '），以及一个默认的 ',
        code('404.html'),
        '。',
      ),
      h2('接下来'),
      ul(
        { class: 'docs-list' },
        li(
          a({ href: '/zh/docs/pages' }, '编写页面'),
          ' —— 模板字符串、JSX、结构化模块',
        ),
        li(
          a({ href: '/zh/docs/routing' }, '路由'),
          ' —— 基于文件的路由与 ',
          code('generateStaticParams'),
        ),
        li(
          a({ href: '/zh/docs/data' }, '数据加载'),
          ' —— ',
          code('data()'),
          ' 与 ',
          code('fetchWithCache'),
        ),
        li(
          a({ href: '/zh/docs/assets' }, '资源与样式'),
          ' —— 由 Vite 编译的前端 JS/CSS（',
          code('src/js'),
          '、',
          code('src/css'),
          '）',
        ),
        li(
          a({ href: '/zh/docs/configuration' }, '配置'),
          ' —— ',
          code('sitelo.config.js'),
          ' 与 Vite 选项',
        ),
        li(
          a({ href: '/zh/docs/build-with-ai' }, '用 AI 开发'),
          ' —— ',
          code('llms.txt'),
          '、项目规则与面向智能体的建议',
        ),
      ),
    ],
  })
