import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Divisória',
    description:
      'Um traço entre secções, com ou sem etiqueta ao meio.',
    activeHref: '/pt/ui/divider',
    extraHead: uiHead(),
    children: [
      p(
        'Uma divisória separa grupos de conteúdo. Desenha um elemento com ',
        code('role="separator"'),
        ' em vez de um ',
        code('<hr>'),
        ', porque a etiqueta vai lá dentro e o ',
        code('<hr>'),
        ' não aceita filhos.',
      ),

      h2('Divisória básica'),
      demo(`stack({ gap: 'none' },
  text({ tone: 'muted' }, 'Tudo o que está acima.'),
  divider(),
  text({ tone: 'muted' }, 'Tudo o que está abaixo.'),
)`, { align: 'stretch' }),

      h2('Com etiqueta'),
      p('Os filhos passam a uma etiqueta centrada no traço.'),
      demo(`stack({ gap: 'none' },
  button({ variant: 'outline', color: 'neutral', block: true }, 'Continuar com o GitHub'),
  divider('ou'),
  button({ block: true }, 'Continuar com email'),
)`, { align: 'stretch' }),

      h2('Espaçamento'),
      p(
        code('spacing'),
        ' define a margem acima e abaixo, a partir da mesma escala que tudo o resto usa.',
      ),
      demo(`stack({ gap: 'none' },
  text({ variant: 'small', tone: 'muted' }, 'Apertado'),
  divider({ spacing: 'xs' }),
  text({ variant: 'small', tone: 'muted' }, 'Predefinição'),
  divider(),
  text({ variant: 'small', tone: 'muted' }, 'Folgado'),
  divider({ spacing: 'xl' }),
  text({ variant: 'small', tone: 'muted' }, 'Fim'),
)`, { align: 'stretch' }),

      h2('Vertical'),
      p(
        'Uma divisória vertical precisa de um pai que lhe dê altura — uma linha flex cujos itens se esticam, que é o que o ',
        code('stack()'),
        ' faz por predefinição.',
      ),
      demo(`stack({ direction: 'row', gap: 'none', align: 'stretch' },
  text({ variant: 'small' }, '4,1 kB'),
  divider({ orientation: 'vertical' }),
  text({ variant: 'small' }, '12 páginas'),
  divider({ orientation: 'vertical' }),
  text({ variant: 'small' }, '0 ilhas'),
)`),

      h2('Props'),
      propsTable([
        ['orientation', "'horizontal' | 'vertical'", "'horizontal'", 'Em que direção corre o traço.'],
        ['spacing', 'Space', "'md'", 'Margem de cada lado do traço.'],
      ]),
    ],
  })
