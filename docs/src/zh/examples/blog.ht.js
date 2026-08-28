import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, examplesLayout, pageCodeTabs } from '../../lib/zh.js'
import { blogSnippets } from '../../lib/snippets/examples-blog.js'

const s = blogSnippets('zh')

export default () =>
  examplesLayout({
    title: 'Markdown 博客',
    description:
      '一个装满 markdown 文件的文件夹 → 一个带 RSS 订阅的静态博客，用 sitelo 和 marked 构建。',
    activeHref: '/zh/examples/blog',
    children: [
      p(
        '静态站点最经典的用法：文件夹里的 markdown 文件、每篇文章一个静态页面、一份 RSS 订阅，以及零客户端 JavaScript。完整源码见 ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/blog',
            rel: 'noopener',
          },
          'examples/blog',
        ),
        '。',
      ),
      h2('你会得到什么'),
      ul(
        { class: 'docs-list' },
        li('一个按时间倒序列出文章的首页'),
        li(
          code('/blog/[slug]'),
          ' —— 通过 ',
          code('generateStaticParams'),
          '，每个 markdown 文件生成一个静态 HTML 页面',
        ),
        li(code('rss.xml'), ' —— 由 sitelo 根据 ', code('rss'), ' 配置生成'),
        li(code('sitemap.xml'), ' —— 设置 ', code('site'), ' 即可启用'),
        li('不发布任何 JS —— markdown 在构建时于 Node 中解析'),
      ),
      h2('项目结构'),
      codeBlock('project', s.structure, 'bash'),
      codeBlock('sitelo.config.js', s.config, 'javascript'),
      h2('1. 用 markdown 写文章'),
      p(
        '文章放在 ',
        code('content/'),
        ' 里 —— 在 ',
        code('src/'),
        ' 之外，因此 sitelo 绝不会把它们当成页面或资源。frontmatter 就是简单的 ',
        code('key: value'),
        ' 行：',
      ),
      codeBlock('content/hello-world.md', s.post, 'markdown'),
      h2('2. 在 Node 中读取并渲染'),
      p(
        '一个仅在服务端运行的小模块读取该文件夹、解析 frontmatter，并用 ',
        a({ href: 'https://marked.js.org', rel: 'noopener' }, 'marked'),
        ' 渲染 markdown。由于 HTML 中没有任何东西引用这个模块，它永远不会进入浏览器。',
      ),
      codeBlock('src/lib/posts.js', s.lib, 'javascript'),
      h2('3. 在首页列出文章'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.indexTemplate,
        ht: s.indexHt,
        jsx: s.indexJsx,
      }),
      h2('4. 每篇文章一个静态页面'),
      p(
        code('generateStaticParams'),
        ' 在构建时返回全部 slug；',
        code('data()'),
        ' 为每个页面加载对应的文章。',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: s.slugTemplate,
        ht: s.slugHt,
        jsx: s.slugJsx,
      }),
      h2('5. RSS 白送'),
      p(
        '配上上面的 ',
        code('rss'),
        ' 配置，',
        code('sitelo build'),
        ' 就会产出 ',
        code('dist/rss.xml'),
        '，为 ',
        code('/blog'),
        ' 下的每个页面各生成一条 —— 不需要额外代码。',
      ),
      p(
        a({ href: '/zh/docs/routing' }, '路由文档'),
        ' · ',
        a({ href: '/zh/docs/data' }, '数据加载文档'),
        ' · ',
        a({ href: '/zh/docs/configuration' }, '配置文档'),
      ),
    ],
  })
