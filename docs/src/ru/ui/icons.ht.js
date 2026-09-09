import { h2, p } from 'javascript-to-html'
import { fillableIcons, grid, icon, iconNames, stack, text } from 'sitelo/ui'

import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/ru.js'
import { uiHead } from '../../lib/ui-demo.js'

/** Одна ячейка: знак в читаемом размере и имя, которое нужно набрать. */
const cell = (name) =>
  stack(
    {
      gap: 'xs',
      align: 'center',
      title: name,
      style:
        'padding: 0.85rem 0.5rem; border: 1px solid var(--su-border); border-radius: var(--su-radius-md); text-align: center; min-width: 0',
    },
    icon(name, { size: '1.5rem' }),
    text(
      {
        variant: 'caption',
        tone: 'muted',
        style: 'font-family: var(--su-font-mono); overflow-wrap: anywhere',
      },
      name,
    ),
  )

/* По алфавиту, прямо из библиотеки, чтобы страница не могла отстать от
 * набора, который она документирует. */
const gallery = () => grid({ min: '7.5rem', gap: 'sm' }, ...iconNames().map(cell))

/**
 * Знаки, которые заливаются закраской собственного контура, в отличие от тех,
 * что несут второй рисунок, — их различают по тому, одинакова ли разметка
 * обеих форм, так что ни одно демо не может отстать от набора.
 */
const body = (html) => html.replace(/^<svg[^>]*>/, '')

const samePath = () =>
  fillableIcons().filter((name) => body(icon(name, { filled: true })) === body(icon(name)))

/**
 * Демо заливки, выписанное кодом, а не перечисленное руками: исходник и есть
 * то, что печатает страница, поэтому знак, ставший заливаемым, появляется
 * здесь сам, без того чтобы кто-то помнил его добавить.
 */
const fillDemo = ({ filled = false } = {}) => {
  const props = filled ? "{ filled: true, size: 'lg' }" : "{ size: 'lg' }"
  const calls = samePath().map((name) => `  icon('${name}', ${props}),`)

  return [
    "stack({ direction: 'row', gap: 'md', align: 'center' },",
    ...calls,
    ')',
  ].join('\n')
}

