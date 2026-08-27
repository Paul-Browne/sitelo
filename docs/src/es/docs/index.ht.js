import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout, pageCodeTabs } from '../../lib/es.js'
import { gettingStartedSnippets } from '../../lib/snippets/getting-started.js'

const s = gettingStartedSnippets('es')

export default () =>
  docsLayout({
    title: 'Primeros pasos',
    description: 'Instala sitelo y crea tu primer sitio estático.',
    activeHref: '/es/docs',
    children: [
      p(
        'sitelo es un generador de sitios estáticos sin configuración, basado en Vite. Instala un solo paquete, escribe funciones que devuelven HTML y ejecuta ',
        code('sitelo build'),
        '.',
      ),
      h2('Instalación'),
      codeBlock('shell', s.install, 'bash'),
      p(
        'Requiere Node 20.19+ (o 22.12+). Vite viene incluido — no hace falta instalarlo aparte.',
      ),
      h2('Tu primera página'),
      p(
        'Crea ',
        code('src/index.ht.js'),
        ' (o ',
        code('.ht.jsx'),
        '). Recomendamos ',
        a({ href: 'https://ht.js.org', rel: 'noopener' }, 'ht.js'),
        ':',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      h2('Ejecución'),
      codeBlock('shell', s.run, 'bash'),
      p(
        'Eso genera ',
        code('dist/index.html'),
        ' (con ',
        code('<!DOCTYPE html>'),
        ' añadido automáticamente) y un ',
        code('404.html'),
        ' por defecto.',
      ),
      h2('Siguientes pasos'),
      ul(
        { class: 'docs-list' },
        li(
          a({ href: '/es/docs/pages' }, 'Escribir páginas'),
          ' — plantillas de cadena, JSX y módulos estructurados',
        ),
        li(
          a({ href: '/es/docs/routing' }, 'Rutas'),
          ' — rutas basadas en archivos y ',
          code('generateStaticParams'),
        ),
        li(
          a({ href: '/es/docs/data' }, 'Carga de datos'),
          ' — ',
          code('data()'),
          ' y ',
          code('fetchWithCache'),
        ),
        li(
          a({ href: '/es/docs/assets' }, 'Recursos y estilos'),
          ' — JS/CSS de frontend compilados por Vite (',
          code('src/js'),
          ', ',
          code('src/css'),
          ')',
        ),
        li(
          a({ href: '/es/docs/configuration' }, 'Configuración'),
          ' — ',
          code('sitelo.config.js'),
          ' y opciones de Vite',
        ),
        li(
          a({ href: '/es/docs/build-with-ai' }, 'Crear con IA'),
          ' — ',
          code('llms.txt'),
          ', reglas de proyecto y consejos para agentes',
        ),
      ),
    ],
  })
