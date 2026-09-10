import { h2, p } from 'javascript-to-html'
import { fillableIcons, grid, icon, iconNames, stack, text } from 'sitelo/ui'

import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/pt.js'

/** Uma célula: o símbolo a um tamanho legível, com o nome que se escreve. */
const cell = (name) =>
  stack(
    {
      gap: 'xs',
      align: 'center',
      title: name,
      style:
        'padding: 0.85rem 0.5rem; border: 1px solid var(--su-border); border-radius: var(--su-radius-md); text-align: center; min-width: 0',
    },
    icon(name, { size: '1.5rem' }),
    text(
      {
        variant: 'caption',
        tone: 'muted',
        style: 'font-family: var(--su-font-mono); overflow-wrap: anywhere',
      },
      name,
    ),
  )

/* Por ordem alfabética, tirado diretamente da biblioteca, para a página não
 * poder ficar atrás do conjunto que documenta. */
const gallery = () => grid({ min: '7.5rem', gap: 'sm' }, ...iconNames().map(cell))

/**
 * Os símbolos que se preenchem pintando o próprio traçado, por oposição aos
 * que trazem um segundo desenho — distinguidos por as duas formas serem ou
 * não a mesma marcação, para que nenhuma demonstração fique atrás.
 */
const body = (html) => html.replace(/^<svg[^>]*>/, '')

const samePath = () =>
  fillableIcons().filter((name) => body(icon(name, { filled: true })) === body(icon(name)))

/**
 * A demonstração do preenchimento, calculada em vez de listada à mão — a
 * fonte é o que a página imprime, por isso um símbolo que passe a ser
 * preenchível aparece aqui sem ninguém se lembrar de o acrescentar.
 */
const fillDemo = ({ filled = false } = {}) => {
  const props = filled ? "{ filled: true, size: 'lg' }" : "{ size: 'lg' }"
  const calls = samePath().map((name) => `  icon('${name}', ${props}),`)

  return [
    "stack({ direction: 'row', gap: 'md', align: 'center' },",
    ...calls,
    ')',
  ].join('\n')
}

