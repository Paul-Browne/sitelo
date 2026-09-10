import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'

export default () =>
  uiLayout({
    title: 'Stack',
    description:
      'Eine Flex-Reihe oder -Spalte mit einem Abstands-Token als Lücke — der Layout-Baustein, aus dem die meisten Seiten bestehen.',
    activeHref: '/de/ui/stack',
    children: [
      p(
        'Stack setzt Abstand zwischen Dinge. Es ist ein Flex-Container mit einer einzigen Aufgabe und die Antwort auf die meisten „wie kriege ich hier Abstand hin“-Fragen — senkrecht als Standard, waagerecht mit ',
        code("direction: 'row'"),
        '.',
      ),
      p(
        'Die Lücken stammen aus der Abstandsskala, sodass der Rhythmus einer Seite stimmig bleibt, ohne dass jemand Pixelwerte aussucht.',
      ),

      h2('Einfacher Stack'),
      demo(`stack({ gap: 'md' },
  card(cardBody('Erstes')),
  card(cardBody('Zweites')),
  card(cardBody('Drittes')),
)`, { align: 'stretch' }),

      h2('Richtung'),
      demo(`stack({ direction: 'row', gap: 'md' },
  button('Eins'),
  button({ variant: 'outline' }, 'Zwei'),
  button({ variant: 'outline' }, 'Drei'),
)`),

      h2('Lücke'),
      p(
        'Ein Token-Name (',
        code("'xs'"),
        ' … ',
        code("'3xl'"),
        '), eine Anzahl Abstandseinheiten oder eine rohe CSS-Länge.',
      ),
      demo(`stack({ gap: 'lg' },
  stack({ direction: 'row', gap: 'xs' }, chip('xs'), chip('xs'), chip('xs')),
  stack({ direction: 'row', gap: 'md' }, chip('md'), chip('md'), chip('md')),
  stack({ direction: 'row', gap: 6 }, chip('6 Einheiten'), chip('6 Einheiten')),
  stack({ direction: 'row', gap: '3rem' }, chip('3rem'), chip('3rem')),
)`, { align: 'stretch' }),

      h2('Ausrichtung'),
      p(
        code('align'),
        ' und ',
        code('justify'),
        ' nehmen rohe Flexbox-Werte, es funktioniert also alles, was CSS versteht.',
      ),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm', justify: 'space-between', style: 'background: var(--su-surface-2); padding: 0.6rem; border-radius: 0.5rem' },
    chip('Anfang'),
    chip('Ende'),
  ),
  stack({ direction: 'row', gap: 'sm', justify: 'center', align: 'center', style: 'background: var(--su-surface-2); padding: 0.6rem; border-radius: 0.5rem' },
    button({ size: 'sm' }, 'Zentriert'),
    chip('und ausgerichtet'),
  ),
)`, { align: 'stretch' }),

      h2('Umbruch'),
      p(
        'Eine Reihe von Chips oder Buttons, die vielleicht nicht passt, braucht ',
        code('wrap'),
        ' — ohne ihn quetschen sie sich, statt in die nächste Zeile zu rutschen.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  ...['routing', 'data', 'islands', 'images', 'pagefind', 'lighthouse', 'sitemap', 'rss'].map(
    (name) => chip({ color: 'neutral' }, name),
  ),
)`, { align: 'stretch' }),

      h2('Inline'),
      p(
        code('inline'),
        ' macht aus dem Stack ein ',
        code('inline-flex'),
        ', sodass er in einer Textzeile sitzt, statt die volle Breite zu nehmen.',
      ),
      demo(`text(
  'Gebaut mit ',
  stack({ direction: 'row', gap: 'xs', inline: true, align: 'center' },
    chip({ color: 'primary', size: 'sm' }, 'sitelo'),
    chip({ color: 'neutral', size: 'sm' }, 'vite'),
  ),
  ' und sonst nichts.',
)`, { align: 'stretch' }),

      h2('Als anderes Element'),
      demo(`stack({ as: 'nav', direction: 'row', gap: 'sm' },
  navLink({ href: '/de/docs' }, 'Doku'),
  navLink({ href: '/de/ui', current: true }, 'UI'),
  navLink({ href: '/de/examples' }, 'Beispiele'),
)`),

      h2('Props'),
      propsTable([
        ['direction', "'row' | 'column'", "'column'", 'Hauptachse.'],
        ['gap', 'Space', "'md'", 'Abstand zwischen den Kindern.'],
        ['align', 'string', "'stretch'", 'Jeder align-items-Wert.'],
        ['justify', 'string', "'flex-start'", 'Jeder justify-content-Wert.'],
        ['wrap', 'boolean | string', 'false', 'true heißt umbrechen; ein String wird als flex-wrap durchgereicht.'],
        ['inline', 'boolean', 'false', 'Wird als inline-flex gerendert.'],
        ['as', 'string', "'div'", 'Element, das gerendert wird, z. B. nav oder ul.'],
      ]),
    ],
  })
