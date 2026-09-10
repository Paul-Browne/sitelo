import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/ru.js'

export default () =>
  uiLayout({
    title: 'Пустое состояние',
    description:
      'Как выглядит список до того, как в нём что-то появится.',
    activeHref: '/ru/ui/empty',
    children: [
      p(
        'Пустое место читается как баг. Пустое состояние говорит, какое место пусто, почему и что делать дальше, — и это тот случай, о котором забывают проще всего, ведь при разработке данные есть всегда.',
      ),

      h2('Простое пустое состояние'),
      demo(`empty({
  title: 'Постов пока нет',
  description: 'Добавьте Markdown-файл в src/posts, и он появится здесь.',
})`, { align: 'stretch' }),

      h2('С иконкой'),
      p(
        'Иконка декоративна: она помечена ',
        code('aria-hidden'),
        ', потому что заголовок уже говорит, что происходит.',
      ),
      demo(`empty({
  icon: icon('folder'),
  title: 'Здесь ничего нет',
  description: 'В этой папке нет ни одной страницы.',
})`, { align: 'stretch' }),

      h2('С действием'),
      p('Потомки становятся строкой действий.'),
      demo(`empty({
  icon: icon('search'),
  title: 'Ничего не найдено по запросу «острова»',
  description: 'Проверьте написание или просто полистайте документацию.',
},
  button({ href: '/ru/docs' }, 'Открыть документацию'),
  button({ variant: 'outline', color: 'neutral' }, 'Очистить поиск'),
)`, { align: 'stretch' }),

      h2('В карточке'),
      demo(`card(
  cardHeader({ title: 'Развёртывания' }),
  cardBody(
    empty({
      title: 'Развёртываний пока нет',
      description: 'Запушьте в main, и первая сборка появится здесь.',
    }, button({ size: 'sm' }, 'Подключить репозиторий')),
  ),
)`, { align: 'stretch' }),

      h2('Вместо таблицы'),
      p(
        'Замените таблицу пустым состоянием, вместо того чтобы рисовать шапку без единой строки под ней.',
      ),
      demo(`return (() => {
  const rows = []

  return card(
    cardHeader({ title: 'История сборок' }),
    rows.length
      ? table({ columns: [{ key: 'commit', header: 'Коммит' }], rows })
      : cardBody(empty({
          title: 'Сборок не записано',
          description: 'Запуски появятся здесь, как только сайт развернут хотя бы раз.',
        })),
  )
})()`, { align: 'stretch' }),

      h2('Пропсы'),
      propsTable([
        ['icon', 'Child', '', 'Декоративный значок над заголовком; скрыт от скринридеров.'],
        ['title', 'Child', '', 'Что именно пусто, в двух словах.'],
        ['description', 'Child', '', 'Почему пусто или что с этим делать.'],
      ]),
      p('Потомки рисуются как строка действий под описанием.'),
    ],
  })