export default () =>
  uiLayout({
    title: 'Ícones',
    description:
      'Um conjunto de 99 símbolos na mesma grelha, desenhados inline para que um ícone tome a cor e o tamanho do texto à sua volta.',
    activeHref: '/pt/ui/icons',
    children: [
      p(
        code('icon()'),
        ' devolve um ',
        code('<svg>'),
        ' inline. Todos os símbolos são desenhados na mesma grelha de 24×24, em traços sem preenchimento a ',
        code('currentColor'),
        ', por isso herdam a cor e o tamanho de letra daquilo onde estão e não precisam de estilo próprio.',
      ),

      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('check'),
  icon('search'),
  icon('trash'),
  icon('settings'),
)`),

      h2('Num componente'),
      p(
        'Um ícone é um filho como qualquer outro. Como se dimensiona em ',
        code('em'),
        ', combina com a etiqueta ao lado sem que lhe digam o tamanho dela:',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', align: 'center', wrap: true },
  button({ color: 'primary' }, icon('download'), 'Descarregar'),
  button({ variant: 'outline' }, icon('external-link'), 'Abrir'),
  button({ size: 'sm', variant: 'soft', color: 'danger' }, icon('trash'), 'Eliminar'),
  iconButton({ label: 'Pesquisar', variant: 'soft', icon: icon('search') }),
)`),

      h2('Tamanho'),
      p(
        'A predefinição é ',
        code('1em'),
        ' — o tamanho do texto à volta. ',
        code('size'),
        ' aceita um token ou qualquer comprimento CSS quando queres afastar-te disso:',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('star', { size: 'sm' }),
  icon('star'),
  icon('star', { size: 'lg' }),
  icon('star', { size: '2rem' }),
  icon('star', { size: '3rem' }),
)`),

      h2('Cor'),
      p(
        'Não há prop de cor. Um ícone é desenhado a ',
        code('currentColor'),
        ', por isso toma a cor do seu contexto — é isso que faz um só conjunto funcionar dentro de cinco paletas:',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  text({ style: 'color: var(--su-primary)' }, icon('heart', { size: 'lg' })),
  text({ style: 'color: var(--su-success)' }, icon('check-circle', { size: 'lg' })),
  text({ style: 'color: var(--su-warning)' }, icon('alert-triangle', { size: 'lg' })),
  text({ style: 'color: var(--su-danger)' }, icon('x-circle', { size: 'lg' })),
  text({ tone: 'muted' }, icon('info', { size: 'lg' })),
)`),

      h2('Nomes acessíveis'),
      p(
        'Um ícone leva ',
        code('aria-hidden'),
        ' por predefinição, o que está certo muito mais vezes do que não: um ícone ao lado da palavra «Eliminar» não deve ser anunciado uma segunda vez. Dá-lhe um ',
        code('label'),
        ' só quando for o ícone a carregar todo o significado — aí passa a ',
        code('role="img"'),
        ' com esse nome.',
      ),
      codeBlock('', `icon('trash')                        // decorativo — escondido
button(icon('trash'), 'Eliminar')    // é a palavra que fala

icon('trash', { label: 'Eliminar' }) // anunciado como imagem

// Um botão só de ícone dá nome ao botão, não ao símbolo lá dentro
iconButton({ label: 'Eliminar', icon: icon('trash') })`, 'javascript'),

      h2('Preenchido'),
      p(
        code('filled'),
        ' pinta um símbolo em vez de o contornar. É o mesmo traçado em qualquer dos casos — só muda o atributo ',
        code('fill'),
        ' — por isso as duas formas partilham exatamente a mesma aresta exterior e não podem divergir.',
      ),
      demo(fillDemo()),
      p('E os mesmos nomes, preenchidos:'),
      demo(fillDemo({ filled: true })),
      p(
        'É uma prop e não um segundo conjunto de nomes porque o estado preenchido é quase sempre um ',
        code('estado'),
        ' — guardado, com gosto, avaliado — e por isso quer um booleano, não uma cadeia diferente:',
      ),
      codeBlock('', `icon('heart', { filled: liked })
icon('bookmark', { filled: saved, label: saved ? 'Guardado' : 'Guardar' })

// em vez de
icon(liked ? 'heart-filled' : 'heart')`, 'javascript'),
      p(
        'Os símbolos de estado preenchem-se de outra maneira, porque a marca deles fica ',
        code('dentro'),
        ' da forma. Pintar o círculo engoliria o visto, por isso a marca é recortada dele:',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('check-circle', { filled: true, size: 'lg' }),
  icon('x-circle', { filled: true, size: 'lg' }),
  icon('info', { filled: true, size: 'lg' }),
  icon('help', { filled: true, size: 'lg' }),
  icon('alert-triangle', { filled: true, size: 'lg' }),
)`),
      p(
        'Esses trazem um segundo desenho — a forma cheia com a marca recortada por ',
        code('fill-rule: evenodd'),
        ' — porque um recorte assim não se consegue do traçado de contorno mudando um atributo. A forma exterior é desenhada na aresta exterior do contorno, por isso as duas versões acabam na mesma silhueta. É a mesma prop em qualquer dos casos; que mecanismo cada símbolo usa é problema dele.',
      ),
      p(
        'Um chevron não tem interior nenhum para pintar — é uma linha aberta — por isso preenche até ao triângulo que os seus três pontos descrevem, mantendo o traço que arredonda os cantos:',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('chevron-up', { filled: true, size: 'lg' }),
  icon('chevron-down', { filled: true, size: 'lg' }),
  icon('chevron-left', { filled: true, size: 'lg' }),
  icon('chevron-right', { filled: true, size: 'lg' }),
)`),
      p(
        code('fillableIcons()'),
        ' lista tudo o que responde a ',
        code('filled'),
        '. Um símbolo sem forma preenchida ignora-o e fica em contorno — preencher ',
        code('eye'),
        ' perderia a pupila e ',
        code('tag'),
        ' o seu furo, por isso nenhum deles finge.',
      ),

      h2('Rodar'),
      p(
        code('spin'),
        ' faz o símbolo rodar — pensado para ',
        code('spinner'),
        ', embora nada te impeça de rodar ',
        code('refresh'),
        ' enquanto algo recarrega. Com ',
        code('prefers-reduced-motion'),
        ' abranda até quase parar em vez de parar, porque um indicador parado parece avariado.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('spinner', { spin: true, size: 'lg' }),
  icon('refresh', { spin: true, size: 'lg' }),
  button({ variant: 'soft' }, icon('spinner', { spin: true }), 'A guardar…'),
)`),

      h2('O conjunto'),
      p(
        'Os nomes descrevem o desenho e não a função que ele cumpre — ',
        code('x-circle'),
        ', não ',
        code('error'),
        ' — porque o mesmo desenho serve funções sem relação entre si, e um nome que descreve a imagem continua verdadeiro quando isso acontece. Os aliases abaixo cobrem as intenções comuns.',
      ),
      gallery(),

      h2('Marcas'),
      p(
        'Vêm oito marcas com o conjunto — ',
        code('facebook'),
        ', ',
        code('google'),
        ', ',
        code('instagram'),
        ', ',
        code('linkedin'),
        ', ',
        code('tiktok'),
        ', ',
        code('whatsapp'),
        ', ',
        code('x-twitter'),
        ' e ',
        code('youtube'),
        '. Continuam a aceitar ',
        code('size'),
        ' e ',
        code('label'),
        ' e a desenhar-se a ',
        code('currentColor'),
        ':',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center', wrap: true },
  icon('facebook', { size: 'lg' }),
  icon('instagram', { size: 'lg' }),
  icon('x-twitter', { size: 'lg' }),
  icon('youtube', { size: 'lg' }),
  icon('whatsapp', { size: 'lg' }),
  button({ variant: 'soft', color: 'neutral' }, icon('linkedin'), 'Partilhar'),
)`),
      p(
        'São reproduções de marcas de outros e não desenhos ao estilo desta biblioteca, por isso quebram de propósito duas das suas regras: são formas cheias em vez de traços, que é o que um logótipo é, e as proporções são as da marca e não as desta grelha. ',
        code('filled'),
        ' não lhes diz nada — já o são.',
      ),
      p(
        'O desenho vem do Simple Icons, que o publica sob CC0. Isso cobre o desenho, não a marca registada: usa-os para apontar àquilo que nomeiam — uma ligação de perfil, um botão de partilha — e não num produto teu.',
      ),
      p(
        'É ',
        code('x-twitter'),
        ', não ',
        code('x'),
        ', porque ',
        code('x'),
        ' já é alias de ',
        code('close'),
        ' e um botão de fechar a transformar-se num logótipo seria uma surpresa desagradável. ',
        code('twitter'),
        ' também chega lá.',
      ),

      h2('Aliases'),
      p('Cada um destes desenha um símbolo listado acima, com o nome a que é mais provável que recorras:'),
      grid(
        { min: '15rem', gap: 'xs' },
        ...[
          ['success', 'check-circle'],
          ['warning', 'alert-triangle'],
          ['danger, error', 'x-circle'],
          ['x, cross', 'close'],
          ['question', 'help'],
          ['loading', 'spinner'],
          ['cog, gears', 'gear'],
          ['delete, trash-can', 'trash'],
          ['pencil', 'edit'],
          ['notification', 'bell'],
          ['dots', 'more-horizontal'],
          ['bolt, lightning', 'zap'],
          ['arrow-back', 'arrow-left'],
          ['arrow-forward', 'arrow-right'],
          ['cart', 'shopping-cart'],
          ['bag', 'shopping-bag'],
          ['card', 'credit-card'],
          ['cash, money', 'banknote'],
          ['delivery, shipping', 'truck'],
          ['shop', 'store'],
          ['discount, sale', 'percent'],
          ['login, sign-in', 'log-in'],
          ['logout, sign-out', 'log-out'],
          ['map-pin, marker', 'location'],
          ['mobile', 'smartphone'],
          ['like', 'thumbs-up'],
          ['dislike', 'thumbs-down'],
          ['comment, message, chat', 'comment-bubble'],
          ['ai, magic', 'sparkles'],
          ['printer', 'print'],
          ['accessibility, a11y', 'universal-access'],
          ['twitter', 'x-twitter'],
        ].map(([alias, target]) =>
          text({ variant: 'small' }, code(alias), ' → ', code(target)),
        ),
      ),

      h2('Os teus próprios ícones'),
      p(
        code('registerIcons()'),
        ' acrescenta um símbolo, ou substitui um que já vem. A marcação é o conteúdo do ',
        code('<svg>'),
        ' — formas na mesma grelha de 24×24, deixadas sem preenchimento para que o ',
        code('currentColor'),
        ' lhes chegue. Chama-o uma vez a partir de um módulo que as tuas páginas importem:',
      ),
      codeBlock('src/lib/icons.js', `import { registerIcons } from 'sitelo/ui'

registerIcons({
  logo: '<path d="M4 20 12 4l8 16z"/>',
  // Um nome que já existe substitui-o em todo o lado, e é assim que se
  // reestiliza um ícone incluído sem fazer fork da biblioteca.
  check: '<path d="m5 13 4 4 10-11"/>',
  // Uma forma fechada, para poder responder a \`filled\` como os incluídos.
  pin: { markup: '<path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"/>', fillable: true },
})`, 'javascript'),
      codeBlock('', `import { icon } from 'sitelo/ui'

icon('logo')                   // o teu símbolo
icon('check')                  // agora também teu

registerIcons({ check: null }) // e de volta ao incluído`, 'javascript'),

      h2('Porquê inline, e não um sprite'),
      p(
        'Os ícones são desenhados na página em vez de puxados de um ',
        code('icons.svg'),
        ' com ',
        code('<use>'),
        '. Um sprite poupa qualquer coisa como uma centena de bytes gzipados de HTML por página e custa uma ida e volta à rede para isso — marcação repetida é justamente o caso em que o gzip é melhor, por isso quase tudo o que um sprite existe para desduplicar já foi desduplicado. Inline significa ainda que não há ficheiro para emitir, nem caminho base para configurar, nem nada que possa faltar em ',
        code('dist'),
        ' — a mesma troca que o ',
        code('styles({ inline: true })'),
        ' faz.',
      ),

      h2('Props'),
      propsTable([
        ['name', 'string', '', 'Que símbolo. Pode ser passado como primeiro argumento em vez disso.'],
        ['size', "'sm' | 'md' | 'lg' | string", "'md'", 'Um token, ou qualquer comprimento CSS. A predefinição é 1em.'],
        ['label', 'string', '', 'Anunciá-lo como imagem com este nome, em vez de o esconder.'],
        ['spin', 'boolean', 'false', 'Fazê-lo rodar continuamente.'],
        ['filled', 'boolean', 'false', 'Pintar o símbolo em vez de o contornar. Ignorado pelos que não podem ser preenchidos.'],
      ]),
      p(
        'Um nome desconhecido não desenha nada em vez de lançar um erro — uma prop cosmética não devia poder falhar uma construção. ',
        code('hasIcon(name)'),
        ' diz-te se existe algum, ',
        code('iconNames()'),
        ' lista-os todos, e ',
        code('fillableIcons()'),
        ' dá os que aceitam ',
        code('filled'),
        '.',
      ),
    ],
  })
