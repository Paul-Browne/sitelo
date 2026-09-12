import { h2, p } from 'javascript-to-html'
import { code, demo, grainSandbox, grainSandboxHead, propsTable, uiLayout } from '../../lib/de.js'

export default () =>
  uiLayout({
    title: 'Filmkorn',
    description:
      'Eine Hülle, die Filmkorn über alles legt, was in ihr steckt.',
    activeHref: '/de/ui/grain',
    extraHead: grainSandboxHead(),
    children: [
      p(
        'Korn nimmt einer großen Farbfläche die Flachheit — einem Hero, einem farbigen Band, einer Karte, die sonst wie ein glattes Rechteck wirkt. Es umschließt Inhalt genauso wie ',
        code('container()'),
        ', setzt aber keine eigene Breite: die Textur wird auf ',
        code('::after'),
        ' gezeichnet, über den Kindern und ohne den Zeiger abzufangen.',
      ),
      p(
        'Die Kachel ist ein statisches SVG aus fraktalem Rauschen, einmal gezeichnet. Ein ',
        code('filter'),
        ' über die lebenden Pixel sähe fast gleich aus und kostete ein neues Rastern, sobald sich darunter etwas bewegt.',
      ),

      p(
        'Es gibt zwei Ebenen der Steuerung. ',
        code('opacity'),
        ' bestimmt, wie stark die Textur nach dem Zeichnen aufgedreht wird; unangetastet setzt sie das Theme, und auf diesem Wert sind die beiden Themes ausbalanciert. ',
        code('type'),
        ', ',
        code('frequency'),
        ', ',
        code('octaves'),
        ', ',
        code('seed'),
        ' und ',
        code('color'),
        ' sind die Turbulenz selbst; sobald eines davon gesetzt wird, entsteht eine Textur für genau dieses Element statt der gemeinsamen aus dem Stylesheet.',
      ),

      h2('Einfaches Korn'),
      demo(`grain({ style: 'background: var(--su-surface-2); padding: 2rem; border-radius: 0.75rem' },
  text({ variant: 'lead', align: 'center' }, 'Texturiert.'),
)`, { align: 'stretch' }),

      h2('Rauschart'),
      p(
        code('fractal'),
        ' summiert das Rauschen direkt und ergibt das gleichmäßige Sprenkel von Film. ',
        code('turbulence'),
        ' nimmt den Betrag davon, was dunkle Adern und Klumpen hinterlässt: näher an Rauch oder Marmor als an Korn.',
      ),
      demo(`grid({ min: '9rem' },
  ...['fractal', 'turbulence'].map((type) =>
    grain({ type, style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, type),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Frequenz'),
      p(
        'Zyklen pro Pixel: höher ist feiner. Das Rauschen wird in der Größe der Box selbst gezeichnet, eine Einheit pro Pixel, also gilt das, was auch immer die Box misst — eine kleine Karte und ein Band über die volle Breite bekommen dasselbe Korn, und nichts wiederholt sich.',
      ),
      demo(`grid({ min: '9rem' },
  ...[0.2, 0.57, 1.2].map((frequency) =>
    grain({ frequency, style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, String(frequency)),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Oktaven'),
      p(
        'Wie viele Rauschschichten aufsummiert werden, jede feiner und schwächer als die davor. Eine ist glatt und gleichmäßig; mehr bringen Detail, und jede kostet den Browser beim ersten Zeichnen der Kachel einen weiteren Durchgang.',
      ),
      demo(`grid({ min: '9rem' },
  ...[1, 3, 6].map((octaves) =>
    grain({ octaves, style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, String(octaves)),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Seed'),
      p(
        'Welches Rauschen gezeichnet wird. Jede Zahl geht, dieselbe ergibt immer dasselbe Muster, und sonst ändert sich nichts an der Textur — praktisch, wenn zwei gekörnte Flächen nebeneinander liegen und sich die Wiederholung verrät.',
      ),
      demo(`grid({ min: '9rem' },
  ...[0, 7, 42].map((seed) =>
    grain({ seed, style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, String(seed)),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Farbe'),
      p(
        'Das Rauschen ist standardmäßig grau. ',
        code('color'),
        ' färbt es ein: der Wert wird im Filter multipliziert, muss sich also beim Bauen der Seite auflösen lassen — ',
        code('#rgb'),
        ', ',
        code('#rrggbb'),
        ' oder ',
        code('rgb()'),
        '. Eine benannte Farbe, ',
        code('currentColor'),
        ' oder ein ',
        code('var()'),
        ' können das nicht und lassen das Rauschen grau, statt den Build scheitern zu lassen. Alpha sagt, wie viel Tönung: ',
        code('#ff880080'),
        ' ist die Hälfte von ',
        code('#ff8800'),
        ', und Alpha null ist keine.',
      ),
      demo(`grid({ min: '9rem' },
  ...['#0a7a45', '#c05621', '#2f7fc7'].map((color) =>
    grain({ color, style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, color),
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
    grain({ blend, style: 'background: var(--su-primary-soft); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, blend),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Sandbox'),
      grainSandbox(),

      h2('Props'),
      propsTable([
        ['opacity', 'number', '', 'Deckkraft der Textur. Unangetastet setzt sie das Theme.'],
        ['blend', 'string', "'normal'", 'Ein mix-blend-mode für die Textur.'],
        ['type', "'fractal' | 'turbulence'", "'fractal'", 'Welche Turbulenz gezeichnet wird.'],
        ['frequency', 'number', '0.57', 'Zyklen pro Pixel — höher ist feiner.'],
        ['octaves', 'number', '3', 'Aufsummierte Rauschschichten, 1–8.'],
        ['seed', 'number', '0', 'Welches Rauschen gezeichnet wird.'],
        ['color', 'string', '', 'Färbt das Rauschen; Alpha sagt, wie stark. #rgb, #rrggbb, #rrggbbaa, rgb() oder rgba().'],
        ['as', 'string', "'div'", 'Element, das gerendert wird, z. B. section.'],
      ]),
    ],
  })
