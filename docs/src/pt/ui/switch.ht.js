import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Interruptor',
    description:
      'Uma alternância ligado/desligado para uma definição que faz efeito de imediato — por baixo, uma caixa de seleção com role="switch".',
    activeHref: '/pt/ui/switch',
    extraHead: uiHead(),
    children: [
      p(
        'Um interruptor serve para uma definição que se aplica assim que é mexida. Uma caixa de seleção serve para uma escolha que confirmas mais tarde, com um botão de submissão. Se o teu controlo está num formulário com um Guardar em baixo, é uma caixa de seleção.',
      ),
      p(
        'O componente chama-se ',
        code('toggle()'),
        ' e não ',
        code('switch()'),
        ' por uma razão aborrecida mas incontornável: ',
        code('switch'),
        ' é uma palavra reservada e não pode ser um nome de importação. Por baixo é um ',
        code('<input type="checkbox">'),
        ' a sério, com ',
        code('role="switch"'),
        '.',
      ),

      h2('Interruptor básico'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  toggle({ label: 'Site público', name: 'public' }),
  toggle({ label: 'Ligado', name: 'on', checked: true }),
)`),

      h2('Cores'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  toggle({ label: 'Primary', checked: true, color: 'primary' }),
  toggle({ label: 'Neutral', checked: true, color: 'neutral' }),
  toggle({ label: 'Success', checked: true, color: 'success' }),
  toggle({ label: 'Warning', checked: true, color: 'warning' }),
  toggle({ label: 'Danger', checked: true, color: 'danger' }),
)`),

      h2('Desativado'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  toggle({ label: 'Desligado e bloqueado', disabled: true }),
  toggle({ label: 'Ligado e bloqueado', checked: true, disabled: true }),
)`),

      h2('Sem etiqueta'),
      p(
        'Um interruptor sem etiqueta visível continua a precisar de um nome acessível. Passa ',
        code('aria-label'),
        ' — cai no input.',
      ),
      demo(`toggle({ 'aria-label': 'Ativar a pesquisa Pagefind', checked: true })`),

      h2('Uma lista de definições'),
      p(
        'A forma habitual: a etiqueta à esquerda, o interruptor à direita, uma linha por definição.',
      ),
      demo(`return list(
  [
    ['Pesquisa Pagefind', 'Indexa todas as páginas no fim da construção.', true],
    ['Otimização de imagens', 'Redimensiona e converte imagens na construção. Precisa do sharp.', true],
    ['Ilhas de servidor', 'Renderiza as zonas marcadas no momento do pedido.', false],
  ].map(([name, description, on]) =>
    listItem({
      title: name,
      description,
      end: toggle({ 'aria-label': name, checked: on }),
    }),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['label', 'Child', '', 'Texto ao lado do interruptor. Usa aria-label quando não houver nenhum.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Cor da calha quando ligado.'],
        ['checked', 'boolean', 'false', 'Se começa ligado.'],
        ['name', 'string', '', 'Nome do campo do formulário.'],
        ['disabled', 'boolean', 'false', 'Desativa o input e esbate a linha.'],
      ]),
      p(
        'Tudo o resto cai no ',
        code('<input>'),
        ', que é onde ',
        code('onchange'),
        ' e ',
        code('aria-*'),
        ' pertencem.',
      ),
    ],
  })
