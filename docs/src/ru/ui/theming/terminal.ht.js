import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/ru.js'

export default () =>
  uiLayout({
    title: 'Terminal',
    description:
      'Системная консоль: один моноширинный шрифт на чёрном, панели в тонкую линию, подписи жирными прописными и голубой акцент, где всё выбранное показано инверсией.',
    activeHref: '/ru/ui/theming/terminal',
    extraHead: [presetPreviewHead('terminal')],
    children: [
      p(
        code('terminal'),
        ' — это системная консоль: один моноширинный шрифт на чёрном фоне, панели в тонкую линию с отбитой линейкой шапкой и каждая подпись — кнопка, название поля, вкладка, заголовок столбца — жирными разреженными прописными. Голубой — акцентный цвет: заголовки, названия панелей, сплошная кнопка, фокус и всё выбранное, которое показывается инверсией, тёмным по голубому, как терминал подсвечивает строку. Остальные палитры — его цвета состояний, зелёный, жёлтый и красный, и контурная кнопка или метка рисуется своим цветом — и линия, и текст. Ничего не скруглено и ничто не отбрасывает тени. Тёмный режим — исходный облик; светлый сохраняет каждую линию, каждую прописную и каждый прямой угол и печатает их чёрным по почти белому.',
      ),
      presetPreview('terminal'),

      h2('Как подключить'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Мой сайт'),
  styles({ preset: 'terminal' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/terminal-176ac9d8.css">`, 'javascript'),
      p(
        'Оформите в нём и саму страницу — её фон, цвет текста и шрифт, — и компоненты лягут на неё так же, как выше. Пресет использует JetBrains Mono, IBM Plex Mono или Source Code Pro, если страница загружает один из них, а иначе — системный моноширинный шрифт; сам он ничего не скачивает.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
  color: var(--su-text);
  font-family: var(--su-font-mono);
}`, 'css'),

      h2('Свои цвета'),
      p(
        code('theme()'),
        ' по-прежнему работает поверх, так что пресет — это отправная точка, а не форк: здесь акцент становится янтарным, как люминофор старого монитора. Два токена принадлежат самому пресету: ',
        code('--su-tm-tracking'),
        ' — разрядка подписей прописными, и ',
        code('--su-tm-track'),
        ' — жёлоб, по которому идёт индикатор прогресса или ползунок.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'terminal' }),
  theme(
    { primary: { base: '#8a5200', hover: '#734400', active: '#5c3600', soft: '#f6e6cc', softFg: '#4d2e00' } },
    { dark: { primary: { base: '#ffb000', hover: '#ffd480', active: '#e69e00', soft: '#33260d', softFg: '#ffd480' } } },
  ),
)`, 'javascript'),
    ],
  })
