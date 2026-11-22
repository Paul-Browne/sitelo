import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout, pageCodeTabs } from '../../lib/es.js'
import { enhanceSnippets } from '../../lib/snippets/enhance.js'

const s = enhanceSnippets('es')

export default () =>
  docsLayout({
    title: 'Mejoras',
    description:
      'Entrega el marcado renderizado en el servidor a un pequeño módulo del navegador, que solo se carga en las páginas que lo usan.',
    activeHref: '/es/docs/enhance',
    children: [
      p(
        'Hay interactividad que tiene que ejecutarse en el navegador: un contador, un botón de copiar, un formulario que se valida mientras escribes. ',
        code('enhance()'),
        ' marca el marcado del que debe encargarse un módulo. El servidor renderiza el HTML como siempre, así que funciona antes de que llegue el JavaScript, y el navegador carga el módulo solo en las páginas que lo usan. El módulo añade comportamiento al DOM que encuentra. No hay hidratación ni runtime de framework.',
      ),
      p(
        'Una ',
        a({ href: '/es/docs/islands' }, 'isla de servidor'),
        ' renderiza una región en un servidor cuando se visita la página. Una mejora ejecuta código para una región en el navegador. Las dos reciben los mismos argumentos y funcionan juntas.',
      ),
      h2('Escribir el módulo'),
      p(
        'Una mejora es un módulo normal, en cualquier lugar bajo ',
        code('src/'),
        '. Su export por defecto recibe el elemento y las props. Lee lo que necesites del marcado, que el servidor ya renderizó:',
      ),
      codeBlock('src/client/counter.js', s.counterModule, 'javascript'),
      p(
        'TypeScript también funciona. Tipa la función con ',
        code('Enhancer<Props>'),
        ' de ',
        code('sitelo/enhance/client'),
        '.',
      ),
      h2('Colocarlo en una página'),
      p(
        'Importa ',
        code('enhance()'),
        ' desde ',
        code('sitelo/enhance'),
        '. Recibe los mismos argumentos que ',
        code('island()'),
        ': un nombre, props, el HTML y opciones. El HTML va dentro de un ',
        code('<div>'),
        ' que recibe el módulo.',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      p(
        'JSX escapa la cadena que devuelve una función, así que la pestaña JSX esparce ',
        code('enhanceAttributes()'),
        ' sobre el elemento. Más sobre eso abajo.',
      ),
      h2('Registrar los módulos'),
      p(
        'El script que enlaza la página pasa a ',
        code('mountEnhancements()'),
        ' un mapa de nombres a módulos:',
      ),
      codeBlock('src/enhance.js', s.registry, 'javascript'),
      p(
        'El mapa se escribe a mano, a propósito. Cada ',
        code('import()'),
        ' es un import dinámico normal, así que el build da a cada módulo su propio chunk y una página descarga solo los que nombran sus elementos. En desarrollo, Vite los sirve tal cual. Como es código normal, TypeScript lo comprueba y knip lo sigue.',
      ),
      p(
        'Pasa ',
        code('when'),
        ' para decidir cuándo se importa un módulo. Acepta los mismos valores que una isla:',
      ),
      codeBlock('enhance-when', s.strategy, 'js'),
      ul(
        { class: 'docs-list' },
        li(code("'load'"), ' (por defecto) — en cuanto carga la página'),
        li(code("'idle'"), ' — con ', code('requestIdleCallback'), ' (recurre a un timeout)'),
        li(
          code("'visible'"),
          ' — cuando el elemento entra en pantalla, mediante IntersectionObserver. ',
          code('rootMargin'),
          ' lo adelanta y por defecto vale ',
          code("'200px'"),
        ),
      ),
      h2('Tu propio elemento'),
      p(
        code('enhance()'),
        ' pone un ',
        code('<div>'),
        ' alrededor del marcado. Cuando el elemento en sí importa, como un ',
        code('<form>'),
        ' con su propio ',
        code('action'),
        ', pon los atributos en él con ',
        code('enhanceAttributes(name, props, options)'),
        '. Es un objeto de atributos, así que javascript-to-html y JSX lo aceptan como atributos, y dentro de un template literal se convierte en el texto de los atributos:',
      ),
      pageCodeTabs({
        file: 'src/search.ht.js',
        template: s.formTemplate,
        ht: s.formHt,
        jsx: s.formJsx,
      }),
      p('El módulo recibe el propio formulario:'),
      codeBlock('src/client/search.js', s.searchModule, 'javascript'),
      h2('Qué pasar como props'),
      p(
        'Las props son JSON escrito en la página que el módulo recibe como segundo argumento. Cada elemento de la página lleva su propia copia, así que pasa solo lo que el marcado no dice ya: un ajuste sin lugar natural en el HTML, como ',
        code('minLength'),
        ' arriba. Un valor que la página muestra, como el número inicial del contador, es mejor leerlo del DOM, para que los dos no puedan discrepar. Los datos grandes van en el propio HTML, o en un archivo que el módulo descarga.',
      ),
      p(
        'A diferencia de las props de una isla, estas nunca vuelven a un servidor, así que no hay nada que firmar. Aun así están en el código fuente de la página, así que no pongas secretos en ellas.',
      ),
      h2('Comprobado al hacer el build'),
      p(
        'El build lee el mapa de tus llamadas a ',
        code('mountEnhancements()'),
        ' y falla si una página nombra una mejora que el mapa no tiene:',
      ),
      codeBlock('sitelo build', s.buildError, 'text'),
      p(
        code("missingAssets: 'warn'"),
        ' lo convierte en un aviso, igual que con un script que falta, y ',
        code('sitelo'),
        ' (dev) avisa al renderizar cada página. El build tiene que poder leer el mapa, así que escríbelo como un objeto literal en la llamada, o como una ',
        code('const'),
        ' en el mismo archivo. Un mapa montado en tiempo de ejecución, con un spread o importado de otro módulo, no se puede leer, y entonces no se comprueba nada. Las mejoras dentro de islas de servidor se renderizan en el momento de la petición, así que el build tampoco las ve.',
      ),
      h2('Estado y errores'),
      p(
        'El ',
        code('data-sitelo-enhance-state'),
        ' de cada elemento pasa por ',
        code('pending'),
        ' (esperando su momento), ',
        code('loading'),
        ' y ',
        code('ready'),
        '. Si el módulo no carga o lanza un error, el estado es ',
        code('error'),
        ', el marcado del servidor queda como estaba y el error va a ',
        code('mountEnhancements(modules, { onError })'),
        ', o a la consola. Usa el estado en CSS cuando la página deba cambiar una vez cargado el módulo:',
      ),
      codeBlock('styles.css', s.stateCss, 'css'),
      h2('Conviene saber'),
      ul(
        { class: 'docs-list' },
        li(
          'La misma mejora puede aparecer en una página tantas veces como quieras. El módulo se descarga una vez y se ejecuta una vez por elemento, así que guarda el estado de cada elemento dentro de la función y busca con ',
          code('element.querySelector()'),
          ' en lugar de en todo el documento.',
        ),
        li(
          'Una mejora dentro de una isla de servidor se monta cuando llega el HTML de la isla: el cargador de islas emite ',
          code('sitelo:island-load'),
          ' y ',
          code('mountEnhancements()'),
          ' lo escucha. Carga ambos cargadores desde el mismo script.',
        ),
        li(
          code('mountEnhancements()'),
          ' nunca ejecuta un módulo dos veces sobre el mismo elemento, así que puedes volver a llamarlo tras añadir marcado tú mismo.',
        ),
        li(
          '¿Quieres un framework en una sola caja? Móntalo desde el módulo, por ejemplo con ',
          code('createRoot(element).render(<Chart {...props} />)'),
          '. Solo las páginas con esa caja lo descargan.',
        ),
      ),
    ],
  })
