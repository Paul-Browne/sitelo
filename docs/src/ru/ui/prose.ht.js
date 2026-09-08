import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/ru.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Проза',
    description:
      'Оформляет блок HTML, который писали не вы: вывод Markdown, поле из CMS, описание в RSS.',
    activeHref: '/ru/ui/prose',
    extraHead: uiHead(),
    children: [
      p(
        'Markdown-рендерер возвращает голые теги: ',
        code('<h2>'),
        ', ',
        code('<p>'),
        ', ',
        code('<ul>'),
        ', ',
        code('<blockquote>'),
        ' — и ни одного класса, за который можно зацепиться. ',
        code('prose()'),
        ' оборачивает этот HTML и оформляет его.',
      ),
      p(
        'Это единственное сознательное исключение в библиотеке. Везде остальное оформление привязано к классам ',
        code('su-'),
        ' ровно затем, чтобы никогда не задевать разметку, на которую вы не подписывались; здесь целиться не во что, поэтому правила бьют по голым тегам — но только внутри обёртки.',
      ),

      h2('Простая проза'),
      demo(`prose(
  '<h2>Начало работы</h2>' +
  '<p>Напишите функцию, возвращающую HTML. Выполните <code>sitelo build</code>. Опубликуйте <code>dist/</code>.</p>' +
  '<ul><li>Файловая маршрутизация</li><li>Данные на сборке</li><li>Никакого клиентского рантайма</li></ul>'
)`, { align: 'stretch' }),

      h2('Всё, что она оформляет'),
      demo(`prose(
  '<h3>Заголовок</h3>' +
  '<p>Основной текст со <a href="/ru/docs">ссылкой</a>, <strong>полужирным</strong> и <code>кодом в строке</code>.</p>' +
  '<blockquote><p>Выносная цитата, отделённая от окружающего текста.</p></blockquote>' +
  '<ol><li>Первое</li><li>Второе<ul><li>Вложенное</li></ul></li></ol>' +
  '<pre><code>export default () => "&lt;h1&gt;Привет&lt;/h1&gt;"</code></pre>' +
  '<table><thead><tr><th>Опция</th><th>По умолчанию</th></tr></thead>' +
  '<tbody><tr><td>cleanUrls</td><td>true</td></tr><tr><td>outDir</td><td>dist</td></tr></tbody></table>' +
  '<hr>' +
  '<p>Нажмите <kbd>⌘</kbd> <kbd>K</kbd> для поиска.</p>'
)`, { align: 'stretch' }),

      h2('Размеры'),
      demo(`stack({ gap: 'lg' },
  prose({ size: 'sm' }, '<p><strong>Маленький</strong> — для описания в карточке или боковой панели.</p>'),
  prose('<p><strong>Средний</strong> — значение по умолчанию, для основного текста статьи.</p>'),
  prose({ size: 'lg' }, '<p><strong>Большой</strong> — для короткого заметного вступления.</p>'),
)`, { align: 'stretch' }),

      h2('С блогом на Markdown'),
      p(
        'Форма, которой хочет пример с блогом: отрендерить Markdown на сборке, обернуть результат и отдать.',
      ),
      codeBlock('src/blog/[slug].ht.js', `import { marked } from 'marked'
import { article, body, h1, html, head, title } from 'javascript-to-html'
import { container, prose, styles, text } from 'sitelo/ui'

export async function data({ params }) {
  return { post: await loadPost(params.slug) }
}

export default ({ data }) => html({ lang: 'ru' },
  head(title(data.post.title), styles()),
  body(
    container({ size: 'sm' },
      h1(data.post.title),
      text({ variant: 'caption' }, data.post.date),
      // marked возвращает строку HTML вообще без классов
      prose(marked.parse(data.post.markdown)),
    ),
  ),
)`, 'javascript'),

      h2('Компоненты внутри прозы'),
      p(
        'Каждое правило прозы исключает элементы с классом ',
        code('su-'),
        ', поэтому компонент, положенный в блок прозы, сохраняет собственное оформление, а не подхватывает отступы статьи.',
      ),
      demo(`prose(
  '<p>Немного отрендеренного Markdown, а затем компонент:</p>',
  alert({ color: 'warning', title: 'Всё ещё обычное уведомление' },
    'Окружающий блок прозы его не переоформляет.'),
  '<p>И снова проза.</p>',
)`, { align: 'stretch' }),

      h2('Пара слов о доверии'),
      p(
        code('prose()'),
        ' рендерит своих потомков как HTML — в этом весь смысл, и так работает ',
        code('javascript-to-html'),
        ' повсюду. Если HTML приходит оттуда, что вы не контролируете, очистите его до того, как он попадёт сюда. Markdown-рендерера с выключенным сырым HTML обычно хватает.',
      ),

      h2('Пропсы'),
      propsTable([
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Базовый кегль; всё остальное масштабируется от него в em.'],
        ['as', 'string', "'div'", 'Какой элемент рендерить, например article.'],
      ]),
    ],
  })
