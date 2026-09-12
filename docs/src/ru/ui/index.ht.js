import { a, div, h2, li, p, span, ul } from 'javascript-to-html'
import { code, uiLayout } from '../../lib/ru.js'
import { preview } from '../../lib/ui-demo.js'

/**
 * По карточке на страницу компонента, сгруппированы ровно так же, как
 * справочник компонентов. Каждое `demo` рендерится вживую в свою карточку.
 */
const GROUPS = [
  ['Раскладка', [
    ['/ru/ui/container', 'Контейнер', 'Центрированная колонка страницы с ограниченной шириной.',
      `container({ size: 'sm', style: 'background: var(--su-surface-2); padding: 0.5rem; border-radius: 0.4rem' },
        text({ variant: 'caption', align: 'center' }, 'по центру'))`],
    ['/ru/ui/stack', 'Стек', 'Flex-строка или колонка с токеном интервала в качестве промежутка.',
      `stack({ direction: 'row', gap: 'sm' }, chip('раз'), chip('два'), chip('три'))`],
    ['/ru/ui/grid', 'Сетка', 'Вмещает столько колонок, сколько влезет, без медиазапросов.',
      `grid({ min: '3.5rem', gap: 'xs' },
        chip({ size: 'sm' }, '1'), chip({ size: 'sm' }, '2'), chip({ size: 'sm' }, '3'), chip({ size: 'sm' }, '4'))`],
    ['/ru/ui/divider', 'Разделитель', 'Линия между разделами, с подписью или без.',
      `div({ style: 'width: 100%' }, divider('или'))`],
    ['/ru/ui/aspect-ratio', 'Соотношение сторон', 'Держит блок в заданной форме, чтобы при загрузке ничего не прыгало.',
      `aspectRatio({ ratio: '16 / 9', style: 'width: 6rem; background: var(--su-surface-2); border-radius: 0.4rem' }, '')`],
    ['/ru/ui/card', 'Карточка', 'Поверхность для сгруппированного содержимого: шапка, тело и подвал.',
      `card({ variant: 'flat', style: 'width: 100%' }, cardBody(text({ variant: 'small' }, 'Карточка')))`],
  ]],
  ['Типографика', [
    ['/ru/ui/typography', 'Типографика', 'Шкала кеглей, которая сама выбирает элемент.',
      `stack({ gap: 'none' }, text({ variant: 'h5', as: 'div' }, 'Заголовок'), text({ variant: 'caption', tone: 'muted' }, 'Подпись'))`],
    ['/ru/ui/prose', 'Проза', 'Оформляет сырой HTML из Markdown или CMS.',
      `prose({ size: 'sm', style: 'text-align: left' }, '<p><strong>Заголовок</strong></p><p>И абзац.</p>')`],
    ['/ru/ui/link', 'Ссылка', 'Оформленный якорь с атрибутами, нужными внешней ссылке.',
      `text({ variant: 'small' }, 'Читайте ', link({ href: '/ru/docs' }, 'документацию'), '.')`],
    ['/ru/ui/icons', 'Иконки', '99 знаков на одной сетке, размер и цвет — от окружающего текста.',
      `stack({ direction: 'row', gap: 'sm', align: 'center' },
        icon('check'), icon('search'), icon('heart'), icon('zap'), icon('settings'))`],
  ]],
  ['Поля ввода', [
    ['/ru/ui/button', 'Кнопка', 'Пять вариантов, пять цветов, три размера.',
      `stack({ direction: 'row', gap: 'sm' }, button({ size: 'sm' }, 'Сохранить'), button({ size: 'sm', variant: 'outline' }, 'Отмена'))`],
    ['/ru/ui/button-group', 'Группа кнопок', 'Кнопки, слитые в один элемент управления.',
      `buttonGroup({ label: 'Предпросмотр' },
        button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Раз'),
        button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Два'))`],
    ['/ru/ui/text-field', 'Текстовое поле', 'Подпись, поле, подсказка и ошибка — связаны между собой.',
      `textField({ label: 'Почта', name: 'g-email', size: 'sm', placeholder: 'ada@example.com' })`],
    ['/ru/ui/select', 'Выпадающий список', 'Нативный select, оформленный в тон.',
      `selectField({ label: 'Тема', name: 'g-theme', size: 'sm', options: ['Светлая', 'Тёмная'], value: 'Тёмная' })`],
    ['/ru/ui/checkbox', 'Флажок', 'Настоящий input, оформленный через CSS, а не подменённый.',
      `stack({ gap: 'sm' }, checkbox({ label: 'Sitemap', checked: true }), checkbox({ label: 'RSS-лента' }))`],
    ['/ru/ui/radio', 'Радиогруппа', 'Один выбор из нескольких — радиокнопки с общим name.',
      `choiceGroup({ name: 'g-plan', direction: 'row', value: 'pro', options: ['бесплатный', 'pro'] })`],
    ['/ru/ui/switch', 'Тумблер', 'Переключатель для настройки, которая срабатывает сразу.',
      `stack({ gap: 'sm' }, toggle({ label: 'Публичный', checked: true }), toggle({ label: 'Черновики' }))`],
    ['/ru/ui/slider', 'Слайдер', 'Нативный range-инпут, оформленный в тон.',
      `div({ style: 'width: 100%' }, slider({ value: 60, 'aria-label': 'Предпросмотр' }))`],
    ['/ru/ui/toggle-button', 'Кнопка-переключатель', 'Кнопка, которая остаётся нажатой.',
      `stack({ direction: 'row', gap: 'xs' }, toggleButton({ size: 'sm', pressed: true }, 'Вкл'), toggleButton({ size: 'sm' }, 'Выкл'))`],
    ['/ru/ui/toggle-group', 'Группа переключателей', 'Сегментированный контрол — кнопками или ссылками.',
      `toggleGroup({ size: 'sm', label: 'Предпросмотр', value: 'b', items: ['a', 'b', 'c'] })`],
  ]],
  ['Отображение данных', [
    ['/ru/ui/avatar', 'Аватар', 'Картинка, если она есть, и инициалы, если её нет.',
      `avatarGroup({ max: 3 }, avatar({ name: 'Ada L' }), avatar({ name: 'Grace H' }), avatar({ name: 'Alan T' }), avatar({ name: 'Barbara L' }))`],
    ['/ru/ui/badge', 'Бейдж', 'Счётчик или точка, приколотые к углу.',
      `badge({ content: 12 }, button({ size: 'sm', variant: 'soft', color: 'neutral' }, 'Входящие'))`],
    ['/ru/ui/chip', 'Чип', 'Тег, статус, фильтр.',
      `stack({ direction: 'row', gap: 'xs' }, chip({ color: 'success', dot: true }, 'прошло'), chip({ color: 'neutral' }, 'статика'))`],
    ['/ru/ui/tooltip', 'Подсказка', 'Подсказка при наведении и фокусе, нарисованная целиком на CSS.',
      `tooltip({ content: 'Скрипт не нужен' }, button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Наведите'))`],
    ['/ru/ui/table', 'Таблица', 'Строки и колонки из данных, в контейнере с прокруткой.',
      `table({ dense: true, columns: [{ key: 'p', header: 'Страница' }, { key: 's', header: 'Размер', align: 'end' }],
        rows: [{ p: '/', s: '4,1 кБ' }, { p: '/docs', s: '12,7 кБ' }] })`],
    ['/ru/ui/list', 'Список', 'Строки с чем-нибудь по краям.',
      `list({ plain: true }, listItem({ title: 'Маршрутизация', description: 'На файлах' }))`],
    ['/ru/ui/figure', 'Иллюстрация', 'Картинка и подпись к ней как одна иллюстрация.',
      `figure({ src: '/logo.svg', alt: '', caption: 'Подпись', style: 'width: 7rem' })`],
  ]],
  ['Обратная связь', [
    ['/ru/ui/alert', 'Уведомление', 'Сообщение, у которого иконка и ARIA-роль следуют за цветом.',
      `alert({ color: 'success' }, 'Развёрнуто.')`],
    ['/ru/ui/empty', 'Пустое состояние', 'Как выглядит список, пока в нём ничего нет.',
      `empty({ title: 'Здесь пусто', style: 'padding: 0' })`],
    ['/ru/ui/progress', 'Прогресс', 'Полоса для известной работы и спиннер для всего остального.',
      `div({ style: 'width: 100%' }, progress({ value: 62 }))`],
    ['/ru/ui/skeleton', 'Скелетон', 'Заглушка в форме содержимого, которое вот-вот появится.',
      `div({ style: 'width: 100%' }, skeleton({ lines: 3 }))`],
    ['/ru/ui/toast', 'Тост', 'Мимолётное сообщение, добавляемое скриптом.',
      `stack({ direction: 'row', gap: 'xs' }, chip({ size: 'sm', color: 'success' }, 'Сохранено.'))`],
  ]],
  ['Навигация', [
    ['/ru/ui/breadcrumbs', 'Хлебные крошки', 'Цепочка предков, заканчивающаяся этой страницей.',
      `breadcrumbs({ items: [{ label: 'Документация', href: '/ru/docs' }, { label: 'UI' }] })`],
    ['/ru/ui/pagination', 'Пагинация', 'Пронумерованные страницы окном, настоящими ссылками.',
      `pagination({ page: 2, count: 5, href: (page) => '/ru/ui#p' + page })`],
    ['/ru/ui/tabs', 'Вкладки', 'Ссылки, по странице на вкладку, — или панели, меняющиеся на месте.',
      `tabs({ variant: 'pills', items: [{ label: 'Одна', href: '/ru/ui#t1', active: true }, { label: 'Две', href: '/ru/ui#t2' }] })`],
    ['/ru/ui/app-bar', 'Панель приложения', 'Марка с одной стороны, навигация и действия с другой.',
      `appBar({ brand: 'sitelo', style: 'width: 100%; min-height: 2.5rem' }, appBarSpacer(), appBarActions(chip({ size: 'sm' }, 'v2')))`],
    ['/ru/ui/theme-toggle', 'Переключатель темы', 'Светлая и тёмная, без вспышки на входе.',
      `themeToggle()`],
  ]],
  ['Оверлеи', [
    ['/ru/ui/modal', 'Модальное окно', 'Диалог на popover API — нигде ни строчки скрипта.',
      `button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Открыть окно')`],
    ['/ru/ui/drawer', 'Боковая панель', 'Панель от края, с той же механикой popover.',
      `button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Открыть панель')`],
    ['/ru/ui/menu', 'Меню', 'Выпадающее меню на details: открытие и закрытие достаются даром.',
      `chip({ color: 'neutral' }, 'Действия ▾')`],
    ['/ru/ui/accordion', 'Аккордеон', 'Сворачиваемые секции, включая эксклюзивный режим.',
      `div({ style: 'width: 100%' }, accordion({ items: [{ title: 'Вопрос' }] }))`],
    ['/ru/ui/collapsible', 'Сворачиваемый блок', 'Одно «показать больше», без обрамления аккордеона.',
      `collapsible({ trigger: 'Показать больше' }, 'Скрыто, пока не попросят.')`],
  ]],
  ['Секции', [
    ['/ru/ui/hero', 'Hero-блок', 'Верх посадочной страницы: заголовок, фраза, действия.',
      `stack({ gap: 'xs', align: 'center' }, text({ variant: 'h6', as: 'div' }, 'Заголовок'), text({ variant: 'caption', tone: 'muted' }, 'И фраза.'))`],
    ['/ru/ui/footer', 'Подвал', 'Колонки ссылок и строка под ними.',
      `stack({ gap: 'xs', style: 'width: 100%' }, text({ variant: 'overline' }, 'Документация'), text({ variant: 'caption', tone: 'muted' }, 'Руководство · Компоненты'))`],
    ['/ru/ui/stat', 'Показатель', 'Число, на которое стоит взглянуть, и что оно значит.',
      `stat({ label: 'Страниц', value: '204', change: '+8', color: 'success' })`],
    ['/ru/ui/steps', 'Шаги', 'Пронумерованный путь, где сделанное помечено как сделанное.',
      `div({ style: 'width: 100%' }, steps({ direction: 'vertical', current: 1, items: ['Установить', 'Собрать'] }))`],
    ['/ru/ui/timeline', 'Таймлайн', 'Записи по порядку, вдоль линии.',
      `div({ style: 'width: 100%' }, timeline({ items: [{ time: 'v2.7', title: 'Секции', color: 'primary' }] }))`],
    ['/ru/ui/mockup', 'Макет', 'Скриншот в браузере, окне, телефоне или терминале.',
      `mockup({ variant: 'browser', url: 'sitelo.dev', style: 'width: 100%' }, div({ style: 'height: 2.5rem; background: var(--su-surface-2)' }))`],
  ]],
  ['Стили', [
    ['/ru/ui/theming', 'Темы', 'Любой цвет, скругление и шрифт — из одного вызова.',
      `stack({ direction: 'row', gap: 'xs' },
        ...['primary', 'success', 'warning', 'danger'].map((color) =>
          div({ style: 'width: 1.5rem; height: 1.5rem; border-radius: 0.3rem; background: var(--su-' + color + ')' })))`],
  ]],
]

