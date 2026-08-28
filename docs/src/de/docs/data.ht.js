import { h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout, pageCodeTabs } from '../../lib/de.js'
import { dataSnippets } from '../../lib/snippets/data.js'

const s = dataSnippets('de')

export default () =>
  docsLayout({
    title: 'Daten laden',
    description:
      'data() zur Build-Zeit und fetchWithCache für statische Websites, die eine API anzapfen.',
    activeHref: '/de/docs/data',
    children: [
      p(
        'Exportiere eine ',
        code('data()'),
        '-Funktion, und ihr Ergebnis steht als ',
        code('ctx.data'),
        ' in deiner Render-Funktion bereit. Sie läuft zur Build-Zeit und im Entwicklungsserver bei jeder Anfrage.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: s.dataTemplate,
        ht: s.dataHt,
        jsx: s.dataJsx,
      }),
      h2('fetchWithCache'),
      p(
        'Du baust viele Seiten gegen dieselbe API? Importiere ',
        code('fetchWithCache'),
        ' aus sitelo:',
      ),
      codeBlock('src/blog/[slug].ht.js', s.cache, 'javascript'),
      h3('Optionen'),
      ul(
        { class: 'docs-list' },
        li(
          code('maxAge'),
          ' — Cache-Lebensdauer in Sekunden (Standard ',
          code('3600'),
          ')',
        ),
        li(
          code('cacheKey'),
          ' — eigener Schlüssel (Standard: Hash aus URL + Methode + Headern + Body)',
        ),
        li(code('forceRefresh'), ' — umgeht den Cache'),
        li(
          code('cache'),
          ' — ',
          code("'auto'"),
          ' | ',
          code("'memory'"),
          ' | ',
          code("'fs'"),
          ' | ',
          code("'none'"),
        ),
      ),
      h3('Cache-Modi'),
      ul(
        { class: 'docs-list' },
        li(
          code('auto'),
          ' (Standard) — Arbeitsspeicher in der Entwicklung, Dateisystem bei Produktions-Builds',
        ),
        li(
          code('memory'),
          ' — im Prozess, wird beim Beenden des Prozesses verworfen',
        ),
        li(code('fs'), ' — persistiert unter ', code('node_modules/.cache/')),
        li(code('none'), ' — fragt immer neu an'),
      ),
      p(
        'Standardmäßig werden nur ',
        code('GET'),
        '-Anfragen zwischengespeichert (übergib einen ',
        code('cacheKey'),
        ', um andere Methoden zu cachen). Fehlerantworten werden nie zwischengespeichert.',
      ),
    ],
  })
