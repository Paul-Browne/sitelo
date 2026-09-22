import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Proporcje',
    description:
      'Utrzymaj ramkę w stałym kształcie, żeby nic na stronie nie przeskoczyło, gdy treść się załaduje.',
    activeHref: '/pl/ui/aspect-ratio',
    children: [
      p(
        'Wysokość wynika z szerokości, zanim cokolwiek się załaduje, więc spóźniony obraz albo osadzenie nie spycha reszty strony w dół. Dziecko wypełnia ramkę i jest przycinane, a nie obramowywane pasami.',
      ),

      h2('Podstawowe proporcje'),
      demo(`aspectRatio({ ratio: '16 / 9', style: 'background: var(--su-surface-2)' },
  '<img src="/logo.svg" alt="" style="object-fit: contain; padding: 2rem">',
)`, { align: 'stretch' }),

      h2('Typowe proporcje'),
      demo(`grid({ min: '9rem' },
  ...['16 / 9', '4 / 3', '1 / 1', '3 / 4'].map((ratio) =>
    stack({ gap: 'xs' },
      aspectRatio({ ratio, style: 'background: var(--su-surface-2); border-radius: 0.5rem' },
        '<img src="/logo.svg" alt="" style="object-fit: contain; padding: 1rem">'),
      text({ variant: 'caption', tone: 'muted', align: 'center' }, ratio),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Osadzenia'),
      p(
        'Powód, dla którego ten komponent istnieje: ',
        code('<iframe>'),
        ' nie ma własnego rozmiaru, więc bez proporcji zapada się albo wymaga wysokości wpisanej na sztywno.',
      ),
      demo(`aspectRatio({ ratio: '16 / 9', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
  '<div style="display: grid; place-items: center; color: var(--su-text-subtle)">tu trafiłby &lt;iframe&gt;</div>',
)`, { align: 'stretch' }),

      h2('W karcie'),
      p(
        code('cardMedia()'),
        ' robi to już dla górnej części karty. Po ',
        code('aspectRatio()'),
        ' sięgaj, gdy ramka jest gdzie indziej.',
      ),
      demo(`grid({ min: '12rem' },
  card(
    cardMedia({ src: '/logo.svg', alt: '', style: 'background: var(--su-surface-2); object-fit: contain; padding: 1rem' }),
    cardBody(text({ variant: 'small' }, 'cardMedia — wbudowane')),
  ),
  card(
    cardBody(
      stack({ gap: 'sm' },
        aspectRatio({ ratio: '1 / 1', style: 'background: var(--su-surface-2); border-radius: 0.5rem' },
          '<img src="/logo.svg" alt="" style="object-fit: contain; padding: 1rem">'),
        text({ variant: 'small' }, 'aspectRatio — wszędzie indziej'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Przycinanie'),
      p(
        'Dziecko jest rozciągane do wypełnienia i przycinane przez ',
        code('object-fit: cover'),
        '. Dla czegoś, czego przyciąć nie wolno — logo, diagramu — ustaw na dziecku ',
        code('object-fit: contain'),
        ', tak jak robi to każde demo na tej stronie.',
      ),

      h2('Propsy'),
      propsTable([
        ['ratio', 'string', "'16 / 9'", 'Dowolna wartość CSS aspect-ratio.'],
        ['as', 'string', "'div'", 'Element do wyrenderowania.'],
      ]),
    ],
  })