/** Одна карточка галереи. Превью инертно, а имя — растянутая ссылка. */
const galleryCard = ([href, name, summary, source]) =>
  li(
    /*
     * Здесь div, а не якорь: в этих превью живут настоящие кнопки и поля,
     * а интерактивное содержимое не может быть вложено в ссылку. Вместо
     * этого ссылка на имени растягивается на всю карточку, а `inert`
     * убирает элементы демо из порядка табуляции и дерева доступности.
     */
    div(
      { class: 'ui-gallery-card' },
      div(
        { class: 'ui-gallery-preview', 'data-pagefind-ignore': '', inert: true },
        preview(source),
      ),
      a({ class: 'ui-gallery-name', href }, name),
      span({ class: 'ui-gallery-summary' }, summary),
    ),
  )

export default () =>
  uiLayout({
    title: 'sitelo UI',
    pageTitle: 'sitelo UI — компоненты для sitelo',
    description:
      'Библиотека компонентов для sitelo: кнопки, карточки, формы, таблицы и модальные окна — как функции, возвращающие HTML.',
    activeHref: '/ru/ui',
    children: [
      p(
        'sitelo-ui — это библиотека компонентов для sitelo. Каждый компонент — функция, возвращающая строку HTML, поэтому он вкладывается прямо в ту страницу, которую вы и так пишете: без компилятора, без рантайма, без гидратации.',
      ),
      p(
        'Каждый пример в этом разделе рендерит та же сборка, что и страницу вокруг него. Вы видите ровно то, что произвёл код под ним, и оно следует светлой и тёмной темам этого сайта, потому что sitelo-ui читает тот же атрибут ',
        code('data-theme'),
        ', что и документация.',
      ),

      ...GROUPS.flatMap(([group, components]) => [
        h2(group),
        ul({ class: 'ui-gallery' }, ...components.map(galleryCard)),
      ]),

      h2('Подключение'),
      p(
        'Две строки: импортировать компоненты и поставить ',
        code('styles()'),
        ' в head. ',
        a({ href: '/ru/docs/ui' }, 'Страница «Компоненты» в документации'),
        ' разбирает установку, темы, соглашение о вызове и необязательный клиентский рантайм и перечисляет все экспорты в одной таблице.',
      ),
      p(
        'Каталог ',
        code('examples/ui'),
        ' в репозитории рендерит весь набор на одной странице.',
      ),
    ],
  })
