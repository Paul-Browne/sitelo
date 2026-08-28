import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, examplesLayout, pageCodeTabs } from '../../lib/es.js'
import { todoSnippets } from '../../lib/snippets/examples-todo.js'

const s = todoSnippets('es')

export default () =>
  examplesLayout({
    title: 'App de tareas',
    description:
      'HTML estático con imports dinámicos en línea — los manejadores cargan /js/todo.js bajo demanda.',
    activeHref: '/es/examples/todo',
    children: [
      p(
        'Una interfaz interactiva clásica sin framework de frontend. sitelo construye la estructura de la página; los atributos de evento llaman a ',
        code("import('/js/todo.js').then(…)"),
        ', así que el módulo se carga solo cuando hace falta. Código completo en ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/todo',
            rel: 'noopener',
          },
          'examples/todo',
        ),
        '.',
      ),
      h2('Qué obtienes'),
      ul(
        { class: 'docs-list' },
        li(
          'HTML estático con manejadores ',
          code('onsubmit'),
          ' / ',
          code('onload'),
          ' (y también en los elementos de la lista)',
        ),
        li(
          code('src/js/todo.js'),
          ' — exporta ',
          code('hydrate'),
          ', ',
          code('handleSubmit'),
          ', ',
          code('handleChange'),
          ' y ',
          code('handleRemove'),
        ),
        li(
          'sitelo detecta los ',
          code("import('/…')"),
          ' literales del HTML y empaqueta el archivo en ',
          code('dist/'),
          ' (ver ',
          a({ href: '/es/docs/assets' }, 'Recursos'),
          ')',
        ),
      ),
      h2('Estructura del proyecto'),
      codeBlock('project', s.structure, 'bash'),
      h2('1. Imports en línea en la página'),
      p(
        'Sin ',
        code('<script type="module" src>'),
        '. Los manejadores son atributos HTML que importan el módulo dinámicamente y llaman a un export, pasando ',
        code('this'),
        ' (el elemento). Así los módulos de página se mantienen libres de APIs del navegador (ver ',
        a({ href: '/es/docs/pages#limitaciones-de-jsx' }, 'limitaciones de JSX'),
        ').',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      h2('2. Manejadores exportados'),
      p(
        'El módulo es un archivo ES normal dentro de ',
        code('src/js/'),
        '. Los elementos de lista creados en tiempo de ejecución usan el mismo patrón ',
        code("import('/js/todo.js').then(…)"),
        ' para ',
        code('onchange'),
        ' y ',
        code('onclick'),
        '.',
      ),
      codeBlock('src/js/todo.js', s.todoJs, 'javascript'),
      h2('3. Ejecutar'),
      codeBlock('shell', s.run, 'bash'),
      p(
        'O bien ',
        code('npm run build'),
        ' y aloja ',
        code('dist/'),
        ' en cualquier sitio que sirva archivos estáticos.',
      ),
      p(
        a({ href: '/es/docs/assets' }, 'Recursos y estilos'),
        ' · ',
        a({ href: '/es/docs/pages#limitaciones-de-jsx' }, 'Limitaciones de JSX'),
        ' · ',
        a({ href: '/es/examples/basic' }, 'Sitio básico'),
      ),
    ],
  })
