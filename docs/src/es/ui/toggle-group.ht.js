import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Grupo de alternancia',
    description:
      'Un control segmentado: botones de alternancia unidos en uno, o enlaces donde cada segmento es su propia página.',
    activeHref: '/es/ui/toggle-group',
    extraHead: uiHead(),
    children: [
      p(
        'Un grupo de alternancia es una fila de opciones que se lee como un solo control. Constrúyelo a partir de ',
        code('items'),
        ', y di cuál está activo con ',
        code('value'),
        '.',
      ),

      h2('Grupo básico'),
      demo(`toggleGroup({
  label: 'Alineación del texto',
  value: 'center',
  items: [
    { value: 'left', label: 'Izquierda' },
    { value: 'center', label: 'Centro' },
    { value: 'right', label: 'Derecha' },
  ],
})`),

      h2('Cadenas simples'),
      demo(`toggleGroup({ label: 'Densidad', value: 'cómoda', items: ['compacta', 'cómoda', 'amplia'] })`),

      h2('Enlaces'),
      p(
        'Esta es la forma que suele querer un sitio estático: cada segmento es una página. Los elementos con ',
        code('href'),
        ' se dibujan como anclas y el activo se marca con ',
        code('aria-current="page"'),
        ', no con ',
        code('aria-pressed'),
        ', porque un enlace no es un botón que hayas dejado hundido.',
      ),
      demo(`toggleGroup({
  label: 'Sección',
  value: 'ui',
  items: [
    { value: 'docs', label: 'Documentación', href: '/es/docs' },
    { value: 'ui', label: 'UI', href: '/es/ui' },
    { value: 'examples', label: 'Ejemplos', href: '/es/examples' },
  ],
})`),

      h2('Más de uno activo'),
      p(
        'Pasa un array como ',
        code('value'),
        '. El contenedor es un ',
        code('group'),
        ' normal en ambos casos: un ',
        code('radiogroup'),
        ' estaría mal, porque esto son botones pulsados y no radios.',
      ),
      demo(`toggleGroup({
  label: 'Formato',
  value: ['bold', 'underline'],
  items: [
    { value: 'bold', label: 'Negrita' },
    { value: 'italic', label: 'Cursiva' },
    { value: 'underline', label: 'Subrayado' },
  ],
})`),

      h2('Tamaños y variantes'),
      demo(`stack({ gap: 'md' },
  toggleGroup({ size: 'sm', label: 'Pequeño', value: 'a', items: ['a', 'b', 'c'] }),
  toggleGroup({ size: 'md', label: 'Mediano', value: 'a', items: ['a', 'b', 'c'] }),
  toggleGroup({ size: 'lg', label: 'Grande', value: 'a', items: ['a', 'b', 'c'] }),
  toggleGroup({ variant: 'ghost', label: 'Ghost', value: 'b', items: ['a', 'b', 'c'] }),
)`, { align: 'start' }),

      h2('Elementos deshabilitados'),
      demo(`toggleGroup({
  label: 'Renderizado',
  value: 'static',
  items: [
    { value: 'static', label: 'Estático' },
    { value: 'islands', label: 'Islas' },
    { value: 'ssr', label: 'SSR', disabled: true },
  ],
})`),

      h2('En una barra de herramientas'),
      demo(`stack({ direction: 'row', gap: 'md', wrap: true, align: 'center' },
  toggleGroup({ label: 'Alineación', value: 'Izquierda', size: 'sm', items: ['Izquierda', 'Centro', 'Derecha'] }),
  divider({ orientation: 'vertical' }),
  toggleGroup({ label: 'Estilo', value: ['Negrita'], size: 'sm', items: ['Negrita', 'Cursiva'] }),
)`),

      h2('Cuándo usar otra cosa'),
      p(
        'Si la elección se envía con un formulario, usa ',
        code('choiceGroup()'),
        ': radios de verdad, sin script. Si cada segmento es una página, prefiere la forma de enlaces de arriba. Un grupo de alternancia es para una elección sobre la que actúa la propia página.',
      ),

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'Cadenas, u objetos { value, label, href, disabled }.'],
        ['value', 'string | number | Array', '', 'Qué elemento está activo. Un array cuando pueden serlo varios.'],
        ['label', 'string', '', 'Nombre accesible del grupo.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Se aplica a todos los elementos.'],
        ['variant', "'outline' | 'ghost' | 'soft'", "'outline'", 'Cómo se ve un elemento apagado.'],
      ]),
    ],
  })
