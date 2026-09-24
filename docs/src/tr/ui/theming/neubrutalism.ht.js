import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Neobrütalizm',
    description:
      'Düz renkler, kalın mürekkep çizgileri ve sert gölgeler: her bileşen çerçeveli ve basıldığında kendi gölgesine gömülüyor.',
    activeHref: '/tr/ui/theming/neubrutalism',
    extraHead: [presetPreviewHead('neubrutalism')],
    children: [
      p(
        code('neubrutalism'),
        ' düz renk ve kalın mürekkeptir: her yüzeyin bir çerçevesi vardır ve sayfadan kalkan her şey bulanıklığı olmayan sert bir gölge düşürür. Bir denetime basmak onu kendi gölgesine gömer; açık bir geçiş düğmesi de orada kalır. Yumuşak dolgular üzerinde koyu metin taşıyan canlı pastellerdir, dolgulu olanlar beyaz bir etiketi taşıyacak kadar koyu kalır ve koyu kipte mürekkep krem rengine döner, çünkü koyu bir sayfada siyah bir gölge görünmezdi.',
      ),
      presetPreview('neubrutalism'),

      h2('Kullanım'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Sitem'),
  styles({ preset: 'neubrutalism' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/neubrutalism-3f1a9c42.css">`, 'javascript'),
      p(
        'Sayfanın kendisini de ',
        code('var(--su-bg)'),
        ' ile boyayın; hazır ayarın krem rengini alır ve beyaz yüzeyler onun üzerinde öne çıkar.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
}`, 'css'),

      h2('Kendi renkleriniz'),
      p(
        code('theme()'),
        ' üstünde çalışmayı sürdürür, yani bir hazır ayar bir çatal değil, bir başlangıç noktasıdır. Bu hazır ayar kendine ait iki belirteç ekler: ',
        code('--su-nb-ink'),
        ', her çizginin ve gölgenin çizildiği renk, ve ',
        code('--su-nb-lift'),
        ', kabarık bir denetimin sayfadan ne kadar uzakta durduğu, dolayısıyla bir basışın onu ne kadar kaydırdığı.',
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
