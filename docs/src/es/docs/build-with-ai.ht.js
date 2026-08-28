import { a, h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout } from '../../lib/es.js'
import { buildWithAiSnippets } from '../../lib/snippets/build-with-ai.js'

const s = buildWithAiSnippets('es')

export default () =>
  docsLayout({
    title: 'Crear con IA',
    description:
      'Dale a los agentes de programación conocimiento actualizado de sitelo con llms.txt, reglas de proyecto y consejos prácticos.',
    activeHref: '/es/docs/build-with-ai',
    children: [
      p(
        'Los editores con IA y los agentes de programación suelen equivocarse con sitelo: recurren a patrones de React, Next o Astro que aquí no aplican. Esta guía explica cómo apuntarlos a la documentación actual de sitelo y mantener el código generado dentro del modelo correcto.',
      ),
      h2('llms.txt'),
      p(
        'sitelo publica un resumen del framework legible por máquinas en ',
        a({ href: '/llms.txt' }, 'sitelo.js.org/llms.txt'),
        '. Muchos agentes pueden descargar una URL; pídele al tuyo que lea ese archivo (y la documentación para humanos) antes de escribir código de sitelo.',
      ),
      ul(
        { class: 'docs-list' },
        li(
          a({ href: '/llms.txt' }, 'https://sitelo.js.org/llms.txt'),
          ' — API y convenciones en formato compacto',
        ),
        li(
          a({ href: '/es/docs' }, 'https://sitelo.js.org/es/docs'),
          ' — guías completas',
        ),
        li(
          a({ href: 'https://github.com/paul-browne/sitelo' }, 'README en GitHub'),
          ' — modelo mental y resumen de funcionalidades',
        ),
        li(
          a({ href: 'https://ht.js.org', rel: 'noopener' }, 'https://ht.js.org'),
          ' — documentación de ',
          code('javascript-to-html'),
          ' (recomendado para escribir HTML en JS)',
        ),
      ),
      p(
        'A diferencia de un servidor MCP de documentación, ',
        code('llms.txt'),
        ' no necesita instalación: pega la URL en el chat, añádela a las reglas del proyecto, o deja que el agente la descargue.',
      ),
      h2('Reglas de proyecto'),
      p(
        'Si tu herramienta admite instrucciones persistentes (',
        code('AGENTS.md'),
        ', reglas de Cursor, instrucciones de Copilot, …), añade una regla breve sobre sitelo para que cada sesión arranque con el modelo mental correcto. El ',
        a({ href: '/es/examples/basic' }, 'ejemplo básico'),
        ' incluye un ',
        code('AGENTS.md'),
        ' que puedes copiar:',
      ),
      codeBlock('AGENTS.md', s.agents, 'markdown'),
      h3('Cursor'),
      p(
        'Crea ',
        code('.cursor/rules/sitelo.mdc'),
        ' en tu proyecto (o pega el mismo texto en la interfaz de reglas de proyecto de Cursor):',
      ),
      codeBlock('.cursor/rules/sitelo.mdc', s.cursorRule, 'markdown'),
      h2('Consejos para trabajar en sitelo con IA'),
      ul(
        { class: 'docs-list' },
        li(
          'Parte de una plantilla — pídele al agente que genere el andamiaje a partir de ',
          a({ href: '/es/examples/basic' }, 'examples/basic'),
          ' o ',
          a({ href: '/es/examples/wordpress' }, 'examples/wordpress'),
          ' en lugar de inventarse un framework.',
        ),
        li(
          'Prefiere ',
          a({ href: 'https://ht.js.org', rel: 'noopener' }, 'javascript-to-html'),
          ' (',
          code('ht.js'),
          ') para el marcado: funciones de etiqueta que devuelven cadenas HTML, sin motor de plantillas ni React. Apunta a los agentes a ',
          a({ href: 'https://ht.js.org', rel: 'noopener' }, 'ht.js.org'),
          ' para que no se inventen árboles de componentes JSX.',
        ),
        li(
          'Las páginas son funciones que devuelven HTML — ',
          code('export default () => `<html>…</html>`'),
          ' o compuestas con ',
          code('javascript-to-html'),
          '. JSX está bien mientras compile a cadenas; no hace falta un runtime de React.',
        ),
        li(
          'Usa la CLI de sitelo — ',
          code('sitelo'),
          ' / ',
          code('sitelo build'),
          ' — y no ',
          code('vite'),
          ' directamente, salvo que sepas que necesitas una configuración de Vite propia.',
        ),
        li(
          'Verifica las APIs contra ',
          a({ href: '/llms.txt' }, 'llms.txt'),
          ' — sobre todo ',
          code('generateStaticParams'),
          ', ',
          code('fetchWithCache'),
          ' y las ',
          a({ href: '/es/docs/islands' }, 'islas de servidor'),
          '.',
        ),
        li(
          'Cero JS por defecto: enlaza un ',
          code('<script>'),
          ' solo cuando la página necesite código de cliente; los módulos sin referenciar se quedan en el servidor.',
        ),
        li(
          'Revisa y ejecuta — siempre ',
          code('sitelo build'),
          ' (o el servidor de desarrollo) después de que el agente edite páginas; trata el marcado generado como un borrador.',
        ),
      ),
      p(
        a({ href: '/es/docs' }, 'Primeros pasos'),
        ' · ',
        a({ href: '/es/examples/basic' }, 'Ejemplo básico'),
        ' · ',
        a({ href: '/llms.txt' }, 'llms.txt'),
      ),
    ],
  })
