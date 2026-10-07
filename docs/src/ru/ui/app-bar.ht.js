import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/ru.js'

export default () =>
  uiLayout({
    title: 'Панель приложения',
    description:
      'Полоса в верхней части сайта: марка с одной стороны, навигация и действия с другой.',
    activeHref: '/ru/ui/app-bar',
    children: [
      p(
        'Панель приложения — это ',
        code('<header>'),
        ' со строкой внутри. Части разделены, чтобы вы могли их расставить: ',
        code('appBarNav()'),
        ' для ссылок, ',
        code('appBarSpacer()'),
        ', чтобы отодвинуть всё следующее к дальнему краю, и ',
        code('appBarActions()'),
        ' для кнопок в конце.',
      ),

      h2('Простая панель'),
      demo(`appBar({ brand: 'sitelo' },
  appBarSpacer(),
  appBarActions(
    button({ size: 'sm', variant: 'soft' }, 'Войти'),
  ),
)`, { align: 'stretch' }),

      h2('С навигацией'),
      p(
        code('navLink()'),
        ' — стиль ссылки для панели; ',
        code('current'),
        ' помечает активную страницу не только цветом, но и ',
        code('aria-current'),
        '.',
      ),
      demo(`appBar({ brand: 'sitelo' },
  appBarNav(
    navLink({ href: '#docs', current: true }, 'Документация'),
    navLink({ href: '#ui' }, 'UI'),
    navLink({ href: '#examples' }, 'Примеры'),
  ),
  appBarSpacer(),
  appBarActions(
    button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'GitHub'),
    button({ size: 'sm' }, 'Начать'),
  ),
)`, { align: 'stretch' }),

      h2('Марка со знаком'),
      p(
        'Марка принимает любую разметку и ведёт на ',
        code('/'),
        ', если ',
        code('href'),
        ' не говорит иначе.',
      ),
      demo(`appBar({
  href: '#home',
  brand: stack({ direction: 'row', gap: 'sm', inline: true, align: 'center' },
    avatar({ name: 'S', size: 'sm', square: true, color: 'primary' }),
    'sitelo',
  ),
},
  appBarSpacer(),
  appBarActions(chip({ size: 'sm', color: 'neutral' }, 'v2.6.3')),
)`, { align: 'stretch' }),

      h2('Липкая и размытая'),
      p(
        code('sticky'),
        ' прикрепляет панель к верху контейнера прокрутки; ',
        code('blur'),
        ' делает её полупрозрачной, чтобы содержимое проходило под ней. Здесь показано и то и другое внутри прокручиваемого блока, а не на самой странице.',
      ),
      demo(`div({ style: 'height: 12rem; overflow: auto; border: 1px solid var(--su-border); border-radius: 0.6rem' },
  appBar({ brand: 'sitelo', sticky: true, blur: true },
    appBarSpacer(),
    appBarActions(chip({ size: 'sm', color: 'primary' }, 'sticky')),
  ),
  container({ size: 'sm', style: 'padding-block: 1rem' },
    stack({ gap: 'md' },
      ...Array.from({ length: 6 }, (unused, index) =>
        text({ variant: 'small', tone: 'muted' }, 'Прокрутите меня — абзац ' + (index + 1) + '.'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Уходит с дороги при прокрутке'),
      p(
        code("sticky: 'auto'"),
        ' держит панель прикреплённой, но убирает её, пока страница прокручивается вниз, и возвращает, как только она прокручивается вверх или доходит до начала. Панель остаётся на месте, пока в ней фокус клавиатуры или открыто её меню.',
      ),
      p(
        'В Chromium это чистый CSS, ',
        code('@container scroll-state(scrolled)'),
        ', и ничего не загружается. Остальные браузеры при загрузке страницы получают небольшой модуль, который вместо этого следит за прокруткой. Панель следует за страницей; в собственном прокручиваемом блоке, как этот, задайте блоку ещё и ',
        code('container-type: scroll-state'),
        '.',
      ),
      demo(`div({ style: 'height: 12rem; overflow: auto; container-type: scroll-state; border: 1px solid var(--su-border); border-radius: 0.6rem' },
  appBar({ brand: 'sitelo', sticky: 'auto', blur: true },
    appBarSpacer(),
    appBarActions(chip({ size: 'sm', color: 'primary' }, 'auto')),
  ),
  container({ size: 'sm', style: 'padding-block: 1rem' },
    stack({ gap: 'md' },
      ...Array.from({ length: 12 }, (unused, index) =>
        text({ variant: 'small', tone: 'muted' }, 'Прокрутите вниз, потом обратно — абзац ' + (index + 1) + '.'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('С боковой панелью на узких экранах'),
      p(
        'Обычный приём: ссылки в панели на десктопе и кнопка, открывающая ',
        code('drawer()'),
        ' на телефоне. Боковая панель — это <dialog>, который кнопка открывает через command, так что скрипт не нужен.',
      ),
      demo(`fragment(
  appBar({ brand: 'sitelo' },
    appBarSpacer(),
    appBarActions(
      themeToggle(),
      iconButton({
        label: 'Открыть навигацию',
        variant: 'ghost',
        color: 'neutral',
        commandfor: 'app-bar-drawer', command: 'show-modal',
        icon: icon('menu'),
      }),
    ),
  ),
  drawer({ id: 'app-bar-drawer', title: 'Навигация' },
    navLink({ href: '#docs' }, 'Документация'),
    navLink({ href: '#ui' }, 'UI'),
    navLink({ href: '#examples' }, 'Примеры'),
  ),
)`, { align: 'stretch' }),

      h2('Пропсы'),
      p(code('appBar()'), ':'),
      propsTable([
        ['brand', 'Child', '', 'Содержимое ссылки-марки в начале.'],
        ['href', 'string', "'/'", 'Куда ведёт марка.'],
        ['sticky', "boolean | 'auto'", 'false', "Прикрепляет панель к верху при прокрутке. 'auto' ещё и прячет её при прокрутке вниз."],
        ['blur', 'boolean', 'false', 'Полупрозрачный фон с размытием под ним.'],
        ['as', 'string', "'header'", 'Какой элемент рендерить.'],
      ]),
      p('Части:'),
      propsTable([
        ['appBarNav', '', '', 'Элемент nav, в котором лежат ссылки.'],
        ['appBarSpacer', '', '', 'Гибкий пробел; всё после него уходит к дальнему краю.'],
        ['appBarActions', '', '', 'Группа кнопок в конце.'],
        ['navLink', 'href, current, color', '', 'Ссылка в стиле панели; current помечает активную страницу.'],
      ], { headers: ['Часть', 'Пропсы', 'По умолчанию', 'Описание'] }),
    ],
  })
