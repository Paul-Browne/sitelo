import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout, pageCodeTabs } from '../../lib/de.js'
import { assetsSnippets } from '../../lib/snippets/assets.js'

const s = assetsSnippets('de')

export default () =>
  docsLayout({
    title: 'Assets und Styling',
    description:
      'Wie sitelo Frontend-JavaScript und -CSS mit Vite kompiliert — und Server-Code aus dem Browser heraushält.',
    activeHref: '/de/docs/assets',
    children: [
      p(
        'sitelo baut auf Vite auf, deshalb werden Frontend-JavaScript und -CSS automatisch kompiliert. Lege Skripte und Styles unter ',
        code('src/'),
        ' ab (zum Beispiel ',
        code('src/js'),
        ' und ',
        code('src/css'),
        '), verlinke sie im HTML mit wurzelrelativen URLs, und sitelo erledigt den Rest: TypeScript, CSS-Importe, Bundling und Minifizierung.',
      ),
      h2('Projektstruktur'),
      p(
        'Seiten und Assets teilen sich ',
        code('src/'),
        '. Ordner wie ',
        code('js/'),
        ' und ',
        code('css/'),
        ' sind Konventionen, keine Vorgaben — für sitelo zählt, was dein HTML referenziert, nicht wie die Ordner heißen.',
      ),
      codeBlock('project', s.layout, 'bash'),
      h2('Assets aus dem HTML verlinken'),
      p(
        'Referenziere Dateien über wurzelrelative Pfade. Ein ',
        code('<script type="module">'),
        ' oder ein ',
        code('<link rel="stylesheet">'),
        ' ist das Signal an sitelo, diese Datei in den Build aufzunehmen:',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      codeBlock('src/js/main.js', s.js, 'javascript'),
      codeBlock('src/css/styles.css', s.css, 'css'),
      h2('Was Vite kompiliert'),
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
          ' — als ES-Module gebündelt, TypeScript entfernt, Importe eingebunden',
        ),
        li(
          code('.css'),
          ' — verarbeitet und minifiziert; ',
          code('@import'),
          ' und relative ',
          code('url()'),
          '-Referenzen werden aufgelöst',
        ),
        li(
          'Alles, was von einem referenzierten Einstiegspunkt importiert wird (wie das ',
          code('counter.ts'),
          ' oben), landet im selben Bundle',
        ),
        li(
          'In ',
          code('sitelo'),
          ' (dev) laufen dieselben URLs durch Vites Transform-Pipeline — kein separater Build-Schritt, um TypeScript oder CSS auszuprobieren',
        ),
      ),
      p(
        'Du brauchst PostCSS, Sass oder andere Vite-Plugins? Trage sie unter ',
        code('vite'),
        ' in ',
        a({ href: '/de/docs/configuration' }, 'sitelo.config.js'),
        ' ein.',
      ),
      h2('Null JS von Haus aus'),
      ul(
        { class: 'docs-list' },
        li(
          'Nicht referenzierter Code wird nicht ausgegeben. Ein Helfer, der nur aus ',
          code('data()'),
          ' oder ',
          code('generateStaticParams'),
          ' importiert wird, bleibt aus ',
          code('dist/'),
          ' heraus — Server-Geheimnisse werden nie versehentlich ausgeliefert.',
        ),
        li(
          'Kein ',
          code('<script>'),
          ' auf der Seite bedeutet kein Client-JavaScript im Build. Für die meisten Websites genügen statisches HTML und CSS.',
        ),
        li(
          code('public/'),
          ' wird unverändert kopiert (Favicons, robots.txt, statische Bilder ohne Hash).',
        ),
        li(
          'Weitere referenzierte Dateien (Bilder, Schriften, Videos, …) werden nach ',
          code('dist/'),
          ' kopiert.',
        ),
      ),
      h2('Prüfung fehlender Assets'),
      p(
        'Ein ',
        code('<script src>'),
        ' oder ein Stylesheet-',
        code('href'),
        ', das auf eine Datei zeigt, die weder in ',
        code('src/'),
        ' noch in ',
        code('public/'),
        ' existiert, lässt den Build fehlschlagen. Lieber nur eine Warnung?',
      ),
      codeBlock('sitelo.config.js', s.warn, 'javascript'),
    ],
  })
