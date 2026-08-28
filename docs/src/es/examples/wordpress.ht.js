import { a, h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, examplesLayout, pageCodeTabs } from '../../lib/es.js'
import { wordpressSnippets } from '../../lib/snippets/examples-wordpress.js'

const s = wordpressSnippets('es')

export default () =>
  examplesLayout({
    title: 'WordPress',
    description:
      'Descarga un sitio WordPress entero por la API REST — miles de entradas, generadas estáticamente con sitelo.',
    activeHref: '/es/examples/wordpress',
    children: [
      p(
        'Trata WordPress como un CMS headless y ',
        'descarga el sitio entero',
        ': pagina por ',
        code('/wp-json/wp/v2/posts'),
        ', genera un archivo HTML por slug y cachea las respuestas de la API entre compilaciones.',
      ),
      h2('Qué obtienes'),
      ul(
        { class: 'docs-list' },
        li('Una portada que lista las entradas recientes'),
        li(code('/blog'), ' — archivo completo de todas las entradas'),
        li(
          code('/blog/[slug]'),
          ' — una página HTML estática por entrada (funciona con miles de entradas)',
        ),
        li(
          code('fetchWithCache'),
          ', para que las recompilaciones reutilicen las respuestas de WP en vez de volver a descargarlo todo',
        ),
      ),
      h2('Estructura del proyecto'),
      codeBlock('project', s.structure, 'bash'),
      codeBlock('sitelo.config.js', s.config, 'javascript'),
      h2('1. Apunta a tu sitio WordPress'),
      p(
        'La API REST viene activada por defecto en las versiones modernas de WordPress. Compruébalo en ',
        code('https://tu-sitio.com/wp-json/wp/v2/posts'),
        '.',
      ),
      p(
        'Define ',
        code('WP_URL'),
        ' en el entorno (o escríbelo directamente mientras experimentas):',
      ),
      codeBlock('.env', s.env, 'bash'),
      h2('2. Ayudantes compartidos de WordPress'),
      p(
        code('getAllPosts()'),
        ' lee ',
        code('X-WP-TotalPages'),
        ' y recorre todas las páginas (WordPress limita ',
        code('per_page'),
        ' a 100). Omite ',
        code('_embed'),
        ' mientras recoges slugs — pide los embeds solo para cada entrada concreta.',
      ),
      codeBlock('src/lib/wordpress.js', s.wpLib, 'javascript'),
      h2('3. Portada'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.homeTemplate,
        ht: s.homeHt,
        jsx: s.homeJsx,
      }),
      h2('4. Índice del blog'),
      p(
        'Usa ',
        code('getAllPosts()'),
        ' para que el archivo no se quede limitado a 50–100 elementos.',
      ),
      pageCodeTabs({
        file: 'src/blog/index.ht.js',
        template: s.blogIndexTemplate,
        ht: s.blogIndexHt,
        jsx: s.blogIndexJsx,
      }),
      h2('5. Convierte todas las entradas en páginas estáticas'),
      p(
        code('generateStaticParams'),
        ' debe devolver ',
        'todos',
        ' los slugs que quieras en ',
        code('dist/'),
        '. Pagina la API aquí — no llames a ',
        code('getPosts({ perPage: 100 })'),
        ' una sola vez y te quedes ahí.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: s.blogPostTemplate,
        ht: s.blogPostHt,
        jsx: s.blogPostJsx,
      }),
      h2('6. Compilar'),
      codeBlock('shell', s.build, 'bash'),
      p(
        'La primera compilación pasa una vez por WordPress y llena la caché de fetch. Las siguientes reutilizan las respuestas cacheadas de listado y detalle (',
        code("cache: 'auto'"),
        ' → sistema de archivos en producción) hasta que expire ',
        code('maxAge'),
        '. Sube ',
        code('renderConcurrency'),
        ' en ',
        code('sitelo.config.js'),
        ' si vas a renderizar miles de páginas de entradas.',
      ),
      h2('Notas'),
      h3('HTML procedente de WordPress'),
      p(
        code('title.rendered'),
        ' y ',
        code('content.rendered'),
        ' son cadenas HTML que vienen de WP. Colócalas en tu plantilla tal cual (como arriba), o sanitízalas si no te fías del todo del CMS.',
      ),
      h3('Contenido privado'),
      p(
        'Las rutas REST públicas solo exponen entradas publicadas. Para borradores o autenticación propia, pasa cabeceras en el segundo argumento de ',
        code('fetchWithCache'),
        ' (el init estándar de ',
        code('fetch'),
        ') y usa un ',
        code('cacheKey'),
        ' estable.',
      ),
      p(
        a({ href: '/es/docs/data' }, 'Documentación de carga de datos'),
        ' · ',
        a({ href: '/es/docs/routing' }, 'Documentación de rutas'),
      ),
    ],
  })
