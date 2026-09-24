import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Superneon',
    description:
      'Neredeyse siyah mor, kıl inceliğinde kenarlar ve neon ışık: parlayan bir çerçeveye sahip koyu hap düğmeler ve yukarıdan aydınlatılmış başlıklar.',
    activeHref: '/tr/ui/theming/superneon',
    extraHead: [presetPreviewHead('superneon')],
    children: [
      p(
        code('superneon'),
        ' neredeyse siyah bir mor, kıl inceliğinde kenarlar ve içeriden gelen bir ışıktır. Dolgulu bir düğme koyu bir haptır; iç kenarları boyunca aydınlanır ve çerçevesinin ötesine taşan bir degradeyle çevrilidir. Büyük başlıklar açıktan lavantaya geçer; seçilen ya da açılan her şey bir hale kazanır. Parıltı hep yalnızca süstür, bu yüzden her etiket yine WCAG AA’yı karşılayan düz bir rengin üzerinde durur. Koyu kip özgün görünümdür; açık kip koyu hapları ve parıltıyı korur, onları soluk lavanta bir sayfaya yerleştirir.',
      ),
      presetPreview('superneon'),

      h2('Kullanım'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Sitem'),
  styles({ preset: 'superneon' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/superneon-5b0e7d21.css">`, 'javascript'),
      p(
        'Sayfayı ',
        code('var(--su-sn-backdrop)'),
        ' ile boyayarak hazır ayarın zeminine yukarıdan düşen mor bir ışık katın ya da düz ',
        code('var(--su-bg)'),
        ' kullanın. Başlıklar sayfa yüklüyorsa Geist’i, yüklemiyorsa sistem yazı tipini kullanır; hazır ayar hiçbir şey indirmez.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-sn-backdrop);
}`, 'css'),

      h2('Kendi renkleriniz'),
      p(
        code('theme()'),
        ' üstünde çalışmayı sürdürür, yani bir hazır ayar bir çatal değil, bir başlangıç noktasıdır. Bu hazır ayar her palete iki yuva daha ekler: ',
        code('glow'),
        ' ve ',
        code('glowEnd'),
        '; çerçevesinin ve halesinin çizildiği degradenin iki ucu. Bir parıltının üzerinde hiçbir şey okunmaz, bu yüzden istediğiniz kadar parlak olabilirler.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'superneon' }),
  theme({
    primary: { glow: '#00e5ff', glowEnd: '#7f6bff' },
  }),
)`, 'javascript'),
    ],
  })
