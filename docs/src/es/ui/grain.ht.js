import { h2, p } from 'javascript-to-html'
import { code, demo, grainSandbox, grainSandboxHead, propsTable, uiLayout } from '../../lib/es.js'

export default () =>
  uiLayout({
    title: 'Grano',
    description:
      'Un envoltorio que extiende un grano de película sobre lo que contenga.',
    activeHref: '/es/ui/grain',
    extraHead: grainSandboxHead(),
    children: [
      p(
        'El grano le quita la planitud a una superficie grande de color: un héroe, una banda de color, una tarjeta que si no se leería como un rectángulo liso. Envuelve el contenido igual que ',
        code('container()'),
        ', pero no fija ancho ninguno: la textura se dibuja en ',
        code('::after'),
        ', por encima de los hijos y sin interceptar el puntero.',
      ),
      p(
        'El mosaico es un SVG estático de ruido fractal, pintado una vez. Un ',
        code('filter'),
        ' sobre los píxeles vivos se vería casi igual y costaría un re-rasterizado cada vez que se moviera algo por debajo.',
      ),

      p(
        'Hay dos capas de control. ',
        code('opacity'),
        ' es cuánto se aprieta la textura una vez dibujada; si no se toca, la fija el tema, y ese es el valor sobre el que están equilibrados los dos temas. ',
        code('type'),
        ', ',
        code('frequency'),
        ', ',
        code('octaves'),
        ', ',
        code('seed'),
        ' y ',
        code('color'),
        ' son la turbulencia en sí; tocar cualquiera de ellas construye una textura para ese elemento en vez de usar la compartida de la hoja de estilos.',
      ),

      h2('Grano básico'),
      demo(`grain({ style: 'background: var(--su-surface-2); padding: 2rem; border-radius: 0.75rem' },
  text({ variant: 'lead', align: 'center' }, 'Con textura.'),
)`, { align: 'stretch' }),

      h2('Tipo de ruido'),
      p(
        code('fractal'),
        ' suma el ruido tal cual y da el moteado parejo de la película. ',
        code('turbulence'),
        ' toma su valor absoluto, lo que deja vetas oscuras y grumos: más cerca del humo o del mármol que del grano.',
      ),
      demo(`grid({ min: '9rem' },
  ...['fractal', 'turbulence'].map((type) =>
    grain({ type, style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, type),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Frecuencia'),
      p(
        'Ciclos por píxel: más alto es más fino. El ruido se dibuja al tamaño de la propia caja, una unidad por píxel, así que esto se mantiene mida lo que mida la caja: una tarjeta pequeña y una banda a todo lo ancho reciben el mismo grano, y nada se repite.',
      ),
      demo(`grid({ min: '9rem' },
  ...[0.2, 0.57, 1.2].map((frequency) =>
    grain({ frequency, style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, String(frequency)),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Octavas'),
      p(
        'Cuántas capas de ruido se suman, cada una más fina y más tenue que la anterior. Una sola queda lisa y pareja; más añaden detalle, y cada una le cuesta al navegador otra pasada la primera vez que dibuja el mosaico.',
      ),
      demo(`grid({ min: '9rem' },
  ...[1, 3, 6].map((octaves) =>
    grain({ octaves, style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, String(octaves)),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Semilla'),
      p(
        'Qué ruido se dibuja. Vale cualquier número, el mismo da siempre el mismo patrón y no cambia nada más de la textura: útil cuando dos paneles con grano quedan uno al lado del otro y la repetición se delata.',
      ),
      demo(`grid({ min: '9rem' },
  ...[0, 7, 42].map((seed) =>
    grain({ seed, style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, String(seed)),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Color'),
      p(
        'El ruido es gris por defecto. ',
        code('color'),
        ' lo tiñe: el valor se multiplica dentro del filtro, así que tiene que ser uno que se pueda resolver al construir la página — ',
        code('#rgb'),
        ', ',
        code('#rrggbb'),
        ' o ',
        code('rgb()'),
        '. Un color con nombre, ',
        code('currentColor'),
        ' o un ',
        code('var()'),
        ' no lo son, y dejan el ruido gris en vez de romper la compilación. El alfa es cuánto tinte: ',
        code('#ff880080'),
        ' es la mitad de ',
        code('#ff8800'),
        ', y alfa cero es ninguno.',
      ),
      demo(`grid({ min: '9rem' },
  ...['#0a7a45', '#c05621', '#2f7fc7'].map((color) =>
    grain({ color, style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, color),
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
    grain({ blend, style: 'background: var(--su-primary-soft); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, blend),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Sandbox'),
      grainSandbox(),

      h2('Props'),
      propsTable([
        ['opacity', 'number', '', 'Opacidad de la textura. Si no se toca, la fija el tema.'],
        ['blend', 'string', "'normal'", 'Un mix-blend-mode para la textura.'],
        ['type', "'fractal' | 'turbulence'", "'fractal'", 'Qué turbulencia dibujar.'],
        ['frequency', 'number', '0.57', 'Ciclos por píxel: más alto es más fino.'],
        ['octaves', 'number', '3', 'Capas de ruido que se suman, de 1 a 8.'],
        ['seed', 'number', '0', 'Qué ruido dibujar.'],
        ['color', 'string', '', 'Tiñe el ruido; el alfa es cuánto. #rgb, #rrggbb, #rrggbbaa, rgb() o rgba().'],
        ['as', 'string', "'div'", 'Elemento a renderizar, p. ej. section.'],
      ]),
    ],
  })
