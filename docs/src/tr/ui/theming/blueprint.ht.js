import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Teknik çizim',
    description:
      'Bir teknik çizim: ince çizgiler, keskin köşeler ve hizalama işaretleri, eş aralıklı büyük harflerle etiketler ve tek bir ozalit mavisiyle mürekkep.',
    activeHref: '/tr/ui/theming/blueprint',
    extraHead: [presetPreviewHead('blueprint')],
    children: [
      p(
        code('blueprint'),
        ' bir teknik çizimdir: neredeyse siyah bir pafta üzerinde ince çizgiler, keskin köşeler ve bir kartın, bir iletişim kutusunun ve bir istatistik satırının her köşesinde bir hizalama işareti — küçük bir artı. Bir şeyi adlandıran ya da çalıştıran her şey — bir düğme, bir alanın etiketi, bir sekme, bir etiket, bir sütun başlığı, çubuktaki bir bağlantı — eş aralıklı bir yazı tipiyle, aralıklı büyük harflerle dizilir; başlıklar ve akan metin ise sıkı dizilmiş bir grotesk yazı tipinde kalır. Düz çizgi bir kenardır, kesikli çizgi ise içindekini böler, tıpkı bir çizimin görünmeyen bir kenarı işaretlemesi gibi: bir tablonun satırları, bir ayırıcı, henüz gelmemiş bir adıma giden yol. Az renkle yetinir. Dolu düğme, işaretli bir kutu, dolu bir çubuk ve seçilen her şey mürekkeptir, ters basılır; tek bir ozalit mavisi odağı ve bir başlığın üstündeki etiketi işaretler; başarı, uyarı ve tehlike söyledikleri şey için kendi renklerini korur. Hiçbir şey gölge düşürmez. Koyu kip özgün görünümdür; açık kip her çizgiyi ve her işareti korur ve onları beyaz kâğıda mürekkeple basar.',
      ),
      presetPreview('blueprint'),

      h2('Kullanım'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Sitem'),
  styles({ preset: 'blueprint' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/blueprint-4d1f8a20.css">`, 'javascript'),
      p(
        'Sayfayı ',
        code('var(--su-bp-backdrop)'),
        ' ile boyayın; hazır ayarın zeminini, üzerine çekilmiş soluk bir ızgarayla birlikte elde edersiniz. Ya da yalnızca ',
        code('var(--su-bg)'),
        ' kullanın. Hazır ayar, sayfa yüklüyorsa Geist ya da Inter ile Geist Mono, JetBrains Mono ya da IBM Plex Mono’yu, yüklemiyorsa sistemin kendi yazı tiplerini kullanır; kendisi hiçbir şey indirmez.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bp-backdrop);
  color: var(--su-text);
  font-family: var(--su-font-sans);
}`, 'css'),

      h2('Kendi renkleriniz'),
      p(
        code('theme()'),
        ' üstünde çalışmayı sürdürür, yani bir hazır ayar bir çatal değil, bir başlangıç noktasıdır. Birincil palet mürekkeptir — dolu düğme, işaretli bir kutu, dolu bir çubuk, seçilen her şey — bu yüzden ',
        code('primary'),
        ' hepsini bir kerede yeniden renklendirir. Gerisi hazır ayarın kendi belirteçleridir: ',
        code('--su-bp-accent'),
        ', odağı çizen ve bir başlığı işaretleyen mavi; ',
        code('--su-bp-mark'),
        ', ',
        code('transparent'),
        ' ile kaldırılabilen hizalama işaretleri; ',
        code('--su-bp-field'),
        ', bir alanın çevresindeki çizgi; ',
        code('--su-bp-track'),
        ', bir ilerleme çubuğunun içinde ilerlediği oluk; ',
        code('--su-bp-grid'),
        ' ve ',
        code('--su-bp-cell'),
        ', zeminin çizgileri ve karelerinin boyutu; ve ',
        code('--su-bp-tracking'),
        ', bir etiketin büyük harfleri arasındaki aralık. Burada mavi bir sinyal turuncusuna döner, işaretler de onunla birlikte.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'blueprint' }),
  theme(
    { bpAccent: '#c2410c', bpMark: '#c2410c' },
    { dark: { bpAccent: '#ff7a3d', bpMark: '#ff7a3d' } },
  ),
)`, 'javascript'),
    ],
  })
