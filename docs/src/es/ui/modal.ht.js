import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Modal',
    description:
      'Un diálogo construido sobre la API de popover: el navegador se encarga de abrirlo, del fondo, del clic fuera y de Escape.',
    activeHref: '/es/ui/modal',
    extraHead: uiHead(),
    children: [
      p(
        'Un modal es un elemento ',
        code('popover'),
        '. Cualquier botón cuyo ',
        code('popovertarget'),
        ' coincida con el ',
        code('id'),
        ' del modal lo abre — sin script por ningún lado, incluidos el fondo, el cierre al pulsar fuera, Escape y el manejo del foco, de todo lo cual se ocupa el navegador.',
      ),
      p(
        'Por eso el ',
        code('id'),
        ' es obligatorio y el componente lanza un error sin él: el id es todo el cableado.',
      ),

      h2('Modal básico'),
      p('Todos los modales de esta página se abren de verdad: pruébalos.'),
      demo(`fragment(
  button({ popovertarget: 'demo-basic' }, 'Abrir modal'),
  modal({ id: 'demo-basic', title: '¿Recompilar el sitio?' },
    'Esto ejecuta sitelo build y vuelve a publicar dist/.',
  ),
)`),

      h2('Con pie'),
      p(
        'Un botón de cerrar es cualquier botón que apunte al mismo id con ',
        code('popovertargetaction="hide"'),
        '.',
      ),
      demo(`fragment(
  button({ color: 'danger', popovertarget: 'demo-confirm' }, 'Eliminar página…'),
  modal({
    id: 'demo-confirm',
    title: '¿Eliminar esta página?',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({
        variant: 'ghost',
        color: 'neutral',
        popovertarget: 'demo-confirm',
        popovertargetaction: 'hide',
      }, 'Cancelar'),
      button({ color: 'danger' }, 'Eliminar'),
    ),
  }, 'Esto no se puede deshacer. El HTML generado desaparece en la siguiente compilación.'),
)`),

      h2('Tamaños'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm', wrap: true },
    button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-sm' }, 'Pequeño'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-md' }, 'Mediano'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-lg' }, 'Grande'),
  ),
  modal({ id: 'demo-sm', size: 'sm', title: 'Pequeño' }, 'size: sm — unas 24rem.'),
  modal({ id: 'demo-md', title: 'Mediano' }, 'El valor por defecto — unas 32rem.'),
  modal({ id: 'demo-lg', size: 'lg', title: 'Grande' }, 'size: lg — unas 48rem.'),
)`),

      h2('Formularios dentro de un modal'),
      demo(`fragment(
  button({ variant: 'soft', popovertarget: 'demo-form' }, 'Página nueva…'),
  modal({
    id: 'demo-form',
    title: 'Página nueva',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({ variant: 'ghost', color: 'neutral', popovertarget: 'demo-form', popovertargetaction: 'hide' }, 'Cancelar'),
      button({ type: 'submit' }, 'Crear'),
    ),
  },
    stack({ gap: 'md' },
      textField({ label: 'Título', name: 'modal-title', placeholder: 'Acerca de' }),
      selectField({ label: 'Extensión', name: 'modal-ext', options: ['.ht.js', '.ht.ts', '.ht.jsx'] }),
    ),
  ),
)`),

      h2('Sin botón de cerrar'),
      p(
        code('closable: false'),
        ' quita la × de la esquina. Escape y el clic fuera lo siguen cerrando: un popover no se puede volver realmente bloqueante, y de todos modos ese suele ser el comportamiento correcto.',
      ),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-bare' }, 'Sin botón de cerrar'),
  modal({ id: 'demo-bare', title: 'Pulsa Escape', closable: false },
    'O haz clic en cualquier sitio fuera de este diálogo.',
  ),
)`),

      h2('Contenido largo'),
      p('El cuerpo se desplaza; la cabecera y el pie se quedan quietos.'),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-long' }, 'Modal largo'),
  modal({
    id: 'demo-long',
    title: 'Notas de la versión',
    footer: button({ popovertarget: 'demo-long', popovertargetaction: 'hide' }, 'Cerrar'),
  },
    stack({ gap: 'md' },
      ...Array.from({ length: 12 }, (unused, index) =>
        text({ variant: 'small', tone: 'muted' }, 'Cambio ' + (index + 1) + ' — se arregló algo.'),
      ),
    ),
  ),
)`),

      h2('Desplazamiento del fondo'),
      p(
        'La página que hay detrás de un modal abierto no se desplaza. Eso es lo único que la API de popover te deja a ti, y aquí está hecho en CSS: sin script y sin nada que inicializar. Pasa ',
        code('lockScroll: false'),
        ' para dejar que el fondo se desplace como siempre.',
      ),

      h2('Soporte de navegadores'),
      p(
        'La API de popover está disponible en todos los navegadores actuales. En uno demasiado viejo como para conocerla, el modal se dibuja en línea dentro de la página en vez de encima: visible y utilizable, solo que sin superponerse. No desaparece nada.',
      ),

      h2('Props'),
      propsTable([
        ['id', 'string', '', 'Obligatorio. Aquello a lo que apunta el popovertarget de un disparador.'],
        ['title', 'Child', '', 'Encabezado, y nombre accesible del diálogo.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Ancho máximo.'],
        ['footer', 'Child', '', 'Fila inferior, sobre su propia banda teñida.'],
        ['closable', 'boolean', 'true', 'Mostrar la × en la cabecera.'],
        ['closeLabel', 'string', "'Close'", 'Nombre accesible de ese botón.'],
        ['lockScroll', 'boolean', 'true', 'Impedir que la página de detrás se desplace mientras está abierto.'],
      ]),
      p(
        code('closeButton({ target })'),
        ' dibuja esa × por su cuenta, para una cabecera que construyas tú.',
      ),
    ],
  })
