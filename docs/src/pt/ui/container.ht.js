import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'

export default () =>
  uiLayout({
    title: 'Contentor',
    description:
      'Uma coluna centrada e de largura limitada — o invólucro mais exterior da maioria das páginas.',
    activeHref: '/pt/ui/container',
    children: [
      p(
        'Um contentor centra o seu conteúdo, limita a largura para as linhas de texto continuarem legíveis, e guarda uma margem para que nada toque na berma do ecrã de um telemóvel. Costuma ser a primeira coisa dentro de ',
        code('body()'),
        '.',
      ),

      h2('Contentor básico'),
      demo(`container(
  text({ variant: 'lead' }, 'Tudo lá dentro fica centrado e deixa de crescer no limite de tamanho.'),
)`, { align: 'stretch' }),

      h2('Tamanhos'),
      p(
        'Cinco degraus, de uma única coluna legível até nenhum limite. ',
        code('sm'),
        ' ronda os 40rem — grosso modo a largura que o texto corrido pede.',
      ),
      demo(`stack({ gap: 'sm' },
  container({ size: 'sm', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
    text({ variant: 'small', align: 'center' }, 'sm — 40rem'),
  ),
  container({ size: 'md', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
    text({ variant: 'small', align: 'center' }, 'md — 56rem'),
  ),
  container({ size: 'lg', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
    text({ variant: 'small', align: 'center' }, 'lg — 72rem (predefinição)'),
  ),
)`, { align: 'stretch' }),

      h2('Uma largura à medida'),
      p(
        code('width'),
        ' aceita qualquer comprimento CSS e prevalece sobre ',
        code('size'),
        ', para aquela página que precisa de algo que a escala não tem.',
      ),
      demo(`container({ width: '30rem', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
  text({ variant: 'small', align: 'center' }, 'width: 30rem'),
)`, { align: 'stretch' }),

      h2('Margem lateral'),
      p(
        'A margem lateral é o espaçamento mantido entre o conteúdo e a berma da janela. Aceita um token de espaçamento, um número de unidades de espaçamento, ou um comprimento em bruto.',
      ),
      demo(`container({ size: 'sm', gutter: 'xl', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
  text({ variant: 'small' }, 'Uma margem mais larga, para uma página cujo conteúdo não deve chegar à berma num tablet.'),
)`, { align: 'stretch' }),

      h2('Como outro elemento'),
      p(
        code('as'),
        ' muda a etiqueta sem mudar mais nada — útil quando o contentor é também o ',
        code('<main>'),
        ' da página ou uma ',
        code('<section>'),
        '.',
      ),
      demo(`container({ as: 'main', size: 'md' },
  heading({ level: 2, size: 'h4' }, 'Um elemento main'),
  text({ tone: 'muted' }, 'Mesma disposição, marco correto.'),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['size', "'sm' | 'md' | 'lg' | 'xl' | 'full'", "'lg'", 'Que limite de largura aplicar.'],
        ['width', 'string', '', 'Um max-width em bruto, que prevalece sobre size.'],
        ['gutter', 'Space', "'md'", 'Espaçamento lateral mantido contra a berma da janela.'],
        ['as', 'string', "'div'", 'Elemento a renderizar, por exemplo main ou section.'],
      ]),
    ],
  })
