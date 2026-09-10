import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/ru.js'

export default () =>
  uiLayout({
    title: 'Подсказка',
    description:
      'Короткая подсказка при наведении и фокусе, нарисованная целиком на CSS.',
    activeHref: '/ru/ui/tooltip',
    children: [
      p(
        'Текст подсказки живёт в data-атрибуте и рисуется псевдоэлементом, поэтому здесь нет скрипта, нечего позиционировать во время выполнения и ничего не остаётся в DOM. Она появляется при наведении и при фокусе с клавиатуры — за это отвечает половина правила с ',
        code(':focus-within'),
        '.',
      ),

      h2('Простая подсказка'),
      demo(`stack({ direction: 'row', gap: 'md' },
  tooltip({ content: 'Скопировать в буфер обмена' },
    iconButton({
      label: 'Копировать',
      variant: 'soft',
      color: 'neutral',
      icon: icon('copy'),
    }),
  ),
  tooltip({ content: 'Пересобрать сайт' },
    button({ variant: 'outline', color: 'neutral' }, 'Пересобрать'),
  ),
)`),

      h2('Расположение'),
      p('По умолчанию сверху, снизу — когда сверху нет места.'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  tooltip({ content: 'Над элементом' },
    button({ variant: 'soft', color: 'neutral' }, 'Сверху'),
  ),
  tooltip({ content: 'Под элементом', placement: 'bottom' },
    button({ variant: 'soft', color: 'neutral' }, 'Снизу'),
  ),
)`),

      h2('Доступные имена'),
      p(
        'Текст подсказки — декорация: он рисуется из CSS-свойства ',
        code('content'),
        ', которое скринридеры объявляют ненадёжно. Элементу внутри всё равно нужно собственное доступное имя, и его даёт ',
        code('label'),
        ' у ',
        code('iconButton()'),
        '. Когда подсказка говорит то, чего нет в имени элемента, передайте ',
        code('label: true'),
        ', чтобы повторить её в визуально скрытом span.',
      ),
      demo(`stack({ direction: 'row', gap: 'lg' },
  tooltip({ content: 'Немедленно выкатывает в продакшн', label: true },
    button({ color: 'danger' }, 'Развернуть'),
  ),
)`),

      h2('На тексте'),
      p('Подсказка оборачивает строчное содержимое так же охотно, как и кнопку.'),
      demo(`text(
  'Сборка пишет в ',
  tooltip({ content: 'Настраивается через outDir' }, code('dist/')),
  ' и больше никуда.',
)`, { align: 'stretch' }),

      h2('Когда её не нужно'),
      p(
        'Подсказки не появляются при касании и исчезают, едва указатель ушёл. Всё, без чего читателю не обойтись — сообщение об ошибке, пояснение к обязательному полю, — должно быть в тексте ',
        code('help'),
        ' у самого поля, а не в подсказке.',
      ),

      h2('Пропсы'),
      propsTable([
        ['content', 'string', '', 'Текст подсказки.'],
        ['placement', "'top' | 'bottom'", "'top'", 'С какой стороны от элемента она появляется.'],
        ['label', 'boolean', 'false', 'Дополнительно отдать текст скринридерам в скрытом span.'],
      ]),
    ],
  })
