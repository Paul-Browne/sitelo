import { h2, p } from 'javascript-to-html'
import { code, demo, grainSandbox, grainSandboxHead, propsTable, uiLayout } from '../../lib/pt.js'

export default () =>
  uiLayout({
    title: 'Grão',
    description:
      'Um invólucro que estende um grão de película sobre o que quer que contenha.',
    activeHref: '/pt/ui/grain',
    extraHead: grainSandboxHead(),
    children: [
      p(
        'O grão tira a planura a uma grande área de cor — um herói, uma faixa colorida, um cartão que de outro modo se leria como um retângulo liso. Envolve o conteúdo tal como o ',
        code('container()'),
        ', mas não define largura nenhuma: a textura é desenhada em ',
        code('::after'),
        ', por cima dos filhos e sem apanhar o ponteiro.',
      ),
      p(
        'O mosaico é um SVG estático de ruído fractal, pintado uma só vez. Um ',
        code('filter'),
        ' sobre os píxeis vivos ficaria muito parecido e custaria uma nova rasterização sempre que algo por baixo se mexesse.',
      ),

      p(
        'Há duas camadas de controlo. ',
        code('opacity'),
        ' é o quanto a textura é forçada depois de desenhada; deixada em paz, é o tema que a define, e é sobre esse valor que os dois temas estão equilibrados. ',
        code('type'),
        ', ',
        code('frequency'),
        ', ',
        code('octaves'),
        ', ',
        code('seed'),
        ' e ',
        code('color'),
        ' são a turbulência em si; mexer em qualquer uma constrói uma textura para aquele elemento em vez de usar a partilhada da folha de estilos.',
      ),

      h2('Grão básico'),
      demo(`grain({ style: 'background: var(--su-surface-2); padding: 2rem; border-radius: 0.75rem' },
  text({ variant: 'lead', align: 'center' }, 'Com textura.'),
)`, { align: 'stretch' }),

      h2('Tipo de ruído'),
      p(
        code('fractal'),
        ' soma o ruído tal como está e dá o salpico regular da película. ',
        code('turbulence'),
        ' toma-lhe o valor absoluto, o que deixa veios escuros e grumos: mais perto do fumo ou do mármore do que do grão.',
      ),
      demo(`grid({ min: '9rem' },
  ...['fractal', 'turbulence'].map((type) =>
    grain({ type, style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, type),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Frequência'),
      p(
        'Ciclos por píxel: mais alto é mais fino. O ruído é desenhado ao tamanho da própria caixa, uma unidade por píxel, por isso isto mantém-se meça a caixa o que medir — um cartão pequeno e uma faixa a toda a largura recebem o mesmo grão, e nada se repete.',
      ),
      demo(`grid({ min: '9rem' },
  ...[0.2, 0.57, 1.2].map((frequency) =>
    grain({ frequency, style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, String(frequency)),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Oitavas'),
      p(
        'Quantas camadas de ruído são somadas, cada uma mais fina e mais ténue do que a anterior. Uma só fica lisa e regular; mais acrescentam detalhe, e cada uma custa ao navegador outra passagem na primeira vez que desenha o mosaico.',
      ),
      demo(`grid({ min: '9rem' },
  ...[1, 3, 6].map((octaves) =>
    grain({ octaves, style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, String(octaves)),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Semente'),
      p(
        'Que ruído é desenhado. Serve qualquer número, o mesmo dá sempre o mesmo padrão, e mais nada muda na textura — dá jeito quando dois painéis com grão ficam lado a lado e a repetição se denuncia.',
      ),
      demo(`grid({ min: '9rem' },
  ...[0, 7, 42].map((seed) =>
    grain({ seed, style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, String(seed)),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Cor'),
      p(
        'O ruído é cinzento por omissão. ',
        code('color'),
        ' tinge-o: o valor é multiplicado dentro do filtro, por isso tem de ser um que se resolva ao construir a página — ',
        code('#rgb'),
        ', ',
        code('#rrggbb'),
        ' ou ',
        code('rgb()'),
        '. Uma cor com nome, ',
        code('currentColor'),
        ' ou um ',
        code('var()'),
        ' não são, e deixam o ruído cinzento em vez de partirem a build. O alfa é quanta tinta: ',
        code('#ff880080'),
        ' é metade de ',
        code('#ff8800'),
        ', e alfa zero é nenhuma.',
      ),
      demo(`grid({ min: '9rem' },
  ...['#0a7a45', '#c05621', '#2f7fc7'].map((color) =>
    grain({ color, style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, color),
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
    grain({ blend, style: 'background: var(--su-primary-soft); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, blend),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Sandbox'),
      grainSandbox(),

      h2('Props'),
      propsTable([
        ['opacity', 'number', '', 'Opacidade da textura. Deixada em paz, é o tema que a define.'],
        ['blend', 'string', "'normal'", 'Um mix-blend-mode para a textura.'],
        ['type', "'fractal' | 'turbulence'", "'fractal'", 'Que turbulência desenhar.'],
        ['frequency', 'number', '0.57', 'Ciclos por píxel — mais alto é mais fino.'],
        ['octaves', 'number', '3', 'Camadas de ruído somadas, 1 a 8.'],
        ['seed', 'number', '0', 'Que ruído desenhar.'],
        ['color', 'string', '', 'Tinge o ruído; o alfa é o quanto. #rgb, #rrggbb, #rrggbbaa, rgb() ou rgba().'],
        ['as', 'string', "'div'", 'Elemento a renderizar, p. ex. section.'],
      ]),
    ],
  })
