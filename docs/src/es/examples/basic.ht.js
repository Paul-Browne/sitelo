import { a, h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, examplesLayout, pageCodeTabs } from '../../lib/es.js'
import { basicSnippets } from '../../lib/snippets/examples-basic.js'

const s = basicSnippets('es')

export default () =>
  examplesLayout({
    title: 'Sitio básico',
    description:
      'Un proyecto sitelo mínimo y configuraciones de despliegue estático para Netlify, Vercel, Cloudflare Pages y AWS Amplify.',
    activeHref: '/es/examples/basic',
    children: [
      p(
        'El sitio sitelo útil más pequeño: una página, una hoja de estilos y configuraciones de hosting que publican ',
        code('dist/'),
        '. Copia las configuraciones a cualquier proyecto sitelo — solo asumen ',
        code('npm run build'),
        ' → ',
        code('dist/'),
        '.',
      ),
      p(
        'Hay una copia ejecutable en el repositorio de sitelo, en ',
        code('examples/basic/'),
        '.',
      ),
      h2('Qué obtienes'),
      ul(
        { class: 'docs-list' },
        li('Un sitio estático de una página construido con sitelo'),
        li(
          code('netlify.toml'),
          ', ',
          code('vercel.json'),
          ', ',
          code('wrangler.toml'),
          ' y ',
          code('amplify.yml'),
        ),
        li('Despliegue en un clic o conectando el repositorio desde la carpeta del ejemplo'),
      ),
      h2('Estructura del proyecto'),
      codeBlock('project', s.structure, 'bash'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      h2('Compilación'),
      codeBlock('shell', s.build, 'bash'),
      h2('Despliegue'),
      p(
        'Desde el monorepo de sitelo, pon el directorio raíz o base de la plataforma en ',
        code('examples/basic'),
        '.',
      ),
      h3('Netlify'),
      codeBlock('netlify.toml', s.netlifyToml, 'toml'),
      h3('Vercel'),
      codeBlock('vercel.json', s.vercelJson, 'json'),
      p(
        a(
          {
            href: 'https://vercel.com/new/clone?repository-url=https://github.com/paul-browne/sitelo&root-directory=examples/basic&project-name=sitelo-basic',
            rel: 'noopener',
          },
          'Desplegar en Vercel',
        ),
        ' · ',
        a(
          {
            href: 'https://app.netlify.com/start/deploy?repository=https://github.com/paul-browne/sitelo',
            rel: 'noopener',
          },
          'Desplegar en Netlify',
        ),
        ' (pon el directorio base en ',
        code('examples/basic'),
        ' cuando te lo pida).',
      ),
      h3('Cloudflare Pages'),
      p(
        'Panel: comando de compilación ',
        code('npm run build'),
        ', directorio de salida ',
        code('dist'),
        '. O bien ',
        code('npx wrangler pages deploy dist'),
        ' tras una compilación local.',
      ),
      codeBlock('wrangler.toml', s.wranglerToml, 'toml'),
      h3('AWS Amplify'),
      p(
        'Conecta el repositorio en Amplify Hosting. Para S3 + CloudFront a secas, compila en local y sincroniza ',
        code('dist/'),
        ' con el bucket.',
      ),
      codeBlock('amplify.yml', s.amplifyYml, 'yaml'),
      p(
        '¿Trabajas con Cursor, Copilot u otro agente? Copia el ',
        code('AGENTS.md'),
        ' de este ejemplo (o consulta ',
        a({ href: '/es/docs/build-with-ai' }, 'Crear con IA'),
        ') para que las herramientas no se inventen patrones de React o Next.',
      ),
      p(
        a({ href: '/es/docs' }, 'Primeros pasos'),
        ' · ',
        a({ href: '/es/docs/build-with-ai' }, 'Crear con IA'),
        ' · ',
        a({ href: '/es/examples/todo' }, 'App de tareas'),
        ' · ',
        a({ href: '/es/examples/islands' }, 'Ejemplo de islas de servidor'),
      ),
    ],
  })
