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
    ],
  })
