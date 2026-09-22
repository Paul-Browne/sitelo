import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout } from '../../lib/de.js'
import { cliSnippets } from '../../lib/snippets/cli.js'

const s = cliSnippets('de')

export default () =>
  docsLayout({
    title: 'CLI',
    description: 'sitelo dev, build, preview und die gängigen Optionen.',
    activeHref: '/de/docs/cli',
    children: [
      p(
        'Die ',
        code('sitelo'),
        '-CLI kapselt das mitgelieferte Vite und bindet das HTML-Pages-Plugin automatisch ein.',
      ),
      h2('Befehle'),
      codeBlock('shell', s.commands, 'bash'),
      ul(
        { class: 'docs-list' },
        li(
          code('dev'),
          ' — echtes SSR-Rendering auf Anfrage, dynamische Routen eingeschlossen, plus eine kleine Entwickler-Toolbar',
        ),
        li(
          code('build'),
          ' — statisches HTML in ',
          code('dist/'),
          ' (oder deinem ',
          code('outDir'),
          ')',
        ),
        li(code('preview'), ' — serviert den Produktions-Build lokal'),
        li(
          code('lighthouse'),
          ' — auditiert den Produktions-Build (benötigt die Peer-Dependency ',
          code('lighthouse'),
          ')',
        ),
      ),
      p(
        'Die Toolbar lässt sich mit ',
        code('devToolbar: false'),
        ' in ',
        code('sitelo.config.js'),
        ' abschalten — siehe ',
        a({ href: '/de/docs/configuration' }, 'Konfiguration'),
        '.',
      ),
      h2('Nützliche Optionen'),
      codeBlock('shell', s.flags, 'bash'),
      ul(
        { class: 'docs-list' },
        li(
          code('--port'),
          ' / ',
          code('--host'),
          ' / ',
          code('--open'),
          ' — Server',
        ),
        li(
          code('--outDir'),
          ' / ',
          code('--emptyOutDir'),
          ' / ',
          code('--base'),
          ' — Build',
        ),
        li(
          code('--root'),
          ' — Projektwurzel (praktisch für eine Website in ',
          code('docs/'),
          ')',
        ),
        li(code('--config'), ' — eigene Vite-Konfigurationsdatei'),
        li(code('--mode'), ' / ', code('--logLevel'), ' / ', code('--debug')),
      ),
      p(
        'Was du über mehrere Befehle hinweg wiederverwendest, gehört besser als Vite-Option in ',
        code('sitelo.config.js'),
        ' unter ',
        code('vite'),
        '.',
      ),
      h2('Ungenutzten Code finden'),
      p(
        a({ href: 'https://knip.dev' }, 'knip'),
        ' findet Dateien, Exporte und Abhängigkeiten, die nichts verwendet. In einem sitelo-Projekt braucht es einen Hinweis: Seiten und Islands werden im Dateisystem entdeckt, also importiert sie nichts — und ohne diesen Hinweis meldet knip die ganze Website als ungenutzte Dateien.',
      ),
      codeBlock('shell', s.knipInstall, 'bash'),
      codeBlock('knip.js', s.knip, 'javascript'),
      codeBlock('shell', s.knipRun, 'bash'),
      p(
        code('knipConfig()'),
        ' liest deine ',
        code('sitelo.config.js'),
        ' und markiert Seiten und Islands als Einstiegspunkte, genau so, wie der Build sie entdeckt — ',
        code('pagesDir'),
        ', ',
        code('pageExtensions'),
        ', ',
        code('include'),
        ' und ',
        code('exclude'),
        ' gelten alle. Was im Bericht übrig bleibt, ist Code, den die Website tatsächlich nie erreicht.',
      ),
      p(
        'Eines kann es nicht sehen: ein Client-Skript, das eine Seite per URL statt per Import einbindet, etwa ',
        code('<script src="/js/app.js">'),
        '. Diese nennst du selbst, und alles andere, was knip akzeptiert, gibst du daneben an — es wird in das Ergebnis übernommen. Das abschließende ',
        code('!'),
        ' ist knips Kennzeichen für Produktionscode, und genau das ist ein Skript, das an den Browser ausgeliefert wird.',
      ),
      codeBlock('knip.js', s.knipEntry, 'javascript'),
    ],
  })
