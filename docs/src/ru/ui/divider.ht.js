import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/ru.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Разделитель',
    description:
      'Линия между разделами, с подписью посередине или без неё.',
    activeHref: '/ru/ui/divider',
    extraHead: uiHead(),
    children: [
      p(
        'Разделитель отделяет группы содержимого. Он рисует элемент с ',
        code('role="separator"'),
        ', а не ',
        code('<hr>'),
        ', потому что подпись помещается внутрь, а ',
        code('<hr>'),
        ' потомков не принимает.',
      ),

      h2('Простой разделитель'),
      demo(`stack({ gap: 'none' },
  text({ tone: 'muted' }, 'Всё, что сверху.'),
  divider(),
  text({ tone: 'muted' }, 'Всё, что снизу.'),
)`, { align: 'stretch' }),

      h2('С подписью'),
      p('Потомки становятся подписью, центрированной в линии.'),
      demo(`stack({ gap: 'none' },
  button({ variant: 'outline', color: 'neutral', block: true }, 'Продолжить через GitHub'),
  divider('или'),
  button({ block: true }, 'Продолжить по почте'),
)`, { align: 'stretch' }),

      h2('Интервалы'),
      p(
        code('spacing'),
        ' задаёт отступ сверху и снизу — из той же шкалы, что и всё остальное.',
      ),
      demo(`stack({ gap: 'none' },
  text({ variant: 'small', tone: 'muted' }, 'Плотно'),
  divider({ spacing: 'xs' }),
  text({ variant: 'small', tone: 'muted' }, 'По умолчанию'),
  divider(),
  text({ variant: 'small', tone: 'muted' }, 'Просторно'),
  divider({ spacing: 'xl' }),
  text({ variant: 'small', tone: 'muted' }, 'Конец'),
)`, { align: 'stretch' }),

      h2('Вертикально'),
      p(
        'Вертикальному разделителю нужен родитель, задающий высоту, — flex-строка, элементы которой растягиваются, а это ',
        code('stack()'),
        ' и делает по умолчанию.',
      ),
      demo(`stack({ direction: 'row', gap: 'none', align: 'stretch' },
  text({ variant: 'small' }, '4,1 кБ'),
  divider({ orientation: 'vertical' }),
  text({ variant: 'small' }, '12 страниц'),
  divider({ orientation: 'vertical' }),
  text({ variant: 'small' }, '0 островов'),
)`),

      h2('Пропсы'),
      propsTable([
        ['orientation', "'horizontal' | 'vertical'", "'horizontal'", 'В какую сторону идёт линия.'],
        ['spacing', 'Space', "'md'", 'Отступ по обе стороны линии.'],
      ]),
    ],
  })
