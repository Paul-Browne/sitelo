import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/ru.js'

export default () =>
  uiLayout({
    title: 'Боковая панель',
    description:
      'Панель, выезжающая от края: та же механика popover, что и у модального окна, только другой формы.',
    activeHref: '/ru/ui/drawer',
    children: [
      p(
        'Боковая панель занимает всю высоту и прижата к одной стороне. Как и ',
        code('modal()'),
        ', это ',
        code('popover'),
        ': кнопка с соответствующим ',
        code('popovertarget'),
        ' открывает её, а браузер берёт на себя затемнение, клик снаружи и Escape.',
      ),
      p(
        'На статическом сайте её самая частая работа — меню навигации на телефоне.',
      ),

      h2('Простая панель'),
      demo(`fragment(
  button({ popovertarget: 'drawer-basic' }, 'Открыть панель'),
  drawer({ id: 'drawer-basic', title: 'Настройки' },
    stack({ gap: 'md' },
      toggle({ label: 'Поиск Pagefind', checked: true }),
      toggle({ label: 'Оптимизация изображений', checked: true }),
      toggle({ label: 'Серверные острова' }),
    ),
  ),
)`),

      h2('Стороны'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm' },
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-start' }, 'От начала'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-end' }, 'От конца'),
  ),
  drawer({ id: 'drawer-start', side: 'start', title: 'Начало' },
    text({ variant: 'small', tone: 'muted' }, 'Прижата к начальному краю — левому в языке, который читают слева направо.'),
  ),
  drawer({ id: 'drawer-end', title: 'Конец' },
    text({ variant: 'small', tone: 'muted' }, 'Вариант по умолчанию: прижата к конечному краю.'),
  ),
)`),

      h2('Ширина'),
      p('Любая CSS-длина. Она ограничена 90 % ширины окна, поэтому широкая панель всё равно помещается на телефоне.'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm' },
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-narrow' }, 'Узкая'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-wide' }, 'Широкая'),
  ),
  drawer({ id: 'drawer-narrow', width: '14rem', title: 'Узкая' },
    text({ variant: 'small', tone: 'muted' }, 'width: 14rem'),
  ),
  drawer({ id: 'drawer-wide', width: '34rem', title: 'Широкая' },
    text({ variant: 'small', tone: 'muted' }, 'width: 34rem'),
  ),
)`),

      h2('Как меню навигации'),
      p('Приём, которого хочет большинство сайтов: кнопка меню в панели, ссылки — в боковой панели.'),
      demo(`fragment(
  appBar({ brand: 'sitelo' },
    appBarSpacer(),
    appBarActions(
      iconButton({
        label: 'Открыть навигацию',
        variant: 'ghost',
        color: 'neutral',
        popovertarget: 'drawer-nav',
        icon: icon('menu'),
      }),
    ),
  ),
  drawer({ id: 'drawer-nav', title: 'Навигация' },
    navLink({ href: '#docs', current: true }, 'Документация'),
    navLink({ href: '#ui' }, 'UI'),
    navLink({ href: '#examples' }, 'Примеры'),
    navLink({ href: '#about' }, 'О проекте'),
    divider({ spacing: 'sm' }),
    button({ block: true }, 'Начать'),
  ),
)`, { align: 'stretch' }),

      h2('Панель фильтров'),
      demo(`fragment(
  button({ variant: 'soft', color: 'neutral', popovertarget: 'drawer-filters' }, 'Фильтры'),
  drawer({ id: 'drawer-filters', title: 'Фильтры', width: '22rem' },
    stack({ gap: 'lg' },
      choiceGroup({
        legend: 'Тип',
        name: 'drawer-type',
        value: 'guide',
        options: [
          { value: 'guide', label: 'Руководства' },
          { value: 'example', label: 'Примеры' },
          { value: 'all', label: 'Всё' },
        ],
      }),
      choiceGroup({
        legend: 'Теги',
        name: 'drawer-tags',
        type: 'checkbox',
        value: ['routing'],
        options: ['routing', 'data', 'islands'],
      }),
      stack({ direction: 'row', gap: 'sm' },
        button({ variant: 'ghost', color: 'neutral', popovertarget: 'drawer-filters', popovertargetaction: 'hide' }, 'Отмена'),
        button('Применить'),
      ),
    ),
  ),
)`),

      h2('Пропсы'),
      propsTable([
        ['id', 'string', '', 'Обязателен. То, на что указывает popovertarget кнопки-триггера.'],
        ['title', 'Child', '', 'Заголовок и доступное имя диалога.'],
        ['side', "'start' | 'end'", "'end'", 'К какому краю она прижата.'],
        ['width', 'string', "'20rem'", 'Ширина панели, ограниченная 90vw.'],
        ['closable', 'boolean', 'true', 'Показывать × в шапке.'],
        ['closeLabel', 'string', "'Close'", 'Доступное имя этой кнопки.'],
      ]),
    ],
  })
