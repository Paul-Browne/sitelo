import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, examplesLayout, pageCodeTabs } from '../../lib/zh.js'
import { todoSnippets } from '../../lib/snippets/examples-todo.js'

const s = todoSnippets('zh')

export default () =>
  examplesLayout({
    title: '待办应用',
    description:
      '静态 HTML 配内联动态导入 —— 处理函数按需加载 /js/todo.js。',
    activeHref: '/zh/examples/todo',
    children: [
      p(
        '不用前端框架的经典交互界面。sitelo 负责构建页面外壳；事件属性调用 ',
        code("import('/js/todo.js').then(…)"),
        '，因此模块只在需要时才加载。完整源码见 ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/todo',
            rel: 'noopener',
          },
          'examples/todo',
        ),
        '。',
      ),
      h2('你会得到什么'),
      ul(
        { class: 'docs-list' },
        li(
          '带 ',
          code('onsubmit'),
          ' / ',
          code('onload'),
          '（以及列表项）处理函数的静态 HTML',
        ),
        li(
          code('src/js/todo.js'),
          ' —— 导出 ',
          code('hydrate'),
          '、',
          code('handleSubmit'),
          '、',
          code('handleChange'),
          ' 和 ',
          code('handleRemove'),
        ),
        li(
          'sitelo 会识别 HTML 中字面量形式的 ',
          code("import('/…')"),
          '，并把该文件打包进 ',
          code('dist/'),
          '（见',
          a({ href: '/zh/docs/assets' }, '资源'),
          '）',
        ),
      ),
      h2('项目结构'),
      codeBlock('project', s.structure, 'bash'),
      h2('1. 页面中的内联导入'),
      p(
        '没有 ',
        code('<script type="module" src>'),
        '。处理函数就是 HTML 属性：动态导入模块，再调用某个导出，并把 ',
        code('this'),
        '（该元素）传进去。这样页面模块就不会碰到浏览器 API（见',
        a({ href: '/zh/docs/pages#jsx-的限制' }, 'JSX 的限制'),
        '）。',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      h2('2. 导出的处理函数'),
      p(
        '这个模块就是 ',
        code('src/js/'),
        ' 下一个普通的 ES 文件。运行时创建的列表项，对 ',
        code('onchange'),
        ' 和 ',
        code('onclick'),
        ' 使用同样的 ',
        code("import('/js/todo.js').then(…)"),
        ' 写法。',
      ),
      codeBlock('src/js/todo.js', s.todoJs, 'javascript'),
      h2('3. 运行'),
      codeBlock('shell', s.run, 'bash'),
      p(
        '或者执行 ',
        code('npm run build'),
        '，把 ',
        code('dist/'),
        ' 放到任何能提供静态文件的地方。',
      ),
      p(
        a({ href: '/zh/docs/assets' }, '资源与样式'),
        ' · ',
        a({ href: '/zh/docs/pages#jsx-的限制' }, 'JSX 的限制'),
        ' · ',
        a({ href: '/zh/examples/basic' }, '基础站点'),
      ),
    ],
  })
