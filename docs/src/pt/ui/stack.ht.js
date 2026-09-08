import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Pilha',
    description:
      'Uma linha ou coluna flex com um token de espaçamento no intervalo — a peça de disposição com que a maioria das páginas é construída.',
    activeHref: '/pt/ui/stack',
    extraHead: uiHead(),
    children: [
      p(
        'A pilha põe espaço entre as coisas. É um contentor flex com uma única função, e é a resposta à maioria das perguntas do género «como afasto isto» — na vertical por predefinição, na horizontal com ',
        code("direction: 'row'"),
        '.',
      ),
      p(
        'Os intervalos vêm da escala de espaçamento, por isso o ritmo de uma página mantém-se coerente sem ninguém escolher valores em píxeis.',
      ),

      h2('Pilha básica'),
      demo(`stack({ gap: 'md' },
  card(cardBody('Primeiro')),
  card(cardBody('Segundo')),
  card(cardBody('Terceiro')),
)`, { align: 'stretch' }),

      h2('Direção'),
      demo(`stack({ direction: 'row', gap: 'md' },
  button('Um'),
  button({ variant: 'outline' }, 'Dois'),
  button({ variant: 'outline' }, 'Três'),
)`),

      h2('Intervalo'),
      p(
        'Um nome de token (',
        code("'xs'"),
        ' … ',
        code("'3xl'"),
        '), um número de unidades de espaçamento, ou um comprimento CSS em bruto.',
      ),
      demo(`stack({ gap: 'lg' },
  stack({ direction: 'row', gap: 'xs' }, chip('xs'), chip('xs'), chip('xs')),
  stack({ direction: 'row', gap: 'md' }, chip('md'), chip('md'), chip('md')),
  stack({ direction: 'row', gap: 6 }, chip('6 unidades'), chip('6 unidades')),
  stack({ direction: 'row', gap: '3rem' }, chip('3rem'), chip('3rem')),
)`, { align: 'stretch' }),

      h2('Alinhamento'),
      p(
        code('align'),
        ' e ',
        code('justify'),
        ' aceitam valores de flexbox em bruto, por isso serve tudo o que o CSS entende.',
      ),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm', justify: 'space-between', style: 'background: var(--su-surface-2); padding: 0.6rem; border-radius: 0.5rem' },
    chip('início'),
    chip('fim'),
  ),
  stack({ direction: 'row', gap: 'sm', justify: 'center', align: 'center', style: 'background: var(--su-surface-2); padding: 0.6rem; border-radius: 0.5rem' },
    button({ size: 'sm' }, 'Centrado'),
    chip('e alinhado'),
  ),
)`, { align: 'stretch' }),

      h2('Mudança de linha'),
      p(
        'Uma fila de chips ou botões que pode não caber precisa de ',
        code('wrap'),
        ' — sem ele espremem-se em vez de passarem para a linha seguinte.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  ...['routing', 'data', 'islands', 'images', 'pagefind', 'lighthouse', 'sitemap', 'rss'].map(
    (name) => chip({ color: 'neutral' }, name),
  ),
)`, { align: 'stretch' }),

      h2('Inline'),
      p(
        code('inline'),
        ' torna a pilha um ',
        code('inline-flex'),
        ', por isso ela assenta numa linha de texto em vez de ocupar toda a largura.',
      ),
      demo(`text(
  'Feito com ',
  stack({ direction: 'row', gap: 'xs', inline: true, align: 'center' },
    chip({ color: 'primary', size: 'sm' }, 'sitelo'),
    chip({ color: 'neutral', size: 'sm' }, 'vite'),
  ),
  ' e mais nada.',
)`, { align: 'stretch' }),

      h2('Como outro elemento'),
      demo(`stack({ as: 'nav', direction: 'row', gap: 'sm' },
  navLink({ href: '/pt/docs' }, 'Documentação'),
  navLink({ href: '/pt/ui', current: true }, 'UI'),
  navLink({ href: '/pt/examples' }, 'Exemplos'),
)`),

      h2('Props'),
      propsTable([
        ['direction', "'row' | 'column'", "'column'", 'Eixo principal.'],
        ['gap', 'Space', "'md'", 'Espaço entre os filhos.'],
        ['align', 'string', "'stretch'", 'Qualquer valor de align-items.'],
        ['justify', 'string', "'flex-start'", 'Qualquer valor de justify-content.'],
        ['wrap', 'boolean | string', 'false', 'true significa mudar de linha; uma cadeia passa como flex-wrap.'],
        ['inline', 'boolean', 'false', 'Desenhada como inline-flex.'],
        ['as', 'string', "'div'", 'Elemento a renderizar, por exemplo nav ou ul.'],
      ]),
    ],
  })
