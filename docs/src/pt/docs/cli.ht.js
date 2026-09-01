import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout } from '../../lib/pt.js'
import { cliSnippets } from '../../lib/snippets/cli.js'

const s = cliSnippets('pt')

export default () =>
  docsLayout({
    title: 'CLI',
    description: 'sitelo dev, build, preview e as opções mais usadas.',
    activeHref: '/pt/docs/cli',
    children: [
      p(
        'A CLI do ',
        code('sitelo'),
        ' encapsula o Vite incluído e injeta automaticamente o plugin de páginas HTML.',
      ),
      h2('Comandos'),
      codeBlock('shell', s.commands, 'bash'),
      ul(
        { class: 'docs-list' },
        li(
          code('dev'),
          ' — renderização SSR verdadeira a pedido, incluindo rotas dinâmicas, mais uma pequena barra de ferramentas de desenvolvimento',
        ),
        li(
          code('build'),
          ' — HTML estático em ',
          code('dist/'),
          ' (ou no ',
          code('outDir'),
          ' que indicares)',
        ),
        li(code('preview'), ' — serve a compilação de produção localmente'),
        li(
          code('lighthouse'),
          ' — audita a compilação de produção (precisa da dependência par ',
          code('lighthouse'),
          ')',
        ),
      ),
      p(
        'Desliga a barra com ',
        code('devToolbar: false'),
        ' em ',
        code('sitelo.config.js'),
        ' — vê ',
        a({ href: '/pt/docs/configuration' }, 'Configuração'),
        '.',
      ),
      h2('Opções úteis'),
      codeBlock('shell', s.flags, 'bash'),
      ul(
        { class: 'docs-list' },
        li(code('--port'), ' / ', code('--host'), ' / ', code('--open'), ' — servidor'),
        li(
          code('--outDir'),
          ' / ',
          code('--emptyOutDir'),
          ' / ',
          code('--base'),
          ' — compilação',
        ),
        li(
          code('--root'),
          ' — raiz do projeto (prático para um site em ',
          code('docs/'),
          ')',
        ),
        li(code('--config'), ' — ficheiro de configuração do Vite personalizado'),
        li(code('--mode'), ' / ', code('--logLevel'), ' / ', code('--debug')),
      ),
      p(
        'Tudo o que reutilizares entre comandos fica melhor como opção do Vite em ',
        code('sitelo.config.js'),
        ', sob ',
        code('vite'),
        '.',
      ),
    ],
  })
