import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/ru.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Группа переключателей',
    description:
      'Сегментированный контрол: кнопки-переключатели, слитые в один элемент, — или ссылки, где каждый сегмент это отдельная страница.',
    activeHref: '/ru/ui/toggle-group',
    extraHead: uiHead(),
    children: [
      p(
        'Группа переключателей — это ряд вариантов, который читается как один элемент управления. Соберите его из ',
        code('items'),
        ' и укажите активный через ',
        code('value'),
        '.',
      ),

      h2('Простая группа'),
      demo(`toggleGroup({
  label: 'Выравнивание текста',
  value: 'center',
  items: [
    { value: 'left', label: 'Слева' },
    { value: 'center', label: 'По центру' },
    { value: 'right', label: 'Справа' },
  ],
})`),

      h2('Обычные строки'),
      demo(`toggleGroup({ label: 'Плотность', value: 'обычная', items: ['плотная', 'обычная', 'просторная'] })`),

      h2('Ссылки'),
      p(
        'Именно эту форму обычно и хочет статический сайт: каждый сегмент — страница. Элементы с ',
        code('href'),
        ' рисуются ссылками, а активный помечается ',
        code('aria-current="page"'),
        ', а не ',
        code('aria-pressed'),
        ', потому что ссылка — это не кнопка, которую вы вдавили.',
      ),
      demo(`toggleGroup({
  label: 'Раздел',
  value: 'ui',
  items: [
    { value: 'docs', label: 'Документация', href: '/ru/docs' },
    { value: 'ui', label: 'UI', href: '/ru/ui' },
    { value: 'examples', label: 'Примеры', href: '/ru/examples' },
  ],
})`),

      h2('Больше одного активного'),
      p(
        'Передайте массив в ',
        code('value'),
        '. Контейнер в обоих случаях остаётся обычной ',
        code('group'),
        ': ',
        code('radiogroup'),
        ' здесь был бы неверен, ведь это нажатые кнопки, а не радиокнопки.',
      ),
      demo(`toggleGroup({
  label: 'Форматирование',
  value: ['bold', 'underline'],
  items: [
    { value: 'bold', label: 'Полужирный' },
    { value: 'italic', label: 'Курсив' },
    { value: 'underline', label: 'Подчёркнутый' },
  ],
})`),

      h2('Размеры и варианты'),
      demo(`stack({ gap: 'md' },
  toggleGroup({ size: 'sm', label: 'Маленькая', value: 'a', items: ['a', 'b', 'c'] }),
  toggleGroup({ size: 'md', label: 'Средняя', value: 'a', items: ['a', 'b', 'c'] }),
  toggleGroup({ size: 'lg', label: 'Большая', value: 'a', items: ['a', 'b', 'c'] }),
  toggleGroup({ variant: 'ghost', label: 'Ghost', value: 'b', items: ['a', 'b', 'c'] }),
)`, { align: 'start' }),

      h2('Отключённые элементы'),
      demo(`toggleGroup({
  label: 'Рендеринг',
  value: 'static',
  items: [
    { value: 'static', label: 'Статика' },
    { value: 'islands', label: 'Острова' },
    { value: 'ssr', label: 'SSR', disabled: true },
  ],
})`),

      h2('В панели инструментов'),
      demo(`stack({ direction: 'row', gap: 'md', wrap: true, align: 'center' },
  toggleGroup({ label: 'Выравнивание', value: 'Слева', size: 'sm', items: ['Слева', 'По центру', 'Справа'] }),
  divider({ orientation: 'vertical' }),
  toggleGroup({ label: 'Начертание', value: ['Полужирный'], size: 'sm', items: ['Полужирный', 'Курсив'] }),
)`),

      h2('Когда лучше взять другое'),
      p(
        'Если выбор отправляется вместе с формой, берите ',
        code('choiceGroup()'),
        ': настоящие радиокнопки, скрипт не нужен. Если каждый сегмент — страница, предпочтите форму со ссылками выше. Группа переключателей нужна для выбора, на который реагирует сама страница.',
      ),

      h2('Пропсы'),
      propsTable([
        ['items', 'Array', '[]', 'Строки или объекты { value, label, href, disabled }.'],
        ['value', 'string | number | Array', '', 'Какой элемент включён. Массив, когда их может быть несколько.'],
        ['label', 'string', '', 'Доступное имя группы.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Применяется к каждому элементу.'],
        ['variant', "'outline' | 'ghost' | 'soft'", "'outline'", 'Как выглядит выключенный элемент.'],
      ]),
    ],
  })
