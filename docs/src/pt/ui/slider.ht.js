import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/pt.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Cursor',
    description:
      'Um input range nativo, estilizado a condizer com os outros controlos.',
    activeHref: '/pt/ui/slider',
    extraHead: uiHead(),
    children: [
      p(
        'Isto é um ',
        code('<input type="range">'),
        ' a sério — as setas, o Home e o End, e o anúncio correto vêm todos do navegador. Só a calha e o puxador é que são estilizados.',
      ),

      h2('Cursor básico'),
      demo(`sliderField({ label: 'Qualidade', name: 'quality', value: 70 })`, { align: 'stretch' }),

      h2('Intervalo e passo'),
      demo(`stack({ gap: 'lg' },
  sliderField({ label: 'Volume', name: 'volume', min: 0, max: 100, value: 40 }),
  sliderField({ label: 'Colunas', name: 'columns', min: 1, max: 6, step: 1, value: 3 }),
  sliderField({ label: 'Escala', name: 'scale', min: 0.5, max: 2, step: 0.25, value: 1 }),
)`, { align: 'stretch' }),

      h2('Mostrar o valor'),
      p(
        code('showValue'),
        ' põe um ',
        code('<output>'),
        ' ao lado da calha com o valor com que a página foi construída, e o input vai buscar o seu próprio handler no primeiro arrasto, por isso o número segue o puxador. Não há nada a importar: um número que ficasse desatualizado em silêncio seria pior do que número nenhum, por isso este não fica para ti.',
      ),
      demo(`sliderField({
  label: 'Qualidade da imagem',
  name: 'jpeg-quality',
  min: 40,
  max: 100,
  value: 82,
  showValue: true,
  help: 'Mais alto é maior e mais lento a construir.',
})`, { align: 'stretch' }),

      h2('Cores'),
      demo(`stack({ gap: 'lg' },
  slider({ value: 70, color: 'primary', 'aria-label': 'Primary' }),
  slider({ value: 55, color: 'success', 'aria-label': 'Success' }),
  slider({ value: 35, color: 'warning', 'aria-label': 'Warning' }),
  slider({ value: 20, color: 'danger', 'aria-label': 'Danger' }),
)`, { align: 'stretch' }),

      h2('Desativado'),
      demo(`sliderField({ label: 'Bloqueado', name: 'locked', value: 50, disabled: true })`, {
        align: 'stretch',
      }),

      h2('Sem etiqueta'),
      p(
        'Um ',
        code('slider()'),
        ' nu é o controlo sozinho — dá-lhe um ',
        code('aria-label'),
        ' quando não houver uma etiqueta visível a apontar para ele.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  text({ variant: 'small', tone: 'muted' }, 'Aa'),
  slider({ min: 12, max: 24, value: 16, 'aria-label': 'Tamanho do texto' }),
  text({ tone: 'muted' }, 'Aa'),
)`, { align: 'stretch' }),

      h2('Num formulário'),
      demo(`card(
  cardBody(
    stack({ gap: 'lg' },
      sliderField({ label: 'Largura máxima da imagem', name: 'max-width', min: 640, max: 2560, step: 160, value: 1280, showValue: true }),
      sliderField({ label: 'Qualidade', name: 'q', min: 40, max: 100, value: 82, showValue: true }),
    ),
  ),
  cardFooter({ divided: true, style: 'justify-content: flex-end' },
    button({ type: 'submit' }, 'Guardar'),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['min', 'number | string', '0', 'Limite inferior.'],
        ['max', 'number | string', '100', 'Limite superior.'],
        ['step', 'number | string', '', 'Incremento. Omite-o para a predefinição do navegador, 1.'],
        ['value', 'number | string', '', 'Valor inicial.'],
        ['showValue', 'boolean', 'false', 'Acrescenta um <output> com o valor da construção.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Cor do puxador.'],
        ['name', 'string', '', 'Nome do campo; o id é derivado dele.'],
        ['disabled', 'boolean', 'false', 'Desativa o controlo.'],
      ]),
      p(
        code('sliderField()'),
        ' aceita ainda ',
        code('label'),
        ', ',
        code('help'),
        ', ',
        code('error'),
        ' e ',
        code('required'),
        ' — vê ',
        code('textField()'),
        '.',
      ),
    ],
  })
