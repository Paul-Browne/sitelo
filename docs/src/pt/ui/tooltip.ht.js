import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Dica',
    description:
      'Uma indicação curta ao passar o rato e ao receber foco, desenhada inteiramente em CSS.',
    activeHref: '/pt/ui/tooltip',
    extraHead: uiHead(),
    children: [
      p(
        'O texto da dica vive num atributo de dados e é desenhado por um pseudo-elemento, por isso não há script, nada para posicionar em tempo de execução e nada que fique para trás no DOM. Aparece ao passar o rato e ao receber foco pelo teclado, do que trata a metade ',
        code(':focus-within'),
        ' da regra.',
      ),

      h2('Dica básica'),
      demo(`stack({ direction: 'row', gap: 'md' },
  tooltip({ content: 'Copiar para a área de transferência' },
    iconButton({
      label: 'Copiar',
      variant: 'soft',
      color: 'neutral',
      icon: icon('copy'),
    }),
  ),
  tooltip({ content: 'Reconstruir o site' },
    button({ variant: 'outline', color: 'neutral' }, 'Reconstruir'),
  ),
)`),

      h2('Posicionamento'),
      p('Por cima por predefinição, por baixo quando não há espaço em cima.'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  tooltip({ content: 'Por cima do acionador' },
    button({ variant: 'soft', color: 'neutral' }, 'Cima'),
  ),
  tooltip({ content: 'Por baixo do acionador', placement: 'bottom' },
    button({ variant: 'soft', color: 'neutral' }, 'Baixo'),
  ),
)`),

      h2('Nomes acessíveis'),
      p(
        'O texto da dica é decoração — é desenhado a partir do ',
        code('content'),
        ' do CSS, que os leitores de ecrã não anunciam de forma fiável. O controlo lá dentro continua a precisar do seu próprio nome acessível, que é o que o ',
        code('label'),
        ' do ',
        code('iconButton()'),
        ' dá. Quando a dica disser algo que o nome do controlo não diz, passa ',
        code('label: true'),
        ' para o repetir num span escondido visualmente.',
      ),
      demo(`stack({ direction: 'row', gap: 'lg' },
  tooltip({ content: 'Publica em produção imediatamente', label: true },
    button({ color: 'danger' }, 'Publicar'),
  ),
)`),

      h2('Sobre texto'),
      p('Uma dica envolve conteúdo inline com a mesma facilidade com que envolve um botão.'),
      demo(`text(
  'A construção escreve em ',
  tooltip({ content: 'Configurável com outDir' }, code('dist/')),
  ' e mais nada.',
)`, { align: 'stretch' }),

      h2('Quando não usar'),
      p(
        'As dicas não aparecem no toque, e desvanecem-se assim que o ponteiro sai. Tudo o que o leitor tem mesmo de ver — uma mensagem de erro, a explicação de um campo obrigatório — pertence ao texto de ',
        code('help'),
        ' do próprio campo, não a uma dica.',
      ),

      h2('Props'),
      propsTable([
        ['content', 'string', '', 'O texto da indicação.'],
        ['placement', "'top' | 'bottom'", "'top'", 'De que lado do acionador aparece.'],
        ['label', 'boolean', 'false', 'Expor também o texto aos leitores de ecrã, num span escondido.'],
      ]),
    ],
  })
