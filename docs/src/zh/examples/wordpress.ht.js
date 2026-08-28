import { a, h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, examplesLayout, pageCodeTabs } from '../../lib/zh.js'
import { wordpressSnippets } from '../../lib/snippets/examples-wordpress.js'

const s = wordpressSnippets('zh')

export default () =>
  examplesLayout({
    title: 'WordPress',
    description:
      '通过 REST API 抓取整个 WordPress 站点 —— 数千篇文章，用 sitelo 静态生成。',
    activeHref: '/zh/examples/wordpress',
    children: [
      p(
        '把 WordPress 当作 headless CMS，',
        '把整个站点抓下来',
        '：分页遍历 ',
        code('/wp-json/wp/v2/posts'),
        '，为每个 slug 生成一个 HTML 文件，并在多次构建之间缓存 API 响应。',
      ),
      h2('你会得到什么'),
      ul(
        { class: 'docs-list' },
        li('一个列出近期文章的首页'),
        li(code('/blog'), ' —— 所有文章的完整归档'),
        li(
          code('/blog/[slug]'),
          ' —— 每篇文章一个静态 HTML 页面（数千篇也扛得住）',
        ),
        li(
          code('fetchWithCache'),
          '，让重复构建复用 WP 的响应，而不是把一切重新下载一遍',
        ),
      ),
      h2('项目结构'),
      codeBlock('project', s.structure, 'bash'),
      codeBlock('sitelo.config.js', s.config, 'javascript'),
      h2('1. 指向你的 WordPress 站点'),
      p(
        '现代 WordPress 默认开启 REST API。可以在 ',
        code('https://你的站点.com/wp-json/wp/v2/posts'),
        ' 确认。',
      ),
      p(
        '在环境变量里设置 ',
        code('WP_URL'),
        '（试验阶段直接写死也行）：',
      ),
      codeBlock('.env', s.env, 'bash'),
      h2('2. 共用的 WordPress 辅助函数'),
      p(
        code('getAllPosts()'),
        ' 读取 ',
        code('X-WP-TotalPages'),
        ' 并逐页遍历（WordPress 把 ',
        code('per_page'),
        ' 限制在 100）。收集 slug 时跳过 ',
        code('_embed'),
        ' —— 只在取单篇文章时才请求内嵌内容。',
      ),
      codeBlock('src/lib/wordpress.js', s.wpLib, 'javascript'),
      h2('3. 首页'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.homeTemplate,
        ht: s.homeHt,
        jsx: s.homeJsx,
      }),
      h2('4. 博客索引'),
      p(
        '使用 ',
        code('getAllPosts()'),
        '，这样归档就不会被限制在 50–100 条。',
      ),
      pageCodeTabs({
        file: 'src/blog/index.ht.js',
        template: s.blogIndexTemplate,
        ht: s.blogIndexHt,
        jsx: s.blogIndexJsx,
      }),
      h2('5. 把每篇文章都变成静态页面'),
      p(
        code('generateStaticParams'),
        ' 必须返回你希望出现在 ',
        code('dist/'),
        ' 里的',
        '每一个',
        ' slug。请在这里对 API 分页 —— 不要只调用一次 ',
        code('getPosts({ perPage: 100 })'),
        ' 就收工。',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: s.blogPostTemplate,
        ht: s.blogPostHt,
        jsx: s.blogPostJsx,
      }),
      h2('6. 构建'),
      codeBlock('shell', s.build, 'bash'),
      p(
        '首次构建会完整走一遍 WordPress，并填满 fetch 缓存。后续构建会复用缓存的列表和详情响应（',
        code("cache: 'auto'"),
        ' → 生产环境用文件系统），直到 ',
        code('maxAge'),
        ' 过期。如果要渲染数千个文章页，请在 ',
        code('sitelo.config.js'),
        ' 中调高 ',
        code('renderConcurrency'),
        '。',
      ),
      h2('说明'),
      h3('来自 WordPress 的 HTML'),
      p(
        code('title.rendered'),
        ' 和 ',
        code('content.rendered'),
        ' 是 WP 给出的 HTML 字符串。可以像上面那样原样放进模板；如果你并不完全信任这个 CMS，就先做净化。',
      ),
      h3('非公开内容'),
      p(
        '公开的 REST 路由只会暴露已发布的文章。若要取草稿或使用自定义鉴权，请在 ',
        code('fetchWithCache'),
        ' 的第二个参数里传入请求头（就是标准的 ',
        code('fetch'),
        ' init），并使用稳定的 ',
        code('cacheKey'),
        '。',
      ),
      p(
        a({ href: '/zh/docs/data' }, '数据加载文档'),
        ' · ',
        a({ href: '/zh/docs/routing' }, '路由文档'),
      ),
    ],
  })
