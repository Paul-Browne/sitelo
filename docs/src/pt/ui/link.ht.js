import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Ligação',
    description:
      'Uma âncora estilizada, com os atributos de segurança que uma ligação externa precisa.',
    activeHref: '/pt/ui/link',
    extraHead: uiHead(),
    children: [
      p(
        'Uma ligação é uma âncora com o sublinhado e a paleta da biblioteca. É exportada com dois nomes — ',
        code('link'),
        ' e ',
        code('textLink'),
        ' — porque ',
        code('link'),
        ' é também o elemento ',
        code('<link>'),
        ' do javascript-to-html, e importar ambos com um só nome é um erro de sintaxe. Usa ',
        code('textLink'),
        ', ou importa a biblioteca como espaço de nomes.',
      ),

      h2('Ligação básica'),
      demo(`text('Lê a ', link({ href: '/pt/docs' }, 'documentação'), ' para começar.')`, {
        align: 'stretch',
      }),

      h2('Cores'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  link({ href: '#', color: 'primary' }, 'Primary'),
  link({ href: '#', color: 'neutral' }, 'Neutral'),
  link({ href: '#', color: 'success' }, 'Success'),
  link({ href: '#', color: 'warning' }, 'Warning'),
  link({ href: '#', color: 'danger' }, 'Danger'),
)`),

      h2('Discreta'),
      p(
        'Uma ligação discreta herda a cor à volta e só mostra o sublinhado ao passar o rato — para listas de ligações em que um sublinhado por linha seria ruído.',
      ),
      demo(`stack({ gap: 'xs' },
  link({ href: '/pt/docs/routing', subtle: true }, 'Rotas'),
  link({ href: '/pt/docs/data', subtle: true }, 'Carregamento de dados'),
  link({ href: '/pt/docs/assets', subtle: true }, 'Recursos e estilos'),
)`, { align: 'stretch' }),

      h2('Ligações externas'),
      p(
        code('external'),
        ' acrescenta ',
        code('target="_blank"'),
        ' e o ',
        code('rel'),
        ' que tem de vir com ele. Diz no texto da ligação que abre um separador novo, ou acrescenta uma nota escondida visualmente — um separador novo sem aviso desorienta.',
      ),
      demo(`text(
  'A biblioteca está no ',
  link({ href: 'https://www.npmjs.com/package/sitelo', external: true },
    'npm',
    visuallyHidden(' (abre num separador novo)'),
  ),
  '.',
)`, { align: 'stretch' }),

      h2('Num parágrafo'),
      demo(`text({ variant: 'lead' },
  'O sitelo assenta no ',
  link({ href: 'https://vite.dev', external: true }, 'Vite'),
  ', desenha com o ',
  link({ href: 'https://ht.js.org', external: true }, 'javascript-to-html'),
  ', e não envia nada para o navegador a não ser que peças.',
)`, { align: 'stretch' }),

      h2('Quando usar antes um botão'),
      p(
        'Uma ligação navega; um botão executa uma ação. Se a coisa muda o estado da página em vez de levar o leitor a outro lado, deve ser um ',
        code('button()'),
        ' — e se navega mas deve parecer um botão, dá um ',
        code('href'),
        ' ao ',
        code('button()'),
        ', que desenha uma âncora por baixo.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center', wrap: true },
  link({ href: '/pt/docs' }, 'Uma ligação que navega'),
  button({ href: '/pt/docs', variant: 'outline' }, 'Uma ligação com ar de botão'),
  button({ variant: 'link' }, 'Um botão com ar de ligação'),
)`),

      h2('Props'),
      propsTable([
        ['href', 'string', '', 'Para onde vai.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'De que paleta bebe.'],
        ['subtle', 'boolean', 'false', 'Herda a cor à volta; sublinhado só ao passar o rato.'],
        ['external', 'boolean', 'false', 'Acrescenta target="_blank" e rel="noopener noreferrer".'],
      ]),
    ],
  })
