import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/ru.js'

export default () =>
  uiLayout({
    title: 'Уведомление',
    description:
      'Сообщение о состоянии чего-либо: иконка и роль объявления следуют за цветом.',
    activeHref: '/ru/ui/alert',
    children: [
      p(
        'Уведомление сообщает читателю что-то о странице или о только что выполненном действии. Цвет выбирает сразу и иконку, и ARIA-роль: ',
        code('danger'),
        ' и ',
        code('warning'),
        ' объявляют себя как ',
        code('role="alert"'),
        ', всё, что спокойнее, — вежливый ',
        code('role="status"'),
        '.',
      ),

      h2('Цвета'),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'primary', title: 'Обратите внимание' }, 'Доступна новая версия sitelo.'),
  alert({ color: 'success', title: 'Развёрнуто' }, '169 страниц опубликованы за 1,7 секунды.'),
  alert({ color: 'warning', title: 'Медленная страница' }, 'Одна страница рендерилась дольше 500 мс.'),
  alert({ color: 'danger', title: 'Сборка не удалась' }, 'Две внутренние ссылки ведут на несуществующие страницы.'),
  alert({ color: 'neutral', title: 'Заметка' }, 'Острова в этом проекте отключены.'),
)`, { align: 'stretch' }),

      h2('Без заголовка'),
      p('Однострочному уведомлению заголовок над фразой не нужен.'),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'success' }, 'Сохранено.'),
  alert({ color: 'danger' }, 'Этот адрес почты уже занят.'),
)`, { align: 'stretch' }),

      h2('Варианты'),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'warning', variant: 'soft', title: 'Soft' }, 'Вариант по умолчанию — подкрашенная поверхность.'),
  alert({ color: 'warning', variant: 'outline', title: 'Outline' }, 'Прозрачный, с цветной рамкой.'),
  alert({ color: 'warning', variant: 'solid', title: 'Solid' }, 'Полный цвет палитры — для того, что нельзя пропустить.'),
)`, { align: 'stretch' }),

      h2('Иконки'),
      p(
        'У каждого цвета есть иконка по умолчанию. Передайте свою разметку в ',
        code('icon'),
        ' или ',
        code('icon: false'),
        ', чтобы иконки не было.',
      ),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'primary', icon: false, title: 'Без иконки' }, 'Только текст.'),
  alert({
    color: 'primary',
    title: 'Своя иконка',
    icon: icon('star'),
  }, 'Подойдёт любой SVG — иконки это разметка, а не зависимость.'),
)`, { align: 'stretch' }),

      h2('С кнопкой закрытия'),
      p('Кнопка закрытия несёт собственный обработчик:'),
      codeBlock(
        'Итоговая разметка',
        `onclick="import('/su/alert.js').then(m=>m.dismiss(this))"`,
        'html',
      ),
      p(
        'Поэтому уведомление ниже действительно закрывается, хотя эта страница ничего не импортирует. Если модуль так и не придёт, кнопка отрисуется и ничего не сделает — вот почему уведомление не должно быть единственным местом, где появляется сообщение.',
      ),
      demo(`alert({ color: 'primary', title: 'Закрывается', dismissible: true },
  'Нажмите × — обработчик подгрузит себя при первом нажатии.',
)`, { align: 'stretch' }),

      h2('Расширенное содержимое'),
      p('Уведомление принимает любых потомков, так что внутри может жить действие или список.'),
      demo(`alert({ color: 'danger', title: 'Проверка ссылок не прошла' },
  stack({ gap: 'sm' },
    text({ variant: 'small' }, 'Две ссылки ведут на страницы, которые не были сгенерированы:'),
    list({ plain: true },
      listItem({ title: '/docs/old-routing', description: 'ссылка со страницы /docs' }),
      listItem({ title: '/blog/draft', description: 'ссылка со страницы /blog' }),
    ),
    stack({ direction: 'row', gap: 'sm' },
      button({ size: 'sm', color: 'danger' }, 'Показать подробности'),
      button({ size: 'sm', variant: 'ghost', color: 'danger' }, 'Пропустить'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Пропсы'),
      propsTable([
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Задаёт палитру, иконку по умолчанию и ARIA-роль.'],
        ['variant', "'soft' | 'outline' | 'solid'", "'soft'", 'Насколько весомо выглядит уведомление.'],
        ['title', 'Child', '', 'Жирная первая строка.'],
        ['icon', 'Child | false', '', 'Своя разметка иконки или false, чтобы её не было.'],
        ['dismissible', 'boolean', 'false', 'Добавляет кнопку закрытия, которая импортирует свой обработчик.'],
        ['dismissLabel', 'string', "'Dismiss'", 'Доступное имя этой кнопки.'],
      ]),
    ],
  })
