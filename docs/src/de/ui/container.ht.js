import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Container',
    description:
      'Eine zentrierte Spalte mit begrenzter Breite — auf den meisten Seiten die äußerste Hülle.',
    activeHref: '/de/ui/container',
    extraHead: uiHead(),
    children: [
      p(
        'Ein Container zentriert seinen Inhalt, deckelt die Breite, damit Textzeilen lesbar bleiben, und hält einen Rand frei, damit auf einem Telefon nichts den Bildschirmrand berührt. Meist ist er das Erste innerhalb von ',
        code('body()'),
        '.',
      ),

      h2('Einfacher Container'),
      demo(`container(
  text({ variant: 'lead' }, 'Alles darin bleibt zentriert und hört an der Größengrenze auf zu wachsen.'),
)`, { align: 'stretch' }),

      h2('Größen'),
      p(
        'Fünf Stufen, von einer einzelnen lesbaren Spalte bis zu gar keiner Grenze. ',
        code('sm'),
        ' liegt bei etwa 40rem — ungefähr die Breite, die Fließtext will.',
      ),
      demo(`stack({ gap: 'sm' },
  container({ size: 'sm', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
    text({ variant: 'small', align: 'center' }, 'sm — 40rem'),
  ),
  container({ size: 'md', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
    text({ variant: 'small', align: 'center' }, 'md — 56rem'),
  ),
  container({ size: 'lg', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
    text({ variant: 'small', align: 'center' }, 'lg — 72rem (Standard)'),
  ),
)`, { align: 'stretch' }),

      h2('Eine eigene Breite'),
      p(
        code('width'),
        ' nimmt jede CSS-Länge und übergeht ',
        code('size'),
        ' — für die eine Seite, die etwas braucht, das die Skala nicht hergibt.',
      ),
      demo(`container({ width: '30rem', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
  text({ variant: 'small', align: 'center' }, 'width: 30rem'),
)`, { align: 'stretch' }),

      h2('Randabstand'),
      p(
        'Der Randabstand ist der Innenabstand, der zwischen Inhalt und Viewport-Rand gehalten wird. Er nimmt ein Abstands-Token, eine Anzahl von Abstandseinheiten oder eine rohe Länge.',
      ),
      demo(`container({ size: 'sm', gutter: 'xl', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
  text({ variant: 'small' }, 'Ein breiterer Rand, für eine Seite, deren Inhalt auf einem Tablet nicht bis an die Kante laufen soll.'),
)`, { align: 'stretch' }),

      h2('Als anderes Element'),
      p(
        code('as'),
        ' wechselt das Tag, ohne sonst etwas zu ändern — praktisch, wenn der Container zugleich das ',
        code('<main>'),
        ' der Seite oder eine ',
        code('<section>'),
        ' ist.',
      ),
      demo(`container({ as: 'main', size: 'md' },
  heading({ level: 2, size: 'h4' }, 'Ein main-Element'),
  text({ tone: 'muted' }, 'Gleiches Layout, richtiger Landmark.'),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['size', "'sm' | 'md' | 'lg' | 'xl' | 'full'", "'lg'", 'Welche Breitengrenze gilt.'],
        ['width', 'string', '', 'Eine rohe max-width, die size übergeht.'],
        ['gutter', 'Space', "'md'", 'Innenabstand, der gegen den Viewport-Rand gehalten wird.'],
        ['as', 'string', "'div'", 'Element, das gerendert wird, z. B. main oder section.'],
      ]),
    ],
  })
