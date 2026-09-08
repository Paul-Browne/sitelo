import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Seitenverhältnis',
    description:
      'Hält eine Box in fester Form, damit auf der Seite nichts springt, wenn der Inhalt lädt.',
    activeHref: '/de/ui/aspect-ratio',
    extraHead: uiHead(),
    children: [
      p(
        'Die Höhe steht schon aus der Breite fest, bevor irgendetwas geladen ist — ein spät eintreffendes Bild oder Embed schiebt den Rest der Seite also nicht nach unten. Das Kind füllt die Box und wird beschnitten statt mit Balken versehen.',
      ),

      h2('Einfaches Seitenverhältnis'),
      demo(`aspectRatio({ ratio: '16 / 9', style: 'background: var(--su-surface-2)' },
  '<img src="/logo.svg" alt="" style="object-fit: contain; padding: 2rem">',
)`, { align: 'stretch' }),

      h2('Gängige Verhältnisse'),
      demo(`grid({ min: '9rem' },
  ...['16 / 9', '4 / 3', '1 / 1', '3 / 4'].map((ratio) =>
    stack({ gap: 'xs' },
      aspectRatio({ ratio, style: 'background: var(--su-surface-2); border-radius: 0.5rem' },
        '<img src="/logo.svg" alt="" style="object-fit: contain; padding: 1rem">'),
      text({ variant: 'caption', tone: 'muted', align: 'center' }, ratio),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Embeds'),
      p(
        'Der Grund, warum es diese Komponente gibt: ein ',
        code('<iframe>'),
        ' hat keine intrinsische Größe, fällt ohne Verhältnis also in sich zusammen oder braucht eine fest verdrahtete Höhe.',
      ),
      demo(`aspectRatio({ ratio: '16 / 9', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
  '<div style="display: grid; place-items: center; color: var(--su-text-subtle)">hier käme ein &lt;iframe&gt; hin</div>',
)`, { align: 'stretch' }),

      h2('In einer Karte'),
      p(
        code('cardMedia()'),
        ' macht das oben in einer Karte bereits. Greif zu ',
        code('aspectRatio()'),
        ', wenn die Box woanders sitzt.',
      ),
      demo(`grid({ min: '12rem' },
  card(
    cardMedia({ src: '/logo.svg', alt: '', style: 'background: var(--su-surface-2); object-fit: contain; padding: 1rem' }),
    cardBody(text({ variant: 'small' }, 'cardMedia — eingebaut')),
  ),
  card(
    cardBody(
      stack({ gap: 'sm' },
        aspectRatio({ ratio: '1 / 1', style: 'background: var(--su-surface-2); border-radius: 0.5rem' },
          '<img src="/logo.svg" alt="" style="object-fit: contain; padding: 1rem">'),
        text({ variant: 'small' }, 'aspectRatio — überall sonst'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Beschnitt'),
      p(
        'Das Kind wird zum Füllen gedehnt und mit ',
        code('object-fit: cover'),
        ' beschnitten. Für etwas, das nicht beschnitten werden darf — ein Logo, ein Diagramm — setze ',
        code('object-fit: contain'),
        ' auf das Kind, so wie es jede Demo auf dieser Seite tut.',
      ),

      h2('Props'),
      propsTable([
        ['ratio', 'string', "'16 / 9'", 'Jeder CSS-Wert für aspect-ratio.'],
        ['as', 'string', "'div'", 'Element, das gerendert wird.'],
      ]),
    ],
  })
