import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/pt.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Alerta',
    description:
      'Uma mensagem sobre o estado de algo, com um ícone e um papel de anúncio que seguem a cor.',
    activeHref: '/pt/ui/alert',
    extraHead: uiHead(),
    children: [
      p(
        'Um alerta diz ao leitor algo sobre a página ou sobre uma ação que acabou de fazer. A cor escolhe ao mesmo tempo o ícone e o papel ARIA: ',
        code('danger'),
        ' e ',
        code('warning'),
        ' anunciam-se como ',
        code('role="alert"'),
        '; tudo o que for mais calmo é um ',
        code('role="status"'),
        ' educado.',
      ),

      h2('Cores'),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'primary', title: 'Atenção' }, 'Está disponível uma nova versão do sitelo.'),
  alert({ color: 'success', title: 'Publicado' }, '169 páginas publicadas em 1,7 segundos.'),
  alert({ color: 'warning', title: 'Página lenta' }, 'Uma página demorou mais de 500 ms a renderizar.'),
  alert({ color: 'danger', title: 'Construção falhou' }, 'Duas ligações internas apontam para páginas que não existem.'),
  alert({ color: 'neutral', title: 'Nota' }, 'As ilhas estão desativadas neste projeto.'),
)`, { align: 'stretch' }),

      h2('Sem título'),
      p('Um alerta de uma linha não precisa de um cabeçalho por cima da frase.'),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'success' }, 'Guardado.'),
  alert({ color: 'danger' }, 'Esse endereço de email já está em uso.'),
)`, { align: 'stretch' }),

      h2('Variantes'),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'warning', variant: 'soft', title: 'Soft' }, 'A predefinição — uma superfície tingida.'),
  alert({ color: 'warning', variant: 'outline', title: 'Outline' }, 'Transparente, com um contorno colorido.'),
  alert({ color: 'warning', variant: 'solid', title: 'Solid' }, 'A cor cheia da paleta, para o que não pode passar despercebido.'),
)`, { align: 'stretch' }),

      h2('Ícones'),
      p(
        'Cada cor tem um ícone predefinido. Passa a tua própria marcação em ',
        code('icon'),
        ', ou ',
        code('icon: false'),
        ' para nenhum.',
      ),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'primary', icon: false, title: 'Sem ícone' }, 'Apenas o texto.'),
  alert({
    color: 'primary',
    title: 'Um ícone próprio',
    icon: icon('star'),
  }, 'Serve qualquer SVG — os ícones são marcação, não uma dependência.'),
)`, { align: 'stretch' }),

      h2('Dispensável'),
      p('O botão de fechar traz o seu próprio handler:'),
      codeBlock(
        'Marcação gerada',
        `onclick="import('/su/alert.js').then(m=>m.dismiss(this))"`,
        'html',
      ),
      p(
        'Por isso o alerta abaixo fecha mesmo, sem que esta página importe seja o que for. Se esse módulo nunca chegar, o botão desenha-se e não faz nada — razão pela qual um alerta nunca deve ser o único sítio onde uma mensagem aparece.',
      ),
      demo(`alert({ color: 'primary', title: 'Dispensável', dismissible: true },
  'Carrega no × — o handler vai buscar-se a si próprio ao primeiro toque.',
)`, { align: 'stretch' }),

      h2('Conteúdo rico'),
      p('Os alertas aceitam quaisquer filhos, por isso uma ação ou uma lista pode viver lá dentro.'),
      demo(`alert({ color: 'danger', title: 'Verificação de ligações falhou' },
  stack({ gap: 'sm' },
    text({ variant: 'small' }, 'Duas ligações apontam para páginas que não foram geradas:'),
    list({ plain: true },
      listItem({ title: '/docs/old-routing', description: 'ligado a partir de /docs' }),
      listItem({ title: '/blog/draft', description: 'ligado a partir de /blog' }),
    ),
    stack({ direction: 'row', gap: 'sm' },
      button({ size: 'sm', color: 'danger' }, 'Ver detalhes'),
      button({ size: 'sm', variant: 'ghost', color: 'danger' }, 'Ignorar'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Escolhe a paleta, o ícone predefinido e o papel ARIA.'],
        ['variant', "'soft' | 'outline' | 'solid'", "'soft'", 'Quanto peso o alerta carrega.'],
        ['title', 'Child', '', 'Primeira linha a negrito.'],
        ['icon', 'Child | false', '', 'Marcação de ícone própria, ou false para nenhum.'],
        ['dismissible', 'boolean', 'false', 'Acrescenta um botão de fechar que importa o seu próprio handler.'],
        ['dismissLabel', 'string', "'Dismiss'", 'Nome acessível desse botão.'],
      ]),
    ],
  })
