import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout, pageCodeTabs } from '../../lib/pl.js'
import { enhanceSnippets } from '../../lib/snippets/enhance.js'

const s = enhanceSnippets('pl')

export default () =>
  docsLayout({
    title: 'Ulepszenia',
    description:
      'Przekaż znaczniki wyrenderowane na serwerze małemu modułowi w przeglądarce, ładowanemu tylko na stronach, które go używają.',
    activeHref: '/pl/docs/enhance',
    children: [
      p(
        'Część interaktywności musi działać w przeglądarce: licznik, przycisk kopiowania, formularz, który sprawdza się w trakcie pisania. ',
        code('enhance()'),
        ' oznacza znaczniki, które ma przejąć moduł. Serwer renderuje HTML jak zwykle, więc działa on, zanim dotrze jakikolwiek JavaScript, a przeglądarka ładuje moduł tylko na stronach, które go używają. Moduł dodaje zachowanie do DOM, który zastaje. Bez hydratacji i bez runtime’u frameworka.',
      ),
      p(
        a({ href: '/pl/docs/islands' }, 'Wyspa serwerowa'),
        ' renderuje fragment strony na serwerze, gdy ktoś ją odwiedza. Ulepszenie uruchamia kod dla fragmentu w przeglądarce. Obie przyjmują te same argumenty i działają razem.',
      ),
      h2('Napisz moduł'),
      p(
        'Ulepszenie to zwykły moduł, w dowolnym miejscu pod ',
        code('src/'),
        '. Jego domyślny eksport dostaje element i propsy. Odczytaj, czego potrzebujesz, ze znaczników, które serwer już wyrenderował:',
      ),
      codeBlock('src/client/counter.js', s.counterModule, 'javascript'),
      p(
        'TypeScript też działa. Otypuj funkcję przez ',
        code('Enhancer<Props>'),
        ' z ',
        code('sitelo/enhance/client'),
        '.',
      ),
      h2('Umieść go na stronie'),
      p(
        'Zaimportuj ',
        code('enhance()'),
        ' z ',
        code('sitelo/enhance'),
        '. Przyjmuje te same argumenty co ',
        code('island()'),
        ': nazwę, propsy, HTML i opcje. HTML trafia do ',
        code('<div>'),
        ', który dostaje moduł.',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      p(
        'JSX escapuje napis zwrócony przez funkcję, dlatego karta JSX rozkłada zamiast tego ',
        code('enhanceAttributes()'),
        ' na element. Więcej o tym niżej.',
      ),
      h2('Zarejestruj moduły'),
      p(
        'Skrypt dołączony do strony przekazuje do ',
        code('mountEnhancements()'),
        ' mapę nazw na moduły:',
      ),
      codeBlock('src/enhance.js', s.registry, 'javascript'),
      p(
        'Mapę piszesz ręcznie, celowo. Każdy ',
        code('import()'),
        ' to zwykły import dynamiczny, więc build daje każdemu modułowi osobny chunk, a strona pobiera tylko te, które wymieniają jej elementy. W trybie dev Vite serwuje je bez zmian. Ponieważ to zwykły kod, TypeScript go sprawdza, a knip za nim podąża.',
      ),
      p(
        'Przekaż ',
        code('when'),
        ', by zdecydować, kiedy moduł zostanie zaimportowany. Przyjmuje te same wartości co wyspa:',
      ),
      codeBlock('enhance-when', s.strategy, 'js'),
      ul(
        { class: 'docs-list' },
        li(code("'load'"), ' (domyślnie) — zaraz po załadowaniu strony'),
        li(code("'idle'"), ' — przez ', code('requestIdleCallback'), ' (awaryjnie timeout)'),
        li(
          code("'visible'"),
          ' — gdy element wjedzie w pole widzenia, przez IntersectionObserver. ',
          code('rootMargin'),
          ' zaczyna wcześniej, domyślnie ',
          code("'200px'"),
        ),
      ),
      h2('Twój własny element'),
      p(
        code('enhance()'),
        ' otacza znaczniki elementem ',
        code('<div>'),
        '. Gdy liczy się sam element, na przykład ',
        code('<form>'),
        ' z własnym ',
        code('action'),
        ', nałóż na niego atrybuty przez ',
        code('enhanceAttributes(name, props, options)'),
        '. To obiekt atrybutów, więc javascript-to-html i JSX przyjmują go jako atrybuty, a w template literalu zamienia się w tekst atrybutów:',
      ),
      pageCodeTabs({
        file: 'src/search.ht.js',
        template: s.formTemplate,
        ht: s.formHt,
        jsx: s.formJsx,
      }),
      p('Moduł dostaje sam formularz:'),
      codeBlock('src/client/search.js', s.searchModule, 'javascript'),
      h2('Co przekazywać w propsach'),
      p(
        'Propsy to JSON zapisany w stronie i przekazany modułowi jako drugi argument. Każdy element na stronie niesie własną kopię, więc przekazuj tylko to, czego znaczniki jeszcze nie mówią: ustawienie bez naturalnego miejsca w HTML, jak ',
        code('minLength'),
        ' wyżej. Wartość, którą strona pokazuje, jak początkowa liczba licznika, lepiej odczytać z DOM, żeby obie nie mogły się rozjechać. Duże dane należą do samego HTML albo do pliku, który moduł pobiera.',
      ),
      p(
        'W przeciwieństwie do propsów wyspy te nigdy nie wracają na serwer, więc nie ma czego podpisywać. Są jednak w źródle strony, więc nie umieszczaj w nich sekretów.',
      ),
      h2('Sprawdzane przy buildzie'),
      p(
        'Build odczytuje mapę z twoich wywołań ',
        code('mountEnhancements()'),
        ' i kończy się błędem na stronie, która wymienia ulepszenie nieobecne w mapie:',
      ),
      codeBlock('sitelo build', s.buildError, 'text'),
      p(
        code("missingAssets: 'warn'"),
        ' zamienia to w ostrzeżenie, tak jak dla brakującego skryptu, a ',
        code('sitelo'),
        ' (dev) ostrzega przy renderowaniu każdej strony. Build musi umieć odczytać mapę, więc zapisz ją jako literał obiektu w wywołaniu albo jako ',
        code('const'),
        ' w tym samym pliku. Mapy składanej w czasie działania, przez spread albo importowanej z innego modułu, nie da się odczytać i wtedy nic nie jest sprawdzane. Ulepszenia wewnątrz wysp serwerowych renderują się w chwili żądania, więc build ich też nie widzi.',
      ),
      h2('Stan i błędy'),
      p(
        'Atrybut ',
        code('data-sitelo-enhance-state'),
        ' każdego elementu przechodzi przez ',
        code('pending'),
        ' (czeka na swój moment), ',
        code('loading'),
        ' i ',
        code('ready'),
        '. Jeśli moduł się nie załaduje albo rzuci wyjątek, stan to ',
        code('error'),
        ', znaczniki z serwera zostają bez zmian, a błąd trafia do ',
        code('mountEnhancements(modules, { onError })'),
        ' albo do konsoli. Użyj stanu w CSS, gdy strona ma się zmienić po załadowaniu modułu:',
      ),
      codeBlock('styles.css', s.stateCss, 'css'),
      h2('Warto wiedzieć'),
      ul(
        { class: 'docs-list' },
        li(
          'To samo ulepszenie może pojawić się na stronie dowolnie wiele razy. Moduł pobiera się raz i uruchamia raz na każdy element, więc trzymaj stan elementu wewnątrz funkcji i szukaj przez ',
          code('element.querySelector()'),
          ', a nie w całym dokumencie.',
        ),
        li(
          'Ulepszenie wewnątrz wyspy serwerowej jest montowane, gdy dotrze HTML wyspy: loader wysp wysyła ',
          code('sitelo:island-load'),
          ', a ',
          code('mountEnhancements()'),
          ' go nasłuchuje. Ładuj oba loadery z tego samego skryptu.',
        ),
        li(
          code('mountEnhancements()'),
          ' nigdy nie uruchamia modułu dwa razy na tym samym elemencie, więc można go bezpiecznie wywołać ponownie po samodzielnym dodaniu znaczników.',
        ),
        li(
          'Chcesz frameworka w jednym pudełku? Zamontuj go z modułu, na przykład przez ',
          code('createRoot(element).render(<Chart {...props} />)'),
          '. Pobiorą go tylko strony z tym pudełkiem.',
        ),
      ),
    ],
  })
