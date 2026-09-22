import { a, h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, examplesLayout, pageCodeTabs } from '../../lib/pl.js'
import { wordpressSnippets } from '../../lib/snippets/examples-wordpress.js'

const s = wordpressSnippets('pl')

export default () =>
  examplesLayout({
    title: 'WordPress',
    description:
      'Pobierz całą witrynę WordPress przez REST API — tysiące wpisów, wygenerowanych statycznie przez sitelo.',
    activeHref: '/pl/examples/wordpress',
    children: [
      p(
        'Potraktuj WordPressa jak headless CMS i ',
        'pobierz całą witrynę',
        ': przejdź stronicowaniem przez ',
        code('/wp-json/wp/v2/posts'),
        ', wygeneruj jeden plik HTML na slug i buforuj odpowiedzi API między buildami.',
      ),
      h2('Co dostajesz'),
      ul(
        { class: 'docs-list' },
        li('Stronę główną z listą najnowszych wpisów'),
        li(code('/blog'), ' — pełne archiwum wszystkich wpisów'),
        li(
          code('/blog/[slug]'),
          ' — jedną statyczną stronę HTML na wpis (działa przy tysiącach wpisów)',
        ),
        li(
          code('fetchWithCache'),
          ', żeby kolejne buildy używały odpowiedzi WP zamiast pobierać wszystko od nowa',
        ),
      ),
      h2('Układ projektu'),
      codeBlock('project', s.structure, 'bash'),
      codeBlock('sitelo.config.js', s.config, 'javascript'),
      h2('1. Wskaż swoją witrynę WordPress'),
      p(
        'W nowoczesnym WordPressie REST API jest domyślnie włączone. Sprawdź to pod ',
        code('https://your-site.com/wp-json/wp/v2/posts'),
        '.',
      ),
      p(
        'Ustaw ',
        code('WP_URL'),
        ' w środowisku (albo wpisz na sztywno, póki eksperymentujesz):',
      ),
      codeBlock('.env', s.env, 'bash'),
      h2('2. Wspólne pomocniki WordPressa'),
      p(
        code('getAllPosts()'),
        ' czyta ',
        code('X-WP-TotalPages'),
        ' i przechodzi każdą stronę (WordPress ogranicza ',
        code('per_page'),
        ' do 100). Przy zbieraniu slugów pomiń ',
        code('_embed'),
        ' — osadzenia pobieraj tylko dla pojedynczych wpisów.',
      ),
      codeBlock('src/lib/wordpress.js', s.wpLib, 'javascript'),
      h2('3. Strona główna'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.homeTemplate,
        ht: s.homeHt,
        jsx: s.homeJsx,
      }),
      h2('4. Indeks bloga'),
      p(
        'Użyj ',
        code('getAllPosts()'),
        ', żeby archiwum nie zatrzymało się na 50–100 pozycjach.',
      ),
      pageCodeTabs({
        file: 'src/blog/index.ht.js',
        template: s.blogIndexTemplate,
        ht: s.blogIndexHt,
        jsx: s.blogIndexJsx,
      }),
      h2('5. Pobierz każdy wpis do statycznych stron'),
      p(
        code('generateStaticParams'),
        ' musi zwrócić ',
        'każdy',
        ' slug, który chcesz mieć w ',
        code('dist/'),
        '. Stronicuj tu API — nie wołaj ',
        code('getPosts({ perPage: 100 })'),
        ' raz i na tym nie poprzestawaj.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: s.blogPostTemplate,
        ht: s.blogPostHt,
        jsx: s.blogPostJsx,
      }),
      h2('6. Build'),
      codeBlock('shell', s.build, 'bash'),
      p(
        'Pierwszy build raz przechodzi przez WordPressa i wypełnia cache pobrań. Kolejne buildy korzystają z zapisanych odpowiedzi list i szczegółów (',
        code("cache: 'auto'"),
        ' → system plików na produkcji), dopóki nie minie ',
        code('maxAge'),
        '. Podnieś ',
        code('renderConcurrency'),
        ' w ',
        code('sitelo.config.js'),
        ', jeśli renderujesz tysiące stron wpisów.',
      ),
      h2('Uwagi'),
      h3('HTML z WordPressa'),
      p(
        code('title.rendered'),
        ' i ',
        code('content.rendered'),
        ' to ciągi HTML prosto z WP. Wstaw je do szablonu bez zmian (jak wyżej) albo je odkaź, jeśli nie ufasz CMS-owi do końca.',
      ),
      h3('Treści prywatne'),
      p(
        'Publiczne trasy REST wystawiają tylko opublikowane wpisy. Dla szkiców albo własnej autoryzacji przekaż nagłówki w drugim argumencie ',
        code('fetchWithCache'),
        ' (zwykły init ',
        code('fetch'),
        ') i użyj stabilnego ',
        code('cacheKey'),
        '.',
      ),
      p(
        a({ href: '/pl/docs/data' }, 'Dokumentacja wczytywania danych'),
        ' · ',
        a({ href: '/pl/docs/routing' }, 'Dokumentacja routingu'),
      ),
    ],
  })
