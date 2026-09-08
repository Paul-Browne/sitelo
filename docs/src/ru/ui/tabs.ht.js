import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/ru.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Вкладки',
    description:
      'Две формы: ссылки, по странице на вкладку, — или панели, которые подменяются на месте.',
    activeHref: '/ru/ui/tabs',
    extraHead: uiHead(),
    children: [
      p(
        'Дайте каждому элементу ',
        code('href'),
        ' — и вкладки станут ссылками: по странице на вкладку, без скрипта, с ',
        code('aria-current'),
        ' на активной. Дайте каждому элементу ',
        code('panel'),
        ' — и они превратятся в настоящий tablist, панели которого подменяются на месте.',
      ),
      p(
        'На статическом сайте обычно правильна форма со ссылками: она даёт каждому виду свой URL и переживает выключенный JavaScript. Берите панели, когда содержимого немного и переключение не должно стоить перехода.',
      ),

      h2('Вкладки-ссылки'),
      p('Никакого скрипта. Активна та вкладка, которую вы пометили.'),
      demo(`tabs({
  items: [
    { label: 'Обзор', href: '#overview', active: true },
    { label: 'Установка', href: '#installation' },
    { label: 'API', href: '#api' },
  ],
})`, { align: 'stretch' }),

      h2('Вкладки с панелями'),
      p(
        'Каждая вкладка подгружает свой обработчик при первом клике — ',
        code("onclick=\"import('/su/tabs.js').then(m=>m.select(this))\""),
        ', — поэтому эти действительно переключаются, вместе со стрелками, а страница при этом ничего не импортирует. Пока модуль не приехал, показывается просто та панель, которую сервер отметил активной.',
      ),
      demo(`tabs({
  value: 'install',
  items: [
    { id: 'install', label: 'Установка', panel: card({ variant: 'flat' }, cardBody(code('npm install sitelo javascript-to-html'))) },
    { id: 'use', label: 'Использование', panel: card({ variant: 'flat' }, cardBody(code("import * as ui from 'sitelo/ui'"))) },
    { id: 'build', label: 'Сборка', panel: card({ variant: 'flat' }, cardBody(code('sitelo build'))) },
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
      p('Полоса вкладок прокручивается по горизонтали, а не переносится, поэтому ряд сохраняет форму и на телефоне.'),
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
        'Форма с панелями рисует полноценный ',
        code('role="tablist"'),
        ' с ',
        code('aria-selected'),
        ', ',
        code('aria-controls'),
        ' и кочующим ',
        code('tabindex'),
        '. Скрипт добавляет перемещение стрелками, Home и End. Форма со ссылками намеренно не является tablist: ссылки, которые ведут на другие страницы, — это ссылки, и приписывать им семантику вкладок значило бы врать о том, что они делают.',
      ),

      h2('Пропсы'),
      propsTable([
        ['items', 'Array', '[]', 'Строки или объекты { id, label, href, panel, active, disabled }.'],
        ['value', 'string', '', 'Id активного элемента. Иначе берётся active, а затем первый.'],
        ['variant', "'underline' | 'pills'", "'underline'", 'Чем помечается активная вкладка.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Цвет активной вкладки.'],
        ['label', 'string', "'Tabs'", 'Доступное имя tablist. Только для формы с панелями.'],
      ]),
    ],
  })
