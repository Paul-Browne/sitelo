import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/ru.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Hero-блок',
    description:
      'Верх посадочной страницы: заголовок, фраза и что со всем этим делать.',
    activeHref: '/ru/ui/hero',
    extraHead: uiHead(),
    children: [
      p(
        'Hero-блок — это первое, что стоит на маркетинговой или документационной главной. Он рисует ',
        code('<section>'),
        ' с ',
        code('<h1>'),
        ' внутри, то есть является заголовком страницы, а не декоративным баннером, который просто большой.',
      ),

      h2('Простой hero'),
      demo(`hero({
  level: 2,
  title: 'Статические сайты — без фреймворка',
  description: 'Пишите функции, возвращающие HTML. Получайте готовый сайт.',
},
  button({ size: 'lg' }, 'Начать'),
  button({ size: 'lg', variant: 'outline', color: 'neutral' }, 'Читать документацию'),
)`, { align: 'stretch' }),

      h2('С надзаголовком'),
      p('Короткая строка над заголовком — версия, категория, объявление.'),
      demo(`hero({
  level: 2,
  eyebrow: 'sitelo 2.7',
  title: 'Теперь с библиотекой компонентов',
  description: 'Семьдесят компонентов, никакого рантайма, один необязательный скрипт.',
},
  button({ size: 'lg', href: '/ru/ui' }, 'Посмотреть компоненты'),
)`, { align: 'stretch' }),

      h2('С выравниванием влево'),
      demo(`hero({
  level: 2,
  align: 'start',
  eyebrow: 'Открытый код',
  title: 'Сделано в открытую',
  description: 'Лицензия MIT и достаточно маленький, чтобы прочитать за вечер.',
},
  button({ href: 'https://github.com/paul-browne/sitelo' }, 'Открыть на GitHub'),
)`, { align: 'stretch' }),

      h2('С медиа'),
      p(
        'Передача ',
        code('media'),
        ' переключает блок на две колонки, как только для них хватает места, и снова складывает в одну на узком экране. Естественно сочетается с ',
        code('mockup()'),
        '.',
      ),
      demo(`hero({
  level: 2,
  align: 'start',
  title: 'Посмотрите в деле',
  description: 'К моменту, когда страница доходит до браузера, это уже статический HTML.',
  media: mockup({ variant: 'browser', url: 'example.com' },
    div({ style: 'padding: 1.5rem; background: var(--su-surface-2)' },
      text({ variant: 'h5', as: 'div' }, 'Привет, мир'),
      text({ variant: 'small', tone: 'muted' }, 'Отрендерено на сборке.'),
    ),
  ),
},
  button('Начать'),
)`, { align: 'stretch' }),

      h2('Внутри контейнера'),
      p(
        'У hero-блока нет собственного ограничения ширины — положите его в ',
        code('container()'),
        ', чтобы он выровнялся со всем остальным на странице.',
      ),
      demo(`container({ size: 'md', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
  hero({
    level: 2,
    title: 'В контейнере',
    description: 'Контейнер задаёт ширину; hero задаёт ритм.',
  }),
)`, { align: 'stretch' }),

      h2('Уровень заголовка'),
      p(
        'По умолчанию заголовок — это ',
        code('<h1>'),
        ' страницы, что правильно для посадочной. Hero-блок посреди страницы заголовком страницы уже не является, поэтому понижайте его через ',
        code('level'),
        ' — так делает каждое демо здесь, ведь у страницы уже есть собственный h1.',
      ),

      h2('Только заголовок'),
      p('Каждая часть необязательна, и пустое не рисуется.'),
      demo(`hero({ level: 2, title: 'Документация' })`, { align: 'stretch' }),

      h2('Пропсы'),
      propsTable([
        ['eyebrow', 'Child', '', 'Маленькая строка прописными над заголовком.'],
        ['title', 'Child', '', 'Рендерится как h1 страницы.'],
        ['description', 'Child', '', 'Фраза под ним.'],
        ['media', 'Child', '', 'Рядом с текстом на широком экране, над ним — на узком.'],
        ['align', "'center' | 'start'", "'center'", 'Выравнивание текста, когда медиа нет.'],
        ['level', 'number', '1', 'Уровень заголовка. Понизьте для hero посреди страницы.'],
        ['as', 'string', "'section'", 'Какой элемент рендерить.'],
      ]),
      p('Потомки становятся строкой действий под описанием.'),
    ],
  })
