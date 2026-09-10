import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/ru.js'

export default () =>
  uiLayout({
    title: 'Макет',
    description:
      'Скриншот в рамке — браузер, окно, телефон или терминал.',
    activeHref: '/ru/ui/mockup',
    children: [
      p(
        'Чтобы показать продукт на посадочной странице или скриншот в документации. Рамка — это декорация: точки, адресная строка и вырез помечены ',
        code('aria-hidden'),
        ', поэтому скринридер получает содержимое, а не описание обвязки.',
      ),

      h2('Браузер'),
      demo(`mockup({ variant: 'browser', url: 'sitelo.dev' },
  div({ style: 'padding: 1.5rem; background: var(--su-surface-2)' },
    stack({ gap: 'sm' },
      text({ variant: 'h5', as: 'div' }, 'Привет, мир'),
      text({ variant: 'small', tone: 'muted' }, 'Отрендерено на сборке, отдаётся статическим файлом.'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Окно'),
      p('Та же рамка без адресной строки — для всего, что не является веб-страницей.'),
      demo(`mockup({ variant: 'window' },
  div({ style: 'padding: 1.5rem' },
    text({ variant: 'small' }, 'Окно без URL.'),
  ),
)`, { align: 'stretch' }),

      h2('Светофорные кнопки'),
      p(
        'По умолчанию кнопки следуют теме. ',
        code("dots: 'mac'"),
        ' красит их в красный, жёлтый и зелёный macOS — одни и те же в обеих темах, ведь весь их смысл в узнаваемости.',
      ),
      demo(`mockup({ variant: 'browser', url: 'sitelo.dev', dots: 'mac' },
  div({ style: 'padding: 1.5rem' },
    text({ variant: 'small' }, 'Окно, которое вы уже где-то видели.'),
  ),
)`, { align: 'stretch' }),

      h2('Терминал'),
      p(
        'Вариант ',
        code('code'),
        ' тёмный в обеих темах — как и положено терминалу.',
      ),
      demo(`mockup({ variant: 'code' },
  '<div>$ npm install -D sitelo</div>' +
  '<div>$ npx sitelo build</div>' +
  '<div style="opacity: .7">✓ собрано за 1,09 с</div>' +
  '<div style="opacity: .7">  204 страницы · 9,7 МБ</div>',
)`, { align: 'stretch' }),

      h2('Телефон'),
      p(
        'Современный аппарат: «динамический остров», парящий в стороне от рамки, а не вырез, прорезанный в ней. Оставьте ему место в верхней части экрана.',
      ),
      demo(`mockup({ variant: 'phone' },
  div({ style: 'padding: 3rem 1rem 1rem' },
    stack({ gap: 'md' },
      text({ variant: 'h6', as: 'div' }, 'sitelo'),
      text({ variant: 'caption', tone: 'muted' }, 'Статические сайты без фреймворка.'),
      button({ size: 'sm', block: true }, 'Начать'),
    ),
  ),
)`),

      h2('Рамка и остров'),
      p(
        code('frame'),
        ' подкрашивает внешний бортик — любой CSS-цвет, поэтому отделка корпуса задаётся hex-кодом, а не именем, список которых пришлось бы вести этой библиотеке. ',
        code('notch: false'),
        ' убирает остров для всего, у чего его нет.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', wrap: true },
  mockup({ variant: 'phone', size: 'sm', frame: '#a8674a' }, ''),
  mockup({ variant: 'phone', size: 'sm', frame: '#2c3644' }, ''),
  mockup({ variant: 'phone', size: 'sm', frame: '#c9ced4', notch: false }, ''),
)`, { align: 'stretch' }),

      h2('Со скриншотом'),
      p(
        code('<img>'),
        ' внутри тела заполняет ширину рамки. Сочетайте его с ',
        code('aspectRatio()'),
        ', если картинка грузится поздно, а странице прыгать нельзя.',
      ),
      demo(`mockup({ variant: 'browser', url: 'sitelo.dev/ui' },
  aspectRatio({ ratio: '16 / 9', style: 'background: var(--su-surface-2)' },
    '<img src="/logo.svg" alt="Галерея sitelo UI" style="object-fit: contain; padding: 3rem">',
  ),
)`, { align: 'stretch' }),

      h2('Размеры'),
      p(
        'По умолчанию макет заполняет свой контейнер. ',
        code('size'),
        ' вместо этого закрепляет его на фиксированной ширине. У телефона свои три — 22rem телефона были бы уже планшетом, — и на всех он сохраняет пропорции: скругления, бортик и остров заданы долями ширины, а не фиксированными длинами.',
      ),
      demo(`stack({ gap: 'md', align: 'flex-start' },
  mockup({ variant: 'window', size: 'sm' }, div({ style: 'padding: 1rem' }, text({ variant: 'small' }, 'size: sm'))),
  mockup({ variant: 'window' }, div({ style: 'padding: 1rem' }, text({ variant: 'small' }, 'по умолчанию — во всю ширину'))),
)`, { align: 'stretch' }),

      h2('В hero-блоке'),
      p(
        'Ради этой пары всё и затевалось: передайте макет в ',
        code('media'),
        ' hero-блока.',
      ),
      demo(`hero({
  level: 2,
  align: 'start',
  title: 'Посмотрите в деле',
  description: 'К моменту прихода в браузер это уже статический HTML.',
  media: mockup({ variant: 'browser', url: 'example.com' },
    div({ style: 'padding: 1.25rem; background: var(--su-surface-2)' },
      text({ variant: 'small' }, 'Страница в рамке.'),
    ),
  ),
}, button('Начать'))`, { align: 'stretch' }),

      h2('Пропсы'),
      propsTable([
        ['variant', "'browser' | 'window' | 'phone' | 'code'", "'browser'", 'Какую рамку рисовать.'],
        ['url', 'string', '', 'Показывается в адресной строке. Только для варианта browser.'],
        ['dots', "'mono' | 'mac'", "'mono'", 'Как выглядят три кнопки.'],
        ['frame', 'string', '', 'Подкрашивает внешний бортик. Любой CSS-цвет. Только для phone.'],
        ['notch', 'boolean', 'true', 'Рисовать «динамический остров». Только для phone.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Фиксированная ширина. Средний заполняет контейнер.'],
      ]),
    ],
  })
