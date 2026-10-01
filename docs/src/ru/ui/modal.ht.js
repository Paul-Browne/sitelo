import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/ru.js'

export default () =>
  uiLayout({
    title: 'Модальное окно',
    description:
      'Настоящий <dialog>, открытый модально: затемнение, фокус, Escape и клик снаружи берёт на себя браузер.',
    activeHref: '/ru/ui/modal',
    children: [
      p(
        'Модальное окно — это ',
        code('<dialog>'),
        '. Любая кнопка с ',
        code('commandfor'),
        ', указывающим на ',
        code('id'),
        ' окна, и ',
        code("command: 'show-modal'"),
        ' открывает его модально: страница позади становится инертной, так что фокус и экранный диктор остаются внутри. И нигде никакого скрипта — затемнением, Escape и кликом снаружи владеет браузер.',
      ),
      p(
        'Поэтому ',
        code('id'),
        ' обязателен, и поэтому без него компонент бросает ошибку: id — это и есть вся проводка.',
      ),

      h2('Простое окно'),
      p('Каждое модальное окно на этой странице по-настоящему открывается — попробуйте.'),
      demo(`fragment(
  button({ commandfor: 'demo-basic', command: 'show-modal' }, 'Открыть окно'),
  modal({ id: 'demo-basic', title: 'Пересобрать сайт?' },
    'Это запустит sitelo build и заново опубликует dist/.',
  ),
)`),

      h2('С подвалом'),
      p(
        'Кнопка закрытия — это любая кнопка, указывающая на тот же id с ',
        code("command: 'close'"),
        '.',
      ),
      demo(`fragment(
  button({ color: 'danger', commandfor: 'demo-confirm', command: 'show-modal' }, 'Удалить страницу…'),
  modal({
    id: 'demo-confirm',
    title: 'Удалить эту страницу?',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({
        variant: 'ghost',
        color: 'neutral',
        commandfor: 'demo-confirm',
        command: 'close',
      }, 'Отмена'),
      button({ color: 'danger' }, 'Удалить'),
    ),
  }, 'Это не отменить. Сгенерированный HTML исчезнет при следующей сборке.'),
)`),

      h2('Размеры'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm', wrap: true },
    button({ variant: 'outline', color: 'neutral', commandfor: 'demo-sm', command: 'show-modal' }, 'Маленькое'),
    button({ variant: 'outline', color: 'neutral', commandfor: 'demo-md', command: 'show-modal' }, 'Среднее'),
    button({ variant: 'outline', color: 'neutral', commandfor: 'demo-lg', command: 'show-modal' }, 'Большое'),
  ),
  modal({ id: 'demo-sm', size: 'sm', title: 'Маленькое' }, 'size: sm — около 24rem.'),
  modal({ id: 'demo-md', title: 'Среднее' }, 'Значение по умолчанию — около 32rem.'),
  modal({ id: 'demo-lg', size: 'lg', title: 'Большое' }, 'size: lg — около 48rem.'),
)`),

      h2('Формы внутри окна'),
      demo(`fragment(
  button({ variant: 'soft', commandfor: 'demo-form', command: 'show-modal' }, 'Новая страница…'),
  modal({
    id: 'demo-form',
    title: 'Новая страница',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({ variant: 'ghost', color: 'neutral', commandfor: 'demo-form', command: 'close' }, 'Отмена'),
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
        ' убирает × в углу. Escape и клик снаружи всё равно закрывают окно; с ',
        code("closedby: 'closerequest'"),
        ' его закрывает только Escape.',
      ),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', commandfor: 'demo-bare', command: 'show-modal' }, 'Без кнопки закрытия'),
  modal({ id: 'demo-bare', title: 'Нажмите Escape', closable: false },
    'Или кликните в любом месте за пределами этого диалога.',
  ),
)`),

      h2('Длинное содержимое'),
      p('Тело прокручивается; шапка и подвал остаются на месте.'),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', commandfor: 'demo-long', command: 'show-modal' }, 'Длинное окно'),
  modal({
    id: 'demo-long',
    title: 'Заметки о выпуске',
    footer: button({ commandfor: 'demo-long', command: 'close' }, 'Закрыть'),
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
        'Страница за открытым окном не прокручивается. Это единственное, что модальный диалог оставляет на вас, и здесь оно сделано на CSS — без скрипта и без всякой инициализации. Передайте ',
        code('lockScroll: false'),
        ', чтобы фон прокручивался как обычно.',
      ),

      h2('Поддержка браузерами'),
      p(
        'Открыть диалог через command кнопки умеют все современные браузеры — Chrome 135, Firefox 144 и Safari 26.2 и новее. В более старом button() добавляет onclick, который загружает несколько сотен байт /su/dialog.js и делает то же самое — только там и только при первом клике. Закрывать окно кликом снаружи (closedby) Safari пока не умеет — там этим тоже занимается тот же файл.',
      ),

      h2('Пропсы'),
      propsTable([
        ['id', 'string', '', 'Обязателен. То, на что указывает commandfor кнопки-триггера.'],
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
