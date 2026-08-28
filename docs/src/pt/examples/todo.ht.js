import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, examplesLayout, pageCodeTabs } from '../../lib/pt.js'
import { todoSnippets } from '../../lib/snippets/examples-todo.js'

const s = todoSnippets('pt')

export default () =>
  examplesLayout({
    title: 'App de tarefas',
    description:
      'HTML estático com imports dinâmicos em linha — os handlers carregam /js/todo.js a pedido.',
    activeHref: '/pt/examples/todo',
    children: [
      p(
        'Uma interface interativa clássica sem framework de frontend. O sitelo constrói a estrutura da página; os atributos de evento chamam ',
        code("import('/js/todo.js').then(…)"),
        ', por isso o módulo só carrega quando é preciso. Código completo em ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/todo',
            rel: 'noopener',
          },
          'examples/todo',
        ),
        '.',
      ),
      h2('O que obténs'),
      ul(
        { class: 'docs-list' },
        li(
          'HTML estático com handlers ',
          code('onsubmit'),
          ' / ',
          code('onload'),
          ' (e também nos itens da lista)',
        ),
        li(
          code('src/js/todo.js'),
          ' — exporta ',
          code('hydrate'),
          ', ',
          code('handleSubmit'),
          ', ',
          code('handleChange'),
          ' e ',
          code('handleRemove'),
        ),
        li(
          'o sitelo deteta os ',
          code("import('/…')"),
          ' literais no HTML e empacota o ficheiro em ',
          code('dist/'),
          ' (vê ',
          a({ href: '/pt/docs/assets' }, 'Recursos'),
          ')',
        ),
      ),
      h2('Estrutura do projeto'),
      codeBlock('project', s.structure, 'bash'),
      h2('1. Imports em linha na página'),
      p(
        'Sem ',
        code('<script type="module" src>'),
        '. Os handlers são atributos HTML que importam o módulo dinamicamente e chamam um export, passando ',
        code('this'),
        ' (o elemento). Assim os módulos de página ficam livres de APIs do navegador (vê ',
        a({ href: '/pt/docs/pages#limitacoes-de-jsx' }, 'limitações de JSX'),
        ').',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      h2('2. Handlers exportados'),
      p(
        'O módulo é um ficheiro ES normal dentro de ',
        code('src/js/'),
        '. Os itens de lista criados em tempo de execução usam o mesmo padrão ',
        code("import('/js/todo.js').then(…)"),
        ' para ',
        code('onchange'),
        ' e ',
        code('onclick'),
        '.',
      ),
      codeBlock('src/js/todo.js', s.todoJs, 'javascript'),
      h2('3. Executar'),
      codeBlock('shell', s.run, 'bash'),
      p(
        'Ou ',
        code('npm run build'),
        ' e aloja ',
        code('dist/'),
        ' em qualquer sítio que sirva ficheiros estáticos.',
      ),
      p(
        a({ href: '/pt/docs/assets' }, 'Recursos e estilos'),
        ' · ',
        a({ href: '/pt/docs/pages#limitacoes-de-jsx' }, 'Limitações de JSX'),
        ' · ',
        a({ href: '/pt/examples/basic' }, 'Site básico'),
      ),
    ],
  })
