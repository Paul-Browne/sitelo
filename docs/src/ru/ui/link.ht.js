import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/ru.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Ссылка',
    description:
      'Оформленный якорь с теми атрибутами безопасности, которые нужны внешней ссылке.',
    activeHref: '/ru/ui/link',
    extraHead: uiHead(),
    children: [
      p(
        'Ссылка — это якорь с подчёркиванием и палитрой этой библиотеки. Она экспортируется под двумя именами — ',
        code('link'),
        ' и ',
        code('textLink'),
        ', — потому что ',
        code('link'),
        ' это ещё и элемент ',
        code('<link>'),
        ' из javascript-to-html, а импортировать оба под одним именем — синтаксическая ошибка. Берите ',
        code('textLink'),
        ' или импортируйте библиотеку как пространство имён.',
      ),

      h2('Простая ссылка'),
      demo(`text('Чтобы начать, прочитайте ', link({ href: '/ru/docs' }, 'документацию'), '.')`, {
        align: 'stretch',
      }),

      h2('Цвета'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  link({ href: '#', color: 'primary' }, 'Primary'),
  link({ href: '#', color: 'neutral' }, 'Neutral'),
  link({ href: '#', color: 'success' }, 'Success'),
  link({ href: '#', color: 'warning' }, 'Warning'),
  link({ href: '#', color: 'danger' }, 'Danger'),
)`),

      h2('Приглушённая'),
      p(
        'Приглушённая ссылка наследует окружающий цвет и показывает подчёркивание только при наведении — для списков ссылок, где подчёркивание в каждой строке было бы шумом.',
      ),
      demo(`stack({ gap: 'xs' },
  link({ href: '/ru/docs/routing', subtle: true }, 'Маршрутизация'),
  link({ href: '/ru/docs/data', subtle: true }, 'Загрузка данных'),
  link({ href: '/ru/docs/assets', subtle: true }, 'Ресурсы и стили'),
)`, { align: 'stretch' }),

      h2('Внешние ссылки'),
      p(
        code('external'),
        ' добавляет ',
        code('target="_blank"'),
        ' и тот ',
        code('rel'),
        ', который обязан идти вместе с ним. Скажите в тексте ссылки, что она откроет новую вкладку, или добавьте визуально скрытую пометку: новая вкладка без предупреждения дезориентирует.',
      ),
      demo(`text(
  'Библиотека лежит на ',
  link({ href: 'https://www.npmjs.com/package/sitelo', external: true },
    'npm',
    visuallyHidden(' (откроется в новой вкладке)'),
  ),
  '.',
)`, { align: 'stretch' }),

      h2('В абзаце'),
      demo(`text({ variant: 'lead' },
  'sitelo построен на ',
  link({ href: 'https://vite.dev', external: true }, 'Vite'),
  ', рендерит через ',
  link({ href: 'https://ht.js.org', external: true }, 'javascript-to-html'),
  ' и не отправляет в браузер ничего, пока вы сами об этом не попросите.',
)`, { align: 'stretch' }),

      h2('Когда лучше кнопка'),
      p(
        'Ссылка ведёт куда-то, кнопка выполняет действие. Если элемент меняет состояние на странице, а не уводит читателя, это должна быть ',
        code('button()'),
        '; а если он всё-таки ведёт, но должен выглядеть кнопкой, дайте ',
        code('button()'),
        ' проп ',
        code('href'),
        ' — под капотом отрисуется якорь.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center', wrap: true },
  link({ href: '/ru/docs' }, 'Ссылка, которая ведёт'),
  button({ href: '/ru/docs', variant: 'outline' }, 'Ссылка, похожая на кнопку'),
  button({ variant: 'link' }, 'Кнопка, похожая на ссылку'),
)`),

      h2('Пропсы'),
      propsTable([
        ['href', 'string', '', 'Куда ведёт.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Из какой палитры брать цвета.'],
        ['subtle', 'boolean', 'false', 'Наследует окружающий цвет; подчёркивание только при наведении.'],
        ['external', 'boolean', 'false', 'Добавляет target="_blank" и rel="noopener noreferrer".'],
      ]),
    ],
  })
