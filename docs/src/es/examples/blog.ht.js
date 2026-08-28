import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, examplesLayout, pageCodeTabs } from '../../lib/es.js'
import { blogSnippets } from '../../lib/snippets/examples-blog.js'

const s = blogSnippets('es')

export default () =>
  examplesLayout({
    title: 'Blog en Markdown',
    description:
      'Una carpeta de archivos markdown → un blog estático con feed RSS, hecho con sitelo y marked.',
    activeHref: '/es/examples/blog',
    children: [
      p(
        'El caso canónico de los sitios estáticos: archivos markdown en una carpeta, una página estática por entrada, un feed RSS y cero JavaScript de cliente. Código completo en ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/blog',
            rel: 'noopener',
          },
          'examples/blog',
        ),
        '.',
      ),
      h2('Qué obtienes'),
      ul(
        { class: 'docs-list' },
        li('Una portada que lista las entradas, de más nueva a más antigua'),
        li(
          code('/blog/[slug]'),
          ' — una página HTML estática por archivo markdown, vía ',
          code('generateStaticParams'),
        ),
        li(
          code('rss.xml'),
          ' — generado por sitelo a partir de la configuración ',
          code('rss'),
        ),
        li(code('sitemap.xml'), ' — se activa al definir ', code('site')),
        li(
          'Cero JS publicado — el markdown se procesa en Node durante la compilación',
        ),
      ),
      h2('Estructura del proyecto'),
      codeBlock('project', s.structure, 'bash'),
      codeBlock('sitelo.config.js', s.config, 'javascript'),
      h2('1. Escribe las entradas en markdown'),
      p(
        'Las entradas viven en ',
        code('content/'),
        ' — fuera de ',
        code('src/'),
        ', así sitelo nunca las trata como páginas ni recursos. El frontmatter son simples líneas ',
        code('clave: valor'),
        ':',
      ),
      codeBlock('content/hello-world.md', s.post, 'markdown'),
      h2('2. Léelas y renderízalas en Node'),
      p(
        'Un pequeño módulo exclusivo de servidor lee la carpeta, analiza el frontmatter y renderiza el markdown con ',
        a({ href: 'https://marked.js.org', rel: 'noopener' }, 'marked'),
        '. Como nada en el HTML referencia este módulo, nunca llega al navegador.',
      ),
      codeBlock('src/lib/posts.js', s.lib, 'javascript'),
      h2('3. Lista las entradas en la portada'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.indexTemplate,
        ht: s.indexHt,
        jsx: s.indexJsx,
      }),
      h2('4. Una página estática por entrada'),
      p(
        code('generateStaticParams'),
        ' devuelve todos los slugs en tiempo de compilación; ',
        code('data()'),
        ' carga la entrada correspondiente a cada página.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: s.slugTemplate,
        ht: s.slugHt,
        jsx: s.slugJsx,
      }),
      h2('5. RSS gratis'),
      p(
        'Con la configuración ',
        code('rss'),
        ' de arriba, ',
        code('sitelo build'),
        ' emite ',
        code('dist/rss.xml'),
        ' con un elemento por cada página bajo ',
        code('/blog'),
        ' — sin código adicional.',
      ),
      p(
        a({ href: '/es/docs/routing' }, 'Documentación de rutas'),
        ' · ',
        a({ href: '/es/docs/data' }, 'Documentación de carga de datos'),
        ' · ',
        a({ href: '/es/docs/configuration' }, 'Documentación de configuración'),
      ),
    ],
  })
