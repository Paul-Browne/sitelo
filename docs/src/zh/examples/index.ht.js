import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, examplesLayout } from '../../lib/zh.js'

export default () =>
  examplesLayout({
    title: '示例',
    description: '实用的 sitelo 范例 —— WordPress、API 等等。',
    activeHref: '/zh/examples',
    children: [
      p(
        '用 sitelo 构建真实站点的分步范例。每个示例都会展示项目结构、数据加载，以及你要写的页面。',
      ),
      h2('现有示例'),
      ul(
        { class: 'docs-list' },
        li(
          a({ href: '/zh/examples/basic' }, '基础站点'),
          ' —— 最小项目，外加 Netlify、Vercel、Cloudflare Pages 与 AWS Amplify 的静态部署配置。',
        ),
        li(
          a({ href: '/zh/examples/todo' }, '待办应用'),
          ' —— 静态 HTML 配内联 ',
          code("import('/js/todo.js')"),
          ' 处理函数（添加 / 切换 / 删除，',
          code('localStorage'),
          '）。',
        ),
        li(
          a({ href: '/zh/examples/blog' }, 'Markdown 博客'),
          ' —— 一个装满 ',
          code('.md'),
          ' 文件的文件夹渲染成静态页面，带 RSS 订阅，且零客户端 JS。',
        ),
        li(
          a({ href: '/zh/examples/wordpress' }, 'WordPress'),
          ' —— 用 ',
          code('fetchWithCache'),
          ' 从 WordPress REST API 拉取文章，列出它们，并生成静态文章页。',
        ),
        li(
          a({ href: '/zh/examples/islands' }, '服务端区块'),
          ' —— 静态页面外加一个在请求时渲染区块的 Node 宿主。',
        ),
      ),
      h2('即将推出'),
      ul({ class: 'docs-list' }, li('Headless CMS / Contentful')),
    ],
  })
