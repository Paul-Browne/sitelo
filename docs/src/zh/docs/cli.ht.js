import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout } from '../../lib/zh.js'
import { cliSnippets } from '../../lib/snippets/cli.js'

const s = cliSnippets('zh')

export default () =>
  docsLayout({
    title: 'CLI',
    description: 'sitelo dev、build、preview 以及常用选项。',
    activeHref: '/zh/docs/cli',
    children: [
      p(
        code('sitelo'),
        ' CLI 封装了内置的 Vite，并自动注入 HTML 页面插件。',
      ),
      h2('命令'),
      codeBlock('shell', s.commands, 'bash'),
      ul(
        { class: 'docs-list' },
        li(
          code('dev'),
          ' —— 按请求进行真实的 SSR 渲染，包含动态路由，另有一个小巧的开发工具栏',
        ),
        li(
          code('build'),
          ' —— 输出静态 HTML 到 ',
          code('dist/'),
          '（或你指定的 ',
          code('outDir'),
          '）',
        ),
        li(code('preview'), ' —— 在本地提供生产构建'),
      ),
      p(
        '在 ',
        code('sitelo.config.js'),
        ' 中用 ',
        code('devToolbar: false'),
        ' 关闭工具栏 —— 参见',
        a({ href: '/zh/docs/configuration' }, '配置'),
        '。',
      ),
      h2('常用选项'),
      codeBlock('shell', s.flags, 'bash'),
      ul(
        { class: 'docs-list' },
        li(
          code('--port'),
          ' / ',
          code('--host'),
          ' / ',
          code('--open'),
          ' —— 服务器',
        ),
        li(
          code('--outDir'),
          ' / ',
          code('--emptyOutDir'),
          ' / ',
          code('--base'),
          ' —— 构建',
        ),
        li(
          code('--root'),
          ' —— 项目根目录（用于 ',
          code('docs/'),
          ' 里的站点很方便）',
        ),
        li(code('--config'), ' —— 自定义的 Vite 配置文件'),
        li(code('--mode'), ' / ', code('--logLevel'), ' / ', code('--debug')),
      ),
      p(
        '凡是要在多个命令之间复用的设置，更适合放进 ',
        code('sitelo.config.js'),
        ' 的 ',
        code('vite'),
        ' 之下。',
      ),
    ],
  })
