import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout, pageCodeTabs } from '../../lib/pt.js'
import { assetsSnippets } from '../../lib/snippets/assets.js'

const s = assetsSnippets('pt')

export default () =>
  docsLayout({
    title: 'Recursos e estilos',
    description:
      'Como o sitelo compila o JavaScript e o CSS de frontend com o Vite — e mantém o código de servidor fora do navegador.',
    activeHref: '/pt/docs/assets',
    children: [
      p(
        'O sitelo assenta no Vite, por isso o JavaScript e o CSS de frontend são compilados automaticamente. Coloca scripts e estilos dentro de ',
        code('src/'),
        ' (por exemplo ',
        code('src/js'),
        ' e ',
        code('src/css'),
        '), liga-os a partir do teu HTML com URLs relativos à raiz, e o sitelo trata do resto: TypeScript, imports de CSS, empacotamento e minificação.',
      ),
      h2('Estrutura do projeto'),
      p(
        'As páginas e os recursos partilham ',
        code('src/'),
        '. Pastas como ',
        code('js/'),
        ' e ',
        code('css/'),
        ' são convenções, não requisitos — ao sitelo interessa o que o teu HTML referencia, não como se chamam as pastas.',
      ),
      codeBlock('project', s.layout, 'bash'),
      h2('Ligar recursos a partir do HTML'),
      p(
        'Referencia os ficheiros com caminhos relativos à raiz. Um ',
        code('<script type="module">'),
        ' ou um ',
        code('<link rel="stylesheet">'),
        ' é o que diz ao sitelo para incluir esse ficheiro na compilação:',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      codeBlock('src/js/main.js', s.js, 'javascript'),
      codeBlock('src/css/styles.css', s.css, 'css'),
      h2('O que o Vite compila'),
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
          ' — empacotados como módulos ES, com o TypeScript removido e os imports incorporados',
        ),
        li(
          code('.css'),
          ' — processado e minificado; os ',
          code('@import'),
          ' e as referências ',
          code('url()'),
          ' relativas são resolvidos',
        ),
        li(
          'Tudo o que for importado a partir de um ponto de entrada referenciado (como o ',
          code('counter.ts'),
          ' acima) entra no mesmo bundle',
        ),
        li(
          'Em ',
          code('sitelo'),
          ' (dev), esses mesmos URLs passam pelo pipeline de transformação do Vite — não é preciso uma compilação à parte para experimentar TypeScript ou CSS',
        ),
      ),
      p(
        'Precisas de PostCSS, Sass ou de outros plugins do Vite? Acrescenta-os sob ',
        code('vite'),
        ' em ',
        a({ href: '/pt/docs/configuration' }, 'sitelo.config.js'),
        '.',
      ),
      h2('Zero JS por omissão'),
      ul(
        { class: 'docs-list' },
        li(
          'O código sem referências não é emitido. Um auxiliar importado apenas a partir de ',
          code('data()'),
          ' ou ',
          code('generateStaticParams'),
          ' fica fora de ',
          code('dist/'),
          ' — os segredos de servidor nunca são publicados por acidente.',
        ),
        li(
          'Sem ',
          code('<script>'),
          ' na página, a compilação não leva JavaScript de cliente. Para a maioria dos sites, HTML e CSS estáticos chegam.',
        ),
        li(
          code('public/'),
          ' é copiado tal como está (favicons, robots.txt, imagens estáticas a que não queres pôr hash).',
        ),
        li(
          'Os restantes ficheiros referenciados (imagens, tipos de letra, vídeos, …) são copiados para ',
          code('dist/'),
          '.',
        ),
      ),
      h2('Validação de recursos em falta'),
      p(
        'Um ',
        code('<script src>'),
        ' ou um ',
        code('href'),
        ' de folha de estilos que aponte para um ficheiro inexistente, quer em ',
        code('src/'),
        ' quer em ',
        code('public/'),
        ', faz falhar a compilação. Preferes um aviso?',
      ),
      codeBlock('sitelo.config.js', s.warn, 'javascript'),
    ],
  })
