import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout } from '../../lib/pl.js'
import { cliSnippets } from '../../lib/snippets/cli.js'

const s = cliSnippets('pl')

export default () =>
  docsLayout({
    title: 'CLI',
    description: 'sitelo dev, build, preview i najczęstsze flagi.',
    activeHref: '/pl/docs/cli',
    children: [
      p(
        'CLI ',
        code('sitelo'),
        ' opakowuje dołączone Vite i automatycznie wstrzykuje wtyczkę stron HTML.',
      ),
      h2('Polecenia'),
      codeBlock('shell', s.commands, 'bash'),
      ul(
        { class: 'docs-list' },
        li(
          code('dev'),
          ' — prawdziwy render SSR na żądanie, łącznie z trasami dynamicznymi, plus mały pasek deweloperski',
        ),
        li(
          code('build'),
          ' — statyczny HTML w ',
          code('dist/'),
          ' (albo w Twoim ',
          code('outDir'),
          ')',
        ),
        li(code('preview'), ' — serwuj build produkcyjny lokalnie'),
        li(
          code('lighthouse'),
          ' — audytuj build produkcyjny (wymaga peer dependency ',
          code('lighthouse'),
          ')',
        ),
      ),
      p(
        'Wyłącz pasek przez ',
        code('devToolbar: false'),
        ' w ',
        code('sitelo.config.js'),
        ' — zobacz ',
        a({ href: '/pl/docs/configuration' }, 'Konfigurację'),
        '.',
      ),
      h2('Przydatne flagi'),
      codeBlock('shell', s.flags, 'bash'),
      ul(
        { class: 'docs-list' },
        li(code('--port'), ' / ', code('--host'), ' / ', code('--open'), ' — serwer'),
        li(
          code('--outDir'),
          ' / ',
          code('--emptyOutDir'),
          ' / ',
          code('--base'),
          ' — build',
        ),
        li(
          code('--root'),
          ' — katalog główny projektu (wygodne dla witryny w ',
          code('docs/'),
          ')',
        ),
        li(code('--config'), ' — własny plik konfiguracyjny Vite'),
        li(code('--mode'), ' / ', code('--logLevel'), ' / ', code('--debug')),
      ),
      p(
        'Dla wszystkiego, czego używasz w wielu poleceniach, wybieraj opcje Vite w ',
        code('sitelo.config.js'),
        ' pod kluczem ',
        code('vite'),
        '.',
      ),
      h2('Szukanie nieużywanego kodu'),
      p(
        a({ href: 'https://knip.dev' }, 'knip'),
        ' znajduje pliki, eksporty i zależności, z których nikt nie korzysta. W projekcie sitelo potrzebuje jednej podpowiedzi: strony i wyspy są odkrywane z systemu plików, więc nikt ich nie importuje, a bez dodatkowej informacji knip zgłasza całą witrynę jako nieużywane pliki.',
      ),
      codeBlock('shell', s.knipInstall, 'bash'),
      codeBlock('knip.js', s.knip, 'javascript'),
      codeBlock('shell', s.knipRun, 'bash'),
      p(
        code('knipConfig()'),
        ' czyta Twój ',
        code('sitelo.config.js'),
        ' i oznacza strony oraz wyspy jako punkty wejścia dokładnie tak, jak odkrywa je build — działają ',
        code('pagesDir'),
        ', ',
        code('pageExtensions'),
        ', ',
        code('include'),
        ' i ',
        code('exclude'),
        '. To, co zostaje w raporcie, to kod, do którego witryna naprawdę nigdy nie sięga.',
      ),
      p(
        'Jednego nie zobaczy: skryptu klienckiego, do którego strona odwołuje się przez URL, a nie importem, jak ',
        code('<script src="/js/app.js">'),
        '. Takie wypisz samodzielnie, a obok podaj cokolwiek innego, co knip przyjmuje — trafia to do wyniku. Końcowy ',
        code('!'),
        ' to znacznik knipa dla kodu produkcyjnego, a skrypt wysłany do przeglądarki właśnie nim jest.',
      ),
      codeBlock('knip.js', s.knipEntry, 'javascript'),
    ],
  })
