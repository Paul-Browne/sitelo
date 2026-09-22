import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, examplesLayout } from '../../lib/pl.js'

export default () =>
  examplesLayout({
    title: 'Przykłady',
    description: 'Praktyczne przepisy na sitelo — WordPress, API i więcej.',
    activeHref: '/pl/examples',
    children: [
      p(
        'Przepisy krok po kroku na budowanie prawdziwych witryn z sitelo. Każdy przykład pokazuje strukturę projektu, wczytywanie danych i strony, które byś napisał.',
      ),
      h2('Dostępne'),
      ul(
        { class: 'docs-list' },
        li(
          a({ href: '/pl/examples/basic' }, 'Podstawowa strona'),
          ' — minimalny projekt plus konfiguracje statycznego wdrożenia dla Netlify, Vercela, Cloudflare Pages i AWS Amplify.',
        ),
        li(
          a({ href: '/pl/examples/todo' }, 'Aplikacja todo'),
          ' — statyczny HTML z wbudowanymi handlerami ',
          code("import('/js/todo.js')"),
          ' (dodaj / odhacz / usuń, ',
          code('localStorage'),
          ').',
        ),
        li(
          a({ href: '/pl/examples/blog' }, 'Blog w Markdownie'),
          ' — katalog plików ',
          code('.md'),
          ' renderowanych do statycznych stron, z kanałem RSS i zerem JS-a po stronie klienta.',
        ),
        li(
          a({ href: '/pl/examples/json' }, 'Lokalny JSON'),
          ' — katalog zbudowany z plików ',
          code('.json'),
          ' w repozytorium: jedna strona na plik, bez API i bez bazy danych.',
        ),
        li(
          a({ href: '/pl/examples/wordpress' }, 'WordPress'),
          ' — pobierz wpisy z REST API WordPressa przez ',
          code('fetchWithCache'),
          ', wypisz je i wygeneruj statyczne strony wpisów.',
        ),
        li(
          a({ href: '/pl/examples/islands' }, 'Wyspy serwerowe'),
          ' — statyczne strony plus host Node renderujący wyspy w chwili żądania.',
        ),
      ),
      h2('Wkrótce'),
      ul({ class: 'docs-list' }, li('Headless CMS / Contentful')),
    ],
  })
