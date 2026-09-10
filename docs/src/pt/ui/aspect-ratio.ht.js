import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'

export default () =>
  uiLayout({
    title: 'Proporção',
    description:
      'Mantém uma caixa com uma forma fixa, para que nada na página se mexa quando o conteúdo carrega.',
    activeHref: '/pt/ui/aspect-ratio',
    children: [
      p(
        'A altura é conhecida a partir da largura antes de algo ter carregado, por isso uma imagem ou uma incorporação que chegue tarde não empurra o resto da página para baixo. O filho preenche a caixa e é recortado em vez de ficar com barras.',
      ),

      h2('Proporção básica'),
      demo(`aspectRatio({ ratio: '16 / 9', style: 'background: var(--su-surface-2)' },
  '<img src="/logo.svg" alt="" style="object-fit: contain; padding: 2rem">',
)`, { align: 'stretch' }),

      h2('Proporções comuns'),
      demo(`grid({ min: '9rem' },
  ...['16 / 9', '4 / 3', '1 / 1', '3 / 4'].map((ratio) =>
    stack({ gap: 'xs' },
      aspectRatio({ ratio, style: 'background: var(--su-surface-2); border-radius: 0.5rem' },
        '<img src="/logo.svg" alt="" style="object-fit: contain; padding: 1rem">'),
      text({ variant: 'caption', tone: 'muted', align: 'center' }, ratio),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Incorporações'),
      p(
        'A razão de ser deste componente: um ',
        code('<iframe>'),
        ' não tem tamanho intrínseco, por isso sem uma proporção colapsa ou exige uma altura fixa à mão.',
      ),
      demo(`aspectRatio({ ratio: '16 / 9', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
  '<div style="display: grid; place-items: center; color: var(--su-text-subtle)">aqui entraria um &lt;iframe&gt;</div>',
)`, { align: 'stretch' }),

      h2('Num cartão'),
      p(
        code('cardMedia()'),
        ' já faz isto no topo de um cartão. Usa ',
        code('aspectRatio()'),
        ' quando a caixa estiver noutro sítio.',
      ),
      demo(`grid({ min: '12rem' },
  card(
    cardMedia({ src: '/logo.svg', alt: '', style: 'background: var(--su-surface-2); object-fit: contain; padding: 1rem' }),
    cardBody(text({ variant: 'small' }, 'cardMedia — já vem feito')),
  ),
  card(
    cardBody(
      stack({ gap: 'sm' },
        aspectRatio({ ratio: '1 / 1', style: 'background: var(--su-surface-2); border-radius: 0.5rem' },
          '<img src="/logo.svg" alt="" style="object-fit: contain; padding: 1rem">'),
        text({ variant: 'small' }, 'aspectRatio — em qualquer outro sítio'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Recorte'),
      p(
        'O filho é esticado para preencher e recortado com ',
        code('object-fit: cover'),
        '. Para algo que não pode ser recortado — um logótipo, um diagrama — define ',
        code('object-fit: contain'),
        ' no filho, como faz cada demonstração desta página.',
      ),

      h2('Props'),
      propsTable([
        ['ratio', 'string', "'16 / 9'", 'Qualquer valor CSS de aspect-ratio.'],
        ['as', 'string', "'div'", 'Elemento a renderizar.'],
      ]),
    ],
  })
