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
      h2('Encontrar código sem uso'),
      p(
        a({ href: 'https://knip.dev' }, 'knip'),
        ' encontra ficheiros, exports e dependências que nada utiliza. Num projeto sitelo precisa de uma pista: as páginas e as ilhas são descobertas no sistema de ficheiros, por isso nada as importa, e sem essa pista o knip reporta o site inteiro como ficheiros sem uso.',
      ),
      codeBlock('shell', s.knipInstall, 'bash'),
      codeBlock('knip.js', s.knip, 'javascript'),
      codeBlock('shell', s.knipRun, 'bash'),
      p(
        code('knipConfig()'),
        ' lê o teu ',
        code('sitelo.config.js'),
        ' e marca as páginas e as ilhas como pontos de entrada tal como a compilação as descobre — ',
        code('pagesDir'),
        ', ',
        code('pageExtensions'),
        ', ',
        code('include'),
        ' e ',
        code('exclude'),
        ' aplicam-se todos. O que sobra no relatório é código a que o site realmente nunca chega.',
      ),
      p(
        'Uma coisa que não consegue ver: um script de cliente que uma página referencia por URL em vez de importar, como ',
        code('<script src="/js/app.js">'),
        '. Esses indicas tu, e qualquer outra opção que o knip aceite passa-se ao lado — é incorporada no resultado. O ',
        code('!'),
        ' final é a marca do knip para código de produção, que é exatamente o que um script enviado ao navegador é.',
      ),
      codeBlock('knip.js', s.knipEntry, 'javascript'),
    ],
  })
