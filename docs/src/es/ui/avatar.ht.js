import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'

export default () =>
  uiLayout({
    title: 'Avatar',
    description:
      'Una persona o una cosa dentro de un círculo: una imagen cuando la hay, iniciales cuando no.',
    activeHref: '/es/ui/avatar',
    children: [
      p(
        'Dale a un avatar un ',
        code('name'),
        ' y ningún ',
        code('src'),
        ' y dibujará las iniciales en vez de una imagen rota. Ese es el respaldo útil para una lista de colaboradores en la que solo algunos tienen foto.',
      ),

      h2('Avatar básico'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ name: 'Ada Lovelace' }),
  avatar({ name: 'Grace Hopper' }),
  avatar({ name: 'Alan Turing' }),
)`),

      h2('Con imagen'),
      p(
        'Cuando hay ',
        code('src'),
        ', el ',
        code('alt'),
        ' recae en el nombre, así que un avatar nunca es una imagen sin etiquetar.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ src: '/logo.svg', alt: 'sitelo', style: 'background: var(--su-surface-2)' }),
  avatar({ src: '/logo.svg', name: 'sitelo', square: true, style: 'background: var(--su-surface-2)' }),
)`),

      h2('Tamaños'),
      p('El tamaño de letra escala con el avatar, así que las iniciales mantienen la proporción.'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ name: 'Pequeño Uno', size: 'sm' }),
  avatar({ name: 'Mediano Uno', size: 'md' }),
  avatar({ name: 'Grande Uno', size: 'lg' }),
)`),

      h2('Cuadrado'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ name: 'Proyecto A', square: true }),
  avatar({ name: 'Proyecto B', square: true, color: 'success' }),
)`),

      h2('Colores'),
      p('Un avatar sin imagen toma un fondo suave de la paleta.'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center', wrap: true },
  avatar({ name: 'Primary', color: 'primary' }),
  avatar({ name: 'Neutral', color: 'neutral' }),
  avatar({ name: 'Success', color: 'success' }),
  avatar({ name: 'Warning', color: 'warning' }),
  avatar({ name: 'Danger', color: 'danger' }),
)`),

      h2('Iconos y otro contenido'),
      p('Los hijos sustituyen a las iniciales, para un icono o un solo carácter.'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ color: 'neutral' },
    icon('user'),
  ),
  avatar({ color: 'primary' }, '?'),
)`),

      h2('Grupos'),
      p(
        code('avatarGroup()'),
        ' solapa a sus hijos y colapsa todo lo que pase de ',
        code('max'),
        ' en un recuento.',
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

      h2('En una lista'),
      demo(`list(
  listItem({
    start: avatar({ name: 'Ada Lovelace', size: 'sm' }),
    title: 'Ada Lovelace',
    description: 'Subió 3 commits a main',
  }),
  listItem({
    start: avatar({ name: 'Grace Hopper', size: 'sm', color: 'success' }),
    title: 'Grace Hopper',
    description: 'Abrió una pull request',
  }),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['name', 'string', '', 'Se usa para las iniciales, el title y como alt de reserva de la imagen.'],
        ['src', 'string', '', 'Imagen que se muestra en lugar de las iniciales.'],
        ['alt', 'string', '', 'Texto alternativo de la imagen; recae en name.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Diámetro, y tamaño de letra de las iniciales.'],
        ['square', 'boolean', 'false', 'Rectángulo redondeado en vez de círculo.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", '', 'Paleta del fondo de las iniciales.'],
      ]),
      p(
        code('avatarGroup()'),
        ' admite ',
        code('max'),
        ' — cuántos mostrar antes de colapsar el resto en un recuento — y ',
        code('size'),
        ', que solo se usa para ese recuento.',
      ),
    ],
  })
