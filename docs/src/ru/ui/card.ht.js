import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/ru.js'

export default () =>
  uiLayout({
    title: 'Карточка',
    description:
      'Поверхность для сгруппированного содержимого: шапка, тело, подвал и медиа, которые умеют уживаться вместе.',
    activeHref: '/ru/ui/card',
    children: [
      p(
        'Карточка собирает связанное содержимое на собственной поверхности. Её части — ',
        code('cardHeader()'),
        ', ',
        code('cardMedia()'),
        ', ',
        code('cardBody()'),
        ', ',
        code('cardFooter()'),
        ' — это отдельные функции, а не пропсы, поэтому вы берёте только нужные и ставите их в том порядке, какого требует макет.',
      ),

      h2('Простая карточка'),
      demo(`card(
  cardHeader({ title: 'Файловая маршрутизация', subtitle: 'src/about.ht.js → /about' }),
  cardBody(text({ variant: 'small', tone: 'muted' }, 'Папки становятся путями. Скобки становятся параметрами. Никакого роутера настраивать не нужно.')),
)`, { align: 'stretch' }),

      h2('Варианты'),
      p(
        'Outlined — по умолчанию. Elevated меняет рамку на тень, а flat вместо того и другого подкрашивает поверхность.',
      ),
      demo(`grid({ min: '13rem' },
  card({ variant: 'outlined' }, cardBody(text({ variant: 'small' }, 'Outlined'))),
  card({ variant: 'elevated' }, cardBody(text({ variant: 'small' }, 'Elevated'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Flat'))),
)`, { align: 'stretch' }),

      h2('С подвалом'),
      p(
        code('divided'),
        ' добавляет тонкую линию над подвалом. Подвал прижимается к низу, поэтому у карточек в ряд действия выстраиваются на одной линии, даже когда текст сверху разной длины.',
      ),
      demo(`grid({ min: '14rem' },
  card(
    cardHeader({ title: 'Базовый сайт' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'Минимальный проект плюс конфигурации развёртывания.')),
    cardFooter({ divided: true }, button({ size: 'sm', variant: 'soft' }, 'Открыть')),
  ),
  card(
    cardHeader({ title: 'Блог на Markdown' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'Папка .md-файлов, отрендеренных в статические страницы, с RSS-лентой и вообще без клиентского JavaScript.')),
    cardFooter({ divided: true }, button({ size: 'sm', variant: 'soft' }, 'Открыть')),
  ),
)`, { align: 'stretch' }),

      h2('Медиа'),
      p(
        code('cardMedia()'),
        ' заполняет верх карточки с фиксированным соотношением сторон, поэтому ряд карточек остаётся ровным, какими бы ни были исходные картинки.',
      ),
      demo(`grid({ min: '13rem' },
  card(
    cardMedia({ src: '/logo.svg', alt: '', style: 'background: var(--su-surface-2); object-fit: contain; padding: 1rem' }),
    cardBody(text({ variant: 'small' }, 'По умолчанию 16 / 9')),
  ),
  card(
    cardMedia({ src: '/logo.svg', alt: '', ratio: '4 / 3', style: 'background: var(--su-surface-2); object-fit: contain; padding: 1rem' }),
    cardBody(text({ variant: 'small' }, 'ratio: 4 / 3')),
  ),
)`, { align: 'stretch' }),

      h2('Вся карточка как ссылка'),
      p(
        'Задайте карточке ',
        code('href'),
        ' — и вся поверхность станет одной ссылкой, вместе с приподниманием при наведении. Не кладите кнопки и другие ссылки внутрь карточки в таком виде: интерактивное содержимое не может быть вложено в ссылку. Лучше поставьте кнопку в подвал обычной карточки.',
      ),
      demo(`grid({ min: '14rem' },
  card({ href: '/ru/docs/routing' },
    cardHeader({ title: 'Маршрутизация', subtitle: 'Читать руководство' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'Динамические маршруты, перехватчики и группы маршрутов.')),
  ),
  card({ href: '/ru/docs/data' },
    cardHeader({ title: 'Загрузка данных', subtitle: 'Читать руководство' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'data() выполняется на сборке, с кэшированием fetch.')),
  ),
)`, { align: 'stretch' }),

      h2('Внутренние отступы'),
      p(
        'Один проп задаёт отступы сразу для всех частей карточки.',
      ),
      demo(`stack({ gap: 'md' },
  card({ padding: 'sm' }, cardBody(text({ variant: 'small' }, 'padding: sm'))),
  card({ padding: 'xl' }, cardBody(text({ variant: 'small' }, 'padding: xl'))),
)`, { align: 'stretch' }),

      h2('Свободное содержимое'),
      p(
        'Части — это удобство, а не обязанность: карточка принимает любых потомков, а ',
        code('cardHeader()'),
        ' принимает собственных потомков рядом с заголовком — для аватара или кнопки меню справа.',
      ),
      demo(`card(
  cardHeader(
    { title: 'Paul Browne', subtitle: 'Развёрнуто 4 минуты назад' },
    avatar({ name: 'Paul Browne', size: 'sm' }),
  ),
  cardBody(
    stack({ direction: 'row', gap: 'sm', wrap: true },
      chip({ color: 'success', dot: true }, 'Сборка прошла'),
      chip({ color: 'neutral' }, '12 страниц'),
      chip({ color: 'neutral' }, '4,1 кБ'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Пропсы'),
      p(code('card()'), ':'),
      propsTable([
        ['variant', "'outlined' | 'elevated' | 'flat'", "'outlined'", 'Как поверхность отделяется от страницы.'],
        ['href', 'string', '', 'Рендерит всю карточку как ссылку.'],
        ['padding', 'Space', "'lg'", 'Отступы, которые использует каждая часть карточки.'],
      ]),
      p('Части:'),
      propsTable([
        ['cardHeader', 'title, subtitle', '', 'Заголовок и подзаголовок плюс любые потомки рядом с ними.'],
        ['cardTitle', 'as', "'h3'", 'Заголовок сам по себе, когда шапка собирается вручную.'],
        ['cardSubtitle', '', '', 'Приглушённая строка под заголовком.'],
        ['cardMedia', 'src, alt, ratio', "'16 / 9'", 'Обложка с фиксированным соотношением сторон.'],
        ['cardBody', '', '', 'Основная область содержимого.'],
        ['cardFooter', 'divided', 'false', 'Нижний ряд действий; divided добавляет тонкую линию сверху.'],
      ], { headers: ['Часть', 'Пропсы', 'По умолчанию', 'Описание'] }),
    ],
  })
