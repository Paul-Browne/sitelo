import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout, pageCodeTabs } from '../../lib/pt.js'
import { gettingStartedSnippets } from '../../lib/snippets/getting-started.js'

const s = gettingStartedSnippets('pt')

export default () =>
  docsLayout({
    title: 'Primeiros passos',
    description: 'Instala o sitelo e cria o teu primeiro site estático.',
    activeHref: '/pt/docs',
    children: [
      p(
        'O sitelo é um gerador de sites estáticos sem configuração, assente no Vite. Instala um único pacote, escreve funções que devolvem HTML e corre ',
        code('sitelo build'),
        '.',
      ),
      h2('Instalação'),
      codeBlock('shell', s.install, 'bash'),
      p('Requer Node 20.19+ (ou 22.12+). O Vite vem incluído — não é preciso instalá-lo à parte.'),
      h2('A tua primeira página'),
      p(
        'Cria ',
        code('src/index.ht.js'),
        ' (ou ',
        code('.ht.jsx'),
        '). Recomendamos o ',
        a({ href: 'https://ht.js.org', rel: 'noopener' }, 'ht.js'),
        ':',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      h2('Executar'),
      codeBlock('shell', s.run, 'bash'),
      p(
        'Isso produz ',
        code('dist/index.html'),
        ' (com ',
        code('<!DOCTYPE html>'),
        ' acrescentado automaticamente) e um ',
        code('404.html'),
        ' por omissão.',
      ),
      h2('Passos seguintes'),
      ul(
        { class: 'docs-list' },
        li(
          a({ href: '/pt/docs/pages' }, 'Escrever páginas'),
          ' — templates de string, JSX e módulos estruturados',
        ),
        li(
          a({ href: '/pt/docs/routing' }, 'Rotas'),
          ' — rotas baseadas em ficheiros e ',
          code('generateStaticParams'),
        ),
        li(
          a({ href: '/pt/docs/data' }, 'Carregamento de dados'),
          ' — ',
          code('data()'),
          ' e ',
          code('fetchWithCache'),
        ),
        li(
          a({ href: '/pt/docs/assets' }, 'Recursos e estilos'),
          ' — JS/CSS de frontend compilados pelo Vite (',
          code('src/js'),
          ', ',
          code('src/css'),
          ')',
        ),
        li(
          a({ href: '/pt/docs/configuration' }, 'Configuração'),
          ' — ',
          code('sitelo.config.js'),
          ' e opções do Vite',
        ),
        li(
          a({ href: '/pt/docs/build-with-ai' }, 'Criar com IA'),
          ' — ',
          code('llms.txt'),
          ', regras de projeto e dicas para agentes',
        ),
      ),
    ],
  })
