import { div, h2, p, table, tbody, td, th, thead, tr } from 'javascript-to-html'
import { code, codeBlock, docsLayout, pageCodeTabs } from '../../lib/pt.js'
import {
  paramsHt,
  paramsJsx,
  paramsTemplate,
  structure,
} from '../../lib/snippets/routing.js'

function row(feature, file, url) {
  return tr(td(feature), td(file), td(url))
}

export default () =>
  docsLayout({
    title: 'Rotas',
    description:
      'Encaminhamento baseado em ficheiros, segmentos dinâmicos e generateStaticParams.',
    activeHref: '/pt/docs/routing',
    children: [
      p('As rotas vêm diretamente do sistema de ficheiros, dentro de ', code('src/'), '.'),
      codeBlock('project', structure, 'bash'),
      h2('Tabela de rotas'),
      div(
        { class: 'docs-table-scroll' },
        table(
          { class: 'docs-table' },
          thead(tr(th('Funcionalidade'), th('Ficheiro'), th('URL'))),
          tbody(
            row('Estática', code('index.ht.js'), code('/')),
            row('Aninhada', code('blog/index.ht.js'), code('/blog')),
            row('Dinâmica', code('blog/[slug].ht.js'), code('/blog/my-post')),
            row(
              'Vários parâmetros',
              code('blog/[year]/[slug].ht.js'),
              code('/blog/2026/my-post'),
            ),
            row('Apanha-tudo', code('docs/[...path].ht.js'), code('/docs/api/auth')),
            row(
              'Apanha-tudo opcional',
              code('docs/[...path]?.ht.js'),
              code('/docs + níveis abaixo'),
            ),
            row('Grupos de rotas', code('(admin)/users.ht.js'), code('/users')),
          ),
        ),
      ),
      p(
        'Ganha a rota mais específica: a estática vence a dinâmica, e a dinâmica vence as apanha-tudo. Dois ficheiros a gerar o mesmo URL são um erro de compilação.',
      ),
      h2('generateStaticParams'),
      p(
        'As rotas dinâmicas declaram que páginas emitir na compilação. Em ',
        code('sitelo'),
        ' (dev), as rotas dinâmicas continuam a ser renderizadas a pedido, sem listar cada parâmetro.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: paramsTemplate,
        ht: paramsHt,
        jsx: paramsJsx,
      }),
      p(
        'Os valores podem ser strings, números ou booleanos — são convertidos em string e codificados para o URL. Os parâmetros apanha-tudo aceitam arrays (',
        code("{ path: ['a', 'b'] }"),
        ') ou strings separadas por barras (',
        code("{ path: 'a/b' }"),
        ').',
      ),
      p(
        'Uma página dinâmica que não gera nenhuma rota mostra um aviso, para não desaparecer do teu site sem se dar por isso.',
      ),
    ],
  })
