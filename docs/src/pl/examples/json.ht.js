import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, examplesLayout, pageCodeTabs } from '../../lib/pl.js'
import { jsonSnippets } from '../../lib/snippets/examples-json.js'

const s = jsonSnippets('pl')

export default () =>
  examplesLayout({
    title: 'Lokalny JSON',
    description:
      'Katalog produktów zbudowany w całości z plików JSON w repozytorium — bez API, bez bazy danych.',
    activeHref: '/pl/examples/json',
    children: [
      p(
        'Treść, która żyje w repozytorium jako JSON, zamieniona w statyczne strony przez ',
        code('sitelo/data'),
        '. Bez API, bez bazy danych i bez JavaScriptu po stronie klienta. Pełne źródło w ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/json',
            rel: 'noopener',
          },
          'examples/json',
        ),
        '.',
      ),
      h2('Co dostajesz'),
      ul(
        { class: 'docs-list' },
        li('Stronę główną z każdą kategorią i każdym produktem'),
        li(
          code('/products/[slug]'),
          ' — jedną statyczną stronę na plik w ',
          code('data/products/'),
        ),
        li(
          code('/categories/[slug]'),
          ' — jedną stronę na klucz w ',
          code('data/categories.json'),
        ),
        li('Dodanie pliku JSON dodaje stronę; nie ma trasy do rejestrowania'),
        li('Zero wysłanego JS-a — pliki są czytane w Node podczas buildu'),
      ),
      h2('Układ projektu'),
      codeBlock('project', s.structure, 'bash'),
      p(
        'Dane leżą poza ',
        code('src/'),
        ', więc sitelo nigdy nie traktuje ich jak stron ani zasobów.',
      ),
      h2('1. Umieść treść w data/'),
      p(
        'Jeden plik na produkt. Nazwa pliku jest slugiem, więc ',
        code('aeron-chair.json'),
        ' staje się ',
        code('/products/aeron-chair'),
        ' — nic w pliku nie musi tego mówić:',
      ),
      codeBlock('data/products/aeron-chair.json', s.product, 'json'),
      p(
        'Kategorie to natomiast jeden plik: obiekt kluczowany slugiem, który ',
        code('readJsonCollection'),
        ' czyta tak samo jak kolekcję.',
      ),
      codeBlock('data/categories.json', s.categories, 'json'),
      h2('2. Czytaj je w jednym miejscu'),
      p(
        'Mały moduł wyłącznie serwerowy opakowuje odczyty. Nic w HTML-u się do niego nie odwołuje, więc nigdy nie trafia do przeglądarki — a ponieważ ',
        code('sitelo/data'),
        ' memoizuje per plik, każda strona wołająca te pomocniki i tak parsuje każdy plik JSON raz na cały build.',
      ),
      codeBlock('src/lib/catalogue.js', s.lib, 'javascript'),
      h2('3. Wypisz wszystko na stronie głównej'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.indexTemplate,
        ht: s.indexHt,
        jsx: s.indexJsx,
      }),
      h2('4. Jedna strona na plik JSON'),
      p(
        code('generateStaticParams'),
        ' zwraca podczas buildu slug na plik; ',
        code('data()'),
        ' wczytuje dla każdej strony pasujący wpis.',
      ),
      pageCodeTabs({
        file: 'src/products/[slug].ht.js',
        template: s.slugTemplate,
        ht: s.slugHt,
        jsx: s.slugJsx,
      }),
      h2('5. Edytuj i obserwuj'),
      codeBlock('terminal', s.build, 'bash'),
      p(
        'Pod ',
        code('sitelo'),
        ' zmiana ceny przeładowuje otwartą stronę — serwer deweloperski obserwuje pliki JSON, które strony rzeczywiście czytały. Zduplikowane slugi, brakujące pliki i wadliwy JSON przerywają build ze wskazaniem winnej ścieżki.',
      ),
      p(
        a({ href: '/pl/docs/data' }, 'Dokumentacja wczytywania danych'),
        ' · ',
        a({ href: '/pl/docs/routing' }, 'Dokumentacja routingu'),
        ' · ',
        a({ href: '/pl/docs/configuration' }, 'Dokumentacja konfiguracji'),
      ),
    ],
  })
