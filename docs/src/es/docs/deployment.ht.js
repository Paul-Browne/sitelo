import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout } from '../../lib/es.js'
import { deploymentSnippets } from '../../lib/snippets/deployment.js'

const s = deploymentSnippets('es')

export default () =>
  docsLayout({
    title: 'Despliegue',
    description:
      'Despliega un sitio sitelo en Netlify, Vercel, Cloudflare Pages, AWS Amplify, GitHub Pages o cualquier hosting estático.',
    activeHref: '/es/docs/deployment',
    children: [
      p(
        'Una compilación de sitelo son archivos estáticos y ya: ',
        code('sitelo build'),
        ' escribe HTML, CSS y JS en ',
        code('dist/'),
        '. Sirve cualquier hosting estático — las configuraciones de abajo solo asumen ',
        code('npm run build'),
        ' → ',
        code('dist/'),
        '.',
      ),
      p(
        'Las URLs limpias son directorios con ',
        code('index.html'),
        ' (',
        code('/about/index.html'),
        ' → ',
        code('/about'),
        '), así que las URLs bonitas funcionan de entrada, sin reglas de redirección. El ',
        code('404.html'),
        ' se emite automáticamente: es la convención que entienden Netlify, Cloudflare Pages y GitHub Pages.',
      ),
      p(
        'Hay versiones listas para copiar de todo esto en el ',
        a({ href: '/examples/basic' }, 'ejemplo básico'),
        ' (',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/basic',
            rel: 'noopener',
          },
          'examples/basic',
        ),
        ' en el repositorio; los ejemplos están en inglés).',
      ),
      h2('Netlify'),
      codeBlock('netlify.toml', s.netlify, 'bash'),
      h2('Vercel'),
      codeBlock('vercel.json', s.vercel, 'javascript'),
      h2('Cloudflare Pages'),
      p(
        'Compilaciones desde el panel: pon como comando de compilación ',
        code('npm run build'),
        ' y como directorio de salida ',
        code('dist'),
        '. O despliega desde la CLI con ',
        code('npx wrangler pages deploy dist'),
        '.',
      ),
      codeBlock('wrangler.toml', s.wrangler, 'bash'),
      h2('AWS Amplify'),
      codeBlock('amplify.yml', s.amplify, 'bash'),
      p(
        'Para S3 + CloudFront a secas: ',
        code('npm run build'),
        ' y luego sincroniza ',
        code('dist/'),
        ' con el bucket.',
      ),
      h2('GitHub Pages'),
      codeBlock('.github/workflows/deploy.yml', s.ghPages, 'bash'),
      p(
        '¿Despliegas bajo una subruta (',
        code('user.github.io/repo'),
        ')? Compila con ',
        code('--base /repo/'),
        '.',
      ),
      h2('Antes de publicar'),
      ul(
        { class: 'docs-list' },
        li(
          'Define ',
          code('site'),
          ' en ',
          code('sitelo.config.js'),
          ' para que se genere el ',
          code('sitemap.xml'),
          ' — consulta ',
          a({ href: '/es/docs/configuration' }, 'Configuración'),
        ),
        li(
          'Añade un ',
          code('src/404.ht.js'),
          ' para tener una página de «no encontrado» con tu identidad (si no, se emite una por defecto)',
        ),
        li(
          code('sitelo preview'),
          ' sirve la compilación de producción en local para una última revisión',
        ),
      ),
    ],
  })
