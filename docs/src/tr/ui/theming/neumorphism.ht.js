import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Neumorfizm',
    description:
      'Soft UI: her bileşen yalnızca ışık ve gölgeyle sayfadan kabarık ya da içine bastırılmış.',
    activeHref: '/tr/ui/theming/neumorphism',
    extraHead: [presetPreviewHead('neumorphism')],
    children: [
      p(
        code('neumorphism'),
        ' bir soft UI’dır: her yüzey sayfanın kendisidir ve bir denetim yalnızca ışık ve gölgeyle öne çıkar — sayfadan kabarık ya da içine bastırılmış olarak. Bu tarzın genellikle vazgeçtiği iki şeyi korur, WCAG AA’yı geçen metni ve odak çerçevesini; koyu kipi de her şey gibi izler. Ancak sayfanın kendi arka planının ',
        code('var(--su-bg)'),
        ' olmasını gerektirir, çünkü etki ikisinin aynı renk olmasına dayanır.',
      ),
      presetPreview('neumorphism'),

      h2('Kullanım'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Sitem'),
  styles({ preset: 'neumorphism' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/neumorphism-5d0e7b91.css">`, 'javascript'),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
}`, 'css'),

      h2('Kendi renkleriniz'),
      p(
        code('theme()'),
        ' üstünde çalışmayı sürdürür, yani bir hazır ayar bir çatal değil, bir başlangıç noktasıdır. Bu hazır ayar her palete onuncu bir yuva ekler, ',
        code('glow'),
        ' — bir ilerleme çubuğunun ya da anahtarın ucunda eridiği renk — böylece yeni bir birincil renk kendi rengini getirebilir.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'neumorphism' }),
  theme({
    primary: { base: '#7c3aed', hover: '#6d28d9', active: '#5b21b6', glow: '#e879f9' },
  }),
)`, 'javascript'),
    ],
  })
