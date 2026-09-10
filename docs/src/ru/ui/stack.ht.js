import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/ru.js'

export default () =>
  uiLayout({
    title: 'Стек',
    description:
      'Flex-строка или колонка с токеном интервала в качестве промежутка — примитив раскладки, из которого собрано большинство страниц.',
    activeHref: '/ru/ui/stack',
    children: [
      p(
        'Стек расставляет пространство между вещами. Это flex-контейнер с единственной задачей и ответ почти на любой вопрос «как мне их раздвинуть»: по вертикали — по умолчанию, по горизонтали — через ',
        code("direction: 'row'"),
        '.',
      ),
      p(
        'Промежутки берутся из шкалы интервалов, поэтому ритм страницы остаётся ровным, и никому не приходится подбирать значения в пикселях.',
      ),

      h2('Простой стек'),
      demo(`stack({ gap: 'md' },
  card(cardBody('Первая')),
  card(cardBody('Вторая')),
  card(cardBody('Третья')),
)`, { align: 'stretch' }),

      h2('Направление'),
      demo(`stack({ direction: 'row', gap: 'md' },
  button('Раз'),
  button({ variant: 'outline' }, 'Два'),
  button({ variant: 'outline' }, 'Три'),
)`),

      h2('Промежуток'),
      p(
        'Имя токена (',
        code("'xs'"),
        ' … ',
        code("'3xl'"),
        '), число единиц интервала или обычная CSS-длина.',
      ),
      demo(`stack({ gap: 'lg' },
  stack({ direction: 'row', gap: 'xs' }, chip('xs'), chip('xs'), chip('xs')),
  stack({ direction: 'row', gap: 'md' }, chip('md'), chip('md'), chip('md')),
  stack({ direction: 'row', gap: 6 }, chip('6 единиц'), chip('6 единиц')),
  stack({ direction: 'row', gap: '3rem' }, chip('3rem'), chip('3rem')),
)`, { align: 'stretch' }),

      h2('Выравнивание'),
      p(
        code('align'),
        ' и ',
        code('justify'),
        ' принимают обычные значения flexbox, так что работает всё, что понимает CSS.',
      ),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm', justify: 'space-between', style: 'background: var(--su-surface-2); padding: 0.6rem; border-radius: 0.5rem' },
    chip('начало'),
    chip('конец'),
  ),
  stack({ direction: 'row', gap: 'sm', justify: 'center', align: 'center', style: 'background: var(--su-surface-2); padding: 0.6rem; border-radius: 0.5rem' },
    button({ size: 'sm' }, 'По центру'),
    chip('и выровнено'),
  ),
)`, { align: 'stretch' }),

      h2('Перенос'),
      p(
        'Строке из чипов или кнопок, которая может не поместиться, нужен ',
        code('wrap'),
        ': без него они сжимаются, вместо того чтобы уйти на следующую строку.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  ...['routing', 'data', 'islands', 'images', 'pagefind', 'lighthouse', 'sitemap', 'rss'].map(
    (name) => chip({ color: 'neutral' }, name),
  ),
)`, { align: 'stretch' }),

      h2('Строчный вариант'),
      p(
        code('inline'),
        ' делает стек ',
        code('inline-flex'),
        ', и он встаёт в строку текста, а не занимает всю ширину.',
      ),
      demo(`text(
  'Сделано на ',
  stack({ direction: 'row', gap: 'xs', inline: true, align: 'center' },
    chip({ color: 'primary', size: 'sm' }, 'sitelo'),
    chip({ color: 'neutral', size: 'sm' }, 'vite'),
  ),
  ' и больше ни на чём.',
)`, { align: 'stretch' }),

      h2('Как другой элемент'),
      demo(`stack({ as: 'nav', direction: 'row', gap: 'sm' },
  navLink({ href: '/ru/docs' }, 'Документация'),
  navLink({ href: '/ru/ui', current: true }, 'UI'),
  navLink({ href: '/ru/examples' }, 'Примеры'),
)`),

      h2('Пропсы'),
      propsTable([
        ['direction', "'row' | 'column'", "'column'", 'Главная ось.'],
        ['gap', 'Space', "'md'", 'Расстояние между потомками.'],
        ['align', 'string', "'stretch'", 'Любое значение align-items.'],
        ['justify', 'string', "'flex-start'", 'Любое значение justify-content.'],
        ['wrap', 'boolean | string', 'false', 'true — переносить; строка передаётся напрямую в flex-wrap.'],
        ['inline', 'boolean', 'false', 'Рендерится как inline-flex.'],
        ['as', 'string', "'div'", 'Какой элемент рендерить, например nav или ul.'],
      ]),
    ],
  })
