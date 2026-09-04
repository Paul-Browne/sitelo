import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, examplesLayout, pageCodeTabs } from '../../lib/de.js'
import { jsonSnippets } from '../../lib/snippets/examples-json.js'

const s = jsonSnippets('de')

export default () =>
  examplesLayout({
    title: 'Lokales JSON',
    description:
      'Ein Produktkatalog, komplett aus JSON-Dateien im Repository gebaut — ohne API, ohne Datenbank.',
    activeHref: '/de/examples/json',
    children: [
      p(
        'Inhalte, die als JSON im Repository liegen, von ',
        code('sitelo/data'),
        ' in statische Seiten verwandelt. Keine API, keine Datenbank, kein Client-JavaScript. Vollständiger Quellcode in ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/json',
            rel: 'noopener',
          },
          'examples/json',
        ),
        '.',
      ),
      h2('Was du bekommst'),
      ul(
        { class: 'docs-list' },
        li('Eine Startseite mit allen Kategorien und Produkten'),
        li(
          code('/products/[slug]'),
          ' — eine statische Seite pro Datei in ',
          code('data/products/'),
          '',
        ),
        li(
          code('/categories/[slug]'),
          ' — eine Seite pro Schlüssel in ',
          code('data/categories.json'),
          '',
        ),
        li('Eine JSON-Datei hinzufügen heißt eine Seite hinzufügen; keine Route anzumelden'),
        li('Null ausgeliefertes JS — die Dateien werden beim Build in Node gelesen'),
      ),
      h2('Projektstruktur'),
      codeBlock('project', s.structure, 'bash'),
      p(
        'Die Daten liegen außerhalb von ',
        code('src/'),
        ', sitelo behandelt sie also nie als Seiten oder Assets.',
      ),
      h2('1. Inhalte nach data/ legen'),
      p(
        'Eine Datei pro Produkt. Der Dateiname ist der Slug, aus ',
        code('aeron-chair.json'),
        ' wird also ',
        code('/products/aeron-chair'),
        ' — ohne dass die Datei das sagen müsste:',
      ),
      codeBlock('data/products/aeron-chair.json', s.product, 'json'),
      p(
        'Kategorien stecken stattdessen in einer einzigen Datei: einem nach Slug indizierten Objekt, das ',
        code('readJsonCollection'),
        ' genauso als Sammlung liest.',
      ),
      codeBlock('data/categories.json', s.categories, 'json'),
      h2('2. An einer Stelle lesen'),
      p(
        'Ein kleines, reines Servermodul kapselt die Lesevorgänge. Nichts im HTML verweist darauf, es landet also nie im Browser — und weil ',
        code('sitelo/data'),
        ' pro Datei merkt, parst der ganze Build jede JSON-Datei nur einmal, egal wie viele Seiten diese Helfer aufrufen.',
      ),
      codeBlock('src/lib/catalogue.js', s.lib, 'javascript'),
      h2('3. Alles auf der Startseite auflisten'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.indexTemplate,
        ht: s.indexHt,
        jsx: s.indexJsx,
      }),
      h2('4. Eine Seite pro JSON-Datei'),
      p(
        code('generateStaticParams'),
        ' liefert beim Build einen Slug pro Datei; ',
        code('data()'),
        ' lädt für jede Seite den passenden Eintrag.',
      ),
      pageCodeTabs({
        file: 'src/products/[slug].ht.js',
        template: s.slugTemplate,
        ht: s.slugHt,
        jsx: s.slugJsx,
      }),
      h2('5. Bearbeiten und zusehen'),
      codeBlock('terminal', s.build, 'bash'),
      p(
        'Unter ',
        code('sitelo'),
        ' lädt eine Preisänderung die offene Seite neu — der Dev-Server beobachtet die JSON-Dateien, die Seiten tatsächlich lesen. Doppelte Slugs, fehlende Dateien und fehlerhaftes JSON lassen den Build fehlschlagen und nennen den Pfad.',
      ),
      p(
        a({ href: '/de/docs/data' }, 'Doku zum Laden von Daten'),
        ' · ',
        a({ href: '/de/docs/routing' }, 'Routing-Doku'),
        ' · ',
        a({ href: '/de/docs/configuration' }, 'Konfigurations-Doku'),
      ),
    ],
  })
