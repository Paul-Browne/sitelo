import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/ru.js'

export default () =>
  uiLayout({
    title: 'Superneon',
    description:
      'Почти чёрный фиолетовый, тончайшие края и неоновый свет: тёмные кнопки-таблетки со светящимся ободком и заголовки, освещённые сверху.',
    activeHref: '/ru/ui/theming/superneon',
    extraHead: [presetPreviewHead('superneon')],
    children: [
      p(
        code('superneon'),
        ' — это почти чёрный фиолетовый с тончайшими краями и светом, идущим изнутри. Сплошная кнопка — тёмная таблетка, подсвеченная по внутренним краям и обведённая градиентом, который светится за её контуром; крупные заголовки переходят от светлого к лавандовому, а всё выбранное или включённое получает ореол. Свечение — всегда лишь украшение, поэтому каждая подпись по-прежнему лежит на плоском цвете, проходящем WCAG AA. Тёмная тема — исходный облик; светлая сохраняет тёмные таблетки и свечение и кладёт их на бледно-лавандовую страницу.',
      ),
      presetPreview('superneon'),

      h2('Как подключить'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Мой сайт'),
  styles({ preset: 'superneon' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/superneon-5b0e7d21.css">`, 'javascript'),
      p(
        'Залейте страницу через ',
        code('var(--su-sn-backdrop)'),
        ' — получится фон пресета с фиолетовым светом, падающим сверху, — или просто через ',
        code('var(--su-bg)'),
        '. Заголовки используют Geist, если страница его загружает, а иначе системный шрифт: сам пресет ничего не скачивает.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-sn-backdrop);
}`, 'css'),

      h2('Свои цвета'),
      p(
        code('theme()'),
        ' по-прежнему работает поверх, так что пресет — это отправная точка, а не форк. Этот даёт каждой палитре ещё два слота, ',
        code('glow'),
        ' и ',
        code('glowEnd'),
        ', — два конца градиента, которым нарисованы её ободок и ореол. На свечении ничего не читают, так что они могут быть сколь угодно яркими.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'superneon' }),
  theme({
    primary: { glow: '#00e5ff', glowEnd: '#7f6bff' },
  }),
)`, 'javascript'),
    ],
  })
