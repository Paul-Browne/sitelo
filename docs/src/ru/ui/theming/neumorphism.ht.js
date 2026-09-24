import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/ru.js'

export default () =>
  uiLayout({
    title: 'Неоморфизм',
    description:
      'Soft UI: каждый компонент приподнят над страницей или вдавлен в неё — только светом и тенью.',
    activeHref: '/ru/ui/theming/neumorphism',
    extraHead: [presetPreviewHead('neumorphism')],
    children: [
      p(
        code('neumorphism'),
        ' — это soft UI: любая поверхность и есть сама страница, а элемент управления выделяется только светом и тенью, приподнятый над страницей или вдавленный в неё. Пресет сохраняет то, чем этот стиль обычно жертвует, — текст, проходящий WCAG AA, и рамку фокуса — и следует тёмной теме, как и всё остальное. Но фоном самой страницы должен быть ',
        code('var(--su-bg)'),
        ': весь эффект держится на том, что у них один цвет.',
      ),
      presetPreview('neumorphism'),

      h2('Как подключить'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Мой сайт'),
  styles({ preset: 'neumorphism' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/neumorphism-5d0e7b91.css">`, 'javascript'),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
}`, 'css'),

      h2('Свои цвета'),
      p(
        code('theme()'),
        ' по-прежнему работает поверх, так что пресет — это отправная точка, а не форк. Этот добавляет в каждую палитру десятый слот, ',
        code('glow'),
        ' — цвет, в который уходит конец полосы прогресса или переключателя, — чтобы новый основной цвет мог принести свой.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'neumorphism' }),
  theme({
    primary: { base: '#7c3aed', hover: '#6d28d9', active: '#5b21b6', glow: '#e879f9' },
  }),
)`, 'javascript'),
    ],
  })
