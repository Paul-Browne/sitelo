import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/ru.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Соотношение сторон',
    description:
      'Держит блок в заданной форме, чтобы при загрузке содержимого на странице ничего не прыгало.',
    activeHref: '/ru/ui/aspect-ratio',
    extraHead: uiHead(),
    children: [
      p(
        'Высота известна из ширины ещё до того, как что-либо загрузилось, поэтому опоздавшая картинка или встраивание не сдвигает остальную страницу вниз. Дочерний элемент заполняет блок и обрезается, а не обрастает полями.',
      ),

      h2('Простое соотношение'),
      demo(`aspectRatio({ ratio: '16 / 9', style: 'background: var(--su-surface-2)' },
  '<img src="/logo.svg" alt="" style="object-fit: contain; padding: 2rem">',
)`, { align: 'stretch' }),

      h2('Частые соотношения'),
      demo(`grid({ min: '9rem' },
  ...['16 / 9', '4 / 3', '1 / 1', '3 / 4'].map((ratio) =>
    stack({ gap: 'xs' },
      aspectRatio({ ratio, style: 'background: var(--su-surface-2); border-radius: 0.5rem' },
        '<img src="/logo.svg" alt="" style="object-fit: contain; padding: 1rem">'),
      text({ variant: 'caption', tone: 'muted', align: 'center' }, ratio),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Встраивания'),
      p(
        'Ради чего этот компонент и существует: у ',
        code('<iframe>'),
        ' нет собственного размера, поэтому без соотношения он схлопывается или требует жёстко заданной высоты.',
      ),
      demo(`aspectRatio({ ratio: '16 / 9', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
  '<div style="display: grid; place-items: center; color: var(--su-text-subtle)">здесь был бы &lt;iframe&gt;</div>',
)`, { align: 'stretch' }),

      h2('В карточке'),
      p(
        code('cardMedia()'),
        ' уже делает это в верхней части карточки. Берите ',
        code('aspectRatio()'),
        ', когда блок находится в другом месте.',
      ),
      demo(`grid({ min: '12rem' },
  card(
    cardMedia({ src: '/logo.svg', alt: '', style: 'background: var(--su-surface-2); object-fit: contain; padding: 1rem' }),
    cardBody(text({ variant: 'small' }, 'cardMedia — встроено')),
  ),
  card(
    cardBody(
      stack({ gap: 'sm' },
        aspectRatio({ ratio: '1 / 1', style: 'background: var(--su-surface-2); border-radius: 0.5rem' },
          '<img src="/logo.svg" alt="" style="object-fit: contain; padding: 1rem">'),
        text({ variant: 'small' }, 'aspectRatio — где угодно ещё'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Обрезка'),
      p(
        'Дочерний элемент растягивается на весь блок и обрезается по ',
        code('object-fit: cover'),
        '. Для того, что обрезать нельзя — логотипа, схемы — поставьте на него ',
        code('object-fit: contain'),
        ', как это делает каждое демо на этой странице.',
      ),

      h2('Пропсы'),
      propsTable([
        ['ratio', 'string', "'16 / 9'", 'Любое CSS-значение aspect-ratio.'],
        ['as', 'string', "'div'", 'Какой элемент рендерить.'],
      ]),
    ],
  })
