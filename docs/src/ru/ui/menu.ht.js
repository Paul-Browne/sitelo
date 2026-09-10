import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/ru.js'
import { preview } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Меню',
    description:
      'Выпадающее меню на <details>: открывается и закрывается вообще без скрипта.',
    activeHref: '/ru/ui/menu',
    children: [
      p(
        'Меню — это ',
        code('<details>'),
        ' с оформленной панелью. Это сознательный выбор в пользу него, а не popover API: popover живёт в верхнем слое, и без anchor positioning его нельзя расположить относительно своего триггера, а этой возможности пока есть не везде. ',
        code('<details>'),
        ' располагается правильно уже сегодня, и загружать для него ничего не надо.',
      ),
      p(
        'Триггер — это тот самый ',
        code('<summary>'),
        ', оформленный под кнопку, поэтому подпись и пропсы кнопки вы передаёте в ',
        code('menu()'),
        ', а не подсовываете готовый ',
        code('button()'),
        '. Summary уже интерактивен, и кнопка внутри него вкладывает два элемента управления туда, где действие всего одно: невалидная разметка и две остановки табуляции на одну вещь.',
      ),
      p(
        'Закрытие по клику снаружи и по Escape приходит из обработчика ',
        code('ontoggle'),
        ', который подгружает их при первом открытии меню — и только тогда. Если этот модуль так и не придёт, меню всё равно открывается и закрывается собственным summary.',
      ),

      h2('Простое меню'),
      demo(`menu({ trigger: 'Действия' },
  menuItem({ href: '#edit' }, 'Изменить'),
  menuItem({ href: '#duplicate' }, 'Дублировать'),
  menuSeparator(),
  menuItem({ href: '#delete' }, 'Удалить'),
)`),

      h2('Выравнивание'),
      p(
        'Меню раскрывается от начального края триггера. ',
        code("align: 'end'"),
        ' переворачивает это — как раз то, что нужно меню у правого края панели.',
      ),
      demo(`stack({ direction: 'row', gap: 'xl', justify: 'space-between', style: 'width: 100%' },
  menu({ trigger: 'По началу', variant: 'soft' },
    menuItem({ href: '#a' }, 'Первый'),
    menuItem({ href: '#b' }, 'Второй'),
  ),
  menu({ trigger: 'По концу', variant: 'soft', align: 'end' },
    menuItem({ href: '#c' }, 'Первый'),
    menuItem({ href: '#d' }, 'Второй'),
  ),
)`, { align: 'stretch' }),

      h2('Триггеры-иконки'),
      p(
        'Иконке без текста в ',
        code('trigger'),
        ' нужен ',
        code('label'),
        ': он становится доступным именем, которого иконка дать не может.',
      ),
      demo(`stack({ direction: 'row', gap: 'md' },
  menu({
    align: 'end',
    label: 'Ещё действия',
    variant: 'ghost',
    icon: icon('more-horizontal'),
  },
    menuItem({ href: '#rename' }, 'Переименовать'),
    menuItem({ href: '#move' }, 'Переместить'),
    menuSeparator(),
    menuItem({ href: '#archive' }, 'В архив'),
  ),
)`),

      h2('Пункты с иконками'),
      demo(`menu({ trigger: 'Файл' },
  menuItem({
    href: '#new',
    icon: icon('plus'),
  }, 'Новая страница'),
  menuItem({
    href: '#open',
    icon: icon('folder'),
  }, 'Открыть…'),
  menuSeparator(),
  menuItem({
    href: '#build',
    icon: icon('zap'),
  }, 'Собрать сайт'),
)`),

      h2('Кнопки вместо ссылок'),
      p(
        'Пункт без ',
        code('href'),
        ' рисует ',
        code('<button>'),
        ' — для действия, которое происходит на странице, а не для перехода.',
      ),
      demo(`menu({ trigger: 'Экспорт', variant: 'soft', color: 'primary' },
  menuItem({ onclick: "import('/su/toast.js').then(m=>m.toast('Экспортировано в JSON.',{color:'success'}))" }, 'В JSON'),
  menuItem({ onclick: "import('/su/toast.js').then(m=>m.toast('Экспортировано в CSV.',{color:'success'}))" }, 'В CSV'),
)`),
      // The demo above raises toasts; this is the region they land in.
      // Fixed-position, so it renders here but appears in the corner.
      preview('toasts()'),

      h2('В панели приложения'),
      demo(`appBar({ brand: 'sitelo' },
  appBarSpacer(),
  appBarActions(
    themeToggle(),
    menu({
      align: 'end',
      label: 'Ещё',
      variant: 'ghost',
      icon: icon('more-horizontal'),
    },
      menuItem({ href: '/ru/docs' }, 'Документация'),
      menuItem({ href: '/ru/examples' }, 'Примеры'),
      menuSeparator(),
      menuItem({ href: 'https://github.com/paul-browne/sitelo' }, 'GitHub'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Доступность'),
      p(
        'Панель имеет ',
        code('role="menu"'),
        ', её пункты — ',
        code('role="menuitem"'),
        ', а summary несёт ',
        code('aria-haspopup'),
        '. ',
        code('<details>'),
        ' не является нативным меню-виджетом, так что это разумное приближение, а не идеал: для обычного списка ссылок ',
        code('nav'),
        ' внутри details ничуть не хуже и обещает меньше.',
      ),

      h2('Пропсы'),
      p(code('menu()'), ' — пропсы триггера те же, что у кнопки:'),
      propsTable([
        ['trigger', 'Child', '', 'Видимая подпись. Передавайте текст, а не готовый button().'],
        ['icon', 'Child', '', 'Разметка перед подписью или сама по себе — для триггера из одной иконки.'],
        ['label', 'string', '', 'Доступное имя. Обязателен, когда есть иконка и нет текста trigger.'],
        ['variant', "'solid' | 'soft' | 'outline' | 'ghost' | 'link'", "'outline'", 'Оформление триггера.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", 'Из какой палитры берёт цвета триггер.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Размер триггера.'],
        ['align', "'start' | 'end'", "'start'", 'По какому краю триггера выравнивается панель.'],
        ['triggerClass', 'string', '', 'Дополнительные классы для триггера, а не для обёртки details.'],
      ]),
      p(code('menuItem()'), ':'),
      propsTable([
        ['href', 'string', '', 'Рисует ссылку; без него — кнопку.'],
        ['icon', 'Child', '', 'Разметка перед подписью.'],
        ['as', 'string', "'button'", 'Какой элемент рендерить, когда href нет.'],
      ]),
      p(code('menuSeparator()'), ' пропсов не принимает — это тонкая линия между группами пунктов.'),
    ],
  })
