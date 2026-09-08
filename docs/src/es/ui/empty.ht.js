import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Estado vacío',
    description:
      'El aspecto de una lista antes de que tenga nada dentro.',
    activeHref: '/es/ui/empty',
    extraHead: uiHead(),
    children: [
      p(
        'Un hueco en blanco se lee como un error. Un estado vacío dice qué hueco está en blanco, por qué y qué hacer a continuación — y es el caso que más fácilmente se olvida, porque durante el desarrollo siempre hay datos.',
      ),

      h2('Estado vacío básico'),
      demo(`empty({
  title: 'Aún no hay entradas',
  description: 'Añade un archivo Markdown en src/posts y aparecerá aquí.',
})`, { align: 'stretch' }),

      h2('Con icono'),
      p(
        'El icono es decoración: va marcado con ',
        code('aria-hidden'),
        ', porque el título ya dice lo que ocurre.',
      ),
      demo(`empty({
  icon: icon('folder'),
  title: 'Aquí no hay nada',
  description: 'Esta carpeta no tiene páginas dentro.',
})`, { align: 'stretch' }),

      h2('Con una acción'),
      p('Los hijos pasan a ser la fila de acciones.'),
      demo(`empty({
  icon: icon('search'),
  title: 'Sin resultados para «islas»',
  description: 'Revisa la ortografía, o navega la documentación en su lugar.',
},
  button({ href: '/es/docs' }, 'Ver la documentación'),
  button({ variant: 'outline', color: 'neutral' }, 'Limpiar la búsqueda'),
)`, { align: 'stretch' }),

      h2('En una tarjeta'),
      demo(`card(
  cardHeader({ title: 'Despliegues' }),
  cardBody(
    empty({
      title: 'Aún no hay despliegues',
      description: 'Haz push a main y la primera compilación aparecerá aquí.',
    }, button({ size: 'sm' }, 'Conectar un repositorio')),
  ),
)`, { align: 'stretch' }),

      h2('En lugar de una tabla'),
      p(
        'Cambia la tabla por un estado vacío en vez de dibujar una cabecera sin ninguna fila debajo.',
      ),
      demo(`return (() => {
  const rows = []

  return card(
    cardHeader({ title: 'Historial de compilaciones' }),
    rows.length
      ? table({ columns: [{ key: 'commit', header: 'Commit' }], rows })
      : cardBody(empty({
          title: 'No hay compilaciones registradas',
          description: 'Las ejecuciones aparecen aquí en cuanto el sitio se ha desplegado al menos una vez.',
        })),
  )
})()`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['icon', 'Child', '', 'Glifo decorativo sobre el título; oculto a los lectores de pantalla.'],
        ['title', 'Child', '', 'Qué está vacío, en pocas palabras.'],
        ['description', 'Child', '', 'Por qué está vacío, o qué hacer al respecto.'],
      ]),
      p('Los hijos se dibujan como la fila de acciones bajo la descripción.'),
    ],
  })
