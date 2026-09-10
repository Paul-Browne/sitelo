import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'

export default () =>
  uiLayout({
    title: 'Esqueleto',
    description:
      'Um marcador de lugar com a forma do conteúdo que ainda não chegou.',
    activeHref: '/pt/ui/skeleton',
    children: [
      p(
        'Um esqueleto ocupa o lugar do conteúdo enquanto este carrega. Num site estático isso é mais raro do que numa aplicação — o HTML já lá está — mas é normalmente o que o ',
        code('fallback'),
        ' de uma ilha deve ser, e o que uma zona renderizada no cliente mostra antes de os dados chegarem.',
      ),
      p(
        'Os esqueletos são decorativos: cada um leva ',
        code('aria-hidden'),
        ', para que um leitor de ecrã não leia uma lista de caixas vazias.',
      ),

      h2('Formas'),
      demo(`stack({ gap: 'md' },
  skeleton({ height: '2.5rem' }),
  skeleton({ variant: 'text', width: '70%' }),
  skeleton({ variant: 'circle', width: '3rem', height: '3rem' }),
)`, { align: 'stretch' }),

      h2('Texto'),
      p(
        code('lines'),
        ' desenha o equivalente a um parágrafo, com a última linha curta para se ler como texto corrido e não como um bloco.',
      ),
      demo(`stack({ gap: 'lg' },
  skeleton({ lines: 2 }),
  skeleton({ lines: 4 }),
)`, { align: 'stretch' }),

      h2('Com a forma da coisa real'),
      p(
        'Um esqueleto é mais convincente quando acompanha a disposição que substitui — o mesmo cartão, as mesmas linhas, os mesmos tamanhos.',
      ),
      demo(`grid({ min: '14rem' },
  card(
    cardBody(
      stack({ gap: 'md' },
        stack({ direction: 'row', gap: 'sm', align: 'center' },
          skeleton({ variant: 'circle', width: '2.5rem', height: '2.5rem' }),
          stack({ gap: 'xs', style: 'flex: 1' },
            skeleton({ variant: 'text', width: '60%' }),
            skeleton({ variant: 'text', width: '40%' }),
          ),
        ),
        skeleton({ lines: 3 }),
      ),
    ),
  ),
  card(
    cardBody(
      stack({ direction: 'row', gap: 'sm', align: 'center' },
        avatar({ name: 'Ada Lovelace' }),
        stack({ gap: 'none' },
          text({ variant: 'small' }, 'Ada Lovelace'),
          text({ variant: 'caption', tone: 'muted' }, 'Enviou 3 commits'),
        ),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Como recurso de uma ilha'),
      p(
        'Uma ilha de servidor envia o seu conteúdo de recurso no HTML estático e troca-o pelo fragmento renderizado no momento do pedido. Um esqueleto com a mesma forma do fragmento evita que a página salte quando ele chega.',
      ),
      demo(`card(
  cardHeader({ title: 'Comentários' }),
  cardBody(
    stack({ gap: 'md' },
      skeleton({ lines: 2 }),
      divider({ spacing: 'xs' }),
      skeleton({ lines: 2 }),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Movimento'),
      p(
        'O brilho pára para quem pediu ao sistema para reduzir o movimento — isso é tratado na folha de estilos, sem prop nenhuma para definir.',
      ),

      h2('Props'),
      propsTable([
        ['variant', "'rect' | 'text' | 'circle'", "'rect'", 'A forma do marcador de lugar.'],
        ['width', 'string', '', 'Qualquer largura CSS.'],
        ['height', 'string', '', 'Qualquer altura CSS.'],
        ['lines', 'number', '', 'Desenhar este número de linhas de texto, a última curta.'],
      ]),
    ],
  })
