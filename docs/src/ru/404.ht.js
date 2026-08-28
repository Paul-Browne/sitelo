import { a, p } from 'javascript-to-html'
import { code, pageLayout } from '../lib/ru.js'

export default () =>
  pageLayout({
    title: '404 — страница не найдена',
    description: 'Такой страницы не существует.',
    children: [
      p(
        'Здесь ничего нет. Возможно, страницу перенесли или ссылка устарела. ',
        '(Эта страница — ',
        code('src/ru/404.ht.js'),
        '; sitelo публикует её как ',
        code('dist/ru/404.html'),
        '.)',
      ),
      p(
        a({ href: '/ru' }, 'Главная'),
        ' · ',
        a({ href: '/ru/docs' }, 'Документация'),
        ' · ',
        a({ href: '/examples' }, 'Примеры'),
      ),
    ],
  })
