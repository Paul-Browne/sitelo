import { div, h2, p, table, tbody, td, th, thead, tr } from 'javascript-to-html'
import { code, codeBlock, docsLayout, pageCodeTabs } from '../../lib/zh.js'
import {
  paramsHt,
  paramsJsx,
  paramsTemplate,
  structure,
} from '../../lib/snippets/routing.js'

function row(feature, file, url) {
  return tr(td(feature), td(file), td(url))
}

export default () =>
  docsLayout({
    title: '路由',
    description: '基于文件的路由、动态片段与 generateStaticParams。',
    activeHref: '/zh/docs/routing',
    children: [
      p('路由直接来自 ', code('src/'), ' 下的文件系统。'),
      codeBlock('project', structure, 'bash'),
      h2('路由对照表'),
      div(
        { class: 'docs-table-scroll' },
        table(
          { class: 'docs-table' },
          thead(tr(th('特性'), th('文件'), th('URL'))),
          tbody(
            row('静态', code('index.ht.js'), code('/')),
            row('嵌套', code('blog/index.ht.js'), code('/blog')),
            row('动态', code('blog/[slug].ht.js'), code('/blog/my-post')),
            row(
              '多个参数',
              code('blog/[year]/[slug].ht.js'),
              code('/blog/2026/my-post'),
            ),
            row('全捕获', code('docs/[...path].ht.js'), code('/docs/api/auth')),
            row(
              '可选全捕获',
              code('docs/[...path]?.ht.js'),
              code('/docs 及更深层'),
            ),
            row('路由分组', code('(admin)/users.ht.js'), code('/users')),
          ),
        ),
      ),
      p(
        '更具体的路由优先：静态胜过动态，动态胜过全捕获。两个文件生成同一个 URL 会导致构建报错。',
      ),
      h2('generateStaticParams'),
      p(
        '动态路由声明构建时要产出哪些页面。在 ',
        code('sitelo'),
        '（dev）中，动态路由仍会按需渲染，无需逐一列出参数。',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: paramsTemplate,
        ht: paramsHt,
        jsx: paramsJsx,
      }),
      p(
        '取值可以是字符串、数字或布尔值 —— 它们会被转成字符串并做 URL 编码。全捕获参数接受数组（',
        code("{ path: ['a', 'b'] }"),
        '）或以斜杠分隔的字符串（',
        code("{ path: 'a/b' }"),
        '）。',
      ),
      p('没有生成任何路由的动态页面会打印一条警告，免得它从站点里悄无声息地消失。'),
    ],
  })
