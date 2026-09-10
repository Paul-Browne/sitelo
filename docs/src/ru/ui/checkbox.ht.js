import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/ru.js'

export default () =>
  uiLayout({
    title: 'Флажок',
    description:
      'Флажок и его подпись как один элемент управления — настоящий input, оформленный через CSS, а не подменённый.',
    activeHref: '/ru/ui/checkbox',
    children: [
      p(
        code('checkbox()'),
        ' рисует ',
        code('<label>'),
        ', оборачивающий настоящий ',
        code('<input type="checkbox">'),
        ' и тот квадратик, который вы видите. Input визуально скрыт, но никуда не делся: он получает фокус, отправляется вместе с формой, а вся подпись служит зоной нажатия — галочка рисуется из собственного состояния ',
        code(':checked'),
        ', без всякого скрипта.',
      ),

      h2('Простой флажок'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  checkbox({ label: 'Присылать новости на почту', name: 'updates' }),
  checkbox({ label: 'Отмечен', name: 'checked', checked: true }),
)`),

      h2('Цвета'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  checkbox({ label: 'Primary', checked: true, color: 'primary' }),
  checkbox({ label: 'Neutral', checked: true, color: 'neutral' }),
  checkbox({ label: 'Success', checked: true, color: 'success' }),
  checkbox({ label: 'Warning', checked: true, color: 'warning' }),
  checkbox({ label: 'Danger', checked: true, color: 'danger' }),
)`),

      h2('Отключено'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  checkbox({ label: 'Недоступно', disabled: true }),
  checkbox({ label: 'Включено и закреплено', checked: true, disabled: true }),
)`),

      h2('Длинные подписи'),
      p(
        'Квадратик остаётся на одной линии с первой строкой, а не центрируется относительно всего абзаца.',
      ),
      demo(`checkbox({
  label: 'Запускать аудит Lighthouse после каждой сборки и валить сборку, когда оценка падает ниже порога.',
  name: 'lighthouse',
  checked: true,
})`, { align: 'stretch' }),

      h2('Группы'),
      p(
        code('choiceGroup()'),
        ' строит набор флажков из данных, с общей легендой и общим name. Передайте массив в ',
        code('value'),
        ', чтобы отметить несколько.',
      ),
      demo(`choiceGroup({
  legend: 'Генерировать',
  name: 'generate',
  type: 'checkbox',
  value: ['sitemap', 'rss'],
  options: [
    { value: 'sitemap', label: 'sitemap.xml' },
    { value: 'rss', label: 'rss.xml' },
    { value: 'pagefind', label: 'Индекс Pagefind' },
  ],
  help: 'Каждый из них записывается в dist/ в конце сборки.',
})`, { align: 'stretch' }),

      h2('В строку'),
      demo(`choiceGroup({
  legend: 'Категории',
  name: 'categories',
  type: 'checkbox',
  direction: 'row',
  value: ['performance'],
  options: ['performance', 'accessibility', 'seo'],
})`, { align: 'stretch' }),

      h2('С field'),
      p(
        'Одиночному флажку подпись сверху нужна редко. Когда она нужна группе, ',
        code('field()'),
        ' даёт ей то же оформление подписи, подсказки и ошибки, что и текстовому полю.',
      ),
      demo(`field({ label: 'Условия', error: 'Чтобы продолжить, нужно принять условия.' },
  checkbox({ label: 'Я принимаю условия', name: 'terms', color: 'danger' }),
)`, { align: 'stretch' }),

      h2('Пропсы'),
      propsTable([
        ['label', 'Child', '', 'Текст рядом с квадратиком. Опустите для голого элемента.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Цвет в отмеченном состоянии.'],
        ['checked', 'boolean', 'false', 'Отмечен ли изначально.'],
        ['name', 'string', '', 'Имя поля формы.'],
        ['value', 'string | number', '', 'Значение, отправляемое в отмеченном состоянии.'],
        ['disabled', 'boolean', 'false', 'Отключает input и приглушает подпись.'],
      ]),
      p(
        'Всё остальное попадает на ',
        code('<input>'),
        ', а не на подпись — так что ',
        code('required'),
        ', ',
        code('onchange'),
        ' и ',
        code('data-*'),
        ' идут туда, куда вы и ждёте. Для оформления самой подписи используйте ',
        code('class'),
        '.',
      ),
      p(
        'Про набор, построенный из данных, см. ',
        code('choiceGroup()'),
        ' на странице ',
        code('Радиогруппа'),
        ': он принимает одни и те же опции в обоих случаях, переключаясь через ',
        code("type: 'checkbox'"),
        '.',
      ),
    ],
  })
