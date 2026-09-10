import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/ru.js'

export default () =>
  uiLayout({
    title: 'Контейнер',
    description:
      'Центрированная колонка с ограниченной шириной — самая внешняя обёртка почти на любой странице.',
    activeHref: '/ru/ui/container',
    children: [
      p(
        'Контейнер центрирует содержимое, ограничивает ширину, чтобы строки текста оставались читаемыми, и держит поле, чтобы на телефоне ничто не упиралось в край экрана. Обычно он идёт первым внутри ',
        code('body()'),
        '.',
      ),

      h2('Простой контейнер'),
      demo(`container(
  text({ variant: 'lead' }, 'Всё внутри остаётся по центру и перестаёт расти на пределе ширины.'),
)`, { align: 'stretch' }),

      h2('Размеры'),
      p(
        'Пять ступеней — от одной читаемой колонки до полного отсутствия ограничения. ',
        code('sm'),
        ' это примерно 40rem, та самая ширина, которую любит текст.',
      ),
      demo(`stack({ gap: 'sm' },
  container({ size: 'sm', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
    text({ variant: 'small', align: 'center' }, 'sm — 40rem'),
  ),
  container({ size: 'md', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
    text({ variant: 'small', align: 'center' }, 'md — 56rem'),
  ),
  container({ size: 'lg', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
    text({ variant: 'small', align: 'center' }, 'lg — 72rem (по умолчанию)'),
  ),
)`, { align: 'stretch' }),

      h2('Своя ширина'),
      p(
        code('width'),
        ' принимает любую CSS-длину и перебивает ',
        code('size'),
        ' — для той единственной страницы, которой нужно то, чего в шкале нет.',
      ),
      demo(`container({ width: '30rem', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
  text({ variant: 'small', align: 'center' }, 'width: 30rem'),
)`, { align: 'stretch' }),

      h2('Боковое поле'),
      p(
        'Боковое поле — это отступ, который держится между содержимым и краем окна. Оно принимает токен интервала, число единиц интервала или обычную длину.',
      ),
      demo(`container({ size: 'sm', gutter: 'xl', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
  text({ variant: 'small' }, 'Более широкое поле — для страницы, содержимое которой на планшете не должно доходить до края.'),
)`, { align: 'stretch' }),

      h2('Как другой элемент'),
      p(
        code('as'),
        ' меняет тег, не трогая всё остальное, — удобно, когда контейнер заодно является ',
        code('<main>'),
        ' страницы или ',
        code('<section>'),
        '.',
      ),
      demo(`container({ as: 'main', size: 'md' },
  heading({ level: 2, size: 'h4' }, 'Элемент main'),
  text({ tone: 'muted' }, 'Та же раскладка, правильный ориентир.'),
)`, { align: 'stretch' }),

      h2('Пропсы'),
      propsTable([
        ['size', "'sm' | 'md' | 'lg' | 'xl' | 'full'", "'lg'", 'Какое ограничение ширины применить.'],
        ['width', 'string', '', 'Обычный max-width, перебивающий size.'],
        ['gutter', 'Space', "'md'", 'Внутренний отступ, удерживаемый от края окна.'],
        ['as', 'string', "'div'", 'Какой элемент рендерить, например main или section.'],
      ]),
    ],
  })
