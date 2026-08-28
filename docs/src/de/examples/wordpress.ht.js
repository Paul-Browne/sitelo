import { a, h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, examplesLayout, pageCodeTabs } from '../../lib/de.js'
import { wordpressSnippets } from '../../lib/snippets/examples-wordpress.js'

const s = wordpressSnippets('de')

export default () =>
  examplesLayout({
    title: 'WordPress',
    description:
      'Zieh eine ganze WordPress-Website über die REST-API ab — Tausende Beiträge, statisch mit sitelo erzeugt.',
    activeHref: '/de/examples/wordpress',
    children: [
      p(
        'Behandle WordPress als Headless-CMS und ',
        'zieh die ganze Website ab',
        ': paginiere durch ',
        code('/wp-json/wp/v2/posts'),
        ', erzeuge eine HTML-Datei pro Slug und cache die API-Antworten zwischen den Builds.',
      ),
      h2('Was du bekommst'),
      ul(
        { class: 'docs-list' },
        li('Eine Startseite mit den neuesten Beiträgen'),
        li(code('/blog'), ' — vollständiges Archiv aller Beiträge'),
        li(
          code('/blog/[slug]'),
          ' — eine statische HTML-Seite pro Beitrag (trägt auch bei Tausenden von Beiträgen)',
        ),
        li(
          code('fetchWithCache'),
          ', damit erneute Builds die WP-Antworten wiederverwenden, statt alles neu zu laden',
        ),
      ),
      h2('Projektstruktur'),
      codeBlock('project', s.structure, 'bash'),
      codeBlock('sitelo.config.js', s.config, 'javascript'),
      h2('1. Auf deine WordPress-Website zeigen'),
      p(
        'Die REST-API ist in modernem WordPress standardmäßig aktiv. Prüfe das unter ',
        code('https://deine-website.com/wp-json/wp/v2/posts'),
        '.',
      ),
      p(
        'Setze ',
        code('WP_URL'),
        ' in der Umgebung (oder schreib es beim Ausprobieren fest hinein):',
      ),
      codeBlock('.env', s.env, 'bash'),
      h2('2. Gemeinsame WordPress-Helfer'),
      p(
        code('getAllPosts()'),
        ' liest ',
        code('X-WP-TotalPages'),
        ' und läuft jede Seite ab (WordPress deckelt ',
        code('per_page'),
        ' bei 100). Lass ',
        code('_embed'),
        ' beim Sammeln der Slugs weg — hole die Embeds nur für einzelne Beiträge.',
      ),
      codeBlock('src/lib/wordpress.js', s.wpLib, 'javascript'),
      h2('3. Startseite'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.homeTemplate,
        ht: s.homeHt,
        jsx: s.homeJsx,
      }),
      h2('4. Blog-Übersicht'),
      p(
        'Nutze ',
        code('getAllPosts()'),
        ', damit das Archiv nicht bei 50–100 Einträgen endet.',
      ),
      pageCodeTabs({
        file: 'src/blog/index.ht.js',
        template: s.blogIndexTemplate,
        ht: s.blogIndexHt,
        jsx: s.blogIndexJsx,
      }),
      h2('5. Jeden Beitrag zu einer statischen Seite machen'),
      p(
        code('generateStaticParams'),
        ' muss ',
        'jeden',
        ' Slug zurückgeben, den du in ',
        code('dist/'),
        ' haben willst. Paginiere die API hier — ruf nicht einmal ',
        code('getPosts({ perPage: 100 })'),
        ' auf und höre dann auf.',
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
        'Der erste Build geht einmal durch WordPress und füllt den Fetch-Cache. Spätere Builds greifen auf die gecachten Listen- und Detailantworten zurück (',
        code("cache: 'auto'"),
        ' → Dateisystem in Produktion), bis ',
        code('maxAge'),
        ' abläuft. Erhöhe ',
        code('renderConcurrency'),
        ' in ',
        code('sitelo.config.js'),
        ', wenn du Tausende Beitragsseiten renderst.',
      ),
      h2('Hinweise'),
      h3('HTML aus WordPress'),
      p(
        code('title.rendered'),
        ' und ',
        code('content.rendered'),
        ' sind HTML-Strings aus WP. Setz sie unverändert in dein Template (wie oben), oder bereinige sie, wenn du dem CMS nicht vollständig traust.',
      ),
      h3('Private Inhalte'),
      p(
        'Öffentliche REST-Routen geben nur veröffentlichte Beiträge preis. Für Entwürfe oder eigene Authentifizierung übergib Header im zweiten Argument von ',
        code('fetchWithCache'),
        ' (das übliche ',
        code('fetch'),
        '-Init) und nutze einen stabilen ',
        code('cacheKey'),
        '.',
      ),
      p(
        a({ href: '/de/docs/data' }, 'Doku zum Daten laden'),
        ' · ',
        a({ href: '/de/docs/routing' }, 'Routing-Doku'),
      ),
    ],
  })
