import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Grupo de opções',
    description:
      'Uma escolha entre várias, com inputs de rádio a sério a partilhar um name — com legenda e papel de grupo.',
    activeHref: '/pt/ui/radio',
    extraHead: uiHead(),
    children: [
      p(
        'Os rádios servem para escolher exatamente uma opção de um conjunto pequeno e visível. O ',
        code('radio()'),
        ' desenha um; o ',
        code('choiceGroup()'),
        ' constrói o conjunto todo a partir de um array e dá-lhe a legenda e o ',
        code('role="radiogroup"'),
        ' que fazem dele um grupo em vez de uma pilha de inputs.',
      ),
      p(
        'Partilham um ',
        code('name'),
        ', por isso o navegador trata da exclusividade mútua e da navegação com as setas entre eles. Nada aqui envia um script.',
      ),

      h2('Grupo básico'),
      demo(`choiceGroup({
  legend: 'Plano',
  name: 'plan',
  value: 'pro',
  options: [
    { value: 'free', label: 'Grátis' },
    { value: 'pro', label: 'Pro' },
    { value: 'team', label: 'Equipa' },
  ],
})`, { align: 'stretch' }),

      h2('Em linha'),
      p(
        'Etiquetas curtas leem-se melhor numa só linha. As longas devem ficar empilhadas, que é a predefinição.',
      ),
      demo(`choiceGroup({
  legend: 'Formato',
  name: 'form-factor',
  direction: 'row',
  value: 'desktop',
  options: ['desktop', 'mobile'],
})`, { align: 'stretch' }),

      h2('Cadeias simples'),
      p(
        'Quando o valor e a etiqueta são iguais, passa cadeias.',
      ),
      demo(`choiceGroup({
  legend: 'Nível de registo',
  name: 'log-level',
  direction: 'row',
  value: 'warn',
  options: ['info', 'warn', 'error', 'silent'],
})`, { align: 'stretch' }),

      h2('Opções desativadas'),
      demo(`choiceGroup({
  legend: 'Renderização',
  name: 'renderer',
  value: 'static',
  options: [
    { value: 'static', label: 'Estática' },
    { value: 'islands', label: 'Ilhas de servidor' },
    { value: 'ssr', label: 'SSR completo', disabled: true },
  ],
  help: 'O SSR completo precisa de um alojamento Node, que este projeto não tem.',
})`, { align: 'stretch' }),

      h2('Um de cada vez'),
      p(
        'Usa o ',
        code('radio()'),
        ' diretamente quando as opções não forem suficientemente uniformes para virem de um array — por exemplo, quando cada uma traz a sua própria descrição.',
      ),
      demo(`stack({ gap: 'md' },
  radio({ name: 'deploy', value: 'push', label: 'A cada push', checked: true }),
  radio({ name: 'deploy', value: 'tag', label: 'Só em versões com tag' }),
  radio({ name: 'deploy', value: 'manual', label: 'Manualmente' }),
)`, { align: 'stretch' }),

      h2('Cores'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  radio({ label: 'Primary', name: 'c1', checked: true, color: 'primary' }),
  radio({ label: 'Neutral', name: 'c2', checked: true, color: 'neutral' }),
  radio({ label: 'Success', name: 'c3', checked: true, color: 'success' }),
  radio({ label: 'Warning', name: 'c4', checked: true, color: 'warning' }),
  radio({ label: 'Danger', name: 'c5', checked: true, color: 'danger' }),
)`),

      h2('Num cartão'),
      demo(`card(
  cardHeader({ title: 'Definições de construção', subtitle: 'Aplicadas na próxima publicação' }),
  cardBody(
    stack({ gap: 'lg' },
      choiceGroup({
        legend: 'URLs limpos',
        name: 'clean-urls',
        direction: 'row',
        value: 'on',
        options: [
          { value: 'on', label: 'Ligados' },
          { value: 'off', label: 'Desligados' },
        ],
      }),
      choiceGroup({
        legend: 'Imagens',
        name: 'images',
        value: 'optimise',
        options: [
          { value: 'optimise', label: 'Redimensionar e converter' },
          { value: 'copy', label: 'Copiar tal como estão' },
        ],
      }),
    ),
  ),
  cardFooter({ divided: true, style: 'justify-content: flex-end' },
    button({ type: 'submit' }, 'Guardar'),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      p(code('choiceGroup()'), ':'),
      propsTable([
        ['legend', 'Child', '', 'Etiqueta do grupo inteiro.'],
        ['name', 'string', '', 'Nome de formulário partilhado — é o que torna os rádios exclusivos.'],
        ['options', 'Array', '[]', 'Cadeias, ou objetos { value, label, disabled }.'],
        ['value', 'string | number | Array', '', 'Que opção está selecionada. Um array para caixas de seleção.'],
        ['type', "'radio' | 'checkbox'", "'radio'", 'Que controlo construir. Também escolhe o papel do grupo.'],
        ['direction', "'row' | 'column'", "'column'", 'Como as opções são dispostas.'],
        ['help', 'Child', '', 'Dica por baixo do grupo.'],
      ]),
      p(code('radio()'), ' aceita as mesmas props que o ', code('checkbox()'), ': ', code('label'), ', ', code('color'), ', ', code('checked'), ', ', code('name'), ', ', code('value'), ' e ', code('disabled'), '.'),
    ],
  })
