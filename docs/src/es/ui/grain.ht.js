import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'

export default () =>
  uiLayout({
    title: 'Grano',
    description:
      'Un envoltorio que extiende un grano de película sobre lo que contenga.',
    activeHref: '/es/ui/grain',
    children: [
      p(
        'El grano le quita la planitud a una superficie grande de color: un héroe, una banda de color, una tarjeta que si no se leería como un rectángulo liso. Envuelve el contenido igual que ',
        code('container()'),
        ', pero no fija ancho ninguno: la textura se dibuja en ',
        code('::after'),
        ', por encima de los hijos y sin interceptar el puntero.',
      ),
      p(
        'El mosaico es un SVG estático de ruido fractal, pintado una vez y repetido. Un ',
        code('filter'),
        ' sobre los píxeles vivos se vería casi igual y costaría un re-rasterizado cada vez que se moviera algo por debajo.',
      ),

      h2('Grano básico'),
      demo(`grain({ style: 'background: var(--su-surface-2); padding: 2rem; border-radius: 0.75rem' },
  text({ variant: 'lead', align: 'center' }, 'Con textura.'),
)`, { align: 'stretch' }),

      h2('Intensidad'),
      p(
        'Tres pasos. El tema fija la fuerza base y la intensidad la escala, porque una superficie casi negra acepta el grano con más facilidad que el papel: medido como claridad percibida, el mismo mosaico rinde alrededor de 1,6× de moteado sobre el fondo oscuro. Así que ',
        code('medium'),
        ' es una opacidad más baja en modo oscuro, y los dos acaban en el mismo sitio.',
      ),
      demo(`grid({ min: '9rem' },
  ...['soft', 'medium', 'strong'].map((intensity) =>
    grain({ intensity, style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, intensity),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Escala'),
      p(
        'El tamaño de un mosaico de ruido. Más pequeño es más fino: más cerca de la película, más lejos de la arena.',
      ),
      demo(`grid({ min: '9rem' },
  ...['60px', '180px', '420px'].map((scale) =>
    grain({ scale, intensity: 'strong', style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, scale),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Alrededor de un contenedor'),
      p(
        'El grano no lleva límite de ancho propio, y eso es justo lo que hace que esto funcione: el envoltorio va de borde a borde y el ',
        code('container()'),
        ' de dentro mantiene el texto centrado y legible.',
      ),
      demo(`grain({ as: 'section', style: 'background: var(--su-primary-soft); padding-block: 2.5rem; border-radius: 0.75rem' },
  container({ size: 'sm' },
    stack({ gap: 'sm', align: 'center' },
      heading({ level: 2, size: 'h4' }, 'Una banda con textura'),
      text({ tone: 'muted', align: 'center' }, 'Ancho completo por fuera, una columna legible por dentro.'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Sobre una tarjeta'),
      p(
        'La textura hereda el ',
        code('border-radius'),
        ' de la caja, así que envolver algo redondeado no le cuadra las esquinas.',
      ),
      demo(`grid({ min: '12rem' },
  grain({ style: 'border-radius: var(--su-radius-lg)' },
    card({ variant: 'elevated' },
      cardBody(text({ variant: 'small' }, 'Con grano')),
    ),
  ),
  card({ variant: 'elevated' },
    cardBody(text({ variant: 'small' }, 'Sin grano')),
  ),
)`, { align: 'stretch' }),

      h2('Mezcla'),
      p(
        'Por defecto la textura se posa sobre el contenido con su propia opacidad. ',
        code('blend'),
        ' acepta cualquier ',
        code('mix-blend-mode'),
        ': ',
        code('overlay'),
        ' y ',
        code('soft-light'),
        ' empujan el grano hacia dentro del color de debajo en vez de agrisarlo.',
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
        ['intensity', "'soft' | 'medium' | 'strong'", "'medium'", 'Cuánto se fuerza la textura, relativo a la base del tema.'],
        ['opacity', 'number', '', 'Una opacidad cruda, que se impone a intensity y al tema.'],
        ['scale', 'string', "'180px'", 'El tamaño de un mosaico de ruido.'],
        ['blend', 'string', "'normal'", 'Un mix-blend-mode para la textura.'],
        ['as', 'string', "'div'", 'Elemento a renderizar, p. ej. section.'],
      ]),
    ],
  })
