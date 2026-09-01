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
    ],
  })
