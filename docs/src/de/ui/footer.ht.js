import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Footer',
    description:
      'Das untere Ende einer Website: Spalten mit Links und eine Zeile darunter.',
    activeHref: '/de/ui/footer',
    extraHead: uiHead(),
    children: [
      p(
        'Ein Footer ist ein Raster aus Spalten, das sich selbst einpasst, plus eine optionale Schlusszeile, die immer die volle Breite einnimmt, wie viele Spalten es auch gibt.',
      ),
      p(
        'Er wird sowohl als ',
        code('footer'),
        ' als auch als ',
        code('siteFooter'),
        ' exportiert, denn ',
        code('footer'),
        ' ist auch das ',
        code('<footer>'),
        '-Element von javascript-to-html, und beides unter einem Namen zu importieren ist ein Syntaxfehler.',
      ),

      h2('Einfacher Footer'),
      demo(`footer(
  footerColumn({ title: 'Doku' },
    '<a href="/de/docs">Erste Schritte</a>',
    '<a href="/de/docs/routing">Routing</a>',
    '<a href="/de/docs/data">Daten laden</a>',
  ),
  footerColumn({ title: 'Komponenten' },
    '<a href="/de/ui">Überblick</a>',
    '<a href="/de/ui/button">Button</a>',
    '<a href="/de/ui/card">Karte</a>',
  ),
  footerColumn({ title: 'Projekt' },
    '<a href="https://github.com/paul-browne/sitelo">GitHub</a>',
    '<a href="https://www.npmjs.com/package/sitelo">npm</a>',
  ),
)`, { align: 'stretch' }),

      h2('Mit Schlusszeile'),
      p(
        code('footerBottom()'),
        ' reicht über alle Spalten und bleibt damit eine Zeile über die volle Breite, was auch immer das Raster darüber tut.',
      ),
      demo(`footer(
  footerColumn({ title: 'Doku' }, '<a href="/de/docs">Anleitung</a>', '<a href="/de/ui">Komponenten</a>'),
  footerColumn({ title: 'Beispiele' }, '<a href="/de/examples">Alle Beispiele</a>'),
  footerBottom(
    text({ variant: 'caption' }, '© 2026 Paul Browne · MIT'),
    stack({ direction: 'row', gap: 'sm' },
      chip({ size: 'sm', color: 'neutral' }, 'v2.7'),
      chip({ size: 'sm', color: 'success', dot: true }, 'Build erfolgreich'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Eine Markenspalte'),
      p(
        'Eine Spalte muss nicht aus Links bestehen. Alles, was du als Kind von ',
        code('footer()'),
        ' statt einer Spalte übergibst, bekommt im Raster seine eigene Zelle.',
      ),
      demo(`footer(
  div(
    stack({ gap: 'sm' },
      text({ variant: 'h5', as: 'div' }, 'sitelo'),
      text({ variant: 'small', tone: 'muted' }, 'Statische Website-Generierung ohne Konfiguration, angetrieben von Vite.'),
    ),
  ),
  footerColumn({ title: 'Doku' }, '<a href="/de/docs">Anleitung</a>', '<a href="/de/ui">Komponenten</a>'),
  footerColumn({ title: 'Projekt' }, '<a href="#">GitHub</a>', '<a href="#">npm</a>'),
)`, { align: 'stretch' }),

      h2('Feste Spalten'),
      p(
        'Standardmäßig passen sich die Spalten selbst ein. ',
        code('columns'),
        ' nimmt jeden ',
        code('grid-template-columns'),
        '-Wert, wenn du eine bestimmte Form willst — etwa eine breite Markenspalte und zwei schmale Linkspalten.',
      ),
      demo(`footer({ columns: '2fr 1fr 1fr' },
  div(text({ variant: 'small', tone: 'muted' }, 'Eine breitere erste Spalte für die Marke und einen Satz dazu.')),
  footerColumn({ title: 'Doku' }, '<a href="/de/docs">Anleitung</a>'),
  footerColumn({ title: 'Mehr' }, '<a href="/de/examples">Beispiele</a>'),
)`, { align: 'stretch' }),

      h2('Nur die Schlusszeile'),
      demo(`footer(
  footerBottom(text({ variant: 'caption' }, '© 2026 · Gebaut mit sitelo')),
)`, { align: 'stretch' }),

      h2('Props'),
      p(code('footer()'), ':'),
      propsTable([
        ['columns', 'string', '', 'Ein grid-template-columns-Wert. Passt sich selbst ein, wenn weggelassen.'],
        ['as', 'string', "'footer'", 'Element, das gerendert wird.'],
      ]),
      propsTable([
        ['footerColumn', 'title', '', 'Eine Spalte mit Titel; Kinder werden zu einer Linkliste.'],
        ['footerBottom', '', '', 'Zeile über die volle Breite unter den Spalten.'],
      ], { headers: ['Teil', 'Props', 'Standard', 'Beschreibung'] }),
    ],
  })
