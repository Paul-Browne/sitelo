import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/ru.js'

export default () =>
  uiLayout({
    title: 'Показатель',
    description:
      'Число, на которое стоит взглянуть, вместе с тем, что оно значит и куда сдвинулось.',
    activeHref: '/ru/ui/stat',
    children: [
      p(
        'Показатель — это подпись, значение и, при желании, изменение. ',
        code('statGroup()'),
        ' собирает несколько на одну поверхность с разделителями между ними.',
      ),

      h2('Простой показатель'),
      demo(`statGroup(
  stat({ label: 'Страниц', value: '204' }),
  stat({ label: 'Время сборки', value: '1,1 с' }),
  stat({ label: 'JS в клиенте', value: '3,3 кБ' }),
)`, { align: 'stretch' }),

      h2('С изменением'),
      p(
        'Изменение берёт цвет из ',
        code('color'),
        ': зелёный — для числа, которое пошло в нужную сторону, красный — для обратного. Не полагайтесь на один лишь цвет: оставляйте знак или слово.',
      ),
      demo(`statGroup(
  stat({ label: 'Страниц', value: '204', change: '+8 за неделю', color: 'success' }),
  stat({ label: 'Время сборки', value: '1,1 с', change: '−0,3 с', color: 'success' }),
  stat({ label: 'Бандл', value: '9,9 кБ', change: '+1,2 кБ', color: 'danger' }),
)`, { align: 'stretch' }),

      h2('С иконками'),
      demo(`statGroup(
  stat({
    label: 'Развёртываний',
    value: '128',
    color: 'primary',
    icon: icon('zap'),
  }),
  stat({
    label: 'Участников',
    value: '17',
    color: 'primary',
    icon: icon('user'),
  }),
)`, { align: 'stretch' }),

      h2('Текст подсказки'),
      demo(`statGroup(
  stat({
    label: 'Lighthouse',
    value: '100',
    change: 'доступность',
    color: 'success',
    help: 'Измеряется в CI на каждой английской странице.',
  }),
  stat({
    label: 'Индекс Pagefind',
    value: '204',
    help: 'Пересобирается в конце каждой сборки.',
  }),
)`, { align: 'stretch' }),

      h2('Сам по себе'),
      p('Одиночному показателю группа не нужна — просто у него не будет собственной поверхности.'),
      demo(`card(
  cardBody(stat({ label: 'Всего страниц', value: '204', change: '+8', color: 'success' })),
)`, { align: 'stretch' }),

      h2('Фиксированные колонки'),
      p(
        'По умолчанию показатели подстраиваются сами. ',
        code('columns'),
        ' закрепляет их количество, когда числа должны остаться в одну строку.',
      ),
      demo(`statGroup({ columns: 'repeat(2, 1fr)' },
  stat({ label: 'Проходят', value: '215', color: 'success' }),
  stat({ label: 'Падают', value: '0', color: 'success' }),
)`, { align: 'stretch' }),

      h2('Из данных'),
      demo(`return (() => {
  const report = [
    { label: 'Страницы', value: 204 },
    { label: 'Ресурсы', value: 208 },
    { label: 'Всего', value: '9,7 МБ' },
  ]

  return statGroup(
    report.map((entry) => stat({ label: entry.label, value: String(entry.value) })),
  )
})()`, { align: 'stretch' }),

      h2('Пропсы'),
      propsTable([
        ['label', 'Child', '', 'Что именно считает число.'],
        ['value', 'Child', '', 'Само число, набранное табличными цифрами.'],
        ['change', 'Child', '', 'Изменение, окрашенное по color.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", '', 'Окрашивает изменение и иконку.'],
        ['icon', 'Child', '', 'Декоративный значок над подписью.'],
        ['help', 'Child', '', 'Более тихая строка под всем остальным.'],
      ]),
      p(code('statGroup()'), ' принимает ', code('columns'), ' — любое значение ', code('grid-template-columns'), '.'),
    ],
  })
