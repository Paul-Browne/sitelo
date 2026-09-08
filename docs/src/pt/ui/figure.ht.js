import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Figura',
    description:
      'Uma imagem e a sua legenda, como uma só figura — com o espaço guardado antes de a imagem chegar.',
    activeHref: '/pt/ui/figure',
    extraHead: uiHead(),
    children: [
      p(
        'Uma ',
        code('<figure>'),
        ' liga a legenda àquilo que descreve, coisa que um parágrafo por baixo de uma imagem não faz. Passa ',
        code('src'),
        ' para o caso comum, ou filhos para tudo o resto que mereça legenda.',
      ),

      h2('Figura básica'),
      demo(`figure({
  src: '/logo.svg',
  alt: 'A marca escrita do sitelo',
  caption: 'A marca escrita, tal como aparece na barra de topo.',
  style: '--su-figure-bg: var(--su-surface-2)',
})`, { align: 'stretch' }),

      h2('Com proporção guardada'),
      p(
        code('ratio'),
        ' envolve a imagem num ',
        code('aspectRatio()'),
        ', para que a legenda nunca salte página abaixo quando a imagem carrega.',
      ),
      demo(`grid({ min: '13rem' },
  figure({ src: '/logo.svg', alt: '', ratio: '16 / 9', caption: 'ratio: 16 / 9' }),
  figure({ src: '/logo.svg', alt: '', ratio: '1 / 1', caption: 'ratio: 1 / 1' }),
)`, { align: 'stretch' }),

      h2('Legendar outra coisa'),
      p('Sem ', code('src'), ', os filhos são o conteúdo da figura.'),
      demo(`figure({ caption: 'Tabela 1 — saída de uma construção predefinida.' },
  table({
    dense: true,
    columns: [{ key: 'file', header: 'Ficheiro' }, { key: 'size', header: 'Tamanho', align: 'end' }],
    rows: [
      { file: 'index.html', size: '4,1 kB' },
      { file: '404.html', size: '860 B' },
      { file: 'sitemap.xml', size: '155 B' },
    ],
  }),
)`, { align: 'stretch' }),

      h2('Código com legenda'),
      p(
        'Repara na prop ',
        code('text'),
        ' do ',
        code('code()'),
        ': em toda esta biblioteca os filhos são renderizados como HTML, por isso um exemplo com etiquetas precisa de ser escapado ou o navegador constrói-o em vez de o mostrar.',
      ),
      demo(`figure({ caption: 'Uma página sitelo inteira.' },
  code({ text: 'export default () => "<h1>Olá</h1>"' }),
)`, { align: 'stretch' }),

      h2('Texto alternativo'),
      p(
        'O atributo ',
        code('alt'),
        ' é sempre escrito, vazio se não deres nada — uma imagem sem ',
        code('alt'),
        ' nenhum é anunciada pelo nome do ficheiro, o que é pior do que o silêncio. A legenda não substitui: a legenda é lida por toda a gente, o alt descreve a imagem a quem não a consegue ver.',
      ),
      p(
        'Quando a legenda já diz tudo o que a imagem diz, ',
        code("alt: ''"),
        ' é a resposta certa.',
      ),

      h2('Em texto corrido'),
      p(
        'As figuras que saem de um renderizador de Markdown já são estilizadas pelo ',
        code('prose()'),
        '. Este componente é para as figuras que constróis tu.',
      ),

      h2('Props'),
      propsTable([
        ['src', 'string', '', 'Origem da imagem. Omite-a e usa filhos em vez disso.'],
        ['alt', 'string', "''", 'Texto alternativo. Sempre escrito, mesmo vazio.'],
        ['caption', 'Child', '', 'A figcaption.'],
        ['ratio', 'string', '', 'Guarda o espaço antes de a imagem carregar.'],
      ]),
    ],
  })
