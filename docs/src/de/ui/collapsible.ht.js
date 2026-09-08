import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Ausklappbar',
    description:
      'Ein einzelnes „mehr zeigen“, ohne die Rahmen und die Gruppierung eines Akkordeons.',
    activeHref: '/de/ui/collapsible',
    extraHead: uiHead(),
    children: [
      p(
        'Ein Ausklappbereich ist ein einzelnes ',
        code('<details>'),
        ' — dasselbe Element, aus dem ein Akkordeon gebaut ist, nur ohne dessen Beiwerk. Nimm ihn für ein optionales Detail mitten auf einer Seite; nimm ',
        code('accordion()'),
        ', wenn es eine ganze Reihe davon gibt.',
      ),
      p(
        'Er braucht kein Skript, und weil der Inhalt im Dokument bleibt, findet ihn sowohl die Seitensuche des Browsers als auch eine Suchmaschine.',
      ),

      h2('Einfacher Ausklappbereich'),
      demo(`collapsible({ trigger: 'Erzeugte Konfiguration zeigen' },
  text({ variant: 'small' }, 'Alles, was sitelo schreibt, wenn du den Build ohne eigene Konfigurationsdatei startest.'),
)`, { align: 'stretch' }),

      h2('Standardmäßig offen'),
      demo(`collapsible({ trigger: 'Warum es das gibt', open: true },
  text({ variant: 'small' }, 'Weil eine Seite, die ihre Erklärung hinter einem Klick versteckt, eine Seite ist, die niemand liest.'),
)`, { align: 'stretch' }),

      h2('Reicher Inhalt'),
      demo(`collapsible({ trigger: 'Vollständige Ausgabe zeigen' },
  stack({ gap: 'sm' },
    code('dist/index.html'),
    code('dist/404.html'),
    code('dist/sitemap.xml'),
  ),
)`, { align: 'stretch' }),

      h2('In anderen Dingen'),
      p('Ein Ausklappbereich sitzt problemlos in einer Karte, einem Hinweis oder einer Tabellenzelle.'),
      demo(`stack({ gap: 'md' },
  card(
    cardHeader({ title: 'Build fehlgeschlagen', subtitle: '2 kaputte Links' }),
    cardBody(
      collapsible({ trigger: 'Fehlerhafte Links zeigen' },
        list({ plain: true },
          listItem({ title: '/docs/old-routing', description: 'verlinkt von /docs' }),
          listItem({ title: '/blog/draft', description: 'verlinkt von /blog' }),
        ),
      ),
    ),
  ),
  alert({ color: 'warning', title: 'Langsame Seite' },
    stack({ gap: 'sm' },
      text({ variant: 'small' }, 'Eine Seite brauchte über 500 ms zum Rendern.'),
      collapsible({ trigger: 'Zeiten zeigen' },
        text({ variant: 'small' }, '/examples/wordpress — 512 ms'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Der Auslöser'),
      p(
        'Bleib bei Text und Icons. Ein ',
        code('<summary>'),
        ' ist bereits interaktiv, ein Button oder ein Link darin schachtelt also zwei Bedienelemente ineinander, wo es nur eine Aktion gibt — dieselbe Regel, der ',
        code('menu()'),
        ' folgt.',
      ),

      h2('Ausklappbar oder Akkordeon?'),
      p(
        'Eine einzelne Offenlegung für sich: ',
        code('collapsible()'),
        '. Eine Reihe davon, umrahmt und gruppiert, wahlweise mit immer nur einer offenen: ',
        code('accordion()'),
        '.',
      ),

      h2('Props'),
      propsTable([
        ['trigger', 'Child', '', 'Der Inhalt der Zusammenfassung. Nur Text und Icons.'],
        ['open', 'boolean', 'false', 'Ob er ausgeklappt startet.'],
      ]),
    ],
  })
