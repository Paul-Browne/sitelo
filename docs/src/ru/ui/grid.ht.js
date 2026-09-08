import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/ru.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Сетка',
    description:
      'Отзывчивая сетка, вмещающая столько колонок, сколько влезет: без брейкпоинтов и медиазапросов.',
    activeHref: '/ru/ui/grid',
    extraHead: uiHead(),
    children: [
      p(
        'Без ',
        code('columns'),
        ' сетка вмещает столько дорожек шириной не меньше ',
        code('min'),
        ', сколько позволяет место, и каждая поровну делит остаток. Именно этого хочет список карточек, и брейкпоинты тут не нужны: измените размер страницы, и демо ниже перестроятся сами.',
      ),

      h2('Автоподбор'),
      p('Поведение по умолчанию. Дорожки не уже 16rem.'),
      demo(`grid(
  ...['Маршрутизация', 'Загрузка данных', 'Ресурсы', 'Изображения', 'Острова', 'Поиск'].map((name) =>
    card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, name))),
  ),
)`, { align: 'stretch' }),

      h2('Ширина дорожки'),
      p(
        code('min'),
        ' задаёт, насколько узкой может стать дорожка, прежде чем сетка перейдёт на меньшее число колонок. Меньше значит больше колонок.',
      ),
      demo(`grid({ min: '9rem' },
  ...['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'].map((name) =>
    card({ variant: 'flat' }, cardBody(text({ variant: 'small', align: 'center' }, name))),
  ),
)`, { align: 'stretch' }),

      h2('Фиксированное число колонок'),
      p(
        'Передайте число, когда количество не должно меняться вместе с окном. Каждая дорожка получает равную долю.',
      ),
      demo(`grid({ columns: 3 },
  ...['Раз', 'Два', 'Три'].map((name) =>
    card({ variant: 'flat' }, cardBody(text({ variant: 'small', align: 'center' }, name))),
  ),
)`, { align: 'stretch' }),

      h2('Своя раскладка'),
      p(
        'Строка передаётся напрямую в ',
        code('grid-template-columns'),
        ' — для деления «боковая панель и содержимое» или чего угодно ещё, что умеет выразить CSS grid.',
      ),
      demo(`grid({ columns: '12rem 1fr', gap: 'lg' },
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Боковая панель'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Содержимое, забирающее остаток строки.'))),
)`, { align: 'stretch' }),

      h2('Промежуток и выравнивание'),
      demo(`grid({ min: '10rem', gap: 'xl', align: 'center' },
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Короткая'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Карточка повыше, с двумя строками текста, чтобы показать, что align делает с её более низкими соседками.'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Короткая'))),
)`, { align: 'stretch' }),

      h2('Пропсы'),
      propsTable([
        ['columns', 'number | string', '', 'Фиксированное число дорожек или обычное значение grid-template-columns. Опустите для автоподбора.'],
        ['min', 'string', "'16rem'", 'Минимальная ширина дорожки при автоподборе.'],
        ['gap', 'Space', "'md'", 'Промежуток между дорожками и строками.'],
        ['align', 'string', "'stretch'", 'Любое значение align-items.'],
        ['as', 'string', "'div'", 'Какой элемент рендерить.'],
      ]),
      p(
        'Дорожка никогда не становится шире самой сетки, даже если ',
        code('min'),
        ' больше доступного места, — поэтому минимум в 16rem не вызывает горизонтальную прокрутку на телефоне шириной 320 px.',
      ),
    ],
  })
