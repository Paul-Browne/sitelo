import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/ru.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Прогресс',
    description:
      'Полоса для работы с известным концом и спиннер для работы без него.',
    activeHref: '/ru/ui/progress',
    extraHead: uiHead(),
    children: [
      p(
        'Берите определённую полосу всякий раз, когда знаете, сколько осталось: только она хоть что-то сообщает читателю. Опустите ',
        code('value'),
        ' — и полоса вместо этого анимируется, что говорит «всё ещё работаю» и больше ничего.',
      ),

      h2('Определённый прогресс'),
      demo(`stack({ gap: 'lg' },
  progress({ value: 25 }),
  progress({ value: 60 }),
  progress({ value: 100 }),
)`, { align: 'stretch' }),

      h2('Неопределённый прогресс'),
      demo(`progress()`, { align: 'stretch' }),
      p(
        'Полоса без ',
        code('label'),
        ' помечается ',
        code('aria-hidden'),
        ': роль progressbar без доступного имени ничего не сообщает скринридеру, поэтому неподписанная полоса считается декорацией. Подписывайте всё, за чем читателю положено следить.',
      ),

      h2('Подписи'),
      p(
        'Подпись называет происходящее; ',
        code('showValue'),
        ' добавляет справа проценты.',
      ),
      demo(`stack({ gap: 'lg' },
  progress({ value: 72, label: 'Рендерим страницы', showValue: true }),
  progress({ value: 30, max: 60, label: 'Оптимизируем изображения', showValue: true }),
  progress({ label: 'Ждём развёртывания' }),
)`, { align: 'stretch' }),

      h2('Цвета и высота'),
      demo(`stack({ gap: 'lg' },
  progress({ value: 80, color: 'success', label: 'Успешно', showValue: true }),
  progress({ value: 45, color: 'warning', label: 'С оговорками', showValue: true }),
  progress({ value: 20, color: 'danger', label: 'Падает', showValue: true }),
  progress({ value: 60, color: 'neutral', height: 'xs' }),
  progress({ value: 60, color: 'primary', height: '1rem' }),
)`, { align: 'stretch' }),

      h2('Шкала не из 100'),
      p(
        code('max'),
        ' позволяет передавать сырые числа — собранных страниц из общего числа — вместо того чтобы сначала считать проценты.',
      ),
      demo(`progress({ value: 118, max: 169, label: '118 из 169 страниц', showValue: true })`, {
        align: 'stretch',
      }),

      h2('Спиннер'),
      p(
        'Спиннер задаётся в ',
        code('em'),
        ', поэтому подходит к любому соседнему тексту, и размер ему называть не нужно.',
      ),
      demo(`stack({ direction: 'row', gap: 'lg', align: 'center' },
  spinner({ size: 'sm' }),
  spinner(),
  spinner({ size: 'lg' }),
)`),

      h2('Спиннер в контексте'),
      p(
        'Дайте одиночному спиннеру ',
        code('label'),
        ', чтобы его объявляли. Спиннеру внутри кнопки это не нужно: кнопка и так говорит, что делает.',
      ),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm', align: 'center' },
    spinner({ label: 'Загрузка' }),
    text({ variant: 'small', tone: 'muted' }, 'Получаем последнюю сборку…'),
  ),
  stack({ direction: 'row', gap: 'sm' },
    button({ loading: true }, 'Разворачиваем'),
    button({ variant: 'outline', loading: true }, 'Проверяем ссылки'),
  ),
)`, { align: 'start' }),

      h2('Пропсы'),
      p(code('progress()'), ' — экспортируется также как ', code('progressBar'), ':'),
      propsTable([
        ['value', 'number', '', 'Насколько продвинулись. Опустите для неопределённой анимации.'],
        ['max', 'number', '100', 'Какое значение считается завершением.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Цвет заливки.'],
        ['label', 'Child', '', 'Текст над полосой; он же её доступное имя.'],
        ['showValue', 'boolean', 'false', 'Показывать проценты рядом с подписью.'],
        ['height', 'Space', "'0.5rem'", 'Толщина полосы.'],
      ]),
      p(code('spinner()'), ':'),
      propsTable([
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Диаметр. Средний задан в em, чтобы совпадать с соседним текстом.'],
        ['label', 'string', '', 'Доступное имя. Без него спиннер скрыт от скринридеров.'],
      ]),
    ],
  })
