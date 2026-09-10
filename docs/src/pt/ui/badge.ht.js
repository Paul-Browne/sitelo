import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/pt.js'

export default () =>
  uiLayout({
    title: 'Emblema',
    description:
      'Uma contagem ou um ponto preso ao canto daquilo que envolve.',
    activeHref: '/pt/ui/badge',
    children: [
      p(
        'Um emblema envolve algo e prende-lhe um marcador ao canto superior: mensagens por ler num botão de caixa de entrada, um ponto de «online» num avatar. Aquilo que marca vai como filhos.',
      ),

      h2('Emblema básico'),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center' },
  badge({ content: 4 }, button({ variant: 'soft', color: 'neutral' }, 'Caixa de entrada')),
  badge({ content: 12 }, avatar({ name: 'Ada Lovelace' })),
)`),

      h2('Cores'),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center', wrap: true },
  badge({ content: 3, color: 'primary' }, button({ variant: 'soft', color: 'neutral' }, 'Primary')),
  badge({ content: 3, color: 'neutral' }, button({ variant: 'soft', color: 'neutral' }, 'Neutral')),
  badge({ content: 3, color: 'success' }, button({ variant: 'soft', color: 'neutral' }, 'Success')),
  badge({ content: 3, color: 'warning' }, button({ variant: 'soft', color: 'neutral' }, 'Warning')),
  badge({ content: 3, color: 'danger' }, button({ variant: 'soft', color: 'neutral' }, 'Danger')),
)`),

      h2('Máximo'),
      p(
        'Uma contagem acima de ',
        code('max'),
        ' aparece como ',
        code('n+'),
        ', para que um emblema nunca cresça ao ponto de desequilibrar aquilo em que assenta.',
      ),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center', wrap: true },
  badge({ content: 9 }, button({ variant: 'soft', color: 'neutral' }, 'Nove')),
  badge({ content: 250 }, button({ variant: 'soft', color: 'neutral' }, 'Limitado a 99')),
  badge({ content: 250, max: 999 }, button({ variant: 'soft', color: 'neutral' }, 'max: 999')),
)`),

      h2('Ponto'),
      p(
        'Um ponto diz «mudou alguma coisa» sem dizer quanto. Dá-lhe um ',
        code('label'),
        ' — um ponto sozinho não significa nada para um leitor de ecrã, por isso sem etiqueta fica totalmente escondido da árvore de acessibilidade.',
      ),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center' },
  badge({ dot: true, color: 'success', label: 'Online' }, avatar({ name: 'Ada Lovelace' })),
  badge({ dot: true, color: 'warning', label: 'Precisa de atenção' },
    iconButton({
      label: 'Definições',
      variant: 'soft',
      color: 'neutral',
      icon: icon('settings'),
    }),
  ),
)`),

      h2('Dar nome à contagem'),
      p(
        'Um número sozinho é ambíguo fora de contexto. ',
        code('label'),
        ' passa a ser o nome acessível do emblema, por isso lê-se «4 mensagens por ler» em vez de «4».',
      ),
      demo(`badge({ content: 4, label: '4 mensagens por ler' },
  button({ variant: 'soft', color: 'neutral' }, 'Caixa de entrada'),
)`),

      h2('Mudar a contagem'),
      p(
        'Uma contagem é o número de uma página com maior probabilidade de mudar enquanto ela está aberta. ',
        code('setBadge()'),
        ' corta-a em ',
        code('max'),
        ' tal como o servidor fez, mantém o texto anunciado com ela, e tira da árvore de acessibilidade um emblema esvaziado — é assim que um emblema desaparece.',
      ),
      p('O texto anunciado é a prosa do site, por isso passa-o sempre que o emblema tiver um:'),
      codeBlock('Em qualquer sítio', `button({ onclick: "import('/su/badge.js').then(m=>m.set('inbox',0))" }, 'Mark all read')`, 'javascript'),
      p('Ou a partir do teu próprio módulo, quando já houver um a correr:'),
      codeBlock('src/main.js', `import { setBadge } from 'sitelo/ui/client'

setBadge('inbox', 7, { label: '7 unread messages' })`, 'javascript'),

      h2('Props'),
      propsTable([
        ['content', 'string | number', '', 'O que o emblema mostra. Ignorado quando dot está definido.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'danger'", 'Cor do emblema.'],
        ['dot', 'boolean', 'false', 'Um pequeno ponto em vez de um valor.'],
        ['max', 'number', '99', 'Contagens acima disto aparecem como n+.'],
        ['label', 'string', '', 'Nome acessível do próprio emblema.'],
      ]),
    ],
  })
