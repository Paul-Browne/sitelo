import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'

export default () =>
  uiLayout({
    title: 'Modal',
    description:
      'Un <dialog> de verdad, abierto en modo modal: el navegador se encarga del fondo, del foco, de Escape y del clic fuera.',
    activeHref: '/es/ui/modal',
    children: [
      p(
        'Un modal es un ',
        code('<dialog>'),
        '. Cualquier botón con ',
        code('commandfor'),
        ' apuntando al ',
        code('id'),
        ' del modal y ',
        code("command: 'show-modal'"),
        ' lo abre en modo modal: la página de detrás queda inerte, así que el foco y el lector de pantalla se quedan dentro. Sin script por ningún lado: el fondo, Escape y el clic fuera son cosa del navegador.',
      ),
      p(
        'Por eso el ',
        code('id'),
        ' es obligatorio y el componente lanza un error sin él: el id es todo el cableado.',
      ),

      h2('Modal básico'),
      p('Todos los modales de esta página se abren de verdad: pruébalos.'),
      demo(`fragment(
  button({ commandfor: 'demo-basic', command: 'show-modal' }, 'Abrir modal'),
  modal({ id: 'demo-basic', title: '¿Recompilar el sitio?' },
    'Esto ejecuta sitelo build y vuelve a publicar dist/.',
  ),
)`),

      h2('Con pie'),
      p(
        'Un botón de cerrar es cualquier botón que apunte al mismo id con ',
        code("command: 'close'"),
        '.',
      ),
      demo(`fragment(
  button({ color: 'danger', commandfor: 'demo-confirm', command: 'show-modal' }, 'Eliminar página…'),
  modal({
    id: 'demo-confirm',
    title: '¿Eliminar esta página?',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({
        variant: 'ghost',
        color: 'neutral',
        commandfor: 'demo-confirm',
        command: 'close',
      }, 'Cancelar'),
      button({ color: 'danger' }, 'Eliminar'),
    ),
  }, 'Esto no se puede deshacer. El HTML generado desaparece en la siguiente compilación.'),
)`),

      h2('Tamaños'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm', wrap: true },
    button({ variant: 'outline', color: 'neutral', commandfor: 'demo-sm', command: 'show-modal' }, 'Pequeño'),
    button({ variant: 'outline', color: 'neutral', commandfor: 'demo-md', command: 'show-modal' }, 'Mediano'),
    button({ variant: 'outline', color: 'neutral', commandfor: 'demo-lg', command: 'show-modal' }, 'Grande'),
  ),
  modal({ id: 'demo-sm', size: 'sm', title: 'Pequeño' }, 'size: sm — unas 24rem.'),
  modal({ id: 'demo-md', title: 'Mediano' }, 'El valor por defecto — unas 32rem.'),
  modal({ id: 'demo-lg', size: 'lg', title: 'Grande' }, 'size: lg — unas 48rem.'),
)`),

      h2('Formularios dentro de un modal'),
      demo(`fragment(
  button({ variant: 'soft', commandfor: 'demo-form', command: 'show-modal' }, 'Página nueva…'),
  modal({
    id: 'demo-form',
    title: 'Página nueva',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({ variant: 'ghost', color: 'neutral', commandfor: 'demo-form', command: 'close' }, 'Cancelar'),
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
        ' quita la × de la esquina. Escape y el clic fuera lo siguen cerrando; con ',
        code("closedby: 'closerequest'"),
        ' solo lo cierra Escape.',
      ),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', commandfor: 'demo-bare', command: 'show-modal' }, 'Sin botón de cerrar'),
  modal({ id: 'demo-bare', title: 'Pulsa Escape', closable: false },
    'O haz clic en cualquier sitio fuera de este diálogo.',
  ),
)`),

      h2('Contenido largo'),
      p('El cuerpo se desplaza; la cabecera y el pie se quedan quietos.'),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', commandfor: 'demo-long', command: 'show-modal' }, 'Modal largo'),
  modal({
    id: 'demo-long',
    title: 'Notas de la versión',
    footer: button({ commandfor: 'demo-long', command: 'close' }, 'Cerrar'),
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
        'La página que hay detrás de un modal abierto no se desplaza. Eso es lo único que un diálogo modal te deja a ti, y aquí está hecho en CSS: sin script y sin nada que inicializar. Pasa ',
        code('lockScroll: false'),
        ' para dejar que el fondo se desplace como siempre.',
      ),

      h2('Soporte de navegadores'),
      p(
        'Abrir un diálogo con el command de un botón funciona en todos los navegadores actuales: Chrome 135, Firefox 144 y Safari 26.2 en adelante. En uno anterior, button() añade un onclick que descarga unos cientos de bytes de /su/dialog.js para hacer lo mismo, solo allí y solo en el primer clic. Safari aún no cierra un diálogo al pulsar fuera (closedby), y ahí también se encarga ese mismo archivo.',
      ),

      h2('Props'),
      propsTable([
        ['id', 'string', '', 'Obligatorio. Aquello a lo que apunta el commandfor de un disparador.'],
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
