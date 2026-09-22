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
        li(
          code('lighthouse'),
          ' —— 审计生产构建（需要 ',
          code('lighthouse'),
          ' peer 依赖）',
        ),
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
      h2('查找未使用的代码'),
      p(
        a({ href: 'https://knip.dev' }, 'knip'),
        ' 能找出没有任何地方使用的文件、导出和依赖。在 sitelo 项目里它需要一个提示：页面和岛屿是从文件系统中发现的，没有任何代码导入它们，不加提示的话 knip 会把整个站点报告为未使用的文件。',
      ),
      codeBlock('shell', s.knipInstall, 'bash'),
      codeBlock('knip.js', s.knip, 'javascript'),
      codeBlock('shell', s.knipRun, 'bash'),
      p(
        code('knipConfig()'),
        ' 会读取你的 ',
        code('sitelo.config.js'),
        '，并按构建发现页面的方式把页面和岛屿标记为入口 —— ',
        code('pagesDir'),
        '、',
        code('pageExtensions'),
        '、',
        code('include'),
        ' 和 ',
        code('exclude'),
        ' 全部生效。报告里剩下的，就是站点确实永远不会触及的代码。',
      ),
      p(
        '有一样它看不见：页面通过 URL 而不是导入引用的客户端脚本，比如 ',
        code('<script src="/js/app.js">'),
        '。这些需要你自己列出，knip 接受的其他任何选项也可以一并传入 —— 它们会展开进结果里。末尾的 ',
        code('!'),
        ' 是 knip 用来标记生产代码的记号，而交付给浏览器的脚本正是生产代码。',
      ),
      codeBlock('knip.js', s.knipEntry, 'javascript'),
    ],
  })
