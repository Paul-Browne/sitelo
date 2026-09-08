import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/ru.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Модальное окно',
    description:
      'Диалог на popover API: открытие, затемнение, клик снаружи и Escape берёт на себя браузер.',
    activeHref: '/ru/ui/modal',
    extraHead: uiHead(),
    children: [
      p(
        'Модальное окно — это элемент ',
        code('popover'),
        '. Любая кнопка, чей ',
        code('popovertarget'),
        ' совпадает с ',
        code('id'),
        ' окна, открывает его — и нигде никакого скрипта, включая затемнение, закрытие по клику снаружи, Escape и работу с фокусом: всем этим владеет браузер.',
      ),
      p(
        'Поэтому ',
        code('id'),
        ' обязателен, и поэтому без него компонент бросает ошибку: id — это и есть вся проводка.',
      ),

      h2('Простое окно'),
      p('Каждое модальное окно на этой странице по-настоящему открывается — попробуйте.'),
      demo(`fragment(
  button({ popovertarget: 'demo-basic' }, 'Открыть окно'),
  modal({ id: 'demo-basic', title: 'Пересобрать сайт?' },
    'Это запустит sitelo build и заново опубликует dist/.',
  ),
)`),

      h2('С подвалом'),
      p(
        'Кнопка закрытия — это любая кнопка, указывающая на тот же id с ',
        code('popovertargetaction="hide"'),
        '.',
      ),
      demo(`fragment(
  button({ color: 'danger', popovertarget: 'demo-confirm' }, 'Удалить страницу…'),
  modal({
    id: 'demo-confirm',
    title: 'Удалить эту страницу?',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({
        variant: 'ghost',
        color: 'neutral',
        popovertarget: 'demo-confirm',
        popovertargetaction: 'hide',
      }, 'Отмена'),
      button({ color: 'danger' }, 'Удалить'),
    ),
  }, 'Это не отменить. Сгенерированный HTML исчезнет при следующей сборке.'),
)`),

      h2('Размеры'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm', wrap: true },
    button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-sm' }, 'Маленькое'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-md' }, 'Среднее'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-lg' }, 'Большое'),
  ),
  modal({ id: 'demo-sm', size: 'sm', title: 'Маленькое' }, 'size: sm — около 24rem.'),
  modal({ id: 'demo-md', title: 'Среднее' }, 'Значение по умолчанию — около 32rem.'),
  modal({ id: 'demo-lg', size: 'lg', title: 'Большое' }, 'size: lg — около 48rem.'),
)`),

      h2('Формы внутри окна'),
      demo(`fragment(
  button({ variant: 'soft', popovertarget: 'demo-form' }, 'Новая страница…'),
  modal({
    id: 'demo-form',
    title: 'Новая страница',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({ variant: 'ghost', color: 'neutral', popovertarget: 'demo-form', popovertargetaction: 'hide' }, 'Отмена'),
      button({ type: 'submit' }, 'Создать'),
    ),
  },
    stack({ gap: 'md' },
      textField({ label: 'Заголовок', name: 'modal-title', placeholder: 'О проекте' }),
      selectField({ label: 'Расширение', name: 'modal-ext', options: ['.ht.js', '.ht.ts', '.ht.jsx'] }),
    ),
  ),
)`),

      h2('Без кнопки закрытия'),
      p(
        code('closable: false'),
        ' убирает × в углу. Escape и клик снаружи всё равно закрывают окно: popover нельзя сделать по-настоящему блокирующим, да и это обычно правильное поведение.',
      ),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-bare' }, 'Без кнопки закрытия'),
  modal({ id: 'demo-bare', title: 'Нажмите Escape', closable: false },
    'Или кликните в любом месте за пределами этого диалога.',
  ),
)`),

      h2('Длинное содержимое'),
      p('Тело прокручивается; шапка и подвал остаются на месте.'),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-long' }, 'Длинное окно'),
  modal({
    id: 'demo-long',
    title: 'Заметки о выпуске',
    footer: button({ popovertarget: 'demo-long', popovertargetaction: 'hide' }, 'Закрыть'),
  },
    stack({ gap: 'md' },
      ...Array.from({ length: 12 }, (unused, index) =>
        text({ variant: 'small', tone: 'muted' }, 'Изменение ' + (index + 1) + ' — что-то починили.'),
      ),
    ),
  ),
)`),

      h2('Прокрутка фона'),
      p(
        'Страница за открытым окном не прокручивается. Это единственное, что popover API оставляет на вас, и здесь оно сделано на CSS — без скрипта и без всякой инициализации. Передайте ',
        code('lockScroll: false'),
        ', чтобы фон прокручивался как обычно.',
      ),

      h2('Поддержка браузерами'),
      p(
        'Popover API есть во всех современных браузерах. В слишком старом, который о нём не знает, окно отрисуется прямо в потоке страницы, а не поверх неё: видимое и рабочее, просто не наложенное сверху. Ничего не пропадает.',
      ),

      h2('Пропсы'),
      propsTable([
        ['id', 'string', '', 'Обязателен. То, на что указывает popovertarget кнопки-триггера.'],
        ['title', 'Child', '', 'Заголовок и доступное имя диалога.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Максимальная ширина.'],
        ['footer', 'Child', '', 'Нижний ряд на собственной подкрашенной полосе.'],
        ['closable', 'boolean', 'true', 'Показывать × в шапке.'],
        ['closeLabel', 'string', "'Close'", 'Доступное имя этой кнопки.'],
        ['lockScroll', 'boolean', 'true', 'Не давать странице за окном прокручиваться, пока оно открыто.'],
      ]),
      p(
        code('closeButton({ target })'),
        ' рисует этот × отдельно — для шапки, которую вы собираете сами.',
      ),
    ],
  })
