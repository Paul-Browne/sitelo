import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout, pageCodeTabs } from '../../lib/pl.js'
import { gettingStartedSnippets } from '../../lib/snippets/getting-started.js'

const s = gettingStartedSnippets('pl')

export default () =>
  docsLayout({
    title: 'Pierwsze kroki',
    description: 'Zainstaluj sitelo i zbuduj swoją pierwszą stronę statyczną.',
    activeHref: '/pl/docs',
    children: [
      p(
        'sitelo to generator stron statycznych bez konfiguracji, napędzany przez Vite. Zainstaluj jeden pakiet, pisz funkcje zwracające HTML i uruchom ',
        code('sitelo build'),
        '.',
      ),
      h2('Instalacja'),
      codeBlock('shell', s.install, 'bash'),
      p(
        'Wymaga Node 20.19+ (albo 22.12+). Vite jest dołączone — nie instalujesz go osobno.',
      ),
      h2('Twoja pierwsza strona'),
      p(
        'Utwórz ',
        code('src/index.ht.js'),
        ' (albo ',
        code('.ht.jsx'),
        '). Zalecamy ',
        a({ href: 'https://ht.js.org', rel: 'noopener' }, 'ht.js'),
        ':',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      h2('Uruchomienie'),
      codeBlock('shell', s.run, 'bash'),
      p(
        'To wypuszcza ',
        code('dist/index.html'),
        ' (z dodanym za Ciebie ',
        code('<!DOCTYPE html>'),
        ') oraz domyślny ',
        code('404.html'),
        '.',
      ),
      h2('Dalej'),
      ul(
        { class: 'docs-list' },
        li(
          a({ href: '/pl/docs/pages' }, 'Pisanie stron'),
          ' — literały szablonowe, JSX, moduły strukturalne',
        ),
        li(
          a({ href: '/pl/docs/routing' }, 'Routing'),
          ' — trasy oparte na plikach i ',
          code('generateStaticParams'),
        ),
        li(
          a({ href: '/pl/docs/data' }, 'Wczytywanie danych'),
          ' — ',
          code('data()'),
          ' i ',
          code('fetchWithCache'),
        ),
        li(
          a({ href: '/pl/docs/assets' }, 'Zasoby i style'),
          ' — frontowy JS/CSS kompilowany przez Vite (',
          code('src/js'),
          ', ',
          code('src/css'),
          ')',
        ),
        li(
          a({ href: '/pl/docs/configuration' }, 'Konfiguracja'),
          ' — ',
          code('sitelo.config.js'),
          ' i opcje Vite',
        ),
        li(
          a({ href: '/pl/docs/build-with-ai' }, 'Tworzenie z AI'),
          ' — ',
          code('llms.txt'),
          ', reguły projektu i wskazówki dla agentów',
        ),
      ),
    ],
  })
