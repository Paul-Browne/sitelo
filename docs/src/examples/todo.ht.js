import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, pageCodeTabs } from '../lib/code.js'
import { examplesLayout } from '../lib/layout.js'
import { todoSnippets } from '../lib/snippets/examples-todo.js'

const s = todoSnippets('en')

export default () =>
  examplesLayout({
    title: 'Todo app',
    description:
      'Static HTML with inline dynamic imports — handlers load /js/todo.js on demand.',
    activeHref: '/examples/todo',
    children: [
      p(
        'A classic interactive UI without a frontend framework. sitelo builds the page shell; event attributes call ',
        code("import('/js/todo.js').then(…)"),
        ' so the module loads only when needed. Full source in ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/todo',
            rel: 'noopener',
          },
          'examples/todo',
        ),
        '.',
      ),
      h2('What you get'),
      ul(
        { class: 'docs-list' },
        li('Static HTML with ', code('onsubmit'), ' / ', code('onload'), ' (and list item) handlers'),
        li(
          code('src/js/todo.js'),
          ' — exported ',
          code('hydrate'),
          ', ',
          code('handleSubmit'),
          ', ',
          code('handleChange'),
          ', ',
          code('handleRemove'),
        ),
        li(
          'sitelo discovers literal ',
          code('import(\'/…\')'),
          ' in the HTML and bundles the file into ',
          code('dist/'),
          ' (see ',
          a({ href: '/docs/assets' }, 'Assets'),
          ')',
        ),
      ),
      h2('Project layout'),
      codeBlock('project', s.structure, 'bash'),
      h2('1. Inline imports in the page'),
      p(
        'No ',
        code('<script type="module" src>'),
        '. Handlers are HTML attributes that dynamically import the module and call an export, passing ',
        code('this'),
        ' (the element). That keeps page modules free of browser APIs (see ',
        a({ href: '/docs/pages#jsx-limitations' }, 'JSX limitations'),
        ').',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      h2('2. Exported handlers'),
      p(
        'The module is a normal ES file under ',
        code('src/js/'),
        '. List items created at runtime use the same ',
        code('import(\'/js/todo.js\').then(…)'),
        ' pattern for ',
        code('onchange'),
        ' / ',
        code('onclick'),
        '.',
      ),
      codeBlock('src/js/todo.js', s.todoJs, 'javascript'),
      h2('3. Run'),
      codeBlock('shell', s.run, 'bash'),
      p(
        'Or ',
        code('npm run build'),
        ' and host ',
        code('dist/'),
        ' anywhere static files are served.',
      ),
      p(
        a({ href: '/docs/assets' }, 'Assets & styling'),
        ' · ',
        a({ href: '/docs/pages#jsx-limitations' }, 'JSX limitations'),
        ' · ',
        a({ href: '/examples/basic' }, 'Basic site'),
      ),
    ],
  })
