import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/ru.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Сворачиваемый блок',
    description:
      'Одно «показать больше» без рамок и группировки аккордеона.',
    activeHref: '/ru/ui/collapsible',
    extraHead: uiHead(),
    children: [
      p(
        'Сворачиваемый блок — это одиночный ',
        code('<details>'),
        ', тот же элемент, из которого собран аккордеон, только без всего его обрамления. Берите его для одной необязательной подробности посреди страницы; берите ',
        code('accordion()'),
        ', когда таких блоков набор.',
      ),
      p(
        'Скрипт ему не нужен, а поскольку содержимое остаётся в документе, оно находится и поиском по странице в браузере, и поисковой системой.',
      ),

      h2('Простой блок'),
      demo(`collapsible({ trigger: 'Показать сгенерированный конфиг' },
  text({ variant: 'small' }, 'Всё, что sitelo пишет, когда вы запускаете сборку без собственного файла конфигурации.'),
)`, { align: 'stretch' }),

      h2('Открыт по умолчанию'),
      demo(`collapsible({ trigger: 'Зачем это нужно', open: true },
  text({ variant: 'small' }, 'Потому что страница, прячущая объяснение за кликом, — это страница, которую никто не читает.'),
)`, { align: 'stretch' }),

      h2('Расширенное содержимое'),
      demo(`collapsible({ trigger: 'Показать весь вывод' },
  stack({ gap: 'sm' },
    code('dist/index.html'),
    code('dist/404.html'),
    code('dist/sitemap.xml'),
  ),
)`, { align: 'stretch' }),

      h2('Внутри других элементов'),
      p('Сворачиваемый блок прекрасно живёт внутри карточки, уведомления или ячейки таблицы.'),
      demo(`stack({ gap: 'md' },
  card(
    cardHeader({ title: 'Сборка не удалась', subtitle: '2 битые ссылки' }),
    cardBody(
      collapsible({ trigger: 'Показать проблемные ссылки' },
        list({ plain: true },
          listItem({ title: '/docs/old-routing', description: 'ссылка со страницы /docs' }),
          listItem({ title: '/blog/draft', description: 'ссылка со страницы /blog' }),
        ),
      ),
    ),
  ),
  alert({ color: 'warning', title: 'Медленная страница' },
    stack({ gap: 'sm' },
      text({ variant: 'small' }, 'Одна страница рендерилась дольше 500 мс.'),
      collapsible({ trigger: 'Показать тайминги' },
        text({ variant: 'small' }, '/examples/wordpress — 512 мс'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Триггер'),
      p(
        'Держите его в рамках текста и иконок. ',
        code('<summary>'),
        ' уже интерактивен, поэтому кнопка или ссылка внутри вкладывает два элемента управления туда, где действие всего одно, — то же правило, которому следует ',
        code('menu()'),
        '.',
      ),

      h2('Сворачиваемый блок или аккордеон?'),
      p(
        'Одно раскрытие само по себе — ',
        code('collapsible()'),
        '. Набор таких, в рамках и сгруппированный, при желании с одним открытым за раз, — ',
        code('accordion()'),
        '.',
      ),

      h2('Пропсы'),
      propsTable([
        ['trigger', 'Child', '', 'Содержимое заголовка. Только текст и иконки.'],
        ['open', 'boolean', 'false', 'Раскрыт ли изначально.'],
      ]),
    ],
  })
