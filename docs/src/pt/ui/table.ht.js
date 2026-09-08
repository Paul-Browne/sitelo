import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Tabela',
    description:
      'Linhas e colunas a partir de dados, num contentor com deslocamento que impede uma tabela larga de partir a página.',
    activeHref: '/pt/ui/table',
    extraHead: uiHead(),
    children: [
      p(
        'Passa ',
        code('columns'),
        ' e ',
        code('rows'),
        ' e a tabela constrói-se sozinha, cabeçalho incluído. Vai envolvida num contentor com deslocamento horizontal, por isso uma tabela com mais colunas do que um telemóvel mostra desliza sozinha em vez de esticar a página. Exportada como ',
        code('table'),
        ' e como ',
        code('dataTable'),
        '.',
      ),

      h2('Tabela básica'),
      demo(`table({
  columns: [
    { key: 'page', header: 'Página' },
    { key: 'size', header: 'Tamanho' },
    { key: 'time', header: 'Tempo de render' },
  ],
  rows: [
    { page: '/', size: '4,1 kB', time: '12 ms' },
    { page: '/docs', size: '12,7 kB', time: '31 ms' },
    { page: '/examples', size: '9,4 kB', time: '24 ms' },
  ],
})`, { align: 'stretch' }),

      h2('Alinhamento'),
      p('Os números leem-se melhor alinhados ao fim da sua coluna.'),
      demo(`table({
  columns: [
    { key: 'page', header: 'Página' },
    { key: 'bytes', header: 'Bytes', align: 'end' },
    { key: 'gzip', header: 'Gzip', align: 'end' },
  ],
  rows: [
    { page: '/', bytes: '4 112', gzip: '1 204' },
    { page: '/docs', bytes: '12 704', gzip: '3 910' },
    { page: '/examples', bytes: '9 388', gzip: '2 744' },
  ],
})`, { align: 'stretch' }),

      h2('Células à medida'),
      p(
        'Uma coluna com uma função ',
        code('render'),
        ' recebe a linha inteira e devolve o que deve ficar na célula — um chip, uma ligação, um número formatado.',
      ),
      demo(`table({
  columns: [
    { header: 'Página', render: (row) => link({ href: row.href }, row.page) },
    { key: 'size', header: 'Tamanho', align: 'end' },
    { header: 'Estado', align: 'end', render: (row) =>
      chip({ size: 'sm', dot: true, color: row.ok ? 'success' : 'danger' }, row.ok ? 'ok' : 'falhou') },
  ],
  rows: [
    { page: '/docs/routing', href: '/pt/docs/routing', size: '18,2 kB', ok: true },
    { page: '/docs/data', href: '/pt/docs/data', size: '21,7 kB', ok: true },
    { page: '/docs/islands', href: '/pt/docs/islands', size: '24,1 kB', ok: false },
  ],
})`, { align: 'stretch' }),

      h2('Estilos'),
      p(
        code('striped'),
        ' pinta linhas alternadas, ',
        code('hover'),
        ' realça a linha sob o ponteiro, e ',
        code('dense'),
        ' aperta o espaçamento para uma tabela com muitas linhas.',
      ),
      demo(`stack({ gap: 'lg' },
  table({
    striped: true,
    caption: 'às riscas',
    columns: [{ key: 'name', header: 'Nome' }, { key: 'value', header: 'Valor', align: 'end' }],
    rows: [{ name: 'páginas', value: '169' }, { name: 'recursos', value: '208' }, { name: 'total', value: '9,5 MB' }],
  }),
  table({
    hover: true,
    dense: true,
    caption: 'com realce e densa',
    columns: [{ key: 'name', header: 'Nome' }, { key: 'value', header: 'Valor', align: 'end' }],
    rows: [{ name: 'páginas', value: '169' }, { name: 'recursos', value: '208' }, { name: 'total', value: '9,5 MB' }],
  }),
)`, { align: 'stretch' }),

      h2('Legenda'),
      p(
        'Uma legenda dá nome à tabela para quem chega a ela sem o texto à volta — vale a pena sempre que a tabela não esteja logo abaixo de um cabeçalho que já diga o que é.',
      ),
      demo(`table({
  caption: 'Saída das construções, a mais recente primeiro',
  columns: [
    { key: 'commit', header: 'Commit' },
    { key: 'when', header: 'Quando' },
    { key: 'pages', header: 'Páginas', align: 'end' },
  ],
  rows: [
    { commit: '94a837a', when: 'há 4 minutos', pages: '169' },
    { commit: 'dcfaaae', when: 'há 2 horas', pages: '161' },
  ],
})`, { align: 'stretch' }),

      h2('A partir de dados'),
      p(
        'As linhas são um array vulgar, por isso costumam ser aquilo que o ',
        code('data()'),
        ' já carregou — sem adaptador pelo meio.',
      ),
      demo(`return (() => {
  const posts = [
    { title: 'Olá mundo', date: '2026-01-14', reads: 1204 },
    { title: 'Estático primeiro', date: '2026-02-02', reads: 890 },
    { title: 'Sem runtime', date: '2026-03-19', reads: 2317 },
  ]

  return table({
    hover: true,
    columns: [
      { key: 'title', header: 'Artigo' },
      { key: 'date', header: 'Publicado' },
      { header: 'Leituras', align: 'end', render: (post) => post.reads.toLocaleString('pt') },
    ],
    rows: posts,
  })
})()`, { align: 'stretch' }),

      h2('Escrever a marcação à mão'),
      p(
        'Omite ',
        code('columns'),
        ' e a tabela desenha antes os seus filhos, por isso uma tabela com linha de rodapé ou cabeçalhos agrupados pode ser feita à mão e continuar a receber o estilo e o contentor com deslocamento.',
      ),

      h2('Props'),
      propsTable([
        ['columns', 'TableColumn[]', '', '{ key, header, align, render } por coluna. Omite para escreveres as linhas à mão.'],
        ['rows', 'object[]', '[]', 'Um objeto por linha.'],
        ['caption', 'Child', '', 'Uma legenda por cima da tabela.'],
        ['striped', 'boolean', 'false', 'Pintar linhas alternadas.'],
        ['hover', 'boolean', 'false', 'Realçar a linha sob o ponteiro.'],
        ['dense', 'boolean', 'false', 'Espaçamento de célula mais apertado.'],
      ]),
    ],
  })
