import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/ru.js'

export default () =>
  uiLayout({
    title: 'Кнопка-переключатель',
    description:
      'Кнопка, которая остаётся нажатой: настройка, показанная кнопкой, а не флажком.',
    activeHref: '/ru/ui/toggle-button',
    children: [
      p(
        'Кнопка-переключатель либо включена, либо нет, и сообщает об этом через ',
        code('aria-pressed'),
        '. Полужирный в текстовом редакторе, применённый фильтр, открытая панель.',
      ),
      p(
        'Скрытого инпута за ней нет: ',
        code('aria-pressed'),
        ' — это и есть всё состояние, поэтому отрисованный на сервере переключатель показывает настройку, а меняет её ',
        code('setPressed()'),
        '. Возьмите ',
        code('checkbox()'),
        ', если место элемента в форме, и ',
        code('toggle()'),
        ', то есть тумблер, если это настройка в списке.',
      ),

      h2('Простой переключатель'),
      demo(`stack({ direction: 'row', gap: 'sm' },
  toggleButton({ pressed: true }, 'Полужирный'),
  toggleButton('Курсив'),
  toggleButton('Подчёркнутый'),
)`),

      h2('Варианты'),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm' },
    toggleButton({ variant: 'outline', pressed: true }, 'Outline включён'),
    toggleButton({ variant: 'outline' }, 'Outline выключен'),
  ),
  stack({ direction: 'row', gap: 'sm' },
    toggleButton({ variant: 'ghost', pressed: true }, 'Ghost включён'),
    toggleButton({ variant: 'ghost' }, 'Ghost выключен'),
  ),
  stack({ direction: 'row', gap: 'sm' },
    toggleButton({ variant: 'soft', pressed: true }, 'Soft включён'),
    toggleButton({ variant: 'soft' }, 'Soft выключен'),
  ),
)`, { align: 'start' }),

      h2('Размеры'),
      demo(`stack({ direction: 'row', gap: 'sm', align: 'center' },
  toggleButton({ size: 'sm', pressed: true }, 'Маленькая'),
  toggleButton({ size: 'md', pressed: true }, 'Средняя'),
  toggleButton({ size: 'lg', pressed: true }, 'Большая'),
)`),

      h2('С иконками'),
      p(
        'Переключателю из одной иконки нужно доступное имя: передайте ',
        code('aria-label'),
        ', он проваливается на кнопку.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm' },
  toggleButton({
    pressed: true,
    'aria-label': 'Полужирный',
    title: 'Полужирный',
    startIcon: icon('bold'),
  }),
  toggleButton({
    'aria-label': 'Курсив',
    title: 'Курсив',
    startIcon: icon('italic'),
  }),
)`),

      h2('Отключено'),
      demo(`stack({ direction: 'row', gap: 'sm' },
  toggleButton({ pressed: true, disabled: true }, 'Включена, закреплена'),
  toggleButton({ disabled: true }, 'Выключена, закреплена'),
)`),

      h2('Заставить её что-то делать'),
      p(
        'Один вызов переворачивает атрибут; оформление следует за ним. Внутри ',
        code('toggleGroup()'),
        ' с одним выбором он заодно отпускает соседей.',
      ),
      codeBlock('Где угодно', `toggleButton({ onclick: "import('/su/pressed.js').then(m=>m.set(this))" }, 'Bold')`, 'javascript'),
      p('Или из вашего собственного модуля, если он и так уже работает:'),
      codeBlock('src/main.js', `import { setPressed } from 'sitelo/ui/client'

setPressed('bold')`, 'javascript'),

      h2('Пропсы'),
      propsTable([
        ['pressed', 'boolean', 'false', 'Выставляет aria-pressed. Дальше его меняет setPressed().'],
        ['variant', "'outline' | 'ghost' | 'soft'", "'outline'", 'Как выглядит ненажатая кнопка.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Та же шкала, что и у button().'],
        ['disabled', 'boolean', 'false', 'Отключает кнопку.'],
      ]),
      p(
        'Всё остальное проваливается в ',
        code('button()'),
        ': ',
        code('startIcon'),
        ', ',
        code('endIcon'),
        ', ',
        code('onclick'),
        ' и прочее. Про набор таких кнопок см. ',
        code('toggleGroup()'),
        '.',
      ),
    ],
  })
