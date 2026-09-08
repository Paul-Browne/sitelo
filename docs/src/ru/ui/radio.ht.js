import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/ru.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Радиогруппа',
    description:
      'Один выбор из нескольких — настоящие radio-инпуты с общим name, легендой и ролью группы.',
    activeHref: '/ru/ui/radio',
    extraHead: uiHead(),
    children: [
      p(
        'Радиокнопки нужны, чтобы выбрать ровно один вариант из небольшого видимого набора. ',
        code('radio()'),
        ' рисует одну; ',
        code('choiceGroup()'),
        ' строит весь набор из массива и даёт ему легенду и ',
        code('role="radiogroup"'),
        ', которые превращают его в группу, а не в кучу инпутов.',
      ),
      p(
        'У них общий ',
        code('name'),
        ', поэтому взаимную исключительность и переходы стрелками берёт на себя браузер. Никакого скрипта здесь не отгружается.',
      ),

      h2('Простая радиогруппа'),
      demo(`choiceGroup({
  legend: 'Тариф',
  name: 'plan',
  value: 'pro',
  options: [
    { value: 'free', label: 'Бесплатный' },
    { value: 'pro', label: 'Pro' },
    { value: 'team', label: 'Командный' },
  ],
})`, { align: 'stretch' }),

      h2('В строку'),
      p(
        'Короткие подписи лучше читаются в одну строку. Длинные пусть остаются столбиком — так и задано по умолчанию.',
      ),
      demo(`choiceGroup({
  legend: 'Форм-фактор',
  name: 'form-factor',
  direction: 'row',
  value: 'desktop',
  options: ['desktop', 'mobile'],
})`, { align: 'stretch' }),

      h2('Обычные строки'),
      p(
        'Когда значение и подпись совпадают, передавайте строки.',
      ),
      demo(`choiceGroup({
  legend: 'Уровень логов',
  name: 'log-level',
  direction: 'row',
  value: 'warn',
  options: ['info', 'warn', 'error', 'silent'],
})`, { align: 'stretch' }),

      h2('Отключённые варианты'),
      demo(`choiceGroup({
  legend: 'Рендеринг',
  name: 'renderer',
  value: 'static',
  options: [
    { value: 'static', label: 'Статика' },
    { value: 'islands', label: 'Серверные острова' },
    { value: 'ssr', label: 'Полный SSR', disabled: true },
  ],
  help: 'Полному SSR нужен Node-хостинг, которого у этого проекта нет.',
})`, { align: 'stretch' }),

      h2('По одной'),
      p(
        'Берите ',
        code('radio()'),
        ' напрямую, когда варианты слишком разнородны, чтобы приходить из массива, — например, когда у каждого своё описание.',
      ),
      demo(`stack({ gap: 'md' },
  radio({ name: 'deploy', value: 'push', label: 'При каждом пуше', checked: true }),
  radio({ name: 'deploy', value: 'tag', label: 'Только для помеченных релизов' }),
  radio({ name: 'deploy', value: 'manual', label: 'Вручную' }),
)`, { align: 'stretch' }),

      h2('Цвета'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  radio({ label: 'Primary', name: 'c1', checked: true, color: 'primary' }),
  radio({ label: 'Neutral', name: 'c2', checked: true, color: 'neutral' }),
  radio({ label: 'Success', name: 'c3', checked: true, color: 'success' }),
  radio({ label: 'Warning', name: 'c4', checked: true, color: 'warning' }),
  radio({ label: 'Danger', name: 'c5', checked: true, color: 'danger' }),
)`),

      h2('В карточке'),
      demo(`card(
  cardHeader({ title: 'Настройки сборки', subtitle: 'Применятся при следующем развёртывании' }),
  cardBody(
    stack({ gap: 'lg' },
      choiceGroup({
        legend: 'Чистые URL',
        name: 'clean-urls',
        direction: 'row',
        value: 'on',
        options: [
          { value: 'on', label: 'Включены' },
          { value: 'off', label: 'Выключены' },
        ],
      }),
      choiceGroup({
        legend: 'Изображения',
        name: 'images',
        value: 'optimise',
        options: [
          { value: 'optimise', label: 'Менять размер и формат' },
          { value: 'copy', label: 'Копировать как есть' },
        ],
      }),
    ),
  ),
  cardFooter({ divided: true, style: 'justify-content: flex-end' },
    button({ type: 'submit' }, 'Сохранить'),
  ),
)`, { align: 'stretch' }),

      h2('Пропсы'),
      p(code('choiceGroup()'), ':'),
      propsTable([
        ['legend', 'Child', '', 'Подпись всей группы.'],
        ['name', 'string', '', 'Общее имя поля — именно оно делает радиокнопки взаимоисключающими.'],
        ['options', 'Array', '[]', 'Строки или объекты { value, label, disabled }.'],
        ['value', 'string | number | Array', '', 'Какой вариант отмечен. Массив — для флажков.'],
        ['type', "'radio' | 'checkbox'", "'radio'", 'Какой элемент строить. Заодно задаёт роль группы.'],
        ['direction', "'row' | 'column'", "'column'", 'Как расположены варианты.'],
        ['help', 'Child', '', 'Подсказка под группой.'],
      ]),
      p(code('radio()'), ' принимает те же пропсы, что и ', code('checkbox()'), ': ', code('label'), ', ', code('color'), ', ', code('checked'), ', ', code('name'), ', ', code('value'), ' и ', code('disabled'), '.'),
    ],
  })
