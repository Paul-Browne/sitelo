import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Tarjeta',
    description:
      'Una superficie para contenido agrupado, con cabecera, cuerpo, pie y medios que saben convivir.',
    activeHref: '/es/ui/card',
    extraHead: uiHead(),
    children: [
      p(
        'Una tarjeta agrupa contenido relacionado en su propia superficie. Las partes — ',
        code('cardHeader()'),
        ', ',
        code('cardMedia()'),
        ', ',
        code('cardBody()'),
        ', ',
        code('cardFooter()'),
        ' — son funciones separadas y no props, así que usas solo las que necesitas y las pones en el orden que pida el diseño.',
      ),

      h2('Tarjeta básica'),
      demo(`card(
  cardHeader({ title: 'Rutas basadas en archivos', subtitle: 'src/about.ht.js → /about' }),
  cardBody(text({ variant: 'small', tone: 'muted' }, 'Las carpetas pasan a ser rutas. Los corchetes, parámetros. No hay router que configurar.')),
)`, { align: 'stretch' }),

      h2('Variantes'),
      p(
        'Outlined es la opción por defecto. Elevated cambia el borde por una sombra, y flat tiñe la superficie en lugar de cualquiera de las dos.',
      ),
      demo(`grid({ min: '13rem' },
  card({ variant: 'outlined' }, cardBody(text({ variant: 'small' }, 'Outlined'))),
  card({ variant: 'elevated' }, cardBody(text({ variant: 'small' }, 'Elevated'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Flat'))),
)`, { align: 'stretch' }),

      h2('Con pie'),
      p(
        code('divided'),
        ' añade la línea fina sobre el pie. El pie se empuja abajo, así que unas tarjetas en fila alinean sus acciones aunque el texto de arriba tenga longitudes distintas.',
      ),
      demo(`grid({ min: '14rem' },
  card(
    cardHeader({ title: 'Sitio básico' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'Un proyecto mínimo más configuraciones de despliegue.')),
    cardFooter({ divided: true }, button({ size: 'sm', variant: 'soft' }, 'Abrir')),
  ),
  card(
    cardHeader({ title: 'Blog en Markdown' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'Una carpeta de archivos .md renderizados a páginas estáticas, con feed RSS y sin nada de JavaScript en el cliente.')),
    cardFooter({ divided: true }, button({ size: 'sm', variant: 'soft' }, 'Abrir')),
  ),
)`, { align: 'stretch' }),

      h2('Medios'),
      p(
        code('cardMedia()'),
        ' llena la parte superior de la tarjeta con una relación de aspecto fija, así que una fila de tarjetas queda pareja midan lo que midan las imágenes de origen.',
      ),
      demo(`grid({ min: '13rem' },
  card(
    cardMedia({ src: '/logo.svg', alt: '', style: 'background: var(--su-surface-2); object-fit: contain; padding: 1rem' }),
    cardBody(text({ variant: 'small' }, 'Por defecto 16 / 9')),
  ),
  card(
    cardMedia({ src: '/logo.svg', alt: '', ratio: '4 / 3', style: 'background: var(--su-surface-2); object-fit: contain; padding: 1rem' }),
    cardBody(text({ variant: 'small' }, 'ratio: 4 / 3')),
  ),
)`, { align: 'stretch' }),

      h2('Una tarjeta entera como enlace'),
      p(
        'Dale a la tarjeta un ',
        code('href'),
        ' y toda la superficie pasa a ser un enlace, con la elevación al pasar por encima que lo acompaña. No pongas botones ni otros enlaces dentro de una tarjeta así: el contenido interactivo no puede anidarse dentro de un enlace. Usa un botón en el pie de una tarjeta normal.',
      ),
      demo(`grid({ min: '14rem' },
  card({ href: '/es/docs/routing' },
    cardHeader({ title: 'Rutas', subtitle: 'Leer la guía' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'Rutas dinámicas, comodines y grupos de rutas.')),
  ),
  card({ href: '/es/docs/data' },
    cardHeader({ title: 'Carga de datos', subtitle: 'Leer la guía' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'data() se ejecuta en la compilación, con caché de fetch.')),
  ),
)`, { align: 'stretch' }),

      h2('Relleno'),
      p(
        'Una sola prop fija el relleno de todas las partes de la tarjeta a la vez.',
      ),
      demo(`stack({ gap: 'md' },
  card({ padding: 'sm' }, cardBody(text({ variant: 'small' }, 'padding: sm'))),
  card({ padding: 'xl' }, cardBody(text({ variant: 'small' }, 'padding: xl'))),
)`, { align: 'stretch' }),

      h2('Contenido libre'),
      p(
        'Las partes son una comodidad, no una obligación: una tarjeta admite cualquier hijo, y ',
        code('cardHeader()'),
        ' acepta hijos propios junto al título, para un avatar o un botón de menú a la derecha.',
      ),
      demo(`card(
  cardHeader(
    { title: 'Paul Browne', subtitle: 'Desplegado hace 4 minutos' },
    avatar({ name: 'Paul Browne', size: 'sm' }),
  ),
  cardBody(
    stack({ direction: 'row', gap: 'sm', wrap: true },
      chip({ color: 'success', dot: true }, 'Compilación correcta'),
      chip({ color: 'neutral' }, '12 páginas'),
      chip({ color: 'neutral' }, '4,1 kB'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      p(code('card()'), ':'),
      propsTable([
        ['variant', "'outlined' | 'elevated' | 'flat'", "'outlined'", 'Cómo se separa la superficie de la página.'],
        ['href', 'string', '', 'Dibuja la tarjeta entera como un enlace.'],
        ['padding', 'Space', "'lg'", 'Relleno que usan todas las partes de la tarjeta.'],
      ]),
      p('Las partes:'),
      propsTable([
        ['cardHeader', 'title, subtitle', '', 'Título y subtítulo, más cualquier hijo junto a ellos.'],
        ['cardTitle', 'as', "'h3'", 'El título por su cuenta, cuando la cabecera se construye a mano.'],
        ['cardSubtitle', '', '', 'La línea atenuada bajo un título.'],
        ['cardMedia', 'src, alt, ratio', "'16 / 9'", 'Una imagen de portada con relación de aspecto fija.'],
        ['cardBody', '', '', 'La región principal de contenido.'],
        ['cardFooter', 'divided', 'false', 'Fila inferior de acciones; divided añade la línea fina encima.'],
      ], { headers: ['Parte', 'Props', 'Por defecto', 'Descripción'] }),
    ],
  })
