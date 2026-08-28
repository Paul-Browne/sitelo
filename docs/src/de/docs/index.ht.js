import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout, pageCodeTabs } from '../../lib/de.js'
import { gettingStartedSnippets } from '../../lib/snippets/getting-started.js'

const s = gettingStartedSnippets('de')

export default () =>
  docsLayout({
    title: 'Erste Schritte',
    description: 'Installiere sitelo und baue deine erste statische Website.',
    activeHref: '/de/docs',
    children: [
      p(
        'sitelo ist ein konfigurationsfreier Generator für statische Websites auf Basis von Vite. Installiere ein einziges Paket, schreibe Funktionen, die HTML zurückgeben, und führe ',
        code('sitelo build'),
        ' aus.',
      ),
      h2('Installation'),
      codeBlock('shell', s.install, 'bash'),
      p(
        'Erfordert Node 20.19+ (oder 22.12+). Vite ist enthalten — du musst es nicht separat installieren.',
      ),
      h2('Deine erste Seite'),
      p(
        'Lege ',
        code('src/index.ht.js'),
        ' an (oder ',
        code('.ht.jsx'),
        '). Wir empfehlen ',
        a({ href: 'https://ht.js.org', rel: 'noopener' }, 'ht.js'),
        ':',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      h2('Ausführen'),
      codeBlock('shell', s.run, 'bash'),
      p(
        'Das erzeugt ',
        code('dist/index.html'),
        ' (mit automatisch vorangestelltem ',
        code('<!DOCTYPE html>'),
        ') sowie eine Standard-',
        code('404.html'),
        '.',
      ),
      h2('Wie es weitergeht'),
      ul(
        { class: 'docs-list' },
        li(
          a({ href: '/de/docs/pages' }, 'Seiten schreiben'),
          ' — Template-Strings, JSX, strukturierte Module',
        ),
        li(
          a({ href: '/de/docs/routing' }, 'Routing'),
          ' — dateibasierte Routen und ',
          code('generateStaticParams'),
        ),
        li(
          a({ href: '/de/docs/data' }, 'Daten laden'),
          ' — ',
          code('data()'),
          ' und ',
          code('fetchWithCache'),
        ),
        li(
          a({ href: '/de/docs/assets' }, 'Assets und Styling'),
          ' — Frontend-JS/CSS, von Vite kompiliert (',
          code('src/js'),
          ', ',
          code('src/css'),
          ')',
        ),
        li(
          a({ href: '/de/docs/configuration' }, 'Konfiguration'),
          ' — ',
          code('sitelo.config.js'),
          ' und Vite-Optionen',
        ),
        li(
          a({ href: '/de/docs/build-with-ai' }, 'Mit KI entwickeln'),
          ' — ',
          code('llms.txt'),
          ', Projektregeln und Tipps für Agenten',
        ),
      ),
    ],
  })
