import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Barra da aplicação',
    description:
      'A barra no topo de um site: a marca de um lado, a navegação e as ações do outro.',
    activeHref: '/pt/ui/app-bar',
    extraHead: uiHead(),
    children: [
      p(
        'Uma barra da aplicação é um ',
        code('<header>'),
        ' com uma linha lá dentro. As peças estão separadas para as poderes arrumar: ',
        code('appBarNav()'),
        ' para as ligações, ',
        code('appBarSpacer()'),
        ' para empurrar o que vem a seguir para a outra ponta, e ',
        code('appBarActions()'),
        ' para os botões do fim.',
      ),

      h2('Barra básica'),
      demo(`appBar({ brand: 'sitelo' },
  appBarSpacer(),
  appBarActions(
    button({ size: 'sm', variant: 'soft' }, 'Entrar'),
  ),
)`, { align: 'stretch' }),

      h2('Com navegação'),
      p(
        code('navLink()'),
        ' é o estilo de ligação de uma barra; ',
        code('current'),
        ' marca a página ativa com ',
        code('aria-current'),
        ' além da cor.',
      ),
      demo(`appBar({ brand: 'sitelo' },
  appBarNav(
    navLink({ href: '#docs', current: true }, 'Documentação'),
    navLink({ href: '#ui' }, 'UI'),
    navLink({ href: '#examples' }, 'Exemplos'),
  ),
  appBarSpacer(),
  appBarActions(
    button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'GitHub'),
    button({ size: 'sm' }, 'Começar'),
  ),
)`, { align: 'stretch' }),

      h2('Uma marca com símbolo'),
      p(
        'A marca aceita qualquer marcação e liga para ',
        code('/'),
        ' a não ser que ',
        code('href'),
        ' diga o contrário.',
      ),
      demo(`appBar({
  href: '#home',
  brand: stack({ direction: 'row', gap: 'sm', inline: true, align: 'center' },
    avatar({ name: 'S', size: 'sm', square: true, color: 'primary' }),
    'sitelo',
  ),
},
  appBarSpacer(),
  appBarActions(chip({ size: 'sm', color: 'neutral' }, 'v2.6.3')),
)`, { align: 'stretch' }),

      h2('Fixa e desfocada'),
      p(
        code('sticky'),
        ' prende a barra ao topo do contentor de deslocamento; ',
        code('blur'),
        ' torna-a translúcida para o conteúdo passar por baixo. Aqui as duas são mostradas dentro de uma caixa com deslocamento, e não na própria página.',
      ),
      demo(`div({ style: 'height: 12rem; overflow: auto; border: 1px solid var(--su-border); border-radius: 0.6rem' },
  appBar({ brand: 'sitelo', sticky: true, blur: true },
    appBarSpacer(),
    appBarActions(chip({ size: 'sm', color: 'primary' }, 'sticky')),
  ),
  container({ size: 'sm', style: 'padding-block: 1rem' },
    stack({ gap: 'md' },
      ...Array.from({ length: 6 }, (unused, index) =>
        text({ variant: 'small', tone: 'muted' }, 'Desloca-me — parágrafo ' + (index + 1) + '.'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Com um painel lateral em ecrãs pequenos'),
      p(
        'O padrão do costume: ligações na barra no computador, um botão que abre um ',
        code('drawer()'),
        ' no telemóvel. O painel é um popover, por isso o botão não precisa de script.',
      ),
      demo(`fragment(
  appBar({ brand: 'sitelo' },
    appBarSpacer(),
    appBarActions(
      themeToggle(),
      iconButton({
        label: 'Abrir a navegação',
        variant: 'ghost',
        color: 'neutral',
        popovertarget: 'app-bar-drawer',
        icon: icon('menu'),
      }),
    ),
  ),
  drawer({ id: 'app-bar-drawer', title: 'Navegação' },
    navLink({ href: '#docs' }, 'Documentação'),
    navLink({ href: '#ui' }, 'UI'),
    navLink({ href: '#examples' }, 'Exemplos'),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      p(code('appBar()'), ':'),
      propsTable([
        ['brand', 'Child', '', 'Conteúdo da ligação de marca no início.'],
        ['href', 'string', "'/'", 'Para onde a marca liga.'],
        ['sticky', 'boolean', 'false', 'Prende a barra ao topo ao deslocar.'],
        ['blur', 'boolean', 'false', 'Fundo translúcido com desfoque por trás.'],
        ['as', 'string', "'header'", 'Elemento a renderizar.'],
      ]),
      p('As peças:'),
      propsTable([
        ['appBarNav', '', '', 'Um elemento nav que guarda as ligações.'],
        ['appBarSpacer', '', '', 'Espaço flexível; tudo o que vem depois vai para a outra ponta.'],
        ['appBarActions', '', '', 'Grupo de botões no fim.'],
        ['navLink', 'href, current, color', '', 'Uma ligação com estilo de barra; current marca a página ativa.'],
      ], { headers: ['Peça', 'Props', 'Predefinição', 'Descrição'] }),
    ],
  })
