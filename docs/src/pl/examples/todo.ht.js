import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, examplesLayout, pageCodeTabs } from '../../lib/pl.js'
import { todoSnippets } from '../../lib/snippets/examples-todo.js'

const s = todoSnippets('pl')

export default () =>
  examplesLayout({
    title: 'Aplikacja todo',
    description:
      'Statyczny HTML z wbudowanymi importami dynamicznymi — handlery ładują /js/todo.js na żądanie.',
    activeHref: '/pl/examples/todo',
    children: [
      p(
        'Klasyczny interaktywny interfejs bez frameworka frontowego. sitelo buduje szkielet strony; atrybuty zdarzeń wołają ',
        code("import('/js/todo.js').then(…)"),
        ', więc moduł ładuje się tylko wtedy, gdy jest potrzebny. Pełne źródło w ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/todo',
            rel: 'noopener',
          },
          'examples/todo',
        ),
        '.',
      ),
      h2('Co dostajesz'),
      ul(
        { class: 'docs-list' },
        li(
          'Statyczny HTML z handlerami ',
          code('onsubmit'),
          ' / ',
          code('onload'),
          ' (oraz na elementach listy)',
        ),
        li(
          code('src/js/todo.js'),
          ' — eksportuje ',
          code('hydrate'),
          ', ',
          code('handleSubmit'),
          ', ',
          code('handleChange'),
          ', ',
          code('handleRemove'),
        ),
        li(
          'sitelo wykrywa dosłowne ',
          code("import('/…')"),
          ' w HTML-u i wciąga plik do paczki w ',
          code('dist/'),
          ' (zobacz ',
          a({ href: '/pl/docs/assets' }, 'Zasoby'),
          ')',
        ),
      ),
      h2('Układ projektu'),
      codeBlock('project', s.structure, 'bash'),
      h2('1. Wbudowane importy na stronie'),
      p(
        'Żadnego ',
        code('<script type="module" src>'),
        '. Handlery to atrybuty HTML, które dynamicznie importują moduł i wołają eksport, przekazując ',
        code('this'),
        ' (element). Dzięki temu moduły stron są wolne od API przeglądarki (zobacz ',
        a({ href: '/pl/docs/pages#ograniczenia-jsx' }, 'ograniczenia JSX'),
        ').',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      h2('2. Eksportowane handlery'),
      p(
        'Moduł to zwykły plik ES pod ',
        code('src/js/'),
        '. Elementy listy tworzone w czasie działania używają tego samego wzorca ',
        code("import('/js/todo.js').then(…)"),
        ' dla ',
        code('onchange'),
        ' / ',
        code('onclick'),
        '.',
      ),
      codeBlock('src/js/todo.js', s.todoJs, 'javascript'),
      h2('3. Uruchomienie'),
      codeBlock('shell', s.run, 'bash'),
      p(
        'Albo ',
        code('npm run build'),
        ' i hostuj ',
        code('dist/'),
        ' wszędzie tam, gdzie serwowane są pliki statyczne.',
      ),
      p(
        a({ href: '/pl/docs/assets' }, 'Zasoby i style'),
        ' · ',
        a({ href: '/pl/docs/pages#ograniczenia-jsx' }, 'Ograniczenia JSX'),
        ' · ',
        a({ href: '/pl/examples/basic' }, 'Podstawowa strona'),
      ),
    ],
  })
