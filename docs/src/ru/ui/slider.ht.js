import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/ru.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Слайдер',
    description:
      'Нативный range-инпут, оформленный в тон остальным элементам управления.',
    activeHref: '/ru/ui/slider',
    extraHead: uiHead(),
    children: [
      p(
        'Это настоящий ',
        code('<input type="range">'),
        ': стрелки, Home и End и правильное объявление достаются от браузера. Оформлены только дорожка и бегунок.',
      ),

      h2('Простой слайдер'),
      demo(`sliderField({ label: 'Качество', name: 'quality', value: 70 })`, { align: 'stretch' }),

      h2('Диапазон и шаг'),
      demo(`stack({ gap: 'lg' },
  sliderField({ label: 'Громкость', name: 'volume', min: 0, max: 100, value: 40 }),
  sliderField({ label: 'Колонки', name: 'columns', min: 1, max: 6, step: 1, value: 3 }),
  sliderField({ label: 'Масштаб', name: 'scale', min: 0.5, max: 2, step: 0.25, value: 1 }),
)`, { align: 'stretch' }),

      h2('Показ значения'),
      p(
        code('showValue'),
        ' ставит рядом с дорожкой ',
        code('<output>'),
        ' со значением, с которым собиралась страница, а сам инпут при первом же перетаскивании подтягивает свой обработчик — так что число идёт за бегунком. Импортировать нечего: число, которое тихо устареет, было бы хуже, чем никакого числа, поэтому это на вас не оставили.',
      ),
      demo(`sliderField({
  label: 'Качество изображения',
  name: 'jpeg-quality',
  min: 40,
  max: 100,
  value: 82,
  showValue: true,
  help: 'Чем выше, тем больше вес и медленнее сборка.',
})`, { align: 'stretch' }),

      h2('Цвета'),
      demo(`stack({ gap: 'lg' },
  slider({ value: 70, color: 'primary', 'aria-label': 'Primary' }),
  slider({ value: 55, color: 'success', 'aria-label': 'Success' }),
  slider({ value: 35, color: 'warning', 'aria-label': 'Warning' }),
  slider({ value: 20, color: 'danger', 'aria-label': 'Danger' }),
)`, { align: 'stretch' }),

      h2('Отключён'),
      demo(`sliderField({ label: 'Заблокировано', name: 'locked', value: 50, disabled: true })`, {
        align: 'stretch',
      }),

      h2('Без подписи'),
      p(
        'Голый ',
        code('slider()'),
        ' — это сам элемент управления: дайте ему ',
        code('aria-label'),
        ', когда на него не указывает видимая подпись.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  text({ variant: 'small', tone: 'muted' }, 'Aa'),
  slider({ min: 12, max: 24, value: 16, 'aria-label': 'Размер текста' }),
  text({ tone: 'muted' }, 'Aa'),
)`, { align: 'stretch' }),

      h2('В форме'),
      demo(`card(
  cardBody(
    stack({ gap: 'lg' },
      sliderField({ label: 'Максимальная ширина картинки', name: 'max-width', min: 640, max: 2560, step: 160, value: 1280, showValue: true }),
      sliderField({ label: 'Качество', name: 'q', min: 40, max: 100, value: 82, showValue: true }),
    ),
  ),
  cardFooter({ divided: true, style: 'justify-content: flex-end' },
    button({ type: 'submit' }, 'Сохранить'),
  ),
)`, { align: 'stretch' }),

      h2('Пропсы'),
      propsTable([
        ['min', 'number | string', '0', 'Нижняя граница.'],
        ['max', 'number | string', '100', 'Верхняя граница.'],
        ['step', 'number | string', '', 'Шаг. Опустите, чтобы взять браузерное значение 1.'],
        ['value', 'number | string', '', 'Начальное значение.'],
        ['showValue', 'boolean', 'false', 'Добавляет <output> со значением из сборки.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Цвет бегунка.'],
        ['name', 'string', '', 'Имя поля формы; из него выводится id.'],
        ['disabled', 'boolean', 'false', 'Отключает элемент.'],
      ]),
      p(
        code('sliderField()'),
        ' дополнительно принимает ',
        code('label'),
        ', ',
        code('help'),
        ', ',
        code('error'),
        ' и ',
        code('required'),
        ' — см. ',
        code('textField()'),
        '.',
      ),
    ],
  })
