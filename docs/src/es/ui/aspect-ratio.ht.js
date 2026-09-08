import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Relación de aspecto',
    description:
      'Mantén una caja con una forma fija, para que nada de la página se mueva cuando cargue el contenido.',
    activeHref: '/es/ui/aspect-ratio',
    extraHead: uiHead(),
    children: [
      p(
        'La altura se deduce del ancho antes de que se haya cargado nada, así que una imagen o un incrustado que llega tarde no empuja hacia abajo el resto de la página. El hijo rellena la caja y se recorta en lugar de dejar franjas.',
      ),

      h2('Relación de aspecto básica'),
      demo(`aspectRatio({ ratio: '16 / 9', style: 'background: var(--su-surface-2)' },
  '<img src="/logo.svg" alt="" style="object-fit: contain; padding: 2rem">',
)`, { align: 'stretch' }),

      h2('Relaciones habituales'),
      demo(`grid({ min: '9rem' },
  ...['16 / 9', '4 / 3', '1 / 1', '3 / 4'].map((ratio) =>
    stack({ gap: 'xs' },
      aspectRatio({ ratio, style: 'background: var(--su-surface-2); border-radius: 0.5rem' },
        '<img src="/logo.svg" alt="" style="object-fit: contain; padding: 1rem">'),
      text({ variant: 'caption', tone: 'muted', align: 'center' }, ratio),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Incrustados'),
      p(
        'La razón de ser de este componente: un ',
        code('<iframe>'),
        ' no tiene tamaño intrínseco, así que sin una relación se colapsa o necesita una altura fija a mano.',
      ),
      demo(`aspectRatio({ ratio: '16 / 9', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
  '<div style="display: grid; place-items: center; color: var(--su-text-subtle)">aquí iría un &lt;iframe&gt;</div>',
)`, { align: 'stretch' }),

      h2('En una tarjeta'),
      p(
        code('cardMedia()'),
        ' ya hace esto en la parte superior de una tarjeta. Recurre a ',
        code('aspectRatio()'),
        ' cuando la caja esté en otro sitio.',
      ),
      demo(`grid({ min: '12rem' },
  card(
    cardMedia({ src: '/logo.svg', alt: '', style: 'background: var(--su-surface-2); object-fit: contain; padding: 1rem' }),
    cardBody(text({ variant: 'small' }, 'cardMedia — de serie')),
  ),
  card(
    cardBody(
      stack({ gap: 'sm' },
        aspectRatio({ ratio: '1 / 1', style: 'background: var(--su-surface-2); border-radius: 0.5rem' },
          '<img src="/logo.svg" alt="" style="object-fit: contain; padding: 1rem">'),
        text({ variant: 'small' }, 'aspectRatio — en cualquier otro sitio'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Recorte'),
      p(
        'El hijo se estira para rellenar y se recorta con ',
        code('object-fit: cover'),
        '. Para algo que no debe recortarse — un logotipo, un diagrama — pon ',
        code('object-fit: contain'),
        ' en el hijo, como hacen todas las demos de esta página.',
      ),

      h2('Props'),
      propsTable([
        ['ratio', 'string', "'16 / 9'", 'Cualquier valor CSS de aspect-ratio.'],
        ['as', 'string', "'div'", 'Elemento que se renderiza.'],
      ]),
    ],
  })
