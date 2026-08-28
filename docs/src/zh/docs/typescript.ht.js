import { h2, p } from 'javascript-to-html'
import { code, docsLayout, pageCodeTabs } from '../../lib/zh.js'
import {
  typedHt,
  typedJsx,
  typedTemplate,
} from '../../lib/snippets/typescript.js'

export default () =>
  docsLayout({
    title: 'TypeScript',
    description: '借助 sitelo/page 的辅助函数获得类型化页面与推导出的路由参数。',
    activeHref: '/zh/docs/typescript',
    children: [
      p(
        '页面可以是 ',
        code('.ht.ts'),
        ' / ',
        code('.ht.tsx'),
        '，无需任何配置。',
      ),
      h2('definePageModule'),
      p(
        code('sitelo/page'),
        ' 提供的辅助函数带来完整的类型推导。构建时，这个 import 会被替换为按路由生成的模块，其 ',
        code('PageParams'),
        ' 来自文件名：',
        code('[slug]'),
        ' → ',
        code('{ slug: string }'),
        '，',
        code('[...path]'),
        ' → ',
        code('{ path: string[] }'),
        '，',
        code('[...path]?'),
        ' → ',
        code('{ path?: string[] }'),
        '。',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.ts',
        template: typedTemplate,
        ht: typedHt,
        jsx: typedJsx,
      }),
      p(
        '同时导出的还有：',
        code('definePage'),
        '、',
        code('defineData'),
        '、',
        code('defineStaticParams'),
        '。',
      ),
      h2('生成的类型'),
      p(
        '每次启动开发服务器或执行构建时，声明文件都会写入 ',
        code('.sitelo/types/'),
        '。把这个目录加进 ',
        code('.gitignore'),
        '。',
      ),
    ],
  })
