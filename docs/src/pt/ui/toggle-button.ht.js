import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/pt.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Botão de alternância',
    description:
      'Um botão que fica carregado — uma definição mostrada como botão em vez de caixa de seleção.',
    activeHref: '/pt/ui/toggle-button',
    extraHead: uiHead(),
    children: [
      p(
        'Um botão de alternância está ligado ou desligado, e di-lo com ',
        code('aria-pressed'),
        '. O negrito num editor de texto, um filtro aplicado, um painel que está à vista.',
      ),
      p(
        'Não há input escondido nem script por trás: numa página estática, um botão de alternância ',
        code('mostra'),
        ' um estado em vez de o mudar. Acrescenta o teu próprio listener, ou usa ',
        code('checkbox()'),
        ' quando pertencer a um formulário e ',
        code('toggle()'),
        ' — o interruptor — quando for uma definição numa lista.',
      ),

      h2('Alternância básica'),
      demo(`stack({ direction: 'row', gap: 'sm' },
  toggleButton({ pressed: true }, 'Negrito'),
  toggleButton('Itálico'),
  toggleButton('Sublinhado'),
)`),

      h2('Variantes'),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm' },
    toggleButton({ variant: 'outline', pressed: true }, 'Outline ligado'),
    toggleButton({ variant: 'outline' }, 'Outline desligado'),
  ),
  stack({ direction: 'row', gap: 'sm' },
    toggleButton({ variant: 'ghost', pressed: true }, 'Ghost ligado'),
    toggleButton({ variant: 'ghost' }, 'Ghost desligado'),
  ),
  stack({ direction: 'row', gap: 'sm' },
    toggleButton({ variant: 'soft', pressed: true }, 'Soft ligado'),
    toggleButton({ variant: 'soft' }, 'Soft desligado'),
  ),
)`, { align: 'start' }),

      h2('Tamanhos'),
      demo(`stack({ direction: 'row', gap: 'sm', align: 'center' },
  toggleButton({ size: 'sm', pressed: true }, 'Pequeno'),
  toggleButton({ size: 'md', pressed: true }, 'Médio'),
  toggleButton({ size: 'lg', pressed: true }, 'Grande'),
)`),

      h2('Com ícones'),
      p(
        'Uma alternância só de ícone precisa de nome acessível — passa ',
        code('aria-label'),
        ', que cai no botão.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm' },
  toggleButton({
    pressed: true,
    'aria-label': 'Negrito',
    title: 'Negrito',
    startIcon: icon('bold'),
  }),
  toggleButton({
    'aria-label': 'Itálico',
    title: 'Itálico',
    startIcon: icon('italic'),
  }),
)`),

      h2('Desativado'),
      demo(`stack({ direction: 'row', gap: 'sm' },
  toggleButton({ pressed: true, disabled: true }, 'Ligado, bloqueado'),
  toggleButton({ disabled: true }, 'Desligado, bloqueado'),
)`),

      h2('Pô-lo a fazer alguma coisa'),
      p(
        'Um listener vira o atributo; o estilo vai atrás.',
      ),
      codeBlock('src/main.js', `for (const button of document.querySelectorAll('[aria-pressed]')) {
  button.addEventListener('click', () => {
    const on = button.getAttribute('aria-pressed') === 'true'
    button.setAttribute('aria-pressed', String(!on))
  })
}`, 'javascript'),

      h2('Props'),
      propsTable([
        ['pressed', 'boolean', 'false', 'Define aria-pressed. Não há script por trás.'],
        ['variant', "'outline' | 'ghost' | 'soft'", "'outline'", 'O aspeto do botão quando não está carregado.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'A mesma escala do button().'],
        ['disabled', 'boolean', 'false', 'Desativa o botão.'],
      ]),
      p(
        'Tudo o resto cai no ',
        code('button()'),
        ' — ',
        code('startIcon'),
        ', ',
        code('endIcon'),
        ', ',
        code('onclick'),
        ' e os restantes. Para um conjunto deles, vê ',
        code('toggleGroup()'),
        '.',
      ),
    ],
  })