export default () =>
  uiLayout({
    title: 'Иконки',
    description:
      'Набор из 99 знаков на одной сетке, встроенных прямо в страницу, поэтому иконка берёт цвет и размер окружающего текста.',
    activeHref: '/ru/ui/icons',
    extraHead: uiHead(),
    children: [
      p(
        code('icon()'),
        ' возвращает встроенный ',
        code('<svg>'),
        '. Все знаки нарисованы на одной сетке 24×24 незалитыми штрихами в ',
        code('currentColor'),
        ', поэтому наследуют цвет и кегль того, в чём стоят, и не требуют собственного оформления.',
      ),

      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('check'),
  icon('search'),
  icon('trash'),
  icon('settings'),
)`),

      h2('Внутри компонента'),
      p(
        'Иконка — такой же потомок, как любой другой. Поскольку она задаётся в ',
        code('em'),
        ', она подходит к подписи рядом, и говорить ей размер этой подписи не нужно:',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', align: 'center', wrap: true },
  button({ color: 'primary' }, icon('download'), 'Скачать'),
  button({ variant: 'outline' }, icon('external-link'), 'Открыть'),
  button({ size: 'sm', variant: 'soft', color: 'danger' }, icon('trash'), 'Удалить'),
  iconButton({ label: 'Поиск', variant: 'soft', icon: icon('search') }),
)`),

      h2('Размер'),
      p(
        'По умолчанию ',
        code('1em'),
        ' — размер окружающего текста. ',
        code('size'),
        ' принимает токен или любую CSS-длину, когда нужно от этого отойти:',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('star', { size: 'sm' }),
  icon('star'),
  icon('star', { size: 'lg' }),
  icon('star', { size: '2rem' }),
  icon('star', { size: '3rem' }),
)`),

      h2('Цвет'),
      p(
        'Пропа цвета нет. Иконка рисуется в ',
        code('currentColor'),
        ', поэтому берёт цвет своего окружения — именно это позволяет одному набору работать внутри пяти палитр:',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  text({ style: 'color: var(--su-primary)' }, icon('heart', { size: 'lg' })),
  text({ style: 'color: var(--su-success)' }, icon('check-circle', { size: 'lg' })),
  text({ style: 'color: var(--su-warning)' }, icon('alert-triangle', { size: 'lg' })),
  text({ style: 'color: var(--su-danger)' }, icon('x-circle', { size: 'lg' })),
  text({ tone: 'muted' }, icon('info', { size: 'lg' })),
)`),

      h2('Доступные имена'),
      p(
        'Иконка по умолчанию имеет ',
        code('aria-hidden'),
        ', и это верно гораздо чаще, чем наоборот: иконку рядом со словом «Удалить» не нужно объявлять во второй раз. Давайте ей ',
        code('label'),
        ' только тогда, когда весь смысл несёт сама иконка, — и она станет ',
        code('role="img"'),
        ' с этим именем.',
      ),
      codeBlock('', `icon('trash')                       // декоративная — скрыта
button(icon('trash'), 'Удалить')    // говорит слово

icon('trash', { label: 'Удалить' }) // объявляется как изображение

// Кнопка с одной иконкой подписывает кнопку, а не знак внутри неё
iconButton({ label: 'Удалить', icon: icon('trash') })`, 'javascript'),

      h2('Заливка'),
      p(
        code('filled'),
        ' закрашивает знак вместо обводки. Контур в обоих случаях один и тот же — меняется только атрибут ',
        code('fill'),
        ' —, поэтому обе формы делят ровно одну внешнюю кромку и не могут разойтись.',
      ),
      demo(fillDemo()),
      p('И те же имена, но с заливкой:'),
      demo(fillDemo({ filled: true })),
      p(
        'Это проп, а не второй набор имён, потому что залитость почти всегда — ',
        code('состояние'),
        ': сохранено, понравилось, оценено, — а значит ей нужен булев флаг, а не другая строка:',
      ),
      codeBlock('', `icon('heart', { filled: liked })
icon('bookmark', { filled: saved, label: saved ? 'Сохранено' : 'Сохранить' })

// вместо
icon(liked ? 'heart-filled' : 'heart')`, 'javascript'),
      p(
        'Знаки состояния заливаются иначе, потому что их метка сидит ',
        code('внутри'),
        ' формы. Закраска круга проглотила бы галочку, поэтому метку из него, наоборот, вырезают:',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('check-circle', { filled: true, size: 'lg' }),
  icon('x-circle', { filled: true, size: 'lg' }),
  icon('info', { filled: true, size: 'lg' }),
  icon('help', { filled: true, size: 'lg' }),
  icon('alert-triangle', { filled: true, size: 'lg' }),
)`),
      p(
        'У них есть второй рисунок — сплошная форма с меткой, вырезанной через ',
        code('fill-rule: evenodd'),
        ', — потому что такую вырезку нельзя получить из контурного пути сменой одного атрибута. Внешняя форма рисуется по внешней кромке обводки, так что обе версии заканчиваются одним силуэтом. Проп в обоих случаях один и тот же; каким механизмом пользуется знак — его личное дело.',
      ),
      p(
        'У шеврона внутренности нет вовсе — это открытая линия, — поэтому он заливается до треугольника, который описывают его три точки, сохраняя обводку, скругляющую углы:',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('chevron-up', { filled: true, size: 'lg' }),
  icon('chevron-down', { filled: true, size: 'lg' }),
  icon('chevron-left', { filled: true, size: 'lg' }),
  icon('chevron-right', { filled: true, size: 'lg' }),
)`),
      p(
        code('fillableIcons()'),
        ' перечисляет всё, что откликается на ',
        code('filled'),
        '. Знак без залитой формы его игнорирует и остаётся контурным: залить ',
        code('eye'),
        ' значило бы потерять зрачок, а ',
        code('tag'),
        ' — его отверстие, так что ни один из них не притворяется.',
      ),

      h2('Вращение'),
      p(
        code('spin'),
        ' вращает знак — задумано для ',
        code('spinner'),
        ', хотя ничто не мешает крутить ',
        code('refresh'),
        ', пока что-то перезагружается. При ',
        code('prefers-reduced-motion'),
        ' он замедляется до еле заметного, а не останавливается: остановившийся спиннер выглядит сломанным.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('spinner', { spin: true, size: 'lg' }),
  icon('refresh', { spin: true, size: 'lg' }),
  button({ variant: 'soft' }, icon('spinner', { spin: true }), 'Сохраняем…'),
)`),

      h2('Весь набор'),
      p(
        'Имена описывают рисунок, а не работу, которую он делает: ',
        code('x-circle'),
        ', а не ',
        code('error'),
        ' — потому что один и тот же рисунок идёт на несвязанные задачи, и имя, описывающее картинку, при этом остаётся верным. Алиасы ниже покрывают привычные намерения.',
      ),
      gallery(),

      h2('Бренды'),
      p(
        'С набором идут восемь фирменных знаков: ',
        code('facebook'),
        ', ',
        code('google'),
        ', ',
        code('instagram'),
        ', ',
        code('linkedin'),
        ', ',
        code('tiktok'),
        ', ',
        code('whatsapp'),
        ', ',
        code('x-twitter'),
        ' и ',
        code('youtube'),
        '. Они по-прежнему принимают ',
        code('size'),
        ' и ',
        code('label'),
        ' и по-прежнему рисуются в ',
        code('currentColor'),
        ':',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center', wrap: true },
  icon('facebook', { size: 'lg' }),
  icon('instagram', { size: 'lg' }),
  icon('x-twitter', { size: 'lg' }),
  icon('youtube', { size: 'lg' }),
  icon('whatsapp', { size: 'lg' }),
  button({ variant: 'soft', color: 'neutral' }, icon('linkedin'), 'Поделиться'),
)`),
      p(
        'Это воспроизведения чужих знаков, а не рисунки в стиле этой библиотеки, поэтому они намеренно нарушают два её правила: они сплошные фигуры, а не штрихи, — именно таков логотип, — и пропорции у них фирменные, а не этой сетки. ',
        code('filled'),
        ' для них ничего не значит: они уже залиты.',
      ),
      p(
        'Графика взята из Simple Icons, публикуемого под CC0. Это покрывает рисунок, но не товарный знак: используйте их, чтобы указать на то, что они называют, — ссылку на профиль, кнопку «Поделиться», — но не на собственном продукте.',
      ),
      p(
        'Это ',
        code('x-twitter'),
        ', а не ',
        code('x'),
        ', потому что ',
        code('x'),
        ' уже алиас для ',
        code('close'),
        ', и кнопка закрытия, превращающаяся в логотип, была бы неприятным сюрпризом. ',
        code('twitter'),
        ' тоже ведёт сюда.',
      ),

      h2('Алиасы'),
      p('Каждый из них рисует знак из списка выше — под тем именем, к которому вы, скорее всего, потянетесь:'),
      grid(
        { min: '15rem', gap: 'xs' },
        ...[
          ['success', 'check-circle'],
          ['warning', 'alert-triangle'],
          ['danger, error', 'x-circle'],
          ['x, cross', 'close'],
          ['question', 'help'],
          ['loading', 'spinner'],
          ['cog, gears', 'gear'],
          ['delete, trash-can', 'trash'],
          ['pencil', 'edit'],
          ['notification', 'bell'],
          ['dots', 'more-horizontal'],
          ['bolt, lightning', 'zap'],
          ['arrow-back', 'arrow-left'],
          ['arrow-forward', 'arrow-right'],
          ['cart', 'shopping-cart'],
          ['bag', 'shopping-bag'],
          ['card', 'credit-card'],
          ['cash, money', 'banknote'],
          ['delivery, shipping', 'truck'],
          ['shop', 'store'],
          ['discount, sale', 'percent'],
          ['login, sign-in', 'log-in'],
          ['logout, sign-out', 'log-out'],
          ['map-pin, marker', 'location'],
          ['mobile', 'smartphone'],
          ['like', 'thumbs-up'],
          ['dislike', 'thumbs-down'],
          ['comment, message, chat', 'comment-bubble'],
          ['ai, magic', 'sparkles'],
          ['printer', 'print'],
          ['accessibility, a11y', 'universal-access'],
          ['twitter', 'x-twitter'],
        ].map(([alias, target]) =>
          text({ variant: 'small' }, code(alias), ' → ', code(target)),
        ),
      ),

      h2('Свои иконки'),
      p(
        code('registerIcons()'),
        ' добавляет знак или заменяет встроенный. Разметка — это содержимое ',
        code('<svg>'),
        ': фигуры на той же сетке 24×24, оставленные незалитыми, чтобы до них дошёл ',
        code('currentColor'),
        '. Вызовите её один раз из модуля, который импортируют ваши страницы:',
      ),
      codeBlock('src/lib/icons.js', `import { registerIcons } from 'sitelo/ui'

registerIcons({
  logo: '<path d="M4 20 12 4l8 16z"/>',
  // Уже существующее имя заменяет знак повсюду — так и переоформляют
  // встроенный, не форкая библиотеку.
  check: '<path d="m5 13 4 4 10-11"/>',
  // Одна замкнутая фигура, чтобы знак откликался на \`filled\`, как встроенные.
  pin: { markup: '<path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"/>', fillable: true },
})`, 'javascript'),
      codeBlock('', `import { icon } from 'sitelo/ui'

icon('logo')                   // ваш знак
icon('check')                  // теперь тоже ваш

registerIcons({ check: null }) // и обратно к встроенному`, 'javascript'),

      h2('Почему встроенный SVG, а не спрайт'),
      p(
        'Иконки рисуются прямо в странице, а не вытягиваются из ',
        code('icons.svg'),
        ' через ',
        code('<use>'),
        '. Спрайт экономит порядка сотни гзипованных байт HTML на страницу и стоит за это одного похода по сети: повторяющаяся разметка — как раз тот случай, где gzip хорош, так что почти всё, ради чего спрайт и существует, уже сдедуплицировано. Встроенный вариант вдобавок означает, что нет файла, который нужно выдавать, нет базового пути, который нужно настраивать, и нечему пропасть из ',
        code('dist'),
        ' — та же сделка, что и у ',
        code('styles({ inline: true })'),
        '.',
      ),

      h2('Пропсы'),
      propsTable([
        ['name', 'string', '', 'Какой знак. Можно передать и первым аргументом.'],
        ['size', "'sm' | 'md' | 'lg' | string", "'md'", 'Токен или любая CSS-длина. По умолчанию 1em.'],
        ['label', 'string', '', 'Объявлять как изображение с этим именем, а не скрывать.'],
        ['spin', 'boolean', 'false', 'Непрерывно вращать.'],
        ['filled', 'boolean', 'false', 'Закрасить знак вместо обводки. Незаливаемые знаки это игнорируют.'],
      ]),
      p(
        'Неизвестное имя не рисует ничего вместо того, чтобы бросать ошибку: косметический проп не должен уметь уронить сборку. ',
        code('hasIcon(name)'),
        ' говорит, существует ли такой знак, ',
        code('iconNames()'),
        ' перечисляет все, а ',
        code('fillableIcons()'),
        ' — те, что принимают ',
        code('filled'),
        '.',
      ),
    ],
  })
