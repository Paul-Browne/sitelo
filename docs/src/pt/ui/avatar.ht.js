import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Avatar',
    description:
      'Uma pessoa ou uma coisa dentro de um círculo — uma imagem quando existe, iniciais quando não.',
    activeHref: '/pt/ui/avatar',
    extraHead: uiHead(),
    children: [
      p(
        'Dá a um avatar um ',
        code('name'),
        ' e nenhum ',
        code('src'),
        ' e ele desenha as iniciais em vez de uma imagem partida. É o recurso útil para uma lista de contribuidores em que só algumas pessoas têm fotografia.',
      ),

      h2('Avatar básico'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ name: 'Ada Lovelace' }),
  avatar({ name: 'Grace Hopper' }),
  avatar({ name: 'Alan Turing' }),
)`),

      h2('Com uma imagem'),
      p(
        'Quando ',
        code('src'),
        ' está definido, o ',
        code('alt'),
        ' recai sobre o nome — por isso um avatar nunca é uma imagem sem etiqueta.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ src: '/logo.svg', alt: 'sitelo', style: 'background: var(--su-surface-2)' }),
  avatar({ src: '/logo.svg', name: 'sitelo', square: true, style: 'background: var(--su-surface-2)' }),
)`),

      h2('Tamanhos'),
      p('O tamanho da letra acompanha o do avatar, por isso as iniciais mantêm a proporção.'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ name: 'Pequeno Um', size: 'sm' }),
  avatar({ name: 'Médio Um', size: 'md' }),
  avatar({ name: 'Grande Um', size: 'lg' }),
)`),

      h2('Quadrado'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ name: 'Projeto A', square: true }),
  avatar({ name: 'Projeto B', square: true, color: 'success' }),
)`),

      h2('Cores'),
      p('Um avatar sem imagem recebe um fundo suave da paleta.'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center', wrap: true },
  avatar({ name: 'Primary', color: 'primary' }),
  avatar({ name: 'Neutral', color: 'neutral' }),
  avatar({ name: 'Success', color: 'success' }),
  avatar({ name: 'Warning', color: 'warning' }),
  avatar({ name: 'Danger', color: 'danger' }),
)`),

      h2('Ícones e outro conteúdo'),
      p('Os filhos substituem as iniciais, para um ícone ou um único carácter.'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ color: 'neutral' },
    icon('user'),
  ),
  avatar({ color: 'primary' }, '?'),
)`),

      h2('Grupos'),
      p(
        code('avatarGroup()'),
        ' sobrepõe os seus filhos e dobra tudo o que passe de ',
        code('max'),
        ' numa contagem.',
      ),
      demo(`stack({ gap: 'md' },
  avatarGroup(
    avatar({ name: 'Ada Lovelace' }),
    avatar({ name: 'Grace Hopper' }),
    avatar({ name: 'Alan Turing' }),
  ),
  avatarGroup({ max: 3 },
    avatar({ name: 'Ada Lovelace' }),
    avatar({ name: 'Grace Hopper' }),
    avatar({ name: 'Alan Turing' }),
    avatar({ name: 'Katherine Johnson' }),
    avatar({ name: 'Barbara Liskov' }),
    avatar({ name: 'Margaret Hamilton' }),
  ),
  avatarGroup({ max: 2, size: 'sm' },
    avatar({ name: 'Ada Lovelace', size: 'sm' }),
    avatar({ name: 'Grace Hopper', size: 'sm' }),
    avatar({ name: 'Alan Turing', size: 'sm' }),
  ),
)`, { align: 'start' }),

      h2('Numa lista'),
      demo(`list(
  listItem({
    start: avatar({ name: 'Ada Lovelace', size: 'sm' }),
    title: 'Ada Lovelace',
    description: 'Enviou 3 commits para main',
  }),
  listItem({
    start: avatar({ name: 'Grace Hopper', size: 'sm', color: 'success' }),
    title: 'Grace Hopper',
    description: 'Abriu um pull request',
  }),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['name', 'string', '', 'Usado para as iniciais, o title e como alt de recurso da imagem.'],
        ['src', 'string', '', 'Imagem a mostrar em vez das iniciais.'],
        ['alt', 'string', '', 'Texto alternativo da imagem; recai sobre name.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Diâmetro, e tamanho de letra das iniciais.'],
        ['square', 'boolean', 'false', 'Retângulo arredondado em vez de círculo.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", '', 'Paleta do fundo das iniciais.'],
      ]),
      p(
        code('avatarGroup()'),
        ' aceita ',
        code('max'),
        ' — quantos mostrar antes de dobrar os restantes numa contagem — e ',
        code('size'),
        ', que só é usado para essa contagem.',
      ),
    ],
  })
