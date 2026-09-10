import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'

export default () =>
  uiLayout({
    title: 'Filmkorn',
    description:
      'Eine Hülle, die Filmkorn über alles legt, was in ihr steckt.',
    activeHref: '/de/ui/grain',
    children: [
      p(
        'Korn nimmt einer großen Farbfläche die Flachheit — einem Hero, einem farbigen Band, einer Karte, die sonst wie ein glattes Rechteck wirkt. Es umschließt Inhalt genauso wie ',
        code('container()'),
        ', setzt aber keine eigene Breite: die Textur wird auf ',
        code('::after'),
        ' gezeichnet, über den Kindern und ohne den Zeiger abzufangen.',
      ),
      p(
        'Die Kachel ist ein statisches SVG aus fraktalem Rauschen, einmal gezeichnet und wiederholt. Ein ',
        code('filter'),
        ' über die lebenden Pixel sähe fast gleich aus und kostete ein neues Rastern, sobald sich darunter etwas bewegt.',
      ),

      h2('Einfaches Korn'),
      demo(`grain({ style: 'background: var(--su-surface-2); padding: 2rem; border-radius: 0.75rem' },
  text({ variant: 'lead', align: 'center' }, 'Texturiert.'),
)`, { align: 'stretch' }),

      h2('Intensität'),
      p(
        'Drei Stufen. Das Theme setzt die Grundstärke, die Intensität skaliert sie — denn eine fast schwarze Fläche nimmt Korn bereitwilliger an als Papier: in wahrgenommener Helligkeit gemessen bringt dieselbe Kachel über dem dunklen Grund rund das 1,6-Fache an Sprenkel. ',
        code('medium'),
        ' ist im Dunkelmodus also eine niedrigere Deckkraft, und beide landen an derselben Stelle.',
      ),
      demo(`grid({ min: '9rem' },
  ...['soft', 'medium', 'strong'].map((intensity) =>
    grain({ intensity, style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, intensity),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Skalierung'),
      p(
        'Die Größe einer Rauschkachel. Kleiner ist feiner: näher am Film, weiter weg vom Sand.',
      ),
      demo(`grid({ min: '9rem' },
  ...['60px', '180px', '420px'].map((scale) =>
    grain({ scale, intensity: 'strong', style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, scale),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Um einen Container herum'),
      p(
        'Korn hat keine eigene Breitenbegrenzung, und genau das macht das hier möglich: die Hülle läuft randlos durch, und der ',
        code('container()'),
        ' darin hält den Text zentriert und lesbar.',
      ),
      demo(`grain({ as: 'section', style: 'background: var(--su-primary-soft); padding-block: 2.5rem; border-radius: 0.75rem' },
  container({ size: 'sm' },
    stack({ gap: 'sm', align: 'center' },
      heading({ level: 2, size: 'h4' }, 'Ein texturiertes Band'),
      text({ tone: 'muted', align: 'center' }, 'Außen volle Breite, innen eine lesbare Spalte.'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Über einer Karte'),
      p(
        'Die Textur erbt den ',
        code('border-radius'),
        ' der Box; etwas Rundes zu umschließen kantet ihm also nicht die Ecken ab.',
      ),
      demo(`grid({ min: '12rem' },
  grain({ style: 'border-radius: var(--su-radius-lg)' },
    card({ variant: 'elevated' },
      cardBody(text({ variant: 'small' }, 'Mit Korn')),
    ),
  ),
  card({ variant: 'elevated' },
    cardBody(text({ variant: 'small' }, 'Ohne')),
  ),
)`, { align: 'stretch' }),

      h2('Mischen'),
      p(
        'Standardmäßig liegt die Textur mit ihrer eigenen Deckkraft über dem Inhalt. ',
        code('blend'),
        ' nimmt jeden ',
        code('mix-blend-mode'),
        ': ',
        code('overlay'),
        ' und ',
        code('soft-light'),
        ' drücken das Korn in die Farbe darunter, statt sie zu vergrauen.',
      ),
      demo(`grid({ min: '9rem' },
  ...['normal', 'overlay', 'soft-light'].map((blend) =>
    grain({ blend, intensity: 'strong', style: 'background: var(--su-primary-soft); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, blend),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['intensity', "'soft' | 'medium' | 'strong'", "'medium'", 'Wie weit die Textur getrieben wird, relativ zur Basis des Themes.'],
        ['opacity', 'number', '', 'Eine rohe Deckkraft, die intensity und das Theme übergeht.'],
        ['scale', 'string', "'180px'", 'Die Größe einer Rauschkachel.'],
        ['blend', 'string', "'normal'", 'Ein mix-blend-mode für die Textur.'],
        ['as', 'string', "'div'", 'Element, das gerendert wird, z. B. section.'],
      ]),
    ],
  })
