import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Leerzustand',
    description:
      'Wie eine Liste aussieht, bevor irgendetwas darin steht.',
    activeHref: '/de/ui/empty',
    extraHead: uiHead(),
    children: [
      p(
        'Eine leere Fläche liest sich wie ein Fehler. Ein Leerzustand sagt, welche Fläche leer ist, warum, und was als Nächstes zu tun ist — und er ist der Fall, den man am leichtesten vergisst, weil es in der Entwicklung immer Daten gibt.',
      ),

      h2('Einfacher Leerzustand'),
      demo(`empty({
  title: 'Noch keine Beiträge',
  description: 'Lege eine Markdown-Datei in src/posts an, und sie erscheint hier.',
})`, { align: 'stretch' }),

      h2('Mit Icon'),
      p(
        'Das Icon ist Dekoration — es ist mit ',
        code('aria-hidden'),
        ' markiert, weil der Titel schon sagt, was los ist.',
      ),
      demo(`empty({
  icon: icon('folder'),
  title: 'Hier ist nichts',
  description: 'Dieser Ordner enthält keine Seiten.',
})`, { align: 'stretch' }),

      h2('Mit einer Aktion'),
      p('Kinder werden zur Aktionsreihe.'),
      demo(`empty({
  icon: icon('search'),
  title: 'Keine Treffer für „Islands“',
  description: 'Prüfe die Schreibweise, oder stöbere stattdessen in der Dokumentation.',
},
  button({ href: '/de/docs' }, 'Doku durchstöbern'),
  button({ variant: 'outline', color: 'neutral' }, 'Suche zurücksetzen'),
)`, { align: 'stretch' }),

      h2('In einer Karte'),
      demo(`card(
  cardHeader({ title: 'Deployments' }),
  cardBody(
    empty({
      title: 'Noch keine Deployments',
      description: 'Push nach main, und der erste Build taucht hier auf.',
    }, button({ size: 'sm' }, 'Repository verbinden')),
  ),
)`, { align: 'stretch' }),

      h2('Anstelle einer Tabelle'),
      p(
        'Tausche die Tabelle gegen einen Leerzustand, statt einen Kopf ohne Zeilen darunter zu rendern.',
      ),
      demo(`return (() => {
  const rows = []

  return card(
    cardHeader({ title: 'Build-Verlauf' }),
    rows.length
      ? table({ columns: [{ key: 'commit', header: 'Commit' }], rows })
      : cardBody(empty({
          title: 'Keine Builds erfasst',
          description: 'Läufe erscheinen hier, sobald die Website mindestens einmal deployt wurde.',
        })),
  )
})()`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['icon', 'Child', '', 'Dekoratives Zeichen über dem Titel; vor Screenreadern verborgen.'],
        ['title', 'Child', '', 'Was leer ist, in wenigen Worten.'],
        ['description', 'Child', '', 'Warum es leer ist, oder was dagegen zu tun ist.'],
      ]),
      p('Kinder werden als Aktionsreihe unter der Beschreibung gerendert.'),
    ],
  })
