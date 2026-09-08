import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Hero',
    description:
      'La parte superior de una página de aterrizaje: un titular, una frase y qué hacer al respecto.',
    activeHref: '/es/ui/hero',
    extraHead: uiHead(),
    children: [
      p(
        'Un hero es lo primero de una portada de marketing o de documentación. Dibuja una ',
        code('<section>'),
        ' con un ',
        code('<h1>'),
        ' dentro, así que es el encabezado de la página, no un cartel decorativo que resulta ser grande.',
      ),

      h2('Hero básico'),
      demo(`hero({
  level: 2,
  title: 'Sitios estáticos, sin el framework',
  description: 'Escribe funciones que devuelven HTML. Obtén un sitio completo.',
},
  button({ size: 'lg' }, 'Empezar'),
  button({ size: 'lg', variant: 'outline', color: 'neutral' }, 'Leer la documentación'),
)`, { align: 'stretch' }),

      h2('Con antetítulo'),
      p('Una línea corta sobre el título: una versión, una categoría, un anuncio.'),
      demo(`hero({
  level: 2,
  eyebrow: 'sitelo 2.7',
  title: 'Ahora con biblioteca de componentes',
  description: 'Setenta componentes, sin runtime, con un script opcional.',
},
  button({ size: 'lg', href: '/es/ui' }, 'Ver los componentes'),
)`, { align: 'stretch' }),

      h2('Alineado a la izquierda'),
      demo(`hero({
  level: 2,
  align: 'start',
  eyebrow: 'Código abierto',
  title: 'Hecho a la vista de todos',
  description: 'Licencia MIT, y lo bastante pequeño como para leerlo en una tarde.',
},
  button({ href: 'https://github.com/paul-browne/sitelo' }, 'Verlo en GitHub'),
)`, { align: 'stretch' }),

      h2('Con medios'),
      p(
        'Pasar ',
        code('media'),
        ' cambia a dos columnas en cuanto hay sitio para ellas, y vuelve a apilar en una sola en pantallas estrechas. Casa de forma natural con ',
        code('mockup()'),
        '.',
      ),
      demo(`hero({
  level: 2,
  align: 'start',
  title: 'Míralo funcionando',
  description: 'Cuando llega al navegador, cada página ya es HTML estático.',
  media: mockup({ variant: 'browser', url: 'example.com' },
    div({ style: 'padding: 1.5rem; background: var(--su-surface-2)' },
      text({ variant: 'h5', as: 'div' }, 'Hola mundo'),
      text({ variant: 'small', tone: 'muted' }, 'Renderizado en la compilación.'),
    ),
  ),
},
  button('Empezar'),
)`, { align: 'stretch' }),

      h2('Dentro de un contenedor'),
      p(
        'Un hero no tiene límite de ancho propio: mételo en un ',
        code('container()'),
        ' para que quede alineado con todo lo demás de la página.',
      ),
      demo(`container({ size: 'md', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
  hero({
    level: 2,
    title: 'Contenido',
    description: 'El contenedor fija el ancho; el hero fija el ritmo.',
  }),
)`, { align: 'stretch' }),

      h2('Nivel de encabezado'),
      p(
        'El título es por defecto el ',
        code('<h1>'),
        ' de la página, que es lo correcto en una página de aterrizaje. Un hero usado a media página no es el encabezado de la página, así que bájalo con ',
        code('level'),
        ' — todas las demos de esta página lo hacen, porque la página ya tiene su propio h1.',
      ),

      h2('Solo un título'),
      p('Cada parte es opcional, y nada vacío se dibuja.'),
      demo(`hero({ level: 2, title: 'Documentación' })`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['eyebrow', 'Child', '', 'Línea pequeña en mayúsculas sobre el título.'],
        ['title', 'Child', '', 'Se dibuja como el h1 de la página.'],
        ['description', 'Child', '', 'La frase que va debajo.'],
        ['media', 'Child', '', 'Al lado del texto en pantalla ancha, encima en pantalla estrecha.'],
        ['align', "'center' | 'start'", "'center'", 'Alineación del texto cuando no hay medios.'],
        ['level', 'number', '1', 'Nivel de encabezado del título. Bájalo para un hero a media página.'],
        ['as', 'string', "'section'", 'Elemento que se renderiza.'],
      ]),
      p('Los hijos pasan a ser la fila de acciones bajo la descripción.'),
    ],
  })
