import { h2, p } from 'javascript-to-html'
import { code, demo, grainSandbox, grainSandboxHead, propsTable, uiLayout } from '../../lib/ru.js'

export default () =>
  uiLayout({
    title: 'Зерно',
    description:
      'Обёртка, которая кладёт плёночное зерно поверх всего, что в ней лежит.',
    activeHref: '/ru/ui/grain',
    extraHead: grainSandboxHead(),
    children: [
      p(
        'Зерно снимает плоскость с большой заливки цветом — с героя, с цветной полосы, с карточки, которая иначе читалась бы как ровный прямоугольник. Оно оборачивает содержимое так же, как ',
        code('container()'),
        ', но своей ширины не задаёт: текстура рисуется на ',
        code('::after'),
        ', поверх детей и не перехватывая указатель.',
      ),
      p(
        'Плитка — статичный SVG с фрактальным шумом, отрисованный один раз. ',
        code('filter'),
        ' поверх живых пикселей выглядел бы почти так же и стоил бы перерисовки всякий раз, когда под ним что-то сдвинется.',
      ),

      p(
        'Управление здесь двухслойное. ',
        code('opacity'),
        ' — это насколько сильно текстура выкручена после отрисовки; если её не трогать, её задаёт тема, и именно на этом значении обе темы уравновешены. ',
        code('type'),
        ', ',
        code('frequency'),
        ', ',
        code('octaves'),
        ', ',
        code('seed'),
        ' и ',
        code('color'),
        ' — это сама турбулентность; стоит тронуть любой из них, и текстура соберётся для этого элемента вместо общей из таблицы стилей.',
      ),

      h2('Простое зерно'),
      demo(`grain({ style: 'background: var(--su-surface-2); padding: 2rem; border-radius: 0.75rem' },
  text({ variant: 'lead', align: 'center' }, 'С текстурой.'),
)`, { align: 'stretch' }),

      h2('Тип шума'),
      p(
        code('fractal'),
        ' складывает шум как есть и даёт ровный плёночный крап. ',
        code('turbulence'),
        ' берёт его модуль, отчего остаются тёмные прожилки и сгустки — это ближе к дыму или мрамору, чем к зерну.',
      ),
      demo(`grid({ min: '9rem' },
  ...['fractal', 'turbulence'].map((type) =>
    grain({ type, style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, type),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Частота'),
      p(
        'Циклов на пиксель: чем выше, тем мельче. Шум рисуется в размер самого блока, одна единица на пиксель, так что это верно при любых его размерах — маленькая карточка и полоса во всю ширину получают одно и то же зерно, и ничего не повторяется.',
      ),
      demo(`grid({ min: '9rem' },
  ...[0.2, 0.57, 1.2].map((frequency) =>
    grain({ frequency, style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, String(frequency)),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Октавы'),
      p(
        'Сколько слоёв шума складывается — каждый мельче и слабее предыдущего. Один даёт гладко и ровно; больше добавляют деталей, и каждый стоит браузеру ещё одного прохода при первой отрисовке плитки.',
      ),
      demo(`grid({ min: '9rem' },
  ...[1, 3, 6].map((octaves) =>
    grain({ octaves, style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, String(octaves)),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Зерно генератора'),
      p(
        'Какой именно шум рисуется. Годится любое число, одно и то же всегда даёт один и тот же узор, и больше в текстуре ничего не меняется — удобно, когда две зернистые панели стоят рядом и повтор выдаёт себя.',
      ),
      demo(`grid({ min: '9rem' },
  ...[0, 7, 42].map((seed) =>
    grain({ seed, style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, String(seed)),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Цвет'),
      p(
        'По умолчанию шум серый. ',
        code('color'),
        ' его подкрашивает: значение умножается внутри фильтра, поэтому оно должно разрешаться при сборке страницы — ',
        code('#rgb'),
        ', ',
        code('#rrggbb'),
        ' или ',
        code('rgb()'),
        '. Именованный цвет, ',
        code('currentColor'),
        ' или ',
        code('var()'),
        ' так не умеют и оставляют шум серым, а не роняют сборку. Альфа — это сколько подкраски: ',
        code('#ff880080'),
        ' — половина от ',
        code('#ff8800'),
        ', а нулевая альфа — никакой.',
      ),
      demo(`grid({ min: '9rem' },
  ...['#0a7a45', '#c05621', '#2f7fc7'].map((color) =>
    grain({ color, style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, color),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Вокруг контейнера'),
      p(
        'У зерна нет собственного ограничения по ширине — именно поэтому это и работает: обёртка идёт от края до края, а ',
        code('container()'),
        ' внутри держит текст по центру и читаемым.',
      ),
      demo(`grain({ as: 'section', style: 'background: var(--su-primary-soft); padding-block: 2.5rem; border-radius: 0.75rem' },
  container({ size: 'sm' },
    stack({ gap: 'sm', align: 'center' },
      heading({ level: 2, size: 'h4' }, 'Полоса с текстурой'),
      text({ tone: 'muted', align: 'center' }, 'Снаружи во всю ширину, внутри читаемая колонка.'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Поверх карточки'),
      p(
        'Текстура наследует ',
        code('border-radius'),
        ' самой коробки, так что обернуть что-то скруглённое не сделает углы прямыми.',
      ),
      demo(`grid({ min: '12rem' },
  grain({ style: 'border-radius: var(--su-radius-lg)' },
    card({ variant: 'elevated' },
      cardBody(text({ variant: 'small' }, 'С зерном')),
    ),
  ),
  card({ variant: 'elevated' },
    cardBody(text({ variant: 'small' }, 'Без зерна')),
  ),
)`, { align: 'stretch' }),

      h2('Смешивание'),
      p(
        'По умолчанию текстура ложится на содержимое со своей непрозрачностью. ',
        code('blend'),
        ' принимает любой ',
        code('mix-blend-mode'),
        ': ',
        code('overlay'),
        ' и ',
        code('soft-light'),
        ' вдавливают зерно в цвет под ним, вместо того чтобы его серить.',
      ),
      demo(`grid({ min: '9rem' },
  ...['normal', 'overlay', 'soft-light'].map((blend) =>
    grain({ blend, style: 'background: var(--su-primary-soft); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, blend),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Песочница'),
      grainSandbox(),

      h2('Пропсы'),
      propsTable([
        ['opacity', 'number', '', 'Непрозрачность текстуры. Если не трогать, её задаёт тема.'],
        ['blend', 'string', "'normal'", 'mix-blend-mode для текстуры.'],
        ['type', "'fractal' | 'turbulence'", "'fractal'", 'Какую турбулентность рисовать.'],
        ['frequency', 'number', '0.57', 'Циклов на пиксель — выше значит мельче.'],
        ['octaves', 'number', '3', 'Сколько слоёв шума складывается, 1–8.'],
        ['seed', 'number', '0', 'Какой шум рисовать.'],
        ['color', 'string', '', 'Красит шум; альфа — насколько. #rgb, #rrggbb, #rrggbbaa, rgb() или rgba().'],
        ['as', 'string', "'div'", 'Какой элемент отрисовать, например section.'],
      ]),
    ],
  })
