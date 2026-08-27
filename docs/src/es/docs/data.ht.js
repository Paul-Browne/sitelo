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
    ],
  })
