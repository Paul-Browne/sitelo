import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, examplesLayout, pageCodeTabs } from '../../lib/de.js'
import { blogSnippets } from '../../lib/snippets/examples-blog.js'

const s = blogSnippets('de')

export default () =>
  examplesLayout({
    title: 'Markdown-Blog',
    description:
      'Ein Ordner voller Markdown-Dateien → ein statischer Blog mit RSS-Feed, gebaut mit sitelo und marked.',
    activeHref: '/de/examples/blog',
    children: [
      p(
        'Der klassische Anwendungsfall für statische Websites: Markdown-Dateien in einem Ordner, eine statische Seite pro Beitrag, ein RSS-Feed und kein clientseitiges JavaScript. Vollständiger Quelltext in ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/blog',
            rel: 'noopener',
          },
          'examples/blog',
        ),
        '.',
      ),
      h2('Was du bekommst'),
      ul(
        { class: 'docs-list' },
        li('Eine Startseite, die die Beiträge auflistet, neueste zuerst'),
        li(
          code('/blog/[slug]'),
          ' — eine statische HTML-Seite pro Markdown-Datei, über ',
          code('generateStaticParams'),
        ),
        li(
          code('rss.xml'),
          ' — von sitelo aus der ',
          code('rss'),
          '-Konfiguration erzeugt',
        ),
        li(code('sitemap.xml'), ' — aktiviert durch Setzen von ', code('site')),
        li('Kein ausgeliefertes JS — Markdown wird zur Build-Zeit in Node geparst'),
      ),
      h2('Projektstruktur'),
      codeBlock('project', s.structure, 'bash'),
      codeBlock('sitelo.config.js', s.config, 'javascript'),
      h2('1. Beiträge als Markdown schreiben'),
      p(
        'Die Beiträge liegen in ',
        code('content/'),
        ' — außerhalb von ',
        code('src/'),
        ', damit sitelo sie nie als Seiten oder Assets behandelt. Das Frontmatter besteht aus schlichten ',
        code('key: value'),
        '-Zeilen:',
      ),
      codeBlock('content/hello-world.md', s.post, 'markdown'),
      h2('2. Sie in Node lesen und rendern'),
      p(
        'Ein kleines, rein serverseitiges Modul liest den Ordner, parst das Frontmatter und rendert das Markdown mit ',
        a({ href: 'https://marked.js.org', rel: 'noopener' }, 'marked'),
        '. Da nichts im HTML dieses Modul referenziert, gelangt es nie in den Browser.',
      ),
      codeBlock('src/lib/posts.js', s.lib, 'javascript'),
      h2('3. Beiträge auf der Startseite auflisten'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.indexTemplate,
        ht: s.indexHt,
        jsx: s.indexJsx,
      }),
      h2('4. Eine statische Seite pro Beitrag'),
      p(
        code('generateStaticParams'),
        ' liefert zur Build-Zeit jeden Slug; ',
        code('data()'),
        ' lädt für jede Seite den passenden Beitrag.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: s.slugTemplate,
        ht: s.slugHt,
        jsx: s.slugJsx,
      }),
      h2('5. RSS gratis dazu'),
      p(
        'Mit der ',
        code('rss'),
        '-Konfiguration von oben gibt ',
        code('sitelo build'),
        ' eine ',
        code('dist/rss.xml'),
        ' aus, mit einem Eintrag für jede Seite unter ',
        code('/blog'),
        ' — ohne zusätzlichen Code.',
      ),
      p(
        a({ href: '/de/docs/routing' }, 'Routing-Doku'),
        ' · ',
        a({ href: '/de/docs/data' }, 'Doku zum Daten laden'),
        ' · ',
        a({ href: '/de/docs/configuration' }, 'Konfigurations-Doku'),
      ),
    ],
  })
