import { h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout, pageCodeTabs } from '../../lib/pl.js'
import { dataSnippets } from '../../lib/snippets/data.js'

const s = dataSnippets('pl')

export default () =>
  docsLayout({
    title: 'Wczytywanie danych',
    description:
      'data() w czasie buildu i fetchWithCache dla stron statycznych zasilanych API.',
    activeHref: '/pl/docs/data',
    children: [
      p(
        'Wyeksportuj funkcję ',
        code('data()'),
        ', a jej wynik pojawi się jako ',
        code('ctx.data'),
        ' w Twojej funkcji renderującej. Działa w czasie buildu, a w serwerze deweloperskim przy każdym żądaniu.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: s.dataTemplate,
        ht: s.dataHt,
        jsx: s.dataJsx,
      }),
      h2('fetchWithCache'),
      p(
        'Budujesz wiele stron na tym samym API? Zaimportuj ',
        code('fetchWithCache'),
        ' z sitelo:',
      ),
      codeBlock('src/blog/[slug].ht.js', s.cache, 'javascript'),
      h3('Opcje'),
      ul(
        { class: 'docs-list' },
        li(
          code('maxAge'),
          ' — czas życia cache w sekundach (domyślnie ',
          code('3600'),
          ')',
        ),
        li(
          code('cacheKey'),
          ' — własny klucz (domyślnie: skrót URL-a + metody + nagłówków + treści)',
        ),
        li(code('forceRefresh'), ' — pomiń cache'),
        li(
          code('cache'),
          ' — ',
          code("'auto'"),
          ' | ',
          code("'memory'"),
          ' | ',
          code("'fs'"),
          ' | ',
          code("'none'"),
        ),
      ),
      h3('Tryby cache'),
      ul(
        { class: 'docs-list' },
        li(
          code('auto'),
          ' (domyślny) — pamięć w dev, system plików w buildach produkcyjnych',
        ),
        li(
          code('memory'),
          ' — w obrębie procesu, czyszczony przy jego zakończeniu',
        ),
        li(code('fs'), ' — trwały, pod ', code('node_modules/.cache/')),
        li(code('none'), ' — zawsze pobieraj'),
      ),
      p(
        'Domyślnie buforowane są tylko żądania ',
        code('GET'),
        ' (podaj ',
        code('cacheKey'),
        ', by buforować inne metody). Odpowiedzi błędów nie są buforowane nigdy.',
      ),
      h2('Lokalne pliki JSON'),
      p(
        'Nie masz API? Trzymaj treść w repozytorium jako JSON i czytaj ją przez ',
        code('sitelo/data'),
        '.',
      ),
      codeBlock('project', s.jsonTree, 'bash'),
      codeBlock('src/blog/[slug].ht.js', s.jsonCollection, 'javascript'),
      p(
        'Ścieżki względne rozwiązują się od katalogu głównego projektu, więc ',
        code('data/posts'),
        ' znaczy to samo, skądkolwiek uruchamiasz CLI. ',
        code('readJson'),
        ' zwraca jeden sparsowany plik; ',
        code('readJsonCollection'),
        ' zwraca tablicę wpisów, każdy ze ',
        code('slug'),
        ' — z katalogu plików ',
        code('.json'),
        ' (jeden na wpis, slug z nazwy pliku) albo z jednego pliku zawierającego tablicę wpisów bądź obiekt kluczowany slugiem.',
      ),
      codeBlock('src/blog/[slug].ht.js', s.jsonSources, 'javascript'),
      h3('Opcje kolekcji'),
      ul(
        { class: 'docs-list' },
        li(
          code('slug'),
          ' — nazwa pola albo funkcja; domyślnie nazwa pliku, klucz obiektu albo własny ',
          code('slug'),
          ' / ',
          code('id'),
          ' wpisu',
        ),
        li(
          code('sort'),
          ' — nazwa pola (',
          code("'date'"),
          ' rosnąco, ',
          code("'-date'"),
          ' malejąco) albo funkcja porównująca',
        ),
        li(
          code('recursive'),
          ' — uwzględnij pliki ',
          code('.json'),
          ' w podkatalogach, ze slugiem z ich ścieżki',
        ),
        li(code('root'), ' — katalog, od którego rozwiązują się ścieżki względne'),
        li(
          code('cache'),
          ' — ',
          code("'auto'"),
          ' | ',
          code("'memory'"),
          ' | ',
          code("'none'"),
        ),
      ),
      p(
        'Odczyty są memoizowane per plik, więc build 500 stron parsuje każdy plik raz. Serwer deweloperski zamiast tego sprawdza czas modyfikacji i przeładowuje przeglądarkę, gdy zmieni się plik JSON, który strona czytała. Zduplikowane slugi, brakujące pliki i wadliwy JSON przerywają build, każdy ze wskazaniem ścieżki.',
      ),
    ],
  })
