import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Chip',
    description:
      'Uma etiqueta compacta — uma tag, um estado, um filtro, uma contagem.',
    activeHref: '/pt/ui/chip',
    extraHead: uiHead(),
    children: [
      p(
        'Os chips são pequenos pedaços de metadados: as tags de um artigo, o estado de uma construção, as categorias de uma página. São inline por predefinição, por isso uma fila deles pede um ',
        code('stack'),
        ' com ',
        code('wrap'),
        '.',
      ),

      h2('Chip básico'),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip('estático'),
  chip('vite'),
  chip('sem-runtime'),
)`),

      h2('Cores'),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ color: 'primary' }, 'primary'),
  chip({ color: 'neutral' }, 'neutral'),
  chip({ color: 'success' }, 'success'),
  chip({ color: 'warning' }, 'warning'),
  chip({ color: 'danger' }, 'danger'),
)`),

      h2('Variantes'),
      demo(`stack({ gap: 'sm' },
  stack({ direction: 'row', gap: 'sm', wrap: true },
    chip({ variant: 'soft', color: 'primary' }, 'soft'),
    chip({ variant: 'soft', color: 'success' }, 'soft'),
    chip({ variant: 'soft', color: 'danger' }, 'soft'),
  ),
  stack({ direction: 'row', gap: 'sm', wrap: true },
    chip({ variant: 'outline', color: 'primary' }, 'outline'),
    chip({ variant: 'outline', color: 'success' }, 'outline'),
    chip({ variant: 'outline', color: 'danger' }, 'outline'),
  ),
  stack({ direction: 'row', gap: 'sm', wrap: true },
    chip({ variant: 'solid', color: 'primary' }, 'solid'),
    chip({ variant: 'solid', color: 'success' }, 'solid'),
    chip({ variant: 'solid', color: 'danger' }, 'solid'),
  ),
)`, { align: 'start' }),

      h2('Tamanhos'),
      demo(`stack({ direction: 'row', gap: 'sm', align: 'center', wrap: true },
  chip({ size: 'sm' }, 'pequeno'),
  chip({ size: 'md' }, 'médio'),
  chip({ size: 'lg' }, 'grande'),
)`),

      h2('Ponto de estado'),
      p(
        'Um ponto à frente transforma um chip num estado. A cor sozinha não chega para transmitir significado, por isso mantém a palavra.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ color: 'success', dot: true }, 'Construção passou'),
  chip({ color: 'warning', dot: true }, 'Em fila'),
  chip({ color: 'danger', dot: true }, 'Falhou'),
  chip({ color: 'neutral', dot: true }, 'Ignorada'),
)`),

      h2('Ligações'),
      p(
        'Dá a um chip um ',
        code('href'),
        ' e ele desenha uma âncora — a forma habitual de uma lista de tags, em que cada tag é uma página.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ href: '/pt/docs/routing', color: 'primary' }, 'rotas'),
  chip({ href: '/pt/docs/data', color: 'primary' }, 'dados'),
  chip({ href: '/pt/docs/islands', color: 'primary' }, 'ilhas'),
)`),

      h2('Como botão'),
      p(
        code('as'),
        ' muda o elemento, para um filtro que alterna em vez de navegar.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ as: 'button', variant: 'solid', color: 'primary', 'aria-pressed': 'true' }, 'Tudo'),
  chip({ as: 'button', variant: 'outline', color: 'neutral', 'aria-pressed': 'false' }, 'Guias'),
  chip({ as: 'button', variant: 'outline', color: 'neutral', 'aria-pressed': 'false' }, 'Exemplos'),
)`),

      h2('Numa tabela'),
      demo(`table({
  striped: true,
  columns: [
    { key: 'page', header: 'Página' },
    { header: 'Estado', align: 'end', render: (row) =>
      chip({ size: 'sm', dot: true, color: row.ok ? 'success' : 'danger' }, row.ok ? 'ok' : 'falhou') },
  ],
  rows: [
    { page: '/', ok: true },
    { page: '/docs', ok: true },
    { page: '/blog/[slug]', ok: false },
  ],
})`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", 'De que paleta bebe.'],
        ['variant', "'soft' | 'outline' | 'solid'", "'soft'", 'Quanto peso o chip carrega.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Espaçamento e tamanho do texto.'],
        ['href', 'string', '', 'Desenha uma âncora.'],
        ['dot', 'boolean', 'false', 'Acrescenta um ponto de estado antes da etiqueta.'],
        ['as', 'string', "'span'", 'Elemento a renderizar quando não há href.'],
      ]),
    ],
  })
