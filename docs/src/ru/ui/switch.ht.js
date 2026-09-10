import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/ru.js'

export default () =>
  uiLayout({
    title: 'Тумблер',
    description:
      'Переключатель «вкл/выкл» для настройки, которая срабатывает сразу: под ним — флажок с role="switch".',
    activeHref: '/ru/ui/switch',
    children: [
      p(
        'Тумблер нужен для настройки, которая применяется, как только его переключили. Флажок — для выбора, который вы подтверждаете позже кнопкой отправки. Если ваш элемент стоит в форме с «Сохранить» внизу, это флажок.',
      ),
      p(
        'Компонент называется ',
        code('toggle()'),
        ', а не ',
        code('switch()'),
        ', по скучной, но неустранимой причине: ',
        code('switch'),
        ' — зарезервированное слово, и именем импорта быть не может. Внутри это настоящий ',
        code('<input type="checkbox">'),
        ' с ',
        code('role="switch"'),
        '.',
      ),

      h2('Простой тумблер'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  toggle({ label: 'Публичный сайт', name: 'public' }),
  toggle({ label: 'Включено', name: 'on', checked: true }),
)`),

      h2('Цвета'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  toggle({ label: 'Primary', checked: true, color: 'primary' }),
  toggle({ label: 'Neutral', checked: true, color: 'neutral' }),
  toggle({ label: 'Success', checked: true, color: 'success' }),
  toggle({ label: 'Warning', checked: true, color: 'warning' }),
  toggle({ label: 'Danger', checked: true, color: 'danger' }),
)`),

      h2('Отключено'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  toggle({ label: 'Выключено и закреплено', disabled: true }),
  toggle({ label: 'Включено и закреплено', checked: true, disabled: true }),
)`),

      h2('Без подписи'),
      p(
        'Тумблеру без видимой подписи всё равно нужно доступное имя. Передайте ',
        code('aria-label'),
        ' — он проваливается на input.',
      ),
      demo(`toggle({ 'aria-label': 'Включить поиск Pagefind', checked: true })`),

      h2('Список настроек'),
      p(
        'Обычная форма: подпись слева, тумблер справа, по строке на настройку.',
      ),
      demo(`return list(
  [
    ['Поиск Pagefind', 'Индексирует каждую страницу в конце сборки.', true],
    ['Оптимизация изображений', 'Меняет размер и формат картинок на сборке. Нужен sharp.', true],
    ['Серверные острова', 'Рендерит помеченные области в момент запроса.', false],
  ].map(([name, description, on]) =>
    listItem({
      title: name,
      description,
      end: toggle({ 'aria-label': name, checked: on }),
    }),
  ),
)`, { align: 'stretch' }),

      h2('Пропсы'),
      propsTable([
        ['label', 'Child', '', 'Текст рядом с тумблером. Если его нет, используйте aria-label.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Цвет дорожки во включённом состоянии.'],
        ['checked', 'boolean', 'false', 'Включён ли изначально.'],
        ['name', 'string', '', 'Имя поля формы.'],
        ['disabled', 'boolean', 'false', 'Отключает input и приглушает строку.'],
      ]),
      p(
        'Всё остальное проваливается на ',
        code('<input>'),
        ', где и место для ',
        code('onchange'),
        ' и ',
        code('aria-*'),
        '.',
      ),
    ],
  })
