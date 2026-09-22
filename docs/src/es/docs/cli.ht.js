import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout } from '../../lib/es.js'
import { cliSnippets } from '../../lib/snippets/cli.js'

const s = cliSnippets('es')

export default () =>
  docsLayout({
    title: 'CLI',
    description: 'sitelo dev, build, preview y las opciones más habituales.',
    activeHref: '/es/docs/cli',
    children: [
      p(
        'La CLI de ',
        code('sitelo'),
        ' envuelve el Vite incluido e inyecta automáticamente el plugin de páginas HTML.',
      ),
      h2('Comandos'),
      codeBlock('shell', s.commands, 'bash'),
      ul(
        { class: 'docs-list' },
        li(
          code('dev'),
          ' — renderizado SSR real bajo demanda, incluidas las rutas dinámicas, más una pequeña barra de herramientas de desarrollo',
        ),
        li(
          code('build'),
          ' — HTML estático en ',
          code('dist/'),
          ' (o el ',
          code('outDir'),
          ' que indiques)',
        ),
        li(code('preview'), ' — sirve la compilación de producción en local'),
        li(
          code('lighthouse'),
          ' — audita la compilación de producción (requiere la dependencia par ',
          code('lighthouse'),
          ')',
        ),
      ),
      p(
        'Desactiva la barra con ',
        code('devToolbar: false'),
        ' en ',
        code('sitelo.config.js'),
        ' — consulta ',
        a({ href: '/es/docs/configuration' }, 'Configuración'),
        '.',
      ),
      h2('Opciones útiles'),
      codeBlock('shell', s.flags, 'bash'),
      ul(
        { class: 'docs-list' },
        li(
          code('--port'),
          ' / ',
          code('--host'),
          ' / ',
          code('--open'),
          ' — servidor',
        ),
        li(
          code('--outDir'),
          ' / ',
          code('--emptyOutDir'),
          ' / ',
          code('--base'),
          ' — compilación',
        ),
        li(
          code('--root'),
          ' — raíz del proyecto (práctico para un sitio en ',
          code('docs/'),
          ')',
        ),
        li(code('--config'), ' — archivo de configuración de Vite personalizado'),
        li(code('--mode'), ' / ', code('--logLevel'), ' / ', code('--debug')),
      ),
      p(
        'Para todo lo que reutilices entre comandos, es mejor poner las opciones de Vite en ',
        code('sitelo.config.js'),
        ' bajo ',
        code('vite'),
        '.',
      ),
      h2('Encontrar código sin usar'),
      p(
        a({ href: 'https://knip.dev' }, 'knip'),
        ' encuentra archivos, exports y dependencias que nada utiliza. En un proyecto sitelo necesita una pista: las páginas y las islas se descubren en el sistema de archivos, así que nada las importa, y sin esa pista knip informa de todo el sitio como archivos sin usar.',
      ),
      codeBlock('shell', s.knipInstall, 'bash'),
      codeBlock('knip.js', s.knip, 'javascript'),
      codeBlock('shell', s.knipRun, 'bash'),
      p(
        code('knipConfig()'),
        ' lee tu ',
        code('sitelo.config.js'),
        ' y marca las páginas y las islas como puntos de entrada tal como el build las descubre — ',
        code('pagesDir'),
        ', ',
        code('pageExtensions'),
        ', ',
        code('include'),
        ' y ',
        code('exclude'),
        ' se aplican todos. Lo que queda en el informe es código al que el sitio realmente nunca llega.',
      ),
      p(
        'Hay una cosa que no puede ver: un script de cliente que una página referencia por URL en lugar de importarlo, como ',
        code('<script src="/js/app.js">'),
        '. Esos los indicas tú, y cualquier otra opción que knip acepte la pasas al lado — se incorpora al resultado. El ',
        code('!'),
        ' final es la marca de knip para código de producción, que es justo lo que es un script enviado al navegador.',
      ),
      codeBlock('knip.js', s.knipEntry, 'javascript'),
    ],
  })
