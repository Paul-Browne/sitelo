import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/ru.js'

export default () =>
  uiLayout({
    title: 'Вкладки',
    description:
      'Три формы: ссылки, по странице на вкладку; панели, которые подменяются на месте; или панели, которыми правит URL.',
    activeHref: '/ru/ui/tabs',
    children: [
      p(
        'Дайте каждому элементу ',
        code('href'),
        ' — и вкладки станут ссылками: по странице на вкладку, без скрипта, с ',
        code('aria-current'),
        ' на активной. Дайте каждому элементу ',
        code('panel'),
        ' — и они превратятся в группу радиокнопок, панели которой подменяются на месте, и скрипта по-прежнему нет.',
      ),
      p(
        'На статическом сайте обычно правильна форма со ссылками: она даёт каждому виду свой URL и переживает выключенный JavaScript. Берите панели, когда содержимого немного и переключение не должно стоить перехода.',
      ),

      h2('Вкладки-ссылки'),
      p(
        'Это действительно ссылки: по клику происходит переход. Подчёркивание берётся из ',
        code('active'),
        ' или ',
        code('value'),
        ' на сборке, а не из клика, — каждая страница помечает свою вкладку. Сама по себе вкладка-ссылка на URL не реагирует: для этого переключайтесь на месте панелями ниже.',
      ),
      demo(`tabs({
  items: [
    { label: 'Хлебные крошки', href: '/ru/ui/breadcrumbs' },
    { label: 'Вкладки', href: '/ru/ui/tabs', active: true },
    { label: 'Пагинация', href: '/ru/ui/pagination' },
  ],
})`, { align: 'stretch' }),

      h2('Вкладки с панелями'),
      p(
        'Вкладка — это ',
        code('<label>'),
        ' для радиокнопки, которую стили убирают с глаз, а показывается панель, идущая за отмеченной радиокнопкой. Страница ничего не импортирует: и переключение, и стрелки между вкладками — это то, что группа радиокнопок умеет сама.',
      ),
      demo(`tabs({
  value: 'install',
  items: [
    { id: 'install', label: 'Установка', panel: card({ variant: 'flat' }, cardBody(code('npm install sitelo javascript-to-html'))) },
    { id: 'use', label: 'Использование', panel: card({ variant: 'flat' }, cardBody(code("import * as ui from 'sitelo/ui'"))) },
    { id: 'build', label: 'Сборка', panel: card({ variant: 'flat' }, cardBody(code('sitelo build'))) },
  ],
})`, { align: 'stretch' }),

      h2('Вкладки со ссылкой'),
      p(
        'Дайте элементам с панелями ещё и ',
        code('href'),
        ' с фрагментом — и вместо радиокнопок будут ссылки: URL называет вкладку, ',
        code(':target'),
        ' её выделяет, показывается идущая за ней панель, а выбор переживает перезагрузку, отправленную ссылку и кнопку «назад». Id стоит на вкладке, а не на панели, потому что браузер подтягивает названное в URL к верхнему краю окна: с id на панели вкладки уехали бы за пределы экрана, на котором вы только что по ним щёлкнули. В документе может быть только один ',
        code(':target'),
        ', поэтому эта форма — для одного набора вкладок на странице. Саму прокрутку отменить нельзя: перейти по фрагменту и значит сдвинуть окно. Выбрать можно лишь, к чему оно едет и где остановится, — для этого id на вкладке и её ',
        code('scroll-margin-block-start'),
        ', который задаётся пропом ',
        code('scrollMargin'),
        ': липкой шапке нужна как минимум её собственная высота.',
      ),
      demo(`tabs({
  items: [
    { id: 'setup', label: 'Настройка', href: '#tab-setup', panel: card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Эта панель — #tab-setup: скопируйте URL, и она вернётся.'))) },
    { id: 'deploy', label: 'Деплой', href: '#tab-deploy', panel: card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'А эта — #tab-deploy.'))) },
  ],
})`, { align: 'stretch' }),

      h2('Пилюли'),
      demo(`stack({ gap: 'lg' },
  tabs({
    variant: 'pills',
    items: [
      { label: 'Все', href: '#all', active: true },
      { label: 'Руководства', href: '#guides' },
      { label: 'Примеры', href: '#examples' },
    ],
  }),
  tabs({
    variant: 'pills',
    value: 'js',
    items: [
      { id: 'js', label: 'JavaScript', panel: card({ variant: 'flat' }, cardBody(code('src/index.ht.js'))) },
      { id: 'ts', label: 'TypeScript', panel: card({ variant: 'flat' }, cardBody(code('src/index.ht.ts'))) },
      { id: 'jsx', label: 'JSX', panel: card({ variant: 'flat' }, cardBody(code('src/index.ht.jsx'))) },
    ],
  }),
)`, { align: 'stretch' }),

      h2('Цвета'),
      demo(`stack({ gap: 'lg' },
  tabs({ color: 'primary', items: [{ label: 'Primary', href: '#p', active: true }, { label: 'Другая', href: '#p2' }] }),
  tabs({ color: 'neutral', items: [{ label: 'Neutral', href: '#n', active: true }, { label: 'Другая', href: '#n2' }] }),
  tabs({ color: 'danger', items: [{ label: 'Danger', href: '#d', active: true }, { label: 'Другая', href: '#d2' }] }),
)`, { align: 'stretch' }),

      h2('Много вкладок'),
      p('Полоса вкладок прокручивается по горизонтали, а не переносится, поэтому ряд сохраняет форму и на телефоне. Вкладки с панелями, наоборот, переносятся: каждая панель обязана идти за своей вкладкой, так что прокручивать просто нечего.'),
      demo(`tabs({
  items: [
    'Обзор', 'Маршруты', 'Данные', 'Ресурсы', 'Изображения', 'Острова', 'TypeScript', 'CLI', 'Развёртывание',
  ].map((label, index) => ({ label, href: '#many-' + index, active: index === 0 })),
})`, { align: 'stretch' }),

      h2('Отключённая вкладка'),
      demo(`tabs({
  value: 'now',
  items: [
    { id: 'now', label: 'Доступно', panel: card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Эта работает.'))) },
    { id: 'soon', label: 'Скоро', disabled: true, panel: card({ variant: 'flat' }, cardBody('')) },
  ],
})`, { align: 'stretch' }),

      h2('Доступность'),
      p(
        'Форма с панелями — это настоящая группа радиокнопок: вкладки суть элементы ',
        code('<label>'),
        ' для радиокнопок с общим ',
        code('name'),
        ', поэтому скринридер называет, какая из скольких выбрана, а стрелки, Home и End работают без единого загруженного скрипта. Форма со ссылкой — это просто ссылки, и ',
        code('aria-current'),
        ' в ней нет: он был бы записан один раз и стал бы неправдой после первого же клика. Это намеренно не ARIA-tablist: ',
        code('aria-selected'),
        ' пишется один раз, на сервере, и CSS не может сохранять его правдивым по мере кликов. Форма со ссылками тоже не tablist: ссылки, которые ведут на другие страницы, — это ссылки, и приписывать им семантику вкладок значило бы врать о том, что они делают.',
      ),

      h2('Пропсы'),
      propsTable([
        ['items', 'Array', '[]', 'Строки или объекты { id, label, href, panel, active, disabled }.'],
        ['value', 'string', '', 'Id активного элемента. Иначе берётся active, а затем первый.'],
        ['variant', "'underline' | 'pills'", "'underline'", 'Чем помечается активная вкладка.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Цвет активной вкладки.'],
        ['label', 'string', "'Tabs'", 'Доступное имя группы. Только для формы с панелями.'],
        ['name', 'string', 'id первого элемента', 'Имя группы радиокнопок. Нужно, только если на странице два набора вкладок с панелями.'],
        ['href', 'string', '', 'У элемента: страница, на которую вести, — или, вместе с panel, фрагмент, который её называет.'],
        ['scrollMargin', 'Space', "'md'", 'Насколько выше вкладки останавливается окно. Только для формы :target.'],
      ]),
    ],
  })
