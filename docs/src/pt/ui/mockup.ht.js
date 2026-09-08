import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Mockup',
    description:
      'Uma captura de ecrã dentro de uma moldura — navegador, janela, telemóvel ou terminal.',
    activeHref: '/pt/ui/mockup',
    extraHead: uiHead(),
    children: [
      p(
        'Para mostrar um produto numa página de entrada ou uma captura na documentação. A moldura é decoração: os pontos, a barra de endereço e o entalhe levam todos ',
        code('aria-hidden'),
        ', por isso um leitor de ecrã recebe o que está lá dentro e não uma descrição da moldura.',
      ),

      h2('Navegador'),
      demo(`mockup({ variant: 'browser', url: 'sitelo.dev' },
  div({ style: 'padding: 1.5rem; background: var(--su-surface-2)' },
    stack({ gap: 'sm' },
      text({ variant: 'h5', as: 'div' }, 'Olá mundo'),
      text({ variant: 'small', tone: 'muted' }, 'Renderizado na construção, servido como ficheiro estático.'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Janela'),
      p('A mesma moldura sem barra de endereço, para tudo o que não seja uma página web.'),
      demo(`mockup({ variant: 'window' },
  div({ style: 'padding: 1.5rem' },
    text({ variant: 'small' }, 'Uma janela sem URL.'),
  ),
)`, { align: 'stretch' }),

      h2('Semáforos'),
      p(
        'Os botões seguem o tema por predefinição. ',
        code("dots: 'mac'"),
        ' pinta-os antes com o vermelho, amarelo e verde do macOS — os mesmos três em qualquer tema, já que a graça deles é serem reconhecíveis.',
      ),
      demo(`mockup({ variant: 'browser', url: 'sitelo.dev', dots: 'mac' },
  div({ style: 'padding: 1.5rem' },
    text({ variant: 'small' }, 'Uma janela que já viste antes.'),
  ),
)`, { align: 'stretch' }),

      h2('Terminal'),
      p(
        'A variante ',
        code('code'),
        ' é escura nos dois temas, como um terminal é.',
      ),
      demo(`mockup({ variant: 'code' },
  '<div>$ npm install -D sitelo</div>' +
  '<div>$ npx sitelo build</div>' +
  '<div style="opacity: .7">✓ construído em 1,09 s</div>' +
  '<div style="opacity: .7">  204 páginas · 9,7 MB</div>',
)`, { align: 'stretch' }),

      h2('Telemóvel'),
      p(
        'Um aparelho atual: uma Dynamic Island a flutuar afastada da moldura, em vez de um entalhe cortado nela. Deixa-lhe espaço no topo do ecrã.',
      ),
      demo(`mockup({ variant: 'phone' },
  div({ style: 'padding: 3rem 1rem 1rem' },
    stack({ gap: 'md' },
      text({ variant: 'h6', as: 'div' }, 'sitelo'),
      text({ variant: 'caption', tone: 'muted' }, 'Sites estáticos, sem framework.'),
      button({ size: 'sm', block: true }, 'Começar'),
    ),
  ),
)`),

      h2('Moldura e ilha'),
      p(
        code('frame'),
        ' tinge a calha exterior — qualquer cor CSS, por isso um acabamento de aparelho é um hexadecimal e não um nome de que esta biblioteca teria de manter uma lista. ',
        code('notch: false'),
        ' deixa a ilha de fora para o que não a tem.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', wrap: true },
  mockup({ variant: 'phone', size: 'sm', frame: '#a8674a' }, ''),
  mockup({ variant: 'phone', size: 'sm', frame: '#2c3644' }, ''),
  mockup({ variant: 'phone', size: 'sm', frame: '#c9ced4', notch: false }, ''),
)`, { align: 'stretch' }),

      h2('Com uma captura'),
      p(
        'Uma ',
        code('<img>'),
        ' dentro do corpo preenche a largura da moldura. Junta-lhe ',
        code('aspectRatio()'),
        ' se a imagem carregar tarde e a página não puder saltar.',
      ),
      demo(`mockup({ variant: 'browser', url: 'sitelo.dev/ui' },
  aspectRatio({ ratio: '16 / 9', style: 'background: var(--su-surface-2)' },
    '<img src="/logo.svg" alt="A galeria do sitelo UI" style="object-fit: contain; padding: 3rem">',
  ),
)`, { align: 'stretch' }),

      h2('Tamanhos'),
      p(
        'Um mockup preenche o contentor por predefinição. ',
        code('size'),
        ' prende-o antes a uma largura fixa. O telemóvel tem os seus três — 22rem de telemóvel seria um tablet — e mantém as proporções em todos eles: os cantos, a calha e a ilha são frações da largura e não comprimentos fixos.',
      ),
      demo(`stack({ gap: 'md', align: 'flex-start' },
  mockup({ variant: 'window', size: 'sm' }, div({ style: 'padding: 1rem' }, text({ variant: 'small' }, 'size: sm'))),
  mockup({ variant: 'window' }, div({ style: 'padding: 1rem' }, text({ variant: 'small' }, 'predefinição — largura total'))),
)`, { align: 'stretch' }),

      h2('Num hero'),
      p(
        'A dupla para a qual isto existe: passa um mockup como ',
        code('media'),
        ' de um hero.',
      ),
      demo(`hero({
  level: 2,
  align: 'start',
  title: 'Vê a coisa a andar',
  description: 'HTML estático quando chega ao navegador.',
  media: mockup({ variant: 'browser', url: 'example.com' },
    div({ style: 'padding: 1.25rem; background: var(--su-surface-2)' },
      text({ variant: 'small' }, 'Uma página, emoldurada.'),
    ),
  ),
}, button('Começar'))`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['variant', "'browser' | 'window' | 'phone' | 'code'", "'browser'", 'Que moldura desenhar.'],
        ['url', 'string', '', 'Mostrado na barra de endereço. Só na variante browser.'],
        ['dots', "'mono' | 'mac'", "'mono'", 'O aspeto dos três botões.'],
        ['frame', 'string', '', 'Tinge a calha exterior. Qualquer cor CSS. Só no telemóvel.'],
        ['notch', 'boolean', 'true', 'Desenhar a Dynamic Island. Só no telemóvel.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Largura fixa. O médio preenche o contentor.'],
      ]),
    ],
  })
