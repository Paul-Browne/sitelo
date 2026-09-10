import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/ru.js'

export default () =>
  uiLayout({
    title: 'Зерно',
    description:
      'Обёртка, которая кладёт плёночное зерно поверх всего, что в ней лежит.',
    activeHref: '/ru/ui/grain',
    children: [
      p(
        'Зерно снимает плоскость с большой заливки цветом — с героя, с цветной полосы, с карточки, которая иначе читалась бы как ровный прямоугольник. Оно оборачивает содержимое так же, как ',
        code('container()'),
        ', но своей ширины не задаёт: текстура рисуется на ',
        code('::after'),
        ', поверх детей и не перехватывая указатель.',
      ),
      p(
        'Плитка — статичный SVG с фрактальным шумом, отрисованный один раз и повторённый. ',
        code('filter'),
        ' поверх живых пикселей выглядел бы почти так же и стоил бы перерисовки всякий раз, когда под ним что-то сдвинется.',
      ),

      h2('Простое зерно'),
      demo(`grain({ style: 'background: var(--su-surface-2); padding: 2rem; border-radius: 0.75rem' },
  text({ variant: 'lead', align: 'center' }, 'С текстурой.'),
)`, { align: 'stretch' }),

      h2('Интенсивность'),
      p(
        'Три ступени. Тема задаёт базовую силу, а интенсивность её масштабирует: почти чёрная поверхность принимает зерно охотнее, чем бумага — если мерить воспринимаемой светлотой, та же плитка даёт примерно в 1,6 раза больше крапа на тёмном фоне. Поэтому ',
        code('medium'),
        ' в тёмной теме — это меньшая непрозрачность, и обе приходят в одну точку.',
      ),
      demo(`grid({ min: '9rem' },
  ...['soft', 'medium', 'strong'].map((intensity) =>
    grain({ intensity, style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, intensity),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Масштаб'),
      p(
        'Размер одной плитки шума. Меньше — мельче: ближе к плёнке и дальше от песка.',
      ),
      demo(`grid({ min: '9rem' },
  ...['60px', '180px', '420px'].map((scale) =>
    grain({ scale, intensity: 'strong', style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, scale),
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
    grain({ blend, intensity: 'strong', style: 'background: var(--su-primary-soft); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, blend),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Пропсы'),
      propsTable([
        ['intensity', "'soft' | 'medium' | 'strong'", "'medium'", 'Насколько сильно выкручена текстура, относительно базы темы.'],
        ['opacity', 'number', '', 'Сырая непрозрачность, перебивающая intensity и тему.'],
        ['scale', 'string', "'180px'", 'Размер одной плитки шума.'],
        ['blend', 'string', "'normal'", 'mix-blend-mode для текстуры.'],
        ['as', 'string', "'div'", 'Какой элемент отрисовать, например section.'],
      ]),
    ],
  })
