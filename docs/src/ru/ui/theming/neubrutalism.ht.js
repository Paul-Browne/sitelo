import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/ru.js'

export default () =>
  uiLayout({
    title: 'Необрутализм',
    description:
      'Плоский цвет, толстые чернильные линии и жёсткие тени: у каждого компонента контур, а при нажатии он утапливается в собственную тень.',
    activeHref: '/ru/ui/theming/neubrutalism',
    extraHead: [presetPreviewHead('neubrutalism')],
    children: [
      p(
        code('neubrutalism'),
        ' — это плоский цвет и толстые чернила: у каждой поверхности есть контур, а всё, что приподнято над страницей, отбрасывает жёсткую тень без размытия. Нажатие утапливает элемент в его собственную тень, а включённый переключатель там и остаётся. Мягкие заливки — яркие пастельные цвета с тёмным текстом, сплошные остаются достаточно тёмными для белой подписи, а в тёмной теме чернила становятся кремовыми: чёрная тень на тёмной странице была бы не видна.',
      ),
      presetPreview('neubrutalism'),

      h2('Как подключить'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Мой сайт'),
  styles({ preset: 'neubrutalism' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/neubrutalism-3f1a9c42.css">`, 'javascript'),
      p(
        'Залейте и саму страницу цветом ',
        code('var(--su-bg)'),
        ' — она станет кремовой, как в пресете, и белые поверхности будут на ней выделяться.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
}`, 'css'),

      h2('Свои цвета'),
      p(
        code('theme()'),
        ' по-прежнему работает поверх, так что пресет — это отправная точка, а не форк. Этот добавляет два собственных токена: ',
        code('--su-nb-ink'),
        ' — цвет, которым нарисованы все линии и тени, и ',
        code('--su-nb-lift'),
        ' — насколько приподнятый элемент отстоит от страницы, а значит, насколько его сдвигает нажатие.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'neubrutalism' }),
  theme({
    primary: { base: '#c2185b', hover: '#a8144e', active: '#8e1042', soft: '#ffb3d0', softFg: '#5c0a2a' },
    '--su-nb-lift': '6px',
  }),
)`, 'javascript'),
    ],
  })
