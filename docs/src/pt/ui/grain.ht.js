import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'

export default () =>
  uiLayout({
    title: 'Grão',
    description:
      'Um invólucro que estende um grão de película sobre o que quer que contenha.',
    activeHref: '/pt/ui/grain',
    children: [
      p(
        'O grão tira a planura a uma grande área de cor — um herói, uma faixa colorida, um cartão que de outro modo se leria como um retângulo liso. Envolve o conteúdo tal como o ',
        code('container()'),
        ', mas não define largura nenhuma: a textura é desenhada em ',
        code('::after'),
        ', por cima dos filhos e sem apanhar o ponteiro.',
      ),
      p(
        'O mosaico é um SVG estático de ruído fractal, pintado uma vez e repetido. Um ',
        code('filter'),
        ' sobre os píxeis vivos ficaria muito parecido e custaria uma nova rasterização sempre que algo por baixo se mexesse.',
      ),

      h2('Grão básico'),
      demo(`grain({ style: 'background: var(--su-surface-2); padding: 2rem; border-radius: 0.75rem' },
  text({ variant: 'lead', align: 'center' }, 'Com textura.'),
)`, { align: 'stretch' }),

      h2('Intensidade'),
      p(
        'Três degraus. O tema define a força base e a intensidade escala-a, porque uma superfície quase preta aceita o grão com mais facilidade do que o papel: medido em claridade percebida, o mesmo mosaico rende cerca de 1,6× o salpico sobre o fundo escuro. Por isso ',
        code('medium'),
        ' é uma opacidade mais baixa no modo escuro, e os dois acabam no mesmo sítio.',
      ),
      demo(`grid({ min: '9rem' },
  ...['soft', 'medium', 'strong'].map((intensity) =>
    grain({ intensity, style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, intensity),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Escala'),
      p(
        'O tamanho de um mosaico de ruído. Mais pequeno é mais fino: mais perto da película, mais longe da areia.',
      ),
      demo(`grid({ min: '9rem' },
  ...['60px', '180px', '420px'].map((scale) =>
    grain({ scale, intensity: 'strong', style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, scale),
    ),
  ),
)`, { align: 'stretch' }),

      h2('À volta de um contentor'),
      p(
        'O grão não traz limite de largura próprio, e é isso mesmo que faz isto funcionar: o invólucro corre de ponta a ponta e o ',
        code('container()'),
        ' lá dentro mantém o texto centrado e legível.',
      ),
      demo(`grain({ as: 'section', style: 'background: var(--su-primary-soft); padding-block: 2.5rem; border-radius: 0.75rem' },
  container({ size: 'sm' },
    stack({ gap: 'sm', align: 'center' },
      heading({ level: 2, size: 'h4' }, 'Uma faixa com textura'),
      text({ tone: 'muted', align: 'center' }, 'Largura toda por fora, uma coluna legível por dentro.'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Sobre um cartão'),
      p(
        'A textura herda o ',
        code('border-radius'),
        ' da caixa, portanto envolver algo arredondado não lhe esquadra os cantos.',
      ),
      demo(`grid({ min: '12rem' },
  grain({ style: 'border-radius: var(--su-radius-lg)' },
    card({ variant: 'elevated' },
      cardBody(text({ variant: 'small' }, 'Com grão')),
    ),
  ),
  card({ variant: 'elevated' },
    cardBody(text({ variant: 'small' }, 'Sem grão')),
  ),
)`, { align: 'stretch' }),

      h2('Mistura'),
      p(
        'Por omissão a textura assenta sobre o conteúdo com a sua própria opacidade. ',
        code('blend'),
        ' aceita qualquer ',
        code('mix-blend-mode'),
        ': ',
        code('overlay'),
        ' e ',
        code('soft-light'),
        ' empurram o grão para dentro da cor de baixo em vez de a acinzentarem.',
      ),
      demo(`grid({ min: '9rem' },
  ...['normal', 'overlay', 'soft-light'].map((blend) =>
    grain({ blend, intensity: 'strong', style: 'background: var(--su-primary-soft); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, blend),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['intensity', "'soft' | 'medium' | 'strong'", "'medium'", 'Até onde a textura é levada, relativamente à base do tema.'],
        ['opacity', 'number', '', 'Uma opacidade crua, que se sobrepõe a intensity e ao tema.'],
        ['scale', 'string', "'180px'", 'O tamanho de um mosaico de ruído.'],
        ['blend', 'string', "'normal'", 'Um mix-blend-mode para a textura.'],
        ['as', 'string', "'div'", 'Elemento a renderizar, p. ex. section.'],
      ]),
    ],
  })
