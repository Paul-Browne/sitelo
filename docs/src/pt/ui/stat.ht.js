import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Estatística',
    description:
      'Um número que vale a pena olhar, com o que significa e para que lado se mexeu.',
    activeHref: '/pt/ui/stat',
    extraHead: uiHead(),
    children: [
      p(
        'Uma estatística é uma etiqueta, um valor e, opcionalmente, uma variação. O ',
        code('statGroup()'),
        ' junta várias numa só superfície, com divisórias entre elas.',
      ),

      h2('Estatística básica'),
      demo(`statGroup(
  stat({ label: 'Páginas', value: '204' }),
  stat({ label: 'Tempo de construção', value: '1,1 s' }),
  stat({ label: 'JS no cliente', value: '3,3 kB' }),
)`, { align: 'stretch' }),

      h2('Com variação'),
      p(
        'A variação tira a cor do ',
        code('color'),
        ' — verde para um número que foi no bom sentido, vermelho para um que não. Não te fies só na cor: mantém o sinal ou a palavra.',
      ),
      demo(`statGroup(
  stat({ label: 'Páginas', value: '204', change: '+8 esta semana', color: 'success' }),
  stat({ label: 'Tempo de construção', value: '1,1 s', change: '−0,3 s', color: 'success' }),
  stat({ label: 'Bundle', value: '9,9 kB', change: '+1,2 kB', color: 'danger' }),
)`, { align: 'stretch' }),

      h2('Com ícones'),
      demo(`statGroup(
  stat({
    label: 'Publicações',
    value: '128',
    color: 'primary',
    icon: icon('zap'),
  }),
  stat({
    label: 'Contribuidores',
    value: '17',
    color: 'primary',
    icon: icon('user'),
  }),
)`, { align: 'stretch' }),

      h2('Texto de ajuda'),
      demo(`statGroup(
  stat({
    label: 'Lighthouse',
    value: '100',
    change: 'acessibilidade',
    color: 'success',
    help: 'Medido em todas as páginas em inglês na CI.',
  }),
  stat({
    label: 'Índice Pagefind',
    value: '204',
    help: 'Reconstruído no fim de cada construção.',
  }),
)`, { align: 'stretch' }),

      h2('Sozinha'),
      p('Uma estatística isolada não precisa de grupo — apenas não tem superfície própria.'),
      demo(`card(
  cardBody(stat({ label: 'Total de páginas', value: '204', change: '+8', color: 'success' })),
)`, { align: 'stretch' }),

      h2('Colunas fixas'),
      p(
        'As estatísticas ajustam-se sozinhas por predefinição. O ',
        code('columns'),
        ' fixa a contagem quando os números devem ficar numa só linha.',
      ),
      demo(`statGroup({ columns: 'repeat(2, 1fr)' },
  stat({ label: 'A passar', value: '215', color: 'success' }),
  stat({ label: 'A falhar', value: '0', color: 'success' }),
)`, { align: 'stretch' }),

      h2('A partir de dados'),
      demo(`return (() => {
  const report = [
    { label: 'Páginas', value: 204 },
    { label: 'Recursos', value: 208 },
    { label: 'Total', value: '9,7 MB' },
  ]

  return statGroup(
    report.map((entry) => stat({ label: entry.label, value: String(entry.value) })),
  )
})()`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['label', 'Child', '', 'O que o número conta.'],
        ['value', 'Child', '', 'O número em si, composto em algarismos tabulares.'],
        ['change', 'Child', '', 'Uma variação, colorida pelo color.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", '', 'Colore a variação e o ícone.'],
        ['icon', 'Child', '', 'Símbolo decorativo por cima da etiqueta.'],
        ['help', 'Child', '', 'Uma linha mais discreta por baixo de tudo o resto.'],
      ]),
      p(code('statGroup()'), ' aceita ', code('columns'), ' — qualquer valor de ', code('grid-template-columns'), '.'),
    ],
  })
