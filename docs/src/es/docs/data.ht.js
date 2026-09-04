import { h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout, pageCodeTabs } from '../../lib/es.js'
import { dataSnippets } from '../../lib/snippets/data.js'

const s = dataSnippets('es')

export default () =>
  docsLayout({
    title: 'Carga de datos',
    description:
      'data() en tiempo de compilación y fetchWithCache para sitios estáticos servidos por una API.',
    activeHref: '/es/docs/data',
    children: [
      p(
        'Exporta una función ',
        code('data()'),
        ' y su resultado aparecerá como ',
        code('ctx.data'),
        ' en tu función de renderizado. Se ejecuta en tiempo de compilación, y en cada petición en el servidor de desarrollo.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: s.dataTemplate,
        ht: s.dataHt,
        jsx: s.dataJsx,
      }),
      h2('fetchWithCache'),
      p(
        '¿Generas muchas páginas contra la misma API? Importa ',
        code('fetchWithCache'),
        ' desde sitelo:',
      ),
      codeBlock('src/blog/[slug].ht.js', s.cache, 'javascript'),
      h3('Opciones'),
      ul(
        { class: 'docs-list' },
        li(
          code('maxAge'),
          ' — TTL de la caché en segundos (por defecto ',
          code('3600'),
          ')',
        ),
        li(
          code('cacheKey'),
          ' — clave propia (por defecto: hash de URL + método + cabeceras + cuerpo)',
        ),
        li(code('forceRefresh'), ' — ignora la caché'),
        li(
          code('cache'),
          ' — ',
          code("'auto'"),
          ' | ',
          code("'memory'"),
          ' | ',
          code("'fs'"),
          ' | ',
          code("'none'"),
        ),
      ),
      h3('Modos de caché'),
      ul(
        { class: 'docs-list' },
        li(
          code('auto'),
          ' (por defecto) — memoria en desarrollo, sistema de archivos en compilaciones de producción',
        ),
        li(
          code('memory'),
          ' — en el propio proceso; se borra al terminar el proceso',
        ),
        li(code('fs'), ' — persistido en ', code('node_modules/.cache/')),
        li(code('none'), ' — siempre hace la petición'),
      ),
      p(
        'Por defecto solo se cachean las peticiones ',
        code('GET'),
        ' (pasa un ',
        code('cacheKey'),
        ' para cachear otros métodos). Las respuestas de error nunca se cachean.',
      ),
      h2('Archivos JSON locales'),
      p(
        '¿Sin API? Guarda el contenido en el repositorio como JSON y léelo con ',
        code('sitelo/data'),
        '.',
      ),
      codeBlock('project', s.jsonTree, 'bash'),
      codeBlock('src/blog/[slug].ht.js', s.jsonCollection, 'javascript'),
      p(
        'Las rutas relativas se resuelven desde la raíz del proyecto, así que ',
        code('data/posts'),
        ' significa lo mismo desde donde sea que ejecutes la CLI. ',
        code('readJson'),
        ' devuelve un archivo ya analizado; ',
        code('readJsonCollection'),
        ' devuelve un array de entradas, cada una con su ',
        code('slug'),
        ' — desde un directorio de archivos ',
        code('.json'),
        ' (uno por entrada, con el slug tomado del nombre del archivo) o desde un único archivo con un array de entradas o un objeto indexado por slug.',
      ),
      codeBlock('src/blog/[slug].ht.js', s.jsonSources, 'javascript'),
      h3('Opciones de la colección'),
      ul(
        { class: 'docs-list' },
        li(
          code('slug'),
          ' — nombre de campo o función; por defecto el nombre del archivo, la clave del objeto, o el ',
          code('slug'),
          ' / ',
          code('id'),
          ' de la propia entrada',
        ),
        li(
          code('sort'),
          ' — nombre de campo (',
          code("'date'"),
          ' ascendente, ',
          code("'-date'"),
          ' descendente) o una función de comparación',
        ),
        li(
          code('recursive'),
          ' — incluye archivos ',
          code('.json'),
          ' de subdirectorios, con su ruta como slug',
        ),
        li(code('root'), ' — directorio desde el que se resuelven las rutas relativas'),
        li(
          code('cache'),
          ' — ',
          code("'auto'"),
          ' | ',
          code("'memory'"),
          ' | ',
          code("'none'"),
        ),
      ),
      p(
        'Las lecturas se memorizan por archivo, así que una compilación de 500 páginas analiza cada archivo una sola vez. El servidor de desarrollo comprueba la mtime en su lugar y recarga el navegador cuando cambia un archivo JSON que alguna página leyó. Los slugs duplicados, los archivos que faltan y el JSON mal formado hacen fallar la compilación, cada uno con su ruta.',
      ),
    ],
  })
