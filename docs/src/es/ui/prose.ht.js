import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/es.js'

export default () =>
  uiLayout({
    title: 'Prosa',
    description:
      'Da estilo a un bloque de HTML que no escribiste tú: salida de Markdown, un campo de un CMS, la descripción de un RSS.',
    activeHref: '/es/ui/prose',
    children: [
      p(
        'Un renderizador de Markdown devuelve etiquetas peladas: ',
        code('<h2>'),
        ', ',
        code('<p>'),
        ', ',
        code('<ul>'),
        ', ',
        code('<blockquote>'),
        ' — sin clases a las que agarrarse. ',
        code('prose()'),
        ' envuelve ese HTML y lo estiliza.',
      ),
      p(
        'Es la única excepción deliberada de esta biblioteca. En todo lo demás el estilo está acotado a clases ',
        code('su-'),
        ' precisamente para no tocar nunca marcado al que no te hayas apuntado; aquí no hay clases a las que apuntar, así que las reglas aplican a etiquetas peladas, pero solo dentro del envoltorio.',
      ),

      h2('Prosa básica'),
      demo(`prose(
  '<h2>Primeros pasos</h2>' +
  '<p>Escribe una función que devuelva HTML. Ejecuta <code>sitelo build</code>. Publica <code>dist/</code>.</p>' +
  '<ul><li>Rutas basadas en archivos</li><li>Datos en la compilación</li><li>Sin runtime en el cliente</li></ul>'
)`, { align: 'stretch' }),

      h2('Todo lo que estiliza'),
      demo(`prose(
  '<h3>Un encabezado</h3>' +
  '<p>Texto de cuerpo con <a href="/es/docs">un enlace</a>, <strong>negrita</strong> y <code>código en línea</code>.</p>' +
  '<blockquote><p>Una cita destacada, apartada del texto que la rodea.</p></blockquote>' +
  '<ol><li>Primero</li><li>Segundo<ul><li>Anidado</li></ul></li></ol>' +
  '<pre><code>export default () => "&lt;h1&gt;Hola&lt;/h1&gt;"</code></pre>' +
  '<table><thead><tr><th>Opción</th><th>Por defecto</th></tr></thead>' +
  '<tbody><tr><td>cleanUrls</td><td>true</td></tr><tr><td>outDir</td><td>dist</td></tr></tbody></table>' +
  '<hr>' +
  '<p>Pulsa <kbd>⌘</kbd> <kbd>K</kbd> para buscar.</p>'
)`, { align: 'stretch' }),

      h2('Tamaños'),
      demo(`stack({ gap: 'lg' },
  prose({ size: 'sm' }, '<p><strong>Pequeño</strong> — para el resumen de una tarjeta o una barra lateral.</p>'),
  prose('<p><strong>Mediano</strong> — el valor por defecto, para el cuerpo de un artículo.</p>'),
  prose({ size: 'lg' }, '<p><strong>Grande</strong> — para una introducción corta y destacada.</p>'),
)`, { align: 'stretch' }),

      h2('Con un blog en Markdown'),
      p(
        'La forma que quiere el ejemplo del blog: renderiza el Markdown en la compilación, envuelve el resultado y publícalo.',
      ),
      codeBlock('src/blog/[slug].ht.js', `import { marked } from 'marked'
import { article, body, h1, html, head, title } from 'javascript-to-html'
import { container, prose, styles, text } from 'sitelo/ui'

export async function data({ params }) {
  return { post: await loadPost(params.slug) }
}

export default ({ data }) => html({ lang: 'es' },
  head(title(data.post.title), styles()),
  body(
    container({ size: 'sm' },
      h1(data.post.title),
      text({ variant: 'caption' }, data.post.date),
      // marked devuelve una cadena de HTML sin ninguna clase
      prose(marked.parse(data.post.markdown)),
    ),
  ),
)`, 'javascript'),

      h2('Componentes dentro de la prosa'),
      p(
        'Todas las reglas de prosa excluyen los elementos que llevan una clase ',
        code('su-'),
        ', así que un componente soltado en un bloque de prosa conserva su propio estilo en vez de heredar los márgenes de un artículo.',
      ),
      demo(`prose(
  '<p>Un poco de Markdown renderizado, y después un componente:</p>',
  alert({ color: 'warning', title: 'Sigue siendo una alerta normal' },
    'El bloque de prosa que la rodea no le cambia el estilo.'),
  '<p>Y de vuelta a la prosa.</p>',
)`, { align: 'stretch' }),

      h2('Una palabra sobre la confianza'),
      p(
        code('prose()'),
        ' dibuja sus hijos como HTML — de eso se trata, y así funciona ',
        code('javascript-to-html'),
        ' en todas partes. Si el HTML viene de un sitio que no controlas, sanéalo antes de que llegue aquí. Un renderizador de Markdown con el HTML crudo desactivado suele bastar.',
      ),

      h2('Props'),
      propsTable([
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Tamaño de letra base; todo lo demás escala en em a partir de él.'],
        ['as', 'string', "'div'", 'Elemento que se renderiza, por ejemplo article.'],
      ]),
    ],
  })
