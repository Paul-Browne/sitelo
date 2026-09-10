import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'

export default () =>
  uiLayout({
    title: 'Mockup',
    description:
      'Una captura dentro de un marco: navegador, ventana, teléfono o terminal.',
    activeHref: '/es/ui/mockup',
    children: [
      p(
        'Para enseñar un producto en una página de aterrizaje o una captura en la documentación. El marco es decoración: los puntos, la barra de direcciones y la muesca llevan todos ',
        code('aria-hidden'),
        ', así que un lector de pantalla recibe lo de dentro y no una descripción del cromo.',
      ),

      h2('Navegador'),
      demo(`mockup({ variant: 'browser', url: 'sitelo.dev' },
  div({ style: 'padding: 1.5rem; background: var(--su-surface-2)' },
    stack({ gap: 'sm' },
      text({ variant: 'h5', as: 'div' }, 'Hola mundo'),
      text({ variant: 'small', tone: 'muted' }, 'Renderizado en la compilación, servido como archivo estático.'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Ventana'),
      p('El mismo marco sin barra de direcciones, para todo lo que no sea una página web.'),
      demo(`mockup({ variant: 'window' },
  div({ style: 'padding: 1.5rem' },
    text({ variant: 'small' }, 'Una ventana sin URL.'),
  ),
)`, { align: 'stretch' }),

      h2('Semáforo'),
      p(
        'Los botones siguen el tema por defecto. ',
        code("dots: 'mac'"),
        ' los pinta con el rojo, amarillo y verde de macOS — los mismos tres en ambos temas, porque la gracia es que se reconozcan.',
      ),
      demo(`mockup({ variant: 'browser', url: 'sitelo.dev', dots: 'mac' },
  div({ style: 'padding: 1.5rem' },
    text({ variant: 'small' }, 'Una ventana que ya has visto antes.'),
  ),
)`, { align: 'stretch' }),

      h2('Terminal'),
      p(
        'La variante ',
        code('code'),
        ' es oscura en ambos temas, como lo es una terminal.',
      ),
      demo(`mockup({ variant: 'code' },
  '<div>$ npm install -D sitelo</div>' +
  '<div>$ npx sitelo build</div>' +
  '<div style="opacity: .7">✓ compilado en 1,09 s</div>' +
  '<div style="opacity: .7">  204 páginas · 9,7 MB</div>',
)`, { align: 'stretch' }),

      h2('Teléfono'),
      p(
        'Un móvil actual: una isla dinámica flotando separada del bisel, y no una muesca recortada en él. Deja sitio para ella arriba de la pantalla.',
      ),
      demo(`mockup({ variant: 'phone' },
  div({ style: 'padding: 3rem 1rem 1rem' },
    stack({ gap: 'md' },
      text({ variant: 'h6', as: 'div' }, 'sitelo'),
      text({ variant: 'caption', tone: 'muted' }, 'Sitios estáticos, sin framework.'),
      button({ size: 'sm', block: true }, 'Empezar'),
    ),
  ),
)`),

      h2('Marco e isla'),
      p(
        code('frame'),
        ' tiñe el raíl exterior — cualquier color CSS, así que un acabado de dispositivo es un hexadecimal y no un nombre del que esta biblioteca tendría que mantener una lista. ',
        code('notch: false'),
        ' deja fuera la isla para lo que no la tenga.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', wrap: true },
  mockup({ variant: 'phone', size: 'sm', frame: '#a8674a' }, ''),
  mockup({ variant: 'phone', size: 'sm', frame: '#2c3644' }, ''),
  mockup({ variant: 'phone', size: 'sm', frame: '#c9ced4', notch: false }, ''),
)`, { align: 'stretch' }),

      h2('Con una captura'),
      p(
        'Una ',
        code('<img>'),
        ' dentro del cuerpo llena el ancho del marco. Combínala con ',
        code('aspectRatio()'),
        ' si la imagen carga tarde y la página no debería saltar.',
      ),
      demo(`mockup({ variant: 'browser', url: 'sitelo.dev/ui' },
  aspectRatio({ ratio: '16 / 9', style: 'background: var(--su-surface-2)' },
    '<img src="/logo.svg" alt="La galería de sitelo UI" style="object-fit: contain; padding: 3rem">',
  ),
)`, { align: 'stretch' }),

      h2('Tamaños'),
      p(
        'Por defecto un mockup llena su contenedor. ',
        code('size'),
        ' lo fija en cambio a un ancho concreto. El teléfono tiene los suyos propios — 22rem de teléfono sería una tableta — y mantiene sus proporciones en todos ellos: las esquinas, el raíl y la isla son fracciones del ancho y no longitudes fijas.',
      ),
      demo(`stack({ gap: 'md', align: 'flex-start' },
  mockup({ variant: 'window', size: 'sm' }, div({ style: 'padding: 1rem' }, text({ variant: 'small' }, 'size: sm'))),
  mockup({ variant: 'window' }, div({ style: 'padding: 1rem' }, text({ variant: 'small' }, 'por defecto — ancho completo'))),
)`, { align: 'stretch' }),

      h2('En un hero'),
      p(
        'La pareja para la que existe esto: pasa un mockup como ',
        code('media'),
        ' de un hero.',
      ),
      demo(`hero({
  level: 2,
  align: 'start',
  title: 'Míralo funcionando',
  description: 'HTML estático para cuando llega al navegador.',
  media: mockup({ variant: 'browser', url: 'example.com' },
    div({ style: 'padding: 1.25rem; background: var(--su-surface-2)' },
      text({ variant: 'small' }, 'Una página, enmarcada.'),
    ),
  ),
}, button('Empezar'))`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['variant', "'browser' | 'window' | 'phone' | 'code'", "'browser'", 'Qué marco se dibuja.'],
        ['url', 'string', '', 'Se muestra en la barra de direcciones. Solo en la variante browser.'],
        ['dots', "'mono' | 'mac'", "'mono'", 'Qué aspecto tienen los tres botones.'],
        ['frame', 'string', '', 'Tiñe el raíl exterior. Cualquier color CSS. Solo en phone.'],
        ['notch', 'boolean', 'true', 'Dibujar la isla dinámica. Solo en phone.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Ancho fijo. El mediano llena el contenedor.'],
      ]),
    ],
  })
