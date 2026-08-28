import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, examplesLayout, pageCodeTabs } from '../../lib/de.js'
import { todoSnippets } from '../../lib/snippets/examples-todo.js'

const s = todoSnippets('de')

export default () =>
  examplesLayout({
    title: 'Todo-App',
    description:
      'Statisches HTML mit inline dynamischen Importen — die Handler laden /js/todo.js bei Bedarf.',
    activeHref: '/de/examples/todo',
    children: [
      p(
        'Eine klassische interaktive Oberfläche ohne Frontend-Framework. sitelo baut die Seitenhülle; die Event-Attribute rufen ',
        code("import('/js/todo.js').then(…)"),
        ' auf, sodass das Modul erst bei Bedarf lädt. Vollständiger Quelltext in ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/todo',
            rel: 'noopener',
          },
          'examples/todo',
        ),
        '.',
      ),
      h2('Was du bekommst'),
      ul(
        { class: 'docs-list' },
        li(
          'Statisches HTML mit ',
          code('onsubmit'),
          '- / ',
          code('onload'),
          '-Handlern (und solchen an den Listeneinträgen)',
        ),
        li(
          code('src/js/todo.js'),
          ' — exportiert ',
          code('hydrate'),
          ', ',
          code('handleSubmit'),
          ', ',
          code('handleChange'),
          ' und ',
          code('handleRemove'),
        ),
        li(
          'sitelo erkennt wörtliche ',
          code("import('/…')"),
          ' im HTML und bündelt die Datei nach ',
          code('dist/'),
          ' (siehe ',
          a({ href: '/de/docs/assets' }, 'Assets'),
          ')',
        ),
      ),
      h2('Projektstruktur'),
      codeBlock('project', s.structure, 'bash'),
      h2('1. Inline-Importe in der Seite'),
      p(
        'Kein ',
        code('<script type="module" src>'),
        '. Die Handler sind HTML-Attribute, die das Modul dynamisch importieren und einen Export aufrufen — mit ',
        code('this'),
        ' (dem Element) als Argument. So bleiben Seitenmodule frei von Browser-APIs (siehe ',
        a({ href: '/de/docs/pages#jsx-einschraenkungen' }, 'JSX-Einschränkungen'),
        ').',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      h2('2. Exportierte Handler'),
      p(
        'Das Modul ist eine ganz normale ES-Datei unter ',
        code('src/js/'),
        '. Zur Laufzeit erzeugte Listeneinträge nutzen dasselbe Muster ',
        code("import('/js/todo.js').then(…)"),
        ' für ',
        code('onchange'),
        ' und ',
        code('onclick'),
        '.',
      ),
      codeBlock('src/js/todo.js', s.todoJs, 'javascript'),
      h2('3. Ausführen'),
      codeBlock('shell', s.run, 'bash'),
      p(
        'Oder ',
        code('npm run build'),
        ' und ',
        code('dist/'),
        ' überall dort hosten, wo statische Dateien ausgeliefert werden.',
      ),
      p(
        a({ href: '/de/docs/assets' }, 'Assets und Styling'),
        ' · ',
        a({ href: '/de/docs/pages#jsx-einschraenkungen' }, 'JSX-Einschränkungen'),
        ' · ',
        a({ href: '/de/examples/basic' }, 'Basis-Website'),
      ),
    ],
  })
