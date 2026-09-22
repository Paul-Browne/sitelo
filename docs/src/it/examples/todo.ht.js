import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, examplesLayout, pageCodeTabs } from '../../lib/it.js'
import { todoSnippets } from '../../lib/snippets/examples-todo.js'

const s = todoSnippets('it')

export default () =>
  examplesLayout({
    title: 'App todo',
    description:
      'HTML statico con import dinamici inline — gli handler caricano /js/todo.js su richiesta.',
    activeHref: '/it/examples/todo',
    children: [
      p(
        'Una classica interfaccia interattiva senza framework di frontend. sitelo costruisce il guscio della pagina; gli attributi di evento chiamano ',
        code("import('/js/todo.js').then(…)"),
        ' così il modulo si carica solo quando serve. Sorgente completa in ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/todo',
            rel: 'noopener',
          },
          'examples/todo',
        ),
        '.',
      ),
      h2('Cosa ottieni'),
      ul(
        { class: 'docs-list' },
        li(
          'HTML statico con handler ',
          code('onsubmit'),
          ' / ',
          code('onload'),
          ' (e sugli elementi della lista)',
        ),
        li(
          code('src/js/todo.js'),
          ' — esporta ',
          code('hydrate'),
          ', ',
          code('handleSubmit'),
          ', ',
          code('handleChange'),
          ', ',
          code('handleRemove'),
        ),
        li(
          'sitelo individua gli ',
          code("import('/…')"),
          ' letterali nell’HTML e include il file nel bundle in ',
          code('dist/'),
          ' (vedi ',
          a({ href: '/it/docs/assets' }, 'Risorse'),
          ')',
        ),
      ),
      h2('Struttura del progetto'),
      codeBlock('project', s.structure, 'bash'),
      h2('1. Import inline nella pagina'),
      p(
        'Nessuno ',
        code('<script type="module" src>'),
        '. Gli handler sono attributi HTML che importano dinamicamente il modulo e chiamano un export, passando ',
        code('this'),
        ' (l’elemento). Così i moduli delle pagine restano liberi da API del browser (vedi le ',
        a({ href: '/it/docs/pages#limitazioni-di-jsx' }, 'limitazioni di JSX'),
        ').',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      h2('2. Handler esportati'),
      p(
        'Il modulo è un normale file ES sotto ',
        code('src/js/'),
        '. Gli elementi della lista creati a runtime usano lo stesso schema ',
        code("import('/js/todo.js').then(…)"),
        ' per ',
        code('onchange'),
        ' / ',
        code('onclick'),
        '.',
      ),
      codeBlock('src/js/todo.js', s.todoJs, 'javascript'),
      h2('3. Esecuzione'),
      codeBlock('shell', s.run, 'bash'),
      p(
        'Oppure ',
        code('npm run build'),
        ' e ospita ',
        code('dist/'),
        ' ovunque si servano file statici.',
      ),
      p(
        a({ href: '/it/docs/assets' }, 'Risorse e stili'),
        ' · ',
        a({ href: '/it/docs/pages#limitazioni-di-jsx' }, 'Limitazioni di JSX'),
        ' · ',
        a({ href: '/it/examples/basic' }, 'Sito di base'),
      ),
    ],
  })
