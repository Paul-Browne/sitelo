import { h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout, pageCodeTabs } from '../../lib/zh.js'
import { dataSnippets } from '../../lib/snippets/data.js'

const s = dataSnippets('zh')

export default () =>
  docsLayout({
    title: '数据加载',
    description: '构建时的 data() 与面向 API 驱动静态站点的 fetchWithCache。',
    activeHref: '/zh/docs/data',
    children: [
      p(
        '导出一个 ',
        code('data()'),
        ' 函数，它的结果会作为 ',
        code('ctx.data'),
        ' 出现在渲染函数里。它在构建时运行，在开发服务器中则每次请求都会运行。',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: s.dataTemplate,
        ht: s.dataHt,
        jsx: s.dataJsx,
      }),
      h2('fetchWithCache'),
      p(
        '要基于同一个 API 生成很多页面？从 sitelo 引入 ',
        code('fetchWithCache'),
        '：',
      ),
      codeBlock('src/blog/[slug].ht.js', s.cache, 'javascript'),
      h3('选项'),
      ul(
        { class: 'docs-list' },
        li(code('maxAge'), ' —— 缓存存活时间（秒），默认 ', code('3600')),
        li(
          code('cacheKey'),
          ' —— 自定义键（默认取 URL + 方法 + 请求头 + 请求体的哈希）',
        ),
        li(code('forceRefresh'), ' —— 跳过缓存'),
        li(
          code('cache'),
          ' —— ',
          code("'auto'"),
          ' | ',
          code("'memory'"),
          ' | ',
          code("'fs'"),
          ' | ',
          code("'none'"),
        ),
      ),
      h3('缓存模式'),
      ul(
        { class: 'docs-list' },
        li(code('auto'), '（默认）—— 开发时用内存，生产构建时用文件系统'),
        li(code('memory'), ' —— 进程内，进程退出即清空'),
        li(code('fs'), ' —— 持久化到 ', code('node_modules/.cache/')),
        li(code('none'), ' —— 每次都重新请求'),
      ),
      p(
        '默认只缓存 ',
        code('GET'),
        ' 请求（要缓存其他方法，请传入 ',
        code('cacheKey'),
        '）。错误响应永远不会被缓存。',
      ),
      h2('本地 JSON 文件'),
      p(
        '没有 API？把内容以 JSON 形式放在仓库里，用 ',
        code('sitelo/data'),
        ' 读取。',
      ),
      codeBlock('project', s.jsonTree, 'bash'),
      codeBlock('src/blog/[slug].ht.js', s.jsonCollection, 'javascript'),
      p(
        '相对路径从项目根目录解析，因此无论在哪里运行 CLI，',
        code('data/posts'),
        ' 都指向同一处。',
        code('readJson'),
        ' 返回解析后的单个文件；',
        code('readJsonCollection'),
        ' 返回条目数组，每一项都带 ',
        code('slug'),
        ' —— 可以来自一个 ',
        code('.json'),
        ' 文件目录（每个条目一个文件，slug 取自文件名），也可以来自单个文件，其中是条目数组或以 slug 为键的对象。',
      ),
      codeBlock('src/blog/[slug].ht.js', s.jsonSources, 'javascript'),
      h3('集合选项'),
      ul(
        { class: 'docs-list' },
        li(
          code('slug'),
          ' —— 字段名或函数；默认取文件名、对象的键，或条目自身的 ',
          code('slug'),
          ' / ',
          code('id'),
        ),
        li(
          code('sort'),
          ' —— 字段名（',
          code("'date'"),
          ' 升序，',
          code("'-date'"),
          ' 降序）或比较函数',
        ),
        li(
          code('recursive'),
          ' —— 一并读取子目录中的 ',
          code('.json'),
          ' 文件，用路径作为 slug',
        ),
        li(code('root'), ' —— 相对路径的解析目录'),
        li(
          code('cache'),
          ' —— ',
          code("'auto'"),
          ' | ',
          code("'memory'"),
          ' | ',
          code("'none'"),
        ),
      ),
      p(
        '每个文件的读取结果都会被记住，因此 500 个页面的构建只解析每个文件一次。开发服务器则改为比对 mtime，并在页面读取过的 JSON 文件发生变化时刷新浏览器。slug 重复、文件缺失和 JSON 格式错误都会让构建失败，并指出对应路径。',
      ),
    ],
  })
