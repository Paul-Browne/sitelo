import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'

export default () =>
  uiLayout({
    title: 'Recolhível',
    description:
      'Um único «ver mais», sem os contornos e o agrupamento de um acordeão.',
    activeHref: '/pt/ui/collapsible',
    children: [
      p(
        'Um recolhível é um único ',
        code('<details>'),
        ' — o mesmo elemento com que um acordeão é construído, sem nada da sua moldura. Usa-o para um detalhe opcional a meio de uma página; usa ',
        code('accordion()'),
        ' quando houver um conjunto deles.',
      ),
      p(
        'Não precisa de script e, como o conteúdo fica no documento, é encontrável tanto pela procura na página do navegador como por um motor de busca.',
      ),

      h2('Recolhível básico'),
      demo(`collapsible({ trigger: 'Ver a configuração gerada' },
  text({ variant: 'small' }, 'Tudo o que o sitelo escreve quando corres a construção sem um ficheiro de configuração teu.'),
)`, { align: 'stretch' }),

      h2('Aberto por predefinição'),
      demo(`collapsible({ trigger: 'Porque é que isto existe', open: true },
  text({ variant: 'small' }, 'Porque uma página que esconde a explicação atrás de um clique é uma página que ninguém lê.'),
)`, { align: 'stretch' }),

      h2('Conteúdo rico'),
      demo(`collapsible({ trigger: 'Ver a saída completa' },
  stack({ gap: 'sm' },
    code('dist/index.html'),
    code('dist/404.html'),
    code('dist/sitemap.xml'),
  ),
)`, { align: 'stretch' }),

      h2('Dentro de outras coisas'),
      p('Um recolhível assenta bem dentro de um cartão, de um alerta ou de uma célula de tabela.'),
      demo(`stack({ gap: 'md' },
  card(
    cardHeader({ title: 'Construção falhou', subtitle: '2 ligações partidas' }),
    cardBody(
      collapsible({ trigger: 'Ver as ligações com problemas' },
        list({ plain: true },
          listItem({ title: '/docs/old-routing', description: 'ligado a partir de /docs' }),
          listItem({ title: '/blog/draft', description: 'ligado a partir de /blog' }),
        ),
      ),
    ),
  ),
  alert({ color: 'warning', title: 'Página lenta' },
    stack({ gap: 'sm' },
      text({ variant: 'small' }, 'Uma página demorou mais de 500 ms a renderizar.'),
      collapsible({ trigger: 'Ver os tempos' },
        text({ variant: 'small' }, '/examples/wordpress — 512 ms'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('O acionador'),
      p(
        'Fica-te por texto e ícones. Um ',
        code('<summary>'),
        ' já é interativo, por isso um botão ou uma ligação lá dentro aninha dois controlos onde existe uma só ação — a mesma regra que ',
        code('menu()'),
        ' segue.',
      ),

      h2('Recolhível ou acordeão?'),
      p(
        'Uma revelação isolada: ',
        code('collapsible()'),
        '. Um conjunto delas, com contorno e agrupadas, opcionalmente com só uma aberta de cada vez: ',
        code('accordion()'),
        '.',
      ),

      h2('Props'),
      propsTable([
        ['trigger', 'Child', '', 'O conteúdo do resumo. Só texto e ícones.'],
        ['open', 'boolean', 'false', 'Se começa expandido.'],
      ]),
    ],
  })
