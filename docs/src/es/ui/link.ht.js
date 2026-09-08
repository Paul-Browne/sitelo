import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Enlace',
    description:
      'Un ancla con estilo, con los atributos de seguridad que necesita un enlace externo.',
    activeHref: '/es/ui/link',
    extraHead: uiHead(),
    children: [
      p(
        'Un enlace es un ancla con el subrayado y la paleta de la biblioteca. Se exporta con dos nombres — ',
        code('link'),
        ' y ',
        code('textLink'),
        ' — porque ',
        code('link'),
        ' es también el elemento ',
        code('<link>'),
        ' de javascript-to-html, e importar ambos con un solo nombre es un error de sintaxis. Usa ',
        code('textLink'),
        ', o importa la biblioteca como espacio de nombres.',
      ),

      h2('Enlace básico'),
      demo(`text('Lee la ', link({ href: '/es/docs' }, 'documentación'), ' para empezar.')`, {
        align: 'stretch',
      }),

      h2('Colores'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  link({ href: '#', color: 'primary' }, 'Primary'),
  link({ href: '#', color: 'neutral' }, 'Neutral'),
  link({ href: '#', color: 'success' }, 'Success'),
  link({ href: '#', color: 'warning' }, 'Warning'),
  link({ href: '#', color: 'danger' }, 'Danger'),
)`),

      h2('Discreto'),
      p(
        'Un enlace discreto hereda el color de alrededor y solo enseña el subrayado al pasar por encima — para listas de enlaces donde un subrayado en cada fila sería ruido.',
      ),
      demo(`stack({ gap: 'xs' },
  link({ href: '/es/docs/routing', subtle: true }, 'Rutas'),
  link({ href: '/es/docs/data', subtle: true }, 'Carga de datos'),
  link({ href: '/es/docs/assets', subtle: true }, 'Recursos y estilos'),
)`, { align: 'stretch' }),

      h2('Enlaces externos'),
      p(
        code('external'),
        ' añade ',
        code('target="_blank"'),
        ' y el ',
        code('rel'),
        ' que tiene que acompañarlo. Di en el texto del enlace que abre una pestaña nueva, o añade una nota oculta a la vista: una pestaña nueva sin aviso desorienta.',
      ),
      demo(`text(
  'La biblioteca está en ',
  link({ href: 'https://www.npmjs.com/package/sitelo', external: true },
    'npm',
    visuallyHidden(' (se abre en una pestaña nueva)'),
  ),
  '.',
)`, { align: 'stretch' }),

      h2('En un párrafo'),
      demo(`text({ variant: 'lead' },
  'sitelo está construido sobre ',
  link({ href: 'https://vite.dev', external: true }, 'Vite'),
  ', renderiza con ',
  link({ href: 'https://ht.js.org', external: true }, 'javascript-to-html'),
  ', y no envía nada al navegador salvo que se lo pidas.',
)`, { align: 'stretch' }),

      h2('Cuándo usar un botón en su lugar'),
      p(
        'Un enlace navega; un botón ejecuta una acción. Si aquello cambia el estado de la página en vez de llevar al lector a otro sitio, debería ser un ',
        code('button()'),
        '; y si navega pero debe parecer un botón, dale a ',
        code('button()'),
        ' un ',
        code('href'),
        ', que dibuja un ancla por debajo.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center', wrap: true },
  link({ href: '/es/docs' }, 'Un enlace que navega'),
  button({ href: '/es/docs', variant: 'outline' }, 'Un enlace con pinta de botón'),
  button({ variant: 'link' }, 'Un botón con pinta de enlace'),
)`),

      h2('Props'),
      propsTable([
        ['href', 'string', '', 'Adónde lleva.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'De qué paleta bebe.'],
        ['subtle', 'boolean', 'false', 'Hereda el color de alrededor; subrayado solo al pasar por encima.'],
        ['external', 'boolean', 'false', 'Añade target="_blank" y rel="noopener noreferrer".'],
      ]),
    ],
  })
