import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout, pageCodeTabs } from '../../lib/es.js'
import { assetsSnippets } from '../../lib/snippets/assets.js'

const s = assetsSnippets('es')

export default () =>
  docsLayout({
    title: 'Recursos y estilos',
    description:
      'Cómo compila sitelo el JavaScript y el CSS de frontend con Vite, y cómo mantiene el código de servidor fuera del navegador.',
    activeHref: '/es/docs/assets',
    children: [
      p(
        'sitelo está construido sobre Vite, así que el JavaScript y el CSS de frontend se compilan automáticamente. Pon scripts y estilos dentro de ',
        code('src/'),
        ' (por ejemplo ',
        code('src/js'),
        ' y ',
        code('src/css'),
        '), enlázalos desde tu HTML con URLs relativas a la raíz, y sitelo se encarga del resto: TypeScript, imports de CSS, empaquetado y minificación.',
      ),
      h2('Estructura del proyecto'),
      p(
        'Las páginas y los recursos comparten ',
        code('src/'),
        '. Carpetas como ',
        code('js/'),
        ' y ',
        code('css/'),
        ' son convenciones, no requisitos: a sitelo le importa lo que referencia tu HTML, no los nombres de las carpetas.',
      ),
      codeBlock('project', s.layout, 'bash'),
      h2('Enlaza recursos desde el HTML'),
      p(
        'Referencia los archivos con rutas relativas a la raíz. Un ',
        code('<script type="module">'),
        ' o un ',
        code('<link rel="stylesheet">'),
        ' es lo que le dice a sitelo que incluya ese archivo en la compilación:',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      codeBlock('src/js/main.js', s.js, 'javascript'),
      codeBlock('src/css/styles.css', s.css, 'css'),
      h2('Qué compila Vite'),
      ul(
        { class: 'docs-list' },
        li(
          code('.js'),
          ' / ',
          code('.ts'),
          ' / ',
          code('.jsx'),
          ' / ',
          code('.tsx'),
          ' — empaquetados como módulos ES, con TypeScript eliminado y los imports incorporados',
        ),
        li(
          code('.css'),
          ' — procesado y minificado; se resuelven los ',
          code('@import'),
          ' y las referencias ',
          code('url()'),
          ' relativas',
        ),
        li(
          'Todo lo que se importe desde una entrada referenciada (como el ',
          code('counter.ts'),
          ' de arriba) entra en el mismo bundle',
        ),
        li(
          'En ',
          code('sitelo'),
          ' (dev), esas mismas URLs pasan por el pipeline de transformación de Vite — no hace falta compilar aparte para probar TypeScript o CSS',
        ),
      ),
      p(
        '¿Necesitas PostCSS, Sass u otros plugins de Vite? Añádelos bajo ',
        code('vite'),
        ' en ',
        a({ href: '/es/docs/configuration' }, 'sitelo.config.js'),
        '.',
      ),
      h2('Cero JS por defecto'),
      ul(
        { class: 'docs-list' },
        li(
          'El código sin referenciar no se emite. Un ayudante que solo se importa desde ',
          code('data()'),
          ' o ',
          code('generateStaticParams'),
          ' se queda fuera de ',
          code('dist/'),
          ' — los secretos de servidor nunca se publican por accidente.',
        ),
        li(
          'Si la página no tiene ningún ',
          code('<script>'),
          ', la compilación no lleva JavaScript de cliente. Para la mayoría de sitios, HTML y CSS estáticos son suficiente.',
        ),
        li(
          code('public/'),
          ' se copia tal cual (favicons, robots.txt, imágenes estáticas a las que no quieras poner hash).',
        ),
        li(
          'El resto de archivos referenciados (imágenes, tipografías, vídeos, …) se copian a ',
          code('dist/'),
          '.',
        ),
      ),
      h2('Validación de recursos que faltan'),
      p(
        'Un ',
        code('<script src>'),
        ' o un ',
        code('href'),
        ' de hoja de estilos que apunte a un archivo que no existe ni en ',
        code('src/'),
        ' ni en ',
        code('public/'),
        ' hace fallar la compilación. ¿Prefieres un aviso?',
      ),
      codeBlock('sitelo.config.js', s.warn, 'javascript'),
    ],
  })
