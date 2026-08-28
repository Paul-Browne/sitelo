import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout, pageCodeTabs } from '../../lib/zh.js'
import { assetsSnippets } from '../../lib/snippets/assets.js'

const s = assetsSnippets('zh')

export default () =>
  docsLayout({
    title: '资源与样式',
    description:
      'sitelo 如何用 Vite 编译前端 JavaScript 与 CSS —— 并把服务端代码挡在浏览器之外。',
    activeHref: '/zh/docs/assets',
    children: [
      p(
        'sitelo 构建在 Vite 之上，因此前端 JavaScript 和 CSS 会被自动编译。把脚本和样式放在 ',
        code('src/'),
        ' 下（例如 ',
        code('src/js'),
        ' 和 ',
        code('src/css'),
        '），在 HTML 中用根相对 URL 引用它们，剩下的交给 sitelo：TypeScript、CSS 导入、打包与压缩。',
      ),
      h2('项目结构'),
      p(
        '页面和资源共用 ',
        code('src/'),
        '。像 ',
        code('js/'),
        ' 和 ',
        code('css/'),
        ' 这样的目录只是约定，不是要求 —— sitelo 在意的是你的 HTML 引用了什么，而不是目录叫什么。',
      ),
      codeBlock('project', s.layout, 'bash'),
      h2('在 HTML 中引用资源'),
      p(
        '用根相对路径引用文件。正是 ',
        code('<script type="module">'),
        ' 或 ',
        code('<link rel="stylesheet">'),
        ' 告诉 sitelo 把该文件纳入构建：',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      codeBlock('src/js/main.js', s.js, 'javascript'),
      codeBlock('src/css/styles.css', s.css, 'css'),
      h2('Vite 会编译什么'),
      ul(
        { class: 'docs-list' },
        li(
          code('.js'),
          ' / ',
          code('.ts'),
          ' / ',
          code('.jsx'),
          ' / ',
          code('.tsx'),
          ' —— 打包为 ES 模块，剥离 TypeScript，内联 import',
        ),
        li(
          code('.css'),
          ' —— 处理并压缩；',
          code('@import'),
          ' 和相对的 ',
          code('url()'),
          ' 引用都会被解析',
        ),
        li(
          '从被引用入口导入的一切（比如上面的 ',
          code('counter.ts'),
          '）都会进入同一个包',
        ),
        li(
          '在 ',
          code('sitelo'),
          '（dev）中，同样的 URL 会走 Vite 的转换流水线 —— 想试 TypeScript 或 CSS 不必先跑一次构建',
        ),
      ),
      p(
        '需要 PostCSS、Sass 或其他 Vite 插件？把它们加到 ',
        a({ href: '/zh/docs/configuration' }, 'sitelo.config.js'),
        ' 的 ',
        code('vite'),
        ' 之下。',
      ),
      h2('默认零 JS'),
      ul(
        { class: 'docs-list' },
        li(
          '没有被引用的代码不会被产出。只在 ',
          code('data()'),
          ' 或 ',
          code('generateStaticParams'),
          ' 中引入的辅助模块不会进入 ',
          code('dist/'),
          ' —— 服务端密钥永远不会被误发布。',
        ),
        li(
          '页面上没有 ',
          code('<script>'),
          '，构建产物里就没有客户端 JavaScript。对大多数站点来说，静态 HTML 和 CSS 已经够用。',
        ),
        li(
          code('public/'),
          ' 会被原样复制（favicon、robots.txt，以及你不希望加哈希的静态图片）。',
        ),
        li('其他被引用的文件（图片、字体、视频，…）会被复制到 ', code('dist/'), '。'),
      ),
      h2('缺失资源校验'),
      p(
        '如果 ',
        code('<script src>'),
        ' 或样式表的 ',
        code('href'),
        ' 指向一个在 ',
        code('src/'),
        ' 和 ',
        code('public/'),
        ' 中都不存在的文件，构建就会失败。更想只收到一条警告？',
      ),
      codeBlock('sitelo.config.js', s.warn, 'javascript'),
    ],
  })
