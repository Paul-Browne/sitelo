import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout, pageCodeTabs } from '../../lib/pl.js'
import { assetsSnippets } from '../../lib/snippets/assets.js'

const s = assetsSnippets('pl')

export default () =>
  docsLayout({
    title: 'Zasoby i style',
    description:
      'Jak sitelo kompiluje frontowy JavaScript i CSS przez Vite — i trzyma kod serwerowy z dala od przeglądarki.',
    activeHref: '/pl/docs/assets',
    children: [
      p(
        'sitelo stoi na Vite, więc frontowy JavaScript i CSS kompilują się automatycznie. Umieść skrypty i style pod ',
        code('src/'),
        ' (na przykład w ',
        code('src/js'),
        ' i ',
        code('src/css'),
        '), podlinkuj je z HTML-a adresami względem katalogu głównego, a sitelo zajmie się resztą — TypeScriptem, importami CSS, pakowaniem i minifikacją.',
      ),
      h2('Układ projektu'),
      p(
        'Strony i zasoby dzielą ',
        code('src/'),
        '. Katalogi takie jak ',
        code('js/'),
        ' i ',
        code('css/'),
        ' to konwencje, nie wymogi — sitelo interesuje to, do czego odwołuje się Twój HTML, a nie nazwy katalogów.',
      ),
      codeBlock('project', s.layout, 'bash'),
      h2('Podlinkuj zasoby z HTML-a'),
      p(
        'Odwołuj się do plików ścieżkami względem katalogu głównego. To ',
        code('<script type="module">'),
        ' albo ',
        code('<link rel="stylesheet">'),
        ' mówi sitelo, żeby włączyć dany plik do buildu:',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      codeBlock('src/js/main.js', s.js, 'javascript'),
      codeBlock('src/css/styles.css', s.css, 'css'),
      h2('Co kompiluje Vite'),
      ul(
        { class: 'docs-list' },
        li(
          code('.js'),
          ' / ',
          code('.ts'),
          ' / ',
          code('.jsx'),
          ' / ',
          code('.tsx'),
          ' — pakowane jako moduły ES, TypeScript usuwany, importy wciągane',
        ),
        li(
          code('.css'),
          ' — przetwarzane i minifikowane; ',
          code('@import'),
          ' i względne odwołania ',
          code('url()'),
          ' są rozwiązywane',
        ),
        li(
          'Wszystko zaimportowane z podlinkowanego punktu wejścia (jak ',
          code('counter.ts'),
          ' powyżej) trafia do tej samej paczki',
        ),
        li(
          'W ',
          code('sitelo'),
          ' (dev) te same URL-e przechodzą przez potok transformacji Vite — bez osobnego buildu, żeby wypróbować TypeScript albo CSS',
        ),
      ),
      p(
        'Potrzebujesz PostCSS, Sassa albo innych wtyczek Vite? Dodaj je pod kluczem ',
        code('vite'),
        ' w ',
        a({ href: '/pl/docs/configuration' }, 'sitelo.config.js'),
        '.',
      ),
      h2('Zero JS domyślnie'),
      ul(
        { class: 'docs-list' },
        li(
          'Kod, do którego nic się nie odwołuje, nie jest wypuszczany. Pomocnik importowany tylko z ',
          code('data()'),
          ' albo ',
          code('generateStaticParams'),
          ' zostaje poza ',
          code('dist/'),
          ' — sekrety serwerowe nigdy nie trafiają online przez przypadek.',
        ),
        li(
          'Brak ',
          code('<script>'),
          ' na stronie oznacza brak JavaScriptu klienckiego w buildzie. Statyczny HTML i CSS wystarczą dla większości witryn.',
        ),
        li(
          code('public/'),
          ' jest kopiowane bez zmian (favikony, robots.txt, statyczne obrazy, których nie chcesz hashować).',
        ),
        li(
          'Pozostałe podlinkowane pliki (obrazy, fonty, wideo, …) są kopiowane do ',
          code('dist/'),
          '.',
        ),
      ),
      h2('Sprawdzanie brakujących zasobów'),
      p(
        code('<script src>'),
        ' albo ',
        code('href'),
        ' arkusza stylów wskazujący na plik, którego nie ma ani w ',
        code('src/'),
        ', ani w ',
        code('public/'),
        ', przerywa build. Wolisz ostrzeżenie?',
      ),
      codeBlock('sitelo.config.js', s.warn, 'javascript'),
    ],
  })
