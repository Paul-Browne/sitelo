import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/ru.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Подвал',
    description:
      'Низ сайта: колонки ссылок и строка под ними.',
    activeHref: '/ru/ui/footer',
    extraHead: uiHead(),
    children: [
      p(
        'Подвал — это самоподстраивающаяся сетка колонок плюс необязательная нижняя строка, которая всегда занимает всю ширину, сколько бы колонок ни было.',
      ),
      p(
        'Он экспортируется и как ',
        code('footer'),
        ', и как ',
        code('siteFooter'),
        ', потому что ',
        code('footer'),
        ' — это ещё и элемент ',
        code('<footer>'),
        ' из javascript-to-html, а импортировать оба под одним именем — синтаксическая ошибка.',
      ),

      h2('Простой подвал'),
      demo(`footer(
  footerColumn({ title: 'Документация' },
    '<a href="/ru/docs">Начало работы</a>',
    '<a href="/ru/docs/routing">Маршрутизация</a>',
    '<a href="/ru/docs/data">Загрузка данных</a>',
  ),
  footerColumn({ title: 'Компоненты' },
    '<a href="/ru/ui">Обзор</a>',
    '<a href="/ru/ui/button">Кнопка</a>',
    '<a href="/ru/ui/card">Карточка</a>',
  ),
  footerColumn({ title: 'Проект' },
    '<a href="https://github.com/paul-browne/sitelo">GitHub</a>',
    '<a href="https://www.npmjs.com/package/sitelo">npm</a>',
  ),
)`, { align: 'stretch' }),

      h2('С нижней строкой'),
      p(
        code('footerBottom()'),
        ' растягивается на все колонки, поэтому остаётся строкой во всю ширину, что бы ни делала сетка над ней.',
      ),
      demo(`footer(
  footerColumn({ title: 'Документация' }, '<a href="/ru/docs">Руководство</a>', '<a href="/ru/ui">Компоненты</a>'),
  footerColumn({ title: 'Примеры' }, '<a href="/ru/examples">Все примеры</a>'),
  footerBottom(
    text({ variant: 'caption' }, '© 2026 Paul Browne · MIT'),
    stack({ direction: 'row', gap: 'sm' },
      chip({ size: 'sm', color: 'neutral' }, 'v2.7'),
      chip({ size: 'sm', color: 'success', dot: true }, 'Сборка проходит'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Колонка с маркой'),
      p(
        'Колонка не обязана состоять из ссылок. Всё, что вы передаёте потомком самого ',
        code('footer()'),
        ', а не колонки, занимает в сетке собственную ячейку.',
      ),
      demo(`footer(
  div(
    stack({ gap: 'sm' },
      text({ variant: 'h5', as: 'div' }, 'sitelo'),
      text({ variant: 'small', tone: 'muted' }, 'Генерация статических сайтов без настройки, на Vite.'),
    ),
  ),
  footerColumn({ title: 'Документация' }, '<a href="/ru/docs">Руководство</a>', '<a href="/ru/ui">Компоненты</a>'),
  footerColumn({ title: 'Проект' }, '<a href="#">GitHub</a>', '<a href="#">npm</a>'),
)`, { align: 'stretch' }),

      h2('Фиксированные колонки'),
      p(
        'По умолчанию колонки подстраиваются сами. ',
        code('columns'),
        ' принимает любое значение ',
        code('grid-template-columns'),
        ', когда вам нужна конкретная форма — скажем, широкая колонка марки и две узкие колонки ссылок.',
      ),
      demo(`footer({ columns: '2fr 1fr 1fr' },
  div(text({ variant: 'small', tone: 'muted' }, 'Более широкая первая колонка для марки и фразы о ней.')),
  footerColumn({ title: 'Документация' }, '<a href="/ru/docs">Руководство</a>'),
  footerColumn({ title: 'Ещё' }, '<a href="/ru/examples">Примеры</a>'),
)`, { align: 'stretch' }),

      h2('Только нижняя строка'),
      demo(`footer(
  footerBottom(text({ variant: 'caption' }, '© 2026 · Сделано на sitelo')),
)`, { align: 'stretch' }),

      h2('Пропсы'),
      p(code('footer()'), ':'),
      propsTable([
        ['columns', 'string', '', 'Значение grid-template-columns. Без него колонки подстраиваются сами.'],
        ['as', 'string', "'footer'", 'Какой элемент рендерить.'],
      ]),
      propsTable([
        ['footerColumn', 'title', '', 'Колонка с заголовком; потомки становятся списком ссылок.'],
        ['footerBottom', '', '', 'Строка во всю ширину под колонками.'],
      ], { headers: ['Часть', 'Пропсы', 'По умолчанию', 'Описание'] }),
    ],
  })
