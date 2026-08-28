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
    ],
  })
