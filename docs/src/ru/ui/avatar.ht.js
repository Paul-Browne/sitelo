import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/ru.js'

export default () =>
  uiLayout({
    title: 'Аватар',
    description:
      'Человек или предмет в кружке — картинка, если она есть, и инициалы, если её нет.',
    activeHref: '/ru/ui/avatar',
    children: [
      p(
        'Задайте аватару ',
        code('name'),
        ' и не задавайте ',
        code('src'),
        ' — он нарисует инициалы вместо битой картинки. Это полезный запасной вариант для списка участников, где фото есть лишь у некоторых.',
      ),

      h2('Простой аватар'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ name: 'Ada Lovelace' }),
  avatar({ name: 'Grace Hopper' }),
  avatar({ name: 'Alan Turing' }),
)`),

      h2('С картинкой'),
      p(
        'Когда задан ',
        code('src'),
        ', ',
        code('alt'),
        ' берётся из имени — так что аватар никогда не остаётся неподписанной картинкой.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ src: '/logo.svg', alt: 'sitelo', style: 'background: var(--su-surface-2)' }),
  avatar({ src: '/logo.svg', name: 'sitelo', square: true, style: 'background: var(--su-surface-2)' }),
)`),

      h2('Размеры'),
      p('Кегль масштабируется вместе с аватаром, поэтому инициалы остаются соразмерными.'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ name: 'Малый Размер', size: 'sm' }),
  avatar({ name: 'Средний Размер', size: 'md' }),
  avatar({ name: 'Большой Размер', size: 'lg' }),
)`),

      h2('Квадратный'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ name: 'Проект А', square: true }),
  avatar({ name: 'Проект Б', square: true, color: 'success' }),
)`),

      h2('Цвета'),
      p('Аватар без картинки получает мягкий фон из палитры.'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center', wrap: true },
  avatar({ name: 'Primary', color: 'primary' }),
  avatar({ name: 'Neutral', color: 'neutral' }),
  avatar({ name: 'Success', color: 'success' }),
  avatar({ name: 'Warning', color: 'warning' }),
  avatar({ name: 'Danger', color: 'danger' }),
)`),

      h2('Иконки и другое содержимое'),
      p('Потомки замещают инициалы — для иконки или одного символа.'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ color: 'neutral' },
    icon('user'),
  ),
  avatar({ color: 'primary' }, '?'),
)`),

      h2('Группы'),
      p(
        code('avatarGroup()'),
        ' накладывает потомков друг на друга и сворачивает всё сверх ',
        code('max'),
        ' в счётчик.',
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

      h2('В списке'),
      demo(`list(
  listItem({
    start: avatar({ name: 'Ada Lovelace', size: 'sm' }),
    title: 'Ada Lovelace',
    description: 'Отправила 3 коммита в main',
  }),
  listItem({
    start: avatar({ name: 'Grace Hopper', size: 'sm', color: 'success' }),
    title: 'Grace Hopper',
    description: 'Открыла пул-реквест',
  }),
)`, { align: 'stretch' }),

      h2('Пропсы'),
      propsTable([
        ['name', 'string', '', 'Идёт в инициалы, в title и в запасной alt картинки.'],
        ['src', 'string', '', 'Картинка вместо инициалов.'],
        ['alt', 'string', '', 'Альтернативный текст картинки; по умолчанию берётся из name.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Диаметр и кегль инициалов.'],
        ['square', 'boolean', 'false', 'Скруглённый прямоугольник вместо круга.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", '', 'Палитра фона под инициалами.'],
      ]),
      p(
        code('avatarGroup()'),
        ' принимает ',
        code('max'),
        ' — сколько показать, прежде чем свернуть остальных в счётчик, — и ',
        code('size'),
        ', который используется только для этого счётчика.',
      ),
    ],
  })
