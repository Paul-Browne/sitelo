import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/ru.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Бейдж',
    description:
      'Счётчик или точка, приколотые к углу того, что бейдж оборачивает.',
    activeHref: '/ru/ui/badge',
    extraHead: uiHead(),
    children: [
      p(
        'Бейдж оборачивает элемент и прикалывает метку к его верхнему углу: непрочитанные сообщения на кнопке входящих, точка «в сети» на аватаре. То, что он помечает, передаётся ему как потомки.',
      ),

      h2('Простой бейдж'),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center' },
  badge({ content: 4 }, button({ variant: 'soft', color: 'neutral' }, 'Входящие')),
  badge({ content: 12 }, avatar({ name: 'Ada Lovelace' })),
)`),

      h2('Цвета'),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center', wrap: true },
  badge({ content: 3, color: 'primary' }, button({ variant: 'soft', color: 'neutral' }, 'Primary')),
  badge({ content: 3, color: 'neutral' }, button({ variant: 'soft', color: 'neutral' }, 'Neutral')),
  badge({ content: 3, color: 'success' }, button({ variant: 'soft', color: 'neutral' }, 'Success')),
  badge({ content: 3, color: 'warning' }, button({ variant: 'soft', color: 'neutral' }, 'Warning')),
  badge({ content: 3, color: 'danger' }, button({ variant: 'soft', color: 'neutral' }, 'Danger')),
)`),

      h2('Максимум'),
      p(
        'Значение больше ',
        code('max'),
        ' рисуется как ',
        code('n+'),
        ', поэтому бейдж никогда не разрастается настолько, чтобы перекосить то, на чём он сидит.',
      ),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center', wrap: true },
  badge({ content: 9 }, button({ variant: 'soft', color: 'neutral' }, 'Девять')),
  badge({ content: 250 }, button({ variant: 'soft', color: 'neutral' }, 'Обрезано до 99')),
  badge({ content: 250, max: 999 }, button({ variant: 'soft', color: 'neutral' }, 'max: 999')),
)`),

      h2('Точка'),
      p(
        'Точка говорит «что-то изменилось», не уточняя, насколько. Дайте ей ',
        code('label'),
        ': голая точка ничего не значит для скринридера, поэтому без подписи она полностью скрыта из дерева доступности.',
      ),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center' },
  badge({ dot: true, color: 'success', label: 'В сети' }, avatar({ name: 'Ada Lovelace' })),
  badge({ dot: true, color: 'warning', label: 'Требует внимания' },
    iconButton({
      label: 'Настройки',
      variant: 'soft',
      color: 'neutral',
      icon: icon('settings'),
    }),
  ),
)`),

      h2('Подпись к счётчику'),
      p(
        'Голое число вне контекста двусмысленно. ',
        code('label'),
        ' становится доступным именем бейджа, и он читается как «4 непрочитанных сообщения», а не просто «4».',
      ),
      demo(`badge({ content: 4, label: '4 непрочитанных сообщения' },
  button({ variant: 'soft', color: 'neutral' }, 'Входящие'),
)`),

      h2('Пропсы'),
      propsTable([
        ['content', 'string | number', '', 'Что показывает бейдж. Игнорируется, если задан dot.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'danger'", 'Цвет бейджа.'],
        ['dot', 'boolean', 'false', 'Маленькая точка вместо значения.'],
        ['max', 'number', '99', 'Значения больше этого рисуются как n+.'],
        ['label', 'string', '', 'Доступное имя самого бейджа.'],
      ]),
    ],
  })
