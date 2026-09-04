import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, examplesLayout, pageCodeTabs } from '../../lib/zh.js'
import { jsonSnippets } from '../../lib/snippets/examples-json.js'

const s = jsonSnippets('zh')

export default () =>
  examplesLayout({
    title: '本地 JSON',
    description:
      '完全由仓库里的 JSON 文件构建的产品目录 —— 没有 API，也没有数据库。',
    activeHref: '/zh/examples/json',
    children: [
      p(
        '内容以 JSON 的形式放在仓库里，由 ',
        code('sitelo/data'),
        ' 变成静态页面。没有 API，没有数据库，也没有客户端 JavaScript。完整源码见 ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/json',
            rel: 'noopener',
          },
          'examples/json',
        ),
        '.',
      ),
      h2('你会得到'),
      ul(
        { class: 'docs-list' },
        li('一个列出全部分类和产品的首页'),
        li(
          code('/products/[slug]'),
          ' —— ',
          code('data/products/'),
          ' 中的每个文件对应一个静态页面',
        ),
        li(
          code('/categories/[slug]'),
          ' —— ',
          code('data/categories.json'),
          ' 中的每个键对应一个页面',
        ),
        li('新增一个 JSON 文件就等于新增一个页面，无需注册路由'),
        li('不向浏览器发送任何 JS —— 文件在构建时于 Node 中读取'),
      ),
      h2('项目结构'),
      codeBlock('project', s.structure, 'bash'),
      p(
        '数据放在 ',
        code('src/'),
        ' 之外，因此 sitelo 不会把它们当成页面或资源。',
      ),
      h2('1. 把内容放进 data/'),
      p(
        '每个产品一个文件。文件名就是 slug，因此 ',
        code('aeron-chair.json'),
        ' 就是 ',
        code('/products/aeron-chair'),
        '，文件里不必再声明一次：',
      ),
      codeBlock('data/products/aeron-chair.json', s.product, 'json'),
      p(
        '分类则放在单个文件里：一个以 slug 为键的对象，',
        code('readJsonCollection'),
        ' 同样会把它当作集合来读。',
      ),
      codeBlock('data/categories.json', s.categories, 'json'),
      h2('2. 在一处读取'),
      p(
        '一个仅在服务端运行的小模块封装了这些读取。HTML 中没有任何地方引用它，所以它永远不会进入浏览器 —— 而且因为 ',
        code('sitelo/data'),
        ' 按文件记忆结果，无论多少页面调用这些辅助函数，整个构建过程中每个 JSON 文件都只解析一次。',
      ),
      codeBlock('src/lib/catalogue.js', s.lib, 'javascript'),
      h2('3. 在首页列出全部内容'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.indexTemplate,
        ht: s.indexHt,
        jsx: s.indexJsx,
      }),
      h2('4. 每个 JSON 文件一个页面'),
      p(
        code('generateStaticParams'),
        ' 在构建时为每个文件返回一个 slug；',
        code('data()'),
        ' 则为每个页面加载对应的条目。',
      ),
      pageCodeTabs({
        file: 'src/products/[slug].ht.js',
        template: s.slugTemplate,
        ht: s.slugHt,
        jsx: s.slugJsx,
      }),
      h2('5. 边改边看'),
      codeBlock('terminal', s.build, 'bash'),
      p(
        '在 ',
        code('sitelo'),
        ' 下，改一个价格就会刷新打开着的页面 —— 开发服务器只监听页面真正读取过的 JSON 文件。slug 重复、文件缺失和 JSON 格式错误都会让构建失败，并指出出问题的路径。',
      ),
      p(
        a({ href: '/zh/docs/data' }, '数据加载文档'),
        ' · ',
        a({ href: '/zh/docs/routing' }, '路由文档'),
        ' · ',
        a({ href: '/zh/docs/configuration' }, '配置文档'),
      ),
    ],
  })
